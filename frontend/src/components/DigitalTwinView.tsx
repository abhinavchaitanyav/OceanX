import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  Radio, 
  Activity, 
  Database, 
  ShieldCheck, 
  Battery, 
  Compass, 
  Monitor, 
  ChevronRight, 
  Sparkles,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { MissionState, EnergyState, CommunicationState, Sensor } from '../types';

interface DigitalTwinViewProps {
  mission: MissionState;
  energy: EnergyState;
  communication: CommunicationState;
  sensors: Sensor[];
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  mission,
  energy,
  communication,
  sensors
}) => {
  const [selectedNode, setSelectedNode] = useState<string>('rpi5');

  const nodes = [
    {
      id: 'sensors',
      title: 'Transducer Layer',
      subtitle: 'Submersible Probes (PT100, DO, pH, Salinity, Pressure)',
      status: `${sensors.filter(s => s.health === 'HEALTHY').length} / ${sensors.length} Healthy`,
      icon: Activity,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/40',
      bgColor: 'bg-blue-500/10',
      role: 'Direct physical contact with extreme polar marine column',
      specs: [
        'PT100 RTD Class A (-50°C to +100°C) with 316L stainless steel thermowell',
        'Optical luminescence Dissolved Oxygen probe (no electrolyte or membrane freezing)',
        'Toroidal inductive conductivity/salinity probe (anti-biofouling PEEK)',
        'Piezoresistive titanium pressure transducer (0-300 dbar depth)',
        'Differential analog conditioning with 24-bit delta-sigma ADC'
      ]
    },
    {
      id: 'esp32',
      title: 'ESP32-S3 Microcontroller',
      subtitle: 'Real-Time Acquisition & Watchdog Coprocessor',
      status: 'Active (240MHz Xtensa Dual-Core)',
      icon: Cpu,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      bgColor: 'bg-cyan-500/10',
      role: 'Real-time sensor acquisition, watchdog timer, and hardware power-gating',
      specs: [
        'Hardware SPI, I2C, and RS-485 / Modbus bus orchestrator',
        'Independent hardware watchdog circuit resetting on frozen bus cycles',
        'ULP (Ultra Low Power) co-processor monitoring critical thresholds during sleep',
        'Power-gated MOSFET switches cutting sensor quiescent drain between cycles',
        'Direct DMA telemetry transfer to Raspberry Pi 5 via high-speed UART'
      ]
    },
    {
      id: 'rpi5',
      title: 'Raspberry Pi 5 (8GB)',
      subtitle: 'Edge Computing & Autonomous Controller',
      status: 'Nominal (4.2W Draw)',
      icon: HardDrive,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      bgColor: 'bg-purple-500/10',
      role: 'Edge analytics, physical range validation, local SQLite buffer, and decision engine',
      specs: [
        'Broadcom BCM2712 Quad-core ARM Cortex-A76 @ 2.4GHz with 8GB LPDDR4X',
        'Embedded SQLite circular buffer with write-ahead logging (WAL)',
        'Linux systemd telemetry daemon managing background store-and-forward',
        'Adaptive power throttling scaling CPU frequency between 800MHz and 2.4GHz',
        'Cryptographic telemetry hashing ensuring polar research data provenance'
      ]
    },
    {
      id: 'ai_engine',
      title: 'AI Decision Engine',
      subtitle: 'Explainable Multi-Tier Analytics',
      status: `Sampling: ${mission.current_sampling_interval}s`,
      icon: ShieldCheck,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-500/10',
      role: 'Anomaly detection, sensor-fault isolation, adaptive sampling, and energy-aware decisions',
      specs: [
        'Statistical 30-sample rolling Z-Score & moving variance detector',
        'Rate-of-change velocity checking against polar hydrodynamic inertia',
        'Hardware fault isolator distinguishing frozen ADC reads from physical events',
        'Adaptive sampling state machine: 10s (dynamic anomaly) / 60s (normal) / 120s (power-saving)',
        'Energy optimization balancing battery state of charge (SOC) against sampling fidelity'
      ]
    },
    {
      id: 'comms',
      title: 'Communication Transceiver',
      subtitle: 'LoRa 868MHz + 4G LTE Cat-4 Relay',
      status: communication.link_status,
      icon: Radio,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgColor: 'bg-emerald-500/10',
      role: 'Multi-bearer telemetry transmission with resilient local store-and-forward fallback',
      specs: [
        'LoRa SX1262 transceiver (+22dBm output) for long-range coastal/vessel links up to 15km',
        'SIM7600G-H multi-band LTE fallback for near-shore high-speed burst sync',
        'Store-and-forward queue automatically buffering packets during ionospheric/storm blackouts',
        'Zero data loss protocol: automatic backpressure and checksum verification upon link restoration',
        'Compressed binary delta encoding minimizing transmit power consumption'
      ]
    },
    {
      id: 'dashboard',
      title: 'OceanX Research Cloud',
      subtitle: 'Shore Station Digital Twin & Telemetry Dashboard',
      status: 'Live Synced',
      icon: Monitor,
      color: 'text-teal-400',
      borderColor: 'border-teal-500/40',
      bgColor: 'bg-teal-500/10',
      role: 'Visualization of sensor data, platform health, drift trajectory, and historical records',
      specs: [
        'Real-time bi-directional telemetry visualization and command uplink',
        'Interactive digital twin visualizing ocean wave heave, tilt, and depth profiles',
        'Auditable mission event log and automated CSV export for oceanographic researchers',
        'Fixed vs Adaptive sampling efficiency comparison and battery lifespan analytics'
      ]
    }
  ];

  const currentNode = nodes.find(n => n.id === selectedNode) || nodes[2];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl ocean-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">OCEANX SYSTEM DIGITAL TWIN & HARDWARE TOPOLOGY</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive virtual representation of the dual-tier embedded compute, edge AI, and store-and-forward telemetry pipeline.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-navy-900 border border-navy-700 text-slate-300">
            Node Status: <strong className="text-emerald-400">NOMINAL</strong>
          </span>
        </div>
      </div>

      {/* Interactive Horizontal Architecture Pipeline */}
      <div className="p-6 rounded-xl ocean-card">
        <div className="text-xs font-mono text-cyan-400 font-bold mb-4 tracking-wider uppercase flex items-center justify-between">
          <span>EDGE COMPUTING & TELEMETRY FLOW (CLICK TO INSPECT)</span>
          <span className="text-slate-400 text-[11px] font-normal">SENSE → PROCESS → REASON → TRANSMIT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 relative">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;

            return (
              <div key={node.id} className="relative flex flex-col">
                <button
                  onClick={() => setSelectedNode(node.id)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-36 transition-all duration-300 ${
                    isSelected
                      ? `${node.borderColor} ${node.bgColor} shadow-lg ring-2 ring-cyan-400/50 scale-102`
                      : 'bg-navy-900/70 border-navy-700/80 hover:border-cyan-700 hover:bg-navy-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-1.5 rounded-lg ${node.bgColor} ${node.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">0{index + 1}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">{node.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{node.subtitle}</p>
                  </div>

                  <div className="border-t border-navy-800 pt-1.5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-semibold text-cyan-300">{node.status}</span>
                  </div>
                </button>

                {/* Animated Arrow Connector for desktop */}
                {index < nodes.length - 1 && (
                  <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-navy-900 border border-cyan-500/40 items-center justify-center text-cyan-400 shadow">
                    <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Detailed Engineering Specification Drawer */}
      <div className="p-6 rounded-xl ocean-card border-cyan-500/30 animate-fadeIn">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-navy-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${currentNode.bgColor} ${currentNode.color} border ${currentNode.borderColor}`}>
              {React.createElement(currentNode.icon, { className: "w-6 h-6" })}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-wide">{currentNode.title}</h3>
                <span className="px-2 py-0.5 text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded">
                  {currentNode.subtitle}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                <span className="text-cyan-400 font-semibold">Primary Engineering Role: </span>
                {currentNode.role}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-navy-900/90 border border-navy-700 text-xs font-mono">
            <span className="text-slate-400">Live Operating Status: </span>
            <span className="text-emerald-300 font-bold">{currentNode.status}</span>
          </div>
        </div>

        {/* Technical Specs List */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
            PHYSICAL IMPLEMENTATION & HARDWARE SPECIFICATIONS:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentNode.specs.map((spec, i) => (
              <div key={i} className="p-3 rounded-lg bg-navy-900/60 border border-navy-800 flex items-start space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{spec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hardware Transition Callout */}
        <div className="mt-5 p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-xs text-slate-300 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Hardware Ready Design:</strong> The virtual software API contracts directly match the physical SPI/I2C and serial payload formats intended for physical ESP32 and RPi5 deployment.
            </span>
          </span>
          <span className="text-[11px] font-mono text-cyan-400 hidden sm:inline">ZERO RE-ARCHITECTING REQUIRED</span>
        </div>
      </div>
    </div>
  );
};
