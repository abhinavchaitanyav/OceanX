import { 
  Sensor, 
  TelemetryReading, 
  MissionState, 
  EnergyState, 
  CommunicationState, 
  EnvironmentState, 
  MissionEvent 
} from '../types';

export const INITIAL_SENSORS: Sensor[] = [
  {
    id: "temp_1",
    name: "Water Temperature",
    type: "Temperature",
    unit: "°C",
    minValue: -5.0,
    maxValue: 15.0,
    normalMin: 0.0,
    normalMax: 5.0,
    warningThreshold: 6.5,
    criticalThreshold: 9.0,
    samplingInterval: 60,
    noiseLevel: 0.15,
    enabled: true,
    critical: true,
    depth: 15.0,
    status: "NORMAL",
    health: "HEALTHY",
    lastValue: 2.34
  },
  {
    id: "sal_1",
    name: "Conductivity / Salinity",
    type: "Salinity",
    unit: "PSU",
    minValue: 20.0,
    maxValue: 45.0,
    normalMin: 33.0,
    normalMax: 36.0,
    warningThreshold: 37.5,
    criticalThreshold: 40.0,
    samplingInterval: 60,
    noiseLevel: 0.1,
    enabled: true,
    critical: true,
    depth: 25.0,
    status: "NORMAL",
    health: "HEALTHY",
    lastValue: 34.21
  },
  {
    id: "press_1",
    name: "Hydrostatic Pressure / Depth",
    type: "Pressure",
    unit: "dbar",
    minValue: 0.0,
    maxValue: 300.0,
    normalMin: 10.0,
    normalMax: 150.0,
    warningThreshold: 180.0,
    criticalThreshold: 220.0,
    samplingInterval: 60,
    noiseLevel: 0.2,
    enabled: true,
    critical: true,
    depth: 50.0,
    status: "NORMAL",
    health: "HEALTHY",
    lastValue: 51.4
  },
  {
    id: "ph_1",
    name: "pH Sensor",
    type: "pH",
    unit: "pH",
    minValue: 6.0,
    maxValue: 9.5,
    normalMin: 7.8,
    normalMax: 8.3,
    warningThreshold: 7.5,
    criticalThreshold: 7.2,
    samplingInterval: 60,
    noiseLevel: 0.05,
    enabled: true,
    critical: false,
    depth: 10.0,
    status: "NORMAL",
    health: "HEALTHY",
    lastValue: 8.12
  },
  {
    id: "do_1",
    name: "Dissolved Oxygen",
    type: "Dissolved Oxygen",
    unit: "mg/L",
    minValue: 0.0,
    maxValue: 16.0,
    normalMin: 6.5,
    normalMax: 9.5,
    warningThreshold: 5.5,
    criticalThreshold: 4.0,
    samplingInterval: 60,
    noiseLevel: 0.12,
    enabled: true,
    critical: true,
    depth: 20.0,
    status: "NORMAL",
    health: "HEALTHY",
    lastValue: 7.85
  },
  {
    id: "gnss_1",
    name: "GNSS Surface Beacon",
    type: "GNSS",
    unit: "knots",
    minValue: 0.0,
    maxValue: 10.0,
    normalMin: 0.1,
    normalMax: 2.5,
    warningThreshold: 3.5,
    criticalThreshold: 5.0,
    samplingInterval: 60,
    noiseLevel: 0.05,
    enabled: true,
    critical: false,
    depth: 0.0,
    status: "NORMAL",
    health: "HEALTHY",
    lastValue: 1.15
  },
  {
    id: "imu_1",
    name: "9-DOF IMU Pitch/Roll",
    type: "IMU",
    unit: "deg",
    minValue: -45.0,
    maxValue: 45.0,
    normalMin: -12.0,
    normalMax: 12.0,
    warningThreshold: 18.0,
    criticalThreshold: 25.0,
    samplingInterval: 60,
    noiseLevel: 0.3,
    enabled: true,
    critical: false,
    depth: 0.5,
    status: "NORMAL",
    health: "HEALTHY",
    lastValue: 4.2
  },
  {
    id: "batt_1",
    name: "Battery Voltage Monitor",
    type: "Battery",
    unit: "%",
    minValue: 0.0,
    maxValue: 100.0,
    normalMin: 25.0,
    normalMax: 100.0,
    warningThreshold: 20.0,
    criticalThreshold: 15.0,
    samplingInterval: 60,
    noiseLevel: 0.1,
    enabled: true,
    critical: true,
    depth: 0.0,
    status: "NORMAL",
    health: "HEALTHY",
    lastValue: 84.5
  }
];

