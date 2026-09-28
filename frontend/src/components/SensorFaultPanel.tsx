import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { Sensor, SensorHealth } from '../types';

interface SensorFaultPanelProps {
  sensors: Sensor[];
  onInjectFault: (sensorId: string, faultType: string) => void;
  onClearFaults: () => void;
}

export const SensorFaultPanel: React.FC<SensorFaultPanelProps> = ({
  sensors,
  onInjectFault,
  onClearFaults
}) => {
  const faultySensors = sensors.filter(s => s.health !== 'HEALTHY');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl ocean-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">SENSOR FAULT DETECTION & TRANSDUCER ISOLATION</h2>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded">
              High-Integrity Marine Diagnostics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Distinguishing true environmental dynamic events from hardware failure, transducer freeze, and electrical noise.
          </p>
        </div>

        <button
          onClick={onClearFaults}
          className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-850 text-slate-300 border border-navy-700 text-xs font-mono flex items-center space-x-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Transducer Diagnostics</span>
        </button>
      </div>

      {/* Critical Concept Callout: Environmental Anomaly vs Sensor Failure */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-purple-950/40 via-navy-900 to-navy-950 border border-purple-500/40 space-y-3">
        <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs font-mono uppercase tracking-wider">
          <Info className="w-4 h-4 text-purple-400" />
          <span>CORE SIH EVALUATION CRITERIA: ANOMALY VS HARDWARE FAILURE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-navy-950/70 border border-amber-500/30 space-y-1.5">
            <span className="font-mono font-bold text-amber-300 flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>ENVIRONMENTAL ANOMALY</span>
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Actual physical oceanographic event (e.g. hydrothermal plume, brine rejection, upwelling). Readings change rapidly but remain physically plausible and correlate across multi-parameter transducers.
            </p>
            <div className="pt-1 text-[10px] font-mono text-amber-400">
              Autonomous Action: <strong className="text-white">Accelerate Sampling (60s → 10s)</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-navy-950/70 border border-purple-500/30 space-y-1.5">
            <span className="font-mono font-bold text-purple-300 flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>SENSOR HARDWARE FAILURE</span>
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Transducer freeze (stuck ADC value), open-circuit step jump, bio-fouling, or umbilical disconnection. Zero variance despite active wave motion, or violation of fluid thermodynamic inertia.
            </p>
            <div className="pt-1 text-[10px] font-mono text-purple-400">
              Autonomous Action: <strong className="text-white">Isolate Channel; Maintain Normal 60s Sampling</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Failure Injection Scenarios for Judges */}
      <div className="p-5 rounded-xl ocean-card space-y-4">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-sm text-white">INTERACTIVE TRANSDUCER FAULT INJECTION (TEST LIVE)</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Click to inject hardware failures</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          
          {/* Fault 1: Stuck Value */}
          <button
            onClick={() => onInjectFault('temp_1', 'STUCK')}
            className="p-3 rounded-lg bg-navy-900/80 hover:bg-purple-950/30 border border-navy-700 hover:border-purple-500/50 text-left transition space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-purple-300 font-bold">
              <span>STUCK VALUE (FREEZE)</span>
              <span className="text-[10px] text-slate-400 group-hover:text-purple-400">Inject →</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Temperature sensor freezes at exactly 2.400°C across consecutive cycles while wave heave is active.
            </p>
            <span className="text-[10px] text-purple-400 block font-semibold">Test zero variance logic</span>
          </button>

          {/* Fault 2: Impossible Step Jump */}
          <button
            onClick={() => onInjectFault('sal_1', 'IMPOSSIBLE_JUMP')}
            className="p-3 rounded-lg bg-navy-900/80 hover:bg-purple-950/30 border border-navy-700 hover:border-purple-500/50 text-left transition space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-purple-300 font-bold">
              <span>IMPOSSIBLE STEP JUMP</span>
              <span className="text-[10px] text-slate-400 group-hover:text-purple-400">Inject →</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Salinity jumps +35 PSU in 1s cycle, violating maximum plausible fluid mass diffusion rates.
            </p>
            <span className="text-[10px] text-purple-400 block font-semibold">Test physical inertia limits</span>
          </button>

          {/* Fault 3: High-Frequency Erratic Noise */}
          <button
            onClick={() => onInjectFault('do_1', 'ERRATIC_NOISE')}
            className="p-3 rounded-lg bg-navy-900/80 hover:bg-purple-950/30 border border-navy-700 hover:border-purple-500/50 text-left transition space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-purple-300 font-bold">
              <span>ERRATIC CONTACT BOUNCE</span>
              <span className="text-[10px] text-slate-400 group-hover:text-purple-400">Inject →</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Optical DO probe oscillates wildly between 0 and 16 mg/L, simulating connector water ingress.
            </p>
            <span className="text-[10px] text-purple-400 block font-semibold">Test high-variance filtering</span>
          </button>

          {/* Fault 4: Disconnect / Offline */}
          <button
            onClick={() => onInjectFault('ph_1', 'OFFLINE')}
            className="p-3 rounded-lg bg-navy-900/80 hover:bg-purple-950/30 border border-navy-700 hover:border-purple-500/50 text-left transition space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-purple-300 font-bold">
              <span>UMBILICAL DISCONNECT</span>
              <span className="text-[10px] text-slate-400 group-hover:text-purple-400">Inject →</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              pH electrode drops completely offline (missing ADC frames / open-circuit probe).
            </p>
            <span className="text-[10px] text-purple-400 block font-semibold">Test signal-loss isolation</span>
          </button>

        </div>
      </div>

      {/* Real-Time Sensor Health Table */}
      <div className="p-5 rounded-xl ocean-card">
        <h3 className="font-bold text-sm text-white mb-3 flex items-center space-x-2">
          <span>TRANSDUCER FLEET HEALTH STATUS</span>
          <span className="text-xs font-mono text-cyan-400 font-normal">
            ({sensors.filter(s => s.health === 'HEALTHY').length} / {sensors.length} Operational)
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-navy-800 text-slate-400 text-[11px]">
                <th className="pb-2">SENSOR NAME</th>
                <th className="pb-2">CURRENT VALUE</th>
                <th className="pb-2">PHYSICAL HEALTH</th>
                <th className="pb-2">DIAGNOSTIC STATUS</th>
                <th className="pb-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 text-slate-200">
              {sensors.map(s => {
                const isHealthy = s.health === 'HEALTHY';
                return (
                  <tr key={s.id} className="hover:bg-navy-900/50 transition">
                    <td className="py-2.5 font-bold text-white flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-400' : 'bg-purple-400 animate-pulse'}`}></span>
                      <span>{s.name}</span>
                    </td>
                    <td className="py-2.5">
                      {s.lastValue !== undefined ? `${Number(s.lastValue).toFixed(2)} ${s.unit}` : 'OFFLINE'}
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isHealthy ? 'bg-emerald-500/10 text-emerald-300' : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}>
                        {s.health}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-300 text-[11px] font-sans">
                      {s.diagnosis || (isHealthy ? 'Normal fluid dynamic variance.' : 'Anomalous transducer behavior.')}
                    </td>
                    <td className="py-2.5 text-right">
                      {isHealthy ? (
                        <button
                          onClick={() => onInjectFault(s.id, 'STUCK')}
                          className="px-2 py-1 bg-navy-800 hover:bg-purple-900/40 text-purple-300 rounded text-[10px] border border-navy-700 transition"
                        >
                          Inject Fault
                        </button>
                      ) : (
                        <button
                          onClick={onClearFaults}
                          className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded text-[10px] border border-emerald-500/30 transition"
                        >
                          Clear
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
