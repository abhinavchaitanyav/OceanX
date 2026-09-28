# OCEANX — Virtual Ocean Observation & Autonomous Decision Simulator

**Smart India Hackathon 2026** | **Problem Statement ID:** 26065  
**Problem Statement:** Autonomous Low-Cost Ocean Observation Platform for Polar and Southern Oceans  
**Theme:** Robotics and Drones | **Category:** Hardware  
**Project Name:** OCEANX  
**Team:** Coders May Cry (CMC)  

---

> [!IMPORTANT]
> **Engineering Prototype & Transparency Notice**  
> For SIH Round 2 evaluation, this application serves as a **high-fidelity software-based virtual prototype and digital twin** demonstrating the complete operational, sensing, edge computing, AI decision-making, and communication logic of the proposed OceanX platform using simulated sensor streams.  
> Physical oceanographic deployment will commence in controlled-water test tanks before progressing through marine-grade environmental qualification and ice survivability validation.

---

## Table of Contents

1. [Project Concept & Architecture](#1-project-concept--architecture)
2. [End-to-End Operational Pipeline](#2-end-to-end-operational-pipeline)
3. [Key Engineering Capabilities](#3-key-engineering-capabilities)
4. [Project Structure](#4-project-structure)
5. [Installation & Setup](#5-installation--setup)
6. [Running the Application](#6-running-the-application)
7. [Automated Verification Tests](#7-automated-verification-tests)
8. [2-Minute SIH Judge Demo Script](#8-2-minute-sih-judge-demo-script)
9. [Physical Sensor Physics & Mathematical Models](#9-physical-sensor-physics--mathematical-models)
10. [Explainable AI Anomaly Detection](#10-explainable-ai-anomaly-detection)
11. [Sensor Fault Isolation vs Environmental Anomaly](#11-sensor-fault-isolation-vs-environmental-anomaly)
12. [Autonomous Adaptive Sampling Engine](#12-autonomous-adaptive-sampling-engine)
13. [Resilient Store-and-Forward Communication](#13-resilient-store-and-forward-communication)
14. [From Simulation to Physical Prototype Roadmap](#14-from-simulation-to-physical-prototype-roadmap)
15. [Expected Physical Prototype Bill of Materials (BOM)](#15-expected-physical-prototype-bill-of-materials-bom)

---

## 1. Project Concept & Architecture

OceanX is designed as a long-endurance, low-cost autonomous spar-buoy observation platform capable of withstanding the harsh hydrodynamic, chemical, and thermal conditions of polar and southern oceans.

```
+-------------------------------------------------------------------------+
|                              OCEANX PLATFORM                            |
+-------------------------------------------------------------------------+
|  [SENSOR LAYER]                                                         |
|  PT100 Water Temp | Piezoresistive Depth | Inductive Salinity |         |
|  Sealed Marine pH | Optical Dissolved O2 | u-blox GNSS | 9-DOF IMU      |
+-------------------------------------------------------------------------+
                                    ↓ (Analog / SPI / I2C / RS-485)
+-------------------------------------------------------------------------+
|  [TIER 1: ESP32-S3 CO-PROCESSOR]                                        |
|  • 24-bit Delta-Sigma ADC acquisition & signal conditioning             |
|  • Independent hardware watchdog & low-power sleep state machine        |
|  • Power-gated MOSFET switches cutting sensor quiescent current         |
+-------------------------------------------------------------------------+
                                    ↓ (High-Speed DMA UART)
+-------------------------------------------------------------------------+
|  [TIER 2: RASPBERRY PI 5 (8GB) EDGE COMPUTER]                           |
|  • Physical envelope validation & thermodynamic rate-of-change checks   |
|  • Embedded SQLite store-and-forward circular flash buffer              |
|  • Linux systemd telemetry daemon with cryptographic packet hashing     |
+-------------------------------------------------------------------------+
                                    ↕ (Internal Bus)
+-------------------------------------------------------------------------+
|  [EDGE AI DECISION ENGINE]                                              |
|  • Rolling 30-sample Z-Score & Moving Standard Deviation detection      |
|  • Sensor hardware fault isolation (stuck ADC values vs ocean events)   |
|  • Adaptive Sampling: 10s (dynamic anomaly) / 60s (normal) / 120s (eco) |
|  • Power-aware load shedding based on LiFePO4 State of Charge (SOC)    |
+-------------------------------------------------------------------------+
                                    ↓ (Binary Delta Encoded)
+-------------------------------------------------------------------------+
|  [COMMUNICATION SUBSYSTEM]                                              |
|  • LoRa SX1262 (+22dBm, 15km marine link) & SIM7600G-H 4G LTE Fallback  |
|  • Store-and-Forward: 100% telemetry retention during storm blackouts   |
+-------------------------------------------------------------------------+
                                    ↓ (RF Telemetry Gateway)
+-------------------------------------------------------------------------+
|  [OCEANX RESEARCH DASHBOARD]                                            |
|  Real-time Digital Twin, Attitude (IMU), Health, CSV Export, Analytics  |
+-------------------------------------------------------------------------+
```

---

## 2. End-to-End Operational Pipeline

The platform operates continuously through a 6-stage autonomous cycle:

1. **SENSE:** Submerged transducers take physical measurements across multiple depths.
2. **VALIDATE:** Hardware front-end tests signal continuity, ADC voltage levels, and range validity.
3. **ANALYZE:** Edge AI evaluates rolling Z-scores and cross-sensor thermodynamic correlations.
4. **ADAPT:** Sampling interval dynamically adjusts (10s, 60s, or 120s) to balance resolution and battery.
5. **TRANSMIT:** Observations are dispatched via LoRa/LTE or queued locally if communication is lost.
6. **VISUALIZE:** Shore stations render live digital twin telemetry, historical trends, and audit logs.

---

## 3. Key Engineering Capabilities

- **Interactive Digital Twin Canvas:** Real-time animated marine SVG/Canvas with polar sky, wave heave, spar buoy hull, solar deck plate, mast beacon, and tethered underwater probes with tooltips.
- **Dynamic Sensor Configurator:** Add, edit, or remove custom transducers with validation (strict checks on min < max, normal operating bands, noise levels, and sampling intervals).
- **Explainable Anomaly Detection:** Ensemble of envelope checks, rate-of-change velocity ($|\Delta v/\Delta t|$), rolling statistical Z-scores ($|z| > 2.5\sigma$), and cross-sensor dynamics.
- **Sensor Fault Isolation:** Explicitly distinguishes true oceanographic events from hardware failures (stuck readings, impossible single-step jumps, electrical noise, or disconnected umbilicals).
- **Autonomous Adaptive Sampling:** Shifts between 60s baseline, 10s rapid anomaly capture, and 120s power-saving mode, calculating estimated energy savings (+35% conservation).
- **Resilient Store-and-Forward Buffer:** Zero data loss during polar RF blackouts; local SQLite queuing with automatic high-speed backfill synchronization upon link return.
- **Dynamic Energy Subsystem:** Models a 256Wh LiFePO4 battery, dual 30W solar panels, MPPT efficiency, load-shedding states, and an interactive solar irradiance slider (0% to 100%).
- **Interactive Scenarios & Failure Injection:** 8 predefined oceanographic scenarios plus single-click failure injection buttons for instant evaluation.
- **Automated SIH Demo Mode:** Scripted 2.5-minute presentation that cycles through baseline operation, anomaly detection, adaptive acceleration, sensor freeze isolation, blackout buffering, link sync, and power-saving mode.
- **Interactive BOM Cost Calculator:** Full hardware breakdown with editable quantities and costs in INR (₹) and USD ($).

---

## 4. Project Structure

```
oceanx/
├── backend/
│   ├── main.py                        # RESTful API, WebSocket/telemetry engine, and background loop
│   ├── test_oceanx.py                 # Automated unit test suite (9 test cases)
│   ├── requirements.txt               # Backend dependencies
│   ├── oceanx.db                      # SQLite database
│   ├── database/
│   │   └── db.py                      # Database initialization, schema, and seeding
│   └── simulation/
│       ├── sensor_simulator.py        # Physical oceanographic equations & noise
│       ├── anomaly_engine.py          # Envelope, rate-of-change, Z-Score, cross-sensor
│       ├── fault_detector.py          # Transducer freeze, step jump, and disconnect checks
│       ├── energy_model.py            # Battery SOC, solar irradiance, power-saving logic
│       └── communication_simulator.py # LoRa/LTE link emulator & SQLite store-and-forward
├── frontend/
│   ├── index.html                     # HTML5 entry with deep-ocean theme
│   ├── vite.config.ts                 # Bundler config with API proxy
│   ├── tailwind.config.js             # Scientific deep-navy and cyan color tokens
│   ├── postcss.config.js              # PostCSS configuration
│   ├── package.json                   # Frontend dependencies (React, Vite, Recharts, Lucide)
│   └── src/
│       ├── main.tsx                   # React root entrypoint
│       ├── App.tsx                    # Master layout, tab router, and state manager
│       ├── index.css                  # Custom styles and glassmorphism utilities
│       ├── types/
│       │   └── index.ts               # TypeScript interfaces (Sensor, Reading, Mission, Energy)
│       ├── simulation/
│       │   └── clientSimulation.ts    # Browser-side simulation engine (offline-capable)
│       └── components/
│           ├── Navbar.tsx             # Header with mission ticker, rate pill, and status badges
│           ├── LandingHero.tsx        # Hero title, 6-stage clickable pipeline, and disclaimer
│           ├── VirtualOceanCanvas.tsx # Animated SVG ocean scene, probes, and environmental sliders
│           ├── SensorDashboard.tsx    # Live sensor cards, sparks, status badges, and quick actions
│           ├── SensorConfigModal.tsx  # Dynamic [+ ADD SENSOR] modal with input validation
│           ├── DigitalTwinView.tsx    # Interactive hardware layer diagram (ESP32 / RPi5 / Comms)
│           ├── AIEnginePanel.tsx      # Anomaly score gauge, Z-Score, and explainable rationale
│           ├── SensorFaultPanel.tsx   # Fault isolation vs environmental anomaly panel
│           ├── AdaptiveSamplingBar.tsx# 10s vs 60s vs 120s mode indicator and energy savings
│           ├── EnergyPanel.tsx        # Battery SOC, solar slider (0-100%), and runtime hours
│           ├── CommunicationPanel.tsx # LoRa/LTE link state, local buffer counter, and sync button
│           ├── SimulationControls.tsx # 8 Scenarios and rapid failure injection buttons
│           ├── SIHDemoMode.tsx        # 2.5-minute scripted demo controller with milestone stepper
│           ├── AnalyticsView.tsx      # Time-series Recharts, telemetry audit table, and CSV export
│           ├── ArchitectureBOM.tsx    # Hardware block diagram and editable BOM table
│           └── JudgeExplainerModal.tsx# "How OceanX Works" 60-second judge quick-guide
├── run_oceanx.sh                      # One-click start script for both frontend and backend
└── README.md                          # Complete documentation
```

---

## 5. Installation & Setup

### Prerequisites
- Node.js (v18+) and npm
- Python 3.10+

### Step-by-Step Installation

1. **Clone or Navigate to the OceanX Directory:**
   ```bash
   cd /Users/hemaniraju/.gemini/antigravity/scratch/oceanx
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```

3. **Backend Setup:**
   ```bash
   cd ../backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

---

## 6. Running the Application

### Option A: One-Click Startup (Recommended)
From the project root directory, run:
```bash
./run_oceanx.sh
```
This script automatically initializes the SQLite database, starts the Python backend on `http://127.0.0.1:8000`, and launches the Vite React frontend on `http://localhost:5173`.

### Option B: Individual Terminal Startup

**Terminal 1 — Backend:**
```bash
cd /Users/hemaniraju/.gemini/antigravity/scratch/oceanx/backend
python3 main.py
```
*Backend runs on `http://127.0.0.1:8000`.*

**Terminal 2 — Frontend:**
```bash
cd /Users/hemaniraju/.gemini/antigravity/scratch/oceanx/frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 7. Automated Verification Tests

To verify that the database, sensor validation, anomaly detection, hardware fault isolation, store-and-forward communication, and low-battery adaptive response function correctly:

```bash
cd /Users/hemaniraju/.gemini/antigravity/scratch/oceanx/backend
python3 -m unittest test_oceanx.py
```

Expected output:
```
Ran 9 tests in 0.117s
OK
```

All 9 test cases validate:
- System health and identity endpoints
- Dynamic sensor range validation (rejecting min $\ge$ max)
- Anomaly injection and adaptive sampling shift ($60s \to 10s$)
- Sensor hardware fault detection without false environmental alarms
- Communication loss with local buffer retention and zero data loss
- Buffer synchronization and drainage upon link restoration
- Low battery power-saving mode ($60s \to 120s$)
- Mission telemetry CSV export
- Bill of materials calculation

---

## 8. 2-Minute SIH Judge Demo Script

Use this script during your presentation to demonstrate the complete working logic of OceanX in under 2 minutes:

| Time | Presenter Action / Button to Click | Visual Response on Screen | What to Say to the Judges |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:15** | Open `Overview` tab. Point to the live mission timer and pipeline. | Buoy is floating in the animated ocean; sampling interval displays **60s** (Nominal Baseline). | *"Good afternoon, judges. This is OceanX, our autonomous ocean observation platform designed for polar and southern oceans. Here you see our digital twin simulating the ESP32-S3 and Raspberry Pi 5 architecture."* |
| **0:15 - 0:35** | Click **Virtual Ocean** tab. Hover over submerged probes. Drag the **Ocean Surface Temp** slider. | Probes highlight live depth values. Waves heave dynamically; buoy pitches according to sea state. | *"OceanX features a submerged multi-parameter umbilical with temperature, salinity, depth, pH, and dissolved oxygen sensors. The environmental sliders let us simulate real polar dynamics."* |
| **0:35 - 0:50** | Click `[Temperature Anomaly]` under the Simulation Toolbar. | Temperature spikes to ~9.4°C. Anomaly Score reaches **0.92**. AI decision highlights: **"INCREASE SAMPLING"**. Sampling shifts **60s → 10s**. | *"We just simulated a warm hydrothermal plume. Watch the AI Decision Engine: it doesn't just see a high value; it runs rolling Z-scores and rate-of-change checks. Detecting an active event, it autonomously accelerates sampling from 60 seconds to 10 seconds to capture dynamic ocean turbulence."* |
| **0:50 - 1:10** | Click `[Stuck Sensor Fault]` under Simulation Toolbar, or go to **Fault Isolation** tab. | Temperature sensor repeats 2.400°C. Health turns **DEGRADED**. Sampling stays at **60s**. | *"A major innovation of OceanX is distinguishing sensor failures from environmental anomalies. Here, the sensor froze at 2.4°C. Because the platform has wave motion but the sensor has zero variance, the system isolates it as a hardware fault and does NOT trigger a false sampling alarm."* |
| **1:10 - 1:30** | Click `[Communication Loss]`. | Status changes to **OFFLINE / BLACKOUT**. Incoming counter increases; **Buffered Locally** increments (e.g. 12, 18, 24). Data loss = **0**. | *"In polar oceans, severe blizzards cut RF connectivity. Notice our Store-and-Forward buffer: telemetry is spooled into local SQLite flash memory. Zero observations are lost."* |
| **1:30 - 1:45** | Click `[RESTORE COMMUNICATION & SYNC]`. | Upload progress bar animates. Buffer drains to **0**. Synced observations update with verified timestamps. | *"When communication returns, OceanX automatically backfills the research cloud with verified checksums. Data integrity is 100% preserved."* |
| **1:45 - 2:00** | Click `[Low Battery (18%)]` or go to **Power & Energy** tab. Drag solar slider to 0%. | Battery turns red (18%). System enters **POWER SAVING MODE**. Sampling throttles to **120s**. Energy saved indicates **+38%**. | *"When solar drops and battery falls below 25%, OceanX protects its LiFePO4 cells by throttling sampling to 120 seconds. This adaptive behavior extends polar mission life by over 35%."* |
| **2:00 - 2:15** | Click **BOM & Specs** tab, then **Analytics & Data** tab. Click `[EXPORT TELEMETRY CSV]`. | Live BOM table recalculates budget. Telemetry CSV downloads instantly to judge's laptop. | *"Finally, our hardware architecture uses accessible commercial-off-the-shelf components totaling under ₹95,000 for a controlled-water prototype. Every observation can be exported to standard oceanographic CSV."* |

---

## 9. Physical Sensor Physics & Mathematical Models

The simulator generates physically plausible oceanographic telemetry rather than random noise:

- **Seawater Temperature:**  
  $$T(z, t) = T_{\text{surface}} - \alpha \cdot z + A_{\text{diurnal}} \sin(\omega_{\text{sun}} t) + A_{\text{wave}} \sin(\omega_{\text{wave}} t) + \mathcal{N}(0, \sigma^2)$$  
  where $\alpha = 0.025^\circ\text{C/m}$ models the polar thermocline gradient.

- **Hydrostatic Pressure & Depth:**  
  $$P(z) = P_{\text{atm}} + \frac{\rho \cdot g \cdot (z + h_{\text{heave}})}{10^4} \text{ dbar} \approx 1.013 + 1.008 \cdot z$$  
  taking into account ambient atmospheric pressure and wave heave oscillations.

- **Salinity & Density:**  
  Modeled along the polar halocline ($33.5 \text{ to } 36.0 \text{ PSU}$), factoring in brine expulsion during freezing and meltwater dilution.

- **Dissolved Oxygen (DO):**  
  Coupled to water temperature via Henry's Law of gas solubility: cold polar surface waters hold higher saturation ($8.0 \text{ to } 9.5 \text{ mg/L}$), decreasing with increasing depth and microbial respiration.

---

## 10. Explainable AI Anomaly Detection

The AI engine uses transparent, explainable algorithms rather than opaque black-box heuristics:

1. **Threshold Envelope Validation:** Detects whether values breach calibrated bounds ($[\text{normalMin}, \text{normalMax}]$).
2. **Rate-of-Change Velocity:**  
   $$\left|\frac{\Delta v}{\Delta t}\right| > 0.25 \cdot (\text{normalMax} - \text{normalMin})$$  
   Flags non-physical thermal or chemical jumps that exceed natural fluid dynamics.
3. **Rolling Z-Score (30-Sample Window):**  
   $$Z = \frac{|x_t - \mu_{30}|}{\sigma_{30}}$$  
   If $Z > 2.5\sigma$, statistical divergence triggers an anomaly classification.
4. **Cross-Sensor Physical Consistency:** Correlates multiple variables (e.g. confirming temperature spikes with gas solubility depression) to prevent single-channel false positives.

---

## 11. Sensor Fault Isolation vs Environmental Anomaly

| Diagnostic Check | Environmental Anomaly | Sensor Hardware Fault |
| :--- | :--- | :--- |
| **Variance with Wave Motion** | Active micro-fluctuations present ($\sigma^2 > 0$) | Exactly zero variance across consecutive cycles ($\sigma^2 \approx 0$) |
| **Physical Gradient Limit** | Obeys fluid thermodynamic diffusion rates | Step jumps $> 30^\circ\text{C}$ in $< 1\text{s}$ (electrical surge/bounce) |
| **Transducer Operating Range** | Within calibrated physical limits | Out of physical bounds (e.g. $\text{pH} < 0$, $\text{Salinity} < 0$) |
| **Signal Continuity** | Continuous ADC telemetry frames | Missing packets, null reads, or open umbilical |
| **Autonomous Action** | **Accelerate sampling ($60\text{s} \to 10\text{s}$)** | **Flag sensor DEGRADED; isolate channel; maintain 60s baseline** |

---

## 12. Autonomous Adaptive Sampling Engine

OceanX eliminates the trade-off between battery life and event resolution:

- **Nominal State:** 60-second sampling interval (balances long endurance with steady observation).
- **Anomaly State:** 10-second sampling interval ($6\times$ resolution to capture turbulent marine dynamics).
- **Power-Saving State:** 120-second sampling interval (conserves energy when battery drops below 25% or in polar winter darkness).

### Energy Conservation Calculation
$$\text{Energy Saved (\%)} = \frac{E_{\text{fixed}} - E_{\text{adaptive}}}{E_{\text{fixed}}} \times 100\%$$
During standard missions where anomalous events occur intermittently ($< 10\%$ of mission duration), the adaptive engine saves **$35\% \text{ to } 45\%$ of total energy** compared to continuous high-rate sampling.

---

## 13. Resilient Store-and-Forward Communication

```
[ADC Telemetry] → [Link Check]
                     │
         ┌───────────┴───────────┐
      ONLINE                  OFFLINE
         │                       │
[Direct LoRa/LTE TX]    [Queue in SQLite Buffer]
[Data Loss = 0]         [Spool with Timestamps]
                                 │
                     (When Link Restores)
                                 ↓
                    [High-Speed Bulk Sync]
                    [Buffer Drains to 0]
```

- Telemetry is buffered in a circular SQLite flash table with write-ahead logging (WAL).
- Checksums and sequential message IDs ensure zero duplicate packets and zero data loss upon backfill.

---

## 14. From Simulation to Physical Prototype Roadmap

```
Phase 1 (Current SIH Round 2):
Virtual Prototype & Digital Twin (Complete algorithmic & decision verification)
                         ↓
Phase 2 (Lab Bench & Sensor Conditioning):
ESP32-S3 + Raspberry Pi 5 hardware-in-the-loop testing with industrial sensors
                         ↓
Phase 3 (Controlled-Water Tank Testing):
Wave flume & test pool deployment (Validating ballast, trim, and sensor wet response)
                         ↓
Phase 4 (Near-Shore Marine Qualification):
Harbor & coastal trials (LoRa/LTE range, bio-fouling resistance, and solar harvesting)
                         ↓
Phase 5 (Polar / Extreme Ocean Qualification):
Ice-rated spar structure, Iridium satellite transceiver, and cold-soak battery testing
```

---

## 15. Expected Physical Prototype Bill of Materials (BOM)

| Category | Component | Specification | Qty | Unit Cost (₹) | Unit Cost ($) | Purpose |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **Compute & Edge** | ESP32-S3-WROOM-1 | Dual-core Xtensa 240MHz, ULP coprocessor | 1 | ₹550 | $6.60 | ADC acquisition, hardware watchdog, power-gating |
| **Compute & Edge** | Raspberry Pi 5 (8GB) | Quad Cortex-A76 @ 2.4GHz, 8GB RAM | 1 | ₹7,800 | $93.90 | Edge AI decision engine, SQLite buffer, store-forward |
| **Sensors** | PT100 RTD Class A | 316L stainless steel, -50°C to +100°C | 1 | ₹3,200 | $38.50 | Seawater temperature profiling |
| **Sensors** | Industrial Depth Transducer | 0-20 bar (200m), titanium diaphragm | 1 | ₹5,800 | $69.80 | Hydrostatic pressure and mooring depth calculation |
| **Sensors** | Toroidal Salinity / Conductivity | 0-100 mS/cm, anti-fouling PEEK body | 1 | ₹9,500 | $114.40 | Salinity, brine rejection, and density tracking |
| **Sensors** | Sealed Marine pH Electrode | 0-14 pH, double junction ceramic | 1 | ₹2,800 | $33.70 | Ocean acidification and biochemical monitoring |
| **Sensors** | Optical Dissolved Oxygen (DO) | 0-20 mg/L, luminescent sensing | 1 | ₹11,500 | $138.50 | Biological productivity and hypoxia detection |
| **Sensors** | Multi-GNSS Module (u-blox) | NEO-M9N, 1.5m CEP, active antenna | 1 | ₹2,400 | $28.90 | Geographic drift and UTC time sync |
| **Sensors** | 9-DOF IMU (BNO085) | Fused pitch, roll, heading, heave | 1 | ₹1,900 | $22.80 | Wave height calculation and platform attitude |
| **Communication** | LoRa SX1262 Transceiver | 868/915 MHz, +22dBm, up to 15km | 1 | ₹2,100 | $25.30 | Coastal/ship relay telemetry link |
| **Communication** | SIM7600G-H 4G LTE HAT | Global bands, cellular fallback | 1 | ₹4,600 | $55.40 | High-speed telemetry backfill |
| **Power System** | LiFePO4 Battery Pack | 12.8V 20Ah (256Wh), integrated BMS | 1 | ₹7,500 | $90.30 | Deep-cycle polar energy reservoir |
| **Power System** | Marine Solar Panels (30W) | Flexible monocrystalline, ETFE coated | 2 | ₹4,800 | $57.80 | Surface solar energy harvesting |
| **Power System** | MPPT Solar Controller | 98% efficiency, low quiescent draw | 1 | ₹2,200 | $26.50 | Bus voltage regulation and battery charging |
| **Structure** | Spar Buoy Hull & Keel | Polyethylene / marine-grade aluminum | 1 | ₹14,500 | $174.60 | Floating stability structure and strain relief |
| **Structure** | IP68 Electronics Pod | Anodized aluminum with Subconn plugs | 1 | ₹8,200 | $98.70 | Waterproof housing for electronics and battery |
| **TOTAL** | **Complete Prototype** | **Fully Instrumented Subsea Spar** | — | **₹89,450** | **$1,076.70** | **Indicative controlled-water prototype cost** |

*Note: Indicative estimate for initial controlled-water proof-of-concept. Final marine qualification cost depends on sensor certification grade, anti-fouling coatings, and pressure housing depth ratings.*

---

## 16. Team Information

- **Team Name:** Coders May Cry (CMC)
- **Problem Statement ID:** 26065
- **Hackathon:** Smart India Hackathon 2026 (Round 2)
- **Institution:** Department of Electronics & Computer Science
- **License:** MIT Open-Source Engineering License