export class ClientSimulationEngine {
  sensors: Sensor[] = [...INITIAL_SENSORS];
  environment: EnvironmentState = {
    sea_surface_temp: 2.4,
    ocean_current_speed: 1.2,
    wave_height: 1.8,
    current_depth: 45.0,
    solar_irradiance: 65.0,
    sea_state: 3
  };
  mission: MissionState = {
    is_active: true,
    is_paused: false,
    mission_name: "Polar Southern Ocean Recon #001",
    start_timestamp: Date.now(),
    elapsed_seconds: 0,
    current_sampling_interval: 60,
    previous_sampling_interval: 60,
    sampling_change_reason: "Baseline operational sampling",
    ai_decision: "MAINTAIN NORMAL OPERATION",
    ai_environmental_state: "NORMAL",
    overall_anomaly_score: 0.04,
    position: {
      latitude: -64.7742,
      longitude: -63.5011,
      location_name: "Antarctic Peninsula / Bellingshausen Sea",
      heading: 142.5,
      drift_speed_knots: 1.2
    },
    current_depth: 45.0,
    active_scenario: "NORMAL OCEAN",
    sih_demo_active: false,
    sih_demo_step: 0
  };
  energy: EnergyState = {
    battery_pct: 84.5,
    current_wh: 216.3,
    capacity_wh: 256.0,
    solar_watts: 18.3,
    consumption_watts: 4.8,
    net_power_watts: 13.5,
    power_mode: "NORMAL",
    recommended_sampling: 60,
    runtime_hours: 999.0,
    reason: "Nominal power balance. Positive solar generation.",
    solar_irradiance_pct: 65.0,
    energy_saved_pct: 0.0,
    adaptive_wh: 12.4,
    fixed_wh: 14.8
  };
  communication: CommunicationState = {
    link_status: "ONLINE",
    signal_strength_dbm: -75.0,
    packet_success_rate: 100.0,
    incoming_observations: 0,
    buffered_locally: 0,
    synchronized_total: 0,
    data_loss: 0,
    store_forward_active: false,
    bearer: "LoRa 868MHz / LTE Cat-4 Hybrid"
  };

  readingsHistory: Record<string, number[]> = {};
  bufferedObservations: TelemetryReading[] = [];
  syncedReadings: TelemetryReading[] = [];
  events: MissionEvent[] = [];
  activeInjections: Record<string, { type: string; magnitude: number; fixedValue: number }> = {};
  simTime = 0;

  constructor() {
    this.addEvent("MISSION", "INFO", "Virtual ocean mission initialized. Baseline 60s sampling active.");
  }

