"""
OceanX Virtual Ocean Observation & Autonomous Decision Simulator
Backend API & Telemetry Engine
Smart India Hackathon 2026 - Problem Statement 26065
Team: Coders May Cry (CMC)
"""

import os
import sys
import time
import math
import random
import threading
import json
from datetime import datetime
from flask import Flask, jsonify, request, Response

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.db import init_db, get_db_connection
from simulation.sensor_simulator import SensorSimulator
from simulation.anomaly_engine import AnomalyEngine
from simulation.fault_detector import FaultDetector
from simulation.energy_model import EnergyModel
from simulation.communication_simulator import CommunicationSimulator

app = Flask(__name__)

# Add global CORS headers to all responses
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,OPTIONS"
    return response

# Core State & Engine instances
simulator = SensorSimulator()
anomaly_engine = AnomalyEngine(window_size=30)
fault_detector = FaultDetector(sample_depth=8)
energy_model = EnergyModel(capacity_wh=256.0, initial_soc=84.5)
comm_sim = CommunicationSimulator()

# Mission State
mission_state = {
    "is_active": True,
    "is_paused": False,
    "mission_name": "Polar Southern Ocean Recon #001",
    "start_timestamp": time.time(),
    "elapsed_seconds": 0,
    "current_sampling_interval": 60, # 60s normal, 10s anomaly, 120s power-saving
    "previous_sampling_interval": 60,
    "sampling_change_reason": "Baseline operational sampling",
    "ai_decision": "MAINTAIN NORMAL OPERATION",
    "ai_environmental_state": "NORMAL",
    "overall_anomaly_score": 0.04,
    "position": {
        "latitude": -64.7742,
        "longitude": -63.5011,
        "location_name": "Antarctic Peninsula / Bellingshausen Sea",
        "heading": 142.5,
        "drift_speed_knots": 1.2
    },
    "current_depth": 45.0, # meters
    "active_scenario": "NORMAL OCEAN",
    "sih_demo_active": False,
    "sih_demo_step": 0
}

# In-memory latest readings cache for fast polling
latest_telemetry = {}
recent_events = []

def log_event(category: str, severity: str, message: str, metadata: dict = None):
    evt = {
        "id": len(recent_events) + 1,
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "category": category,
        "severity": severity,
        "message": message,
        "metadata": metadata or {}
    }
    recent_events.insert(0, evt)
    if len(recent_events) > 100:
        recent_events.pop()
    
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("""
            INSERT INTO mission_events (timestamp, category, severity, message, metadata)
            VALUES (?, ?, ?, ?, ?)
        """, (evt["timestamp"], category, severity, message, json.dumps(metadata or {})))
        conn.commit()
        conn.close()
    except Exception as e:
        print("Error saving event to db:", e)

# Background simulation worker thread
def simulation_worker():
    last_tick = time.time()
    last_sample_time = time.time()
    
    while True:
        time.sleep(1.0) # Tick every 1 second
        if not mission_state["is_active"] or mission_state["is_paused"]:
            continue
            
        now = time.time()
        dt = now - last_tick
        last_tick = now
        
        mission_state["elapsed_seconds"] += int(dt)
        simulator.step(dt=dt)
        
        # Simulated gentle geographical drift (Antarctic current)
        mission_state["position"]["latitude"] += (random.uniform(-0.00005, 0.00002) * dt)
        mission_state["position"]["longitude"] += (random.uniform(-0.00002, 0.00006) * dt)

        # Update energy model every tick
        is_transmitting = (comm_sim.link_status == "ONLINE")
        energy_status = energy_model.update(
            sampling_interval=mission_state["current_sampling_interval"],
            is_transmitting=is_transmitting,
            dt_seconds=dt
        )

        # Check if battery triggers energy-saving mode
        if energy_status["battery_pct"] < 25.0 and mission_state["current_sampling_interval"] < 120:
            mission_state["previous_sampling_interval"] = mission_state["current_sampling_interval"]
            mission_state["current_sampling_interval"] = 120
            mission_state["sampling_change_reason"] = "Low battery (<25%): Energy-Saving Mode activated to protect LiFePO4 cells"
            mission_state["ai_decision"] = "ENTER POWER SAVING MODE"
            log_event("ENERGY", "WARNING", "Battery dropped below 25%. Adaptive sampling reduced to 120s.")

        # Check if it is time to take a sensor acquisition cycle
        sampling_interval = mission_state["current_sampling_interval"]
        # In software simulation demo, we sample every few real-time seconds corresponding to simulated interval
        # (e.g. 10s mode updates every 1-2 real sec, 60s mode updates every 3 real sec for responsive UI)
        sample_period_seconds = 2.0 if sampling_interval <= 10 else (5.0 if sampling_interval <= 60 else 10.0)

        if now - last_sample_time >= sample_period_seconds:
            last_sample_time = now
            run_sensor_acquisition_cycle()

