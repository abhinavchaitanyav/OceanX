"""
OceanX SQLite Database & Persistence Layer
Stores sensors, telemetry readings, mission events, store-and-forward buffer, and BOM.
"""

import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "oceanx.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Sensors Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sensors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        unit TEXT NOT NULL,
        minValue REAL NOT NULL,
        maxValue REAL NOT NULL,
        normalMin REAL NOT NULL,
        normalMax REAL NOT NULL,
        warningThreshold REAL NOT NULL,
        criticalThreshold REAL NOT NULL,
        samplingInterval INTEGER NOT NULL,
        noiseLevel REAL NOT NULL,
        enabled INTEGER NOT NULL DEFAULT 1,
        critical INTEGER NOT NULL DEFAULT 0,
        depth REAL NOT NULL DEFAULT 10.0,
        status TEXT NOT NULL DEFAULT 'NORMAL',
        health TEXT NOT NULL DEFAULT 'HEALTHY',
        lastValue REAL DEFAULT 0.0,
        lastUpdated TEXT
    )
    """)

    # Telemetry Readings
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        sensorId TEXT NOT NULL,
        sensorName TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT NOT NULL,
        status TEXT NOT NULL,
        health TEXT NOT NULL,
        anomalyScore REAL NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        depth REAL NOT NULL,
        samplingInterval INTEGER NOT NULL,
        syncedFromBuffer INTEGER DEFAULT 0
    )
    """)

    # Store-and-Forward Local Telemetry Buffer (when offline)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS local_buffer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        sensorId TEXT NOT NULL,
        sensorName TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT NOT NULL,
        status TEXT NOT NULL,
        health TEXT NOT NULL,
        anomalyScore REAL NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        depth REAL NOT NULL,
        samplingInterval INTEGER NOT NULL
    )
    """)

    # Mission Events Log
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS mission_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        category TEXT NOT NULL,
        severity TEXT NOT NULL,
        message TEXT NOT NULL,
        metadata TEXT
    )
    """)

    # Bill of Materials (BOM) Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bom_items (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        component TEXT NOT NULL,
        specification TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unitCostINR REAL NOT NULL,
        unitCostUSD REAL NOT NULL,
        purpose TEXT NOT NULL
    )
    """)

    # Seed Default Sensors if table is empty
    cursor.execute("SELECT COUNT(*) as count FROM sensors")
    if cursor.fetchone()["count"] == 0:
        default_sensors = [
            ("temp_1", "Water Temperature", "Temperature", "°C", -5.0, 15.0, 0.0, 5.0, 6.5, 9.0, 60, 0.15, 1, 1, 15.0, "NORMAL", "HEALTHY", 2.34),
            ("sal_1", "Conductivity / Salinity", "Salinity", "PSU", 20.0, 45.0, 33.0, 36.0, 37.5, 40.0, 60, 0.1, 1, 1, 25.0, "NORMAL", "HEALTHY", 34.21),
            ("press_1", "Hydrostatic Pressure / Depth", "Pressure", "dbar", 0.0, 300.0, 10.0, 150.0, 180.0, 220.0, 60, 0.2, 1, 1, 50.0, "NORMAL", "HEALTHY", 51.4),
            ("ph_1", "pH Sensor", "pH", "pH", 6.0, 9.5, 7.8, 8.3, 7.5, 7.2, 60, 0.05, 1, 0, 10.0, "NORMAL", "HEALTHY", 8.12),
            ("do_1", "Dissolved Oxygen", "Dissolved Oxygen", "mg/L", 0.0, 16.0, 6.5, 9.5, 5.5, 4.0, 60, 0.12, 1, 1, 20.0, "NORMAL", "HEALTHY", 7.85),
            ("gnss_1", "GNSS Surface Beacon", "GNSS", "knots", 0.0, 10.0, 0.1, 2.5, 3.5, 5.0, 60, 0.05, 1, 0, 0.0, "NORMAL", "HEALTHY", 1.15),
            ("imu_1", "9-DOF IMU Pitch/Roll", "IMU", "deg", -45.0, 45.0, -12.0, 12.0, 18.0, 25.0, 60, 0.3, 1, 0, 0.5, "NORMAL", "HEALTHY", 4.2),
            ("batt_1", "Battery Voltage Monitor", "Battery", "%", 0.0, 100.0, 25.0, 100.0, 20.0, 15.0, 60, 0.1, 1, 1, 0.0, "NORMAL", "HEALTHY", 84.5)
        ]
        cursor.executemany("""
            INSERT INTO sensors (
                id, name, type, unit, minValue, maxValue, normalMin, normalMax,
                warningThreshold, criticalThreshold, samplingInterval, noiseLevel,
                enabled, critical, depth, status, health, lastValue, lastUpdated
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """, default_sensors)

    # Seed Default BOM if empty
    cursor.execute("SELECT COUNT(*) as count FROM bom_items")
    if cursor.fetchone()["count"] == 0:
        default_bom = [
            ("bom_1", "Compute & Edge", "ESP32-S3-WROOM-1", "Dual-core Xtensa LX7, 240MHz, Ultra-low power co-processor", 1, 550.0, 6.6, "Sensor acquisition, conditioning, hardware watchdog, power-gating"),
            ("bom_2", "Compute & Edge", "Raspberry Pi 5 (8GB)", "Quad-core Cortex-A76, 2.4GHz, 8GB LPDDR4X", 1, 7800.0, 93.9, "Edge AI decision engine, anomaly validation, SQLite buffer, store-forward"),
            ("bom_3", "Sensors", "PT100 RTD Class A Submersible", "Marine-grade 316L stainless steel, -50°C to +100°C, 0.05°C accuracy", 1, 3200.0, 38.5, "Polar water temperature profiling"),
            ("bom_4", "Sensors", "Industrial Piezoresistive Depth Transducer", "0-20 bar (200m depth), 4-20mA / I2C output, titanium diaphragm", 1, 5800.0, 69.8, "Hydrostatic pressure and mooring depth calculation"),
            ("bom_5", "Sensors", "Toroidal Inductive Conductivity / Salinity Sensor", "0-100 mS/cm (0-70 PSU), anti-fouling PEEK body", 1, 9500.0, 114.4, "Salinity, brine rejection, and ocean circulation tracking"),
            ("bom_6", "Sensors", "Industrial Combination Sealed pH Electrode", "0-14 pH, double junction ceramic, gel electrolyte, 316L cage", 1, 2800.0, 33.7, "Ocean acidification and biochemical health monitoring"),
            ("bom_7", "Sensors", "Optical Luminescence Dissolved Oxygen (DO) Sensor", "0-20 mg/L, no oxygen consumption, long calibration stability", 1, 11500.0, 138.5, "Polar biological productivity, hypoxia, and ventilation detection"),
            ("bom_8", "Sensors", "Multi-GNSS Receiver Module (u-blox NEO-M9N)", "GPS, GLONASS, Galileo, BeiDou, 1.5m CEP, active patch antenna", 1, 2400.0, 28.9, "Geographic drift tracking and timestamp synchronization"),
            ("bom_9", "Sensors", "BNO085 9-DOF IMU & Attitude Sensor", "Fused pitch, roll, heading, ocean wave heave acceleration", 1, 1900.0, 22.8, "Wave height calculation and buoy stability telemetry"),
            ("bom_10", "Communication", "LoRa SX1262 Long-Range Transceiver HAT", "868/915 MHz, +22dBm output, up to 15km line-of-sight marine link", 1, 2100.0, 25.3, "Coastal/ship relay telemetry link"),
            ("bom_11", "Communication", "SIM7600G-H 4G LTE Cat-4 / GNSS HAT", "Global bands, fall-back cellular telemetry for near-shore missions", 1, 4600.0, 55.4, "High-bandwidth synced telemetry and remote mission re-tasking"),
            ("bom_12", "Power System", "LiFePO4 Deep-Cycle Battery Pack (12.8V 20Ah)", "Cold-temperature electrolyte (-20°C operational), integrated BMS", 1, 7500.0, 90.3, "Primary energy reservoir with 2500+ cycle life"),
            ("bom_13", "Power System", "Marine Flexible Monocrystalline Solar Panel (30W)", "ETFE anti-reflective coating, saltwater proof, bypass diodes", 2, 4800.0, 57.8, "Surface energy harvesting during polar summer periods"),
            ("bom_14", "Power System", "MPPT Solar Charge Controller & DC-DC Buck Converters", "98% conversion efficiency, low quiescent current (12mA)", 1, 2200.0, 26.5, "Voltage regulation for 12V bus, 5V (RPi), and 3.3V (ESP32)"),
            ("bom_15", "Structure", "Polyethylene / Aluminum Spar Buoy Hull & Keel", "Positive stability center of mass, anti-heave damping plate", 1, 14500.0, 174.6, "Wave-piercing floating structure and sensor umbilical strain relief"),
            ("bom_16", "Structure", "IP68 Marine Sealed Electronics Pod & Subconn Connectors", "Anodized marine aluminum housing, nitrogen-purged dessicant", 1, 8200.0, 98.7, "Complete waterproof protection for edge computing and power units")
        ]
        cursor.executemany("""
            INSERT INTO bom_items (
                id, category, component, specification, quantity, unitCostINR, unitCostUSD, purpose
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, default_bom)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at", DB_PATH)
