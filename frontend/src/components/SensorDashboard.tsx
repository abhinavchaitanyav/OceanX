import React, { useState } from 'react';
import { 
  Plus, 
  Settings, 
  Trash2, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Layers, 
  ShieldAlert,
  Thermometer,
  Compass,
  Battery,
  Radio,
  Gauge,
  Droplets,
  Wind
} from 'lucide-react';
import { Sensor, SensorStatus, SensorHealth } from '../types';

interface SensorDashboardProps {
  sensors: Sensor[];
  onAddSensor: () => void;
  onEditSensor: (sensor: Sensor) => void;
  onDeleteSensor: (sensorId: string) => void;
  onInjectAnomaly: (sensorId: string) => void;
  onInjectFault: (sensorId: string, type: string) => void;
  readingsHistory?: Record<string, number[]>;
}

export const SensorDashboard: React.FC<SensorDashboardProps> = ({
  sensors,
  onAddSensor,
  onEditSensor,
  onDeleteSensor,
  onInjectAnomaly,
  onInjectFault,
  readingsHistory = {}
}) => {
  const [selectedSensorFilter, setSelectedSensorFilter] = useState<string>('ALL');

  const getStatusBadge = (status: SensorStatus) => {
    switch (status) {
      case 'NORMAL':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded">NORMAL</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded">WARNING</span>;
      case 'ANOMALY':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded animate-pulse">ANOMALY</span>;
      case 'CRITICAL':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-red-500/25 text-red-400 border border-red-500/50 rounded animate-ping">CRITICAL</span>;
      case 'FAULT':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-purple-500/25 text-purple-300 border border-purple-500/50 rounded">FAULT</span>;
      case 'OFFLINE':
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-700 text-slate-400 rounded">OFFLINE</span>;
      default:
        return null;
    }
  };

  const getHealthIcon = (health: SensorHealth) => {
    if (health === 'HEALTHY') {
      return (
        <span className="flex items-center space-x-1 text-[11px] font-mono text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>HEALTHY</span>
        </span>
      );
    } else if (health === 'DEGRADED') {
      return (
        <span className="flex items-center space-x-1 text-[11px] font-mono text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>DEGRADED</span>
        </span>
      );
    } else {
      return (
        <span className="flex items-center space-x-1 text-[11px] font-mono text-purple-400">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>FAULT / ISOLATED</span>
        </span>
      );
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'Temperature': return Thermometer;
      case 'Salinity': return Droplets;
      case 'Pressure': return Gauge;
      case 'pH': return Activity;
      case 'Dissolved Oxygen': return Wind;
      case 'GNSS': return Compass;
      case 'IMU': return Layers;
      case 'Battery': return Battery;
      default: return Activity;
    }
  };

  const filteredSensors = sensors.filter(s => {
    if (selectedSensorFilter === 'ALL') return true;
    if (selectedSensorFilter === 'CRITICAL') return s.critical;
    if (selectedSensorFilter === 'ANOMALY') return s.status === 'ANOMALY' || s.status === 'CRITICAL';
    if (selectedSensorFilter === 'FAULT') return s.health !== 'HEALTHY';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl ocean-card">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-bold text-white tracking-wide">LIVE SENSOR TELEMETRY & ARRAY CONFIG</h2>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
              {sensors.length} Transducers Configured
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Generic configurable sensor engine supporting dynamic channels, threshold envelopes, and individual fault injection.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Quick Filter Pill Tabs */}
          <div className="flex bg-navy-900/90 p-1 rounded-lg border border-navy-700 text-xs font-mono">
            {['ALL', 'CRITICAL', 'ANOMALY', 'FAULT'].map(f => (
              <button
                key={f}
                onClick={() => setSelectedSensorFilter(f)}
                className={`px-3 py-1 rounded transition ${
                  selectedSensorFilter === f 
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* ADD SENSOR Button */}
          <button
            onClick={onAddSensor}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ ADD SENSOR</span>
          </button>
        </div>
      </div>

      {/* Grid of Live Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSensors.map((sensor) => {
          const Icon = getSensorIcon(sensor.type);
          const history = readingsHistory[sensor.id] || [];

          return (
            <div 
              key={sensor.id}
              className={`p-4 rounded-xl ocean-card transition-all duration-300 flex flex-col justify-between ${
                sensor.status === 'ANOMALY' || sensor.status === 'CRITICAL'
                  ? 'border-orange-500/50 shadow-lg shadow-orange-500/10'
                  : sensor.health !== 'HEALTHY'
                  ? 'border-purple-500/50 shadow-lg shadow-purple-500/10'
                  : 'ocean-card-hover'
              }`}
            >
              {/* Card Header: Icon, Name & Status Badge */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{sensor.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{sensor.type} • {sensor.depth}m</span>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(sensor.status)}
                  </div>
                </div>

                {/* Big Live Metric Readout */}
                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="text-3xl font-mono font-extrabold text-white tracking-tight">
                    {sensor.lastValue !== undefined ? Number(sensor.lastValue).toFixed(2) : '--'}
                  </span>
                  <span className="text-xs font-mono font-semibold text-cyan-400">
                    {sensor.unit}
                  </span>
                </div>

                {/* Mini Sparkline Graph */}
                <div className="mt-2 h-7 w-full flex items-end space-x-1 pt-1 border-b border-navy-800">
                  {history.length > 0 ? (
                    history.slice(-15).map((val, idx) => {
                      const span = Math.max(0.1, sensor.normalMax - sensor.normalMin);
                      const norm = Math.max(0.1, Math.min(1.0, (val - sensor.normalMin) / span));
                      const isAbnormal = val < sensor.normalMin || val > sensor.normalMax;
                      return (
                        <div
                          key={idx}
                          className={`flex-1 rounded-t-xs transition-all duration-300 ${
                            isAbnormal ? 'bg-orange-400' : 'bg-cyan-500/50'
                          }`}
                          style={{ height: `${Math.max(15, norm * 100)}%` }}
                          title={`Val: ${val} ${sensor.unit}`}
                        />
                      );
                    })
                  ) : (
                    <div className="w-full text-[10px] font-mono text-slate-500 italic text-center">
                      Awaiting live samples...
                    </div>
                  )}
                </div>

                {/* Specs: Operating Range & Sampling Rate */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                  <div className="p-1.5 rounded bg-navy-900/60 border border-navy-800">
                    <span className="text-slate-500 block text-[9px]">NORMAL RANGE</span>
                    <span className="font-semibold text-slate-200">
                      {sensor.normalMin} → {sensor.normalMax} {sensor.unit}
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-navy-900/60 border border-navy-800">
                    <span className="text-slate-500 block text-[9px]">SAMPLING</span>
                    <span className="font-semibold text-cyan-300">{sensor.samplingInterval}s</span>
                  </div>
                </div>

                {/* Sensor Health Status */}
                <div className="mt-3 flex items-center justify-between border-t border-navy-800 pt-2 text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">HEALTH:</span>
                  {getHealthIcon(sensor.health)}
                </div>

                {/* AI Diagnosis snippet if present */}
                {sensor.diagnosis && sensor.status !== 'NORMAL' && (
                  <div className="mt-2 p-2 rounded bg-navy-900/80 border border-amber-500/30 text-[10px] font-mono text-amber-300/90 leading-tight">
                    {sensor.diagnosis}
                  </div>
                )}
              </div>

              {/* Card Footer: Quick Actions (Anomaly, Fault, Edit, Delete) */}
              <div className="mt-4 pt-2 border-t border-navy-800 flex items-center justify-between gap-1 text-xs">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onInjectAnomaly(sensor.id)}
                    className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-mono font-semibold transition"
                    title="Simulate sudden environmental anomaly on this sensor"
                  >
                    +Anomaly
                  </button>
                  <button
                    onClick={() => onInjectFault(sensor.id, 'STUCK')}
                    className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-[10px] font-mono font-semibold transition"
                    title="Simulate stuck hardware value"
                  >
                    +Stuck Fault
                  </button>
                </div>

                <div className="flex items-center space-x-1 text-slate-400">
                  <button
                    onClick={() => onEditSensor(sensor)}
                    className="p-1 hover:text-cyan-300 transition"
                    title="Edit sensor configuration"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteSensor(sensor.id)}
                    className="p-1 hover:text-red-400 transition"
                    title="Delete sensor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
