"""
OceanX Physics-Based Sensor Simulator
Simulates realistic polar and southern ocean conditions:
- Depth gradient & hydrostatic pressure
- Diurnal temperature cycles & wave motion
- Chemical equilibrium (Salinity, pH, Dissolved Oxygen)
- Noise, injected anomalies, and sensor faults
"""

import math
import random
import time
from typing import Dict, Any, List

class SensorSimulator:
    def __init__(self):
        # Global Ocean Environmental Variables
        self.sea_surface_temp = 2.4      # °C
        self.ocean_current_speed = 1.2    # knots / m/s
        self.wave_height = 1.8           # meters
        self.current_depth = 45.0        # meters
        self.solar_irradiance = 65.0     # % (0-100)
        self.sea_state = 3               # Douglas sea scale (0-9)
        
        # Internal simulation clock
        self.sim_time = 0.0
        
        # Fault and Anomaly states (keyed by sensor_id)
        # Type: 'NORMAL', 'ANOMALY', 'STUCK', 'IMPOSSIBLE_JUMP', 'ERRATIC_NOISE', 'OFFLINE'
        self.active_injections: Dict[str, Dict[str, Any]] = {}
        
        # History for stuck value and rolling stats
        self.history: Dict[str, List[float]] = {}

    def set_environment(self, surface_temp: float = None, current_speed: float = None,
                        wave_height: float = None, depth: float = None,
                        solar: float = None):
        if surface_temp is not None:
            self.sea_surface_temp = float(surface_temp)
        if current_speed is not None:
            self.ocean_current_speed = float(current_speed)
        if wave_height is not None:
            self.wave_height = float(wave_height)
        if depth is not None:
            self.current_depth = float(depth)
        if solar is not None:
            self.solar_irradiance = float(solar)

    def inject_event(self, sensor_id: str, event_type: str, magnitude: float = 0.0, duration: float = 60.0):
        """
        Inject an anomaly or fault into a specific sensor:
        - 'ANOMALY': Physical environmental spike/plume
        - 'STUCK': Sensor freezing on last value
        - 'IMPOSSIBLE_JUMP': Physical impossibility (e.g. +35°C in 1 sec)
        - 'ERRATIC_NOISE': Loose wire / high variance fault
        - 'OFFLINE': Disconnected
        """
        self.active_injections[sensor_id] = {
            "type": event_type,
            "magnitude": magnitude,
            "start_time": self.sim_time,
            "duration": duration,
            "fixed_value": self.history.get(sensor_id, [0.0])[-1] if self.history.get(sensor_id) else 0.0
        }

    def clear_injection(self, sensor_id: str = None):
        if sensor_id:
            self.active_injections.pop(sensor_id, None)
        else:
            self.active_injections.clear()

    def step(self, dt: float = 1.0) -> None:
        self.sim_time += dt

    def generate_reading(self, sensor: Dict[str, Any]) -> float:
        sensor_id = sensor["id"]
        sensor_type = sensor.get("type", "Custom")
        base_min = sensor.get("minValue", 0.0)
        base_max = sensor.get("maxValue", 100.0)
        norm_min = sensor.get("normalMin", 20.0)
        norm_max = sensor.get("normalMax", 80.0)
        noise_level = sensor.get("noiseLevel", 0.1)
        sensor_depth = sensor.get("depth", self.current_depth)
        
        t = self.sim_time
        
        # Check active injection
        injection = self.active_injections.get(sensor_id)
        if injection:
            inj_type = injection["type"]
            if inj_type == "STUCK":
                val = injection["fixed_value"]
                self._record_history(sensor_id, val)
                return round(val, 3)
            elif inj_type == "OFFLINE":
                return None
            elif inj_type == "IMPOSSIBLE_JUMP":
                # Unrealistic physical spike far beyond physical limits
                val = norm_max + 35.0 + random.uniform(-1, 1)
                self._record_history(sensor_id, val)
                return round(val, 3)
            elif inj_type == "ERRATIC_NOISE":
                val = random.uniform(base_min, base_max)
                self._record_history(sensor_id, val)
                return round(val, 3)

        # Baseline physical models
        if sensor_type == "Temperature":
            # Polar thermocline: decreases with depth, diurnal sun effect
            depth_attenuation = 0.025 * sensor_depth
            diurnal = 0.35 * math.sin(t * 0.05)
            wave_oscillation = 0.08 * math.sin(t * 0.4)
            base = self.sea_surface_temp - depth_attenuation + diurnal + wave_oscillation
            noise = random.gauss(0, noise_level)
            val = base + noise
            if injection and injection["type"] == "ANOMALY":
                val += injection.get("magnitude", 6.8)

        elif sensor_type == "Salinity":
            # Halocline in polar seas: 33.8 to 34.6 PSU standard, increases with depth
            base = 34.1 + (sensor_depth * 0.008) + 0.12 * math.sin(t * 0.03)
            noise = random.gauss(0, noise_level)
            val = base + noise
            if injection and injection["type"] == "ANOMALY":
                val += injection.get("magnitude", 4.5)

        elif sensor_type == "Pressure":
            # Hydrostatic equation: P = P_atm + rho * g * h / 10000 dbar
            # ~ 1 dbar per meter depth + wave heave
            wave_heave = (self.wave_height * 0.5) * math.sin(t * 0.8)
            base = 1.013 + (sensor_depth + wave_heave) * 1.008
            noise = random.gauss(0, noise_level)
            val = max(0.0, base + noise)
            if injection and injection["type"] == "ANOMALY":
                val += injection.get("magnitude", 45.0)

        elif sensor_type == "pH":
            # Ocean carbonate equilibrium (7.85 - 8.25), slightly drops at depth
            base = 8.15 - (sensor_depth * 0.0015) + 0.02 * math.sin(t * 0.04)
            noise = random.gauss(0, noise_level)
            val = base + noise
            if injection and injection["type"] == "ANOMALY":
                val -= injection.get("magnitude", 0.85) # Acidification event

        elif sensor_type == "Dissolved Oxygen":
            # Cold polar waters hold high DO (7.5 - 9.5 mg/L), inversely related to temperature
            temp_effect = -0.22 * (self.sea_surface_temp - 2.0)
            base = 8.2 + temp_effect - (sensor_depth * 0.01) + 0.15 * math.sin(t * 0.05)
            noise = random.gauss(0, noise_level)
            val = max(0.1, base + noise)
            if injection and injection["type"] == "ANOMALY":
                val -= injection.get("magnitude", 3.8) # Hypoxia event

        elif sensor_type == "GNSS":
            # Drift velocity due to ocean current and wind
            base = self.ocean_current_speed * 0.85 + 0.2 * math.sin(t * 0.1)
            noise = random.gauss(0, noise_level)
            val = max(0.0, base + noise)

        elif sensor_type == "IMU":
            # Pitch/Roll amplitude driven by sea state and wave height
            base = (self.wave_height * 2.8) * math.sin(t * 0.9)
            noise = random.gauss(0, noise_level)
            val = base + noise

        elif sensor_type == "Battery":
            # Battery state passed through or simulated
            base = sensor.get("lastValue", 85.0)
            val = base

        else:
            # Custom generic sensor
            mid = (norm_min + norm_max) / 2.0
            span = (norm_max - norm_min) * 0.25
            base = mid + span * math.sin(t * 0.05)
            noise = random.gauss(0, noise_level)
            val = base + noise
            if injection and injection["type"] == "ANOMALY":
                val += injection.get("magnitude", span * 2.0)

        # Enforce physical floor and ceiling clamp
        val = max(base_min - 2.0, min(base_max + 10.0, val))
        val = round(val, 3)
        self._record_history(sensor_id, val)
        return val

    def _record_history(self, sensor_id: str, value: float):
        if sensor_id not in self.history:
            self.history[sensor_id] = []
        self.history[sensor_id].append(value)
        if len(self.history[sensor_id]) > 50:
            self.history[sensor_id].pop(0)
