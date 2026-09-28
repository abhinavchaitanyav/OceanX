"""
OceanX Power Management & Energy Model
Simulates:
- LiFePO4 battery dynamics (12.8V 20Ah = 256 Wh capacity)
- Solar energy harvesting via MPPT controller
- Variable power consumption driven by Adaptive Sampling and Edge Compute
- Power-Saving Mode logic and energy conservation statistics
"""

import math
from typing import Dict, Any

class EnergyModel:
    def __init__(self, capacity_wh: float = 256.0, initial_soc: float = 84.5):
        self.capacity_wh = capacity_wh
        self.soc = initial_soc  # State of charge (%)
        self.current_wh = (initial_soc / 100.0) * capacity_wh
        
        # Power parameters
        self.solar_irradiance_pct = 65.0 # 0 to 100%
        self.solar_max_watts = 30.0      # 30W solar panel rating
        self.mppt_efficiency = 0.94      # 94% MPPT conversion
        
        # Power modes: "NORMAL", "HIGH_PERFORMANCE", "POWER_SAVING", "CRITICAL_HIBERNATION"
        self.power_mode = "NORMAL"
        
        # Statistics for energy conservation comparison
        self.total_adaptive_energy_wh = 0.0
        self.total_fixed_energy_wh = 0.0
        self.total_observations = 0
        self.total_transmissions = 0

    def set_solar(self, pct: float):
        self.solar_irradiance_pct = max(0.0, min(100.0, float(pct)))

    def set_battery(self, pct: float):
        self.soc = max(0.0, min(100.0, float(pct)))
        self.current_wh = (self.soc / 100.0) * self.capacity_wh

    def update(self, sampling_interval: int, is_transmitting: bool, dt_seconds: float = 1.0) -> Dict[str, Any]:
        """
        Step the energy state machine.
        sampling_interval: 10s (anomaly), 60s (normal), 120s (power-saving)
        """
        # 1. Calculate Solar Inflow (W)
        # Solar radiation drops with low angle or clouds
        solar_watts = (self.solar_irradiance_pct / 100.0) * self.solar_max_watts * self.mppt_efficiency
        
        # 2. Calculate System Power Consumption (W)
        # Components: ESP32-S3 (0.5W), RPi 5 compute, sensors, comms
        if sampling_interval <= 10:
            # High-performance anomaly mode
            edge_compute_w = 4.2
            sensor_draw_w = 1.6
            comms_w = 2.4 if is_transmitting else 0.4
        elif sampling_interval >= 120:
            # Low-power conservation mode (cores sleep between reads)
            edge_compute_w = 1.2
            sensor_draw_w = 0.5
            comms_w = 0.8 if is_transmitting else 0.1
        else:
            # Standard 60s observation mode
            edge_compute_w = 2.5
            sensor_draw_w = 0.9
            comms_w = 1.5 if is_transmitting else 0.2

        esp32_base_w = 0.4
        total_consumption_w = esp32_base_w + edge_compute_w + sensor_draw_w + comms_w
        
        # Baseline comparison: if running fixed 60s forever
        fixed_consumption_w = esp32_base_w + 2.5 + 0.9 + 1.5

        # 3. Energy Balance Delta
        net_power_w = solar_watts - total_consumption_w
        delta_wh = (net_power_w * (dt_seconds / 3600.0))
        
        self.current_wh = max(0.0, min(self.capacity_wh, self.current_wh + delta_wh))
        self.soc = round((self.current_wh / self.capacity_wh) * 100.0, 1)

        # Track cumulative comparison
        self.total_adaptive_energy_wh += total_consumption_w * (dt_seconds / 3600.0)
        self.total_fixed_energy_wh += fixed_consumption_w * (dt_seconds / 3600.0)

        # 4. Determine Power Mode & Battery Health
        if self.soc < 15.0:
            self.power_mode = "CRITICAL_HIBERNATION"
            recommended_sampling = 180
            reason = "Battery critically low (<15%). Emergency deep sleep activated."
        elif self.soc < 25.0:
            self.power_mode = "POWER_SAVING"
            recommended_sampling = 120
            reason = "Battery below 25% threshold. Entering energy preservation mode (120s sampling)."
        elif sampling_interval <= 15:
            self.power_mode = "HIGH_PERFORMANCE"
            recommended_sampling = 10
            reason = "Active environmental anomaly. Edge AI acceleration running."
        else:
            self.power_mode = "NORMAL"
            recommended_sampling = 60
            reason = "Nominal power balance. Normal 60s sampling active."

        # 5. Estimated Runtime
        if net_power_w < -0.01:
            discharge_rate = abs(net_power_w)
            runtime_hours = round(self.current_wh / discharge_rate, 1)
        else:
            runtime_hours = 999.0 # Self-sustaining or net-positive

        # Calculate energy savings percentage
        energy_saved_pct = 0.0
        if self.total_fixed_energy_wh > 0.01:
            diff = self.total_fixed_energy_wh - self.total_adaptive_energy_wh
            energy_saved_pct = round(max(0.0, (diff / self.total_fixed_energy_wh) * 100.0), 1)

        return {
            "battery_pct": self.soc,
            "current_wh": round(self.current_wh, 1),
            "capacity_wh": self.capacity_wh,
            "solar_watts": round(solar_watts, 2),
            "consumption_watts": round(total_consumption_w, 2),
            "net_power_watts": round(net_power_w, 2),
            "power_mode": self.power_mode,
            "recommended_sampling": recommended_sampling,
            "runtime_hours": runtime_hours,
            "reason": reason,
            "solar_irradiance_pct": self.solar_irradiance_pct,
            "energy_saved_pct": energy_saved_pct,
            "adaptive_wh": round(self.total_adaptive_energy_wh, 3),
            "fixed_wh": round(self.total_fixed_energy_wh, 3)
        }
