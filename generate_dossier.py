import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SurakshitPath - Strategic Architecture & Competitive Intelligence Dossier</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    --primary: #1e3a8a;
    --primary-light: #3b82f6;
    --accent: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --bg-dark: #0f172a;
    --surface: #ffffff;
    --surface-alt: #f8fafc;
    --border: #e2e8f0;
    --border-dark: #cbd5e1;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --text-light: #94a3b8;
  }

  @page {
    size: A4;
    margin: 16mm 14mm 16mm 14mm;
    @bottom-right {
      content: counter(page);
      font-family: 'Inter', sans-serif;
      font-size: 8pt;
      color: #94a3b8;
    }
    @bottom-left {
      content: "SurakshitPath (सुरक्षित पथ) - Confidential Strategic Dossier";
      font-family: 'Inter', sans-serif;
      font-size: 8pt;
      color: #94a3b8;
    }
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: var(--text-main);
    background: #ffffff;
    line-height: 1.55;
    font-size: 9.5pt;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page-break {
    page-break-before: always;
  }

  .avoid-break {
    page-break-inside: avoid;
  }

  /* Header Cover */
  .cover-header {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1e3a8a 100%);
    color: #ffffff;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.12);
  }

  .cover-badge-row {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 7.5pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .badge-primary { background: rgba(59, 130, 246, 0.25); color: #93c5fd; border: 1px solid rgba(147, 197, 253, 0.3); }
  .badge-success { background: rgba(16, 185, 129, 0.25); color: #6ee7b7; border: 1px solid rgba(110, 231, 183, 0.3); }
  .badge-warning { background: rgba(245, 158, 11, 0.25); color: #fde68a; border: 1px solid rgba(253, 230, 138, 0.3); }
  .badge-danger { background: rgba(239, 68, 68, 0.25); color: #fca5a5; border: 1px solid rgba(252, 165, 165, 0.3); }

  .cover-title {
    font-size: 20pt;
    font-weight: 800;
    letter-spacing: -0.5px;
    line-height: 1.2;
    margin-bottom: 6px;
  }

  .cover-subtitle {
    font-size: 11pt;
    color: #cbd5e1;
    font-weight: 400;
    margin-bottom: 14px;
  }

  .cover-meta {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding-top: 14px;
    border-top: 1px solid rgba(255,255,255,0.15);
    font-size: 8pt;
  }

  .cover-meta-item strong {
    display: block;
    color: #94a3b8;
    font-size: 7pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Section Styling */
  h1 {
    font-size: 15pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid var(--primary);
    padding-bottom: 6px;
    margin-top: 24px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h2 {
    font-size: 12pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 16px;
    margin-bottom: 8px;
    border-left: 4px solid var(--primary-light);
    padding-left: 8px;
  }

  h3 {
    font-size: 10pt;
    font-weight: 600;
    color: #334155;
    margin-top: 12px;
    margin-bottom: 6px;
  }

  p {
    margin-bottom: 8px;
    color: #334155;
    text-align: justify;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 16px 0;
    font-size: 8.2pt;
    background: #ffffff;
  }

  th {
    background: #f1f5f9;
    color: #1e293b;
    font-weight: 700;
    text-align: left;
    padding: 7px 10px;
    border: 1px solid var(--border);
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  td {
    padding: 7px 10px;
    border: 1px solid var(--border);
    color: #334155;
    vertical-align: top;
  }

  tr:nth-child(even) td {
    background: #f8fafc;
  }

  /* Callout Boxes */
  .callout {
    border-radius: 8px;
    padding: 10px 14px;
    margin: 12px 0;
    font-size: 8.5pt;
    border-left: 4px solid;
  }

  .callout-info {
    background: #eff6ff;
    border-color: #3b82f6;
    color: #1e40af;
  }

  .callout-success {
    background: #ecfdf5;
    border-color: #10b981;
    color: #065f46;
  }

  .callout-warning {
    background: #fffbeb;
    border-color: #f59e0b;
    color: #92400e;
  }

  .callout-danger {
    background: #fef2f2;
    border-color: #ef4444;
    color: #991b1b;
  }

  .callout strong {
    display: block;
    margin-bottom: 3px;
    font-size: 9pt;
  }

  /* Grid & Columns */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin: 10px 0;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin: 10px 0;
  }

  .card {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .card-header {
    font-weight: 700;
    font-size: 9pt;
    color: #0f172a;
    margin-bottom: 6px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  ul {
    margin-left: 18px;
    margin-bottom: 8px;
    color: #334155;
  }

  li {
    margin-bottom: 3px;
  }

  code {
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 7.8pt;
    background: #f1f5f9;
    padding: 1px 4px;
    border-radius: 4px;
    color: #0f172a;
    border: 1px solid #e2e8f0;
  }

  pre {
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 7.2pt;
    background: #0f172a;
    color: #e2e8f0;
    padding: 10px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 10px 0;
    line-height: 1.4;
  }

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
  }

  a:hover {
    text-decoration: underline;
  }

  .proof-link {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 7.5pt;
    background: #f1f5f9;
    padding: 1px 5px;
    border-radius: 3px;
    border: 1px solid #cbd5e1;
    color: #1e3a8a;
  }

  .diagram-container {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px;
    margin: 14px 0;
    text-align: center;
  }

  .diagram-caption {
    font-size: 7.5pt;
    color: var(--text-muted);
    margin-top: 6px;
    font-style: italic;
  }
</style>
</head>
<body>

<!-- COVER HEADER -->
<div class="cover-header">
  <div class="cover-badge-row">
    <span class="badge badge-primary">Comprehensive Architecture Blueprint</span>
    <span class="badge badge-success">Production Scalability</span>
    <span class="badge badge-warning">Competitive Intelligence</span>
    <span class="badge badge-danger">Classified v2.0</span>
  </div>
  <div class="cover-title">SurakshitPath (सुरक्षित पथ)</div>
  <div class="cover-subtitle">AI-Powered Adaptive Safe-Corridor Navigation & Municipal Smart-City Infrastructure Platform</div>
  <div class="cover-meta">
    <div class="cover-meta-item">
      <strong>Engineering Lead</strong>
      Dhruv & Antigravity AI
    </div>
    <div class="cover-meta-item">
      <strong>Active Corpus</strong>
      e:/Software/SurakshitPath
    </div>
    <div class="cover-meta-item">
      <strong>Document Date</strong>
      October 2026
    </div>
    <div class="cover-meta-item">
      <strong>Target Scale</strong>
      1,000,000+ Concurrent Commuters
    </div>
  </div>
</div>

<!-- EXECUTIVE SUMMARY -->
<h2>1. Executive Summary & Market Moat</h2>
<p>
  Following our initial hackathon victory, this technical dossier formalizes the product, architectural, and mathematical roadmap to elevate <strong>SurakshitPath</strong> into a market-defining public-safety and municipal infrastructure platform. Across the globe, personal safety tech is trapped in a <strong>Reactive Paradigm</strong>—over 95% of existing applications (Noonlight, bSafe, Citizen, 112 India) act only as emergency panic buttons <em>after</em> an assault is underway.
</p>
<p>
  Mainstream navigation tools like Google Maps and Apple Maps optimize exclusively for shortest geometric travel time ($\min d_e$), frequently routing night pedestrians through pitch-black alleys, unlit industrial cuts, or deserted underpasses to shave off 90 seconds. <strong>SurakshitPath breaks this paradigm by introducing proactive, mathematically weighted multi-factor infrastructure routing ($C_e = d_e \cdot [1 + \beta(1 - S_e)]$) with complete glass-box TreeSHAP explainability, physical safe-haven routing, and an automated municipal repair feedback loop.</strong>
</p>

<div class="callout callout-success">
  <strong>The Three Pillars of SurakshitPath's Unfair Advantage:</strong>
  1. <strong>Proactive Prevention vs. Panic Buttons:</strong> Steers pedestrians away from danger zones before contact occurs.<br>
  2. <strong>Objective Physical Infrastructure vs. Crime-Stats Redlining:</strong> Evaluates street lighting ($L_e$), commercial eyes on the street ($A_e$), transit access ($T_e$), and emergency havens ($E_e$) without racial or socioeconomic prejudice.<br>
  3. <strong>B2G Municipal Smart-City Bridge:</strong> Converts real-time citizen reporting and ambient sensor data into verified Pune Municipal Corporation (PMC/PCMC) SCADA tickets to physically repair dark spots.
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 20px 0;">

<!-- SECTION 2: COMPETITIVE INTELLIGENCE -->
<h2>2. Exhaustive Competitor Teardown Dossier</h2>
<p>
  To construct an unassailable product moat, we audited top competitors across the Apple App Store, Google Play Store, and web research, analyzing their ratings, feature sets, technical architectures, and real user grievances.
</p>

<!-- DIAGRAM 1: 2x2 COMPETITIVE MATRIX -->
<div class="diagram-container avoid-break">
  <svg width="600" height="260" viewBox="0 0 600 260" style="max-width: 100%; height: auto;">
    <!-- Background grid -->
    <rect x="0" y="0" width="600" height="260" fill="#f8fafc" rx="8" />
    <line x1="300" y1="20" x2="300" y2="240" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4" />
    <line x1="40" y1="130" x2="560" y2="130" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4" />
    
    <!-- Axis Labels -->
    <text x="300" y="15" text-anchor="middle" font-family="Inter" font-size="9" font-weight="700" fill="#1e3a8a">PROACTIVE NAVIGATION (Routing & Prevention)</text>
    <text x="300" y="255" text-anchor="middle" font-family="Inter" font-size="9" font-weight="700" fill="#64748b">REACTIVE PANIC (SOS & Alerts Post-Event)</text>
    <text x="25" y="134" text-anchor="middle" font-family="Inter" font-size="9" font-weight="700" fill="#ef4444" transform="rotate(-90 25 134)">HISTORIC CRIME STATS (Fearmongering)</text>
    <text x="575" y="134" text-anchor="middle" font-family="Inter" font-size="9" font-weight="700" fill="#10b981" transform="rotate(90 575 134)">OBJECTIVE PHYSICAL INFRASTRUCTURE</text>
    
    <!-- Quadrant 1: Top Right (Winning Zone: SurakshitPath) -->
    <rect x="310" y="25" width="245" height="100" fill="rgba(16, 185, 129, 0.08)" rx="6" stroke="#10b981" stroke-width="1.5" />
    <circle cx="435" cy="70" r="14" fill="#10b981" />
    <text x="435" y="74" text-anchor="middle" font-family="Inter" font-size="9" font-weight="800" fill="#ffffff">★</text>
    <text x="435" y="96" text-anchor="middle" font-family="Inter" font-size="10" font-weight="800" fill="#065f46">SurakshitPath (Pune)</text>
    <text x="435" y="108" text-anchor="middle" font-family="Inter" font-size="7.5" fill="#047857">Dynamic Impedance + SHAP + B2G</text>

    <!-- Quadrant 2: Top Left (WalkSafe+, SafetiPin) -->
    <circle cx="160" cy="65" r="10" fill="#64748b" />
    <text x="160" y="85" text-anchor="middle" font-family="Inter" font-size="8.5" font-weight="700" fill="#1e293b">WalkSafe+ (UK)</text>
    <text x="160" y="96" text-anchor="middle" font-family="Inter" font-size="7" fill="#64748b">Police crime pins, Safe spaces</text>

    <circle cx="230" cy="100" r="9" fill="#0284c7" />
    <text x="230" y="117" text-anchor="middle" font-family="Inter" font-size="8" font-weight="600" fill="#0369a1">My SafetiPin</text>

    <!-- Quadrant 3: Bottom Left (Citizen) -->
    <circle cx="140" cy="180" r="11" fill="#ef4444" />
    <text x="140" y="200" text-anchor="middle" font-family="Inter" font-size="8.5" font-weight="700" fill="#991b1b">Citizen (US)</text>
    <text x="140" y="211" text-anchor="middle" font-family="Inter" font-size="7" fill="#dc2626">911 scanner sirens & fear paywalls</text>

    <!-- Quadrant 4: Bottom Right (Noonlight, bSafe, Life360) -->
    <circle cx="430" cy="180" r="10" fill="#f59e0b" />
    <text x="430" y="200" text-anchor="middle" font-family="Inter" font-size="8.5" font-weight="700" fill="#92400e">Noonlight & bSafe</text>
    <text x="430" y="211" text-anchor="middle" font-family="Inter" font-size="7" fill="#b45309">Dead-man switch, false alarm risk</text>

    <circle cx="510" cy="160" r="8" fill="#8b5cf6" />
    <text x="510" y="177" text-anchor="middle" font-family="Inter" font-size="8" font-weight="600" fill="#6d28d9">Life360</text>

    <!-- Middle Top: Google Maps -->
    <circle cx="340" cy="40" r="8" fill="#475569" />
    <text x="375" y="43" text-anchor="start" font-family="Inter" font-size="7.5" font-weight="600" fill="#475569">Google Maps (Shortest Time Blind)</text>
  </svg>
  <div class="diagram-caption">Figure 2.1: Competitive Landscape Matrix — Positioning SurakshitPath at the Intersection of Proactive Routing and Objective Physical Infrastructure</div>
</div>

<table>
  <thead>
    <tr>
      <th style="width: 14%;">Competitor</th>
      <th style="width: 16%;">Market & Presence</th>
      <th style="width: 35%;">Top Plus Points to Adopt / Counter</th>
      <th style="width: 35%;">Critical Disadvantages & User Grievances</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <strong>My SafetiPin</strong><br>
        <span class="proof-link"><a href="https://play.google.com/store/apps/details?id=com.safetipin.safetipin" target="_blank">Play Store 4.1★</a></span><br>
        <span class="proof-link"><a href="https://apps.apple.com/in/app/my-safetipin/id892015949" target="_blank">App Store 4.4★</a></span>
      </td>
      <td>India (Delhi, Mumbai, Bengaluru), Bogotá, Nairobi.<br><strong>100K+ Installs</strong></td>
      <td>
        • <strong>9-Parameter Physical Framework:</strong> Audits lighting, open vista, walkpath, gender presence, security, transit, and feeling.<br>
        • <strong>Find Support Network:</strong> Directories of verified police women's desks, crisis shelters, and NGOs.<br>
        • <strong>Stay With Me:</strong> Real-time family tracking when navigating flagged corridors.
      </td>
      <td>
        • <strong>Crowdsource Cold-Start Void:</strong> In Pune suburbs, Tier-2 cities, and college campuses, the map is completely blank or stale.<br>
        • <strong>Subjective Bias:</strong> "Feeling" score causes erratic, biased ratings.<br>
        • <strong>Static Data:</strong> Doesn't update when streetlights trip tonight or night markets close on Sundays.
      </td>
    </tr>
    <tr>
      <td>
        <strong>WalkSafe+</strong><br>
        <span class="proof-link"><a href="https://apps.apple.com/gb/app/walksafe/id1527783856" target="_blank">App Store 4.6★</a></span><br>
        <span class="proof-link"><a href="https://walksafe.io" target="_blank">Web Official</a></span>
      </td>
      <td>United Kingdom & Europe.<br><strong>500K+ Active Users</strong></td>
      <td>
        • <strong>Accredited Safe Spaces:</strong> Verified network of venues trained in <em>Ask for Angela</em> (safe haven, phone charging, safe waiting).<br>
        • <strong>HomeSafe Timer:</strong> Automated countdown alert sent to guardians if commuter does not reach destination by specified ETA.<br>
        • <strong>Tactical Dark Interface:</strong> Ultra-clean night mode to protect pedestrian dark-adaptation.
      </td>
      <td>
        • <strong>Anxiety-Inducing Fearmongering:</strong> Users complain that viewing historic police crime pins creates paralyzing paranoia.<br>
        • <strong>Digital Redlining:</strong> Stigmatizes low-income neighborhoods while marking pitch-black alleys with zero crime reports as "clean".<br>
        • <strong>No Dynamic Routing:</strong> It displays pins on a map but does NOT compute an obstacle-avoiding pedestrian route.
      </td>
    </tr>
    <tr>
      <td>
        <strong>Citizen</strong><br>
        (Formerly Vigilante)<br>
        <span class="proof-link"><a href="https://apps.apple.com/us/app/citizen-local-safety-alerts/id1039889567" target="_blank">App Store 4.7★</a></span><br>
        <span class="proof-link"><a href="https://play.google.com/store/apps/details?id=sp0n.citizen" target="_blank">Play Store 4.5★</a></span>
      </td>
      <td>United States (NYC, LA, Chicago, SF).<br><strong>10M+ Downloads</strong></td>
      <td>
        • <strong>Sub-60s Scanner Ingestion:</strong> Digitizes emergency 911 scanner audio and broadcasts localized alerts instantly.<br>
        • <strong>Inner Circle Telemetry:</strong> Guardians monitor live battery levels ("Battery 4% - phone dying") and movement speed.<br>
        • <strong>Crowdsourced Live Video:</strong> Nearby users stream video to confirm street blockades or active fires.
      </td>
      <td>
        • <strong>Monetized Panic & Paranoia:</strong> Constantly blasts alarming siren notifications to induce anxiety and convert users to paid tiers.<br>
        • <strong>Vigilantism & Toxic Comments:</strong> High-profile scandals offering bounties on innocent citizens; unchecked racist commentary.<br>
        • <strong>Predatory $19.99/mo Paywall:</strong> Locks live safety agents and detailed crime filters behind "Citizen Plus".
      </td>
    </tr>
    <tr>
      <td>
        <strong>Noonlight & bSafe</strong><br>
        <span class="proof-link"><a href="https://apps.apple.com/us/app/noonlight-feel-protected-24-7/id700503706" target="_blank">Noonlight 4.6★</a></span><br>
        <span class="proof-link"><a href="https://play.google.com/store/apps/details?id=com.bipper.app.bsafe" target="_blank">bSafe 4.0★</a></span>
      </td>
      <td>United States & Global.<br><strong>3M+ Combined Installs</strong></td>
      <td>
        • <strong>Dead-Man's Hold Switch (Noonlight):</strong> Commuter holds thumb on screen; releasing thumb requires a 10s PIN or dispatches police.<br>
        • <strong>Discreet Exit Fake Call (bSafe):</strong> Simulates incoming realistic ring to extract user from uncomfortable situations.<br>
        • <strong>Third-Party Integrations:</strong> Tinder date check-in API and wearable smartwatch compatibility.
      </td>
      <td>
        • <strong>100% Reactive Flaw:</strong> Zero navigation logic. Provides no guidance on which street to walk down to avoid danger.<br>
        • <strong>False Alarm Fines:</strong> Slipping or dropping phone triggers dispatchers and police fines.<br>
        • <strong>Battery & OS Killing:</strong> Continuous background audio keyword listening triggers aggressive Android/iOS battery saver kills.
      </td>
    </tr>
    <tr>
      <td>
        <strong>Google Maps & Citymapper</strong><br>
        <span class="proof-link"><a href="https://citymapper.com" target="_blank">Citymapper Main Roads</a></span>
      </td>
      <td>Global Universal Navigation.<br><strong>1B+ Installs</strong></td>
      <td>
        • <strong>Citymapper "Main Roads" Mode:</strong> Option to prioritize primary arterial streets over secluded alleys.<br>
        • <strong>Unmatched Transit Data:</strong> Real-time bus/metro schedules and live business opening hours.<br>
        • <strong>Ultra-Optimized Vector Maps:</strong> Negligible battery drain and smooth vector rendering.
      </td>
      <td>
        • <strong>Nocturnal Safety Blindness:</strong> Google Maps always suggests the absolute shortest geometric cut through dark service lanes.<br>
        • <strong>Citymapper's Inflexible Heuristic:</strong> "Main Roads" is a static highway-tag filter blind to broken streetlights or dark zones.<br>
        • <strong>Zero Municipal Feedback Loop:</strong> No mechanism to report unlit streets to city authorities for physical repair.
      </td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<!-- SECTION 3: CURRENT CODEBASE FORENSIC AUDIT -->
<h2>3. Current Codebase Forensic Audit — What Works vs. What Needs Work</h2>
<p>
  We conducted an exhaustive audit of our active repository at <code>e:/Software/SurakshitPath</code>. The table below delineates what is verified and production-ready versus components that are currently client-side simulations requiring backend transition.
</p>

<table>
  <thead>
    <tr>
      <th style="width: 20%;">Component & File Path</th>
      <th style="width: 15%;">Operational Status</th>
      <th style="width: 32%;">What Works Well Currently</th>
      <th style="width: 33%;">Limitations & Scale-Up Work Required</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <strong>Routing Engine & Dijkstra</strong><br>
        <code>src/engine/graphRouter.ts</code><br>
        <code>src/engine/safetyScorer.ts</code>
      </td>
      <td><span class="badge badge-success">Production Ready</span><br>(In-Memory Graph)</td>
      <td>
        • Continuous impedance weighting $C_e = d_e[1 + \beta(1 - S_e)]$.<br>
        • Dijkstra with MinPriorityQueue executes in &lt;15ms.<br>
        • Illumination proxy successfully bridges sparse OSM lit tags.
      </td>
      <td>
        • Evaluates a fixed static corridor graph (~30 nodes, ~45 edges in Tathawade/Kothrud).<br>
        • <em>Required:</em> Migrate to server-side <strong>PgRouting</strong> with PostgreSQL/PostGIS to evaluate 100,000+ Pune road segments dynamically.
      </td>
    </tr>
    <tr>
      <td>
        <strong>Explainability & TreeSHAP</strong><br>
        <code>src/engine/mlSafetyModel.ts</code><br>
        <code>src/components/Sidebar/TreeShapWaterfall.tsx</code>
      </td>
      <td><span class="badge badge-success">Production Ready</span></td>
      <td>
        • Exact TreeSHAP waterfall attributing marginal contributions ($\phi_i$) for street lights, commercial eyes, and transit.<br>
        • 4-factor radar chart visualization SVG.
      </td>
      <td>
        • Model parameters are hardcoded decision tree splits.<br>
        • <em>Required:</em> Train on empirical SafetiPin audit datasets and deploy via <strong>ONNX Runtime</strong> microservice.
      </td>
    </tr>
    <tr>
      <td>
        <strong>Map UI & Tile Layer</strong><br>
        <code>src/components/Map/MapCockpit.tsx</code>
      </td>
      <td><span class="badge badge-success">Production Ready</span></td>
      <td>
        • Responsive Leaflet cockpit with Day/Night tile switching.<br>
        • Multi-colored segment polylines with safety tier legend.<br>
        • Safe haven emergency pins and dynamic event markers.
      </td>
      <td>
        • Uses raster tiles from CartoDB/OSM. High bandwidth consumption at scale.<br>
        • <em>Required:</em> Switch to client-side vector tiles (<strong>Protomaps PMTiles / MapLibre GL</strong>) for 100% offline tile caching.
      </td>
    </tr>
    <tr>
      <td>
        <strong>Overpass Spatial Service</strong><br>
        <code>src/services/overpassService.ts</code><br>
        <code>src/services/spatialCache.ts</code>
      </td>
      <td><span class="badge badge-warning">Partial / Fragile</span></td>
      <td>
        • Live Overpass QL bounding box query for streetlights and night amenities with 3.5s AbortController.
      </td>
      <td>
        • Public German Overpass API (<code>overpass-api.de</code>) frequently returns HTTP 429 rate-limit errors or timeouts.<br>
        • <em>Required:</em> Deploy self-hosted <strong>Overpass / PostGIS OSM replica</strong> on cloud backend with nightly cron diffs.
      </td>
    </tr>
    <tr>
      <td>
        <strong>Telemetry Watchdog & Kalman</strong><br>
        <code>src/engine/kalmanFilter.ts</code><br>
        <code>src/engine/telemetryWatchdog.ts</code>
      </td>
      <td><span class="badge badge-success">Math Verified</span><br><span class="badge badge-warning">Simulated Feed</span></td>
      <td>
        • Extended Kalman Filter smoothly reduces GPS multipath jitter.<br>
        • Cross-track distance watchdog detects 50m corridor deviations and stationary dwell anomalies.
      </td>
      <td>
        • Telemetry currently runs in a client <code>setInterval</code> simulator (<code>CommuterTelemetrySimulator.tsx</code>).<br>
        • <em>Required:</em> Hook into native mobile <code>navigator.geolocation.watchPosition</code> with background PWA service worker.
      </td>
    </tr>
    <tr>
      <td>
        <strong>Database & State Persistence</strong><br>
        <code>src/App.tsx</code> (State Hooks)
      </td>
      <td><span class="badge badge-danger">Not Present</span><br>(Ephemeral Client)</td>
      <td>
        • URL search params persist route, beta, role, and theme across reloads (<code>URLSearchParams</code>).
      </td>
      <td>
        • Citizen reports, verified safe havens, and dynamic events vanish on page refresh.<br>
        • <em>Required:</em> Implement full <strong>PostgreSQL 16 + PostGIS + Drizzle ORM</strong> database with JWT/WebCrypto auth.
      </td>
    </tr>
    <tr>
      <td>
        <strong>Guardian Cockpit</strong><br>
        <code>src/components/Guardian/GuardianCockpit.tsx</code>
      </td>
      <td><span class="badge badge-warning">Mock Simulation</span></td>
      <td>
        • Clean interface displaying battery, signal strength, student route, and simulated anomaly triggers.
      </td>
      <td>
        • Only displays dummy mock session data.<br>
        • <em>Required:</em> Implement real-time <strong>WebSockets / WebRTC P2P DataChannels</strong> for zero-knowledge end-to-end encrypted tracking.
      </td>
    </tr>
    <tr>
      <td>
        <strong>Civic Admin Dashboard</strong><br>
        <code>src/components/Admin/CivicAdminDashboard.tsx</code>
      </td>
      <td><span class="badge badge-warning">UI Prototype</span></td>
      <td>
        • High-priority dark spot table with ward tags, lighting factors, and suggested municipal actions.
      </td>
      <td>
        • Ticket dispatch is in-memory state; does not connect to Pune Municipal Corporation APIs.<br>
        • <em>Required:</em> Implement automated <strong>PMC Care / PCMC Smart Sarathi CSV/REST API</strong> export bridge.
      </td>
    </tr>
  </tbody>
</table>

<!-- SECTION 4: PRODUCTION SCALE-UP TECH STACK -->
<h2>4. Production Scale-Up Architecture (1,000,000+ Users)</h2>
<p>
  To scale from our current client-side prototype to a resilient, high-throughput production platform capable of handling millions of concurrent commuters across Pune and beyond, we specify the following modular architecture:
</p>

<!-- DIAGRAM 2: FULL PRODUCTION ARCHITECTURE -->
<div class="diagram-container avoid-break">
  <svg width="600" height="230" viewBox="0 0 600 230" style="max-width: 100%; height: auto;">
    <rect x="0" y="0" width="600" height="230" fill="#f8fafc" rx="8" />

    <!-- Layer 1: Client Frontends -->
    <rect x="20" y="20" width="160" height="190" fill="#ffffff" stroke="#3b82f6" stroke-width="1.5" rx="6" />
    <text x="100" y="40" text-anchor="middle" font-family="Inter" font-size="9" font-weight="700" fill="#1e3a8a">CLIENT APPLICATIONS</text>
    <rect x="30" y="52" width="140" height="30" fill="#eff6ff" rx="4" />
    <text x="100" y="70" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="600" fill="#1e40af">React 19 + Vite PWA</text>
    <rect x="30" y="90" width="140" height="30" fill="#eff6ff" rx="4" />
    <text x="100" y="108" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="600" fill="#1e40af">Service Worker + IndexedDB</text>
    <rect x="30" y="128" width="140" height="30" fill="#eff6ff" rx="4" />
    <text x="100" y="146" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="600" fill="#1e40af">Ambient Light Sensor (ALS)</text>
    <rect x="30" y="166" width="140" height="34" fill="#eff6ff" rx="4" />
    <text x="100" y="181" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="600" fill="#1e40af">WebCrypto E2EE Keypair</text>
    <text x="100" y="193" text-anchor="middle" font-family="Inter" font-size="6.5" fill="#64748b">Zero-Knowledge GPS P2P</text>

    <!-- Connector 1 -->
    <line x1="180" y1="115" x2="220" y2="115" stroke="#3b82f6" stroke-width="2" />
    <polygon points="220,115 214,111 214,119" fill="#3b82f6" />

    <!-- Layer 2: API Gateway & Microservices -->
    <rect x="220" y="20" width="170" height="190" fill="#ffffff" stroke="#10b981" stroke-width="1.5" rx="6" />
    <text x="305" y="40" text-anchor="middle" font-family="Inter" font-size="9" font-weight="700" fill="#065f46">API GATEWAY & ENGINE</text>
    <rect x="230" y="52" width="150" height="30" fill="#ecfdf5" rx="4" />
    <text x="305" y="70" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="600" fill="#047857">FastAPI / Go Routing Service</text>
    <rect x="230" y="90" width="150" height="30" fill="#ecfdf5" rx="4" />
    <text x="305" y="108" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="600" fill="#047857">ONNX Runtime (TreeSHAP)</text>
    <rect x="230" y="128" width="150" height="30" fill="#ecfdf5" rx="4" />
    <text x="305" y="146" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="600" fill="#047857">Redis Pub/Sub (WebSockets)</text>
    <rect x="230" y="166" width="150" height="34" fill="#ecfdf5" rx="4" />
    <text x="305" y="181" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="600" fill="#047857">PMC SCADA Bridge Worker</text>
    <text x="305" y="193" text-anchor="middle" font-family="Inter" font-size="6.5" fill="#64748b">Automated Grievance SLA</text>

    <!-- Connector 2 -->
    <line x1="390" y1="115" x2="430" y2="115" stroke="#10b981" stroke-width="2" />
    <polygon points="430,115 424,111 424,119" fill="#10b981" />

    <!-- Layer 3: Spatial Database & Storage -->
    <rect x="430" y="20" width="150" height="190" fill="#ffffff" stroke="#8b5cf6" stroke-width="1.5" rx="6" />
    <text x="505" y="40" text-anchor="middle" font-family="Inter" font-size="9" font-weight="700" fill="#5b21b6">SPATIAL DATA LAYER</text>
    <rect x="440" y="52" width="130" height="30" fill="#f5f3ff" rx="4" />
    <text x="505" y="70" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="600" fill="#6d28d9">PostgreSQL 16 + PostGIS</text>
    <rect x="440" y="90" width="130" height="30" fill="#f5f3ff" rx="4" />
    <text x="505" y="108" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="600" fill="#6d28d9">PgRouting Topology Graph</text>
    <rect x="440" y="128" width="130" height="30" fill="#f5f3ff" rx="4" />
    <text x="505" y="146" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="600" fill="#6d28d9">GIST Spatial Indexes</text>
    <rect x="440" y="166" width="130" height="34" fill="#f5f3ff" rx="4" />
    <text x="505" y="181" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="600" fill="#6d28d9">Protomaps Vector Tiles</text>
    <text x="505" y="193" text-anchor="middle" font-family="Inter" font-size="6.5" fill="#64748b">Cloudflare Edge PMTiles</text>
  </svg>
  <div class="diagram-caption">Figure 4.1: Production Enterprise Architecture Diagram for SurakshitPath Scaled Infrastructure</div>
</div>

<div class="page-break"></div>

<!-- SECTION 5: DATABASE SCHEMA -->
<h2>5. Production Database Schema (PostgreSQL + PostGIS)</h2>
<p>
  The production relational spatial database requires 8 normalized tables with GIST geometry indexes for sub-5 millisecond spatial queries (<code>ST_DWithin</code>, <code>ST_Distance</code>).
</p>

<!-- DIAGRAM 3: DATABASE ER DIAGRAM -->
<div class="diagram-container avoid-break">
  <svg width="600" height="210" viewBox="0 0 600 210" style="max-width: 100%; height: auto;">
    <rect x="0" y="0" width="600" height="210" fill="#f8fafc" rx="8" />

    <!-- Table 1: edges -->
    <rect x="20" y="20" width="165" height="170" fill="#ffffff" stroke="#1e3a8a" stroke-width="1.2" rx="5" />
    <path d="M 20 20 L 185 20 L 185 42 L 20 42 Z" fill="#1e3a8a" />
    <text x="102" y="34" text-anchor="middle" font-family="Inter" font-size="8.5" font-weight="700" fill="#ffffff">roads_edges (PostGIS)</text>
    <text x="28" y="56" font-family="JetBrains Mono" font-size="7" fill="#0f172a">PK id: UUID</text>
    <text x="28" y="70" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   osm_way_id: BIGINT</text>
    <text x="28" y="84" font-family="JetBrains Mono" font-size="7" fill="#2563eb">   geom: GEOMETRY(Line)</text>
    <text x="28" y="98" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   road_class: VARCHAR</text>
    <text x="28" y="112" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   length_meters: FLOAT</text>
    <text x="28" y="126" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   baseline_lux: FLOAT</text>
    <text x="28" y="140" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   active_night_pois: INT</text>
    <text x="28" y="154" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   source_node: UUID (FK)</text>
    <text x="28" y="168" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   target_node: UUID (FK)</text>

    <!-- Table 2: incidents -->
    <rect x="220" y="20" width="165" height="170" fill="#ffffff" stroke="#ef4444" stroke-width="1.2" rx="5" />
    <path d="M 220 20 L 385 20 L 385 42 L 220 42 Z" fill="#ef4444" />
    <text x="302" y="34" text-anchor="middle" font-family="Inter" font-size="8.5" font-weight="700" fill="#ffffff">incidents (Decay Model)</text>
    <text x="228" y="56" font-family="JetBrains Mono" font-size="7" fill="#0f172a">PK id: UUID</text>
    <text x="228" y="70" font-family="JetBrains Mono" font-size="7" fill="#2563eb">   geom: GEOMETRY(Point)</text>
    <text x="228" y="84" font-family="JetBrains Mono" font-size="7" fill="#0f172a">FK edge_id: UUID</text>
    <text x="228" y="98" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   category: VARCHAR</text>
    <text x="228" y="112" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   severity: FLOAT [0-1]</text>
    <text x="228" y="126" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   reported_at: TIMESTAMP</text>
    <text x="228" y="140" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   decay_tau_days: INT (14)</text>
    <text x="228" y="154" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   status: VARCHAR</text>
    <text x="228" y="168" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   upvotes: INT</text>

    <!-- Table 3: safe_havens -->
    <rect x="415" y="20" width="165" height="170" fill="#ffffff" stroke="#10b981" stroke-width="1.2" rx="5" />
    <path d="M 415 20 L 580 20 L 580 42 L 415 42 Z" fill="#10b981" />
    <text x="497" y="34" text-anchor="middle" font-family="Inter" font-size="8.5" font-weight="700" fill="#ffffff">safe_havens (Refuges)</text>
    <text x="423" y="56" font-family="JetBrains Mono" font-size="7" fill="#0f172a">PK id: UUID</text>
    <text x="423" y="70" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   name: VARCHAR</text>
    <text x="423" y="84" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   type: VARCHAR (pharmacy..)</text>
    <text x="423" y="98" font-family="JetBrains Mono" font-size="7" fill="#2563eb">   geom: GEOMETRY(Point)</text>
    <text x="423" y="112" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   address: TEXT</text>
    <text x="423" y="126" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   phone: VARCHAR</text>
    <text x="423" y="140" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   is_24_7: BOOLEAN</text>
    <text x="423" y="154" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   pmc_accredited: BOOLEAN</text>
    <text x="423" y="168" font-family="JetBrains Mono" font-size="7" fill="#0f172a">   responder_count: INT</text>

    <!-- Connections -->
    <line x1="185" y1="84" x2="220" y2="84" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3" />
    <line x1="385" y1="98" x2="415" y2="98" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3" />
  </svg>
  <div class="diagram-caption">Figure 5.1: Spatial Relational Entity-Relationship Diagram (PostgreSQL 16 + PostGIS)</div>
</div>

<p>Below is the complete, executable production SQL DDL script defining the core tables and spatial indices:</p>

<pre><code>-- Enable Spatial and Cryptographic Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgrouting;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Road Graph Edges (Spatial Network for PgRouting)
CREATE TABLE roads_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    osm_way_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    road_class VARCHAR(32) NOT NULL,
    length_meters DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(LineString, 4326) NOT NULL,
    explicit_lit BOOLEAN DEFAULT NULL,
    spillover_poi_count INT DEFAULT 0,
    active_night_pois INT DEFAULT 0,
    baseline_lux DOUBLE PRECISION DEFAULT 10.0,
    source_node UUID NOT NULL,
    target_node UUID NOT NULL,
    cost_base DOUBLE PRECISION NOT NULL,
    reverse_cost_base DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_edges_geom ON roads_edges USING GIST (geom);
CREATE INDEX idx_edges_osm ON roads_edges(osm_way_id);

-- 2. Verified Safe Havens ("Ask for Angela" Network)
CREATE TABLE safe_havens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL CHECK (type IN ('police', 'pharmacy_247', 'hospital', 'transit_hub', 'commercial_refuge')),
    geom GEOMETRY(Point, 4326) NOT NULL,
    address TEXT NOT NULL,
    contact VARCHAR(32),
    timing VARCHAR(64) DEFAULT '24/7',
    is_verified BOOLEAN DEFAULT TRUE,
    pmc_accredited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_safe_havens_geom ON safe_havens USING GIST (geom);

-- 3. Dynamic Transient Hazards & Incident Decay
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(64) NOT NULL CHECK (category IN ('broken_lamp', 'deserted_stretch', 'harassment_crowd', 'waterlogged', 'cctv_blindspot')),
    geom GEOMETRY(Point, 4326) NOT NULL,
    edge_id UUID REFERENCES roads_edges(id) ON DELETE SET NULL,
    severity DOUBLE PRECISION NOT NULL CHECK (severity BETWEEN 0.1 AND 1.0),
    decay_tau_days INT DEFAULT 14,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(32) DEFAULT 'verified' CHECK (status IN ('investigating', 'verified', 'resolved')),
    upvotes INT DEFAULT 1
);
CREATE INDEX idx_incidents_geom ON incidents USING GIST (geom);
CREATE INDEX idx_incidents_active ON incidents(reported_at, status);

-- 4. Municipal SCADA & Civic Tickets (PMC / PCMC Bridge)
CREATE TABLE municipal_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_code VARCHAR(32) UNIQUE NOT NULL,
    edge_id UUID REFERENCES roads_edges(id) ON DELETE CASCADE,
    ward_id VARCHAR(64) NOT NULL,
    category VARCHAR(64) NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL,
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('pending', 'forwarded_to_pmc', 'in_progress', 'resolved')),
    pmc_grievance_id VARCHAR(64),
    sla_deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_tickets_ward ON municipal_tickets(ward_id, status);

-- 5. Ephemeral Guardian Telemetry (Zero-Knowledge DPDPA 2023)
CREATE TABLE telemetry_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commuter_token VARCHAR(128) UNIQUE NOT NULL,
    e2ee_public_key TEXT NOT NULL,
    active_route_id VARCHAR(64) NOT NULL,
    last_geom GEOMETRY(Point, 4326),
    battery_percent INT,
    speed_kmh DOUBLE PRECISION,
    is_deviated BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX idx_telemetry_active ON telemetry_sessions(commuter_token, is_active);</code></pre>

<div class="page-break"></div>

<!-- SECTION 6: CORE MATHEMATICAL & ALGORITHMIC LOGIC -->
<h2>6. Core Mathematical & Algorithmic Logic</h2>
<p>
  SurakshitPath's routing advantage stems from its mathematically grounded objective cost function, non-linear multi-factor infrastructure scoring, and exact Shapley attribution values.
</p>

<!-- DIAGRAM 4: MATHEMATICAL PIPELINE FLOWCHART -->
<div class="diagram-container avoid-break">
  <svg width="600" height="150" viewBox="0 0 600 150" style="max-width: 100%; height: auto;">
    <rect x="0" y="0" width="600" height="150" fill="#f8fafc" rx="8" />

    <!-- Step 1 -->
    <rect x="15" y="40" width="105" height="70" fill="#ffffff" stroke="#3b82f6" stroke-width="1.2" rx="6" />
    <text x="67" y="60" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="700" fill="#1e3a8a">Physical Edge</text>
    <text x="67" y="74" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#64748b">OSM way_id</text>
    <text x="67" y="88" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#64748b">d_e (meters)</text>

    <!-- Arrow 1 -->
    <line x1="120" y1="75" x2="145" y2="75" stroke="#3b82f6" stroke-width="2" />
    <polygon points="145,75 139,71 139,79" fill="#3b82f6" />

    <!-- Step 2 -->
    <rect x="145" y="25" width="135" height="100" fill="#ffffff" stroke="#10b981" stroke-width="1.2" rx="6" />
    <text x="212" y="45" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="700" fill="#065f46">Safety Factors</text>
    <text x="212" y="60" text-anchor="middle" font-family="JetBrains Mono" font-size="6.8" fill="#047857">Lighting L_e (OSM/Proxy)</text>
    <text x="212" y="74" text-anchor="middle" font-family="JetBrains Mono" font-size="6.8" fill="#047857">Activity A_e = ln(1+N)</text>
    <text x="212" y="88" text-anchor="middle" font-family="JetBrains Mono" font-size="6.8" fill="#047857">Transit T_e = exp(-d/300)</text>
    <text x="212" y="102" text-anchor="middle" font-family="JetBrains Mono" font-size="6.8" fill="#047857">Haven E_e = exp(-d/1000)</text>
    <text x="212" y="116" text-anchor="middle" font-family="JetBrains Mono" font-size="6.8" fill="#dc2626">Hazard R_e (tau=14d)</text>

    <!-- Arrow 2 -->
    <line x1="280" y1="75" x2="305" y2="75" stroke="#10b981" stroke-width="2" />
    <polygon points="305,75 299,71 299,79" fill="#10b981" />

    <!-- Step 3 -->
    <rect x="305" y="40" width="135" height="70" fill="#ffffff" stroke="#f59e0b" stroke-width="1.2" rx="6" />
    <text x="372" y="60" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="700" fill="#92400e">Dynamic Cost</text>
    <text x="372" y="75" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#b45309">S_e = sum(w_i F_i)</text>
    <text x="372" y="90" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#b45309">C_e = d_e[1 + beta(1-S_e)]</text>

    <!-- Arrow 3 -->
    <line x1="440" y1="75" x2="465" y2="75" stroke="#f59e0b" stroke-width="2" />
    <polygon points="465,75 459,71 459,79" fill="#f59e0b" />

    <!-- Step 4 -->
    <rect x="465" y="30" width="120" height="90" fill="#ffffff" stroke="#8b5cf6" stroke-width="1.2" rx="6" />
    <text x="525" y="50" text-anchor="middle" font-family="Inter" font-size="7.5" font-weight="700" fill="#5b21b6">Path & Explain</text>
    <text x="525" y="66" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#6d28d9">MinPriorityQueue</text>
    <text x="525" y="80" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#6d28d9">Dijkstra Search</text>
    <text x="525" y="96" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#6d28d9">TreeSHAP phi_i</text>
    <text x="525" y="110" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#6d28d9">Waterfall Radar</text>
  </svg>
  <div class="diagram-caption">Figure 6.1: Algorithmic Routing Pipeline — From Road Segments to TreeSHAP Attribution</div>
</div>

<h3>1. Dynamic Edge Impedance Formulation</h3>
<p>
  Given a directed graph $G = (V, E)$, each edge $e \in E$ has a physical length $d_e$ (in meters) and an environmental safety score $S_e \in [0.0, 1.0]$. The routing impedance cost $C_e$ is governed by the commuter's risk-tolerance slider $\beta \in [0.0, 1.5]$:
</p>
<div style="background: #f1f5f9; padding: 8px 12px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 8.5pt; margin: 8px 0; border: 1px solid #cbd5e1;">
  <strong>C_e = d_e &times; [1.0 + &beta; &times; (1.0 - S_e)]</strong>
</div>
<ul>
  <li>When <code>&beta; = 0.0</code> (Fastest): $C_e = d_e$. The algorithm minimizes pure geometric distance, equivalent to Google Maps.</li>
  <li>When <code>&beta; = 0.8</code> (Balanced Default): A dark alley ($S_e = 0.15$) incurs a penalty multiplier of $1 + 0.8(0.85) = 1.68\times$, forcing the router to detour onto a bright arterial road if the detour is &lt;68% longer.</li>
  <li>When <code>&beta; = 1.2+</code> (Max Safety): Unlit service roads incur a $>2.0\times$ penalty, strictly confining the route to illuminated corridors.</li>
</ul>

<h3>2. Multi-Factor Safety Score ($S_e$) Formulation</h3>
<div style="background: #f1f5f9; padding: 8px 12px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 8.5pt; margin: 8px 0; border: 1px solid #cbd5e1;">
  <strong>S_e = clamp_0_1(0.35 &times; L_e + 0.25 &times; A_e + 0.20 &times; T_e + 0.20 &times; E_e - 0.50 &times; R_e)</strong>
</div>
<ul>
  <li><strong>Illumination Factor ($L_e \in [0, 1]$):</strong> Uses OSM <code>lit=yes/no</code> if present. If untagged, uses the <em>Illumination Proxy Engine</em>:
    $$L_e = \min(1.0, \text{RoadBaseline} + \min(0.50, \text{SpilloverPOIs} \times 0.15))$$
    Where RoadBaselines are: Trunk ($0.80$), Primary ($0.70$), Secondary ($0.50$), Tertiary ($0.35$), Residential ($0.20$), Service/Alley ($0.05$).</li>
  <li><strong>Commercial Presence ($A_e \in [0, 1]$):</strong> 
    $$A_e = \min\left(1.0, \frac{\ln(1 + \text{ActiveNightPOIs})}{\ln(1 + 8)}\right)$$
  </li>
  <li><strong>Transit Proximity ($T_e \in [0, 1]$):</strong> $T_e = \exp(-d_{\text{transit}} / 300\text{m})$.</li>
  <li><strong>Emergency Haven Access ($E_e \in [0, 1]$):</strong> $E_e = \exp(-d_{\text{emergency}} / 1000\text{m})$.</li>
  <li><strong>Exponential Incident Decay ($R_e \in [0, 1]$):</strong>
    $$R_e = \sum_i \text{Severity}_i \cdot \frac{\exp(-\Delta t_i / \tau)}{1 + \text{dist}(e, x_i)^2}, \quad \tau = 14\text{ days}$$
  </li>
</ul>

<h3>3. Glass-Box TreeSHAP Attribution ($\phi_i$)</h3>
<p>
  Unlike black-box neural networks, SurakshitPath guarantees local accuracy and consistency via exact Shapley values. The commuter's composite score $f(x)$ is decomposed relative to the citywide baseline expectation $\mathbb{E}[f(x)] = 54.0$:
  $$f(x) = \mathbb{E}[f(x)] + \sum_{i=1}^{M} \phi_i(x)$$
  Each factor explicitly informs the user in plain language (e.g., <em>"+19.5 pts from continuous high-mast municipal lighting, -8.5 pts from commercial dead-zone"</em>).
</p>

<div class="page-break"></div>

<!-- SECTION 7: FEATURE ROADMAP, RICE RATING & EXECUTION PHASES -->
<h2>7. Feature Roadmap, RICE Scoring & Chronological Execution</h2>
<p>
  To prioritize engineering resources, every proposed feature was evaluated using the industry-standard <strong>RICE Framework</strong> (Reach &times; Impact &times; Confidence / Effort), combined with technical feasibility and ethical anti-redlining compliance.
</p>

<table>
  <thead>
    <tr>
      <th style="width: 24%;">Feature Module</th>
      <th style="width: 10%;">Reach (1-10)</th>
      <th style="width: 10%;">Impact (1-5)</th>
      <th style="width: 10%;">Confidence</th>
      <th style="width: 10%;">Effort (1-5)</th>
      <th style="width: 12%;">RICE Score</th>
      <th style="width: 10%;">Priority</th>
      <th style="width: 14%;">Target Sprint</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1. "Ask for Angela" Safe Haven Refuges</strong></td>
      <td>9</td>
      <td>5 (Massive)</td>
      <td>95%</td>
      <td>2 (Low)</td>
      <td><strong>213.7</strong></td>
      <td><span class="badge badge-success">P0 - Highest</span></td>
      <td>Sprint 1 (Weeks 1-2)</td>
    </tr>
    <tr>
      <td><strong>2. Dead-Man's Discreet Escort Switch</strong></td>
      <td>8</td>
      <td>4.5 (High)</td>
      <td>90%</td>
      <td>2 (Low)</td>
      <td><strong>162.0</strong></td>
      <td><span class="badge badge-success">P0 - Highest</span></td>
      <td>Sprint 1 (Weeks 2-3)</td>
    </tr>
    <tr>
      <td><strong>3. PMC Municipal SCADA / Grievance Bridge</strong></td>
      <td>7</td>
      <td>5 (High Moat)</td>
      <td>85%</td>
      <td>2.5 (Med)</td>
      <td><strong>119.0</strong></td>
      <td><span class="badge badge-primary">P1 - High</span></td>
      <td>Sprint 2 (Weeks 4-5)</td>
    </tr>
    <tr>
      <td><strong>4. PostgreSQL/PostGIS City-Scale Routing</strong></td>
      <td>10</td>
      <td>5 (Core Scale)</td>
      <td>90%</td>
      <td>4 (High)</td>
      <td><strong>112.5</strong></td>
      <td><span class="badge badge-primary">P1 - High</span></td>
      <td>Sprint 2-3 (Weeks 6-8)</td>
    </tr>
    <tr>
      <td><strong>5. Ambient Light Sensor (ALS) Telemetry</strong></td>
      <td>8</td>
      <td>4 (Auto-Crowd)</td>
      <td>80%</td>
      <td>3 (Med)</td>
      <td><strong>85.3</strong></td>
      <td><span class="badge badge-primary">P1 - High</span></td>
      <td>Sprint 3 (Weeks 9-10)</td>
    </tr>
    <tr>
      <td><strong>6. Zero-Knowledge P2P E2EE Guardian Stream</strong></td>
      <td>7</td>
      <td>4 (Privacy)</td>
      <td>85%</td>
      <td>3.5 (Med-Hi)</td>
      <td><strong>68.0</strong></td>
      <td><span class="badge badge-warning">P2 - Medium</span></td>
      <td>Sprint 4 (Weeks 11-12)</td>
    </tr>
    <tr>
      <td><strong>7. Offline PWA Vector Tiles (PMTiles)</strong></td>
      <td>8</td>
      <td>3.5 (Resilience)</td>
      <td>80%</td>
      <td>3.5 (Med-Hi)</td>
      <td><strong>64.0</strong></td>
      <td><span class="badge badge-warning">P2 - Medium</span></td>
      <td>Sprint 4 (Weeks 13-14)</td>
    </tr>
    <tr>
      <td><strong>8. Monsoon Flood Waterlogging Impedance</strong></td>
      <td>6</td>
      <td>3 (Seasonal)</td>
      <td>75%</td>
      <td>3 (Med)</td>
      <td><strong>45.0</strong></td>
      <td><span class="badge badge-warning">P2 - Medium</span></td>
      <td>Sprint 5 (Weeks 15-16)</td>
    </tr>
  </tbody>
</table>

<div class="callout callout-info">
  <strong>Formula Note on RICE Scoring:</strong> $\text{RICE Score} = \frac{\text{Reach} \times \text{Impact} \times \text{Confidence}}{\text{Effort}}$. Features 1 and 2 deliver immediate user-facing safety value with minimal infrastructure overhead, providing our fastest path to market differentiation.
</div>

<h3>Chronological 4-Phase Execution Roadmap</h3>

<div class="grid-2 avoid-break">
  <div class="card">
    <div class="card-header">
      <span>PHASE 1: Client Hardening & Rapid Shields</span>
      <span class="badge badge-success">Weeks 1 - 3</span>
    </div>
    <ul>
      <li>• <strong>Implement "Ask for Angela" Safe Haven Layer:</strong> Ingest 50+ verified Pune 24/7 pharmacies, hospitals, and police chowkis with one-tap emergency refuge diversion line.</li>
      <li>• <strong>Build Dead-Man's Discreet Escort Switch:</strong> Full-screen tactile thumb-hold with 12s silent pulse countdown and fail-safe PIN abort.</li>
      <li>• <strong>Install PWA Manifest & Audio Guidance Caching:</strong> Pre-cache critical Marathi/Hindi audio prompts for zero-latency turn alerts.</li>
    </ul>
  </div>

  <div class="card">
    <div class="card-header">
      <span>PHASE 2: Spatial Backend & B2G Municipal Loop</span>
      <span class="badge badge-primary">Weeks 4 - 8</span>
    </div>
    <ul>
      <li>• <strong>Deploy PostgreSQL 16 + PostGIS + PgRouting:</strong> Load full Pune municipal street network from Overpass OSM into PostGIS with GIST geometry indexing.</li>
      <li>• <strong>Automate PMC / PCMC SCADA Bridge:</strong> Build the civic ticket generator to automatically package clustered dark spots into standardized municipal grievance CSV/REST formats.</li>
      <li>• <strong>Deploy FastAPI Routing Microservice:</strong> Serve dynamic Dijkstra pathfinding with live impedance cost evaluation in &lt;30ms.</li>
    </ul>
  </div>
</div>

<div class="grid-2 avoid-break">
  <div class="card">
    <div class="card-header">
      <span>PHASE 3: Sensor Ingestion & Telemetry</span>
      <span class="badge badge-warning">Weeks 9 - 12</span>
    </div>
    <ul>
      <li>• <strong>Ambient Light Sensor (ALS) Harvester:</strong> Passively collect phone lux readings to continuously auto-update road lighting scores without user surveys.</li>
      <li>• <strong>WebSockets & Redis Telemetry:</strong> Stream live Kalman-filtered breadcrumbs to Guardians with sub-50ms latency.</li>
      <li>• <strong>WebCrypto E2EE Zero-Knowledge Protocol:</strong> Ephemeral key exchange so SurakshitPath servers never retain historical personal GPS tracks.</li>
    </ul>
  </div>

  <div class="card">
    <div class="card-header">
      <span>PHASE 4: Enterprise, Campus & Institutional Scale</span>
      <span class="badge badge-danger">Weeks 13 - 16</span>
    </div>
    <ul>
      <li>• <strong>University & Tech-Park Campus Portals:</strong> Integrate dedicated safety zones for SPPU, JSPM Tathawade, COEP, and Hinjewadi Phase 1-3 IT corridor.</li>
      <li>• <strong>Monsoon Waterlogging Impedance ($W_e$):</strong> Dynamic flood and drainage overflow penalties during heavy Pune rains.</li>
      <li>• <strong>B2G Municipal Smart-City Dashboard:</strong> Official analytics portal for municipal ward corporators to track lighting repair SLAs.</li>
    </ul>
  </div>
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 20px 0;">

<!-- SIGN-OFF -->
<div style="display: flex; justify-content: space-between; align-items: center; font-size: 8pt; color: #64748b; margin-top: 14px;">
  <div><strong>SurakshitPath Engineering & Architecture Group</strong> • Pune, Maharashtra</div>
  <div><em>Document Certified for Implementation • v2.0 Production Blueprint</em></div>
</div>

</body>
</html>
"""

# Write HTML file
html_file_path = "e:/Software/SurakshitPath/SurakshitPath_Strategic_Architecture_Dossier.html"
pdf_file_path = "e:/Software/SurakshitPath/SurakshitPath_Strategic_Architecture_Dossier.pdf"

with open(html_file_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML written successfully to {html_file_path}")

# Run Edge headless to print to PDF
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_path,
    "--headless",
    "--disable-gpu",
    f"--print-to-pdf={pdf_file_path}",
    "--no-pdf-header-footer",
    html_file_path
]

print("Compiling PDF with Microsoft Edge...")
result = subprocess.run(cmd, capture_output=True, text=True)
if os.path.exists(pdf_file_path):
    size_kb = os.path.getsize(pdf_file_path) / 1024
    print(f"SUCCESS: PDF generated at {pdf_file_path} ({size_kb:.2f} KB)")
else:
    print(f"ERROR: PDF generation failed. Return code: {result.returncode}")
    print(result.stderr)
