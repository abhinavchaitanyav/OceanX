import React from 'react';
import { 
  Waves, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  Radio, 
  Battery, 
  Cpu, 
  Activity,
  Layers,
  Settings,
  BarChart3,
  Sliders,
  FileText
} from 'lucide-react';
import { MissionState, EnergyState, CommunicationState } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mission: MissionState;
  energy: EnergyState;
  communication: CommunicationState;
  onStartMission: () => void;
  onPauseMission: () => void;
  onResumeMission: () => void;
  onResetMission: () => void;
  onOpenJudgeModal: () => void;
  onOpenDemoMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  mission,
  energy,
  communication,
  onStartMission,
  onPauseMission,
  onResumeMission,
  onResetMission,
  onOpenJudgeModal,
  onOpenDemoMode
}) => {
  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const navItems = [
    { id: 'mission', label: 'Overview', icon: Waves },
    { id: 'ocean', label: 'Virtual Ocean', icon: Sliders },
    { id: 'sensors', label: 'Sensors', icon: Settings },
    { id: 'digital-twin', label: 'Digital Twin', icon: Layers },
    { id: 'ai-engine', label: 'AI Engine', icon: Cpu },
    { id: 'faults', label: 'Fault Isolation', icon: Activity },
    { id: 'comms', label: 'Communication', icon: Radio },
    { id: 'energy', label: 'Power & Energy', icon: Battery },
    { id: 'analytics', label: 'Analytics & Data', icon: BarChart3 },
    { id: 'architecture', label: 'BOM & Specs', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-cyan-900/30 text-white">
      {/* Top Banner with SIH Metadata & Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-navy-800/60">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-600/30 border border-cyan-400/40 shadow-inner">
            <Waves className="w-5 h-5 text-cyan-400 animate-pulse-subtle" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-navy-950"></span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-wider text-base text-white">OCEANX</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded">
                Virtual Digital Twin
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-navy-800 text-slate-300 rounded border border-navy-700">
                SIH 2026 #26065
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Polar Ocean Autonomous Observation Platform • Team: <span className="text-cyan-300 font-medium">Coders May Cry</span>
            </p>
          </div>
        </div>

        {/* Live Mission Telemetry Badges */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-mono">
          {/* Mission Timer */}
          <div className="px-2.5 py-1 bg-navy-900/90 border border-navy-700/80 rounded-md flex items-center space-x-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400 text-[11px]">MISSION:</span>
            <span className="text-cyan-300 font-semibold">{formatTimer(mission.elapsed_seconds)}</span>
          </div>

          {/* Current Sampling Rate */}
          <div className={`px-2.5 py-1 rounded-md border flex items-center space-x-1.5 ${
            mission.current_sampling_interval === 10
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              : mission.current_sampling_interval === 120
              ? 'bg-purple-500/10 border-purple-500/40 text-purple-300'
              : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
          }`}>
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">RATE:</span>
            <span className="font-bold">{mission.current_sampling_interval}s</span>
          </div>

          {/* Battery Badge */}
          <div className={`px-2.5 py-1 rounded-md border flex items-center space-x-1.5 ${
            energy.battery_pct < 25 
              ? 'bg-red-500/10 border-red-500/40 text-red-300 animate-pulse'
              : 'bg-navy-900/90 border-navy-700/80 text-emerald-300'
          }`}>
            <Battery className="w-3.5 h-3.5" />
            <span>{energy.battery_pct.toFixed(0)}%</span>
          </div>

          {/* Comms Badge */}
          <div className={`px-2.5 py-1 rounded-md border flex items-center space-x-1.5 ${
            communication.link_status === 'ONLINE'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : communication.link_status === 'DEGRADED'
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              : 'bg-red-500/15 border-red-500/50 text-red-300 animate-pulse'
          }`}>
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{communication.link_status}</span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Mission Pause/Resume/Reset */}
          {mission.is_paused ? (
            <button
              onClick={onResumeMission}
              className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium flex items-center space-x-1 transition shadow"
              title="Resume simulation"
            >
              <Play className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resume</span>
            </button>
          ) : (
            <button
              onClick={onPauseMission}
              className="px-2.5 py-1 text-xs bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 rounded font-medium flex items-center space-x-1 transition"
              title="Pause simulation"
            >
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pause</span>
            </button>
          )}

          <button
            onClick={onResetMission}
            className="p-1.5 text-xs bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700 rounded transition"
            title="Reset Simulation to Initial State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* SIH Demo Mode Trigger Button */}
          <button
            onClick={onOpenDemoMode}
            className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-navy-950 rounded-md flex items-center space-x-1.5 shadow-md shadow-orange-500/20 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 fill-navy-950" />
            <span>SIH Demo Mode</span>
          </button>

          {/* How OceanX Works Quick Explainer Modal */}
          <button
            onClick={onOpenJudgeModal}
            className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/30 rounded-md transition"
            title="How OceanX Works (60s Judge Guide)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none text-xs font-medium">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
