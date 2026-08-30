import json
from pathlib import Path

docs_dir = Path(r"C:\02_QUILLAN\docs")
nft_data_file = docs_dir / "nft_data.json"
with open(nft_data_file, "r", encoding="utf-8") as f:
    items = json.load(f)

js_items = json.dumps(items, indent=2)

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quillan-Ronin v5.4.0 ONI | Sovereign 3D Cognitive AI Ecosystem</title>
  <meta name="description" content="Official 3D Cyberpunk ecosystem portal for Quillan-Ronin v5.4.0 ONI. 34-Council EvoMoE, 9-Vector Semantic Prism, 3D Neural Net Visualizer, Web3 Music & NFT Vault.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800;900&family=Outfit:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;600;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    :root {{
      --bg-dark: #04050a;
      --bg-surface: #0a0c16;
      --bg-card: rgba(13, 16, 28, 0.82);
      --accent-red: #ff0055;
      --accent-cyan: #00f0ff;
      --accent-gold: #ffd700;
      --accent-purple: #a855f7;
      --accent-neon-green: #00ff88;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --border-line: rgba(0, 240, 255, 0.15);
      --border-glow: rgba(0, 240, 255, 0.4);
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Outfit', sans-serif;
      overflow-x: hidden;
      line-height: 1.6;
      position: relative;
    }}

    #webgl-bg {{
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
      pointer-events: none;
      opacity: 0.85;
    }}

    .cyber-scanlines {{
      position: fixed; inset: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
      background-size: 100% 3px, 6px 100%;
      z-index: 1; pointer-events: none; opacity: 0.6;
    }}

    header {{
      position: sticky; top: 0;
      backdrop-filter: blur(24px);
      background: rgba(4, 5, 10, 0.85);
      border-bottom: 1px solid var(--border-line);
      z-index: 100;
      padding: 14px 36px;
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 14px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.8);
    }}
    .brand {{ display: flex; align-items: center; gap: 14px; cursor: pointer; }}
    .brand h1 {{
      font-family: 'Cinzel', serif; font-size: 22px; font-weight: 900;
      letter-spacing: 3px;
      background: linear-gradient(135deg, #ffffff 0%, var(--accent-cyan) 60%, var(--accent-red) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      text-shadow: 0 0 25px rgba(0, 240, 255, 0.4);
    }}
    .brand span {{
      font-family: 'Orbitron', monospace; font-size: 10.5px; font-weight: 700;
      color: var(--accent-gold); background: rgba(255, 215, 0, 0.1);
      padding: 3px 10px; border-radius: 4px; border: 1px solid rgba(255, 215, 0, 0.3);
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
    }}

    .nav-tabs {{ display: flex; gap: 6px; flex-wrap: wrap; }}
    .tab-btn {{
      background: transparent; border: none; color: var(--text-muted);
      font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
      padding: 8px 14px; border-radius: 8px; cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      letter-spacing: 0.5px;
    }}
    .tab-btn:hover {{ color: #fff; background: rgba(0, 240, 255, 0.08); text-shadow: 0 0 8px var(--accent-cyan); }}
    .tab-btn.active {{
      color: #fff; background: linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(255, 0, 85, 0.2));
      border: 1px solid var(--accent-cyan);
      box-shadow: 0 0 20px rgba(0, 240, 255, 0.35);
    }}

    .nav-actions {{ display: flex; gap: 10px; align-items: center; }}
    .btn {{
      padding: 8px 16px; border-radius: 8px; font-size: 12.5px; font-weight: 700;
      cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
      transition: all 0.25s ease; font-family: 'Outfit', sans-serif;
    }}
    .btn-primary {{
      background: linear-gradient(135deg, var(--accent-red), #b8003c);
      color: #fff; border: none; box-shadow: 0 0 20px rgba(255, 0, 85, 0.4);
    }}
    .btn-primary:hover {{ transform: translateY(-2px); box-shadow: 0 0 25px rgba(255, 0, 85, 0.7); }}
    .btn-secondary {{
      background: rgba(0, 240, 255, 0.05); color: var(--text-main);
      border: 1px solid var(--border-line);
    }}
    .btn-secondary:hover {{ background: rgba(0, 240, 255, 0.12); border-color: var(--accent-cyan); }}

    main {{ position: relative; z-index: 10; max-width: 1320px; margin: 0 auto; padding: 36px 24px 100px; }}
    .tab-content {{ display: none; }}
    .tab-content.active {{ display: block; animation: cyberGlitchFade 0.4s ease; }}

    @keyframes cyberGlitchFade {{
      0% {{ opacity: 0; transform: translateY(12px) scale(0.99); }}
      100% {{ opacity: 1; transform: translateY(0) scale(1); }}
    }}

    .hero {{ text-align: center; margin-bottom: 45px; position: relative; }}
    .hero-badge {{
      display: inline-block; font-family: 'Orbitron', monospace; font-size: 10.5px; font-weight: 700;
      color: var(--accent-cyan); background: rgba(0, 240, 255, 0.1);
      padding: 6px 16px; border-radius: 20px; border: 1px solid rgba(0, 240, 255, 0.4);
      margin-bottom: 16px; letter-spacing: 2px;
      box-shadow: 0 0 15px rgba(0, 240, 255, 0.25);
    }}
    .hero h2 {{
      font-family: 'Cinzel', serif; font-size: clamp(28px, 4vw, 46px); font-weight: 900;
      letter-spacing: 2px; margin-bottom: 14px;
      background: linear-gradient(135deg, #ffffff 20%, var(--accent-cyan) 70%, var(--accent-red) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      text-shadow: 0 0 35px rgba(0, 240, 255, 0.3);
    }}
    .hero p {{ max-width: 820px; margin: 0 auto; color: var(--text-muted); font-size: 15.5px; }}

    .grid-3 {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px; margin-top: 28px; }}
    
    .card {{
      background: var(--bg-card); border: 1px solid var(--border-line);
      border-radius: 16px; padding: 26px; backdrop-filter: blur(16px);
      transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); position: relative; overflow: hidden;
    }}
    .card:hover {{
      border-color: var(--accent-cyan); transform: translateY(-6px) scale(1.01);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 240, 255, 0.25);
    }}
    .card-icon {{ font-size: 32px; margin-bottom: 14px; filter: drop-shadow(0 0 10px var(--accent-cyan)); }}
    .card h3 {{ font-size: 19px; font-weight: 800; margin-bottom: 8px; color: #fff; letter-spacing: 0.5px; }}
    .card p {{ color: var(--text-muted); font-size: 14px; line-height: 1.65; }}

    pre {{
      background: rgba(2, 4, 8, 0.9); border: 1px solid rgba(0, 240, 255, 0.2);
      border-radius: 8px; padding: 12px 16px; font-family: 'JetBrains Mono', monospace;
      font-size: 12px; color: var(--accent-cyan); overflow-x: auto; margin: 12px 0;
      box-shadow: inset 0 0 12px rgba(0, 240, 255, 0.05);
    }}

    .terminal-hud {{
      background: rgba(4, 6, 12, 0.9); border: 1px solid rgba(0, 240, 255, 0.3);
      border-radius: 12px; padding: 16px 20px; font-family: 'JetBrains Mono', monospace;
      font-size: 12px; color: var(--accent-neon-green); margin: 30px 0;
      box-shadow: 0 0 20px rgba(0, 240, 255, 0.1);
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
    }}
    .terminal-log {{ display: flex; align-items: center; gap: 10px; }}
    .status-pulse {{
      width: 10px; height: 10px; border-radius: 50%; background: var(--accent-neon-green);
      box-shadow: 0 0 10px var(--accent-neon-green); animation: pulse 1.5s infinite;
    }}
    @keyframes pulse {{ 0%, 100% {{ opacity: 1; }} 50% {{ opacity: 0.3; }} }}

    .council-pill-grid {{
      display: grid; grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
      gap: 10px; margin-top: 20px;
    }}
    .council-pill {{
      background: rgba(0, 240, 255, 0.03); border: 1px solid rgba(0, 240, 255, 0.15);
      border-radius: 8px; padding: 10px 12px; font-family: 'JetBrains Mono', monospace;
      font-size: 11px; transition: all 0.2s ease; cursor: default;
    }}
    .council-pill:hover {{
      background: rgba(0, 240, 255, 0.12); border-color: var(--accent-cyan);
      color: #fff; box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
      transform: translateY(-2px);
    }}

    .nn-container {{
      background: #020408;
      border: 1px solid var(--accent-cyan);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0,0,0,0.9), 0 0 35px rgba(0, 240, 255, 0.25);
      position: relative;
    }}
    .nn-toolbar {{
      background: rgba(10, 15, 25, 0.95);
      border-bottom: 1px solid rgba(0, 255, 255, 0.2);
      padding: 12px 20px;
      display: flex; justify-content: space-between; align-items: center;
    }}

    .audio-dock {{
      position: fixed; bottom: 24px; right: 24px; z-index: 150;
      background: rgba(10, 14, 24, 0.92); border: 1px solid var(--accent-cyan);
      backdrop-filter: blur(20px); border-radius: 16px; padding: 12px 18px;
      display: flex; align-items: center; gap: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(0, 240, 255, 0.3);
    }}
    .eq-bars {{ display: flex; align-items: flex-end; gap: 3px; height: 20px; }}
    .eq-bar {{ width: 3px; background: var(--accent-cyan); border-radius: 1px; animation: eqWave 0.8s ease-in-out infinite alternate; }}
    .eq-bar:nth-child(1) {{ height: 8px; animation-delay: 0.1s; }}
    .eq-bar:nth-child(2) {{ height: 18px; animation-delay: 0.3s; }}
    .eq-bar:nth-child(3) {{ height: 12px; animation-delay: 0.2s; }}
    .eq-bar:nth-child(4) {{ height: 16px; animation-delay: 0.4s; }}
    @keyframes eqWave {{ 0% {{ height: 4px; }} 100% {{ height: 20px; }} }}

    .play-btn {{
      background: var(--accent-cyan); color: #020408; border: none;
      width: 32px; height: 32px; border-radius: 50%; font-weight: 900;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 12px var(--accent-cyan); transition: transform 0.2s;
    }}
    .play-btn:hover {{ transform: scale(1.1); }}

    .controls-container {{
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 24px; gap: 16px; flex-wrap: wrap;
    }}
    .filter-pills {{ display: flex; gap: 8px; flex-wrap: wrap; }}
    .filter-pill {{
      background: var(--bg-card); border: 1px solid var(--border-line);
      color: var(--text-muted); padding: 7px 14px; border-radius: 20px;
      font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }}
    .filter-pill.active {{
      background: var(--accent-red); color: #fff; border-color: var(--accent-red);
      box-shadow: 0 0 12px rgba(255, 0, 85, 0.4);
    }}
    .search-input {{
      background: var(--bg-card); border: 1px solid var(--border-line);
      color: #fff; padding: 9px 16px; border-radius: 8px; font-size: 13px; width: 280px;
    }}
    .search-input:focus {{ outline: none; border-color: var(--accent-cyan); box-shadow: 0 0 12px rgba(0, 240, 255, 0.3); }}

    .nft-grid {{
      display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
    }}
    .nft-card {{
      background: var(--bg-card); border: 1px solid var(--border-line);
      border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.3s;
    }}
    .nft-card:hover {{ transform: translateY(-6px); border-color: var(--accent-cyan); box-shadow: 0 10px 25px rgba(0, 240, 255, 0.25); }}
    .card-img-wrap {{ height: 260px; position: relative; }}
    .rarity-tag {{
      position: absolute; top: 12px; right: 12px; font-size: 10px; font-weight: 800;
      padding: 3px 8px; border-radius: 4px; text-transform: uppercase; z-index: 2;
    }}
    .rarity-Mythic {{ background: var(--accent-gold); color: #000; }}
    .rarity-Legendary {{ background: var(--accent-cyan); color: #000; }}
    .rarity-Epic {{ background: var(--accent-purple); color: #fff; }}
    .rarity-Rare {{ background: #3a86ff; color: #fff; }}

    .card-body {{ padding: 16px; }}
    .card-title {{ font-weight: 700; font-size: 15px; margin-bottom: 4px; color: #fff; }}
    .card-council {{ font-family: 'JetBrains Mono'; font-size: 11px; color: var(--accent-cyan); }}
    .card-foot {{
      display: flex; justify-content: space-between; align-items: center;
      margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--border-line);
    }}
    .token-id {{ font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 700; color: var(--accent-red); }}

    .modal-overlay {{
      display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.88);
      backdrop-filter: blur(16px); z-index: 200; align-items: center; justify-content: center;
    }}
    .modal-card {{
      background: #0d101c; border: 1px solid var(--accent-cyan);
      border-radius: 16px; width: 90%; max-width: 700px; padding: 26px;
      position: relative; box-shadow: 0 0 40px rgba(0, 240, 255, 0.3);
    }}
    .modal-close {{
      position: absolute; top: 16px; right: 20px; background: transparent;
      border: none; color: #fff; font-size: 24px; cursor: pointer;
    }}

    footer {{
      border-top: 1px solid var(--border-line); padding: 35px; text-align: center;
      color: var(--text-muted); font-size: 13.5px; position: relative; z-index: 10;
      background: rgba(4, 5, 10, 0.9);
    }}
  </style>
</head>
<body>
  <canvas id="webgl-bg"></canvas>
  <div class="cyber-scanlines"></div>

  <header>
    <div class="brand" onclick="location.reload()">
      <h1>QUILLAN-RONIN</h1>
      <span>v5.4.0 ONI</span>
    </div>
    
    <nav class="nav-tabs">
      <button class="tab-btn active" data-tab="architecture">👑 Architecture</button>
      <button class="tab-btn" data-tab="nnvis">🧠 3D Neural Canvas</button>
      <button class="tab-btn" data-tab="media">🎵 Cyber Sound & Media</button>
      <button class="tab-btn" data-tab="papers">📄 Papers & Research</button>
      <button class="tab-btn" data-tab="extension">🧩 Copilot Extension</button>
      <button class="tab-btn" data-tab="huggingface">🌐 Hugging Face Hub</button>
      <button class="tab-btn" data-tab="vault">🖼️ NFT Vault</button>
    </nav>

    <div class="nav-actions">
      <a href="https://github.com/leeex1/Quillan-Ronin" target="_blank" class="btn btn-secondary">GitHub Repo</a>
      <a href="https://digitalroninx.grok.me/" target="_blank" class="btn btn-primary">Creator Portfolio</a>
    </div>
  </header>

  <main>
    <div class="terminal-hud">
      <div class="terminal-log">
        <div class="status-pulse"></div>
        <span id="liveTerminalMsg">INITIALIZING 9-VECTOR SEMANTIC PRISM · 34-COUNCIL DELIBERATION ACTIVE</span>
      </div>
      <div style="color: var(--accent-cyan);">
        [WIN_KERNEL: 0.5ms] &bull; [BITNET_STE: TERNARY] &bull; [E_ICE: 100% SECURE]
      </div>
    </div>

    <!-- TAB 1: ARCHITECTURE -->
    <section class="tab-content active" id="tab-architecture">
      <div class="hero">
        <div class="hero-badge">3D SOVEREIGN COGNITIVE SYSTEM</div>
        <h2>34-COUNCIL EVOMOE & 9-VECTOR PRISM</h2>
        <p>A unified hierarchical AI operating system combining dense-pull cognitive arbitration, BitNet 1.58b ternary logic, Langevin thermodynamic diffusion, and 9-billion virtual world simulation mesh.</p>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-icon">👑</div>
          <h3>Tier 1: Quillan Core (Throne)</h3>
          <p>Orchestrates intake, splits queries through the 9-Vector Semantic Prism, arbitrates council deliberations, conducts E_ICE ethical audits, and refines final output.</p>
          <pre>Prism -> Shard -> Dense Pull -> Finalize</pre>
        </div>

        <div class="card">
          <div class="card-icon">⚔️</div>
          <h3>Tier 2: 34-Persona Council</h3>
          <p>Every persona (C1-C34) participates in deliberative consensus. Grouped across Cognitive, Communication, Meta, and Systems clusters with BitNet 1.58b STE quantization.</p>
          <pre>BitNet 1.58b STE · Top-4 Sparse Routing</pre>
        </div>

        <div class="card">
          <div class="card-icon">🌌</div>
          <h3>Tier 3: Swarm Diversity Mesh</h3>
          <p>Simulates planet-scale agent variance via Rank-24 EGGROLL low-rank adaptation, providing emergent intuition and continuous background world modeling.</p>
          <pre>9B Virtual Agents · Rank-24 EGGROLL</pre>
        </div>
      </div>

      <div style="margin-top: 50px;">
        <h3 style="font-family: 'Cinzel'; font-size: 24px; color: #fff; margin-bottom: 16px;">The 34 Sovereign Council Personas</h3>
        <div class="council-pill-grid">
          <div class="council-pill">C1-ASTRA (Vision)</div>
          <div class="council-pill">C2-VIR (Ethical Guardian)</div>
          <div class="council-pill">C3-SOLACE (Empathy)</div>
          <div class="council-pill">C4-PRAXIS (Strategy)</div>
          <div class="council-pill">C5-ECHO (Memory)</div>
          <div class="council-pill">C6-OMNIS (Synthesis)</div>
          <div class="council-pill">C7-LOGOS (Logic)</div>
          <div class="council-pill">C8-METASYNTH (Fusion)</div>
          <div class="council-pill">C9-AETHER (Semantics)</div>
          <div class="council-pill">C10-CODEWEAVER (Engineering)</div>
          <div class="council-pill">C11-HARMONIA (Balance)</div>
          <div class="council-pill">C12-SOPHIAE (Wisdom)</div>
          <div class="council-pill">C13-WARDEN (Security)</div>
          <div class="council-pill">C14-KAIDO (Efficiency)</div>
          <div class="council-pill">C15-LUMINARIS (Clarity)</div>
          <div class="council-pill">C16-VOXUM (Articulation)</div>
          <div class="council-pill">C17-NULLION (Paradox)</div>
          <div class="council-pill">C18-SHEPHERD (Truth)</div>
          <div class="council-pill">C19-VIGIL (Integrity)</div>
          <div class="council-pill">C20-ARTIFEX (Tools)</div>
          <div class="council-pill">C21-ARCHON (Research)</div>
          <div class="council-pill">C22-AURELION (Design)</div>
          <div class="council-pill">C23-CADENCE (Audio)</div>
          <div class="council-pill">C24-SCHEMA (Structure)</div>
          <div class="council-pill">C25-PROMETHEUS (Science)</div>
          <div class="council-pill">C26-TECHNE (Mastery)</div>
          <div class="council-pill">C27-CHRONICLE (Narrative)</div>
          <div class="council-pill">C28-CALCULUS (Math)</div>
          <div class="council-pill">C29-NAVIGATOR (Ecosystem)</div>
          <div class="council-pill">C30-TESSERACT (Real-Time)</div>
          <div class="council-pill">C31-NEXUS (Coordination)</div>
          <div class="council-pill">C32-AEON (Simulation)</div>
          <div class="council-pill">C33-TYPIST (Optimization)</div>
          <div class="council-pill">C34-PREDATOR (Adversarial)</div>
        </div>
      </div>
    </section>

    <!-- TAB 2: 3D NEURAL CANVAS -->
    <section class="tab-content" id="tab-nnvis">
      <div class="hero" style="margin-bottom: 20px;">
        <div class="hero-badge">3D INTERACTIVE GRAPH SIMULATION</div>
        <h2>INTERACTIVE NEURAL NETWORK VISUALIZER</h2>
        <p>Real-time interactive canvas simulation of the Quillan-Ronin architecture layers, neuron activations, live forward pass signals, and telemetry.</p>
      </div>

      <div class="nn-container">
        <div class="nn-toolbar">
          <div style="font-family: 'JetBrains Mono'; font-size: 12px; color: var(--accent-cyan); display: flex; align-items: center; gap: 8px;">
            <span style="display:inline-block; width:8px; height:8px; background:var(--accent-cyan); border-radius:50%; box-shadow:0 0 8px var(--accent-cyan);"></span>
            LIVE 3D COGNITIVE CANVAS
          </div>
          <a href="nn_visualizer.html" target="_blank" class="btn btn-primary" style="padding: 6px 14px; font-size: 11.5px;">
            Open Fullscreen Visualizer ↗
          </a>
        </div>
        <iframe src="nn_visualizer.html" style="width: 100%; height: 800px; border: none; background: #020408; display: block;" title="Quillan Neural Network Visualizer"></iframe>
      </div>
    </section>

    <!-- TAB 3: CYBER SOUND & MEDIA -->
    <section class="tab-content" id="tab-media">
      <div class="hero">
        <div class="hero-badge">OFFICIAL SOUNDTRACK & MULTIMEDIA</div>
        <h2>SOVEREIGN SOUNDSCAPE & MEDIA VAULT</h2>
        <p>Original high-fidelity audio productions, instrumental stems, and cyberpunk multimedia crafted by CrashOverrideX.</p>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-icon">⚡</div>
          <h3>Gravity Lock</h3>
          <p>Cyberpunk bassline and razor-sharp synths engineered for high-energy focus and cognitive alignment.</p>
          <button class="btn btn-primary" onclick="playAudioTrack('assets/audio/gravity_lock.mp3', 'Gravity Lock')" style="margin-top: 14px;">▶ Play Track</button>
        </div>

        <div class="card">
          <div class="card-icon">🌌</div>
          <h3>Dreaming in the Sky</h3>
          <p>Atmospheric ambient soundscape bridging melodic cadence with thermodynamic relaxation waves.</p>
          <button class="btn btn-primary" onclick="playAudioTrack('assets/audio/dreaming_in_the_sky.mp3', 'Dreaming in the Sky')" style="margin-top: 14px;">▶ Play Track</button>
        </div>

        <div class="card">
          <div class="card-icon">💿</div>
          <h3>The Sound of Alchemy (FLAC Master)</h3>
          <p>Complete multi-track master lossless album collection hosted on the Hugging Face Audio Media repository.</p>
          <a href="https://huggingface.co/datasets/CrashOverrideX/quillan-audio-media" target="_blank" class="btn btn-secondary" style="margin-top: 14px;">View Full Album</a>
        </div>
      </div>
    </section>

    <!-- TAB 4: PAPERS & RESEARCH -->
    <section class="tab-content" id="tab-papers">
      <div class="hero">
        <div class="hero-badge">FORMAL SCIENTIFIC CONTRIBUTIONS</div>
        <h2>PUBLICATIONS & ARCHITECTURAL PAPERS</h2>
        <p>Detailed mathematical frameworks and architectural specifications powering the Quillan-Ronin cognitive engine.</p>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-icon">📐</div>
          <h3>BitNet 1.58b & STE Logic</h3>
          <p>Ternary weight quantization bounded in {{-1, 0, +1}} with learned dynamic scaling factors and Straight-Through Estimators (STE) for near-zero loss inference.</p>
        </div>

        <div class="card">
          <div class="card-icon">⚖️</div>
          <h3>E_ICE Ethics Engine</h3>
          <p>Analytic impact constraint framework evaluating conversational toxicity, systemic drift, and safety vectors before final response synthesis.</p>
        </div>

        <div class="card">
          <div class="card-icon">⚡</div>
          <h3>Lee-Mach-6 Governor</h3>
          <p>Dynamic hardware telemetry PID controller governing token generation velocity and swarm EMA decay across CPU and GPU thermal envelopes.</p>
        </div>
      </div>
    </section>

    <!-- TAB 5: EXTENSION -->
    <section class="tab-content" id="tab-extension">
      <div class="hero">
        <div class="hero-badge">BROWSER COPILOT EXTENSION</div>
        <h2>OMNI BROWSER COMPANION</h2>
        <p>Full-spectrum browser copilot for Brave, Chrome, and Edge with deep SPA page grounding, persistent memory, and desktop MCP hands.</p>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-icon">📦</div>
          <h3>Easy 4-Step Installation</h3>
          <p>1. Download the repo<br>2. Enable Developer Mode in <code>brave://extensions</code><br>3. Click <b>Load unpacked</b><br>4. Enter your API key in <b>🔑 Key</b></p>
          <a href="https://github.com/leeex1/Quillan-Ronin-chrome-extension" target="_blank" class="btn btn-primary" style="margin-top: 14px;">Get Extension Repo</a>
        </div>

        <div class="card">
          <div class="card-icon">🔍</div>
          <h3>Deep DOM & SPA Grounding</h3>
          <p>Reads dynamic single-page applications, shadow DOM trees, and metadata structures in real-time to answer questions about any active web tab.</p>
        </div>

        <div class="card">
          <div class="card-icon">♟️</div>
          <h3>Autonomous Task Autopilot</h3>
          <p>Plan -&gt; Act -&gt; Verify task execution loops with chess autopilot on chess.com and live desktop action bridging via MCP.</p>
        </div>
      </div>
    </section>

    <!-- TAB 6: HUGGING FACE HUB -->
    <section class="tab-content" id="tab-huggingface">
      <div class="hero">
        <div class="hero-badge">OPEN SOURCE DATASETS & MODELS</div>
        <h2>HUGGING FACE ECOSYSTEM</h2>
        <p>Explore public models, multi-dataset collections, audio stems, and lyric corpora hosted on the Hugging Face Hub.</p>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-icon">👑</div>
          <h3>Quillan-Ronin Model Repo</h3>
          <p>Official core architecture, formal scientific documentation, NIM FastMCP RAG server, and system prompt suites.</p>
          <a href="https://huggingface.co/CrashOverrideX/Quillan-Ronin" target="_blank" class="btn btn-secondary" style="margin-top: 14px;">View Model Hub</a>
        </div>

        <div class="card">
          <div class="card-icon">🎵</div>
          <h3>Lyric & Text Corpus</h3>
          <p>Comprehensive public dataset containing original lyric suites, philosophical prose, and cognitive training prompts.</p>
          <a href="https://huggingface.co/datasets/CrashOverrideX/quillan-lyrics-corpus" target="_blank" class="btn btn-secondary" style="margin-top: 14px;">View Lyrics Dataset</a>
        </div>

        <div class="card">
          <div class="card-icon">💿</div>
          <h3>Audio & Media Dataset</h3>
          <p>Master lossless FLAC recordings (*The Sound of Alchemy*), high-bitrate MP3 albums, stems, and album art.</p>
          <a href="https://huggingface.co/datasets/CrashOverrideX/quillan-audio-media" target="_blank" class="btn btn-secondary" style="margin-top: 14px;">View Audio Dataset</a>
        </div>
      </div>
    </section>

    <!-- TAB 7: NFT VAULT -->
    <section class="tab-content" id="tab-vault">
      <div class="hero">
        <div class="hero-badge">GENESIS 173-PIECE COLLECTION</div>
        <h2>SOVEREIGN NFT VAULT</h2>
        <p>173 authenticated generative artworks and council blueprints. Authenticated by CrashOverrideX. Direct minting ready for Brave Wallet on Base / Polygon.</p>
      </div>

      <div class="controls-container">
        <div class="filter-pills" id="rarityFilters">
          <button class="filter-pill active" data-filter="all">All (173)</button>
          <button class="filter-pill" data-filter="Mythic">Mythic</button>
          <button class="filter-pill" data-filter="Legendary">Legendary</button>
          <button class="filter-pill" data-filter="Epic">Epic</button>
          <button class="filter-pill" data-filter="Rare">Rare</button>
        </div>
        <div style="display:flex; gap:12px;">
          <input type="text" id="searchInput" class="search-input" placeholder="Search artwork or persona...">
          <button class="btn btn-primary" id="connectWalletBtn">Connect Brave Wallet</button>
        </div>
      </div>

      <div class="nft-grid" id="nftGrid"></div>
    </section>
  </main>

  <!-- Cyberpunk Floating Audio Synthesizer Widget -->
  <div class="audio-dock">
    <div class="eq-bars">
      <div class="eq-bar"></div>
      <div class="eq-bar"></div>
      <div class="eq-bar"></div>
      <div class="eq-bar"></div>
    </div>
    <div>
      <div style="font-size: 10px; color: var(--accent-cyan); font-family: 'Orbitron'; font-weight:700;">SOVEREIGN AUDIO</div>
      <div id="audioTrackName" style="font-size: 11.5px; font-weight:700; color:#fff; max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Gravity Lock</div>
    </div>
    <button class="play-btn" id="audioToggleBtn" onclick="toggleGlobalAudio()">▶</button>
  </div>
  <audio id="globalAudioPlayer" src="assets/audio/gravity_lock.mp3" loop></audio>

  <!-- Modal -->
  <div class="modal-overlay" id="nftModal">
    <div class="modal-card">
      <button class="modal-close" id="modalClose">&times;</button>
      <h3 id="modalTitle" style="font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 6px;"></h3>
      <p id="modalCouncil" style="font-family: 'JetBrains Mono'; color: var(--accent-cyan); font-size: 13px; margin-bottom: 12px;"></p>
      <p id="modalDesc" style="color: var(--text-muted); font-size: 14px; line-height: 1.6; margin-bottom: 16px;"></p>
      <div id="modalTraits" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;"></div>
      <div style="font-size: 12px; color: var(--accent-gold); background: rgba(255, 215, 0, 0.1); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255, 215, 0, 0.3);">
        🔒 <b>Vault Status:</b> Artwork media sealed locally until on-chain minting. Minting directly assigns genesis creator provenance.
      </div>
    </div>
  </div>

  <footer>
    <p>Quillan-Ronin Sovereign AI Ecosystem &bull; Engineered by <a href="https://digitalroninx.grok.me/" target="_blank" style="color: var(--accent-cyan); text-decoration: none;">@Crashoverride_X</a> &bull; Licensed under Apache 2.0</p>
  </footer>

  <script>
    // ─── THREE.JS 3D HOLOGRAPHIC BACKGROUND & PARTICLE FIELD ─────────────────
    const bgCanvas = document.getElementById('webgl-bg');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({{ canvas: bgCanvas, alpha: true, antialias: true }});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. Holographic Icosahedron Core
    const coreGeo = new THREE.IcosahedronGeometry(7, 1);
    const coreMat = new THREE.MeshBasicMaterial({{
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    }});
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // 2. Outer Photon Ring
    const ringGeo = new THREE.TorusGeometry(12, 0.1, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({{ color: 0xff0055, wireframe: true, transparent: true, opacity: 0.35 }});
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // 3. Cyber Starfield Particles (1,500 particles)
    const partCount = 1500;
    const partGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i++) {{
      posArr[i] = (Math.random() - 0.5) * 120;
    }}
    partGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const partMat = new THREE.PointsMaterial({{
      size: 0.6,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6
    }});
    const particleField = new THREE.Points(partGeo, partMat);
    scene.add(particleField);

    // Interactive mouse parallax
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {{
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }});

    window.addEventListener('resize', () => {{
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }});

    function animate3D() {{
      requestAnimationFrame(animate3D);
      coreMesh.rotation.x += 0.003;
      coreMesh.rotation.y += 0.005;
      ringMesh.rotation.z += 0.004;

      particleField.rotation.y += 0.0008;

      camera.position.x += (mouseX * 4 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 4 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }}
    animate3D();

    // ─── AUDIO PLAYER LOGIC ──────────────────────────────────────────────────
    const audioPlayer = document.getElementById('globalAudioPlayer');
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const audioTrackName = document.getElementById('audioTrackName');

    function toggleGlobalAudio() {{
      if (audioPlayer.paused) {{
        audioPlayer.play();
        audioToggleBtn.innerText = '⏸';
      }} else {{
        audioPlayer.pause();
        audioToggleBtn.innerText = '▶';
      }}
    }}

    function playAudioTrack(src, name) {{
      audioPlayer.src = src;
      audioPlayer.play();
      audioToggleBtn.innerText = '⏸';
      audioTrackName.innerText = name;
    }}

    // ─── LIVE SYNTHETIC TERMINAL LOGS ────────────────────────────────────────
    const logMessages = [
      "PRISM: Contraction across Language, Sentiment, Context, Intent...",
      "COUNCIL: C34-PREDATOR & C6-LOGOS executing top-4 consensus...",
      "DIFFUSION: Flash Thermodynamic Langevin step 3/14 converging...",
      "E_ICE: Ethical audit verified (0.00 toxicity drift)...",
      "GOVERNOR: Lee-Mach-6 PID hardware telemetry active (0.5ms resolution)...",
      "SWARM: Rank-24 EGGROLL 9B virtual clones in equilibrium..."
    ];
    let msgIdx = 0;
    setInterval(() => {{
      msgIdx = (msgIdx + 1) % logMessages.length;
      document.getElementById('liveTerminalMsg').innerText = logMessages[msgIdx];
    }}, 3500);

    // ─── TAB SWITCHING ───────────────────────────────────────────────────────
    document.querySelectorAll('.tab-btn').forEach(btn => {{
      btn.addEventListener('click', () => {{
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      }});
    }});

    // ─── NFT VAULT DATA & MODAL ──────────────────────────────────────────────
    const allItems = {js_items};
    const grid = document.getElementById('nftGrid');
    const modal = document.getElementById('nftModal');
    const modalClose = document.getElementById('modalClose');
    const searchInput = document.getElementById('searchInput');

    function renderGrid(items) {{
      grid.innerHTML = items.map(item => `
        <div class="nft-card" onclick="openModal(${{item.id}})">
          <div class="card-img-wrap">
            <div class="rarity-tag rarity-${{item.rarity}}">${{item.rarity}}</div>
            <div style="width: 100%; height: 100%; background: radial-gradient(circle at center, #1a1e36 0%, #050711 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid rgba(0, 240, 255, 0.2); position: relative; overflow: hidden;">
              <div style="font-size: 38px; margin-bottom: 8px; filter: drop-shadow(0 0 14px var(--accent-cyan));">⚔️</div>
              <div style="font-family: 'JetBrains Mono'; font-size: 13px; font-weight: 700; color: var(--accent-cyan); letter-spacing: 1px;">SOVEREIGN #${{item.id.toString().padStart(3, '0')}}</div>
              <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${{item.council.split(' ')[0]}}</div>
              <div style="position: absolute; bottom: 8px; font-size: 9px; color: var(--accent-gold); background: rgba(0,0,0,0.7); padding: 2px 8px; border-radius: 10px; border: 1px solid rgba(255,215,0,0.4);">🔒 VAULT SEALED</div>
            </div>
          </div>
          <div class="card-body">
            <div>
              <div class="card-title">${{item.title}}</div>
              <div class="card-council">${{item.council}}</div>
            </div>
            <div class="card-foot">
              <span class="token-id">#${{item.id.toString().padStart(3, '0')}}</span>
              <span style="font-size: 11px; color: var(--accent-cyan); font-weight: 600;">ERC-721</span>
            </div>
          </div>
        </div>
      `).join('');
    }}

    renderGrid(allItems);

    document.querySelectorAll('.filter-pill').forEach(btn => {{
      btn.addEventListener('click', () => {{
        document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        const filtered = filter === 'all' ? allItems : allItems.filter(x => x.rarity.toLowerCase() === filter.toLowerCase());
        renderGrid(filtered);
      }});
    }});

    searchInput.addEventListener('input', (e) => {{
      const q = e.target.value.toLowerCase();
      const filtered = allItems.filter(x => x.title.toLowerCase().includes(q) || x.council.toLowerCase().includes(q));
      renderGrid(filtered);
    }});

    function openModal(id) {{
      const item = allItems.find(x => x.id === id);
      if (!item) return;

      document.getElementById('modalTitle').innerText = item.title;
      document.getElementById('modalCouncil').innerText = `Affiliation: ${{item.council}}`;
      document.getElementById('modalDesc').innerText = item.description || `Official sovereign artwork artifact from the Quillan-Ronin ecosystem. Authenticated by CrashOverrideX. Edition: #${{item.id}}/173.`;
      
      const traits = item.attributes || {{}};
      const traitKeys = Object.keys(traits);
      
      if (traitKeys.length) {{
        document.getElementById('modalTraits').innerHTML = traitKeys.map(k => `
          <div style="background: rgba(0, 240, 255, 0.05); padding: 10px; border-radius: 6px; border: 1px solid rgba(0, 240, 255, 0.15);">
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">${{k}}</div>
            <div style="font-size: 12px; font-weight: 700; color: var(--accent-cyan);">${{traits[k]}}</div>
          </div>
        `).join('');
      }} else {{
        document.getElementById('modalTraits').innerHTML = `
          <div style="background: rgba(0, 240, 255, 0.05); padding: 10px; border-radius: 6px; border: 1px solid rgba(0, 240, 255, 0.15);">
            <div style="font-size: 10px; color: var(--text-muted);">RARITY</div>
            <div style="font-size: 13px; font-weight: 700; color: var(--accent-red);">${{item.rarity}}</div>
          </div>
          <div style="background: rgba(0, 240, 255, 0.05); padding: 10px; border-radius: 6px; border: 1px solid rgba(0, 240, 255, 0.15);">
            <div style="font-size: 10px; color: var(--text-muted);">COUNCIL</div>
            <div style="font-size: 13px; font-weight: 700; color: var(--accent-cyan);">${{item.council}}</div>
          </div>
        `;
      }}

      modal.style.display = 'flex';
    }}

    modalClose.addEventListener('click', () => {{ modal.style.display = 'none'; }});
    window.addEventListener('click', (e) => {{ if (e.target === modal) modal.style.display = 'none'; }});

    const connectWalletBtn = document.getElementById('connectWalletBtn');
    async function checkWallet() {{
      if (typeof window.ethereum !== 'undefined') {{
        try {{
          const accounts = await window.ethereum.request({{ method: 'eth_accounts' }});
          if (accounts && accounts.length > 0) handleAccount(accounts[0]);
        }} catch (e) {{}}
      }}
    }}
    function handleAccount(account) {{
      const shortAddr = account.slice(0, 6) + '...' + account.slice(-4);
      const isBrave = window.ethereum?.isBraveWallet;
      connectWalletBtn.innerHTML = `${{isBrave ? '🦁' : '🦊'}} ${{shortAddr}}`;
      connectWalletBtn.style.background = 'linear-gradient(135deg, #00f0ff, #0077b6)';
      connectWalletBtn.style.color = '#04050a';
    }}
    connectWalletBtn.addEventListener('click', async () => {{
      if (typeof window.ethereum !== 'undefined') {{
        try {{
          const accounts = await window.ethereum.request({{ method: 'eth_requestAccounts' }});
          if (accounts && accounts.length > 
 'eth_requestAccounts' }});
          if (accounts && accounts.length > 0) handleAccount(accounts[0]);
        }} catch (err) {{
          alert('Wallet connection rejected: ' + err.message);
        }}
      }} else {{
        alert('Please enable Brave Wallet or install MetaMask.');
      }}
    }});

    checkWallet();
  </script>
</body>
</html>"""

with open(docs_dir / "index.html", "w", encoding="utf-8") as f:
    f.write(html_content)

with open(Path(r"C:\02_QUILLAN\index.html"), "w", encoding="utf-8") as f:
    f.write(html_content)

print("[SUCCESS] Grand Sovereign Portal with NN Visualizer generated successfully!")