import React from 'react';
import { 
  Zap, 
  Thermometer, 
  Droplets, 
  Wind, 
  ShieldAlert, 
  Radio, 
  Battery, 
  RotateCcw, 
  CheckCircle2, 
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { MissionState } from '../types';

interface SimulationControlsProps {
  mission: MissionState;
  onRunScenario: (scenarioId: string) => void;
  onInjectAnomaly: (sensorId: string, mag?: number) => void;
  onInjectFault: (sensorId: string, type: string) => void;
  onSimCommLoss: () => void;
  onSimLowBattery: () => void;
  onReset: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  mission,
  onRunScenario,
  onInjectAnomaly,
  onInjectFault,
  onSimCommLoss,
  onSimLowBattery,
  onReset
}) => {
  const scenarios = [
    {
      id: 'NORMAL_OCEAN',
      title: '1. Normal Polar Baseline',
      desc: 'Nominal Southern Ocean background conditions. Calm wave action, nominal 60s sampling.',
      action: 'Baseline 60s'
    },
    {
      id: 'TEMPERATURE_ANOMALY',
      title: '2. Sudden Thermal Plume',
      desc: 'Warm hydrothermal water mass encounters array (+7.2°C). AI detects anomaly, accelerates to 10s.',
      action: 'Sampling 60s → 10s'
    },
    {
      id: 'HIGH_SALINITY',
      title: '3. Brine Rejection Plume',
      desc: 'Sea ice formation expels hyper-dense brine (+5.5 PSU). Array tracks chemical density flux.',
      action: 'Sampling 60s → 10s'
    },
    {
      id: 'LOW_DO',
      title: '4. Deep Sea Hypoxia',
      desc: 'Rapid oxygen depletion event (-4.2 mg/L). OceanX isolates stratification event.',
      action: 'Sampling 60s → 10s'
    },
    {
      id: 'SENSOR_FAILURE',
      title: '5. Temperature Transducer Freeze',
      desc: 'PT100 sensor repeats 2.400°C despite wave heave. System flags fault, maintains 60s.',
      action: 'Sensor Health: DEGRADED'
    },
    {
      id: 'COMM_BLACKOUT',
      title: '6. Polar Storm RF Blackout',
      desc: 'Ionospheric storm breaks communication. Store-and-Forward logs telemetry locally.',
      action: 'Zero Data Loss Buffer'
    },
    {
      id: 'LOW_BATTERY',
      title: '7. Polar Winter / Low Energy',
      desc: 'Battery drops to 18% in polar night. Power-saving mode throttles sampling to 120s.',
      action: 'Sampling 60s → 120s'
    },
    {
      id: 'MULTI_SENSOR_ANOMALY',
      title: '8. Multi-Parameter Surge',
      desc: 'Coupled thermal and chemical anomaly simultaneously triggering across 3 probe depths.',
      action: 'Compound Anomaly'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl ocean-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              SIMULATION SCENARIOS & INTERACTIVE TESTING
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
              SIH Judge Evaluation Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test and demonstrate every autonomous response: thermal anomalies, hardware freeze, communication loss, and power throttling.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">ACTIVE SCENARIO:</span>
          <span className="px-2.5 py-1 rounded bg-navy-900 border border-navy-700 text-cyan-300 font-mono font-bold text-xs">
            {mission.active_scenario}
          </span>
          <button
            onClick={onReset}
            className="p-1.5 rounded bg-navy-900 hover:bg-navy-800 text-slate-300 border border-navy-700 transition"
            title="Reset All Scenarios"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Predefined Scenarios 1 to 8 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {scenarios.map(sc => {
          const isActive = mission.active_scenario.toUpperCase().includes(sc.title.split('.')[1].trim().toUpperCase()) ||
                           mission.active_scenario.toUpperCase() === sc.id.replace('_', ' ');

          return (
            <div
              key={sc.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isActive 
                  ? 'bg-amber-950/20 border-amber-400 shadow-md ring-1 ring-amber-400/40' 
                  : 'ocean-card ocean-card-hover'
              }`}
            >
              <div>
                <h4 className="text-xs font-bold text-white leading-snug">{sc.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-sans">
                  {sc.desc}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-navy-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-cyan-300 bg-navy-950/60 px-1.5 py-0.5 rounded border border-navy-800">
                  {sc.action}
                </span>

                <button
                  onClick={() => onRunScenario(sc.id)}
                  className="px-2.5 py-1 rounded bg-navy-900 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/30 text-[10px] font-mono font-bold transition flex items-center space-x-1"
                >
                  <span>RUN</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Quick Test Buttons Grid (Judge Quick Access) */}
      <div className="p-5 rounded-xl ocean-card space-y-3">
        <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
          RAPID EVENT INJECTION TOOLBAR (CLICK TO SIMULATE INSTANTLY)
        </h3>

        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button
            onClick={() => onRunScenario('NORMAL_OCEAN')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition flex items-center space-x-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Normal Baseline</span>
          </button>

          <button
            onClick={() => onInjectAnomaly('temp_1', 7.5)}
            className="px-3 py-1.5 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border border-orange-500/40 transition flex items-center space-x-1"
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temp Anomaly (+7.5°C)</span>
          </button>

          <button
            onClick={() => onInjectAnomaly('sal_1', 5.0)}
            className="px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/40 transition flex items-center space-x-1"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Salinity Anomaly (+5 PSU)</span>
          </button>

          <button
            onClick={() => onInjectAnomaly('do_1', 4.5)}
            className="px-3 py-1.5 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/40 transition flex items-center space-x-1"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>DO Hypoxia Anomaly (-4.5 mg/L)</span>
          </button>

          <button
            onClick={() => onInjectFault('temp_1', 'STUCK')}
            className="px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 transition flex items-center space-x-1"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Stuck Sensor Fault (Freeze)</span>
          </button>

          <button
            onClick={onSimCommLoss}
            className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/40 transition flex items-center space-x-1"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Communication Loss (Buffer Data)</span>
          </button>

          <button
            onClick={onSimLowBattery}
            className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 transition flex items-center space-x-1"
          >
            <Battery className="w-3.5 h-3.5" />
            <span>Low Battery (Power-Saving 120s)</span>
          </button>

          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700 transition flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Scenario</span>
          </button>
        </div>
      </div>
    </div>
  );
};