def run_sensor_acquisition_cycle():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM sensors WHERE enabled = 1")
    sensors = [dict(row) for row in c.fetchall()]
    conn.close()

    if not sensors:
        return

    # First pass: generate all raw readings
    raw_readings = {}
    for s in sensors:
        val = simulator.generate_reading(s)
        raw_readings[s["id"]] = val
        raw_readings[s["type"]] = val

    # Inform fault detector of ocean wave motion from IMU
    imu_val = raw_readings.get("imu_1", 0.0) or 0.0
    fault_detector.record_ambient_motion(imu_val, simulator.wave_height)

    # Second pass: Fault Detection & Anomaly Detection per sensor
    max_anomaly_score = 0.0
    anomaly_detected_sensors = []
    faulty_sensors = []
    all_readings_map = {}

    for s in sensors:
        sensor_id = s["id"]
        val = raw_readings.get(sensor_id)
        
        # Check for Sensor Fault first
        fault_eval = fault_detector.evaluate_health(s, val, raw_readings)
        
        if fault_eval["is_fault"]:
            health_status = fault_eval["health"]
            anom_eval = {
                "score": 0.0, # Do not raise environmental alarm on hardware failure
                "status": "FAULT",
                "classification": "SENSOR FAULT",
                "reason": fault_eval["diagnostic_reason"],
                "action": fault_eval["recommended_action"]
            }
            faulty_sensors.append(s["name"])
        else:
            health_status = "HEALTHY"
            anom_eval = anomaly_engine.analyze(s, val, raw_readings)
            if anom_eval["score"] > max_anomaly_score:
                max_anomaly_score = anom_eval["score"]
            if anom_eval["status"] in ["ANOMALY", "CRITICAL"]:
                anomaly_detected_sensors.append(s["name"])

        # Format reading payload
        reading_payload = {
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "sensorId": sensor_id,
            "sensorName": s["name"],
            "value": val if val is not None else 0.0,
            "unit": s["unit"],
            "status": anom_eval["status"],
            "health": health_status,
            "anomalyScore": anom_eval["score"],
            "latitude": round(mission_state["position"]["latitude"], 5),
            "longitude": round(mission_state["position"]["longitude"], 5),
            "depth": s.get("depth", mission_state["current_depth"]),
            "samplingInterval": mission_state["current_sampling_interval"],
            "diagnosis": anom_eval["reason"],
            "action": anom_eval["action"],
            "classification": anom_eval.get("classification", "NOMINAL")
        }

        latest_telemetry[sensor_id] = reading_payload
        all_readings_map[sensor_id] = reading_payload

        # Process through communication layer (transmit or buffer)
        comm_sim.process_reading(reading_payload)

    # Autonomous Adaptive Sampling Decision
    current_interval = mission_state["current_sampling_interval"]
    mission_state["overall_anomaly_score"] = max_anomaly_score

    if energy_model.soc < 25.0:
        # Low energy overrides everything
        if current_interval != 120:
            mission_state["previous_sampling_interval"] = current_interval
            mission_state["current_sampling_interval"] = 120
            mission_state["sampling_change_reason"] = "Energy Saving Mode: Battery below 25%"
            mission_state["ai_decision"] = "ENTER POWER SAVING MODE"
            log_event("ADAPTIVE_SAMPLING", "WARNING", "Sampling throttled to 120s due to energy constraint.")
    elif max_anomaly_score >= 0.50:
        # Environmental anomaly detected -> Accelerate sampling to capture dynamic event
        mission_state["ai_environmental_state"] = "ANOMALY"
        if current_interval != 10:
            mission_state["previous_sampling_interval"] = current_interval
            mission_state["current_sampling_interval"] = 10
            affected = ", ".join(anomaly_detected_sensors)
            mission_state["sampling_change_reason"] = f"Significant environmental anomaly on: {affected}. Accelerated to 10s to capture dynamics."
            mission_state["ai_decision"] = "INCREASE SAMPLING (ANOMALY RESPONSE)"
            log_event("ANOMALY", "WARNING", f"Environmental anomaly detected on {affected}! Sampling interval accelerated from 60s to 10s.")
    else:
        # Stable nominal conditions
        mission_state["ai_environmental_state"] = "NORMAL"
        if current_interval != 60 and energy_model.soc >= 25.0:
            mission_state["previous_sampling_interval"] = current_interval
            mission_state["current_sampling_interval"] = 60
            mission_state["sampling_change_reason"] = "Environmental baseline returned to normal operating envelope."
            mission_state["ai_decision"] = "MAINTAIN NORMAL OPERATION"
            log_event("ADAPTIVE_SAMPLING", "INFO", "Baseline stabilized. Sampling returned to 60s.")

