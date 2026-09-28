import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Cpu, 
  Radio, 
  Battery, 
  ShieldAlert,
  X
} from 'lucide-react';
import { MissionState } from '../types';

interface SIHDemoModeProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteDemoStep: (stepIndex: number) => void;
}

export const SIHDemoMode: React.FC<SIHDemoModeProps> = ({
  isOpen,
  onClose,
  onExecuteDemoStep
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [demoSeconds, setDemoSeconds] = useState(0);

  const demoScript = [
    {
      time: "0:00",
      seconds: 0,
      title: "System Initialization & Calibration",
      description: "ESP32-S3 starts watchdog, verifies power rails, and acquires baseline ADC readings across all 8 transducers.",
      actionLabel: "Baseline Startup",
      badge: "60s Baseline"
    },
    {
      time: "0:15",
      seconds: 15,
      title: "Normal Polar Ocean Observation",
      description: "Transducers stream nominal data (Temp 2.4°C, Salinity 34.2 PSU, DO 7.8 mg/L). Battery in balance with positive solar generation.",
      actionLabel: "Nominal Stream",
      badge: "Healthy Fleet"
    },
    {
      time: "0:35",
      seconds: 35,
      title: "Hydrothermal / Marine Heatwave Injected",
      description: "Water temperature spikes rapidly from 2.4°C to 8.9°C (+6.5°C departure). Rate of change departs physical ocean baseline.",
      actionLabel: "Inject Anomaly",
      badge: "Temp +6.5°C"
    },
    {
      time: "0:45",
      seconds: 45,
      title: "Edge AI Detects Environmental Anomaly",
      description: "Raspberry Pi 5 rolling Z-Score passes 2.8σ. Cross-sensor validation confirms physical temperature/DO correlation.",
      actionLabel: "AI Diagnosis",
      badge: "Score: 0.92"
    },
    {
      time: "0:50",
      seconds: 50,
      title: "Autonomous Adaptive Sampling Triggers",
      description: "Sampling frequency autonomously accelerates: 60 sec → 10 sec to capture high-rate fluid turbulence without data loss.",
      actionLabel: "Rate: 10s",
      badge: "Adaptive 10s"
    },
    {
      time: "1:05",
      seconds: 65,
      title: "Sensor Hardware Freeze Fault Injected",
      description: "Salinity sensor freezes at exactly 34.210 PSU. Telemetry continues but exhibits zero variance despite active wave heave.",
      actionLabel: "Inject Fault",
      badge: "Stuck Transducer"
    },
    {
      time: "1:15",
      seconds: 75,
      title: "Fault Detector Isolates Transducer Failure",
      description: "System identifies transducer failure rather than ocean event! Health marked DEGRADED. No false sampling alarm triggered.",
      actionLabel: "Fault Isolated",
      badge: "Health: DEGRADED"
    },
    {
      time: "1:30",
      seconds: 90,
      title: "Polar Storm Communication Blackout",
      description: "Severe polar ionospheric disturbance severs RF telemetry link. Link transitions to OFFLINE.",
      actionLabel: "Sever Link",
      badge: "Comms OFFLINE"
    },
    {
      time: "1:40",
      seconds: 100,
      title: "Local Store-and-Forward Buffer Activates",
      description: "Edge SQLite circular flash buffer spools all incoming observations. Buffer increments continuously; data loss = 0.",
      actionLabel: "Buffering Data",
      badge: "Zero Data Loss"
    },
    {
      time: "1:55",
      seconds: 115,
      title: "RF / Cellular Link Restored",
      description: "Polar storm abates. High-gain LoRa/LTE link establishes handshake with shore station research gateway.",
      actionLabel: "Link Up",
      badge: "Comms ONLINE"
    },
    {
      time: "2:00",
      seconds: 120,
      title: "Buffered Observations Synchronize",
      description: "Backlogged flash queue synchronizes to research cloud. Buffer drains cleanly to 0 with verified checksums.",
      actionLabel: "Sync Complete",
      badge: "Buffer Drained"
    },
    {
      time: "2:10",
      seconds: 130,
      title: "Solar Insolation Ceases / Low Battery",
      description: "Entering polar night shadow. Battery drops to 18% triggering Low-Voltage Disconnect (LVD) safety threshold.",
      actionLabel: "Low Battery",
      badge: "Battery 18%"
    },
    {
      time: "2:20",
      seconds: 140,
      title: "Autonomous Energy-Saving Mode Activates",
      description: "Sampling throttled from 10s/60s → 120s. Non-essential peripherals powered down, protecting LiFePO4 chemistry.",
      actionLabel: "Power Saving",
      badge: "Adaptive 120s"
    },
    {
      time: "2:30",
      seconds: 150,
      title: "Mission Completed — Summary Generated",
      description: "Automated mission performance report compiled: total observations, energy saved vs fixed sampling, and zero telemetry loss.",
      actionLabel: "Mission Summary",
      badge: "SIH Complete"
    }
  ];

  // Automated timer loop for demo
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setDemoSeconds(prev => {
          const next = prev + 1;
          // Check if matches next step
          const nextStepIdx = demoScript.findIndex(s => s.seconds === next);
          if (nextStepIdx !== -1) {
            setCurrentStepIndex(nextStepIdx);
            onExecuteDemoStep(nextStepIdx);
          }
          if (next >= 155) {
            setIsRunning(false);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, onExecuteDemoStep]);

  const handleStart = () => {
    setIsRunning(true);
    if (demoSeconds === 0) {
      onExecuteDemoStep(0);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleRestart = () => {
    setIsRunning(false);
    setDemoSeconds(0);
    setCurrentStepIndex(0);
    onExecuteDemoStep(0);
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    setDemoSeconds(demoScript[index].seconds);
    onExecuteDemoStep(index);
  };

  if (!isOpen) return null;

  const currentStep = demoScript[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl rounded-2xl ocean-card border border-amber-500/50 p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Sparkles className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                SIH ROUND 2 — AUTOMATED 2.5-MINUTE DEMO SCRIPT
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Hands-free automated demonstration showcasing every OceanX capability to evaluators.
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

        {/* Demo Timer & Master Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-navy-900/90 border border-navy-800">
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-700 font-mono text-lg font-extrabold text-amber-300">
              {String(Math.floor(demoSeconds / 60)).padStart(2, '0')}:{String(demoSeconds % 60).padStart(2, '0')} / 02:30
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Step {currentStepIndex + 1} of {demoScript.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {isRunning ? (
              <button
                onClick={handlePause}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-navy-950 font-bold text-xs rounded-lg flex items-center space-x-1.5 transition"
              >
                <Pause className="w-4 h-4 fill-navy-950" />
                <span>Pause Demo</span>
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-navy-950 font-extrabold text-xs rounded-lg flex items-center space-x-1.5 shadow-lg shadow-orange-500/20 transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-navy-950" />
                <span>{demoSeconds === 0 ? 'START SIH DEMO' : 'RESUME DEMO'}</span>
              </button>
            )}

            <button
              onClick={handleRestart}
              className="p-2 bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700 rounded-lg transition"
              title="Restart from 00:00"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Active Step Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-navy-900 to-navy-950 border border-amber-500/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400 font-bold uppercase tracking-wider">
              NOW DEMONSTRATING [{currentStep.time}]:
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              {currentStep.badge}
            </span>
          </div>
          <h4 className="text-base font-bold text-white">{currentStep.title}</h4>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Interactive Step Timeline (Clickable to jump) */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">
            DEMO MILESTONES (CLICK ANY STEP TO JUMP):
          </span>
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {demoScript.map((step, idx) => {
              const isPast = demoSeconds >= step.seconds;
              const isCurrent = currentStepIndex === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleJumpToStep(idx)}
                  className={`w-full p-2 rounded-lg text-left text-xs font-mono flex items-center justify-between transition ${
                    isCurrent
                      ? 'bg-amber-500/20 border border-amber-400 text-white font-bold'
                      : isPast
                      ? 'bg-navy-900/60 border border-navy-800 text-slate-300'
                      : 'bg-navy-950/40 border border-navy-900 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-amber-400 font-bold w-9">{step.time}</span>
                    <span className="truncate">{step.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{step.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-navy-800 pt-3 text-xs text-slate-400">
          <span>The simulator autonomously resets, injects, and demonstrates each stage in real time.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
