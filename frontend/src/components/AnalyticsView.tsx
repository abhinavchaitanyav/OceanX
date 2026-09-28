import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Radio, 
  Zap, 
  Activity, 
  Clock, 
  FileText,
  TrendingDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import { TelemetryReading, Sensor, EnergyState, CommunicationState, MissionState } from '../types';

interface AnalyticsViewProps {
  syncedReadings: TelemetryReading[];
  sensors: Sensor[];
  energy: EnergyState;
  communication: CommunicationState;
  mission: MissionState;
  onExportCSV: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  syncedReadings,
  sensors,
  energy,
  communication,
  mission,
  onExportCSV
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'temp_sal' | 'do_ph' | 'energy'>('temp_sal');

  // Format data for Recharts (group recent readings by timestamp)
  const chartDataMap: Record<string, any> = {};
  syncedReadings.slice(-60).forEach(r => {
    if (!chartDataMap[r.timestamp]) {
      chartDataMap[r.timestamp] = { time: r.timestamp };
    }
    if (r.sensorId === 'temp_1') chartDataMap[r.timestamp].temp = r.value;
    if (r.sensorId === 'sal_1') chartDataMap[r.timestamp].salinity = r.value;
    if (r.sensorId === 'do_1') chartDataMap[r.timestamp].do = r.value;
    if (r.sensorId === 'ph_1') chartDataMap[r.timestamp].ph = r.value;
    if (r.sensorId === 'batt_1') chartDataMap[r.timestamp].battery = r.value;
    chartDataMap[r.timestamp].sampling = r.samplingInterval;
  });

  const chartData = Object.values(chartDataMap);