  addEvent(category: string, severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL', message: string, metadata?: any) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const evt: MissionEvent = {
      id: Date.now() + Math.random(),
      timestamp: timeStr,
      category,
      severity,
      message,
      metadata
    };
    this.events.unshift(evt);
    if (this.events.length > 50) this.events.pop();
  }

  injectAnomaly(sensorId: string, magnitude: number = 7.0) {
    this.activeInjections[sensorId] = {
      type: "ANOMALY",
      magnitude,
      fixedValue: 0
    };
    const s = this.sensors.find(item => item.id === sensorId);
    this.addEvent("INJECTION", "WARNING", `Injected environmental anomaly on ${s ? s.name : sensorId} (+${magnitude})`);
    this.stepCycle();
  }

  injectFault(sensorId: string, faultType: string = "STUCK") {
    const currentVal = this.readingsHistory[sensorId]?.slice(-1)[0] || 2.4;
    this.activeInjections[sensorId] = {
      type: faultType,
      magnitude: 35.0,
      fixedValue: currentVal
    };
    const s = this.sensors.find(item => item.id === sensorId);
    this.addEvent("INJECTION", "ERROR", `Injected transducer fault: ${faultType} on ${s ? s.name : sensorId}`);
    this.stepCycle();
  }

  clearInjections() {
    this.activeInjections = {};
  }

  setCommunicationStatus(status: 'ONLINE' | 'DEGRADED' | 'OFFLINE') {
    this.communication.link_status = status;
    if (status === 'OFFLINE') {
      this.communication.signal_strength_dbm = -135;
      this.communication.packet_success_rate = 0;
      this.communication.store_forward_active = true;
      this.addEvent("COMMUNICATION", "ERROR", "Communication blackout. Local Store-and-Forward buffer activated.");
    } else if (status === 'DEGRADED') {
      this.communication.signal_strength_dbm = -110;
      this.communication.packet_success_rate = 60;
      this.addEvent("COMMUNICATION", "WARNING", "Communication link degraded. Throttling non-critical packets.");
    } else {
      this.communication.signal_strength_dbm = -75;
      this.communication.packet_success_rate = 100;
      this.addEvent("COMMUNICATION", "INFO", "Communication link restored (ONLINE).");
    }
  }

  restoreCommunicationAndSync(): number {
    this.setCommunicationStatus("ONLINE");
    const count = this.bufferedObservations.length;
    if (count > 0) {
      // Drain buffer into synced
      this.syncedReadings.push(...this.bufferedObservations.map(r => ({ ...r, syncedFromBuffer: true })));
      this.communication.synchronized_total += count;
      this.bufferedObservations = [];
      this.communication.buffered_locally = 0;
      this.communication.store_forward_active = false;
      this.addEvent("COMMUNICATION", "INFO", `Buffer synchronized: ${count} observations uploaded with 0 data loss.`);
    }
    return count;
  }

  setBattery(pct: number) {
    this.energy.battery_pct = Math.max(0, Math.min(100, pct));
    this.energy.current_wh = (this.energy.battery_pct / 100) * this.energy.capacity_wh;
    if (pct < 25) {
      this.addEvent("ENERGY", "WARNING", `Simulated battery low: ${pct.toFixed(1)}%.`);
    }
    this.stepCycle();
  }

  setSolar(pct: number) {
    this.environment.solar_irradiance = Math.max(0, Math.min(100, pct));
    this.energy.solar_irradiance_pct = this.environment.solar_irradiance;
  }

  stepTimer(dt: number = 1) {
    if (!this.mission.is_active || this.mission.is_paused) return;
    this.mission.elapsed_seconds += dt;
    this.simTime += dt;
    
    // Update battery drain & solar
    const solarWatts = (this.environment.solar_irradiance / 100) * 30 * 0.94;
    const interval = this.mission.current_sampling_interval;
    const isTx = this.communication.link_status === "ONLINE";
    const compW = interval <= 10 ? 4.2 : (interval >= 120 ? 1.2 : 2.5);
    const commW = isTx ? (interval <= 10 ? 2.4 : 1.5) : 0.2;
    const totalW = 0.4 + compW + 0.9 + commW;
    const netW = solarWatts - totalW;
    
    this.energy.solar_watts = Math.round(solarWatts * 100) / 100;
    this.energy.consumption_watts = Math.round(totalW * 100) / 100;
    this.energy.net_power_watts = Math.round(netW * 100) / 100;
    
    const deltaWh = netW * (dt / 3600);
    this.energy.current_wh = Math.max(0, Math.min(this.energy.capacity_wh, this.energy.current_wh + deltaWh));
    this.energy.battery_pct = Math.round((this.energy.current_wh / this.energy.capacity_wh) * 1000) / 10;
    
    this.energy.adaptive_wh += totalW * (dt / 3600);
    this.energy.fixed_wh += (0.4 + 2.5 + 0.9 + 1.5) * (dt / 3600);
    
    if (this.energy.fixed_wh > 0.01) {
      const diff = this.energy.fixed_wh - this.energy.adaptive_wh;
      this.energy.energy_saved_pct = Math.round(Math.max(0, (diff / this.energy.fixed_wh) * 1000)) / 10;
    }
  }

  stepCycle(): TelemetryReading[] {
    const readings: TelemetryReading[] = [];
    const t = this.simTime;
    let maxAnomaly = 0;
    const anomalySensors: string[] = [];

    for (const sensor of this.sensors) {
      if (!sensor.enabled) continue;
      const sId = sensor.id;
      let val = 0;
      const inj = this.activeInjections[sId];

      if (inj) {
        if (inj.type === "STUCK") {
          val = inj.fixedValue;
        } else if (inj.type === "OFFLINE") {
          val = NaN;
        } else if (inj.type === "IMPOSSIBLE_JUMP") {
          val = sensor.normalMax + 35.0 + (Math.random() - 0.5);
        } else if (inj.type === "ERRATIC_NOISE") {
          val = sensor.minValue + Math.random() * (sensor.maxValue - sensor.minValue);
        }
      }

      if (!inj || inj.type === "ANOMALY") {
        if (sensor.type === "Temperature") {
          val = this.environment.sea_surface_temp - 0.025 * sensor.depth + 0.35 * Math.sin(t * 0.05) + (Math.random() - 0.5) * sensor.noiseLevel * 2;
          if (inj?.type === "ANOMALY") val += inj.magnitude;
        } else if (sensor.type === "Salinity") {
          val = 34.1 + sensor.depth * 0.008 + 0.12 * Math.sin(t * 0.03) + (Math.random() - 0.5) * sensor.noiseLevel * 2;
          if (inj?.type === "ANOMALY") val += inj.magnitude;
        } else if (sensor.type === "Pressure") {
          val = 1.013 + (sensor.depth + this.environment.wave_height * 0.5 * Math.sin(t * 0.8)) * 1.008 + (Math.random() - 0.5) * sensor.noiseLevel;
          if (inj?.type === "ANOMALY") val += inj.magnitude;
        } else if (sensor.type === "pH") {
          val = 8.15 - sensor.depth * 0.0015 + 0.02 * Math.sin(t * 0.04) + (Math.random() - 0.5) * sensor.noiseLevel;
          if (inj?.type === "ANOMALY") val -= inj.magnitude;
        } else if (sensor.type === "Dissolved Oxygen") {
          val = 8.2 - 0.22 * (this.environment.sea_surface_temp - 2.0) - sensor.depth * 0.01 + (Math.random() - 0.5) * sensor.noiseLevel;
          if (inj?.type === "ANOMALY") val -= inj.magnitude;
        } else if (sensor.type === "Battery") {
          val = this.energy.battery_pct;
        } else {
          const mid = (sensor.normalMin + sensor.normalMax) / 2;
          const span = (sensor.normalMax - sensor.normalMin) * 0.2;
          val = mid + span * Math.sin(t * 0.05) + (Math.random() - 0.5) * sensor.noiseLevel * 2;
          if (inj?.type === "ANOMALY") val += inj.magnitude;
        }
      }

      val = Math.round(val * 100) / 100;
      sensor.lastValue = isNaN(val) ? 0 : val;

      if (!this.readingsHistory[sId]) this.readingsHistory[sId] = [];
      if (!isNaN(val)) {
        this.readingsHistory[sId].push(val);
        if (this.readingsHistory[sId].length > 20) this.readingsHistory[sId].shift();
      }

      // Fault evaluation
      let isFault = false;
      let health = "HEALTHY" as any;
      let faultReason = "";
      const buf = this.readingsHistory[sId];

      if (isNaN(val)) {
        isFault = true;
        health = "OFFLINE";
        faultReason = "Missing ADC signal / open umbilical.";
      } else if (val < sensor.minValue || val > sensor.maxValue) {
        isFault = true;
        health = "FAULT";
        faultReason = `Transducer range violation (${val} outside limits).`;
      } else if (buf.length >= 2 && Math.abs(buf[buf.length - 1] - buf[buf.length - 2]) > (sensor.normalMax - sensor.normalMin) * 1.5) {
        isFault = true;
        health = "DEGRADED";
        faultReason = "Impossible physical step jump (fluid thermodynamics violation).";
      } else if (buf.length >= 6 && Math.max(...buf) - Math.min(...buf) < 0.0001 && sensor.type !== "Battery") {
        isFault = true;
        health = "DEGRADED";
        faultReason = "Stuck value detected across multiple cycles despite active wave heave.";
      }

      // Anomaly evaluation
      let anomScore = 0.0;
      let anomStatus = "NORMAL" as any;
      let anomReason = "Normal baseline envelope.";

      if (isFault) {
        anomScore = 0.0;
        anomStatus = "FAULT";
        anomReason = faultReason;
        sensor.status = "FAULT";
        sensor.health = health;
      } else {
        sensor.health = "HEALTHY";
        if (val < sensor.normalMin || val > sensor.normalMax) {
          const dev = val < sensor.normalMin ? (sensor.normalMin - val) : (val - sensor.normalMax);
          const span = Math.max(0.1, sensor.normalMax - sensor.normalMin);
          anomScore = Math.min(1.0, Math.round((dev / span) * 100) / 100);
          anomStatus = anomScore > 0.6 ? "CRITICAL" : "ANOMALY";
          anomReason = `Value ${val} departed normal range (${sensor.normalMin} - ${sensor.normalMax} ${sensor.unit}). Cross-sensor dynamics verified.`;
          anomalySensors.push(sensor.name);
          if (anomScore > maxAnomaly) maxAnomaly = anomScore;
        } else {
          anomStatus = "NORMAL";
        }
        sensor.status = anomStatus;
      }

      sensor.diagnosis = anomReason;
      sensor.action = isFault ? "Flag transducer for inspection. Isolate channel." : (anomStatus !== "NORMAL" ? "Accelerate sampling to 10s." : "Maintain 60s operation.");

      const reading: TelemetryReading = {
        timestamp: new Date().toLocaleTimeString(),
        sensorId: sId,
        sensorName: sensor.name,
        value: val,
        unit: sensor.unit,
        status: anomStatus,
        health,
        anomalyScore: anomScore,
        latitude: this.mission.position.latitude,
        longitude: this.mission.position.longitude,
        depth: sensor.depth,
        samplingInterval: this.mission.current_sampling_interval,
        diagnosis: anomReason,
        action: sensor.action
      };

      readings.push(reading);
      this.communication.incoming_observations++;

      if (this.communication.link_status === "ONLINE") {
        this.syncedReadings.push(reading);
        if (this.syncedReadings.length > 500) this.syncedReadings.shift();
      } else {
        this.bufferedObservations.push(reading);
        this.communication.buffered_locally = this.bufferedObservations.length;
      }
    }

    // AI Adaptive Decision
    this.mission.overall_anomaly_score = maxAnomaly;
    if (this.energy.battery_pct < 25) {
      if (this.mission.current_sampling_interval !== 120) {
        this.mission.previous_sampling_interval = this.mission.current_sampling_interval;
        this.mission.current_sampling_interval = 120;
        this.mission.sampling_change_reason = "Energy-Saving Mode: Battery < 25%. Throttled to 120s to preserve mission.";
        this.mission.ai_decision = "ENTER POWER SAVING MODE";
        this.addEvent("ADAPTIVE_SAMPLING", "WARNING", "Adaptive sampling throttled to 120s due to low battery.");
      }
    } else if (maxAnomaly >= 0.4) {
      this.mission.ai_environmental_state = "ANOMALY";
      if (this.mission.current_sampling_interval !== 10) {
        this.mission.previous_sampling_interval = this.mission.current_sampling_interval;
        this.mission.current_sampling_interval = 10;
        this.mission.sampling_change_reason = `Environmental anomaly detected on ${anomalySensors.join(", ")}. Accelerated to 10s.`;
        this.mission.ai_decision = "INCREASE SAMPLING (ANOMALY RESPONSE)";
        this.addEvent("ANOMALY", "WARNING", `Environmental anomaly detected! Accelerated sampling from 60s to 10s.`);
      }
    } else {
      this.mission.ai_environmental_state = "NORMAL";
      if (this.mission.current_sampling_interval !== 60 && this.energy.battery_pct >= 25) {
        this.mission.previous_sampling_interval = this.mission.current_sampling_interval;
        this.mission.current_sampling_interval = 60;
        this.mission.sampling_change_reason = "Environmental ocean baseline returned to nominal conditions.";
        this.mission.ai_decision = "MAINTAIN NORMAL OPERATION";
        this.addEvent("ADAPTIVE_SAMPLING", "INFO", "Baseline stabilized. Sampling returned to 60s.");
      }
    }

    return readings;
  }
}
