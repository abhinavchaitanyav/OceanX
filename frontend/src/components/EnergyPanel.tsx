import React from 'react';
import { 
  Battery, 
  Sun, 
  Zap, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { EnergyState, MissionState } from '../types';

interface EnergyPanelProps {
  energy: EnergyState;
  mission: MissionState;
  onSetSolar: (pct: number) => void;
  onSimulateLowBattery: () => void;
  onResetBattery: () => void;
}

export const EnergyPanel: React.FC<EnergyPanelProps> = ({
  energy,
  mission,
  onSetSolar,
  onSimulateLowBattery,
  onResetBattery
}) => {
  const getBatteryColor = (pct: number) => {
    if (pct < 20) return 'from-red-500 to-rose-600';
    if (pct < 40) return 'from-amber-500 to-orange-600';
    return 'from-emerald-400 to-teal-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl ocean-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Battery className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">POWER MANAGEMENT & SOLAR HARVESTING</h2>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
              LiFePO4 256Wh Subsystem
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamic energy balance modeling solar insolation, MPPT conversion, and load-shedding adaptive sampling.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSimulateLowBattery}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-mono font-bold transition flex items-center space-x-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate Low Battery (18%)</span>
          </button>
          <button
            onClick={onResetBattery}
            className="p-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 border border-navy-700 transition"
            title="Reset Battery to 85%"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Energy Readout Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1: Battery State of Charge */}
        <div className="p-4 rounded-xl ocean-card space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>STATE OF CHARGE (SOC)</span>
            <Battery className={`w-4 h-4 ${energy.battery_pct < 25 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-white">
              {energy.battery_pct.toFixed(1)}%
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({energy.current_wh.toFixed(1)} / {energy.capacity_wh} Wh)
            </span>
          </div>

          {/* Graphical Battery Bar */}
          <div className="w-full h-3 bg-navy-900 rounded-full overflow-hidden border border-navy-800 p-0.5">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${getBatteryColor(energy.battery_pct)} transition-all duration-500`}
              style={{ width: `${Math.max(4, Math.min(100, energy.battery_pct))}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0% (Cutoff)</span>
            <span>25% (LVD Warning)</span>
            <span>100%</span>
          </div>
        </div>

        {/* Card 2: Solar Input Generation */}
        <div className="p-4 rounded-xl ocean-card space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SOLAR GENERATION</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-amber-300">
              +{energy.solar_watts.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-slate-400">Watts</span>
          </div>

          <div className="p-2 rounded bg-navy-950/60 border border-navy-800 text-[11px] font-mono flex items-center justify-between">
            <span className="text-slate-400">Solar Yield:</span>
            <span className="text-amber-300 font-bold">{energy.solar_irradiance_pct}% Intensity</span>
          </div>

          <span className="text-[10px] font-mono text-slate-500 block">
            Dual 30W Marine Monocrystalline Panels
          </span>
        </div>

        {/* Card 3: System Consumption Draw */}
        <div className="p-4 rounded-xl ocean-card space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SYSTEM CONSUMPTION</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-cyan-300">
              {energy.consumption_watts.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-slate-400">Watts</span>
          </div>

          <div className="p-2 rounded bg-navy-950/60 border border-navy-800 text-[11px] font-mono flex items-center justify-between">
            <span className="text-slate-400">Active Load Mode:</span>
            <span className="text-cyan-300 font-bold">{energy.power_mode}</span>
          </div>

          <span className="text-[10px] font-mono text-slate-500 block">
            ESP32 (0.4W) + RPi5 + Probes + LoRa
          </span>
        </div>

        {/* Card 4: Estimated Runtime / Net Flow */}
        <div className="p-4 rounded-xl ocean-card space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ESTIMATED RUNTIME</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-extrabold text-white">
              {energy.runtime_hours > 500 ? '∞ Net-Pos' : `${energy.runtime_hours} hrs`}
            </span>
          </div>

          <div className="p-2 rounded bg-navy-950/60 border border-navy-800 text-[11px] font-mono flex items-center justify-between">
            <span className="text-slate-400">Net Power Balance:</span>
            <span className={`font-bold flex items-center space-x-1 ${energy.net_power_watts >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {energy.net_power_watts >= 0 ? (
                <>
                  <TrendingUp className="w-3 h-3" />
                  <span>+{energy.net_power_watts.toFixed(2)}W</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3" />
                  <span>{energy.net_power_watts.toFixed(2)}W</span>
                </>
              )}
            </span>
          </div>

          <span className="text-[10px] font-mono text-slate-500 block">
            {energy.net_power_watts >= 0 ? 'Solar recharging battery' : 'Discharging battery reserve'}
          </span>
        </div>

      </div>

      {/* Solar Irradiance Simulation Slider */}
      <div className="p-5 rounded-xl ocean-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">SOLAR INTENSITY SIMULATION SLIDER</h3>
          </div>
          <span className="text-xs font-mono text-amber-300 font-bold">
            Current Irradiance: {energy.solar_irradiance_pct}%
          </span>
        </div>

        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={energy.solar_irradiance_pct}
            onChange={(e) => onSetSolar(parseFloat(e.target.value))}
            className="w-full accent-amber-400 h-2 bg-navy-800 rounded-lg appearance-none cursor-pointer"
          />

          <div className="flex justify-between text-xs font-mono text-slate-400">
            <button onClick={() => onSetSolar(0)} className="hover:text-amber-300">0% (Polar Night)</button>
            <button onClick={() => onSetSolar(25)} className="hover:text-amber-300">25% (Overcast)</button>
            <button onClick={() => onSetSolar(50)} className="hover:text-amber-300">50% (Diffuse Sun)</button>
            <button onClick={() => onSetSolar(75)} className="hover:text-amber-300">75% (Direct Polar Sun)</button>
            <button onClick={() => onSetSolar(100)} className="hover:text-amber-300">100% (Peak Solstice)</button>
          </div>
        </div>

        {/* Low Battery Autonomous Response Explainer */}
        {energy.battery_pct < 25 && (
          <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-start space-x-3 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold font-mono text-red-300 uppercase tracking-wide block">
                Autonomous Power-Saving Mode Triggered!
              </span>
              <p className="text-slate-300 mt-0.5 leading-relaxed text-[11px]">
                Battery level dropped below the 25% safety reserve. The AI decision engine autonomously throttles sampling from 60s to 120s, disables non-critical telemetry channels, and schedules low-power sleep between observation cycles to protect the LiFePO4 cells from deep depletion.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
