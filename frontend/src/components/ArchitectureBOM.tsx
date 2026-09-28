import React, { useState } from 'react';
import { 
  FileText, 
  Cpu, 
  Battery, 
  Layers, 
  Radio, 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Compass, 
  Info,
  Edit2,
  Check
} from 'lucide-react';
import { BOMItem } from '../types';

export const INITIAL_BOM: BOMItem[] = [
  {
    id: "bom_1",
    category: "Compute & Edge",
    component: "ESP32-S3-WROOM-1",
    specification: "Dual-core Xtensa LX7, 240MHz, Ultra-low power co-processor",
    quantity: 1,
    unitCostINR: 550,
    unitCostUSD: 6.6,
    purpose: "Sensor acquisition, conditioning, hardware watchdog, power-gating"
  },
  {
    id: "bom_2",
    category: "Compute & Edge",
    component: "Raspberry Pi 5 (8GB)",
    specification: "Quad-core Cortex-A76, 2.4GHz, 8GB LPDDR4X",
    quantity: 1,
    unitCostINR: 7800,
    unitCostUSD: 93.9,
    purpose: "Edge AI decision engine, anomaly validation, SQLite buffer, store-forward"
  },
  {
    id: "bom_3",
    category: "Sensors",
    component: "PT100 RTD Class A Submersible",
    specification: "Marine-grade 316L stainless steel, -50°C to +100°C, 0.05°C accuracy",
    quantity: 1,
    unitCostINR: 3200,
    unitCostUSD: 38.5,
    purpose: "Polar water temperature profiling"
  },
  {
    id: "bom_4",
    category: "Sensors",
    component: "Industrial Piezoresistive Depth Transducer",
    specification: "0-20 bar (200m depth), 4-20mA / I2C output, titanium diaphragm",
    quantity: 1,
    unitCostINR: 5800,
    unitCostUSD: 69.8,
    purpose: "Hydrostatic pressure and mooring depth calculation"
  },
  {
    id: "bom_5",
    category: "Sensors",
    component: "Toroidal Inductive Salinity / Conductivity",
    specification: "0-100 mS/cm (0-70 PSU), anti-fouling PEEK body",
    quantity: 1,
    unitCostINR: 9500,
    unitCostUSD: 114.4,
    purpose: "Salinity, brine rejection, and ocean circulation tracking"
  },
  {
    id: "bom_6",
    category: "Sensors",
    component: "Industrial Combination Sealed pH Electrode",
    specification: "0-14 pH, double junction ceramic, gel electrolyte, 316L cage",
    quantity: 1,
    unitCostINR: 2800,
    unitCostUSD: 33.7,
    purpose: "Ocean acidification and biochemical health monitoring"
  },
  {
    id: "bom_7",
    category: "Sensors",
    component: "Optical Luminescence Dissolved Oxygen (DO)",
    specification: "0-20 mg/L, no oxygen consumption, long calibration stability",
    quantity: 1,
    unitCostINR: 11500,
    unitCostUSD: 138.5,
    purpose: "Polar biological productivity, hypoxia, and ventilation detection"
  },
  {
    id: "bom_8",
    category: "Sensors",
    component: "Multi-GNSS Receiver Module (u-blox NEO-M9N)",
    specification: "GPS, GLONASS, Galileo, BeiDou, 1.5m CEP, active patch antenna",
    quantity: 1,
    unitCostINR: 2400,
    unitCostUSD: 28.9,
    purpose: "Geographic drift tracking and timestamp synchronization"
  },
  {
    id: "bom_9",
    category: "Sensors",
    component: "BNO085 9-DOF IMU & Attitude Sensor",
    specification: "Fused pitch, roll, heading, ocean wave heave acceleration",
    quantity: 1,
    unitCostINR: 1900,
    unitCostUSD: 22.8,
    purpose: "Wave height calculation and buoy stability telemetry"
  },
  {
    id: "bom_10",
    category: "Communication",
    component: "LoRa SX1262 Long-Range Transceiver HAT",
    specification: "868/915 MHz, +22dBm output, up to 15km line-of-sight marine link",
    quantity: 1,
    unitCostINR: 2100,
    unitCostUSD: 25.3,
    purpose: "Coastal/ship relay telemetry link"
  },
  {
    id: "bom_11",
    category: "Communication",
    component: "SIM7600G-H 4G LTE Cat-4 / GNSS HAT",
    specification: "Global bands, fall-back cellular telemetry for near-shore missions",
    quantity: 1,
    unitCostINR: 4600,
    unitCostUSD: 55.4,
    purpose: "High-bandwidth synced telemetry and remote mission re-tasking"
  },
  {
    id: "bom_12",
    category: "Power System",
    component: "LiFePO4 Deep-Cycle Battery Pack (12.8V 20Ah)",
    specification: "Cold-temperature electrolyte (-20°C operational), integrated BMS",
    quantity: 1,
    unitCostINR: 7500,
    unitCostUSD: 90.3,
    purpose: "Primary energy reservoir with 2500+ cycle life"
  },
  {
    id: "bom_13",
    category: "Power System",
    component: "Marine Flexible Monocrystalline Solar Panel (30W)",
    specification: "ETFE anti-reflective coating, saltwater proof, bypass diodes",
    quantity: 2,
    unitCostINR: 4800,
    unitCostUSD: 57.8,
    purpose: "Surface energy harvesting during polar summer periods"
  },
  {
    id: "bom_14",
    category: "Power System",
    component: "MPPT Solar Charge Controller & DC-DC Bucks",
    specification: "98% conversion efficiency, low quiescent current (12mA)",
    quantity: 1,
    unitCostINR: 2200,
    unitCostUSD: 26.5,
    purpose: "Voltage regulation for 12V bus, 5V (RPi), and 3.3V (ESP32)"
  },
  {
    id: "bom_15",
    category: "Structure",
    component: "Polyethylene / Aluminum Spar Buoy Hull & Keel",
    specification: "Positive stability center of mass, anti-heave damping plate",
    quantity: 1,
    unitCostINR: 14500,
    unitCostUSD: 174.6,
    purpose: "Wave-piercing floating structure and sensor umbilical strain relief"
  },
  {
    id: "bom_16",
    category: "Structure",
    component: "IP68 Marine Sealed Pod & Subconn Umbilical",
    specification: "Anodized marine aluminum housing, nitrogen-purged dessicant",
    quantity: 1,
    unitCostINR: 8200,
    unitCostUSD: 98.7,
    purpose: "Complete waterproof protection for edge computing and power units"
  }
];