# Start background thread
sim_thread = threading.Thread(target=simulation_worker, daemon=True)
sim_thread.start()

# ----------------- REST API ROUTES -----------------

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "service": "OceanX Virtual Ocean Observation & Autonomous Decision Simulator",
        "team": "Coders May Cry (CMC)",
        "problem_statement_id": 26065
    })

@app.route("/api/sensors", methods=["GET"])
def get_sensors():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM sensors ORDER BY id ASC")
    sensors = [dict(row) for row in c.fetchall()]
    conn.close()

    # Merge with latest telemetry
    for s in sensors:
        s_id = s["id"]
        if s_id in latest_telemetry:
            s["lastValue"] = latest_telemetry[s_id]["value"]
            s["status"] = latest_telemetry[s_id]["status"]
            s["health"] = latest_telemetry[s_id]["health"]
            s["anomalyScore"] = latest_telemetry[s_id]["anomalyScore"]
            s["diagnosis"] = latest_telemetry[s_id]["diagnosis"]
            s["action"] = latest_telemetry[s_id]["action"]
    return jsonify(sensors)

@app.route("/api/sensors", methods=["POST"])
def add_sensor():
    data = request.json or {}
    # Validation
    name = (data.get("name") or "").strip()
    sensor_type = (data.get("type") or "Custom").strip()
    unit = (data.get("unit") or "").strip()
    min_val = float(data.get("minValue", 0.0))
    max_val = float(data.get("maxValue", 100.0))
    norm_min = float(data.get("normalMin", 20.0))
    norm_max = float(data.get("normalMax", 80.0))
    noise = float(data.get("noiseLevel", 0.1))
    interval = int(data.get("samplingInterval", 60))
    critical = 1 if data.get("critical") else 0
    depth = float(data.get("depth", 10.0))

    if not name:
        return jsonify({"error": "Sensor name is required"}), 400
    if min_val >= max_val:
        return jsonify({"error": "Absolute minimum must be less than absolute maximum"}), 400
    if norm_min >= norm_max:
        return jsonify({"error": "Normal minimum must be less than normal maximum"}), 400
    if norm_min < min_val or norm_max > max_val:
        return jsonify({"error": "Normal range must fall inside absolute range"}), 400
    if noise < 0:
        return jsonify({"error": "Noise level cannot be negative"}), 400
    if interval <= 0:
        return jsonify({"error": "Sampling interval must be positive"}), 400

    sensor_id = f"custom_{int(time.time())}_{random.randint(100, 999)}"
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("""
        INSERT INTO sensors (
            id, name, type, unit, minValue, maxValue, normalMin, normalMax,
            warningThreshold, criticalThreshold, samplingInterval, noiseLevel,
            enabled, critical, depth, status, health, lastValue, lastUpdated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, 'NORMAL', 'HEALTHY', ?, datetime('now'))
    """, (
        sensor_id, name, sensor_type, unit, min_val, max_val, norm_min, norm_max,
        norm_max * 1.1, norm_max * 1.25, interval, noise, critical, depth, (norm_min + norm_max)/2.0
    ))
    conn.commit()
    conn.close()

    log_event("SENSOR_CONFIG", "INFO", f"New sensor configured: '{name}' ({unit}) with interval {interval}s")
    return jsonify({"success": True, "sensorId": sensor_id, "message": f"Sensor '{name}' added successfully."}), 201

