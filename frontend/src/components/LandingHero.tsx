import React, { useState } from 'react';
import { 
  Play, 
  Compass, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Wifi, 
  Radio, 
  Database, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ChevronRight
} from 'lucide-react';

interface LandingHeroProps {
  onStartMission: () => void;
  onExploreSystem: () => void;
  onSelectPipelineStage?: (stage: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartMission,
  onExploreSystem,
  onSelectPipelineStage
}) => {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const pipelineStages = [
    {
      name: "SENSE",
      role: "Multi-parameter transducer array",
      detail: "ESP32-S3 collects analog/I2C/SPI signals for Water Temp, Pressure/Depth, Salinity, pH, and Dissolved Oxygen via hardware-conditioned front-ends.",
      icon: Activity,
      color: "text-blue-400"
    },
    {
      name: "VALIDATE",
      role: "Transducer Health & Range Checking",
      detail: "Raspberry Pi 5 runs physical limit checks, rate-of-change thresholds, and variance diagnostics to isolate stuck sensors from actual environmental changes.",
      icon: ShieldCheck,
      color: "text-emerald-400"
    },
    {
      name: "ANALYZE",
      role: "Edge AI Anomaly Detection",
      detail: "Rolling 30-sample window calculates Z-score statistical divergence and cross-sensor correlation (e.g. thermal plume vs. oxygen solubility).",
      icon: Cpu,
      color: "text-purple-400"
    },
    {
      name: "ADAPT",
      role: "Autonomous Adaptive Sampling",
      detail: "Dynamically shifts sampling rates: 60s baseline → 10s during dynamic ocean anomalies → 120s in low-battery or solar blackout states.",
      icon: Compass,
      color: "text-amber-400"
    },
    {
      name: "TRANSMIT",
      role: "LoRa / LTE Store-and-Forward",
      detail: "Directly transmits telemetry when link is online; automatically spools observations into local SQLite flash buffer during polar storm blackouts.",
      icon: Radio,
      color: "text-cyan-400"
    },
    {
      name: "VISUALIZE",
      role: "Research Mission Digital Twin",
      detail: "Real-time shore-station telemetry visualization, platform attitude (IMU), battery SOC, and synced historical data analytics.",
      icon: Eye,
      color: "text-teal-400"
    }
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-12 border-b border-navy-800/80">
      {/* Background Subtle Radar Grid & Polar Wave Glow */}
      <div className="absolute inset-0 radar-grid opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>SIH 2026 Round 2 Virtual Prototype • Problem Statement #26065</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            OCEAN<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">X</span>
          </h1>
          
          <p className="text-lg sm:text-xl font-medium text-slate-200">
            Autonomous Low-Cost Ocean Observation Platform
          </p>

          <p className="text-sm font-mono text-cyan-300/80">
            Virtual Digital Twin & Autonomous Decision Simulator
          </p>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Simulating the physical sensing, edge AI anomaly detection, adaptive sampling, and resilient store-and-forward communication architecture for polar and extreme ocean environments.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartMission}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-navy-950 font-bold text-sm flex items-center space-x-2 shadow-lg shadow-cyan-500/25 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-navy-950" />
              <span>START VIRTUAL MISSION</span>
            </button>

            <button
              onClick={onExploreSystem}
              className="px-5 py-2.5 rounded-lg bg-navy-900/90 hover:bg-navy-800 text-cyan-300 border border-cyan-600/40 font-semibold text-sm flex items-center space-x-2 transition"
            >
              <Compass className="w-4 h-4" />
              <span>EXPLORE DIGITAL TWIN</span>
            </button>
          </div>
        </div>

        {/* Interactive OceanX Architecture Data Pipeline */}
        <div className="mt-10 p-5 rounded-xl ocean-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-cyan-400 font-bold tracking-wider uppercase">OCEANX EDGE DATA PIPELINE</span>
              <span className="text-[10px] text-slate-400">(Click any stage to view internal logic)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">Edge Computing & Autonomous Cycle</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {pipelineStages.map((stage, idx) => {
              const Icon = stage.icon;
              const isSelected = activeStage === idx;
              return (
                <button
                  key={stage.name}
                  onClick={() => setActiveStage(isSelected ? null : idx)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected 
                      ? 'bg-cyan-900/40 border-cyan-400 shadow-md ring-1 ring-cyan-400/50' 
                      : 'bg-navy-900/60 border-navy-700/80 hover:border-cyan-800/80 hover:bg-navy-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-white flex items-center space-x-1">
                      <span className="text-slate-400 text-[10px]">{idx + 1}.</span>
                      <span>{stage.name}</span>
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${stage.color}`} />
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium line-clamp-1">{stage.role}</p>
                </button>
              );
            })}
          </div>

          {/* Expanded Pipeline Stage Detail */}
          {activeStage !== null && (
            <div className="mt-3 p-3.5 rounded-lg bg-navy-900/90 border border-cyan-500/30 text-xs text-slate-200 animate-fadeIn flex items-start space-x-3">
              <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-400 mt-0.5 shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-cyan-300 font-mono tracking-wider">STAGE {activeStage + 1}: {pipelineStages[activeStage].name}</span>
                  <span className="text-[11px] text-slate-400">— {pipelineStages[activeStage].role}</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[12px]">
                  {pipelineStages[activeStage].detail}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 4 Key Platform Capabilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl ocean-card ocean-card-hover transition">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-2.5">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Autonomous Observation</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Unattended long-endurance polar monitoring with dynamic depth sensing and multi-parameter oceanographic profiling.
            </p>
          </div>

          <div className="p-4 rounded-xl ocean-card ocean-card-hover transition">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-2.5">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">AI Anomaly Detection</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Real-time statistical Z-score and cross-sensor validation distinguishes true ocean dynamics from sensor hardware failure.
            </p>
          </div>

          <div className="p-4 rounded-xl ocean-card ocean-card-hover transition">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-2.5">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Adaptive Sampling</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Autonomously switches between 10s (rapid anomaly capture), 60s (baseline), and 120s (power-saving) modes, saving 35%+ energy.
            </p>
          </div>

          <div className="p-4 rounded-xl ocean-card ocean-card-hover transition">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-2.5">
              <Radio className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Resilient Communication</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              LoRa & cellular store-and-forward spools readings into local SQLite buffer during polar blackouts, synchronizing with zero data loss.
            </p>
          </div>
        </div>

        {/* Transparent Disclaimer Box */}
        <div className="mt-6 p-3 rounded-lg bg-navy-900/50 border border-navy-700/60 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>
              <strong className="text-slate-300">Engineering Notice:</strong> Software simulation of the proposed OceanX controlled-water prototype. Physical deployment requires marine-grade qualification.
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-500 hidden md:inline">NO PHYSICAL HARDWARE CLAIMED • PURE DIGITAL TWIN</span>
        </div>
      </div>
    </div>
  );
};