  const totalObs = communication.incoming_observations;
  const anomaliesCount = syncedReadings.filter(r => r.status === 'ANOMALY' || r.status === 'CRITICAL').length;
  const faultsCount = syncedReadings.filter(r => r.health !== 'HEALTHY').length;
  const validCount = Math.max(0, totalObs - faultsCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl ocean-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              MISSION TELEMETRY ANALYTICS & PERFORMANCE REPORT
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
              Auditable Research Data
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time data warehouse: multi-parameter ocean trends, adaptive power savings, and zero-loss audit logs.
          </p>
        </div>

        <button
          onClick={onExportCSV}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 transition active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT TELEMETRY CSV</span>
        </button>
      </div>

      {/* 4 Summary Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl ocean-card">
          <span className="text-slate-400 text-[11px] block">TOTAL OBSERVATIONS</span>
          <span className="text-2xl font-bold text-white mt-1 block">{totalObs}</span>
          <span className="text-[10px] text-emerald-400 block mt-1">
            {totalObs > 0 ? `${Math.round((validCount / totalObs) * 100)}% Verified Valid` : 'Streaming...'}
          </span>
        </div>

        <div className="p-4 rounded-xl ocean-card">
          <span className="text-slate-400 text-[11px] block">ANOMALIES DETECTED</span>
          <span className="text-2xl font-bold text-orange-400 mt-1 block">{anomaliesCount}</span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Triggered 10s Adaptive Sampling
          </span>
        </div>

        <div className="p-4 rounded-xl ocean-card">
          <span className="text-slate-400 text-[11px] block">HARDWARE FAULTS ISOLATED</span>
          <span className="text-2xl font-bold text-purple-400 mt-1 block">{faultsCount}</span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Zero False Environmental Alarms
          </span>
        </div>

        <div className="p-4 rounded-xl ocean-card">
          <span className="text-slate-400 text-[11px] block">ENERGY CONSERVED</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">
            {energy.energy_saved_pct > 0 ? `+${energy.energy_saved_pct}%` : 'Baseline'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Adaptive vs Fixed 60s
          </span>
        </div>
      </div>

      {/* Main Historical Graphs (Recharts) */}
      <div className="p-5 rounded-xl ocean-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-800 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">LIVE HISTORICAL TIME-SERIES</h3>
          </div>

          {/* Graph Tabs */}
          <div className="flex bg-navy-900/90 p-1 rounded-lg border border-navy-700 text-xs font-mono">
            <button
              onClick={() => setActiveChartTab('temp_sal')}
              className={`px-3 py-1 rounded transition ${activeChartTab === 'temp_sal' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Temperature & Salinity
            </button>
            <button
              onClick={() => setActiveChartTab('do_ph')}
              className={`px-3 py-1 rounded transition ${activeChartTab === 'do_ph' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              DO & pH
            </button>
            <button
              onClick={() => setActiveChartTab('energy')}
              className={`px-3 py-1 rounded transition ${activeChartTab === 'energy' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Battery SOC & Sampling Interval
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {activeChartTab === 'temp_sal' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#112240" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#38bdf8" fontSize={10} tickLine={false} domain={[-2, 14]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#818cf8" fontSize={10} tickLine={false} domain={[25, 45]} />
                  <Tooltip contentStyle={{ backgroundColor: '#081326', borderColor: '#1d3557', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Line yAxisId="left" type="monotone" dataKey="temp" name="Water Temp (°C)" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="salinity" name="Salinity (PSU)" stroke="#818cf8" strokeWidth={2} dot={false} />
                </LineChart>
              ) : activeChartTab === 'do_ph' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#112240" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#34d399" fontSize={10} tickLine={false} domain={[0, 16]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#f472b6" fontSize={10} tickLine={false} domain={[6, 9.5]} />
                  <Tooltip contentStyle={{ backgroundColor: '#081326', borderColor: '#1d3557', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Line yAxisId="left" type="monotone" dataKey="do" name="Dissolved Oxygen (mg/L)" stroke="#34d399" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="ph" name="pH" stroke="#f472b6" strokeWidth={2} dot={false} />
                </LineChart>
              ) : (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#112240" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#10b981" fontSize={10} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#081326', borderColor: '#1d3557', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Area type="monotone" dataKey="battery" name="Battery SOC (%)" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  <Line type="stepAfter" dataKey="sampling" name="Sampling Interval (s)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500">
              Awaiting mission telemetry samples...
            </div>
          )}
        </div>
      </div>

      {/* Live Mission Telemetry Log Table */}
      <div className="p-5 rounded-xl ocean-card space-y-3">
        <div className="flex items-center justify-between border-b border-navy-800 pb-2">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white font-mono uppercase">
              RECENT TELEMETRY OBSERVATIONS (STORE & FORWARD AUDIT)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing latest {Math.min(10, syncedReadings.length)} rows
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-navy-800 text-slate-400 text-[11px]">
                <th className="pb-2">TIME</th>
                <th className="pb-2">SENSOR</th>
                <th className="pb-2">VALUE</th>
                <th className="pb-2">STATUS</th>
                <th className="pb-2">HEALTH</th>
                <th className="pb-2">INTERVAL</th>
                <th className="pb-2 text-right">SYNC PROVENANCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 text-slate-200">
              {syncedReadings.slice(-10).reverse().map((r, i) => (
                <tr key={i} className="hover:bg-navy-900/40 transition">
                  <td className="py-2 text-slate-400">{r.timestamp}</td>
                  <td className="py-2 font-bold text-white">{r.sensorName}</td>
                  <td className="py-2 text-cyan-300 font-semibold">{r.value} {r.unit}</td>
                  <td className="py-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      r.status === 'NORMAL' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      r.health === 'HEALTHY' ? 'text-emerald-400' : 'text-purple-400'
                    }`}>
                      {r.health}
                    </span>
                  </td>
                  <td className="py-2 text-slate-300">{r.samplingInterval}s</td>
                  <td className="py-2 text-right">
                    {r.syncedFromBuffer ? (
                      <span className="text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                        SYNCED FROM BUFFER
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400">
                        DIRECT ONLINE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