@app.route("/api/sensors/<sensor_id>", methods=["PUT"])
def update_sensor(sensor_id):
    data = request.json or {}
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM sensors WHERE id = ?", (sensor_id,))
    existing = c.fetchone()
    if not existing:
        conn.close()
        return jsonify({"error": "Sensor not found"}), 404

    norm_min = float(data.get("normalMin", existing["normalMin"]))
    norm_max = float(data.get("normalMax", existing["normalMax"]))
    interval = int(data.get("samplingInterval", existing["samplingInterval"]))
    noise = float(data.get("noiseLevel", existing["noiseLevel"]))
    enabled = 1 if data.get("enabled", existing["enabled"]) else 0

    c.execute("""
        UPDATE sensors
        SET normalMin = ?, normalMax = ?, samplingInterval = ?, noiseLevel = ?, enabled = ?
        WHERE id = ?
    """, (norm_min, norm_max, interval, noise, enabled, sensor_id))
    conn.commit()
    conn.close()

    log_event("SENSOR_CONFIG", "INFO", f"Updated sensor configuration for '{existing['name']}'")
    return jsonify({"success": True, "message": "Sensor updated."})

@app.route("/api/sensors/<sensor_id>", methods=["DELETE"])
def delete_sensor(sensor_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM sensors WHERE id = ?", (sensor_id,))
    conn.commit()
    conn.close()
    latest_telemetry.pop(sensor_id, None)
    log_event("SENSOR_CONFIG", "INFO", f"Sensor {sensor_id} removed.")
    return jsonify({"success": True, "message": "Sensor deleted."})

@app.route("/api/mission/start", methods=["POST"])
def start_mission():
    mission_state["is_active"] = True
    mission_state["is_paused"] = False
    log_event("MISSION", "INFO", "Virtual ocean mission started.")
    return jsonify({"success": True, "mission_state": mission_state})

@app.route("/api/mission/pause", methods=["POST"])
def pause_mission():
    mission_state["is_paused"] = True
    log_event("MISSION", "INFO", "Virtual ocean mission paused.")
    return jsonify({"success": True, "mission_state": mission_state})

@app.route("/api/mission/resume", methods=["POST"])
def resume_mission():
    mission_state["is_paused"] = False
    log_event("MISSION", "INFO", "Virtual ocean mission resumed.")
    return jsonify({"success": True, "mission_state": mission_state})

@app.route("/api/mission/reset", methods=["POST"])
def reset_mission():
    mission_state["is_active"] = True
    mission_state["is_paused"] = False
    mission_state["elapsed_seconds"] = 0
    mission_state["start_timestamp"] = time.time()
    mission_state["current_sampling_interval"] = 60
    mission_state["previous_sampling_interval"] = 60
    mission_state["sampling_change_reason"] = "Mission reset to baseline"
    mission_state["ai_decision"] = "MAINTAIN NORMAL OPERATION"
    mission_state["ai_environmental_state"] = "NORMAL"
    mission_state["overall_anomaly_score"] = 0.02
    mission_state["active_scenario"] = "NORMAL OCEAN"
    mission_state["sih_demo_active"] = False
    
    simulator.clear_injection()
    energy_model.set_battery(84.5)
    energy_model.set_solar(65.0)
    comm_sim.set_link_status("ONLINE")
    
    log_event("MISSION", "INFO", "Mission simulation reset to initial conditions.")
    return jsonify({"success": True, "message": "Simulation reset successfully."})

@app.route("/api/simulation/state", methods=["GET"])
def get_simulation_state():
    energy_status = energy_model.update(
        sampling_interval=mission_state["current_sampling_interval"],
        is_transmitting=(comm_sim.link_status == "ONLINE"),
        dt_seconds=0.0
    )
    comm_status = comm_sim.get_status()

    # Format elapsed time as HH:MM:SS
    el = mission_state["elapsed_seconds"]
    h = el // 3600
    m = (el % 3600) // 60
    s = el % 60
    formatted_time = f"{h:02d}:{m:02d}:{s:02d}"

    return jsonify({
        "mission": {
            **mission_state,
            "formatted_elapsed_time": formatted_time
        },
        "telemetry": latest_telemetry,
        "energy": energy_status,
        "communication": comm_status,
        "environment": {
            "sea_surface_temp": simulator.sea_surface_temp,
            "ocean_current_speed": simulator.ocean_current_speed,
            "wave_height": simulator.wave_height,
            "current_depth": simulator.current_depth,
            "solar_irradiance": simulator.solar_irradiance,
            "sea_state": simulator.sea_state
        },
        "recent_events": recent_events[:15]
    })

@app.route("/api/simulation/environment", methods=["POST"])
def update_environment():
    data = request.json or {}
    simulator.set_environment(
        surface_temp=data.get("sea_surface_temp"),
        current_speed=data.get("ocean_current_speed"),
        wave_height=data.get("wave_height"),
        depth=data.get("current_depth"),
        solar=data.get("solar_irradiance")
    )
    if "solar_irradiance" in data:
        energy_model.set_solar(data["solar_irradiance"])
    return jsonify({"success": True, "message": "Environment updated."})

@app.route("/api/simulation/anomaly", methods=["POST"])
def inject_anomaly():
    data = request.json or {}
    sensor_id = data.get("sensorId", "temp_1")
    magnitude = float(data.get("magnitude", 7.2))
    duration = float(data.get("duration", 60.0))
    
    simulator.inject_event(sensor_id, "ANOMALY", magnitude=magnitude, duration=duration)
    log_event("INJECTION", "WARNING", f"Injected environmental anomaly on sensor '{sensor_id}' (Δ +{magnitude})")
    run_sensor_acquisition_cycle()
    return jsonify({"success": True, "message": f"Anomaly injected into {sensor_id}."})

@app.route("/api/simulation/fault", methods=["POST"])
def inject_fault():
    data = request.json or {}
    sensor_id = data.get("sensorId", "temp_1")
    fault_type = data.get("faultType", "STUCK") # STUCK, IMPOSSIBLE_JUMP, ERRATIC_NOISE, OFFLINE
    
    simulator.inject_event(sensor_id, fault_type, magnitude=35.0, duration=120.0)
    log_event("INJECTION", "ERROR", f"Injected sensor hardware fault: '{fault_type}' on '{sensor_id}'")
    run_sensor_acquisition_cycle()
    return jsonify({"success": True, "message": f"Fault '{fault_type}' injected into {sensor_id}."})

@app.route("/api/simulation/communication-loss", methods=["POST"])
def sim_comm_loss():
    comm_sim.set_link_status("OFFLINE")
    log_event("COMMUNICATION", "ERROR", "Communication link lost (polar storm / satellite occultation). Local Store-and-Forward buffer activated.")
    return jsonify({"success": True, "message": "Communication set to OFFLINE. Data buffering active."})

@app.route("/api/simulation/communication-restore", methods=["POST"])
def sim_comm_restore():
    result = comm_sim.synchronize_buffer()
    log_event("COMMUNICATION", "INFO", f"Communication restored. Synchronized {result['synchronized']} buffered records with 0 data loss.")
    return jsonify({"success": True, **result})

@app.route("/api/simulation/low-battery", methods=["POST"])
def sim_low_battery():
    energy_model.set_battery(18.0)
    log_event("ENERGY", "WARNING", "Simulated low battery condition: Battery dropped to 18.0%.")
    run_sensor_acquisition_cycle()
    return jsonify({"success": True, "message": "Battery set to 18.0%."})

@app.route("/api/simulation/scenario", methods=["POST"])
def set_scenario():
    data = request.json or {}
    scenario_id = data.get("scenario")
    
    simulator.clear_injection()
    
    if scenario_id == "NORMAL_OCEAN":
        mission_state["active_scenario"] = "NORMAL OCEAN"
        simulator.set_environment(surface_temp=2.4, wave_height=1.8, solar=65.0)
        energy_model.set_battery(84.5)
        comm_sim.set_link_status("ONLINE")
        log_event("SCENARIO", "INFO", "Scenario activated: Normal Polar Ocean Baseline.")
    elif scenario_id == "TEMPERATURE_ANOMALY":
        mission_state["active_scenario"] = "SUDDEN TEMPERATURE CHANGE"
        simulator.inject_event("temp_1", "ANOMALY", magnitude=7.2)
        log_event("SCENARIO", "WARNING", "Scenario activated: Sudden Thermal Plume (+7.2°C).")
    elif scenario_id == "HIGH_SALINITY":
        mission_state["active_scenario"] = "HIGH SALINITY"
        simulator.inject_event("sal_1", "ANOMALY", magnitude=5.5)
        log_event("SCENARIO", "WARNING", "Scenario activated: High Salinity / Brine Rejection Plume.")
    elif scenario_id == "LOW_DO":
        mission_state["active_scenario"] = "LOW DISSOLVED OXYGEN"
        simulator.inject_event("do_1", "ANOMALY", magnitude=4.2)
        log_event("SCENARIO", "WARNING", "Scenario activated: Hypoxia / Low DO Event.")
    elif scenario_id == "SENSOR_FAILURE":
        mission_state["active_scenario"] = "SENSOR FAILURE (STUCK)"
        simulator.inject_event("temp_1", "STUCK")
        log_event("SCENARIO", "ERROR", "Scenario activated: Temperature Sensor Mechanical Stuck Fault.")
    elif scenario_id == "COMM_BLACKOUT":
        mission_state["active_scenario"] = "COMMUNICATION BLACKOUT"
        comm_sim.set_link_status("OFFLINE")
        log_event("SCENARIO", "ERROR", "Scenario activated: Severe Polar Storm Communication Blackout.")
    elif scenario_id == "LOW_BATTERY":
        mission_state["active_scenario"] = "LOW BATTERY"
        energy_model.set_battery(17.5)
        energy_model.set_solar(0.0)
        log_event("SCENARIO", "WARNING", "Scenario activated: Polar Winter Night / Low Battery.")
    elif scenario_id == "MULTI_SENSOR_ANOMALY":
        mission_state["active_scenario"] = "MULTI-SENSOR ANOMALY"
        simulator.inject_event("temp_1", "ANOMALY", magnitude=6.0)
        simulator.inject_event("sal_1", "ANOMALY", magnitude=3.8)
        simulator.inject_event("do_1", "ANOMALY", magnitude=3.0)
        log_event("SCENARIO", "CRITICAL", "Scenario activated: Multi-Sensor Marine Dynamic Event.")
    
    run_sensor_acquisition_cycle()
    return jsonify({"success": True, "scenario": mission_state["active_scenario"]})

@app.route("/api/events", methods=["GET"])
def get_events():
    return jsonify(recent_events)

@app.route("/api/analytics", methods=["GET"])
def get_analytics():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) as total FROM readings")
    total_obs = c.fetchone()["total"]
    
    c.execute("SELECT COUNT(*) as valid FROM readings WHERE status = 'NORMAL'")
    valid_obs = c.fetchone()["valid"]
    
    c.execute("SELECT COUNT(*) as anomalies FROM readings WHERE status IN ('ANOMALY', 'CRITICAL')")
    anomalies = c.fetchone()["anomalies"]
    
    c.execute("SELECT COUNT(*) as faults FROM readings WHERE health != 'HEALTHY'")
    faults = c.fetchone()["faults"]
    
    c.execute("SELECT COUNT(*) as synced FROM readings WHERE syncedFromBuffer = 1")
    synced = c.fetchone()["synced"]
    
    c.execute("SELECT COUNT(*) as buffered FROM local_buffer")
    buffered = c.fetchone()["buffered"]
    
    conn.close()

    energy_metrics = energy_model.update(
        sampling_interval=mission_state["current_sampling_interval"],
        is_transmitting=True,
        dt_seconds=0
    )

    return jsonify({
        "total_observations": total_obs + comm_sim.incoming_observations,
        "valid_observations": valid_obs,
        "anomalies_detected": anomalies,
        "sensor_faults_detected": faults,
        "buffered_observations": buffered,
        "synchronized_observations": synced,
        "data_loss": 0,
        "adaptive_wh": energy_metrics["adaptive_wh"],
        "fixed_wh": energy_metrics["fixed_wh"],
        "energy_saved_pct": energy_metrics["energy_saved_pct"],
        "current_sampling_interval": mission_state["current_sampling_interval"],
        "runtime_hours": energy_metrics["runtime_hours"]
    })

