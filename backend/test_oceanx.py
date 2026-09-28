"""
Automated Test Suite for OceanX Virtual Prototype & Autonomous Decision Engine
Smart India Hackathon 2026 - Problem Statement 26065
Team: Coders May Cry (CMC)
"""

import unittest
import json
import time
from main import app, mission_state, energy_model, comm_sim, simulator
from database.db import init_db, get_db_connection

class TestOceanXSystem(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = app.test_client()

    def setUp(self):
        # Reset mission to nominal before each test
        self.client.post('/api/mission/reset')

    def test_01_health_check(self):
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "online")
        self.assertEqual(data["problem_statement_id"], 26065)
        self.assertEqual(data["team"], "Coders May Cry (CMC)")

    def test_02_get_sensors(self):
        res = self.client.get('/api/sensors')
        self.assertEqual(res.status_code, 200)
        sensors = res.get_json()
        self.assertGreaterEqual(len(sensors), 8)
        names = [s["name"] for s in sensors]
        self.assertIn("Water Temperature", names)
        self.assertIn("Conductivity / Salinity", names)
        self.assertIn("Hydrostatic Pressure / Depth", names)
        self.assertIn("Dissolved Oxygen", names)

    def test_03_sensor_validation(self):
        # Reject invalid range: min >= max
        bad_payload = {
            "name": "Invalid Sensor",
            "type": "Custom",
            "unit": "X",
            "minValue": 50,
            "maxValue": 10,
            "normalMin": 20,
            "normalMax": 30
        }
        res = self.client.post('/api/sensors', json=bad_payload)
        self.assertEqual(res.status_code, 400)
        self.assertIn("error", res.get_json())

        # Accept valid custom sensor
        good_payload = {
            "name": "Optical Turbidity",
            "type": "Turbidity",
            "unit": "NTU",
            "minValue": 0.0,
            "maxValue": 100.0,
            "normalMin": 0.5,
            "normalMax": 15.0,
            "samplingInterval": 60,
            "noiseLevel": 0.1,
            "critical": False,
            "depth": 12.0
        }
        res = self.client.post('/api/sensors', json=good_payload)
        self.assertEqual(res.status_code, 201)
        self.assertTrue(res.get_json()["success"])

    def test_04_anomaly_detection_and_adaptive_sampling(self):
        # Inject sudden temperature anomaly (+8.0°C)
        res = self.client.post('/api/simulation/anomaly', json={"sensorId": "temp_1", "magnitude": 8.0})
        self.assertEqual(res.status_code, 200)

        # Query simulation state
        res_state = self.client.get('/api/simulation/state')
        state = res_state.get_json()
        
        # Verify AI detected anomaly and accelerated sampling to 10s
        self.assertEqual(state["mission"]["current_sampling_interval"], 10)
        self.assertGreater(state["mission"]["overall_anomaly_score"], 0.4)
        self.assertIn("ANOMALY", state["mission"]["ai_decision"])

    def test_05_sensor_fault_isolation(self):
        # Reset then inject STUCK sensor failure
        self.client.post('/api/mission/reset')
        res = self.client.post('/api/simulation/fault', json={"sensorId": "temp_1", "faultType": "STUCK"})
        self.assertEqual(res.status_code, 200)
        
        # Run second cycle to confirm stuck value across consecutive readings
        from main import run_sensor_acquisition_cycle
        run_sensor_acquisition_cycle()

        # Query sensors
        res_sensors = self.client.get('/api/sensors')
        sensors = res_sensors.get_json()
        temp_s = next(s for s in sensors if s["id"] == "temp_1")
        
        # Transducer must be marked DEGRADED, not raised as a false environmental alarm
        self.assertEqual(temp_s["health"], "DEGRADED")
        self.assertEqual(temp_s["status"], "FAULT")

    def test_06_communication_loss_and_store_forward(self):
        # Set communication to OFFLINE
        res = self.client.post('/api/simulation/communication-loss')
        self.assertEqual(res.status_code, 200)

        state = self.client.get('/api/simulation/state').get_json()
        self.assertEqual(state["communication"]["link_status"], "OFFLINE")

        # Simulate generating readings while offline
        from main import run_sensor_acquisition_cycle
        run_sensor_acquisition_cycle()
        run_sensor_acquisition_cycle()

        # Buffer must have queued readings with ZERO data loss
        buffer_len = comm_sim.get_buffer_count()
        self.assertGreater(buffer_len, 0)
        self.assertEqual(comm_sim.data_loss_count, 0)

        # Restore communication & sync
        res_restore = self.client.post('/api/simulation/communication-restore')
        self.assertEqual(res_restore.status_code, 200)
        restore_data = res_restore.get_json()
        self.assertGreater(restore_data["synchronized"], 0)
        self.assertEqual(comm_sim.get_buffer_count(), 0) # Buffer drained to 0

    def test_07_low_battery_power_saving(self):
        # Simulate battery dropping to 18%
        res = self.client.post('/api/simulation/low-battery')
        self.assertEqual(res.status_code, 200)

        state = self.client.get('/api/simulation/state').get_json()
        # Battery must reflect low SOC and sampling must throttle to 120s
        self.assertLess(state["energy"]["battery_pct"], 20.0)
        self.assertEqual(state["mission"]["current_sampling_interval"], 120)
        self.assertIn("POWER SAVING", state["mission"]["ai_decision"])

    def test_08_csv_export(self):
        res = self.client.get('/api/export/csv')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.mimetype, "text/csv")
        csv_text = res.get_data(as_text=True)
        self.assertIn("Timestamp,Sensor ID,Sensor Name", csv_text)

    def test_09_bom_calculation(self):
        res = self.client.get('/api/bom')
        self.assertEqual(res.status_code, 200)
        bom_data = res.get_json()
        self.assertGreater(len(bom_data["items"]), 10)
        self.assertGreater(bom_data["totalCostINR"], 50000)
        self.assertGreater(bom_data["totalCostUSD"], 500)

if __name__ == "__main__":
    unittest.main()
