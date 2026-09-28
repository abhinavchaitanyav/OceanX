import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle2, Sliders, Shield } from 'lucide-react';
import { Sensor, SensorType } from '../types';

interface SensorConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sensorData: Partial<Sensor>) => void;
  initialSensor?: Sensor | null;
}

export const SensorConfigModal: React.FC<SensorConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSensor
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<SensorType>('Temperature');
  const [unit, setUnit] = useState('°C');
  const [minValue, setMinValue] = useState(-5);
  const [maxValue, setMaxValue] = useState(15);
  const [normalMin, setNormalMin] = useState(0);
  const [normalMax, setNormalMax] = useState(5);
  const [samplingInterval, setSamplingInterval] = useState(60);
  const [noiseLevel, setNoiseLevel] = useState(0.15);
  const [depth, setDepth] = useState(15);
  const [critical, setCritical] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialSensor) {
      setName(initialSensor.name);
      setType(initialSensor.type);
      setUnit(initialSensor.unit);
      setMinValue(initialSensor.minValue);
      setMaxValue(initialSensor.maxValue);
      setNormalMin(initialSensor.normalMin);
      setNormalMax(initialSensor.normalMax);
      setSamplingInterval(initialSensor.samplingInterval);
      setNoiseLevel(initialSensor.noiseLevel);
      setDepth(initialSensor.depth);
      setCritical(Boolean(initialSensor.critical));
      setEnabled(Boolean(initialSensor.enabled));
    } else {
      // Defaults for new sensor
      setName('');
      setType('Temperature');
      setUnit('°C');
      setMinValue(-5);
      setMaxValue(15);
      setNormalMin(0);
      setNormalMax(5);
      setSamplingInterval(60);
      setNoiseLevel(0.15);
      setDepth(15);
      setCritical(false);
      setEnabled(true);
    }
    setError(null);
  }, [initialSensor, isOpen]);

  // Handle sensor type preset change
  const handleTypeChange = (newType: SensorType) => {
    setType(newType);
    if (!initialSensor) {
      switch (newType) {
        case 'Temperature':
          setName('Water Temperature');
          setUnit('°C');
          setMinValue(-5);
          setMaxValue(15);
          setNormalMin(0);
          setNormalMax(5);
          break;
        case 'Salinity':
          setName('Inductive Salinity');
          setUnit('PSU');
          setMinValue(20);
          setMaxValue(45);
          setNormalMin(33);
          setNormalMax(36);
          break;
        case 'Pressure':
          setName('Hydrostatic Pressure');
          setUnit('dbar');
          setMinValue(0);
          setMaxValue(300);
          setNormalMin(10);
          setNormalMax(150);
          break;
        case 'pH':
          setName('Marine pH Probe');
          setUnit('pH');
          setMinValue(6.0);
          setMaxValue(9.5);
          setNormalMin(7.8);
          setNormalMax(8.3);
          break;
        case 'Dissolved Oxygen':
          setName('Dissolved Oxygen');
          setUnit('mg/L');
          setMinValue(0);
          setMaxValue(16);
          setNormalMin(6.5);
          setNormalMax(9.5);
          break;
        case 'Turbidity':
          setName('Optical Turbidity');
          setUnit('NTU');
          setMinValue(0);
          setMaxValue(100);
          setNormalMin(0.5);
          setNormalMax(12.0);
          break;
        default:
          setName('Custom Sensor');
          setUnit('unit');
          setMinValue(0);
          setMaxValue(100);
          setNormalMin(20);
          setNormalMax(80);
          break;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Sensor Name is required.');
      return;
    }
    if (minValue >= maxValue) {
      setError('Absolute Minimum must be strictly less than Absolute Maximum.');
      return;
    }
    if (normalMin >= normalMax) {
      setError('Normal Minimum must be strictly less than Normal Maximum.');
      return;
    }
    if (normalMin < minValue || normalMax > maxValue) {
      setError('Normal operating range must fall completely inside Absolute calibration limits.');
      return;
    }
    if (samplingInterval <= 0) {
      setError('Sampling Interval must be a positive integer in seconds.');
      return;
    }
    if (noiseLevel < 0) {
      setError('Noise Level cannot be negative.');
      return;
    }

    onSave({
      id: initialSensor?.id,
      name: name.trim(),
      type,
      unit: unit.trim(),
      minValue: Number(minValue),
      maxValue: Number(maxValue),
      normalMin: Number(normalMin),
      normalMax: Number(normalMax),
      warningThreshold: Number(normalMax) * 1.1,
      criticalThreshold: Number(normalMax) * 1.25,
      samplingInterval: Number(samplingInterval),
      noiseLevel: Number(noiseLevel),
      depth: Number(depth),
      critical,
      enabled
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl ocean-card border border-cyan-500/40 p-6 shadow-2xl space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              {initialSensor ? 'CONFIGURE SENSOR' : 'ADD NEW SENSOR TO ARRAY'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-navy-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          
          {/* Row 1: Name & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Sensor Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Surface Temperature"
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Sensor Type</label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as SensorType)}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Temperature">Temperature</option>
                <option value="Salinity">Salinity / Conductivity</option>
                <option value="Pressure">Pressure / Depth</option>
                <option value="pH">pH</option>
                <option value="Dissolved Oxygen">Dissolved Oxygen</option>
                <option value="Turbidity">Turbidity (NTU)</option>
                <option value="GNSS">GNSS</option>
                <option value="IMU">IMU</option>
                <option value="Battery">Battery</option>
                <option value="Custom">Custom Sensor</option>
              </select>
            </div>
          </div>

          {/* Row 2: Unit & Sampling Interval */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Physical Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. °C, PSU, mg/L"
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Sampling Interval (sec)</label>
              <input
                type="number"
                value={samplingInterval}
                onChange={(e) => setSamplingInterval(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Row 3: Absolute Calibration Range (Min / Max) */}
          <div>
            <span className="text-slate-400 text-[10px] block mb-1 font-semibold uppercase">Absolute Physical Limits</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block text-[11px] mb-0.5">Absolute Min</label>
                <input
                  type="number"
                  step="any"
                  value={minValue}
                  onChange={(e) => setMinValue(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-slate-300 block text-[11px] mb-0.5">Absolute Max</label>
                <input
                  type="number"
                  step="any"
                  value={maxValue}
                  onChange={(e) => setMaxValue(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Normal Operating Envelope (Min / Max) */}
          <div>
            <span className="text-slate-400 text-[10px] block mb-1 font-semibold uppercase">Normal Operating Range (Baseline Envelope)</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block text-[11px] mb-0.5">Normal Min</label>
                <input
                  type="number"
                  step="any"
                  value={normalMin}
                  onChange={(e) => setNormalMin(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-slate-300 block text-[11px] mb-0.5">Normal Max</label>
                <input
                  type="number"
                  step="any"
                  value={normalMax}
                  onChange={(e) => setNormalMax(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Noise Level & Depth */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Sensor Noise Level</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                className="w-full px-3 py-1.5 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Mooring Depth (m)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="300"
                value={depth}
                onChange={(e) => setDepth(parseFloat(e.target.value))}
                className="w-full px-3 py-1.5 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Row 6: Toggles (Critical Sensor, Enabled) */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-navy-900/60 border border-navy-800">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={critical}
                onChange={(e) => setCritical(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-navy-950 border-navy-700 focus:ring-0"
              />
              <span className="text-slate-200">Critical Sensor (Priority Telemetry)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-navy-950 border-navy-700 focus:ring-0"
              />
              <span className="text-slate-200">Enabled</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-navy-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold shadow-md shadow-cyan-500/20 transition active:scale-95"
            >
              {initialSensor ? 'Update Sensor' : 'Add Sensor'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
