import React, { useState } from 'react';
import { 
  Radio, 
  Database, 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2, 
  RefreshCw,
  HardDrive,
  AlertTriangle
} from 'lucide-react';
import { CommunicationState } from '../types';

interface CommunicationPanelProps {
  communication: CommunicationState;
  onSetStatus: (status: 'ONLINE' | 'DEGRADED' | 'OFFLINE') => void;
  onRestoreAndSync: () => void;
}

export const CommunicationPanel: React.FC<CommunicationPanelProps> = ({
  communication,
  onSetStatus,
  onRestoreAndSync
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onRestoreAndSync();
      setIsSyncing(false);
      setLastSyncResult(`All ${communication.buffered_locally} queued telemetry packets synchronized successfully with 0 data loss.`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl ocean-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              COMMUNICATION & RESILIENT STORE-AND-FORWARD BUFFER
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
              LoRa SX1262 / 4G LTE Hybrid
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Zero-loss autonomous telemetry architecture: continuous local caching during polar storm blackouts and automated backfill sync.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {communication.buffered_locally > 0 && communication.link_status === 'OFFLINE' ? (
            <button
              onClick={handleSyncClick}
              disabled={isSyncing}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing Buffer...' : 'RESTORE COMMUNICATION & SYNC'}</span>
            </button>
          ) : (
            <span className="px-3 py-1 text-xs font-mono rounded bg-navy-900 border border-navy-700 text-slate-400">
              Link Status: <strong className="text-emerald-400">{communication.link_status}</strong>
            </span>
          )}
        </div>
      </div>

      {/* 3 Link Status Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* State 1: ONLINE */}
        <button
          onClick={() => onSetStatus('ONLINE')}
          className={`p-4 rounded-xl border text-left transition-all ${
            communication.link_status === 'ONLINE'
              ? 'bg-emerald-500/15 border-emerald-500/60 shadow-lg ring-1 ring-emerald-500/50'
              : 'ocean-card hover:border-navy-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Wifi className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm text-white">ONLINE LINK</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Full RF connectivity available. Sensor observations are dispatched immediately to shore station dashboard.
          </p>
          <div className="mt-3 text-[10px] font-mono text-emerald-300">
            RSSI: -75 dBm • Packet Delivery: 100%
          </div>
        </button>

        {/* State 2: DEGRADED */}
        <button
          onClick={() => onSetStatus('DEGRADED')}
          className={`p-4 rounded-xl border text-left transition-all ${
            communication.link_status === 'DEGRADED'
              ? 'bg-amber-500/15 border-amber-500/60 shadow-lg ring-1 ring-amber-500/50'
              : 'ocean-card hover:border-navy-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm text-white">DEGRADED LINK</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Severe polar sea spray / marginal link budget. Non-critical telemetry is throttled; critical alerts prioritized.
          </p>
          <div className="mt-3 text-[10px] font-mono text-amber-300">
            RSSI: -112 dBm • Packet Delivery: ~65%
          </div>
        </button>

        {/* State 3: OFFLINE (BLACKOUT) */}
        <button
          onClick={() => onSetStatus('OFFLINE')}
          className={`p-4 rounded-xl border text-left transition-all ${
            communication.link_status === 'OFFLINE'
              ? 'bg-red-500/20 border-red-500/60 shadow-lg ring-1 ring-red-500/50 animate-pulse'
              : 'ocean-card hover:border-navy-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-5 h-5 text-red-400" />
              <span className="font-bold text-sm text-white">COMMUNICATION BLACKOUT</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Total ionospheric or polar storm blackout. Store-and-Forward automatically intercepts telemetry into local SQLite.
          </p>
          <div className="mt-3 text-[10px] font-mono text-red-300">
            Link: OFFLINE • Local Buffer Active
          </div>
        </button>

      </div>

      {/* Store-and-Forward Telemetry Live Counter Board */}
      <div className={`p-6 rounded-2xl border transition-all ${
        communication.link_status === 'OFFLINE' 
          ? 'bg-navy-900 border-amber-500/50 shadow-xl' 
          : 'ocean-card border-navy-800'
      }`}>
        <div className="flex items-center justify-between border-b border-navy-800 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              LOCAL TELEMETRY BUFFER METRICS (STORE & FORWARD)
            </span>
          </div>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
            communication.link_status === 'OFFLINE'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
          }`}>
            {communication.link_status === 'OFFLINE' ? 'STORE-AND-FORWARD ACTIVE' : 'REAL-TIME DISPATCH'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
          
          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800">
            <span className="text-slate-400 text-xs block mb-1">TOTAL GENERATED</span>
            <span className="text-3xl font-extrabold text-white">
              {communication.incoming_observations}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Acquired from ADC</span>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800">
            <span className="text-slate-400 text-xs block mb-1">BUFFERED LOCALLY</span>
            <span className={`text-3xl font-extrabold ${
              communication.buffered_locally > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-300'
            }`}>
              {communication.buffered_locally}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">In SQLite Flash Store</span>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800">
            <span className="text-slate-400 text-xs block mb-1">SYNCHRONIZED TOTAL</span>
            <span className="text-3xl font-extrabold text-cyan-300">
              {communication.synchronized_total}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Uploaded to Shore</span>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/70 border border-emerald-500/40 bg-emerald-950/10">
            <span className="text-slate-400 text-xs block mb-1">DATA LOSS RATE</span>
            <span className="text-3xl font-extrabold text-emerald-400">
              0
            </span>
            <span className="text-[10px] text-emerald-300 block mt-1">Zero Telemetry Lost</span>
          </div>

        </div>

        {/* Sync Animation Progress Bar */}
        {isSyncing && (
          <div className="mt-5 space-y-2 p-3 rounded-lg bg-navy-950/90 border border-cyan-500/40 animate-fadeIn">
            <div className="flex justify-between text-xs font-mono text-cyan-300">
              <span>Synchronizing Local Flash Buffer → OceanX Shore Server</span>
              <span>Uploading...</span>
            </div>
            <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 animate-pulse w-full"></div>
            </div>
          </div>
        )}

        {/* Sync Success Callout */}
        {lastSyncResult && !isSyncing && communication.buffered_locally === 0 && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center space-x-2 animate-fadeIn font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{lastSyncResult}</span>
          </div>
        )}
      </div>
    </div>
  );
};
