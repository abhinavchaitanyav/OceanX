export type SensorType = 
  | 'Temperature' 
  | 'Salinity' 
  | 'Pressure' 
  | 'pH' 
  | 'Dissolved Oxygen' 
  | 'GNSS' 
  | 'IMU' 
  | 'Battery' 
  | 'Turbidity' 
  | 'Custom';

export type SensorStatus = 'NORMAL' | 'WARNING' | 'ANOMALY' | 'CRITICAL' | 'FAULT' | 'OFFLINE';

export type SensorHealth = 'HEALTHY' | 'DEGRADED' | 'FAULT' | 'OFFLINE';

export type CommunicationStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE';

export type PowerMode = 'NORMAL' | 'HIGH_PERFORMANCE' | 'POWER_SAVING' | 'CRITICAL_HIBERNATION';

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  unit: string;
  minValue: number;
  maxValue: number;
  normalMin: number;
  normalMax: number;
  warningThreshold: number;
  criticalThreshold: number;
  samplingInterval: number; // in seconds (e.g. 10, 60, 120)
  noiseLevel: number;
  enabled: boolean | number;
  critical: boolean | number;
  depth: number;
  status: SensorStatus;
  health: SensorHealth;
  lastValue: number;
  lastUpdated?: string;
  diagnosis?: string;
  action?: string;
}

export interface TelemetryReading {
  timestamp: string;
  sensorId: string;
  sensorName: string;
  value: number;
  unit: string;
  status: SensorStatus;
  health: SensorHealth;
  anomalyScore: number;
  latitude: number;
  longitude: number;
  depth: number;
  samplingInterval: number;
  syncedFromBuffer?: boolean | number;
  diagnosis?: string;
  action?: string;
  classification?: string;
}

export interface MissionPosition {
  latitude: number;
  longitude: number;
  location_name: string;
  heading: number;
  drift_speed_knots: number;
}

export interface MissionState {
  is_active: boolean;
  is_paused: boolean;
  mission_name: string;
  start_timestamp: number;
  elapsed_seconds: number;
  formatted_elapsed_time?: string;
  current_sampling_interval: number;
  previous_sampling_interval: number;
  sampling_change_reason: string;
  ai_decision: string;
  ai_environmental_state: 'NORMAL' | 'ELEVATED' | 'ANOMALY' | 'CRITICAL';
  overall_anomaly_score: number;
  position: MissionPosition;
  current_depth: number;
  active_scenario: string;
  sih_demo_active: boolean;
  sih_demo_step: number;
}

export interface EnergyState {
  battery_pct: number;
  current_wh: number;
  capacity_wh: number;
  solar_watts: number;
  consumption_watts: number;
  net_power_watts: number;
  power_mode: PowerMode;
  recommended_sampling: number;
  runtime_hours: number;
  reason: string;
  solar_irradiance_pct: number;
  energy_saved_pct: number;
  adaptive_wh: number;
  fixed_wh: number;
}

export interface CommunicationState {
  link_status: CommunicationStatus;
  signal_strength_dbm: number;
  packet_success_rate: number;
  incoming_observations: number;
  buffered_locally: number;
  synchronized_total: number;
  data_loss: number;
  store_forward_active: boolean;
  bearer: string;
}

export interface EnvironmentState {
  sea_surface_temp: number;
  ocean_current_speed: number;
  wave_height: number;
  current_depth: number;
  solar_irradiance: number;
  sea_state: number;
}

export interface MissionEvent {
  id: number;
  timestamp: string;
  category: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  metadata?: Record<string, any>;
}

export interface BOMItem {
  id: string;
  category: string;
  component: string;
  specification: string;
  quantity: number;
  unitCostINR: number;
  unitCostUSD: number;
  purpose: string;
}
