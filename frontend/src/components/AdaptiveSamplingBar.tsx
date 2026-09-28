import React from 'react';
import { 
  Activity, 
  ArrowRight, 
  Zap, 
  Radio, 
  TrendingDown, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { MissionState, EnergyState } from '../types';

interface AdaptiveSamplingBarProps {
  mission: MissionState;
  energy: EnergyState;
}

export const AdaptiveSamplingBar: React.FC<AdaptiveSamplingBarProps> = ({
  mission,
  energy
}) => {
  const currentInterval = mission.current_sampling_interval;
  const prevInterval = mission.previous_sampling_interval;

  return (
    <div className="p-5 rounded-xl ocean-card space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-800 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">
            AUTONOMOUS ADAPTIVE SAMPLING CONTROLLER
          </h3>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400">ESTIMATED ENERGY SAVED: </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
            {energy.energy_saved_pct > 0 ? `+${energy.energy_saved_pct}%` : 'Baseline'}
          </span>
        </div>
      </div>

      {/* Main Interval Change Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* Step 1: Mode Indicator Cards */}
        <div className="md:col-span-2 grid grid-cols-3 gap-2 text-center text-xs font-mono">
          
          {/* Normal Mode */}
          <div className={`p-3 rounded-xl border transition-all ${
            currentInterval === 60
              ? 'bg-cyan-500/20 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
              : 'bg-navy-900/60 border-navy-800 opacity-60'
          }`}>
            <span className="text-[10px] text-slate-400 block mb-0.5">NOMINAL BASELINE</span>
            <span className="text-xl font-extrabold text-cyan-300">60 sec</span>
            <span className="text-[9px] text-slate-400 block mt-1">Normal Ocean State</span>
          </div>

          {/* Anomaly Mode */}
          <div className={`p-3 rounded-xl border transition-all ${
            currentInterval === 10
              ? 'bg-orange-500/25 border-orange-400 shadow-lg ring-2 ring-orange-400/50 animate-pulse'
              : 'bg-navy-900/60 border-navy-800 opacity-60'
          }`}>
            <span className="text-[10px] text-orange-300 block mb-0.5">ANOMALY CAPTURE</span>
            <span className="text-xl font-extrabold text-orange-400">10 sec</span>
            <span className="text-[9px] text-slate-400 block mt-1">6x Dynamic Resolution</span>
          </div>

          {/* Low Battery Mode */}
          <div className={`p-3 rounded-xl border transition-all ${
            currentInterval === 120
              ? 'bg-purple-500/25 border-purple-400 shadow-lg ring-2 ring-purple-400/50'
              : 'bg-navy-900/60 border-navy-800 opacity-60'
          }`}>
            <span className="text-[10px] text-purple-300 block mb-0.5">POWER SAVING</span>
            <span className="text-xl font-extrabold text-purple-300">120 sec</span>
            <span className="text-[9px] text-slate-400 block mt-1">Low Energy Preservation</span>
          </div>

        </div>

        {/* Step 2: Live Transition Reason */}
        <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 text-xs font-mono space-y-1">
          <div className="flex items-center space-x-1.5 text-cyan-400 text-[10px] uppercase font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Autonomous Trigger Reason:</span>
          </div>
          <p className="text-slate-200 font-sans text-xs leading-snug">
            "{mission.sampling_change_reason}"
          </p>
        </div>

      </div>

      {/* Comparison: Fixed Sampling vs OceanX Adaptive Sampling */}
      <div className="p-4 rounded-xl bg-navy-900/70 border border-cyan-900/40 text-xs space-y-2.5">
        <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
          <span className="font-bold text-cyan-300 uppercase">Fixed (60s Always) vs. OceanX Adaptive Engine:</span>
          <span className="text-slate-400 text-[10px]">Simulation Estimation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2 rounded bg-navy-950/80 border border-navy-800">
            <span className="text-slate-500 text-[10px] block">FIXED BASELINE ENERGY</span>
            <span className="text-slate-300 font-bold">{energy.fixed_wh.toFixed(1)} Wh</span>
          </div>
          <div className="p-2 rounded bg-navy-950/80 border border-navy-800">
            <span className="text-slate-500 text-[10px] block">ADAPTIVE ENERGY</span>
            <span className="text-cyan-300 font-bold">{energy.adaptive_wh.toFixed(1)} Wh</span>
          </div>
          <div className="p-2 rounded bg-navy-950/80 border border-navy-800">
            <span className="text-slate-500 text-[10px] block">NET CONSERVATION</span>
            <span className="text-emerald-400 font-bold">
              {energy.fixed_wh > energy.adaptive_wh ? `${(energy.fixed_wh - energy.adaptive_wh).toFixed(1)} Wh saved` : 'Optimizing'}
            </span>
          </div>
          <div className="p-2 rounded bg-navy-950/80 border border-navy-800">
            <span className="text-slate-500 text-[10px] block">EVENT FIDELITY</span>
            <span className="text-amber-400 font-bold">600% Resolution</span>
          </div>
        </div>
      </div>
    </div>
  );
};
