import React from 'react';
import { X, CheckCircle2, Waves, ArrowRight, ShieldCheck, Cpu, Radio, Battery, Sparkles } from 'lucide-react';

interface JudgeExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDemo: () => void;
}

export const JudgeExplainerModal: React.FC<JudgeExplainerModalProps> = ({
  isOpen,
  onClose,
  onStartDemo
}) => {
  if (!isOpen) return null;

  const steps = [
    { num: 1, title: "SENSE", text: "Multi-parameter submerged probes acquire Water Temp, Pressure/Depth, Salinity, pH, and DO." },
    { num: 2, title: "COLLECT", text: "Low-power ESP32-S3 conditions analog signals and runs an independent hardware watchdog." },
    { num: 3, title: "VALIDATE", text: "Raspberry Pi 5 checks rates of change and variance, distinguishing hardware failure from ocean events." },
    { num: 4, title: "ANALYZE", text: "Edge AI rolling Z-Score (30-sample window) and cross-sensor checks detect anomalies in real time." },
    { num: 5, title: "ADAPT", text: "Sampling accelerates dynamically (60s → 10s) during anomalies to capture dynamic marine events." },
    { num: 6, title: "POWER AWARE", text: "When battery drops below 25%, system autonomously drops to 120s power-saving mode." },
    { num: 7, title: "TRANSMIT", text: "LoRa 868MHz and 4G LTE send observations directly to research shore station." },
    { num: 8, title: "BUFFER", text: "During polar storm blackouts, Store-and-Forward spools all records into local SQLite (0 data loss)." },
    { num: 9, title: "SYNC", text: "When link returns, all backlogged telemetry seamlessly synchronizes with verified timestamps." },
    { num: 10, title: "VISUALIZE", text: "Research dashboard charts live trends, buoy attitude, battery, and exported mission CSV." }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl rounded-2xl ocean-card border border-cyan-500/50 p-6 shadow-2xl space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                HOW OCEANX WORKS — 60-SECOND JUDGE SUMMARY
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Smart India Hackathon 2026 • Problem Statement ID #26065
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-navy-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10-Step Rapid Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
          {steps.map(s => (
            <div key={s.num} className="p-2.5 rounded-lg bg-navy-900/70 border border-navy-800 flex items-start space-x-2.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                {s.num}
              </span>
              <div>
                <strong className="text-white font-mono block text-[11px]">{s.title}</strong>
                <p className="text-slate-300 text-[11px] leading-snug font-sans">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout & Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-navy-800 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Ready to see it in action?
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-300 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartDemo();
              }}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-navy-950 font-bold flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-navy-950" />
              <span>Launch 2-Min SIH Demo Mode</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
