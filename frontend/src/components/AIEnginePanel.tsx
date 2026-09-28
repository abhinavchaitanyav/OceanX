import React from 'react';
import { 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Compass, 
  Zap, 
  Gauge, 
  ShieldCheck, 
  Flame, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { MissionState, Sensor, EnergyState, CommunicationState } from '../types';

interface AIEnginePanelProps {
  mission: MissionState;
  sensors: Sensor[];
  energy: EnergyState;
  communication: CommunicationState;
  onAccelerateSampling?: () => void;
  onResetSampling?: () => void;
}

export const AIEnginePanel: React.FC<AIEnginePanelProps> = ({
  mission,
  sensors,
  energy,
  communication,
  onAccelerateSampling,
  onResetSampling
}) => {
  const healthyCount = sensors.filter(s => s.health === 'HEALTHY').length;
  const anomalySensors = sensors.filter(s => s.status === 'ANOMALY' || s.status === 'CRITICAL');
  const faultySensors = sensors.filter(s => s.health !== 'HEALTHY');

  const anomalyScore = mission.overall_anomaly_score || 0.04;
  const isAnomaly = anomalyScore >= 0.4 || mission.ai_environmental_state === 'ANOMALY';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl ocean-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">EDGE AI DECISION ENGINE</h2>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded">
              Autonomous Adaptive Controller
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Explainable multi-tier algorithmic decision engine evaluating environmental dynamics, sensor health, and energy constraints.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400">DECISION CYCLE: </span>
          <span className="text-cyan-300 font-bold">1 Hz Continuous</span>
        </div>
      </div>

      {/* Main Decision Status Card */}
      <div className={`p-6 rounded-2xl border transition-all duration-300 ${
        isAnomaly
          ? 'bg-gradient-to-br from-navy-900 via-orange-950/40 to-navy-950 border-orange-500/60 shadow-xl shadow-orange-500/10'
          : energy.battery_pct < 25
          ? 'bg-gradient-to-br from-navy-900 via-purple-950/40 to-navy-950 border-purple-500/60 shadow-xl shadow-purple-500/10'
          : 'ocean-card border-cyan-500/30'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Anomaly Score Dial / Gauge */}
          <div className="flex flex-col items-center justify-center p-4 bg-navy-950/60 rounded-xl border border-navy-800 text-center">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              Composite Anomaly Score
            </span>
            <div className="relative w-32 h-32 flex items-center justify-center my-1">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#112240"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={isAnomaly ? '#f97316' : '#00b4d8'}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - Math.min(1.0, anomalyScore))}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-mono font-extrabold text-white">
                  {anomalyScore.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">/ 1.00</span>
              </div>
            </div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              isAnomaly ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'bg-cyan-500/10 text-cyan-300'
            }`}>
              {isAnomaly ? 'ELEVATED / ANOMALY' : 'NOMINAL BASELINE'}
            </span>
          </div>

          {/* Current Autonomous Decision Box */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-800 pb-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400">AUTONOMOUS STATE:</span>
                <h3 className={`text-xl font-extrabold tracking-wide ${
                  isAnomaly ? 'text-orange-400' : energy.battery_pct < 25 ? 'text-purple-400' : 'text-emerald-400'
                }`}>
                  {mission.ai_decision}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono text-slate-400 block">CURRENT SAMPLING INTERVAL:</span>
                <div className="flex items-center space-x-1.5 justify-end">
                  <span className="text-sm font-mono text-slate-500 line-through">
                    {mission.previous_sampling_interval}s
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span className={`text-lg font-mono font-extrabold px-2 py-0.5 rounded ${
                    mission.current_sampling_interval === 10
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      : mission.current_sampling_interval === 120
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {mission.current_sampling_interval}s
                  </span>
                </div>
              </div>
            </div>

            {/* Explainable Decision Rationale */}
            <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 text-xs font-mono space-y-1.5">
              <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
                Autonomous Decision Rationale:
              </span>
              <p className="text-slate-200 leading-relaxed font-sans text-xs">
                "{mission.sampling_change_reason}"
              </p>
            </div>

            {/* Status Grid Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-navy-950/60 border border-navy-800">
                <span className="text-slate-500 block text-[9px]">ENV STATE</span>
                <span className={`font-bold ${isAnomaly ? 'text-orange-400' : 'text-emerald-400'}`}>
                  {mission.ai_environmental_state}
                </span>
              </div>
              <div className="p-2 rounded bg-navy-950/60 border border-navy-800">
                <span className="text-slate-500 block text-[9px]">SENSOR HEALTH</span>
                <span className="font-bold text-cyan-300">
                  {healthyCount} / {sensors.length} OK
                </span>
              </div>
              <div className="p-2 rounded bg-navy-950/60 border border-navy-800">
                <span className="text-slate-500 block text-[9px]">ENERGY STATE</span>
                <span className={`font-bold ${energy.battery_pct < 25 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {energy.battery_pct.toFixed(0)}% ({energy.power_mode})
                </span>
              </div>
              <div className="p-2 rounded bg-navy-950/60 border border-navy-800">
                <span className="text-slate-500 block text-[9px]">COMMUNICATION</span>
                <span className={`font-bold ${communication.link_status === 'ONLINE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {communication.link_status}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Algorithmic Anomaly Detection Tiers (Explainability) */}
      <div className="p-6 rounded-xl ocean-card space-y-4">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">EXPLAINABLE ANOMALY DETECTION ALGORITHMS</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Active Multi-Tier Ensemble</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Tier 1: Physical Envelope Check */}
          <div className="p-3.5 rounded-lg bg-navy-900/70 border border-navy-800 space-y-1.5">
            <div className="flex items-center justify-between text-cyan-400 font-bold font-mono text-[11px]">
              <span>1. ENVELOPE BOUNDARY</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Verifies whether raw readings breach calibrated oceanographic operating bands (<span className="text-cyan-300 font-mono">normalMin / normalMax</span>).
            </p>
            <span className="text-[10px] font-mono text-slate-500 block">Response: Warning trigger</span>
          </div>

          {/* Tier 2: Rate-of-Change Velocity */}
          <div className="p-3.5 rounded-lg bg-navy-900/70 border border-navy-800 space-y-1.5">
            <div className="flex items-center justify-between text-cyan-400 font-bold font-mono text-[11px]">
              <span>2. RATE-OF-CHANGE (Δv/Δt)</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Monitors velocity of deviation against thermal and chemical inertia limits of polar seawater.
            </p>
            <span className="text-[10px] font-mono text-slate-500 block">Threshold: &gt;25% span / cycle</span>
          </div>

          {/* Tier 3: Statistical Rolling Z-Score */}
          <div className="p-3.5 rounded-lg bg-navy-900/70 border border-navy-800 space-y-1.5">
            <div className="flex items-center justify-between text-cyan-400 font-bold font-mono text-[11px]">
              <span>3. ROLLING Z-SCORE</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Maintains a 30-reading moving window to detect statistical outliers departing beyond <span className="text-cyan-300 font-mono">2.5σ</span> of mean.
            </p>
            <span className="text-[10px] font-mono text-slate-500 block">Rolling Window: N=30 samples</span>
          </div>

          {/* Tier 4: Cross-Sensor Correlation */}
          <div className="p-3.5 rounded-lg bg-navy-900/70 border border-navy-800 space-y-1.5">
            <div className="flex items-center justify-between text-cyan-400 font-bold font-mono text-[11px]">
              <span>4. CROSS-SENSOR CHECK</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Correlates multi-parameter ocean physics (e.g. temp spike verified with gas solubility and salinity).
            </p>
            <span className="text-[10px] font-mono text-slate-500 block">Status: Cross-correlation active</span>
          </div>

        </div>
      </div>
    </div>
  );
};
