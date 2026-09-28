#!/usr/bin/env python3
import os
import sys

def main():
    base_dir = "/Users/hemaniraju/.gemini/antigravity/scratch/oceanx"
    b64_path = os.path.join(base_dir, "oceanx_buoy_b64.txt")
    
    with open(b64_path, "r") as f:
        buoy_b64 = f.read().strip()
    
    html_content = f'''<!DOCTYPE html>
<html lang="en" class="scroll-smooth dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OCEANX | OCEANX | SIH 2026</title>
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%2307152b' stroke='%23f59e0b' stroke-width='6'/><circle cx='50' cy='50' r='18' fill='%2300f2fe'/><path d='M50 15 L50 30 M50 70 L50 85 M15 50 L30 50 M70 50 L85 50' stroke='%23fbbf24' stroke-width='4' stroke-linecap='round'/></svg>">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {{
      darkMode: 'class',
      theme: {{
        extend: {{
          colors: {{
            abyss: {{
              950: '#030914',
              900: '#07152b',
              850: '#0a1d3a',
              800: '#0f274c',
              700: '#183868',
              600: '#224d8b'
            }},
            maritime: {{
              amber: '#f59e0b',
              yellow: '#fbbf24',
              darkamber: '#d97706',
              glow: 'rgba(245, 158, 11, 0.4)'
            }},
            polar: {{
              cyan: '#00f2fe',
              ice: '#38bdf8',
              frost: '#e0f2fe',
              deep: '#0369a1'
            }}
          }},
          fontFamily: {{
            display: ['"Space Grotesk"', 'sans-serif'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace']
          }},
          animation: {{
            'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            'spin-slow': 'spin 12s linear infinite',
            'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
            'sonar-sweep': 'sonar 3s ease-out infinite'
          }}
        }}
      }}
    }}
  </script>

  <style>
    /* Custom Scrollbar */
    ::-webkit-scrollbar {{
      width: 8px;
      height: 8px;
    }}
    ::-webkit-scrollbar-track {{
      background: #030914;
    }}
    ::-webkit-scrollbar-thumb {{
      background: #183868;
      border-radius: 4px;
    }}
    ::-webkit-scrollbar-thumb:hover {{
      background: #f59e0b;
    }}
    
    /* Glassmorphism effects */
    .glass-panel {{
      background: rgba(7, 21, 43, 0.78);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(56, 189, 248, 0.14);
    }}
    .glass-panel-amber {{
      background: rgba(245, 158, 11, 0.05);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(245, 158, 11, 0.25);
    }}
    .glass-panel-cyan {{
      background: rgba(0, 242, 254, 0.04);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(0, 242, 254, 0.25);
    }}

    /* Radar scanline effect */
    .scanlines {{
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
      background-size: 100% 4px, 6px 100%;
      pointer-events: none;
    }}

    /* Glow utilities */
    .glow-cyan {{
      box-shadow: 0 0 25px rgba(0, 242, 254, 0.3);
    }}
    .glow-amber {{
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.35);
    }}
    .text-glow-cyan {{
      text-shadow: 0 0 10px rgba(0, 242, 254, 0.6);
    }}
    .text-glow-amber {{
      text-shadow: 0 0 10px rgba(245, 158, 11, 0.6);
    }}

    /* Custom Range Sliders */
    input[type=range] {{
      -webkit-appearance: none;
      background: #0f274c;
      border-radius: 9999px;
      height: 8px;
    }}
    input[type=range]::-webkit-slider-thumb {{
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fbbf24;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(251, 191, 36, 0.8);
      border: 2px solid #030914;
      transition: transform 0.15s ease;
    }}
    input[type=range]::-webkit-slider-thumb:hover {{
      transform: scale(1.2);
    }}

    /* Hotspot pinpoint styles */
    .hotspot-pin {{
      position: absolute;
      transform: translate(-50%, -50%);
      cursor: pointer;
      z-index: 30;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }}
  </style>
</head>

<body class="bg-abyss-950 text-slate-100 font-sans antialiased selection:bg-maritime-amber/30 selection:text-maritime-yellow min-h-screen overflow-x-hidden">

  <!-- ========================================================================= -->
  <!-- 1. MISSION COMMAND HEADER                                                 -->
  <!-- ========================================================================= -->
  <header class="sticky top-0 z-50 glass-panel border-b border-abyss-700/80 shadow-2xl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        
        <!-- Logo & Hackathon Badge -->
        <div class="flex items-center gap-3">
          <div class="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-abyss-800 to-abyss-900 border border-maritime-amber/40 shadow-inner group">
            <div class="absolute inset-0 rounded-xl bg-maritime-amber/10 blur-sm group-hover:bg-maritime-amber/20 transition-colors"></div>
            <!-- Custom Spar Buoy Icon SVG -->
            <svg class="w-6 h-6 text-maritime-yellow relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v6m0 10v4M8 8h8l-1 5H9L8 8z" fill="currentColor" fill-opacity="0.2"/>
              <circle cx="12" cy="15" r="5" stroke="#00f2fe" stroke-width="1.5"/>
              <path d="M7 21h10M10 2l2-1 2 1" stroke-linecap="round"/>
            </svg>
            <span class="absolute -top-1 -right-1 flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div class="flex items-center gap-2">
              <span class="font-display font-extrabold text-2xl tracking-wider text-white">OCEAN<span class="text-maritime-amber">X</span></span>
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-maritime-amber/15 text-maritime-yellow border border-maritime-amber/30 font-semibold tracking-wide">SIH 2026 #26065</span>
            </div>
            <div class="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span>Team: <strong class="text-slate-200">Coders May Cry</strong></span>
              <span class="text-slate-600">•</span>
              <span class="text-emerald-400 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Autonomous Loop Active</span>
            </div>
          </div>
        </div>

        <!-- Telemetry Ribbon (Middle) -->
        <div class="hidden lg:flex items-center gap-6 font-mono text-xs">
          <!-- Coordinates -->
          <div class="flex flex-col">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <svg class="w-3 h-3 text-polar-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Southern Ocean Deploy
            </span>
            <span class="text-slate-200 font-semibold tracking-tight" id="headerGps">62°12'44"S 58°58'38"W</span>
          </div>

          <div class="h-8 w-px bg-abyss-700/80"></div>

          <!-- MET -->
          <div class="flex flex-col">
            <span class="text-[10px] uppercase tracking-wider text-slate-400">Mission Elapsed</span>
            <span class="text-maritime-yellow font-bold" id="headerMet">142d 08h 34m 12s</span>
          </div>

          <div class="h-8 w-px bg-abyss-700/80"></div>

          <!-- Battery SoC -->
          <div class="flex flex-col">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <svg class="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              LiFePO4 SoC
            </span>
            <div class="flex items-center gap-1.5">
              <div class="w-12 bg-abyss-950 rounded-full h-2 border border-abyss-700 overflow-hidden">
                <div class="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500" style="width: 94.2%"></div>
              </div>
              <span class="text-emerald-400 font-semibold" id="headerSoc">94.2%</span>
            </div>
          </div>

          <div class="h-8 w-px bg-abyss-700/80"></div>

          <!-- Uplink Status -->
          <div class="flex flex-col">
            <span class="text-[10px] uppercase tracking-wider text-slate-400">Satellite Link</span>
            <span class="text-polar-cyan flex items-center gap-1 font-semibold">
              <span class="w-1.5 h-1.5 rounded-full bg-polar-cyan animate-pulse"></span>
              Iridium SBD 5/5
            </span>
          </div>
        </div>

        <!-- Controls: Audio, Presentation Modal, Jump Nav -->
        <div class="flex items-center gap-3">
          <!-- Audio Toggle -->
          <button id="audioToggleBtn" onclick="toggleSonarAudio()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-abyss-800 hover:bg-abyss-700 border border-abyss-600 text-xs font-mono transition-colors text-slate-300 hover:text-white" title="Toggle Sonar & Radar Sound FX">
            <svg id="audioIcon" class="w-4 h-4 text-polar-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
            </svg>
            <span id="audioStatusText" class="hidden sm:inline">Sonar FX</span>
          </button>

          <!-- SIH Brief Modal Toggle -->
          <button onclick="toggleSihModal(true)" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-maritime-amber/20 to-amber-600/30 hover:from-maritime-amber/30 hover:to-amber-600/40 border border-maritime-amber/50 text-maritime-yellow text-xs font-semibold tracking-wide transition-all shadow-lg hover:shadow-maritime-amber/20">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>SIH Brief</span>
          </button>
        </div>

      </div>

      <!-- Navigation Bar (Sub-header) -->
      <nav class="flex items-center justify-between overflow-x-auto py-2.5 border-t border-abyss-800/60 text-xs font-medium no-scrollbar">
        <div class="flex items-center gap-6">
          <a href="#buoy-centerpiece" class="text-slate-300 hover:text-maritime-yellow transition-colors whitespace-nowrap flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-maritime-amber"></span>
            1. Spar-Torus Anatomy
          </a>
          <a href="#mission-simulation" class="text-slate-300 hover:text-polar-cyan transition-colors whitespace-nowrap flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-polar-cyan"></span>
            2. Ocean Swell & Mission Cam
          </a>
          <a href="#architecture-loop" class="text-slate-300 hover:text-maritime-yellow transition-colors whitespace-nowrap flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            3. Dual-Controller & 6-Step Loop
          </a>
          <a href="#polar-risks" class="text-slate-300 hover:text-maritime-yellow transition-colors whitespace-nowrap flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            4. Polar Survivability Matrix
          </a>
          <a href="#sensor-sandbox" class="text-slate-300 hover:text-polar-cyan transition-colors whitespace-nowrap flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            5. Live Edge AI Sandbox
          </a>
        </div>

        <div class="hidden md:flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span class="px-2 py-0.5 rounded bg-abyss-800 border border-abyss-700">Sampling Rate: <span id="navSamplingRate" class="text-maritime-yellow font-bold">60s (IDLE)</span></span>
          <span class="px-2 py-0.5 rounded bg-abyss-800 border border-abyss-700">Watchdog: <span class="text-emerald-400 font-bold">OK (100%)</span></span>
        </div>
      </nav>
    </div>
  </header>

  <!-- ========================================================================= -->
  <!-- HERO BANNER                                                               -->
  <!-- ========================================================================= -->
  <section class="relative pt-12 pb-8 overflow-hidden">
    <!-- Ambient glowing backgrounds -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-polar-cyan/10 blur-[130px] pointer-events-none rounded-full"></div>
    <div class="absolute top-10 right-10 w-[400px] h-[300px] bg-maritime-amber/10 blur-[120px] pointer-events-none rounded-full"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-abyss-800/80 border border-polar-cyan/30 text-polar-cyan text-xs font-mono mb-4 shadow-sm">
        <span class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-polar-cyan opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-polar-cyan"></span>
        </span>
        Smart India Hackathon 2026 • Problem Statement #26065 • Hardware Robotics & Drones
      </div>

      <h1 class="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-4xl mx-auto leading-tight">
        Autonomous Polar & Southern Ocean <span class="bg-gradient-to-r from-maritime-yellow via-maritime-amber to-amber-500 bg-clip-text text-transparent">Observation Platform</span>
      </h1>

      <p class="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
        Engineered by <strong class="text-white">Coders May Cry</strong> for long-endurance polar survivability. Features deterministic <span class="text-maritime-amber font-mono font-semibold">ESP32-S3</span> sensor acquisition, on-board <span class="text-polar-cyan font-mono font-semibold">Raspberry Pi 5</span> Edge AI anomaly detection, and a self-righting spar-torus hydrodynamic keel.
      </p>

      <div class="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
        <div class="px-3.5 py-1.5 rounded-lg bg-abyss-900 border border-abyss-700/80 text-slate-300 flex items-center gap-2">
          <span class="text-maritime-yellow font-bold">BOM Target:</span> $4,800 vs $150,000 Mooring Buoy
        </div>
        <div class="px-3.5 py-1.5 rounded-lg bg-abyss-900 border border-abyss-700/80 text-slate-300 flex items-center gap-2">
          <span class="text-polar-cyan font-bold">Survivability:</span> -35°C Sub-Zero PCM + Aerogel
        </div>
        <div class="px-3.5 py-1.5 rounded-lg bg-abyss-900 border border-abyss-700/80 text-slate-300 flex items-center gap-2">
          <span class="text-emerald-400 font-bold">Endurance:</span> 3 Years Autonomous Deployment
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- MODULE 1: AUTHENTIC BUOY MODEL & INTERACTIVE ANATOMY                      -->
  <!-- ========================================================================= -->
  <section id="buoy-centerpiece" class="py-12 relative border-t border-abyss-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-abyss-800">
        <div>
          <div class="text-xs font-mono uppercase tracking-widest text-maritime-amber mb-1 flex items-center gap-2">
            <span class="w-2 h-2 rounded-sm bg-maritime-amber"></span>
            Hardware Centerpiece & Interactive Anatomy
          </div>
          <h2 class="font-display font-bold text-2xl sm:text-3xl text-white">
            Authentic Spar-Torus Offshore Buoy
          </h2>
          <p class="text-sm text-slate-400 mt-1 max-w-2xl">
            Inspect the high-density polyurethane fender, octagonal marine solar array, hermetic core, and sub-surface titanium sensor payload with live interactive hotspot telemetry.
          </p>
        </div>

        <div class="mt-4 md:mt-0 flex items-center gap-2 font-mono text-xs">
          <button onclick="setHotspotTab('all')" id="btnTabAll" class="px-3 py-1.5 rounded-lg bg-maritime-amber text-abyss-950 font-bold transition-all shadow-md">
            All Systems (4)
          </button>
          <button onclick="focusHotspot('mast')" id="btnTabMast" class="px-3 py-1.5 rounded-lg bg-abyss-800 text-slate-300 hover:text-white border border-abyss-700 transition-all">
            Mast & RF
          </button>
          <button onclick="focusHotspot('solar')" id="btnTabSolar" class="px-3 py-1.5 rounded-lg bg-abyss-800 text-slate-300 hover:text-white border border-abyss-700 transition-all">
            Solar Skirt
          </button>
          <button onclick="focusHotspot('buoyancy')" id="btnTabBuoyancy" class="px-3 py-1.5 rounded-lg bg-abyss-800 text-slate-300 hover:text-white border border-abyss-700 transition-all">
            Core & Hull
          </button>
          <button onclick="focusHotspot('keel')" id="btnTabKeel" class="px-3 py-1.5 rounded-lg bg-abyss-800 text-slate-300 hover:text-white border border-abyss-700 transition-all">
            Sensors & Keel
          </button>
        </div>
      </div>

      <!-- Main Buoy Anatomy Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Interactive Buoy Viewport with Hotspots (7 Cols) -->
        <div class="lg:col-span-7 glass-panel rounded-2xl p-4 sm:p-6 border border-abyss-700/80 relative overflow-hidden group shadow-2xl">
          <!-- Background Radar Grid Overlay -->
          <div class="absolute inset-0 opacity-15 pointer-events-none" style="background-image: radial-gradient(#38bdf8 1px, transparent 1px); background-size: 24px 24px;"></div>
          
          <!-- Viewport Badges -->
          <div class="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span class="px-2.5 py-1 rounded bg-abyss-950/80 border border-maritime-amber/40 text-[11px] font-mono text-maritime-yellow font-semibold flex items-center gap-1.5 backdrop-blur-md">
              <span class="w-2 h-2 rounded-full bg-maritime-amber animate-ping"></span>
              PHYSICAL DIGITAL TWIN
            </span>
            <span class="px-2 py-1 rounded bg-abyss-950/80 border border-abyss-700 text-[10px] font-mono text-slate-400 backdrop-blur-md">
              CAD Ref: OX-26065-REV3
            </span>
          </div>

          <!-- Gyroscopic Attitude Miniature Overlay -->
          <div class="absolute top-4 right-4 z-20 glass-panel rounded-xl p-2.5 border border-abyss-700 font-mono text-[10px] hidden sm:block">
            <div class="text-slate-400 font-bold mb-1 flex items-center justify-between gap-4">
              <span>9-DOF ATTITUDE</span>
              <span class="text-emerald-400">STABLE</span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center">
              <div>
                <span class="text-slate-500 block">ROLL</span>
                <span class="text-maritime-yellow font-bold" id="buoyRollValue">+1.8°</span>
              </div>
              <div>
                <span class="text-slate-500 block">PITCH</span>
                <span class="text-polar-cyan font-bold" id="buoyPitchValue">-0.6°</span>
              </div>
              <div>
                <span class="text-slate-500 block">YAW</span>
                <span class="text-slate-200 font-bold" id="buoyYawValue">148°</span>
              </div>
            </div>
          </div>

          <!-- Buoy Container -->
          <div class="relative w-full max-w-[480px] mx-auto my-2 flex items-center justify-center min-h-[580px] sm:min-h-[680px]">
            <!-- Authentic Render Image -->
            <img 
              id="buoyImage" 
              src="data:image/jpeg;base64,{buoy_b64}" 
              alt="OceanX Autonomous Polar Spar-Torus Buoy" 
              class="w-full h-auto max-h-[660px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] filter contrast-[1.03] select-none transition-transform duration-500"
            />

            <!-- ------------------------------------------------------------- -->
            <!-- HOTSPOT 1: UPPER MAST & COMMUNICATIONS ARRAY                  -->
            <!-- ------------------------------------------------------------- -->
            <div 
              class="hotspot-pin group" 
              style="top: 12%; left: 51%;" 
              onclick="focusHotspot('mast')"
              data-hotspot="mast"
            >
              <div class="relative flex items-center justify-center">
                <span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-maritime-amber opacity-75"></span>
                <div class="w-8 h-8 rounded-full bg-abyss-950 border-2 border-maritime-yellow flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform duration-200">
                  <span class="text-maritime-yellow font-mono text-xs font-bold">1</span>
                </div>
              </div>
              <!-- Tooltip Tag -->
              <div class="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-abyss-950/95 border border-maritime-amber/60 text-maritime-yellow px-2.5 py-1 rounded text-xs font-mono font-semibold shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity">
                ▲ Upper Mast & Satellite Uplink
              </div>
            </div>

            <!-- ------------------------------------------------------------- -->
            <!-- HOTSPOT 2: SOLAR HARVESTING SKIRT & MPPT                      -->
            <!-- ------------------------------------------------------------- -->
            <div 
              class="hotspot-pin group" 
              style="top: 36%; left: 63%;" 
              onclick="focusHotspot('solar')"
              data-hotspot="solar"
            >
              <div class="relative flex items-center justify-center">
                <span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-polar-cyan opacity-75"></span>
                <div class="w-8 h-8 rounded-full bg-abyss-950 border-2 border-polar-cyan flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform duration-200">
                  <span class="text-polar-cyan font-mono text-xs font-bold">2</span>
                </div>
              </div>
              <div class="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-abyss-950/95 border border-polar-cyan/60 text-polar-cyan px-2.5 py-1 rounded text-xs font-mono font-semibold shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity">
                ◆ Octagonal Solar Skirt (MPPT)
              </div>
            </div>

            <!-- ------------------------------------------------------------- -->
            <!-- HOTSPOT 3: MAIN BUOYANCY RING & ELECTRONICS CORE               -->
            <!-- ------------------------------------------------------------- -->
            <div 
              class="hotspot-pin group" 
              style="top: 48%; left: 40%;" 
              onclick="focusHotspot('buoyancy')"
              data-hotspot="buoyancy"
            >
              <div class="relative flex items-center justify-center">
                <span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-emerald-400 opacity-75"></span>
                <div class="w-8 h-8 rounded-full bg-abyss-950 border-2 border-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform duration-200">
                  <span class="text-emerald-400 font-mono text-xs font-bold">3</span>
                </div>
              </div>
              <div class="absolute right-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-abyss-950/95 border border-emerald-400/60 text-emerald-400 px-2.5 py-1 rounded text-xs font-mono font-semibold shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity">
                ■ OCEANX Fender & IP68 Core
              </div>
            </div>

            <!-- ------------------------------------------------------------- -->
            <!-- HOTSPOT 4: SUB-SURFACE TRUSS & SENSOR PAYLOAD                  -->
            <!-- ------------------------------------------------------------- -->
            <div 
              class="hotspot-pin group" 
              style="top: 72%; left: 42%;" 
              onclick="focusHotspot('keel')"
              data-hotspot="keel"
            >
              <div class="relative flex items-center justify-center">
                <span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-purple-400 opacity-75"></span>
                <div class="w-8 h-8 rounded-full bg-abyss-950 border-2 border-purple-400 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform duration-200">
                  <span class="text-purple-400 font-mono text-xs font-bold">4</span>
                </div>
              </div>
              <div class="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-abyss-950/95 border border-purple-400/60 text-purple-400 px-2.5 py-1 rounded text-xs font-mono font-semibold shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity">
                ▼ CTD Canister & ADCP Keel
              </div>
            </div>

          </div>

          <!-- Bottom Viewport Controls -->
          <div class="mt-4 pt-3 border-t border-abyss-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              Click any numbered hotspot to inspect internal engineering specs
            </span>
            <button onclick="pingSonarFx()" class="text-polar-cyan hover:text-white flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
              Trigger Transducer Ping
            </button>
          </div>
        </div>

        <!-- Right: Detailed Hotspot Deep-Dive Cards (5 Cols) -->
        <div class="lg:col-span-5 space-y-4">
          
          <!-- Card 1: Upper Mast & Comms -->
          <div id="card-mast" class="glass-panel rounded-xl p-5 border-l-4 border-l-maritime-amber border-abyss-700 transition-all hover:bg-abyss-900/90 cursor-pointer" onclick="focusHotspot('mast')">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-maritime-amber/20 border border-maritime-amber/50 text-maritime-yellow font-mono text-xs font-bold flex items-center justify-center">1</span>
                <h3 class="font-display font-bold text-base text-white">Upper Mast & Comms Array</h3>
              </div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-abyss-800 text-maritime-yellow border border-maritime-amber/30">Atmospheric & RF</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Elevated 1.8m above the waterline to avoid sea spray attenuation during Southern Ocean gales.
            </p>
            <div class="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">SATELLITE TELEMETRY</span>
                <span class="text-maritime-yellow font-semibold">Iridium 9603 SBD</span>
                <span class="text-slate-500 block text-[9px]">Global polar pole-to-pole</span>
              </div>
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">LINE-OF-SIGHT RF</span>
                <span class="text-polar-cyan font-semibold">LoRa SX1262 (+22dBm)</span>
                <span class="text-slate-500 block text-[9px]">15km research fleet link</span>
              </div>
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">ANEMOMETER</span>
                <span class="text-slate-200 font-semibold">Solid-State Sonic</span>
                <span class="text-slate-500 block text-[9px]">0-65 m/s, zero moving parts</span>
              </div>
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">GNSS POSITIONING</span>
                <span class="text-emerald-400 font-semibold">u-blox NEO-M9N</span>
                <span class="text-slate-500 block text-[9px]">GPS, GLONASS, Galileo</span>
              </div>
            </div>
          </div>

          <!-- Card 2: Solar Skirt & MPPT -->
          <div id="card-solar" class="glass-panel rounded-xl p-5 border-l-4 border-l-polar-cyan border-abyss-700 transition-all hover:bg-abyss-900/90 cursor-pointer" onclick="focusHotspot('solar')">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-polar-cyan/20 border border-polar-cyan/50 text-polar-cyan font-mono text-xs font-bold flex items-center justify-center">2</span>
                <h3 class="font-display font-bold text-base text-white">Solar Harvesting Skirt</h3>
              </div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-abyss-800 text-polar-cyan border border-polar-cyan/30">Energy Harvester</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Octagonal 45° angled monocrystalline panels engineered to harvest sunlight at low polar incidence angles while naturally shedding heavy salt crusts and rime ice.
            </p>
            <div class="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">ARRAY CONFIGURATION</span>
                <span class="text-polar-cyan font-semibold">8x 35W Marine Grade</span>
                <span class="text-slate-500 block text-[9px]">ETFE encapsulated coating</span>
              </div>
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">MPPT CONTROLLER</span>
                <span class="text-maritime-yellow font-semibold">Smart Sync MPPT (98.4%)</span>
                <span class="text-slate-500 block text-[9px]">Ultra-fast sweep &lt;50ms</span>
              </div>
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">HARVEST POWER</span>
                <span class="text-emerald-400 font-semibold" id="cardSolarWatts">142.4 Watts</span>
                <span class="text-slate-500 block text-[9px]">Direct trickle coupling</span>
              </div>
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">ANTI-ICE COATING</span>
                <span class="text-slate-200 font-semibold">Superhydrophobic</span>
                <span class="text-slate-500 block text-[9px]">Prevents spray adherence</span>
              </div>
            </div>
          </div>

          <!-- Card 3: Buoyancy Ring & Sealed Core -->
          <div id="card-buoyancy" class="glass-panel rounded-xl p-5 border-l-4 border-l-emerald-400 border-abyss-700 transition-all hover:bg-abyss-900/90 cursor-pointer" onclick="focusHotspot('buoyancy')">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-emerald-400/20 border border-emerald-400/50 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center">3</span>
                <h3 class="font-display font-bold text-base text-white">Buoyancy Ring & IP68 Core</h3>
              </div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-abyss-800 text-emerald-400 border border-emerald-400/30">Structural & Compute</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              High-density closed-cell polyurethane foam fender in safety yellow with "OCEANX" stenciling protects the central IP68 hermetically sealed dry well.
            </p>
            <div class="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">HULL COLLAR</span>
                <span class="text-slate-200 font-semibold">Polyurethane Elastomer</span>
                <span class="text-slate-500 block text-[9px]">Survives ice floe collisions</span>
              </div>
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">SEALED DRY WELL</span>
                <span class="text-emerald-400 font-semibold">IP68 Viton O-Ring</span>
                <span class="text-slate-500 block text-[9px]">Nitrogen purged, 0% humidity</span>
              </div>
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">PRIMARY BATTERY</span>
                <span class="text-maritime-yellow font-semibold">LiFePO4 24V 60Ah</span>
                <span class="text-slate-500 block text-[9px]">1,536 Wh internal store</span>
              </div>
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">COMPUTE ENCLOSURE</span>
                <span class="text-polar-cyan font-semibold">ESP32-S3 + Pi 5 Edge</span>
                <span class="text-slate-500 block text-[9px]">Aerogel insulated chamber</span>
              </div>
            </div>
          </div>

          <!-- Card 4: Sub-surface Truss & Sensors -->
          <div id="card-keel" class="glass-panel rounded-xl p-5 border-l-4 border-l-purple-400 border-abyss-700 transition-all hover:bg-abyss-900/90 cursor-pointer" onclick="focusHotspot('keel')">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-purple-400/20 border border-purple-400/50 text-purple-400 font-mono text-xs font-bold flex items-center justify-center">4</span>
                <h3 class="font-display font-bold text-base text-white">Sub-surface Truss & Sensors</h3>
              </div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-abyss-800 text-purple-400 border border-purple-400/30">Oceanographic Transducers</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              316L stainless steel spar truss and titanium sensor canisters with 65kg hydrodynamic bottom ballast ensuring self-righting stability (metacentric height GM &gt; 1.2m).
            </p>
            <div class="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">CTD PAYLOAD</span>
                <span class="text-polar-cyan font-semibold">Inductive 7-Pin Cell</span>
                <span class="text-slate-500 block text-[9px]">±0.002°C, ±0.003 mS/cm</span>
              </div>
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">DISSOLVED O2 + pH</span>
                <span class="text-emerald-400 font-semibold">Optical Luminescent</span>
                <span class="text-slate-500 block text-[9px]">Solid-state glass-less ISFET</span>
              </div>
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">CURRENT PROFILER</span>
                <span class="text-purple-400 font-semibold">600kHz 4-Beam ADCP</span>
                <span class="text-slate-500 block text-[9px]">Down to -100m strata</span>
              </div>
              <div class="p-2 rounded bg-abyss-950/70 border border-abyss-800">
                <span class="text-slate-400 block text-[10px]">HYDRODYNAMIC BALLAST</span>
                <span class="text-slate-200 font-semibold">Self-Righting Torpedo</span>
                <span class="text-slate-500 block text-[9px]">Recovery angle &gt; 110°</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- MODULE 2: SIMULATION & WORKING VIDEO / MISSION CAM                        -->
  <!-- ========================================================================= -->
  <section id="mission-simulation" class="py-12 relative border-t border-abyss-800/80 bg-abyss-950/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-6">
        <div>
          <div class="text-xs font-mono uppercase tracking-widest text-polar-cyan mb-1 flex items-center gap-2">
            <span class="w-2 h-2 rounded-sm bg-polar-cyan"></span>
            Dynamic Ocean Swell Canvas & Live Mission Cam
          </div>
          <h2 class="font-display font-bold text-2xl sm:text-3xl text-white">
            Real-Time Southern Ocean Swell & Mission HUD
          </h2>
          <p class="text-sm text-slate-400 mt-1 max-w-2xl">
            High-performance 60 FPS HTML5 Canvas simulating sinusoidal sea waves, natural spar pitching, downward ADCP acoustic sweeps, and upward satellite RF telemetry bursts.
          </p>
        </div>

        <!-- Weather / Sea State Selector -->
        <div class="mt-4 md:mt-0 flex items-center gap-2 bg-abyss-900 p-1.5 rounded-xl border border-abyss-700/80 font-mono text-xs">
          <span class="text-slate-400 text-[11px] px-2 uppercase font-semibold">Sea State:</span>
          <button onclick="setSeaState('calm')" id="btnSeaCalm" class="px-3 py-1 rounded-lg text-slate-300 hover:text-white transition-all">
            Calm (B2)
          </button>
          <button onclick="setSeaState('moderate')" id="btnSeaMod" class="px-3 py-1 rounded-lg bg-polar-cyan text-abyss-950 font-bold transition-all shadow-md">
            Moderate (B5)
          </button>
          <button onclick="setSeaState('gale')" id="btnSeaGale" class="px-3 py-1 rounded-lg text-rose-400 hover:text-rose-300 font-semibold transition-all">
            Antarctic Gale (B8)
          </button>
        </div>
      </div>

      <!-- Simulation Viewport Container -->
      <div class="glass-panel rounded-2xl border border-abyss-700/90 overflow-hidden shadow-2xl relative">
        
        <!-- View Mode Switcher Toolbar (Top of Canvas) -->
        <div class="flex items-center justify-between px-4 sm:px-6 py-3 bg-abyss-900/95 border-b border-abyss-800 font-mono text-xs z-30 relative">
          <div class="flex items-center gap-2">
            <span class="text-slate-400 text-[11px] uppercase mr-2 hidden sm:inline">Camera Perspective:</span>
            <button onclick="setCameraView('surface')" id="camViewSurface" class="px-3 py-1.5 rounded-lg bg-maritime-amber text-abyss-950 font-bold transition-all flex items-center gap-1.5 shadow">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
              1. Surface Buoy View
            </button>
            <button onclick="setCameraView('keel')" id="camViewKeel" class="px-3 py-1.5 rounded-lg bg-abyss-800 text-slate-300 hover:text-white border border-abyss-700 transition-all flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
              2. Sub-surface Keel View
            </button>
            <button onclick="setCameraView('satellite')" id="camViewSat" class="px-3 py-1.5 rounded-lg bg-abyss-800 text-slate-300 hover:text-white border border-abyss-700 transition-all flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
              3. Satellite Radar View
            </button>
          </div>

          <!-- Video Recording / Mission Status HUD -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-abyss-950/90 border border-rose-500/40 text-rose-400 font-mono text-[11px] font-bold">
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              LIVE MISSION STREAM
            </div>
            <span class="text-slate-400 text-[11px] hidden md:inline font-mono" id="hudTimecode">00:14:28:19</span>
            <button onclick="toggleSimPause()" id="btnPlayPause" class="p-1.5 rounded bg-abyss-800 hover:bg-abyss-700 text-slate-200 border border-abyss-700" title="Play/Pause">
              <svg id="playPauseIcon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </button>
          </div>
        </div>

        <!-- The Canvas Itself -->
        <div class="relative w-full h-[520px] sm:h-[580px] bg-abyss-950 overflow-hidden cursor-crosshair">
          <canvas id="missionCanvas" class="w-full h-full block"></canvas>

          <!-- Scanline overlay -->
          <div class="scanlines absolute inset-0 z-10 pointer-events-none"></div>

          <!-- HUD Layer (Top Left: Telemetry Overlay) -->
          <div class="absolute top-4 left-4 z-20 pointer-events-none font-mono text-xs space-y-1.5">
            <div class="px-3 py-1.5 rounded-lg bg-abyss-950/80 border border-abyss-700/80 backdrop-blur-md text-slate-200 flex items-center gap-3">
              <div>
                <span class="text-[9px] uppercase text-slate-400 block">SWELL HEIGHT (Hs)</span>
                <span class="text-maritime-yellow font-bold text-sm" id="hudWaveHeight">2.4m</span>
              </div>
              <div class="h-6 w-px bg-abyss-700"></div>
              <div>
                <span class="text-[9px] uppercase text-slate-400 block">PERIOD (Tp)</span>
                <span class="text-polar-cyan font-bold text-sm" id="hudWavePeriod">8.2s</span>
              </div>
              <div class="h-6 w-px bg-abyss-700"></div>
              <div>
                <span class="text-[9px] uppercase text-slate-400 block">WATER DRIFT</span>
                <span class="text-emerald-400 font-bold text-sm" id="hudCurrentSpeed">1.64 kts</span>
              </div>
            </div>
          </div>

          <!-- HUD Layer (Top Right: Live RF Uplink & Sonar Status) -->
          <div class="absolute top-4 right-4 z-20 pointer-events-none font-mono text-xs hidden sm:block">
            <div class="px-3 py-2 rounded-lg bg-abyss-950/80 border border-abyss-700/80 backdrop-blur-md text-slate-200 space-y-1">
              <div class="flex items-center justify-between gap-4 text-[10px]">
                <span class="text-slate-400">UPWARD RF BURST:</span>
                <span class="text-maritime-yellow font-bold" id="hudRfStatus">EVERY 60s (ACTIVE)</span>
              </div>
              <div class="flex items-center justify-between gap-4 text-[10px]">
                <span class="text-slate-400">DOWNWARD ADCP SONAR:</span>
                <span class="text-polar-cyan font-bold" id="hudSonarStatus">600 kHz CONTINUOUS</span>
              </div>
              <div class="flex items-center justify-between gap-4 text-[10px]">
                <span class="text-slate-400">STORE-AND-FORWARD:</span>
                <span class="text-emerald-400 font-bold">128GB FLASH BUFFER (0% LOSS)</span>
              </div>
            </div>
          </div>

          <!-- HUD Layer (Bottom Left: Real-Time Ocean Thermocline Mini-Graph) -->
          <div class="absolute bottom-4 left-4 z-20 glass-panel rounded-xl p-3 border border-abyss-700/80 font-mono text-xs w-64 sm:w-72">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[10px] uppercase text-polar-cyan font-bold flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                LIVE THERMOCLINE PROFILE
              </span>
              <span class="text-[9px] text-slate-400">0m to -100m</span>
            </div>
            <!-- Mini canvas for depth profile -->
            <canvas id="thermoclineCanvas" width="260" height="95" class="w-full h-[95px] rounded bg-abyss-950 border border-abyss-800"></canvas>
            <div class="flex items-center justify-between text-[9px] text-slate-400 mt-1 font-mono">
              <span>Surface: <strong class="text-maritime-yellow" id="thermoclineSurfTemp">-1.2°C</strong></span>
              <span>-100m: <strong class="text-polar-cyan" id="thermoclineDeepTemp">+1.4°C</strong></span>
            </div>
          </div>

          <!-- HUD Layer (Bottom Right: Mission Cam Lens Details) -->
          <div class="absolute bottom-4 right-4 z-20 pointer-events-none font-mono text-right text-[11px] text-slate-400 hidden sm:block">
            <div class="px-2.5 py-1.5 rounded bg-abyss-950/70 border border-abyss-800 backdrop-blur-sm">
              <span class="text-slate-500 block text-[9px]">DRAKE PASSAGE TRANSECT</span>
              <span class="text-slate-300 font-semibold" id="camViewLabel">CAM 01: SURFACE DECK WIDE-ANGLE</span>
              <span class="text-emerald-400 block text-[9px]">60.0 FPS • HARDWARE ACCELERATED</span>
            </div>
          </div>

        </div>

        <!-- Simulation Control Strip -->
        <div class="px-4 sm:px-6 py-3 bg-abyss-900 border-t border-abyss-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div class="flex items-center gap-3">
            <span class="text-slate-400">Simulation Speed:</span>
            <button onclick="setSimSpeed(1)" id="spd1x" class="px-2.5 py-1 rounded bg-maritime-amber text-abyss-950 font-bold">1x</button>
            <button onclick="setSimSpeed(2)" id="spd2x" class="px-2.5 py-1 rounded bg-abyss-800 text-slate-300 hover:text-white border border-abyss-700">2x</button>
            <button onclick="setSimSpeed(4)" id="spd4x" class="px-2.5 py-1 rounded bg-abyss-800 text-slate-300 hover:text-white border border-abyss-700">4x</button>
          </div>

          <div class="flex items-center gap-4 text-slate-400 text-[11px]">
            <span class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-maritime-amber inline-block"></span>
              Yellow Arcs: Telemetry Uplink to Iridium Orbit
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-polar-cyan inline-block"></span>
              Cyan Cones: ADCP Acoustic Doppler Profiling
            </span>
          </div>
        </div>

      </div>

    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- MODULE 3: DUAL-CONTROLLER ARCHITECTURE & 6-STEP AUTONOMOUS LOOP          -->
  <!-- ========================================================================= -->
  <section id="architecture-loop" class="py-12 relative border-t border-abyss-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="mb-8">
        <div class="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-2">
          <span class="w-2 h-2 rounded-sm bg-emerald-400"></span>
          Embedded System Architecture & Decision Flow
        </div>
        <h2 class="font-display font-bold text-2xl sm:text-3xl text-white">
          Dual-Tier Hardware Controller & The 6-Step Autonomous Loop
        </h2>
        <p class="text-sm text-slate-400 mt-1 max-w-2xl">
          Designed for 100% deterministic reliability. The ultra-low power ESP32-S3 co-processor orchestrates ADC acquisition while the Raspberry Pi 5 handles Edge AI anomaly analysis and transmission dispatching.
        </p>
      </div>

      <!-- Architecture Breakdown: 2 Tier Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        
        <!-- Tier 1: ESP32-S3 Co-Processor -->
        <div class="glass-panel rounded-2xl p-6 border-t-4 border-t-maritime-amber border-abyss-700 relative overflow-hidden shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-maritime-amber/10 border border-maritime-amber/40 flex items-center justify-center text-maritime-yellow font-mono font-bold">
                T1
              </div>
              <div>
                <h3 class="font-display font-bold text-lg text-white">ESP32-S3 Real-Time Co-Processor</h3>
                <span class="text-xs font-mono text-maritime-yellow">Deterministic Sensing &amp; Watchdog Tier</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded bg-abyss-950 text-maritime-yellow border border-maritime-amber/30 text-xs font-mono font-semibold">240 MHz Dual-Core</span>
          </div>

          <p class="text-xs text-slate-300 mb-4 leading-relaxed">
            Directly interfaces with physical submerged sensors through isolated 24-bit Delta-Sigma ADCs. Governs hardware sleep states, power MOSFET rail gates, and independent hardware watchdog timers.
          </p>

          <div class="space-y-2 text-xs font-mono">
            <div class="p-2.5 rounded-lg bg-abyss-950/80 border border-abyss-800 flex items-start gap-2">
              <span class="text-maritime-yellow font-bold mt-0.5">▶</span>
              <div>
                <strong class="text-white">24-bit ADC Acquisition:</strong>
                <span class="text-slate-400"> Ultra-clean analog front-end with differential PGA for PT100 temperature and piezoresistive pressure transducers.</span>
              </div>
            </div>
            <div class="p-2.5 rounded-lg bg-abyss-950/80 border border-abyss-800 flex items-start gap-2">
              <span class="text-maritime-yellow font-bold mt-0.5">▶</span>
              <div>
                <strong class="text-white">MOSFET Power Gating:</strong>
                <span class="text-slate-400"> Completely cuts quiescent sensor current during sleep, maintaining an idle baseline under 12mA.</span>
              </div>
            </div>
            <div class="p-2.5 rounded-lg bg-abyss-950/80 border border-abyss-800 flex items-start gap-2">
              <span class="text-maritime-yellow font-bold mt-0.5">▶</span>
              <div>
                <strong class="text-white">Hardware Watchdog &amp; Leak Alarming:</strong>
                <span class="text-slate-400"> Dual optical moisture sensors in the dry well trigger immediate emergency uplink and high-power bilge isolation.</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-abyss-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Operating Voltage: <strong class="text-slate-200">3.3V Regulated</strong></span>
            <span>Sleep Power: <strong class="text-emerald-400">&lt; 15 mW</strong></span>
          </div>
        </div>

        <!-- Tier 2: Raspberry Pi 5 Edge AI -->
        <div class="glass-panel rounded-2xl p-6 border-t-4 border-t-polar-cyan border-abyss-700 relative overflow-hidden shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-polar-cyan/10 border border-polar-cyan/40 flex items-center justify-center text-polar-cyan font-mono font-bold">
                T2
              </div>
              <div>
                <h3 class="font-display font-bold text-lg text-white">Raspberry Pi 5 (8GB) Edge AI</h3>
                <span class="text-xs font-mono text-polar-cyan">Inference &amp; Resilient Dispatch Tier</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded bg-abyss-950 text-polar-cyan border border-polar-cyan/30 text-xs font-mono font-semibold">2.4 GHz Quad-Core Cortex-A76</span>
          </div>

          <p class="text-xs text-slate-300 mb-4 leading-relaxed">
            Wakes up on high-speed DMA UART trigger from the ESP32. Executes ONNX/PyTorch anomaly detection, cross-sensor statistical filtering, and handles store-and-forward flash buffering.
          </p>

          <div class="space-y-2 text-xs font-mono">
            <div class="p-2.5 rounded-lg bg-abyss-950/80 border border-abyss-800 flex items-start gap-2">
              <span class="text-polar-cyan font-bold mt-0.5">▶</span>
              <div>
                <strong class="text-white">Edge AI Anomaly Detection:</strong>
                <span class="text-slate-400"> Autoencoder &amp; rolling multivariate Z-score filters isolate oceanographic events from sensor failure.</span>
              </div>
            </div>
            <div class="p-2.5 rounded-lg bg-abyss-950/80 border border-abyss-800 flex items-start gap-2">
              <span class="text-polar-cyan font-bold mt-0.5">▶</span>
              <div>
                <strong class="text-white">Store-and-Forward SQLite Buffer:</strong>
                <span class="text-slate-400"> 128GB industrial NVMe flash retains 100% of telemetry during multi-week Antarctic storm blackouts.</span>
              </div>
            </div>
            <div class="p-2.5 rounded-lg bg-abyss-950/80 border border-abyss-800 flex items-start gap-2">
              <span class="text-polar-cyan font-bold mt-0.5">▶</span>
              <div>
                <strong class="text-white">Binary Delta CBOR Serialization:</strong>
                <span class="text-slate-400"> Compresses 32-parameter scientific packets down to 140 bytes for low-cost satellite transmission.</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-abyss-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Inter-Tier Bus: <strong class="text-slate-200">Opto-Isolated SPI + CRC-16</strong></span>
            <span>OS: <strong class="text-polar-cyan">Debian 12 Real-Time Kernel</strong></span>
          </div>
        </div>

      </div>

      <!-- The 6-Step Autonomous Loop Walkthrough -->
      <div class="glass-panel rounded-2xl p-6 sm:p-8 border border-abyss-700/80 shadow-2xl">
        <div class="text-center max-w-2xl mx-auto mb-8">
          <span class="text-xs font-mono uppercase tracking-widest text-maritime-amber font-semibold">Continuous Autonomy Cycle</span>
          <h3 class="font-display font-bold text-xl sm:text-2xl text-white mt-1">The 6-Step Autonomous Loop</h3>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Click on any phase to simulate the data transformation and state progression in the onboard firmware.
          </p>
        </div>

        <!-- 6 Step Pipeline Cards -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <!-- Step 1: SENSE -->
          <div onclick="selectLoopStep(1)" id="stepCard1" class="p-4 rounded-xl bg-abyss-900 border-2 border-maritime-amber text-left cursor-pointer transition-all hover:scale-105 shadow-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-maritime-amber text-abyss-950 font-bold">01</span>
              <span class="w-2 h-2 rounded-full bg-maritime-amber animate-ping"></span>
            </div>
            <h4 class="font-display font-bold text-sm text-white">SENSE</h4>
            <p class="text-[11px] text-slate-400 mt-1">Deterministic ADC sampling across 7 physical transducers.</p>
          </div>

          <!-- Step 2: VALIDATE -->
          <div onclick="selectLoopStep(2)" id="stepCard2" class="p-4 rounded-xl bg-abyss-900/60 border border-abyss-700 text-left cursor-pointer transition-all hover:scale-105">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-abyss-800 text-slate-300 font-bold">02</span>
            </div>
            <h4 class="font-display font-bold text-sm text-white">VALIDATE</h4>
            <p class="text-[11px] text-slate-400 mt-1">Physical bounds &amp; rate-of-change Kalman filtering.</p>
          </div>

          <!-- Step 3: ANALYZE -->
          <div onclick="selectLoopStep(3)" id="stepCard3" class="p-4 rounded-xl bg-abyss-900/60 border border-abyss-700 text-left cursor-pointer transition-all hover:scale-105">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-abyss-800 text-slate-300 font-bold">03</span>
            </div>
            <h4 class="font-display font-bold text-sm text-white">ANALYZE</h4>
            <p class="text-[11px] text-slate-400 mt-1">Edge AI multi-variate rolling anomaly scoring.</p>
          </div>

          <!-- Step 4: ADAPT -->
          <div onclick="selectLoopStep(4)" id="stepCard4" class="p-4 rounded-xl bg-abyss-900/60 border border-abyss-700 text-left cursor-pointer transition-all hover:scale-105">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-abyss-800 text-slate-300 font-bold">04</span>
            </div>
            <h4 class="font-display font-bold text-sm text-white">ADAPT</h4>
            <p class="text-[11px] text-slate-400 mt-1">Sampling governor: 60s idle escalates to 5s burst.</p>
          </div>

          <!-- Step 5: TRANSMIT -->
          <div onclick="selectLoopStep(5)" id="stepCard5" class="p-4 rounded-xl bg-abyss-900/60 border border-abyss-700 text-left cursor-pointer transition-all hover:scale-105">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-abyss-800 text-slate-300 font-bold">05</span>
            </div>
            <h4 class="font-display font-bold text-sm text-white">TRANSMIT</h4>
            <p class="text-[11px] text-slate-400 mt-1">CBOR delta binary packets via Iridium &amp; LoRa.</p>
          </div>

          <!-- Step 6: VISUALIZE -->
          <div onclick="selectLoopStep(6)" id="stepCard6" class="p-4 rounded-xl bg-abyss-900/60 border border-abyss-700 text-left cursor-pointer transition-all hover:scale-105">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-abyss-800 text-slate-300 font-bold">06</span>
            </div>
            <h4 class="font-display font-bold text-sm text-white">VISUALIZE</h4>
            <p class="text-[11px] text-slate-400 mt-1">Polar station digital twin &amp; research fleet ingest.</p>
          </div>

        </div>

        <!-- Dynamic Step Inspector Panel -->
        <div class="mt-6 p-5 rounded-xl bg-abyss-950 border border-abyss-700/80 font-mono text-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-abyss-800 gap-2">
            <span class="text-maritime-yellow font-bold uppercase tracking-wider flex items-center gap-2" id="loopStepTitle">
              ▶ STEP 1: SENSE — PHYSICAL TRANSDUCER ACQUISITION
            </span>
            <span class="text-slate-400 text-[11px]" id="loopStepSub">
              Execution Time: &lt; 42ms • ESP32-S3 Core 0
            </span>
          </div>
          <div class="text-slate-300 leading-relaxed" id="loopStepDesc">
            Submerged transducers are sequentially powered via low-RDS(on) P-channel MOSFETs. The 24-bit Delta-Sigma ADC takes 128 oversampled readings per channel, calculating RMS and removing electrical noise prior to DMA buffer packaging.
          </div>
          <div class="mt-3 p-3 rounded bg-abyss-900/80 border border-abyss-800 text-[11px] text-emerald-400 flex items-center justify-between">
            <span id="loopStepCode">ESP32_ADC_POLL(CH_TEMP, CH_SAL, CH_DO, CH_PH, CH_PRESSURE); // DMA Buffer Ready</span>
            <button onclick="advanceLoopStep()" class="text-maritime-yellow hover:text-white font-bold ml-4 underline">
              Next Step ▶
            </button>
          </div>
        </div>

      </div>

    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- MODULE 4: POLAR FEASIBILITY & SURVIVABILITY MATRIX                        -->
  <!-- ========================================================================= -->
  <section id="polar-risks" class="py-12 relative border-t border-abyss-800/80 bg-abyss-950/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="mb-8">
        <div class="text-xs font-mono uppercase tracking-widest text-rose-400 mb-1 flex items-center gap-2">
          <span class="w-2 h-2 rounded-sm bg-rose-400"></span>
          Extreme Polar Environment Engineering
        </div>
        <h2 class="font-display font-bold text-2xl sm:text-3xl text-white">
          Polar Feasibility &amp; Risk Mitigation Matrix
        </h2>
        <p class="text-sm text-slate-400 mt-1 max-w-2xl">
          Southern Ocean deployments subject buoys to sub-zero temperatures, biofouling, pack ice shearing, and multi-week communication outages. Here is how OceanX overcomes each:
        </p>
      </div>

      <!-- Risk Matrix 4 Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Risk 1: Sub-zero Battery Depletion -->
        <div class="glass-panel rounded-2xl p-5 border-t-4 border-t-polar-cyan border-abyss-700 flex flex-col justify-between shadow-xl">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-2xl">❄️</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-polar-cyan/15 text-polar-cyan border border-polar-cyan/30">Thermal Hazard</span>
            </div>
            <h3 class="font-display font-bold text-base text-white">Sub-Zero Battery Depletion (-35°C)</h3>
            <p class="text-xs text-rose-300 font-mono mt-1 mb-3">
              Risk: Li-ion electrolyte freezes, losing 85% capacity and risking permanent lithium plating during charge.
            </p>
            <div class="space-y-1.5 text-xs text-slate-300 font-sans">
              <div class="flex items-start gap-1.5">
                <span class="text-emerald-400 font-bold">✓</span>
                <span><strong>Aerogel Vacuum Chamber:</strong> 10mm silica aerogel blanket around battery.</span>
              </div>
              <div class="flex items-start gap-1.5">
                <span class="text-emerald-400 font-bold">✓</span>
                <span><strong>Phase Change Material (PCM):</strong> Organic paraffin buffers temperature swings.</span>
              </div>
              <div class="flex items-start gap-1.5">
                <span class="text-emerald-400 font-bold">✓</span>
                <span><strong>Waste Heat Harvesting:</strong> Pi 5 CPU heat pipe channeled into battery casing.</span>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-abyss-800 text-[11px] font-mono text-emerald-400">
            Result: Internal core stays &gt; +5°C in -30°C air
          </div>
        </div>

        <!-- Risk 2: Marine Biofouling & Salt Crusting -->
        <div class="glass-panel rounded-2xl p-5 border-t-4 border-t-maritime-amber border-abyss-700 flex flex-col justify-between shadow-xl">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-2xl">🦠</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-maritime-amber/15 text-maritime-yellow border border-maritime-amber/30">Optical Fouling</span>
            </div>
            <h3 class="font-display font-bold text-base text-white">Marine Biofouling &amp; Salt Crust</h3>
            <p class="text-xs text-rose-300 font-mono mt-1 mb-3">
              Risk: Algal biofilms and diatom colonization degrade optical DO lenses and drift salinity readings.
            </p>
            <div class="space-y-1.5 text-xs text-slate-300 font-sans">
              <div class="flex items-start gap-1.5">
                <span class="text-emerald-400 font-bold">✓</span>
                <span><strong>UV-C LED Sterilization:</strong> 265nm micro-LEDs flash for 30s before sampling.</span>
              </div>
              <div class="flex items-start gap-1.5">
                <span class="text-emerald-400 font-bold">✓</span>
                <span><strong>Ultrasonic Cavitation:</strong> Piezo transducers shed diatom attachment.</span>
              </div>
              <div class="flex items-start gap-1.5">
                <span class="text-emerald-400 font-bold">✓</span>
                <span><strong>Cu-Ni 70/30 Mesh:</strong> Natural copper ion leach shields inductive conductivity coils.</span>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-abyss-800 text-[11px] font-mono text-emerald-400">
            Result: Zero sensor drift over 18+ months
          </div>
        </div>

        <!-- Risk 3: Sea-Ice Shearing & Pack-Ice -->
        <div class="glass-panel rounded-2xl p-5 border-t-4 border-t-emerald-400 border-abyss-700 flex flex-col justify-between shadow-xl">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-2xl">🧊</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-400/15 text-emerald-400 border border-emerald-400/30">Mechanical Shear</span>
            </div>
            <h3 class="font-display font-bold text-base text-white">Sea-Ice Shearing &amp; Collisions</h3>
            <p class="text-xs text-rose-300 font-mono mt-1 mb-3">
              Risk: Moving drift ice sheets crush hulls or sever mooring tethers, capsizing conventional buoys.
            </p>
            <div class="space-y-1.5 text-xs text-slate-300 font-sans">
              <div class="flex items-start gap-1.5">
                <span class="text-emerald-400 font-bold">✓</span>
                <span><strong>Conical Spar Geometry:</strong> Encourages ice floes to ride up and slide off hull.</span>
              </div>
              <div class="flex items-start gap-1.5">
                <span class="text-emerald-400 font-bold">✓</span>
                <span><strong>Positive Metacentric GM:</strong> 65kg low keel ballast creates 110° righting moment.</span>
              </div>
              <div class="flex items-start gap-1.5">
                <span class="text-emerald-400 font-bold">✓</span>
                <span><strong>Sacrificial Shear Pin:</strong> Breakaway tether allows buoy to free-float if trapped.</span>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-abyss-800 text-[11px] font-mono text-emerald-400">
            Result: Self-righting and survivable in Beaufort 10
          </div>
        </div>

        <!-- Risk 4: Intermittent Satellite Blackout -->
        <div class="glass-panel rounded-2xl p-5 border-t-4 border-t-purple-400 border-abyss-700 flex flex-col justify-between shadow-xl">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-2xl">📡</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-400/15 text-purple-400 border border-purple-400/30">Network Blackout</span>
            </div>
            <h3 class="font-display font-bold text-base text-white">Intermittent Comms &amp; Storms</h3>
            <p class="text-xs text-rose-300 font-mono mt-1 mb-3">
              Risk: High-latitude solar storms and heavy wave crests disrupt RF and satellite links for weeks.
            </p>
            <div class="space-y-1.5 text-xs text-slate-300 font-sans">
              <div class="flex items-start gap-1.5">
                <span class="text-emerald-400 font-bold">✓</span>
                <span><strong>128GB Circular Flash Buffer:</strong> Stores up to 5 years of dense time-series.</span>
              </div>
              <div class="flex items-start gap-1.5">
                <span class="text-emerald-400 font-bold">✓</span>
                <span><strong>Opportunistic Dispatcher:</strong> Queues uploads until antenna detects strong TLE pass.</span>
              </div>
              <div class="flex items-start gap-1.5">
                <span class="text-emerald-400 font-bold">✓</span>
                <span><strong>Dual-Band LoRa Backup:</strong> Transmits to passing supply ships and research vessels.</span>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-abyss-800 text-[11px] font-mono text-emerald-400">
            Result: 100% data retention, zero packet loss
          </div>
        </div>

      </div>

    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- MODULE 5: LIVE SENSOR SANDBOX & EDGE AI DECISION ENGINE                  -->
  <!-- ========================================================================= -->
  <section id="sensor-sandbox" class="py-12 relative border-t border-abyss-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-abyss-800">
        <div>
          <div class="text-xs font-mono uppercase tracking-widest text-purple-400 mb-1 flex items-center gap-2">
            <span class="w-2 h-2 rounded-sm bg-purple-400"></span>
            Interactive Hardware-in-the-Loop Simulator
          </div>
          <h2 class="font-display font-bold text-2xl sm:text-3xl text-white">
            Live Sensor Sandbox &amp; Edge AI Escalation Engine
          </h2>
          <p class="text-sm text-slate-400 mt-1 max-w-2xl">
            Adjust the sliders to simulate polar ocean conditions. Watch the Edge AI decision engine dynamically calculate seawater physics and autonomously escalate sampling frequency from 60s idle to 5s burst mode.
          </p>
        </div>

        <!-- Preset Scenarios -->
        <div class="mt-4 md:mt-0 flex flex-wrap items-center gap-2 font-mono text-xs">
          <button onclick="applyPreset('baseline')" class="px-2.5 py-1.5 rounded-lg bg-abyss-800 text-slate-300 hover:text-white border border-abyss-700 transition-all">
            Baseline Polar
          </button>
          <button onclick="applyPreset('meltwater')" class="px-2.5 py-1.5 rounded-lg bg-abyss-800 text-polar-cyan hover:text-white border border-polar-cyan/40 transition-all">
            Glacial Meltwater
          </button>
          <button onclick="applyPreset('upwelling')" class="px-2.5 py-1.5 rounded-lg bg-abyss-800 text-rose-400 hover:text-white border border-rose-500/40 transition-all">
            Benthic Upwelling
          </button>
          <button onclick="applyPreset('brine')" class="px-2.5 py-1.5 rounded-lg bg-abyss-800 text-maritime-yellow hover:text-white border border-maritime-amber/40 transition-all">
            Brine Rejection
          </button>
        </div>
      </div>

      <!-- Live Interactive Sandbox Layout (12 Cols) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Sliders & Controls (6 Cols) -->
        <div class="lg:col-span-6 glass-panel rounded-2xl p-6 border border-abyss-700 shadow-xl space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-abyss-800">
            <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">Submerged Transducers Control</span>
            <span class="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Virtual ADC Online
            </span>
          </div>

          <!-- Slider 1: Temperature (-5.0°C to +10.0°C) -->
          <div>
            <div class="flex items-center justify-between text-xs font-mono mb-2">
              <div class="flex items-center gap-2">
                <span class="text-polar-cyan font-bold text-sm">❄️ Water Temperature</span>
                <span class="text-[10px] text-slate-500">(PT100 RTD)</span>
              </div>
              <div class="flex items-center gap-1">
                <span id="valTempDisplay" class="font-bold text-base text-polar-cyan font-mono">-1.20</span>
                <span class="text-xs text-slate-400">°C</span>
              </div>
            </div>
            <input 
              type="range" 
              id="sliderTemp" 
              min="-5.0" 
              max="10.0" 
              step="0.1" 
              value="-1.2" 
              oninput="onSensorChange()" 
              class="w-full"
            />
            <div class="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>-5.0°C (Deep Sub-Zero)</span>
              <span class="text-polar-ice font-semibold">Freezing pt: -1.9°C</span>
              <span>+10.0°C (Warm Influx)</span>
            </div>
          </div>

          <!-- Slider 2: Practical Salinity (28.0 to 38.0 PSU) -->
          <div>
            <div class="flex items-center justify-between text-xs font-mono mb-2">
              <div class="flex items-center gap-2">
                <span class="text-maritime-yellow font-bold text-sm">🧂 Practical Salinity</span>
                <span class="text-[10px] text-slate-500">(Inductive Toroid)</span>
              </div>
              <div class="flex items-center gap-1">
                <span id="valSalDisplay" class="font-bold text-base text-maritime-yellow font-mono">34.20</span>
                <span class="text-xs text-slate-400">PSU</span>
              </div>
            </div>
            <input 
              type="range" 
              id="sliderSal" 
              min="28.0" 
              max="38.0" 
              step="0.1" 
              value="34.2" 
              oninput="onSensorChange()" 
              class="w-full"
            />
            <div class="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>28.0 (Glacial Freshening)</span>
              <span class="text-slate-400">Mean: 34.5 PSU</span>
              <span>38.0 (Dense Brine)</span>
            </div>
          </div>

          <!-- Slider 3: Dissolved Oxygen (2.0 to 12.0 mg/L) -->
          <div>
            <div class="flex items-center justify-between text-xs font-mono mb-2">
              <div class="flex items-center gap-2">
                <span class="text-emerald-400 font-bold text-sm">🫧 Dissolved Oxygen (DO)</span>
                <span class="text-[10px] text-slate-500">(Optical Quenching)</span>
              </div>
              <div class="flex items-center gap-1">
                <span id="valDoDisplay" class="font-bold text-base text-emerald-400 font-mono">9.40</span>
                <span class="text-xs text-slate-400">mg/L</span>
              </div>
            </div>
            <input 
              type="range" 
              id="sliderDo" 
              min="2.0" 
              max="12.0" 
              step="0.1" 
              value="9.4" 
              oninput="onSensorChange()" 
              class="w-full"
            />
            <div class="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span class="text-rose-400">2.0 (Hypoxic Anomaly)</span>
              <span class="text-slate-400">Baseline: 9.0 mg/L</span>
              <span class="text-emerald-400">12.0 (Hyper-Oxygenated)</span>
            </div>
          </div>

          <!-- Computed Ocean Physics Cards -->
          <div class="pt-4 border-t border-abyss-800 grid grid-cols-2 gap-3 font-mono text-xs">
            <div class="p-3 rounded-xl bg-abyss-950 border border-abyss-800">
              <span class="text-[10px] uppercase text-slate-400 block">DENSITY (EOS-80 σ_t)</span>
              <span class="text-base font-bold text-slate-100" id="calcDensity">1027.42</span>
              <span class="text-[9px] text-slate-500 block">kg/m³ (At atmospheric depth)</span>
            </div>
            <div class="p-3 rounded-xl bg-abyss-950 border border-abyss-800">
              <span class="text-[10px] uppercase text-slate-400 block">ACOUSTIC VELOCITY</span>
              <span class="text-base font-bold text-polar-cyan" id="calcSoundSpeed">1446.8</span>
              <span class="text-[9px] text-slate-500 block">m/s (ADCP calibration)</span>
            </div>
          </div>

          <!-- CSV Export Button -->
          <div class="pt-2">
            <button onclick="downloadSyntheticTelemetryCsv()" class="w-full py-2.5 rounded-xl bg-abyss-800 hover:bg-abyss-700 border border-abyss-600 text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all hover:border-maritime-amber">
              <svg class="w-4 h-4 text-maritime-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Export Real-Time Telemetry Dataset (.CSV)
            </button>
          </div>
        </div>

        <!-- Right: Edge AI Decision Engine & Streaming Terminal (6 Cols) -->
        <div class="lg:col-span-6 space-y-6">
          
          <!-- Edge AI Decision Governor Card -->
          <div id="aiGovernorCard" class="glass-panel rounded-2xl p-6 border-2 border-emerald-500/60 shadow-xl transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" id="aiStatusIndicator"></span>
                <span class="font-display font-bold text-base text-white">Edge AI Adaptive Sampling Governor</span>
              </div>
              <span id="aiModeBadge" class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-xs font-bold">
                60s SLEEP / IDLE MODE
              </span>
            </div>

            <!-- Anomaly Score Progress Bar -->
            <div class="mb-4">
              <div class="flex justify-between text-xs font-mono mb-1.5">
                <span class="text-slate-400">Multi-variate Anomaly Index:</span>
                <span id="aiAnomalyScoreText" class="font-bold text-emerald-400">14.2% (NORMAL)</span>
              </div>
              <div class="w-full bg-abyss-950 rounded-full h-3 border border-abyss-700 overflow-hidden">
                <div id="aiAnomalyBar" class="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300" style="width: 14.2%"></div>
              </div>
              <div class="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0% Safe</span>
                <span class="text-maritime-yellow">Threshold: 65%</span>
                <span class="text-rose-400">100% Critical Anomaly</span>
              </div>
            </div>

            <!-- Dynamic Decision Summary Text -->
            <div id="aiDecisionText" class="p-3 rounded-xl bg-abyss-950/80 border border-abyss-800 text-xs font-mono text-slate-300 leading-relaxed">
              Current sensor readings match Drake Passage climatological baseline. ESP32-S3 maintains 60-second polling interval to conserve LiFePO4 battery power.
            </div>

            <div class="mt-4 pt-3 border-t border-abyss-800 flex items-center justify-between text-xs font-mono">
              <span class="text-slate-400">Power Draw: <strong class="text-emerald-400" id="aiPowerDraw">1.2 Watts</strong></span>
              <span class="text-slate-400">Telemetry Queue: <strong class="text-slate-200" id="aiQueueStatus">Normal Priority</strong></span>
            </div>
          </div>

          <!-- Streaming Firmware Terminal -->
          <div class="glass-panel rounded-2xl p-4 sm:p-5 border border-abyss-700 shadow-xl font-mono text-xs">
            <div class="flex items-center justify-between pb-3 mb-3 border-b border-abyss-800">
              <div class="flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                </div>
                <span class="text-[11px] text-slate-400 uppercase font-semibold ml-2">Hardware DMA / UART Live Stream</span>
              </div>
              <button onclick="clearTerminalLogs()" class="text-[10px] text-slate-500 hover:text-slate-300">
                Clear Buffer
              </button>
            </div>

            <!-- Terminal Output Window -->
            <div id="terminalLogs" class="h-48 overflow-y-auto space-y-1 text-[11px] text-slate-300 bg-abyss-950/90 p-3 rounded-lg border border-abyss-850 font-mono leading-tight">
              <div class="text-slate-500">[00:00:01.042] [ESP32:BOOT] Dual-core Xtensa 240MHz initialized. 24-bit ADC calibrated.</div>
              <div class="text-slate-500">[00:00:01.189] [RPI5:KERNEL] Linux 6.6.20-rt-oceanx loaded. PyTorch 2.2 Edge AI ready.</div>
              <div class="text-slate-500">[00:00:02.401] [COMM:LORA] SX1262 LoRa module online (+22dBm, 868MHz SF7/BW125).</div>
              <div class="text-slate-500">[00:00:03.112] [PMU:MPPT] Solar array active. Battery SoC: 94.2% (26.4V).</div>
              <div class="text-emerald-400">[00:14:20.000] [ESP32:ADC] T=-1.20C, S=34.20PSU, DO=9.40mg/L, P=10.12bar.</div>
              <div class="text-polar-cyan">[00:14:20.045] [RPI5:AI] Anomaly score: 0.142. Nominal envelope maintained.</div>
              <div class="text-slate-400">[00:14:20.088] [SYS:GOV] Mode: IDLE_60S. Entering ultra-low-power sleep for 59.9s.</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  </section>

  <!-- ========================================================================= -->
  <!-- FOOTER & SIH CREDITS                                                      -->
  <!-- ========================================================================= -->
  <footer class="py-12 border-t border-abyss-800 bg-abyss-950 text-xs font-mono text-slate-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-maritime-amber/15 border border-maritime-amber/40 flex items-center justify-center text-maritime-yellow font-bold">
            OX
          </div>
          <div>
            <span class="text-white font-bold text-sm tracking-wide font-display">OCEANX DIGITAL TWIN</span>
            <p class="text-[11px] text-slate-500">Autonomous Polar &amp; Southern Ocean Spar-Torus Observation Platform</p>
          </div>
        </div>

        <div class="text-center md:text-right">
          <p class="text-slate-300 font-semibold">Smart India Hackathon 2026 • Problem Statement #26065</p>
          <p class="text-[11px] text-slate-500 mt-0.5">Developed with pride by <strong class="text-maritime-yellow">Team Coders May Cry</strong></p>
        </div>

      </div>

      <div class="mt-8 pt-6 border-t border-abyss-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-600">
        <span>© 2026 OceanX Project. Single-File High-Performance Web Application.</span>
        <span>HTML5 Canvas 60 FPS • Web Audio API • Tailwind CSS • Zero Heavy Bundles</span>
      </div>
    </div>
  </footer>

  <!-- ========================================================================= -->
  <!-- MODAL: SIH 2026 PITCH & PROBLEM STATEMENT BRIEF                           -->
  <!-- ========================================================================= -->
  <div id="sihModal" class="fixed inset-0 z-50 bg-abyss-950/80 backdrop-blur-md hidden items-center justify-center p-4">
    <div class="glass-panel max-w-2xl w-full rounded-2xl border border-maritime-amber/50 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
      <button onclick="toggleSihModal(false)" class="absolute top-4 right-4 text-slate-400 hover:text-white p-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <div class="flex items-center gap-2 text-xs font-mono text-maritime-yellow mb-2">
        <span class="px-2 py-0.5 rounded bg-maritime-amber/20 border border-maritime-amber/40">SIH 2026 PITCH BRIEF</span>
        <span>PS #26065</span>
      </div>

      <h3 class="font-display font-bold text-2xl text-white">Autonomous Polar Ocean Platform</h3>
      <p class="text-xs text-slate-300 font-mono mt-1 mb-4">Team: Coders May Cry (CMC) | Category: Hardware Robotics</p>

      <div class="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
        <div class="p-3.5 rounded-xl bg-abyss-900 border border-abyss-800">
          <strong class="text-white block font-mono text-[11px] uppercase text-maritime-yellow mb-1">The Problem:</strong>
          The Southern and Polar Oceans govern 40% of global oceanic carbon absorption and drive the global thermohaline conveyor. Yet they remain catastrophic data deserts due to extreme iceberg shearing, polar night, -35°C freezes, and prohibitive mooring costs ($150,000+ per buoy).
        </div>

        <div class="p-3.5 rounded-xl bg-abyss-900 border border-abyss-800">
          <strong class="text-white block font-mono text-[11px] uppercase text-polar-cyan mb-1">The OceanX Solution:</strong>
          A self-righting spar-torus buoy built for $4,800. Features an octagonal solar skirt for low-incidence polar sun, dual-tier ESP32-S3 + Raspberry Pi 5 computing, on-board Edge AI adaptive sampling that escalates from 60s idle to 5s burst when detecting rapid ice-melt or brine upwelling, and store-and-forward resilience.
        </div>

        <div class="grid grid-cols-2 gap-3 font-mono text-[11px]">
          <div class="p-2.5 rounded-lg bg-abyss-950 border border-abyss-800">
            <span class="text-slate-400 block text-[9px]">CONVENTIONAL BUOY</span>
            <span class="text-rose-400 font-bold">$150,000+</span>
            <span class="text-slate-500 block text-[9px]">Static sampling, high power</span>
          </div>
          <div class="p-2.5 rounded-lg bg-abyss-950 border border-abyss-800">
            <span class="text-slate-400 block text-[9px]">OCEANX SPAR PLATFORM</span>
            <span class="text-emerald-400 font-bold">$4,800</span>
            <span class="text-slate-500 block text-[9px]">Edge AI adaptive, 3-yr life</span>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-abyss-800 flex justify-end">
        <button onclick="toggleSihModal(false)" class="px-4 py-2 rounded-xl bg-maritime-amber text-abyss-950 font-bold text-xs font-mono">
          Close Brief
        </button>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- JAVASCRIPT: SIMULATION, AUDIO, PHYSICS, & INTERACTIVITY                   -->
  <!-- ========================================================================= -->
  <script>
    /* =========================================================================
       1. GLOBAL STATE & CONFIGURATION
       ========================================================================= */
    const state = {{
      // Simulation parameters
      time: 0,
      simSpeed: 1,
      isPaused: false,
      cameraView: 'surface', // 'surface' | 'keel' | 'satellite'
      seaState: 'moderate',  // 'calm' | 'moderate' | 'gale'
      
      // Wave parameters for dual-sinusoidal canvas
      waveParams: {{
        calm:     {{ amp1: 14, freq1: 0.007, speed1: 0.025, amp2: 6,  freq2: 0.015, speed2: 0.040, heightLabel: '0.8m', periodLabel: '6.4s', driftLabel: '0.82 kts' }},
        moderate: {{ amp1: 32, freq1: 0.005, speed1: 0.038, amp2: 15, freq2: 0.011, speed2: 0.062, heightLabel: '2.4m', periodLabel: '8.2s', driftLabel: '1.64 kts' }},
        gale:     {{ amp1: 65, freq1: 0.003, speed1: 0.065, amp2: 28, freq2: 0.008, speed2: 0.095, heightLabel: '6.2m', periodLabel: '11.8s', driftLabel: '3.42 kts' }}
      }},

      // Buoy kinematics
      buoy: {{
        x: 0,
        y: 0,
        angle: 0,
        heaveDamp: 0
      }},

      // Visual pulse timers
      rfPulseTimer: 0,
      rfPulses: [],
      sonarPulseTimer: 0,
      sonarPulses: [],

      // Active sensor values
      sensors: {{
        temperature: -1.2, // °C
        salinity: 34.2,    // PSU
        dissolvedO2: 9.4   // mg/L
      }},

      // AI Decision state
      ai: {{
        anomalyScore: 0.142,
        mode: 'IDLE_60S', // 'IDLE_60S' | 'BURST_5S'
        isBurst: false,
        samplingIntervalSec: 60
      }},

      // Web Audio
      audioEnabled: false,
      audioCtx: null,

      // Mission Timer
      metSeconds: 142 * 86400 + 8 * 3600 + 34 * 60 + 12
    }};

    /* =========================================================================
       2. WEB AUDIO API PROCEDURAL SYNTHESIZER
       ========================================================================= */
    function initAudio() {{
      if (!state.audioCtx) {{
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        state.audioCtx = new AudioContext();
      }}
      if (state.audioCtx.state === 'suspended') {{
        state.audioCtx.resume();
      }}
    }}

    function toggleSonarAudio() {{
      initAudio();
      state.audioEnabled = !state.audioEnabled;
      const text = document.getElementById('audioStatusText');
      const icon = document.getElementById('audioIcon');
      if (state.audioEnabled) {{
        text.innerText = 'Sonar FX (ON)';
        text.classList.add('text-maritime-yellow');
        icon.classList.add('text-maritime-yellow');
        playSonarPing(880, 0.4);
      }} else {{
        text.innerText = 'Sonar FX (MUTE)';
        text.classList.remove('text-maritime-yellow');
        icon.classList.remove('text-maritime-yellow');
      }}
    }}

    function playSonarPing(freq = 720, dur = 0.8) {{
      if (!state.audioEnabled || !state.audioCtx) return;
      try {{
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.7, state.audioCtx.currentTime + dur);

        gain.gain.setValueAtTime(0.18, state.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + dur);

        osc.connect(gain);
        gain.connect(state.audioCtx.destination);

        osc.start();
        osc.stop(state.audioCtx.currentTime + dur);
      }} catch (e) {{
        console.warn('Audio play error:', e);
      }}
    }}

    function playSatelliteChirp() {{
      if (!state.audioEnabled || !state.audioCtx) return;
      try {{
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, state.audioCtx.currentTime);
        osc.frequency.setValueAtTime(2100, state.audioCtx.currentTime + 0.05);
        osc.frequency.setValueAtTime(2800, state.audioCtx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.08, state.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(state.audioCtx.destination);

        osc.start();
        osc.stop(state.audioCtx.currentTime + 0.22);
      }} catch (e) {{
        console.warn('Audio play error:', e);
      }}
    }}

    function pingSonarFx() {{
      initAudio();
      state.audioEnabled = true;
      document.getElementById('audioStatusText').innerText = 'Sonar FX (ON)';
      playSonarPing(620, 1.2);
      triggerAcousticBurst();
    }}

    /* =========================================================================
       3. MISSION CAM & OCEAN SWELL CANVAS SIMULATION (60 FPS)
       ========================================================================= */
    const canvas = document.getElementById('missionCanvas');
    const ctx = canvas.getContext('2d');

    // High DPI Canvas Scaling
    function resizeCanvas() {{
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }}
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Floating particles (Marine snow / Ice slush)
    const particles = [];
    for (let i = 0; i < 70; i++) {{
      particles.push({{
        x: Math.random() * 1200,
        y: Math.random() * 800,
        speedX: -0.2 - Math.random() * 0.8,
        speedY: 0.1 + Math.random() * 0.4,
        size: Math.random() * 2.5 + 0.8,
        alpha: Math.random() * 0.6 + 0.2
      }});
    }}

    function triggerAcousticBurst() {{
      state.sonarPulses.push({{
        radius: 5,
        maxRadius: 180,
        alpha: 0.9,
        angleWidth: Math.PI / 4
      }});
    }}

    function triggerRfBurst() {{
      state.rfPulses.push({{
        radius: 8,
        maxRadius: 260,
        alpha: 0.95
      }});
      playSatelliteChirp();
    }}

    // Animation Loop
    function renderSim() {{
      if (!state.isPaused) {{
        state.time += 1 * state.simSpeed;
        state.rfPulseTimer += 1 * state.simSpeed;
        state.sonarPulseTimer += 1 * state.simSpeed;
        state.metSeconds += (1 / 60) * state.simSpeed;
      }}

      // Periodic pulses
      if (state.rfPulseTimer > (state.ai.isBurst ? 100 : 360)) {{
        state.rfPulseTimer = 0;
        triggerRfBurst();
      }}
      if (state.sonarPulseTimer > (state.ai.isBurst ? 60 : 180)) {{
        state.sonarPulseTimer = 0;
        triggerAcousticBurst();
      }}

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, width, height);

      // Branch depending on active camera view
      if (state.cameraView === 'surface') {{
        renderSurfaceView(width, height);
      }} else if (state.cameraView === 'keel') {{
        renderKeelView(width, height);
      }} else if (state.cameraView === 'satellite') {{
        renderSatelliteView(width, height);
      }}

      // Update MET clock in header
      updateMetHeader();

      requestAnimationFrame(renderSim);
    }}

    /* -------------------------------------------------------------------------
       VIEW 1: SURFACE BUOY VIEW (Dual Sinusoidal Ocean Swell Physics)
       ------------------------------------------------------------------------- */
    function renderSurfaceView(width, height) {{
      const params = state.waveParams[state.seaState];
      const waterLineBase = height * 0.58;

      // 1. Polar Sky Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, waterLineBase);
      skyGrad.addColorStop(0, '#020617'); // Dark polar twilight
      skyGrad.addColorStop(0.5, '#07152b');
      skyGrad.addColorStop(0.85, '#0f274c');
      skyGrad.addColorStop(1, '#1b3b6f');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, waterLineBase + 50);

      // Aurora / Horizon Glow
      const horizonGlow = ctx.createRadialGradient(width * 0.5, waterLineBase, 10, width * 0.5, waterLineBase, width * 0.6);
      horizonGlow.addColorStop(0, 'rgba(0, 242, 254, 0.15)');
      horizonGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.08)');
      horizonGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, 0, width, waterLineBase);

      // Distant Iceberg Silhouette
      ctx.fillStyle = 'rgba(15, 39, 76, 0.7)';
      ctx.beginPath();
      ctx.moveTo(width * 0.15, waterLineBase);
      ctx.lineTo(width * 0.22, waterLineBase - 32);
      ctx.lineTo(width * 0.28, waterLineBase - 25);
      ctx.lineTo(width * 0.35, waterLineBase);
      ctx.closePath();
      ctx.fill();

      // Dual Sinusoidal Wave Height Function
      function getWaveY(x, t) {{
        return waterLineBase 
          + Math.sin(x * params.freq1 + t * params.speed1) * params.amp1 
          + Math.cos(x * params.freq2 + t * params.speed2) * params.amp2;
      }}

      // Calculate Wave Slope for Buoy Pitch Angle: dy/dx
      function getWaveSlope(x, t) {{
        const delta = 2;
        const y1 = getWaveY(x - delta, t);
        const y2 = getWaveY(x + delta, t);
        return (y2 - y1) / (delta * 2);
      }}

      // Buoy Position & Attitude
      const buoyX = width * 0.5;
      const targetWaveY = getWaveY(buoyX, state.time);
      const slope = getWaveSlope(buoyX, state.time);
      
      // Smooth Heave & Pitch interpolation
      state.buoy.x = buoyX;
      state.buoy.y += (targetWaveY - state.buoy.y) * 0.15;
      const targetAngle = Math.atan(slope) * 0.85;
      state.buoy.angle += (targetAngle - state.buoy.angle) * 0.12;

      // Update Attitude Display
      const rollDeg = (state.buoy.angle * (180 / Math.PI)).toFixed(1);
      const pitchDeg = (Math.sin(state.time * 0.03) * 1.5).toFixed(1);
      document.getElementById('buoyRollValue').innerText = (rollDeg >= 0 ? '+' : '') + rollDeg + '°';
      document.getElementById('buoyPitchValue').innerText = (pitchDeg >= 0 ? '+' : '') + pitchDeg + '°';

      // 2. Draw Sub-surface Light Rays (God Rays)
      ctx.save();
      for (let r = 0; r < 5; r++) {{
        const rayGrad = ctx.createLinearGradient(0, waterLineBase, 0, height);
        rayGrad.addColorStop(0, 'rgba(0, 242, 254, 0.08)');
        rayGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        const rx = width * (0.2 + r * 0.15) + Math.sin(state.time * 0.02 + r) * 30;
        ctx.moveTo(rx, waterLineBase);
        ctx.lineTo(rx - 60, height);
        ctx.lineTo(rx + 80, height);
        ctx.closePath();
        ctx.fill();
      }}
      ctx.restore();

      // 3. Render Deep Ocean Background (Below Wave)
      const waterGrad = ctx.createLinearGradient(0, waterLineBase, 0, height);
      waterGrad.addColorStop(0, '#082f49');
      waterGrad.addColorStop(0.3, '#0c1e3d');
      waterGrad.addColorStop(1, '#030914');

      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, getWaveY(0, state.time));
      for (let x = 0; x <= width; x += 6) {{
        ctx.lineTo(x, getWaveY(x, state.time));
      }}
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // 4. Draw Buoy Spar Graphic at (buoyX, buoyY) with Angle
      ctx.save();
      ctx.translate(state.buoy.x, state.buoy.y);
      ctx.rotate(state.buoy.angle);

      // --- Downward Acoustic Sonar Pulses from bottom ballast ---
      for (let i = state.sonarPulses.length - 1; i >= 0; i--) {{
        const p = state.sonarPulses[i];
        p.radius += 2.2 * state.simSpeed;
        p.alpha -= 0.012 * state.simSpeed;
        if (p.alpha <= 0 || p.radius > p.maxRadius) {{
          state.sonarPulses.splice(i, 1);
          continue;
        }}
        ctx.save();
        ctx.strokeStyle = `rgba(0, 242, 254, ${{p.alpha}})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Downward arc from bottom keel (y = +135)
        ctx.arc(0, 135, p.radius, Math.PI * 0.3, Math.PI * 0.7);
        ctx.stroke();
        ctx.restore();
      }}

      // --- Upward RF Telemetry Pulses from top mast ---
      for (let i = state.rfPulses.length - 1; i >= 0; i--) {{
        const p = state.rfPulses[i];
        p.radius += 3.0 * state.simSpeed;
        p.alpha -= 0.015 * state.simSpeed;
        if (p.alpha <= 0 || p.radius > p.maxRadius) {{
          state.rfPulses.splice(i, 1);
          continue;
        }}
        ctx.save();
        ctx.strokeStyle = `rgba(245, 158, 11, ${{p.alpha}})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        // Upward arc from top mast (y = -105)
        ctx.arc(0, -105, p.radius, Math.PI * 1.25, Math.PI * 1.75);
        ctx.stroke();
        ctx.restore();
      }}

      // BUOY LOWER SPAR & KEEL (Submerged, y > 0)
      // Central Stainless Truss
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 15);
      ctx.lineTo(0, 125);
      ctx.stroke();

      // Outer Cage Truss
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-16, 20, 32, 100);

      // Dual Sensor Canisters (White POM/Titanium cylinders)
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      // Canister Left (CTD)
      ctx.fillRect(-24, 45, 10, 35);
      ctx.strokeRect(-24, 45, 10, 35);
      // Canister Right (DO / pH)
      ctx.fillRect(14, 45, 10, 35);
      ctx.strokeRect(14, 45, 10, 35);

      // Bottom ADCP & Ballast (y = 120 to 140)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-18, 122, 36, 18, [4, 4, 12, 12]);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // BUOY MAIN COLLAR & FOAM FENDER (Around waterline y = -12 to +14)
      // Safety Yellow Foam Collar
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(0, 0, 54, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1e293b';
      ctx.stroke();

      // Black Impact Fender Rim
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(0, 3, 52, 14, 0, 0, Math.PI);
      ctx.stroke();

      // Stenciled "OCEANX"
      ctx.fillStyle = '#020617';
      ctx.font = 'bold 9px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('OCEANX', 0, 4);

      // SOLAR SKIRT (Octagonal angled deck y = -35 to -10)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(-45, -8);
      ctx.lineTo(-32, -32);
      ctx.lineTo(32, -32);
      ctx.lineTo(45, -8);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#020617';
      ctx.stroke();

      // Monocrystalline Solar Cells (Blue grids)
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-28, -28, 24, 16);
      ctx.fillRect(4, -28, 24, 16);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(-28, -28, 24, 16);
      ctx.strokeRect(4, -28, 24, 16);

      // MAST TOWER & HOUSING (y = -32 to -80)
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-12, -75, 24, 43);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(-12, -75, 24, 43);

      // MAST SATELLITE POD & ANTENNAS (y = -75 to -110)
      // Satellite Pod (Black dome)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(8, -82, 7, 0, Math.PI * 2);
      ctx.fill();

      // Anemometer Discs (Top rotating assembly)
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -75);
      ctx.lineTo(0, -100);
      ctx.stroke();

      const aneOffset = Math.sin(state.time * 0.15) * 8;
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-10 + aneOffset, -102, 20, 3);
      ctx.beginPath();
      ctx.arc(-10 + aneOffset, -101, 3, 0, Math.PI * 2);
      ctx.arc(10 + aneOffset, -101, 3, 0, Math.PI * 2);
      ctx.fill();

      // Navigation Strobe Light (Flashes amber)
      const strobeOn = Math.floor(state.time * 0.08) % 2 === 0;
      ctx.fillStyle = strobeOn ? '#f59e0b' : '#78350f';
      ctx.beginPath();
      ctx.arc(-8, -80, 3.5, 0, Math.PI * 2);
      ctx.fill();
      if (strobeOn) {{
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
      }}

      ctx.restore();

      // 5. Draw Foreground Water Foam & Wave Crest Line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, getWaveY(0, state.time));
      for (let x = 0; x <= width; x += 4) {{
        ctx.lineTo(x, getWaveY(x, state.time));
      }}
      ctx.stroke();

      // Wave Foam Patches on Crests
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let x = 20; x < width; x += 70) {{
        const wy = getWaveY(x, state.time);
        if (wy < waterLineBase - params.amp1 * 0.4) {{
          ctx.beginPath();
          ctx.ellipse(x, wy + 2, 14, 3, 0, 0, Math.PI * 2);
          ctx.fill();
        }}
      }}

      // Drift Snow & Sea Spray Particles
      ctx.fillStyle = '#ffffff';
      particles.forEach(p => {{
        p.x += p.speedX * state.simSpeed;
        p.y += p.speedY * state.simSpeed;
        if (p.x < 0) p.x = width;
        if (p.y > height) p.y = 0;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }});
      ctx.globalAlpha = 1.0;
    }}

    /* -------------------------------------------------------------------------
       VIEW 2: SUB-SURFACE KEEL VIEW (Abyss Perspective & ADCP Sonar Strata)
       ------------------------------------------------------------------------- */
    function renderKeelView(width, height) {{
      // Dark deep oceanic abyss background
      const abyssGrad = ctx.createLinearGradient(0, 0, 0, height);
      abyssGrad.addColorStop(0, '#031738');
      abyssGrad.addColorStop(0.4, '#040d1f');
      abyssGrad.addColorStop(1, '#01050e');
      ctx.fillStyle = abyssGrad;
      ctx.fillRect(0, 0, width, height);

      // Depth Strata Grid Lines (0m to -100m)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';

      for (let d = 1; d <= 5; d++) {{
        const dy = (height / 6) * d;
        ctx.beginPath();
        ctx.moveTo(40, dy);
        ctx.lineTo(width - 40, dy);
        ctx.stroke();
        ctx.fillText(`-${{d * 20}}m STRATA`, 50, dy - 5);
      }}

      // Underwater Keel Model Centered at Top
      const keelX = width * 0.5;
      const keelY = 70;

      // ADCP 4-Beam Acoustic Doppler Cones radiating down
      const beamSweep = Math.sin(state.time * 0.04) * 0.08;
      const beams = [
        {{ angle: Math.PI * 0.5 - 0.35 + beamSweep, label: 'BEAM 1 (NORTH)' }},
        {{ angle: Math.PI * 0.5 - 0.12 - beamSweep, label: 'BEAM 2 (EAST)' }},
        {{ angle: Math.PI * 0.5 + 0.12 + beamSweep, label: 'BEAM 3 (SOUTH)' }},
        {{ angle: Math.PI * 0.5 + 0.35 - beamSweep, label: 'BEAM 4 (WEST)' }}
      ];

      beams.forEach((b, idx) => {{
        ctx.save();
        const beamGrad = ctx.createRadialGradient(keelX, keelY + 120, 20, keelX, keelY + 120, height * 0.85);
        beamGrad.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
        beamGrad.addColorStop(0.5, 'rgba(0, 242, 254, 0.12)');
        beamGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(keelX, keelY + 120);
        const len = height * 0.88;
        const spread = 0.08;
        ctx.lineTo(keelX + Math.cos(b.angle - spread) * len, keelY + 120 + Math.sin(b.angle - spread) * len);
        ctx.lineTo(keelX + Math.cos(b.angle + spread) * len, keelY + 120 + Math.sin(b.angle + spread) * len);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }});

      // Draw Titanium Canister & Keel Assembly
      ctx.save();
      ctx.translate(keelX, keelY);

      // Central Steel Spar
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.lineTo(0, 110);
      ctx.stroke();

      // Black Structural Truss Cage
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 5;
      ctx.strokeRect(-32, -30, 64, 140);
      ctx.beginPath();
      ctx.moveTo(-32, -30); ctx.lineTo(32, 110);
      ctx.moveTo(32, -30); ctx.lineTo(-32, 110);
      ctx.stroke();

      // Dual Titanium Canisters (White cylindrical sensor bodies)
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      // CTD Canister
      ctx.fillRect(-48, 10, 20, 70);
      ctx.strokeRect(-48, 10, 20, 70);
      // DO / pH Canister
      ctx.fillRect(28, 10, 20, 70);
      ctx.strokeRect(28, 10, 20, 70);

      // Sensor Active Status LED dots
      ctx.fillStyle = '#00f2fe';
      ctx.beginPath();
      ctx.arc(-38, 70, 3, 0, Math.PI * 2);
      ctx.arc(38, 70, 3, 0, Math.PI * 2);
      ctx.fill();

      // ADCP Transducer Head & Ballast Weight
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, 125, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.restore();

      // Marine Snow (Suspended particulate matter drifting)
      ctx.fillStyle = '#7dd3fc';
      particles.forEach(p => {{
        p.y -= p.speedY * 0.5 * state.simSpeed;
        p.x += (p.speedX + 0.3) * state.simSpeed;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        ctx.globalAlpha = p.alpha * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }});
      ctx.globalAlpha = 1.0;
    }}

    /* -------------------------------------------------------------------------
       VIEW 3: SATELLITE DOWNLINK RADAR VIEW (Orbital Track & Pass Burst)
       ------------------------------------------------------------------------- */
    function renderSatelliteView(width, height) {{
      // Deep space / polar radar dark screen
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;

      // Polar Stereographic Concentric Rings (60°S, 70°S, 80°S)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.lineWidth = 1;
      for (let r = 60; r <= 240; r += 60) {{
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }}

      // Radar Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - 260, cy); ctx.lineTo(cx + 260, cy);
      ctx.moveTo(cx, cy - 260); ctx.lineTo(cx, cy + 260);
      ctx.stroke();

      // Rotating Radar Sweep Beam
      const radarAngle = (state.time * 0.02) % (Math.PI * 2);
      const sweepGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 260);
      sweepGrad.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
      sweepGrad.addColorStop(1, 'transparent');

      ctx.save();
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 260, radarAngle, radarAngle + 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Coastline of Antarctica Outline (Simplified polar vector)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + 80, cy - 30);
      ctx.lineTo(cx + 140, cy + 40);
      ctx.lineTo(cx + 90, cy + 120);
      ctx.lineTo(cx - 20, cy + 140);
      ctx.lineTo(cx - 110, cy + 70);
      ctx.lineTo(cx - 80, cy - 40);
      ctx.lineTo(cx - 30, cy - 70);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fill();

      // OceanX Deployment Position (Drake Passage / King George Island)
      const buoyTargetX = cx - 45;
      const buoyTargetY = cy - 85;

      // Ping marker
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(buoyTargetX, buoyTargetY, 5, 0, Math.PI * 2);
      ctx.fill();

      const pingSize = (state.time * 1.5) % 40;
      ctx.strokeStyle = `rgba(251, 191, 36, ${{1 - pingSize / 40}})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(buoyTargetX, buoyTargetY, pingSize, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText('OCEANX #26065', buoyTargetX + 10, buoyTargetY - 8);
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText("62°12'S, 58°58'W", buoyTargetX + 10, buoyTargetY + 5);

      // Iridium NEXT Orbital Track
      const satT = (state.time * 0.008) % 1;
      const satStartX = cx - 220;
      const satStartY = cy + 200;
      const satEndX = cx + 220;
      const satEndY = cy - 200;
      
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(satStartX, satStartY);
      ctx.lineTo(satEndX, satEndY);
      ctx.stroke();
      ctx.setLineDash([]);

      const satCurrentX = satStartX + (satEndX - satStartX) * satT;
      const satCurrentY = satStartY + (satEndY - satStartY) * satT;

      // Draw Satellite Icon
      ctx.fillStyle = '#00f2fe';
      ctx.beginPath();
      ctx.arc(satCurrentX, satCurrentY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(satCurrentX - 14, satCurrentY - 3, 28, 6);

      ctx.fillStyle = '#00f2fe';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText('IRIDIUM-NEXT-142', satCurrentX + 12, satCurrentY - 8);

      // Uplink Beam if Satellite is close
      const dist = Math.hypot(satCurrentX - buoyTargetX, satCurrentY - buoyTargetY);
      if (dist < 180) {{
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(buoyTargetX, buoyTargetY);
        ctx.lineTo(satCurrentX, satCurrentY);
        ctx.stroke();

        // Data bit packet particles
        const packetT = (state.time * 0.05) % 1;
        const px = buoyTargetX + (satCurrentX - buoyTargetX) * packetT;
        const py = buoyTargetY + (satCurrentY - buoyTargetY) * packetT;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }}
    }}

    /* -------------------------------------------------------------------------
       REAL-TIME DEPTH THERMOCLINE GRAPH (Mini HUD Canvas)
       ------------------------------------------------------------------------- */
    const thermCanvas = document.getElementById('thermoclineCanvas');
    const thermCtx = thermCanvas.getContext('2d');

    function updateThermoclineProfile() {{
      const w = thermCanvas.width;
      const h = thermCanvas.height;
      thermCtx.clearRect(0, 0, w, h);

      // Draw grid
      thermCtx.strokeStyle = '#0f274c';
      thermCtx.lineWidth = 1;
      thermCtx.beginPath();
      for (let y = 20; y < h; y += 25) {{
        thermCtx.moveTo(0, y); thermCtx.lineTo(w, y);
      }}
      for (let x = 40; x < w; x += 50) {{
        thermCtx.moveTo(x, 0); thermCtx.lineTo(x, h);
      }}
      thermCtx.stroke();

      // Temperature curve: maps current surface temp down to deep cold Antarctic bottom water
      const surfT = state.sensors.temperature;
      const deepT = 1.4; // Typical warm deep water layer in Southern Ocean

      document.getElementById('thermoclineSurfTemp').innerText = (surfT >= 0 ? '+' : '') + surfT.toFixed(1) + '°C';
      document.getElementById('thermoclineDeepTemp').innerText = '+' + deepT.toFixed(1) + '°C';

      // Graph curve: X is Temp (-3°C to +4°C), Y is Depth (0m to 100m)
      function tempToX(t) {{
        return ((t + 3) / 7) * w;
      }}

      thermCtx.strokeStyle = '#00f2fe';
      thermCtx.lineWidth = 2.5;
      thermCtx.beginPath();
      for (let y = 0; y <= h; y += 4) {{
        const depthRatio = y / h;
        // Inverted polar thermocline: cold surface melt layer, warming slightly at depth
        const tempAtDepth = surfT + (deepT - surfT) * Math.sin(depthRatio * Math.PI * 0.5);
        const x = tempToX(tempAtDepth);
        if (y === 0) thermCtx.moveTo(x, y);
        else thermCtx.lineTo(x, y);
      }}
      thermCtx.stroke();
    }}

    /* =========================================================================
       4. INTERACTIVE SENSOR SANDBOX & EDGE AI LOGIC
       ========================================================================= */
    function onSensorChange() {{
      state.sensors.temperature = parseFloat(document.getElementById('sliderTemp').value);
      state.sensors.salinity = parseFloat(document.getElementById('sliderSal').value);
      state.sensors.dissolvedO2 = parseFloat(document.getElementById('sliderDo').value);

      document.getElementById('valTempDisplay').innerText = state.sensors.temperature.toFixed(2);
      document.getElementById('valSalDisplay').innerText = state.sensors.salinity.toFixed(2);
      document.getElementById('valDoDisplay').innerText = state.sensors.dissolvedO2.toFixed(2);

      // 1. Calculate Seawater Density sigma_t (UNESCO EOS-80 approximation)
      // rho(S,T) approx 1000 + 0.8 * S - 0.2 * T
      const T = state.sensors.temperature;
      const S = state.sensors.salinity;
      const density = 1000 + (0.802 * S) - (0.059 * T * T) + (0.016 * T);
      document.getElementById('calcDensity').innerText = density.toFixed(2);

      // 2. Calculate Speed of Sound (UNESCO formula)
      // c approx 1449.2 + 4.6T - 0.055T^2 + 1.34(S - 35) + 0.016*Depth(10m)
      const soundSpeed = 1449.2 + (4.6 * T) - (0.055 * T * T) + (1.34 * (S - 35)) + 0.16;
      document.getElementById('calcSoundSpeed').innerText = soundSpeed.toFixed(1);

      // 3. Multi-variate Anomaly Score Engine
      // Baseline: T = -1.2, S = 34.2, DO = 9.4
      const zTemp = Math.abs(T - (-1.2)) / 2.2;
      const zSal = Math.abs(S - 34.2) / 1.4;
      const zDo = Math.abs(9.4 - state.sensors.dissolvedO2) / 2.0;

      const compositeScore = Math.min(1.0, (zTemp * 0.35 + zSal * 0.35 + zDo * 0.30) / 2.2);
      state.ai.anomalyScore = compositeScore;

      // Update UI Anomaly Gauge
      const scorePct = (compositeScore * 100).toFixed(1);
      document.getElementById('aiAnomalyScoreText').innerText = scorePct + '% ' + (compositeScore > 0.65 ? '(ANOMALY TRIGGERED)' : '(NOMINAL)');
      document.getElementById('aiAnomalyBar').style.width = scorePct + '%';

      // 4. Adaptive Sampling Decision Escalation
      const isAnomaly = compositeScore > 0.65;
      const governorCard = document.getElementById('aiGovernorCard');
      const badge = document.getElementById('aiModeBadge');
      const navRate = document.getElementById('navSamplingRate');
      const decisionText = document.getElementById('aiDecisionText');
      const powerDraw = document.getElementById('aiPowerDraw');

      if (isAnomaly && !state.ai.isBurst) {{
        // ESCALATE TO 5s BURST MODE
        state.ai.isBurst = true;
        state.ai.mode = 'BURST_5S';
        state.ai.samplingIntervalSec = 5;

        governorCard.classList.remove('border-emerald-500/60');
        governorCard.classList.add('border-maritime-amber', 'glow-amber');

        badge.innerText = '⚡ 5s BURST MODE (ESCALATED)';
        badge.className = 'px-2.5 py-1 rounded bg-maritime-amber text-abyss-950 font-mono text-xs font-bold shadow-lg animate-pulse';

        navRate.innerText = '5s (BURST)';
        navRate.className = 'text-maritime-yellow font-bold animate-pulse';

        powerDraw.innerText = '14.8 Watts (Full Compute)';
        powerDraw.className = 'text-maritime-yellow font-bold';

        decisionText.innerHTML = `
          <strong class="text-maritime-yellow">⚠️ AUTONOMOUS EDGE AI INTERVENTION:</strong><br>
          Multi-variate anomaly threshold breached ($z_{{score}} > 0.65$). The Raspberry Pi 5 has overridden sleep routines, escalating transducer polling from 60s to <strong class="text-white">5-second high-density burst sampling</strong> to capture dynamic thermohaline mixing.
        `;

        logTerminal(`[RPI5:EDGE_AI] ANOMALY DETECTED! Z-Score: ${{compositeScore.toFixed(3)}}. Escalating sampling to 5s BURST MODE.`, 'amber');
        logTerminal(`[COMM:TELEMETRY] High-priority event packet queued for expedited Iridium SBD transmission.`, 'cyan');
        playSatelliteChirp();

      }} else if (!isAnomaly && state.ai.isBurst) {{
        // RETURN TO 60s IDLE SLEEP MODE
        state.ai.isBurst = false;
        state.ai.mode = 'IDLE_60S';
        state.ai.samplingIntervalSec = 60;

        governorCard.classList.remove('border-maritime-amber', 'glow-amber');
        governorCard.classList.add('border-emerald-500/60');

        badge.innerText = '60s SLEEP / IDLE MODE';
        badge.className = 'px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-xs font-bold';

        navRate.innerText = '60s (IDLE)';
        navRate.className = 'text-emerald-400 font-bold';

        powerDraw.innerText = '1.2 Watts';
        powerDraw.className = 'text-emerald-400';

        decisionText.innerText = 'Current sensor readings match Drake Passage climatological baseline. ESP32-S3 maintains 60-second polling interval to conserve LiFePO4 battery power.';

        logTerminal(`[RPI5:EDGE_AI] Ocean state normalized. De-escalating back to 60s power-saving mode.`, 'emerald');
      }}

      // Refresh HUD thermocline
      updateThermoclineProfile();
    }}

    /* -------------------------------------------------------------------------
       PRESET SCENARIOS
       ------------------------------------------------------------------------- */
    function applyPreset(name) {{
      if (name === 'baseline') {{
        setSliders(-1.2, 34.2, 9.4);
        logTerminal('[SIM:SCENARIO] Applied Baseline Polar Oceanographic State.', 'cyan');
      }} else if (name === 'meltwater') {{
        setSliders(0.8, 28.6, 11.2);
        logTerminal('[SIM:SCENARIO] Simulating Glacial Meltwater Influx (Low Salinity pulse).', 'amber');
      }} else if (name === 'upwelling') {{
        setSliders(2.4, 35.8, 2.8);
        logTerminal('[SIM:SCENARIO] Simulating Deep Benthic Upwelling (Hypoxic warm salinity intrusion).', 'amber');
      }} else if (name === 'brine') {{
        setSliders(-2.4, 37.4, 8.2);
        logTerminal('[SIM:SCENARIO] Simulating Sea-Ice Brine Rejection (Supercooled high-density brine).', 'amber');
      }}
    }}

    function setSliders(t, s, d) {{
      document.getElementById('sliderTemp').value = t;
      document.getElementById('sliderSal').value = s;
      document.getElementById('sliderDo').value = d;
      onSensorChange();
    }}

    /* -------------------------------------------------------------------------
       STREAMING FIRMWARE TERMINAL LOGS
       ------------------------------------------------------------------------- */
    function logTerminal(msg, color = 'slate') {{
      const term = document.getElementById('terminalLogs');
      const line = document.createElement('div');
      const timeStr = new Date().toISOString().substring(11, 23);
      
      let colorClass = 'text-slate-400';
      if (color === 'amber') colorClass = 'text-maritime-yellow font-semibold';
      else if (color === 'emerald') colorClass = 'text-emerald-400';
      else if (color === 'cyan') colorClass = 'text-polar-cyan';

      line.className = colorClass;
      line.innerText = `[${{timeStr}}] ${{msg}}`;
      term.appendChild(line);
      term.scrollTop = term.scrollHeight;
    }}

    function clearTerminalLogs() {{
      document.getElementById('terminalLogs').innerHTML = '<div class="text-slate-600">// Terminal log buffer cleared.</div>';
    }}

    /* =========================================================================
       5. TELEMETRY CSV EXPORT GENERATOR
       ========================================================================= */
    function downloadSyntheticTelemetryCsv() {{
      const headers = ['Timestamp_UTC', 'Latitude', 'Longitude', 'Temp_C', 'Salinity_PSU', 'Dissolved_O2_mgL', 'Seawater_Density_kg_m3', 'Sound_Speed_m_s', 'Anomaly_Score', 'Sampling_Mode', 'Battery_SOC_Pct', 'Watchdog_Status'];
      const rows = [];

      const now = new Date();
      for (let i = 20; i >= 0; i--) {{
        const rowTime = new Date(now.getTime() - i * 60000).toISOString();
        const t = (state.sensors.temperature + (Math.random() * 0.1 - 0.05)).toFixed(2);
        const s = (state.sensors.salinity + (Math.random() * 0.08 - 0.04)).toFixed(2);
        const do2 = (state.sensors.dissolvedO2 + (Math.random() * 0.1 - 0.05)).toFixed(2);
        const den = document.getElementById('calcDensity').innerText;
        const spd = document.getElementById('calcSoundSpeed').innerText;
        const anom = (state.ai.anomalyScore + (Math.random() * 0.02 - 0.01)).toFixed(3);
        const mode = state.ai.mode;

        rows.push([
          rowTime,
          "-62.21227",
          "-58.97725",
          t, s, do2, den, spd, anom, mode, "94.2", "HEALTHY"
        ].join(','));
      }}

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join(String.fromCharCode(10));
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'oceanx_polar_telemetry_' + new Date().toISOString().substring(0, 10) + '.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      logTerminal('[EXPORT] Telemetry dataset CSV downloaded successfully.', 'emerald');
    }}

    /* =========================================================================
       6. UI CONTROLS & EVENT HANDLERS
       ========================================================================= */
    function setCameraView(view) {{
      state.cameraView = view;
      ['camViewSurface', 'camViewKeel', 'camViewSat'].forEach(id => {{
        document.getElementById(id).className = 'px-3 py-1.5 rounded-lg bg-abyss-800 text-slate-300 hover:text-white border border-abyss-700 transition-all flex items-center gap-1.5';
      }});

      const labelMap = {{
        surface: 'CAM 01: SURFACE DECK WIDE-ANGLE',
        keel: 'CAM 02: SUB-SURFACE KEEL & ADCP ABYSS',
        satellite: 'RADAR 03: ORBITAL TELEMETRY DOWNLINK'
      }};
      document.getElementById('camViewLabel').innerText = labelMap[view];

      if (view === 'surface') {{
        document.getElementById('camViewSurface').className = 'px-3 py-1.5 rounded-lg bg-maritime-amber text-abyss-950 font-bold transition-all flex items-center gap-1.5 shadow';
      }} else if (view === 'keel') {{
        document.getElementById('camViewKeel').className = 'px-3 py-1.5 rounded-lg bg-polar-cyan text-abyss-950 font-bold transition-all flex items-center gap-1.5 shadow';
      }} else if (view === 'satellite') {{
        document.getElementById('camViewSat').className = 'px-3 py-1.5 rounded-lg bg-purple-400 text-abyss-950 font-bold transition-all flex items-center gap-1.5 shadow';
      }}
      logTerminal(`[CAMERA] Switched to ${{view.toUpperCase()}} view mode.`, 'cyan');
    }}

    function setSeaState(st) {{
      state.seaState = st;
      ['btnSeaCalm', 'btnSeaMod', 'btnSeaGale'].forEach(id => {{
        document.getElementById(id).className = 'px-3 py-1 rounded-lg text-slate-300 hover:text-white transition-all';
      }});

      if (st === 'calm') {{
        document.getElementById('btnSeaCalm').className = 'px-3 py-1 rounded-lg bg-emerald-400 text-abyss-950 font-bold transition-all shadow-md';
      }} else if (st === 'moderate') {{
        document.getElementById('btnSeaMod').className = 'px-3 py-1 rounded-lg bg-polar-cyan text-abyss-950 font-bold transition-all shadow-md';
      }} else if (st === 'gale') {{
        document.getElementById('btnSeaGale').className = 'px-3 py-1 rounded-lg bg-rose-500 text-white font-bold transition-all shadow-md animate-pulse';
      }}

      const p = state.waveParams[st];
      document.getElementById('hudWaveHeight').innerText = p.heightLabel;
      document.getElementById('hudWavePeriod').innerText = p.periodLabel;
      document.getElementById('hudCurrentSpeed').innerText = p.driftLabel;

      logTerminal(`[WEATHER] Sea state set to ${{st.toUpperCase()}} (Hs: ${{p.heightLabel}}).`, 'cyan');
    }}

    function setSimSpeed(spd) {{
      state.simSpeed = spd;
      ['spd1x', 'spd2x', 'spd4x'].forEach(id => {{
        document.getElementById(id).className = 'px-2.5 py-1 rounded bg-abyss-800 text-slate-300 hover:text-white border border-abyss-700';
      }});
      document.getElementById('spd' + spd + 'x').className = 'px-2.5 py-1 rounded bg-maritime-amber text-abyss-950 font-bold';
    }}

    function toggleSimPause() {{
      state.isPaused = !state.isPaused;
      document.getElementById('btnPlayPause').innerHTML = state.isPaused
        ? '<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>'
        : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    }}

    function updateMetHeader() {{
      const d = Math.floor(state.metSeconds / 86400);
      const h = Math.floor((state.metSeconds % 86400) / 3600);
      const m = Math.floor((state.metSeconds % 3600) / 60);
      const s = Math.floor(state.metSeconds % 60);
      const str = `${{d}}d ${{h.toString().padStart(2, '0')}}h ${{m.toString().padStart(2, '0')}}m ${{s.toString().padStart(2, '0')}}s`;
      document.getElementById('headerMet').innerText = str;

      const f = Math.floor((state.metSeconds * 30) % 30);
      document.getElementById('hudTimecode').innerText = `${{h.toString().padStart(2, '0')}}:${{m.toString().padStart(2, '0')}}:${{s.toString().padStart(2, '0')}}:${{f.toString().padStart(2, '0')}}`;
    }}

    /* -------------------------------------------------------------------------
       HOTSPOT ANATOMY FOCUS & HIGHLIGHTING
       ------------------------------------------------------------------------- */
    function focusHotspot(name) {{
      const cards = ['mast', 'solar', 'buoyancy', 'keel'];
      cards.forEach(c => {{
        const el = document.getElementById('card-' + c);
        if (c === name) {{
          el.classList.add('ring-2', 'ring-maritime-amber', 'bg-abyss-900');
          el.scrollIntoView({{ behavior: 'smooth', block: 'nearest' }});
        }} else {{
          el.classList.remove('ring-2', 'ring-maritime-amber', 'bg-abyss-900');
        }}
      }});
      playSatelliteChirp();
    }}

    function setHotspotTab(tab) {{
      focusHotspot('mast');
    }}

    /* -------------------------------------------------------------------------
       6-STEP LOOP INTERACTIVE WALKTHROUGH
       ------------------------------------------------------------------------- */
    let currentLoopStep = 1;
    const loopSteps = [
      {{
        num: 1,
        title: "STEP 1: SENSE — PHYSICAL TRANSDUCER ACQUISITION",
        sub: "Execution Time: < 42ms • ESP32-S3 Core 0",
        desc: "Submerged transducers are sequentially powered via low-RDS(on) P-channel MOSFETs. The 24-bit Delta-Sigma ADC takes 128 oversampled readings per channel, calculating RMS and removing electrical noise prior to DMA buffer packaging.",
        code: "ESP32_ADC_POLL(CH_TEMP, CH_SAL, CH_DO, CH_PH, CH_PRESSURE); // DMA Buffer Ready"
      }},
      {{
        num: 2,
        title: "STEP 2: VALIDATE — HARDWARE FAULT & BOUNDARY TESTING",
        sub: "Execution Time: < 12ms • Kalman Filter",
        desc: "Values are checked against thermodynamic limits (-2.5°C to 35°C, 0 to 45 PSU). Statistical checks isolate sensor hardware failure (frozen ADC rail or open-circuit) from authentic oceanographic events.",
        code: "if (!Kalman_Check(reading) || Is_ADC_Stuck(reading)) {{ Raise_Hardware_Fault(); }}"
      }},
      {{
        num: 3,
        title: "STEP 3: ANALYZE — EDGE AI ANOMALY DETECTION",
        sub: "Execution Time: < 85ms • Raspberry Pi 5 PyTorch",
        desc: "A lightweight multivariate autoencoder calculates reconstruction error against historical Antarctic baseline manifolds. Z-scores across temperature, salinity, and DO determine environmental anomaly probability.",
        code: "float anomaly_score = EdgeAI_Model.forward(sensor_tensor); // Z-Score Computed"
      }},
      {{
        num: 4,
        title: "STEP 4: ADAPT — DYNAMIC SAMPLING ESCALATION",
        sub: "Execution Time: < 5ms • Sampling Governor",
        desc: "If the anomaly score surpasses 0.65 (e.g. glacial meltwater pulse or benthic upwelling), sampling rate escalates from 60s idle to 5s burst mode. If battery SoC drops below 20%, low-power 120s eco-mode engages.",
        code: "Governor_Set_Interval(anomaly_score > 0.65 ? BURST_5S : IDLE_60S);"
      }},
      {{
        num: 5,
        title: "STEP 5: TRANSMIT — COMPRESSED CBOR DISPATCH",
        sub: "Execution Time: < 120ms • Iridium SBD & LoRa",
        desc: "Telemetry packets are serialized with CBOR delta compression, cryptographically signed with HMAC-SHA256, and passed to the LoRa SX1262 gateway or queued for the next Iridium satellite pass.",
        code: "Dispatcher_Queue(CBOR_Encode(payload), PRIORITY_HIGH); // SBD Window Trigger"
      }},
      {{
        num: 6,
        title: "STEP 6: VISUALIZE — RESEARCH FLEET INGEST",
        sub: "Execution Time: Real-Time Web API",
        desc: "Polar research stations and global climate models ingest verified data into oceanographic digital twins for long-term Southern Ocean climate forecasting and maritime warning networks.",
        code: "DigitalTwin_Sync(buoy_uuid, telemetry_stream); // Dashboard Active"
      }}
    ];

    function selectLoopStep(stepNum) {{
      currentLoopStep = stepNum;
      for (let i = 1; i <= 6; i++) {{
        const card = document.getElementById('stepCard' + i);
        if (i === stepNum) {{
          card.className = 'p-4 rounded-xl bg-abyss-900 border-2 border-maritime-amber text-left cursor-pointer transition-all scale-105 shadow-xl';
        }} else {{
          card.className = 'p-4 rounded-xl bg-abyss-900/60 border border-abyss-700 text-left cursor-pointer transition-all hover:scale-105';
        }}
      }}
      const data = loopSteps[stepNum - 1];
      document.getElementById('loopStepTitle').innerText = '▶ ' + data.title;
      document.getElementById('loopStepSub').innerText = data.sub;
      document.getElementById('loopStepDesc').innerText = data.desc;
      document.getElementById('loopStepCode').innerText = data.code;
    }}

    function advanceLoopStep() {{
      currentLoopStep = (currentLoopStep % 6) + 1;
      selectLoopStep(currentLoopStep);
    }}

    function toggleSihModal(show) {{
      const m = document.getElementById('sihModal');
      m.style.display = show ? 'flex' : 'none';
    }}

    // Initialization
    window.addEventListener('load', () => {{
      onSensorChange();
      renderSim();
      updateThermoclineProfile();
      logTerminal('[SYSTEM] OceanX Digital Twin Application Initialized Successfully.', 'emerald');
    }});
  </script>
</body>
</html>
'''

    output_path = os.path.join(base_dir, "oceanx_single_page.html")
    with open(output_path, "w") as f:
        f.write(html_content)
    
    # Also write to index.html for instant root preview
    index_path = os.path.join(base_dir, "index.html")
    with open(index_path, "w") as f:
        f.write(html_content)

    print(f"Generated successfully: {output_path} ({os.path.getsize(output_path)} bytes)")

if __name__ == "__main__":
    main()
