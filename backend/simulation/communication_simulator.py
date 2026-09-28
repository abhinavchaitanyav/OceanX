"""
OceanX Communication & Store-and-Forward Simulator
Simulates:
- Multi-bearer connectivity (LoRa 868MHz + 4G LTE marine telemetry)
- Link states: ONLINE, DEGRADED, OFFLINE
- Local storage buffer in SQLite during communication blackouts
- High-integrity synchronization upon link restoration with zero data loss
"""

import time
from typing import Dict, Any, List
try:
    from database.db import get_db_connection
except ImportError:
    from ..database.db import get_db_connection

class CommunicationSimulator:
    def __init__(self):
        # Link states: "ONLINE", "DEGRADED", "OFFLINE"
        self.link_status = "ONLINE"
        self.signal_strength_dbm = -78.0  # RSSI
        self.packet_success_rate = 100.0  # %
        
        # Transmission counters
        self.incoming_observations = 0
        self.buffered_count = 0
        self.synchronized_count = 0
        self.data_loss_count = 0
        
        # Synchronization progress (0 to 100)
        self.is_syncing = False
        self.sync_progress = 100

    def set_link_status(self, status: str):
        valid = ["ONLINE", "DEGRADED", "OFFLINE"]
        if status in valid:
            self.link_status = status
            if status == "ONLINE":
                self.signal_strength_dbm = -75.0
                self.packet_success_rate = 99.8
            elif status == "DEGRADED":
                self.signal_strength_dbm = -112.0
                self.packet_success_rate = 65.0
            elif status == "OFFLINE":
                self.signal_strength_dbm = -135.0
                self.packet_success_rate = 0.0

    def process_reading(self, reading_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Routes incoming sensor observations:
        If ONLINE -> Transmits directly to main database table.
        If OFFLINE -> Buffers into local_buffer SQLite table with zero data loss.
        """
        self.incoming_observations += 1
        conn = get_db_connection()
        cursor = conn.cursor()

        if self.link_status == "ONLINE":
            # Direct transmission
            cursor.execute("""
                INSERT INTO readings (
                    timestamp, sensorId, sensorName, value, unit, status,
                    health, anomalyScore, latitude, longitude, depth, samplingInterval, syncedFromBuffer
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
            """, (
                reading_data["timestamp"], reading_data["sensorId"], reading_data["sensorName"],
                reading_data["value"], reading_data["unit"], reading_data["status"],
                reading_data["health"], reading_data["anomalyScore"], reading_data["latitude"],
                reading_data["longitude"], reading_data["depth"], reading_data["samplingInterval"]
            ))
            conn.commit()
            conn.close()
            return {"transmitted": True, "buffered": False, "status": "TRANSMITTED_ONLINE"}

        else:
            # Store-and-Forward: Queue in local flash / SQLite buffer
            cursor.execute("""
                INSERT INTO local_buffer (
                    timestamp, sensorId, sensorName, value, unit, status,
                    health, anomalyScore, latitude, longitude, depth, samplingInterval
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                reading_data["timestamp"], reading_data["sensorId"], reading_data["sensorName"],
                reading_data["value"], reading_data["unit"], reading_data["status"],
                reading_data["health"], reading_data["anomalyScore"], reading_data["latitude"],
                reading_data["longitude"], reading_data["depth"], reading_data["samplingInterval"]
            ))
            self.buffered_count += 1
            conn.commit()
            conn.close()
            return {"transmitted": False, "buffered": True, "status": "STORE_AND_FORWARD_ACTIVE"}

    def get_buffer_count(self) -> int:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM local_buffer")
        count = cursor.fetchone()["count"]
        conn.close()
        self.buffered_count = count
        return count

    def synchronize_buffer(self) -> Dict[str, Any]:
        """
        Flushes all local buffered telemetry back into the main readings table
        when communication link is restored.
        """
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM local_buffer ORDER BY id ASC")
        buffered_rows = cursor.fetchall()
        total = len(buffered_rows)
        
        if total == 0:
            conn.close()
            return {"synchronized": 0, "message": "Buffer already empty."}

        # Bulk copy to main readings table with syncedFromBuffer=1 flag
        for row in buffered_rows:
            cursor.execute("""
                INSERT INTO readings (
                    timestamp, sensorId, sensorName, value, unit, status,
                    health, anomalyScore, latitude, longitude, depth, samplingInterval, syncedFromBuffer
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            """, (
                row["timestamp"], row["sensorId"], row["sensorName"], row["value"],
                row["unit"], row["status"], row["health"], row["anomalyScore"],
                row["latitude"], row["longitude"], row["depth"], row["samplingInterval"]
            ))

        # Clear buffer
        cursor.execute("DELETE FROM local_buffer")
        conn.commit()
        conn.close()

        self.synchronized_count += total
        self.buffered_count = 0
        self.link_status = "ONLINE"
        
        return {
            "synchronized": total,
            "data_loss": 0,
            "message": f"Successfully synchronized {total} buffered observations with zero data loss."
        }

    def get_status(self) -> Dict[str, Any]:
        buffer_len = self.get_buffer_count()
        return {
            "link_status": self.link_status,
            "signal_strength_dbm": self.signal_strength_dbm,
            "packet_success_rate": self.packet_success_rate,
            "incoming_observations": self.incoming_observations,
            "buffered_locally": buffer_len,
            "synchronized_total": self.synchronized_count,
            "data_loss": 0,
            "store_forward_active": buffer_len > 0 or self.link_status == "OFFLINE",
            "bearer": "LoRa 868MHz / LTE Cat-4 Hybrid"
        }