@app.route("/api/export/csv", methods=["GET"])
def export_csv():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM readings ORDER BY id DESC LIMIT 500")
    rows = c.fetchall()
    conn.close()

    csv_lines = ["Timestamp,Sensor ID,Sensor Name,Value,Unit,Status,Health,Anomaly Score,Latitude,Longitude,Depth,Sampling Interval,Synced From Buffer\n"]
    for r in rows:
        csv_lines.append(f"{r['timestamp']},{r['sensorId']},{r['sensorName']},{r['value']},{r['unit']},{r['status']},{r['health']},{r['anomalyScore']},{r['latitude']},{r['longitude']},{r['depth']},{r['samplingInterval']},{r['syncedFromBuffer']}\n")

    return Response(
        "".join(csv_lines),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=oceanx_simulated_mission_telemetry.csv"}
    )

@app.route("/api/bom", methods=["GET"])
def get_bom():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM bom_items ORDER BY id ASC")
    items = [dict(row) for row in c.fetchall()]
    conn.close()
    
    total_inr = sum(item["quantity"] * item["unitCostINR"] for item in items)
    total_usd = sum(item["quantity"] * item["unitCostUSD"] for item in items)

    return jsonify({
        "items": items,
        "totalCostINR": total_inr,
        "totalCostUSD": total_usd,
        "disclaimer": "Indicative estimate — final cost depends on sensor grade, anti-fouling treatment, and marine procurement."
    })

@app.route("/api/bom", methods=["PUT"])
def update_bom():
    data = request.json or {}
    item_id = data.get("id")
    qty = int(data.get("quantity", 1))
    unit_inr = float(data.get("unitCostINR", 0.0))
    unit_usd = float(data.get("unitCostUSD", 0.0))

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("""
        UPDATE bom_items
        SET quantity = ?, unitCostINR = ?, unitCostUSD = ?
        WHERE id = ?
    """, (qty, unit_inr, unit_usd, item_id))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "BOM item updated."})

if __name__ == "__main__":
    init_db()
    print("=========================================================")
    print("  OCEANX — Virtual Ocean Observation & Decision Engine   ")
    print("  SIH 2026 Round 2 | Problem Statement: 26065           ")
    print("  Team: Coders May Cry (CMC)                             ")
    print("  Server listening at http://127.0.0.1:8000              ")
    print("=========================================================")
    app.run(host="0.0.0.0", port=8000, debug=False)
