import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { VirtualOceanCanvas } from './components/VirtualOceanCanvas';
import { SensorDashboard } from './components/SensorDashboard';
import { SensorConfigModal } from './components/SensorConfigModal';
import { DigitalTwinView } from './components/DigitalTwinView';
import { AIEnginePanel } from './components/AIEnginePanel';
import { SensorFaultPanel } from './components/SensorFaultPanel';
import { AdaptiveSamplingBar } from './components/AdaptiveSamplingBar';
import { EnergyPanel } from './components/EnergyPanel';
import { CommunicationPanel } from './components/CommunicationPanel';
import { SimulationControls } from './components/SimulationControls';
import { SIHDemoMode } from './components/SIHDemoMode';
import { AnalyticsView } from './components/AnalyticsView';
import { ArchitectureBOM } from './components/ArchitectureBOM';
import { JudgeExplainerModal } from './components/JudgeExplainerModal';
import { ClientSimulationEngine } from './simulation/clientSimulation';
import { Sensor, TelemetryReading, EnvironmentState, SensorStatus, SensorHealth } from './types';

export const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('mission');

  // Client Simulation Engine instance
  const engineRef = useRef<ClientSimulationEngine>(new ClientSimulationEngine());
  const engine = engineRef.current;

  // React state reflecting engine
  const [sensors, setSensors] = useState<Sensor[]>(engine.sensors);
  const [environment, setEnvironment] = useState<EnvironmentState>(engine.environment);
  const [mission, setMission] = useState(engine.mission);
  const [energy, setEnergy] = useState(engine.energy);
  const [communication, setCommunication] = useState(engine.communication);
  const [syncedReadings, setSyncedReadings] = useState<TelemetryReading[]>(engine.syncedReadings);
  const [readingsHistory, setReadingsHistory] = useState<Record<string, number[]>>({});

  // Modals
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [isDemoModeOpen, setIsDemoModeOpen] = useState(false);
  const [isSensorModalOpen, setIsSensorModalOpen] = useState(false);
  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null);

  // Sync state from engine
  const syncStateFromEngine = () => {
    setSensors([...engine.sensors]);
    setEnvironment({ ...engine.environment });
    setMission({ ...engine.mission });
    setEnergy({ ...engine.energy });
    setCommunication({ ...engine.communication });
    setSyncedReadings([...engine.syncedReadings]);
    setReadingsHistory({ ...engine.readingsHistory });
  };

  // 1-second simulation clock cycle
  useEffect(() => {
    let tickCount = 0;
    const interval = setInterval(() => {
      tickCount++;
      engine.stepTimer(1);

      // Check acquisition period (10s mode: sample every 2 ticks; 60s mode: sample every 4 ticks; 120s mode: sample every 8 ticks)
      const samplingInterval = engine.mission.current_sampling_interval;
      const periodTicks = samplingInterval <= 10 ? 2 : (samplingInterval >= 120 ? 8 : 4);

      if (tickCount % periodTicks === 0) {
        engine.stepCycle();
      }

      syncStateFromEngine();
    }, 1000);

    return () => clearInterval(interval);
  }, [engine]);

  // Try fetching state from Python backend if available
  useEffect(() => {
    const fetchBackend = async () => {
      try {
        const res = await fetch('/api/simulation/state');
        if (res.ok) {
          const data = await res.json();
          // Optionally sync backend state if server active
        }
      } catch (e) {
        // Backend not running, client simulation handles 100% seamlessly
      }
    };
    fetchBackend();
  }, []);

  // Handlers
  const handleStartMission = () => {
    engine.mission.is_active = true;
    engine.mission.is_paused = false;
    syncStateFromEngine();
  };

  const handlePauseMission = () => {
    engine.mission.is_paused = true;
    syncStateFromEngine();
  };

  const handleResumeMission = () => {
    engine.mission.is_paused = false;
    syncStateFromEngine();
  };

  const handleResetMission = () => {
    engine.mission.elapsed_seconds = 0;
    engine.mission.is_active = true;
    engine.mission.is_paused = false;
    engine.mission.current_sampling_interval = 60;
    engine.mission.previous_sampling_interval = 60;
    engine.mission.sampling_change_reason = "Mission reset to nominal baseline";
    engine.mission.ai_decision = "MAINTAIN NORMAL OPERATION";
    engine.mission.ai_environmental_state = "NORMAL";
    engine.mission.overall_anomaly_score = 0.04;
    engine.mission.active_scenario = "NORMAL OCEAN";
    engine.clearInjections();
    engine.setBattery(84.5);
    engine.setSolar(65.0);
    engine.setCommunicationStatus('ONLINE');
    syncStateFromEngine();
  };

  const handleUpdateEnvironment = (env: Partial<EnvironmentState>) => {
    engine.environment = { ...engine.environment, ...env };
    if (env.solar_irradiance !== undefined) {
      engine.setSolar(env.solar_irradiance);
    }
    syncStateFromEngine();
  };

  const handleSetCommunication = (status: 'ONLINE' | 'DEGRADED' | 'OFFLINE') => {
    engine.setCommunicationStatus(status);
    syncStateFromEngine();
  };

  const handleRestoreAndSync = () => {
    engine.restoreCommunicationAndSync();
    syncStateFromEngine();
  };

  const handleInjectAnomaly = (sensorId: string, mag: number = 7.0) => {
    engine.injectAnomaly(sensorId, mag);
    syncStateFromEngine();
  };

  const handleInjectFault = (sensorId: string, faultType: string) => {
    engine.injectFault(sensorId, faultType);
    syncStateFromEngine();
  };

  const handleClearFaults = () => {
    engine.clearInjections();
    engine.sensors.forEach(s => {
      s.health = "HEALTHY";
      s.status = "NORMAL";
    });
    syncStateFromEngine();
  };

  const handleSimLowBattery = () => {
    engine.setBattery(18.0);
    syncStateFromEngine();
  };

  const handleSetSolar = (pct: number) => {
    engine.setSolar(pct);
    syncStateFromEngine();
  };

  const handleRunScenario = (scId: string) => {
    engine.clearInjections();
    if (scId === 'NORMAL_OCEAN') {
      engine.mission.active_scenario = "NORMAL OCEAN";
      engine.setBattery(84.5);
      engine.setSolar(65.0);
      engine.setCommunicationStatus('ONLINE');
    } else if (scId === 'TEMPERATURE_ANOMALY') {
      engine.mission.active_scenario = "SUDDEN TEMPERATURE CHANGE";
      engine.injectAnomaly('temp_1', 7.2);
    } else if (scId === 'HIGH_SALINITY') {
      engine.mission.active_scenario = "HIGH SALINITY";
      engine.injectAnomaly('sal_1', 5.5);
    } else if (scId === 'LOW_DO') {
      engine.mission.active_scenario = "LOW DISSOLVED OXYGEN";
      engine.injectAnomaly('do_1', 4.2);
    } else if (scId === 'SENSOR_FAILURE') {
      engine.mission.active_scenario = "SENSOR FAILURE (STUCK)";
      engine.injectFault('temp_1', 'STUCK');
    } else if (scId === 'COMM_BLACKOUT') {
      engine.mission.active_scenario = "COMMUNICATION BLACKOUT";
      engine.setCommunicationStatus('OFFLINE');
    } else if (scId === 'LOW_BATTERY') {
      engine.mission.active_scenario = "LOW BATTERY";
      engine.setBattery(17.5);
      engine.setSolar(0.0);
    } else if (scId === 'MULTI_SENSOR_ANOMALY') {
      engine.mission.active_scenario = "MULTI-SENSOR ANOMALY";
      engine.injectAnomaly('temp_1', 6.0);
      engine.injectAnomaly('sal_1', 3.8);
      engine.injectAnomaly('do_1', 3.0);
    }
    syncStateFromEngine();
  };

  const handleExecuteDemoStep = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // 0:00 Init
        handleResetMission();
        break;
      case 1: // 0:15 Nominal
        engine.clearInjections();
        engine.setCommunicationStatus('ONLINE');
        break;
      case 2: // 0:35 Temp Anomaly injected
        engine.injectAnomaly('temp_1', 6.8);
        break;
      case 3: // 0:45 AI detects
        // Engine automatically calculates score > 0.8
        break;
      case 4: // 0:50 Sampling changes to 10s
        // Engine handles
        break;
      case 5: // 1:05 Sensor fault injected
        engine.injectFault('sal_1', 'STUCK');
        break;
      case 6: // 1:15 Fault identified
        // Engine flags sensor degraded
        break;
      case 7: // 1:30 Comm blackout
        engine.setCommunicationStatus('OFFLINE');
        break;
      case 8: // 1:40 Buffering
        // Engine buffers incoming
        break;
      case 9: // 1:55 Comm restored
        engine.setCommunicationStatus('ONLINE');
        break;
      case 10: // 2:00 Sync
        engine.restoreCommunicationAndSync();
        break;
      case 11: // 2:10 Battery drops
        engine.setBattery(18.0);
        engine.setSolar(0.0);
        break;
      case 12: // 2:20 Energy-saving mode
        // Engine sets 120s
        break;
      case 13: // 2:30 Summary
        setActiveTab('analytics');
        break;
    }
    syncStateFromEngine();
  };

  const handleSaveSensor = (sensorData: Partial<Sensor>) => {
    if (sensorData.id) {
      // Edit existing
      engine.sensors = engine.sensors.map(s => s.id === sensorData.id ? { ...s, ...sensorData } as Sensor : s);
    } else {
      // Add new
      const newSensor: Sensor = {
        id: `sensor_${Date.now()}`,
        name: sensorData.name || 'Custom Sensor',
        type: sensorData.type || 'Custom',
        unit: sensorData.unit || 'unit',
        minValue: sensorData.minValue ?? 0,
        maxValue: sensorData.maxValue ?? 100,
        normalMin: sensorData.normalMin ?? 20,
        normalMax: sensorData.normalMax ?? 80,
        warningThreshold: sensorData.warningThreshold ?? 85,
        criticalThreshold: sensorData.criticalThreshold ?? 95,
        samplingInterval: sensorData.samplingInterval ?? 60,
        noiseLevel: sensorData.noiseLevel ?? 0.1,
        enabled: Boolean(sensorData.enabled ?? true),
        critical: Boolean(sensorData.critical ?? false),
        depth: sensorData.depth ?? 10,
        status: 'NORMAL',
        health: 'HEALTHY',
        lastValue: (Number(sensorData.normalMin) + Number(sensorData.normalMax)) / 2
      };
      engine.sensors.push(newSensor);
    }
    syncStateFromEngine();
  };

  const handleDeleteSensor = (sensorId: string) => {
    engine.sensors = engine.sensors.filter(s => s.id !== sensorId);
    syncStateFromEngine();
  };

  const handleExportCSV = () => {
    const rows = engine.syncedReadings.length > 0 ? engine.syncedReadings : [];
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Timestamp,Sensor ID,Sensor Name,Value,Unit,Status,Health,Anomaly Score,Sampling Interval,Latitude,Longitude\n" +
      rows.map(r => `${r.timestamp},${r.sensorId},${r.sensorName},${r.value},${r.unit},${r.status},${r.health},${r.anomalyScore},${r.samplingInterval},${r.latitude},${r.longitude}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `oceanx_simulated_mission_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mission={mission}
        energy={energy}
        communication={communication}
        onStartMission={handleStartMission}
        onPauseMission={handlePauseMission}
        onResumeMission={handleResumeMission}
        onResetMission={handleResetMission}
        onOpenJudgeModal={() => setIsJudgeModalOpen(true)}
        onOpenDemoMode={() => setIsDemoModeOpen(true)}
      />

      {/* Main Tabbed Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 flex-1">
        
        {/* TAB 1: MISSION / OVERVIEW */}
        {activeTab === 'mission' && (
          <div className="space-y-6">
            <LandingHero
              onStartMission={() => setActiveTab('ocean')}
              onExploreSystem={() => setActiveTab('digital-twin')}
            />
            <AdaptiveSamplingBar
              mission={mission}
              energy={energy}
            />
            <SensorDashboard
              sensors={sensors}
              onAddSensor={() => { setEditingSensor(null); setIsSensorModalOpen(true); }}
              onEditSensor={(s) => { setEditingSensor(s); setIsSensorModalOpen(true); }}
              onDeleteSensor={handleDeleteSensor}
              onInjectAnomaly={handleInjectAnomaly}
              onInjectFault={handleInjectFault}
              readingsHistory={readingsHistory}
            />
            <SimulationControls
              mission={mission}
              onRunScenario={handleRunScenario}
              onInjectAnomaly={handleInjectAnomaly}
              onInjectFault={handleInjectFault}
              onSimCommLoss={() => handleSetCommunication('OFFLINE')}
              onSimLowBattery={handleSimLowBattery}
              onReset={handleResetMission}
            />
          </div>
        )}

        {/* TAB 2: VIRTUAL OCEAN */}
        {activeTab === 'ocean' && (
          <div className="space-y-6">
            <VirtualOceanCanvas
              sensors={sensors}
              environment={environment}
              mission={mission}
              energy={energy}
              communication={communication}
              onUpdateEnvironment={handleUpdateEnvironment}
              onSetCommunication={handleSetCommunication}
            />
            <AdaptiveSamplingBar
              mission={mission}
              energy={energy}
            />
            <SimulationControls
              mission={mission}
              onRunScenario={handleRunScenario}
              onInjectAnomaly={handleInjectAnomaly}
              onInjectFault={handleInjectFault}
              onSimCommLoss={() => handleSetCommunication('OFFLINE')}
              onSimLowBattery={handleSimLowBattery}
              onReset={handleResetMission}
            />
          </div>
        )}

        {/* TAB 3: SENSORS & CONFIG */}
        {activeTab === 'sensors' && (
          <div className="space-y-6">
            <SensorDashboard
              sensors={sensors}
              onAddSensor={() => { setEditingSensor(null); setIsSensorModalOpen(true); }}
              onEditSensor={(s) => { setEditingSensor(s); setIsSensorModalOpen(true); }}
              onDeleteSensor={handleDeleteSensor}
              onInjectAnomaly={handleInjectAnomaly}
              onInjectFault={handleInjectFault}
              readingsHistory={readingsHistory}
            />
            <AdaptiveSamplingBar
              mission={mission}
              energy={energy}
            />
          </div>
        )}

        {/* TAB 4: DIGITAL TWIN */}
        {activeTab === 'digital-twin' && (
          <div className="space-y-6">
            <DigitalTwinView
              mission={mission}
              energy={energy}
              communication={communication}
              sensors={sensors}
            />
            <AdaptiveSamplingBar
              mission={mission}
              energy={energy}
            />
          </div>
        )}

        {/* TAB 5: AI DECISION ENGINE */}
        {activeTab === 'ai-engine' && (
          <div className="space-y-6">
            <AIEnginePanel
              mission={mission}
              sensors={sensors}
              energy={energy}
              communication={communication}
            />
            <AdaptiveSamplingBar
              mission={mission}
              energy={energy}
            />
            <SimulationControls
              mission={mission}
              onRunScenario={handleRunScenario}
              onInjectAnomaly={handleInjectAnomaly}
              onInjectFault={handleInjectFault}
              onSimCommLoss={() => handleSetCommunication('OFFLINE')}
              onSimLowBattery={handleSimLowBattery}
              onReset={handleResetMission}
            />
          </div>
        )}

        {/* TAB 6: FAULT ISOLATION */}
        {activeTab === 'faults' && (
          <div className="space-y-6">
            <SensorFaultPanel
              sensors={sensors}
              onInjectFault={handleInjectFault}
              onClearFaults={handleClearFaults}
            />
          </div>
        )}

        {/* TAB 7: COMMUNICATION */}
        {activeTab === 'comms' && (
          <div className="space-y-6">
            <CommunicationPanel
              communication={communication}
              onSetStatus={handleSetCommunication}
              onRestoreAndSync={handleRestoreAndSync}
            />
            <AdaptiveSamplingBar
              mission={mission}
              energy={energy}
            />
          </div>
        )}

        {/* TAB 8: POWER & ENERGY */}
        {activeTab === 'energy' && (
          <div className="space-y-6">
            <EnergyPanel
              energy={energy}
              mission={mission}
              onSetSolar={handleSetSolar}
              onSimulateLowBattery={handleSimLowBattery}
              onResetBattery={() => engine.setBattery(84.5)}
            />
            <AdaptiveSamplingBar
              mission={mission}
              energy={energy}
            />
          </div>
        )}

        {/* TAB 9: ANALYTICS & DATA */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <AnalyticsView
              syncedReadings={syncedReadings}
              sensors={sensors}
              energy={energy}
              communication={communication}
              mission={mission}
              onExportCSV={handleExportCSV}
            />
          </div>
        )}

        {/* TAB 10: BOM & ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <ArchitectureBOM />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-navy-800/80 bg-navy-950 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-slate-300 font-bold">OCEANX</span> — Autonomous Low-Cost Ocean Observation Platform
            <p className="text-[11px] text-slate-500 mt-0.5">
              SIH 2026 Round 2 • Problem Statement: 26065 • Team: <strong className="text-cyan-400">Coders May Cry (CMC)</strong>
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-500">
            <span>Virtual Digital Twin & Autonomous Decision Simulator</span>
            <p className="text-[10px] text-slate-600">Simulated sensor stream • Marine qualification required for physical deployment</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JudgeExplainerModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
        onStartDemo={() => {
          setIsJudgeModalOpen(false);
          setIsDemoModeOpen(true);
        }}
      />

      <SIHDemoMode
        isOpen={isDemoModeOpen}
        onClose={() => setIsDemoModeOpen(false)}
        onExecuteDemoStep={handleExecuteDemoStep}
      />

      <SensorConfigModal
        isOpen={isSensorModalOpen}
        onClose={() => setIsSensorModalOpen(false)}
        onSave={handleSaveSensor}
        initialSensor={editingSensor}
      />

    </div>
  );
};
