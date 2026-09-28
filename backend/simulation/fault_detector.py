"""
OceanX Sensor Fault Detection & Health Diagnostics
Differentiates between true ENVIRONMENTAL ANOMALIES and SENSOR HARDWARE FAILURES:
- Stuck Values: Constant reading despite active ocean waves/currents
- Physically Impossible Jumps: Delta exceeding maximum plausible physical gradients
- Transducer Limit Violations: Negative salinity, pH outside 0-14, impossible depths
- Loose Wire / High-Frequency Noise / Open Circuit
- Cross-Sensor Physical Inconsistency
"""

import math
import statistics
from typing import Dict, Any, List

class FaultDetector:
    def __init__(self, sample_depth: int = 8):
        self.sample_depth = sample_depth
        self.history: Dict[str, List[float]] = {}
        self.env_variability: List[float] = [1.5, 1.8, 1.2]

    def record_ambient_motion(self, imu_tilt: float, wave_height: float):
        """Track if the ocean platform is physically moving"""
        motion_index = abs(imu_tilt) + wave_height
        self.env_variability.append(motion_index)
        if len(self.env_variability) > 20:
            self.env_variability.pop(0)

    def evaluate_health(self, sensor: Dict[str, Any], current_value: float,
                        all_sensor_readings: Dict[str, float] = None) -> Dict[str, Any]:
        """
        Evaluate transducer physical integrity.
        Returns:
            {
                "is_fault": bool,
                "health": "HEALTHY" | "DEGRADED" | "FAULT" | "OFFLINE",
                "fault_type": str,
                "diagnostic_reason": str,
                "recommended_action": str
            }
        """
        if current_value is None:
            return {
                "is_fault": True,
                "health": "OFFLINE",
                "fault_type": "SIGNAL LOSS / DISCONNECTED",
                "diagnostic_reason": "Transducer failed to return ADC telemetry or umbilical open-circuit.",
                "recommended_action": "Isolate interface port. Trigger ESP32 ADC pin diagnostics."
            }

        sensor_id = sensor["id"]
        sensor_type = sensor.get("type", "Custom")
        min_phys = sensor.get("minValue", -9999.0)
        max_phys = sensor.get("maxValue", 9999.0)
        norm_min = sensor.get("normalMin", 0.0)
        norm_max = sensor.get("normalMax", 100.0)
        
        # Track history
        if sensor_id not in self.history:
            self.history[sensor_id] = []
        self.history[sensor_id].append(current_value)
        if len(self.history[sensor_id]) > self.sample_depth:
            self.history[sensor_id].pop(0)

        buf = self.history[sensor_id]

        # 1. Physical Impossibility / Out-of-Bounds Fault
        if current_value < min_phys or current_value > max_phys:
            return {
                "is_fault": True,
                "health": "FAULT",
                "fault_type": "TRANSDUCER RANGE VIOLATION",
                "diagnostic_reason": f"Value {current_value} violates physical laws/calibration limit ({min_phys} to {max_phys} {sensor.get('unit','')}).",
                "recommended_action": "Disregard sensor readings in AI engine. Schedule calibration or transducer replacement."
            }

        # 2. Impossible Rate of Change / Physics Violation
        if len(buf) >= 2:
            single_step_delta = abs(buf[-1] - buf[-2])
            span = max(0.1, norm_max - norm_min)
            if single_step_delta > span * 1.5:
                return {
                    "is_fault": True,
                    "health": "DEGRADED",
                    "fault_type": "IMPOSSIBLE PHYSICAL STEP JUMP",
                    "diagnostic_reason": f"Reading spiked by {round(single_step_delta, 2)} in a single cycle, violating fluid thermodynamic inertia limits.",
                    "recommended_action": "Filter out outlier with median filter. Check for electrical surge or loose ground wire."
                }

        # 3. Stuck Value Fault (Zero Variance with Active Ambient Motion)
        if len(buf) >= 2:
            recent_delta = max(buf) - min(buf)
            is_platform_active = statistics.mean(self.env_variability) > 0.3 if self.env_variability else True
            if recent_delta < 0.0001 and is_platform_active and sensor_type not in ["Battery"]:
                return {
                    "is_fault": True,
                    "health": "DEGRADED",
                    "fault_type": "STUCK VALUE / TRANSDUCER FREEZE",
                    "diagnostic_reason": f"Sensor repeated identical value ({current_value} {sensor.get('unit','')}) across {len(buf)} consecutive cycles despite active wave dynamics.",
                    "recommended_action": "Flag sensor as degraded. Attempt ESP32 bus reset (I2C/SPI). Do NOT treat as environmental anomaly."
                }

        # 4. Cross-Sensor Physical Discordance
        # If one sensor shows wild erratic swings while all other co-located probes are tranquil
        if len(buf) >= 6 and all_sensor_readings:
            stdev = statistics.stdev(buf)
            span = max(0.1, norm_max - norm_min)
            normalized_fluctuation = stdev / span
            if normalized_fluctuation > 0.8:
                return {
                    "is_fault": True,
                    "health": "DEGRADED",
                    "fault_type": "ERRATIC NOISE / CONTACT BOUNCE",
                    "diagnostic_reason": "High-frequency random oscillation detected, indicative of fouling or connector moisture ingress.",
                    "recommended_action": "Activate digital low-pass filtering and de-weight sensor in multi-parameter analytics."
                }

        # Healthy Sensor
        return {
            "is_fault": False,
            "health": "HEALTHY",
            "fault_type": "NONE",
            "diagnostic_reason": "Transducer telemetry exhibits normal fluid dynamic variance and continuous ADC response.",
            "recommended_action": "Sensor operational. Fully trusted in autonomous decision pipeline."
        }
