import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, 
  Thermometer, 
  Waves, 
  Sun, 
  Anchor, 
  Wind, 
  Radio, 
  Compass, 
  Battery, 
  Layers,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Sensor, EnvironmentState, MissionState, EnergyState, CommunicationState } from '../types';

interface VirtualOceanCanvasProps {
  sensors: Sensor[];
  environment: EnvironmentState;
  mission: MissionState;
  energy: EnergyState;
  communication: CommunicationState;
  onUpdateEnvironment: (env: Partial<EnvironmentState>) => void;
  onSetCommunication: (status: 'ONLINE' | 'DEGRADED' | 'OFFLINE') => void;
}

export const VirtualOceanCanvas: React.FC<VirtualOceanCanvasProps> = ({
  sensors,
  environment,
  mission,
  energy,
  communication,
  onUpdateEnvironment,
  onSetCommunication
}) => {
  const [hoveredProbe, setHoveredProbe] = useState<string | null>(null);
  const [waveOffset, setWaveOffset] = useState(0);

  // Animate wave motion smoothly
  useEffect(() => {
    let animId: number;
    let frame = 0;
    const animate = () => {
      frame++;
      setWaveOffset((frame * 0.05 * (environment.ocean_current_speed + 0.5)) % (Math.PI * 2));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [environment.ocean_current_speed]);

  // Wave height driven buoy tilt and heave
  const buoyHeave = Math.sin(waveOffset * 1.5) * (environment.wave_height * 2.5);
  const buoyTilt = Math.sin(waveOffset * 1.2) * (environment.wave_height * 1.8);

  // Probes mapping
  const probeLocations = [
    { type: 'Temperature', depth: 15, color: '#38bdf8', label: 'Temp Probe (PT100)' },
    { type: 'Salinity', depth: 30, color: '#818cf8', label: 'Inductive Salinity / Conductivity' },
    { type: 'Dissolved Oxygen', depth: 45, color: '#34d399', label: 'Optical DO Sensor' },
    { type: 'pH', depth: 60, color: '#f472b6', label: 'pH Glass Combination Electrode' },
    { type: 'Pressure', depth: 80, color: '#fbbf24', label: 'Hydrostatic Pressure / Depth Transducer' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Title and GPS Location */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl ocean-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white tracking-wide">VIRTUAL POLAR OCEAN SIMULATOR</h2>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
              Interactive Digital Twin Canvas
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulated hydrodynamics, solar radiation, wave heave, and submerged multi-parameter sensor array.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="p-2 bg-navy-900/90 border border-navy-700 rounded-md">
            <span className="text-slate-400">SIMULATED POSITION: </span>
            <span className="text-cyan-300 font-semibold">
              {mission.position.latitude.toFixed(4)}°S, {mission.position.longitude.toFixed(4)}°W
            </span>
          </div>
          <div className="p-2 bg-navy-900/90 border border-navy-700 rounded-md">
            <span className="text-slate-400">DRIFT SPEED: </span>
            <span className="text-emerald-300 font-semibold">{environment.ocean_current_speed} kts</span>
          </div>
          <div className="p-2 bg-navy-900/90 border border-navy-700 rounded-md">
            <span className="text-slate-400">WAVE HEAVE: </span>
            <span className="text-amber-300 font-semibold">{environment.wave_height} m</span>
          </div>
        </div>
      </div>

      {/* Main Simulation Arena: Canvas Visualizer + Environment Control Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Animated Ocean Canvas with Buoy & Probes */}
        <div className="lg:col-span-2 relative h-[520px] rounded-xl overflow-hidden border border-cyan-900/40 shadow-2xl bg-gradient-to-b from-[#061325] via-[#041c38] to-[#020b18]">
          
          {/* Sky & Polar Atmospheric Layer */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#0a1b33] to-[#0d2a4a] border-b border-cyan-500/20">
            {/* Sun / Solar Irradiance Indicator */}
            <div 
              className="absolute top-6 right-10 rounded-full transition-all duration-700 flex items-center justify-center"
              style={{
                width: `${40 + (environment.solar_irradiance / 100) * 30}px`,
                height: `${40 + (environment.solar_irradiance / 100) * 30}px`,
                background: `radial-gradient(circle, rgba(253, 224, 71, ${0.2 + (environment.solar_irradiance / 100) * 0.7}) 0%, rgba(245, 158, 11, 0) 70%)`,
                boxShadow: `0 0 ${environment.solar_irradiance * 0.6}px rgba(251, 191, 36, 0.4)`
              }}
            >
              <Sun className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '30s' }} />
            </div>

            {/* Clouds / Polar Fog indicator */}
            <div className="absolute top-12 left-10 text-xs font-mono text-cyan-200/60 flex items-center space-x-2">
              <Wind className="w-4 h-4 text-cyan-400/80" />
              <span>Sea State {environment.sea_state} • Polar Katabatic Winds</span>
            </div>
          </div>

          {/* Depth Scale on Left */}
          <div className="absolute left-2 top-44 bottom-4 w-12 flex flex-col justify-between text-[10px] font-mono text-cyan-400/60 border-r border-cyan-500/20 pr-1 select-none z-20">
            <span>0m (SFC)</span>
            <span>20m</span>
            <span>40m</span>
            <span>60m</span>
            <span>80m</span>
            <span>100m</span>
            <span>200m</span>
          </div>

          {/* Ocean Water SVG Graphics with Dynamic Waves */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 520" preserveAspectRatio="none">
            <defs>
              <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#073b61" stopOpacity="0.85" />
                <stop offset="35%" stopColor="#032545" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#010e1c" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="sparGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            {/* Dynamic Sine Waves */}
            <path
              d={`M 0 160 
                  Q 200 ${155 + buoyHeave}, 400 160 
                  T 800 ${162 - buoyHeave} 
                  L 800 520 L 0 520 Z`}
              fill="url(#oceanGrad)"
            />
            {/* Wave crest shimmer line */}
            <path
              d={`M 0 160 
                  Q 200 ${155 + buoyHeave}, 400 160 
                  T 800 ${162 - buoyHeave}`}
              fill="none"
              stroke="#00e5ff"
              strokeWidth="2"
              strokeOpacity="0.6"
            />
          </svg>

          {/* Central Floating OceanX Buoy & Underwater Umbilical Assembly */}
          <div 
            className="absolute left-1/2 top-40 -translate-x-1/2 transition-transform duration-200 pointer-events-auto"
            style={{
              transform: `translate(-50%, ${buoyHeave}px) rotate(${buoyTilt}deg)`
            }}
          >
            {/* Surface Buoy Assembly */}
            <div className="relative flex flex-col items-center">
              
              {/* Antenna Mast with Warning Strobe & LoRa/GNSS Antennas */}
              <div className="w-1.5 h-16 bg-slate-400 relative">
                {/* Red warning LED flash */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white"></div>
                
                {/* GNSS Mushroom Dome */}
                <div className="absolute top-3 -left-2.5 w-6 h-2 rounded-t-full bg-white border border-slate-400"></div>
                
                {/* LoRa/LTE Dipole Antenna */}
                <div className="absolute top-2 right-1.5 w-1 h-8 bg-cyan-400"></div>
              </div>

              {/* Solar Panel Deck Plate */}
              <div className="w-24 h-4 rounded-sm bg-gradient-to-r from-blue-900 via-cyan-950 to-blue-900 border-2 border-cyan-400/80 shadow-lg relative flex items-center justify-around px-1">
                <div className="w-4 h-2 bg-blue-600/60 rounded-xs"></div>
                <div className="w-4 h-2 bg-blue-600/60 rounded-xs"></div>
                <div className="w-4 h-2 bg-blue-600/60 rounded-xs"></div>
                <div className="w-4 h-2 bg-blue-600/60 rounded-xs"></div>
              </div>

              {/* Floating Foam Collar / Hull (Yellow High-Visibility Marine Spar) */}
              <div className="w-20 h-14 rounded-b-xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 border-2 border-amber-300 shadow-xl flex flex-col items-center justify-center text-[10px] font-mono font-extrabold text-navy-950 tracking-wider">
                <span>OCEANX</span>
                <span className="text-[8px] tracking-normal font-sans opacity-80">SPAR-01</span>
              </div>

              {/* Waterline indicator line */}
              <div className="w-28 h-0.5 bg-cyan-400/40 -mt-3 blur-xs"></div>

              {/* Underwater Pressure Vessel (Electronics Housing) */}
              <div className="w-12 h-16 rounded-md bg-gradient-to-b from-slate-600 to-slate-800 border border-slate-400 shadow-inner flex flex-col items-center justify-around py-1">
                <span className="text-[7px] font-mono text-cyan-300">ESP32-S3</span>
                <span className="text-[7px] font-mono text-purple-300">RPI-5</span>
                <span className="text-[7px] font-mono text-emerald-300">LiFePO4</span>
              </div>

              {/* Mooring Cable / Sensor Umbilical dropping into abyss */}
              <div className="w-1 h-64 bg-slate-500/80 relative flex flex-col items-center">
                
                {/* Underwater Tethered Sensor Probes */}
                {probeLocations.map((probe, i) => {
                  const sensorObj = sensors.find(s => s.type === probe.type) || sensors[i % sensors.length];
                  const isHovered = hoveredProbe === probe.type;
                  const probeTop = 25 + i * 45;

                  return (
                    <div 
                      key={probe.type}
                      className="absolute -translate-x-1/2 flex items-center cursor-pointer group"
                      style={{ top: `${probeTop}px`, left: i % 2 === 0 ? '16px' : '-16px' }}
                      onMouseEnter={() => setHoveredProbe(probe.type)}
                      onMouseLeave={() => setHoveredProbe(null)}
                    >
                      {/* Submerged Sensor Pod */}
                      <div 
                        className="w-4 h-4 rounded-full border-2 shadow-md transition-all duration-300 group-hover:scale-125 flex items-center justify-center"
                        style={{ 
                          backgroundColor: probe.color, 
                          borderColor: '#ffffff',
                          boxShadow: `0 0 10px ${probe.color}`
                        }}
                      >
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>

                      {/* Sensor Label Tag */}
                      <div className={`ml-2 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap border transition-all ${
                        isHovered 
                          ? 'bg-navy-900 border-cyan-400 text-cyan-300 scale-105 shadow-lg z-30' 
                          : 'bg-navy-950/80 border-navy-700 text-slate-300'
                      }`}>
                        <span className="font-bold">{sensorObj?.name}: </span>
                        <span className="text-white font-semibold">
                          {sensorObj?.lastValue !== undefined ? `${sensorObj.lastValue} ${sensorObj.unit}` : 'Acquiring...'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Subsea Heavy Damping Keel Weight at bottom */}
                <div className="absolute -bottom-6 -left-3 w-7 h-6 bg-slate-700 border border-slate-500 rounded shadow-md flex items-center justify-center">
                  <Anchor className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>

            </div>
          </div>

          {/* Live Telemetry Overlay in bottom-right corner */}
          <div className="absolute bottom-3 right-3 p-3 rounded-lg bg-navy-950/85 backdrop-blur-md border border-cyan-500/30 text-xs font-mono max-w-xs space-y-1 z-20">
            <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-navy-800 pb-1">
              <span>LIVE PROBE TELEMETRY</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 text-[11px] pt-1">
              <span className="text-slate-400">Surface Temp:</span>
              <span className="text-cyan-200 font-semibold">{environment.sea_surface_temp}°C</span>
              <span className="text-slate-400">Current Depth:</span>
              <span className="text-cyan-200 font-semibold">{environment.current_depth} m</span>
              <span className="text-slate-400">Wave Height:</span>
              <span className="text-cyan-200 font-semibold">{environment.wave_height} m</span>
              <span className="text-slate-400">Solar Yield:</span>
              <span className="text-amber-300 font-semibold">{energy.solar_watts} W</span>
            </div>
          </div>
        </div>

        {/* Right Col: Virtual Environment Controls Panel */}
        <div className="p-5 rounded-xl ocean-card space-y-5">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">ENVIRONMENT CONTROLS</h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              Live Modifiers
            </span>
          </div>

          {/* 1. Sea Surface Temperature Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center space-x-1">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ocean Surface Temp:</span>
              </span>
              <span className="text-cyan-300 font-bold">{environment.sea_surface_temp} °C</span>
            </div>
            <input
              type="range"
              min="-2"
              max="10"
              step="0.2"
              value={environment.sea_surface_temp}
              onChange={(e) => onUpdateEnvironment({ sea_surface_temp: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 h-1.5 bg-navy-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-2.0°C (Freezing Polar)</span>
              <span>10.0°C (Temperate)</span>
            </div>
          </div>

          {/* 2. Ocean Current Speed */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center space-x-1">
                <Wind className="w-3.5 h-3.5 text-blue-400" />
                <span>Current Strength:</span>
              </span>
              <span className="text-blue-300 font-bold">{environment.ocean_current_speed} m/s</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={environment.ocean_current_speed}
              onChange={(e) => onUpdateEnvironment({ ocean_current_speed: parseFloat(e.target.value) })}
              className="w-full accent-blue-400 h-1.5 bg-navy-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.1 m/s (Slack)</span>
              <span>3.0 m/s (Turbulent Gyre)</span>
            </div>
          </div>

          {/* 3. Wave Height / Sea State */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center space-x-1">
                <Waves className="w-3.5 h-3.5 text-teal-400" />
                <span>Wave Intensity (Heave):</span>
              </span>
              <span className="text-teal-300 font-bold">{environment.wave_height} m</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="7.0"
              step="0.2"
              value={environment.wave_height}
              onChange={(e) => onUpdateEnvironment({ wave_height: parseFloat(e.target.value) })}
              className="w-full accent-teal-400 h-1.5 bg-navy-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.2m (Calm)</span>
              <span>7.0m (Severe Polar Gale)</span>
            </div>
          </div>

          {/* 4. Sunlight / Solar Irradiance */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center space-x-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Solar Irradiance:</span>
              </span>
              <span className="text-amber-300 font-bold">{environment.solar_irradiance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={environment.solar_irradiance}
              onChange={(e) => onUpdateEnvironment({ solar_irradiance: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 h-1.5 bg-navy-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Polar Night)</span>
              <span>100% (Midnight Sun)</span>
            </div>
          </div>

          {/* 5. Communication Availability Toggle */}
          <div className="space-y-2 pt-1 border-t border-navy-800">
            <span className="text-xs font-mono text-slate-300 flex items-center space-x-1">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Communication Availability:</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onSetCommunication('ONLINE')}
                className={`py-1.5 px-2 text-xs font-mono rounded border transition ${
                  communication.link_status === 'ONLINE'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                    : 'bg-navy-900 text-slate-400 border-navy-700 hover:text-white'
                }`}
              >
                ONLINE
              </button>
              <button
                onClick={() => onSetCommunication('DEGRADED')}
                className={`py-1.5 px-2 text-xs font-mono rounded border transition ${
                  communication.link_status === 'DEGRADED'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                    : 'bg-navy-900 text-slate-400 border-navy-700 hover:text-white'
                }`}
              >
                DEGRADED
              </button>
              <button
                onClick={() => onSetCommunication('OFFLINE')}
                className={`py-1.5 px-2 text-xs font-mono rounded border transition ${
                  communication.link_status === 'OFFLINE'
                    ? 'bg-red-500/25 text-red-300 border-red-500/50 font-bold'
                    : 'bg-navy-900 text-slate-400 border-navy-700 hover:text-white'
                }`}
              >
                BLACKOUT
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