export const ArchitectureBOM: React.FC = () => {
  const [bomItems, setBomItems] = useState<BOMItem[]>(INITIAL_BOM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  const handleQuantityChange = (id: string, qty: number) => {
    setBomItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, qty) } : item));
  };

  const handleCostChange = (id: string, inrCost: number) => {
    setBomItems(prev => prev.map(item => item.id === id ? { 
      ...item, 
      unitCostINR: Math.max(0, inrCost),
      unitCostUSD: Math.round((inrCost / 83.1) * 10) / 10
    } : item));
  };

  const totalCostINR = bomItems.reduce((acc, item) => acc + item.quantity * item.unitCostINR, 0);
  const totalCostUSD = bomItems.reduce((acc, item) => acc + item.quantity * item.unitCostUSD, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl ocean-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              SYSTEM ARCHITECTURE & PHYSICAL PROTOTYPE BOM
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
              SIH Phase Transition Roadmap
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete hardware block diagram, power subsystem, and interactive Bill of Materials costing.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-navy-900 p-1 rounded-lg border border-navy-700 text-xs font-mono">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1 rounded transition ${currency === 'INR' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded transition ${currency === 'USD' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
            >
              USD ($)
            </button>
          </div>
        </div>
      </div>

      {/* Hardware Architecture Block Diagram Card */}
      <div className="p-6 rounded-xl ocean-card space-y-4">
        <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider text-cyan-400 flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>END-TO-END PHYSICAL HARDWARE TOPOLOGY</span>
        </h3>

        {/* Visual Architecture Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          
          {/* Layer 1: Sensors */}
          <div className="p-4 rounded-xl bg-navy-900/80 border border-blue-500/30 space-y-2">
            <span className="text-[10px] text-blue-400 font-bold block uppercase">1. SENSOR ARRAY</span>
            <ul className="text-slate-300 space-y-1 text-[11px]">
              <li>• PT100 Water Temp RTD</li>
              <li>• Piezoresistive Pressure (20 bar)</li>
              <li>• Inductive Salinity / Conductivity</li>
              <li>• Sealed Marine pH Electrode</li>
              <li>• Optical Dissolved Oxygen (DO)</li>
              <li>• u-blox NEO-M9N GNSS + IMU</li>
            </ul>
          </div>

          {/* Layer 2: ESP32-S3 Microcontroller */}
          <div className="p-4 rounded-xl bg-navy-900/80 border border-cyan-500/30 space-y-2">
            <span className="text-[10px] text-cyan-400 font-bold block uppercase">2. ESP32-S3 (TIER 1)</span>
            <ul className="text-slate-300 space-y-1 text-[11px]">
              <li>• 24-bit ADC Delta-Sigma Sampling</li>
              <li>• Hardware Watchdog Circuit</li>
              <li>• Ultra-Low-Power Co-processor</li>
              <li>• Power-Gated Sensor Rail (MOSFET)</li>
              <li>• DMA UART to Raspberry Pi 5</li>
            </ul>
          </div>

          {/* Layer 3: Raspberry Pi 5 Edge Computer */}
          <div className="p-4 rounded-xl bg-navy-900/80 border border-purple-500/30 space-y-2">
            <span className="text-[10px] text-purple-400 font-bold block uppercase">3. RASPBERRY PI 5 (TIER 2)</span>
            <ul className="text-slate-300 space-y-1 text-[11px]">
              <li>• Edge AI Anomaly Detection</li>
              <li>• Rolling Z-Score & Moving Variance</li>
              <li>• Transducer Fault Isolator</li>
              <li>• Adaptive Sampling Controller</li>
              <li>• Local SQLite Circular Flash Buffer</li>
            </ul>
          </div>

          {/* Layer 4: Communication & Power */}
          <div className="p-4 rounded-xl bg-navy-900/80 border border-emerald-500/30 space-y-2">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase">4. COMMS & POWER</span>
            <ul className="text-slate-300 space-y-1 text-[11px]">
              <li>• LoRa SX1262 (+22dBm, 15km)</li>
              <li>• SIM7600G-H 4G LTE Backup</li>
              <li>• 256Wh LiFePO4 Battery Pack</li>
              <li>• 2x 30W Flexible Solar (MPPT)</li>
              <li>• Zero-Loss Store-and-Forward</li>
            </ul>
          </div>

        </div>
      </div>

      {/* From Simulation to Physical Prototype Callout */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-navy-900 to-navy-950 border border-cyan-500/40 space-y-2">
        <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs font-mono uppercase tracking-wider">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>FROM SIMULATION TO PHYSICAL CONTROLLED-WATER PROTOTYPE</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          "The simulator uses synthetic sensor streams today. The software architecture is strictly designed so the synthetic sensor layer can directly be replaced by physical ADC drivers (via ESP32-S3 SPI/I2C/UART). Initial testing will occur in a controlled-water environment (wave flume / test tank) before subsequent marine environmental qualification, ice survivability validation, and satellite transceiver integration."
        </p>
      </div>

      {/* Interactive Bill of Materials (BOM) Table */}
      <div className="p-6 rounded-xl ocean-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
              EXPECTED PHYSICAL PROTOTYPE BILL OF MATERIALS (BOM)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit quantities or unit costs directly to recalculate the prototype deployment budget.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-navy-950 border border-cyan-500/40 text-right font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">TOTAL ESTIMATED PROTOTYPE COST:</span>
            <span className="text-xl font-extrabold text-cyan-300">
              {currency === 'INR' ? `₹ ${totalCostINR.toLocaleString('en-IN')}` : `$ ${totalCostUSD.toFixed(1)} USD`}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-navy-800 text-slate-400 text-[11px]">
                <th className="pb-2">COMPONENT</th>
                <th className="pb-2">SPECIFICATION / MODEL</th>
                <th className="pb-2 text-center">QTY</th>
                <th className="pb-2 text-right">UNIT COST ({currency === 'INR' ? '₹' : '$'})</th>
                <th className="pb-2 text-right">TOTAL</th>
                <th className="pb-2 pl-4">ENGINEERING PURPOSE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 text-slate-200">
              {bomItems.map(item => {
                const isEditing = editingId === item.id;
                const cost = currency === 'INR' ? item.unitCostINR : item.unitCostUSD;
                const totalItemCost = item.quantity * cost;

                return (
                  <tr key={item.id} className="hover:bg-navy-900/40 transition">
                    <td className="py-2.5 font-bold text-white whitespace-nowrap">
                      {item.component}
                    </td>
                    <td className="py-2.5 text-slate-400 text-[11px] max-w-xs truncate" title={item.specification}>
                      {item.specification}
                    </td>
                    <td className="py-2.5 text-center">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        className="w-12 px-1.5 py-0.5 bg-navy-950 border border-navy-700 rounded text-center text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 text-right font-semibold">
                      <input
                        type="number"
                        step="10"
                        value={item.unitCostINR}
                        onChange={(e) => handleCostChange(item.id, parseFloat(e.target.value) || 0)}
                        className="w-20 px-1.5 py-0.5 bg-navy-950 border border-navy-700 rounded text-right text-slate-200 focus:border-cyan-400 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 text-right font-bold text-cyan-300 whitespace-nowrap">
                      {currency === 'INR' ? `₹ ${totalItemCost.toLocaleString('en-IN')}` : `$ ${totalItemCost.toFixed(1)}`}
                    </td>
                    <td className="py-2.5 pl-4 text-slate-300 text-[11px] font-sans max-w-sm">
                      {item.purpose}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 rounded-lg bg-navy-950/70 border border-navy-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            <strong>BOM Cost Notice:</strong> Indicative estimate for controlled-water proof-of-concept. Final cost depends on sensor marine qualification grade, anti-biofouling coatings, and procurement logistics.
          </span>
          <span className="text-cyan-400 font-mono text-[10px] hidden sm:inline">LOW-COST PROTOTYPE FOCUS</span>
        </div>
      </div>
    </div>
  );
};
