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
  <title>Quillan-Ronin | Sovereign Multi-Agent Cognitive Architecture</title>
  <meta name="description" content="Official ecosystem portal for Quillan-Ronin v5.4.0 ONI. 34-Council EvoMoE, 9-Vector Semantic Prism, Interactive Neural Net Visualizer, Browser Copilot & Web3 NFT Vault.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800;900&family=Outfit:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {{
      --bg-dark: #07070c;
      --bg-surface: #0f1017;
      --bg-card: rgba(18, 19, 30, 0.85);
      --accent-red: #e94560;
      --accent-cyan: #00f0ff;
      --accent-gold: #ffb703;
      --accent-purple: #9d4edd;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --border-line: rgba(255, 255, 255, 0.08);
      --border-glow: rgba(233, 69, 96, 0.35);
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Outfit', sans-serif;
      overflow-x: hidden;
      line-height: 1.6;
    }}

    .ambient-glow {{
      position: fixed; top: -150px; left: 50%;
      transform: translateX(-50%);
      width: 1100px; height: 600px;
      background: radial-gradient(circle, rgba(233, 69, 96, 0.15) 0%, rgba(0, 240, 255, 0.05) 50%, transparent 80%);
      filter: blur(140px);
      z-index: 0; pointer-events: none;
    }}

    header {{
      position: sticky; top: 0;
      backdrop-filter: blur(20px);
      background: rgba(7, 7, 12, 0.85);
      border-bottom: 1px solid var(--border-line);
      z-index: 100;
      padding: 16px 40px;
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 12px;
    }}
    .brand {{ display: flex; align-items: center; gap: 14px; }}
    .brand h1 {{
      font-family: 'Cinzel', serif; font-size: 20px; font-weight: 900;
      letter-spacing: 2px;
      background: linear-gradient(135deg, #fff 0%, var(--accent-red) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }}
    .brand span {{
      font-family: 'JetBrains Mono', monospace; font-size: 11px;
      color: var(--accent-cyan); background: rgba(0, 240, 255, 0.08);
      padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(0, 240, 255, 0.2);
    }}

    .nav-tabs {{ display: flex; gap: 6px; flex-wrap: wrap; }}
    .tab-btn {{
      background: transparent; border: none; color: var(--text-muted);
      font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
      padding: 8px 14px; border-radius: 8px; cursor: pointer;
      transition: all 0.25s ease;
    }}
    .tab-btn:hover {{ color: #fff; background: rgba(255, 255, 255, 0.05); }}
    .tab-btn.active {{
      color: var(--text-main); background: rgba(233, 69, 96, 0.15);
      border: 1px solid rgba(233, 69, 96, 0.4);
      box-shadow: 0 0 15px rgba(233, 69, 96, 0.2);
    }}

    .nav-actions {{ display: flex; gap: 10px; align-items: center; }}
    .btn {{
      padding: 8px 16px; border-radius: 8px; font-size: 12.5px; font-weight: 700;
      cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
      transition: all 0.25s ease; font-family: 'Outfit', sans-serif;
    }}
    .btn-primary {{
      background: linear-gradient(135deg, var(--accent-red), #b81b37);
      color: #fff; border: none; box-shadow: 0 0 20px rgba(233, 69, 96, 0.4);
    }}
    .btn-primary:hover {{ transform: translateY(-2px); box-shadow: 0 0 25px rgba(233, 69, 96, 0.6); }}
    .btn-secondary {{
      background: rgba(255, 255, 255, 0.04); color: var(--text-main);
      border: 1px solid var(--border-line);
    }}
    .btn-secondary:hover {{ background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.2); }}

    main {{ position: relative; z-index: 1; max-width: 1300px; margin: 0 auto; padding: 36px 24px 80px; }}
    .tab-content {{ display: none; }}
    .tab-content.active {{ display: block; animation: fadeIn 0.4s ease; }}

    @keyframes fadeIn {{
      from {{ opacity: 0; transform: translateY(8px); }}
      to {{ opacity: 1; transform: translateY(0); }}
    }}

    .hero {{ text-align: center; margin-bottom: 40px; }}
    .hero-badge {{
      display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 11px;
      color: var(--accent-gold); background: rgba(255, 183, 3, 0.1);
      padding: 5px 14px; border-radius: 20px; border: 1px solid rgba(255, 183, 3, 0.3);
      margin-bottom: 14px;
    }}
    .hero h2 {{
      font-family: 'Cinzel', serif; font-size: 38px; font-weight: 900;
      letter-spacing: 1px; margin-bottom: 12px;
      background: linear-gradient(135deg, #fff 30%, var(--accent-cyan) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }}
    .hero p {{ max-width: 780px; margin: 0 auto; color: var(--text-muted); font-size: 15px; }}

    .grid-3 {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px; margin-top: 24px; }}
    
    .card {{
      background: var(--bg-card); border: 1px solid var(--border-line);
      border-radius: 14px; padding: 24px; backdrop-filter: blur(12px);
      transition: all 0.3s ease; position: relative; overflow: hidden;
    }}
    .card:hover {{
      border-color: var(--border-glow); transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
    }}
    .card-icon {{ font-size: 30px; margin-bottom: 12px; }}
    .card h3 {{ font-size: 18px; font-weight: 700; margin-bottom: 8px; color: #fff; }}
    .card p {{ color: var(--text-muted); font-size: 13.5px; line-height: 1.6; }}

    pre {{
      background: #050508; border: 1px solid var(--border-line);
      border-radius: 8px; padding: 12px; font-family: 'JetBrains Mono', monospace;
      font-size: 12px; color: var(--accent-cyan); overflow-x: auto; margin: 10px 0;
    }}

    .council-pill-grid {{
      display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
      gap: 10px; margin-top: 20px;
    }}
    .council-pill {{
      background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-line);
      border-radius: 8px; padding: 10px 12px; font-family: 'JetBrains Mono', monospace;
      font-size: 11px; transition: all 0.2s ease;
    }}
    .council-pill:hover {{
      background: rgba(0, 240, 255, 0.08); border-color: rgba(0, 240, 255, 0.3);
      color: var(--accent-cyan);
    }}

    /* NN Visualizer Frame */
    .nn-container {{
      background: #020408;
      border: 1px solid var(--border-glow);
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(0, 240, 255, 0.15);
      position: relative;
    }}
    .nn-toolbar {{
      background: rgba(10, 15, 25, 0.95);
      border-bottom: 1px solid rgba(0, 255, 255, 0.15);
      padding: 10px 18px;
      display: flex; justify-content: space-between; align-items: center;
    }}

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
      box-shadow: 0 0 12px rgba(233, 69, 96, 0.4);
    }}
    .search-input {{
      background: var(--bg-card); border: 1px solid var(--border-line);
      color: #fff; padding: 9px 16px; border-radius: 8px; font-size: 13px; width: 280px;
    }}
    .search-input:focus {{ outline: none; border-color: var(--accent-cyan); }}

    .nft-grid {{
      display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
    }}
    .nft-card {{
      background: var(--bg-card); border: 1px solid var(--border-line);
      border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s;
    }}
    .nft-card:hover {{ transform: translateY(-5px); border-color: var(--border-glow); }}
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
      display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85);
      backdrop-filter: blur(12px); z-index: 200; align-items: center; justify-content: center;
    }}
    .modal-card {{
      background: #0f1017; border: 1px solid var(--border-glow);
      border-radius: 16px; width: 90%; max-width: 700px; padding: 24px;
      position: relative;
    }}
    .modal-close {{
      position: absolute; top: 16px; right: 20px; background: transparent;
      border: none; color: #fff; font-size: 24px; cursor: pointer;
    }}

    footer {{
      border-top: 1px solid var(--border-line); padding: 30px; text-align: center;
      color: var(--text-muted); font-size: 13px; position: relative; z-index: 1;
    }}
  </style>
</head>
<body>
  <div class="ambient-glow"></div>

  <header>
    <div class="brand">
      <h1>QUILLAN-RONIN</h1>
      <span>v5.4.0 ONI</span>
    </div>
    
    <nav class="nav-tabs">
      <button class="tab-btn active" data-tab="architecture">👑 Architecture</button>
      <button class="tab-btn" data-tab="nnvis">🧠 NN Visualizer</button>
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
    <!-- TAB 1: ARCHITECTURE -->
    <section class="tab-content active" id="tab-architecture">
      <div class="hero">
        <div class="hero-badge">CANONICAL SOVEREIGN COGNITIVE SYSTEM</div>
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

    <!-- TAB 2: NEURAL NET VISUALIZER -->
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

    <!-- TAB 3: PAPERS & RESEARCH -->
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

    <!-- TAB 4: EXTENSION -->
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

    <!-- TAB 5: HUGGING FACE HUB -->
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

    <!-- TAB 6: NFT VAULT -->
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

  <!-- Modal -->
  <div class="modal-overlay" id="nftModal">
    <div class="modal-card">
      <button class="modal-close" id="modalClose">&times;</button>
      <h3 id="modalTitle" style="font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 6px;"></h3>
      <p id="modalCouncil" style="font-family: 'JetBrains Mono'; color: var(--accent-cyan); font-size: 13px; margin-bottom: 12px;"></p>
      <p id="modalDesc" style="color: var(--text-muted); font-size: 14px; line-height: 1.6; margin-bottom: 16px;"></p>
      <div id="modalTraits" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;"></div>
      <div style="font-size: 12px; color: var(--accent-gold); background: rgba(255, 183, 3, 0.1); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255, 183, 3, 0.2);">
        🔒 <b>Vault Status:</b> Artwork media sealed locally until on-chain minting. Minting directly assigns genesis creator provenance.
      </div>
    </div>
  </div>

  <footer>
    <p>Quillan-Ronin Sovereign AI Ecosystem &bull; Engineered by <a href="https://digitalroninx.grok.me/" target="_blank" style="color: var(--accent-cyan); text-decoration: none;">@Crashoverride_X</a> &bull; Licensed under Apache 2.0</p>
  </footer>

  <script>
    document.querySelectorAll('.tab-btn').forEach(btn => {{
      btn.addEventListener('click', () => {{
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      }});
    }});

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
            <div style="width: 100%; height: 100%; background: radial-gradient(circle at center, #1a1a2e 0%, #07070f 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid rgba(233, 69, 96, 0.2); position: relative; overflow: hidden;">
              <div style="font-size: 38px; margin-bottom: 8px; filter: drop-shadow(0 0 12px var(--accent-red));">⚔️</div>
              <div style="font-family: 'JetBrains Mono'; font-size: 13px; font-weight: 700; color: var(--accent-cyan); letter-spacing: 1px;">SOVEREIGN #${{item.id.toString().padStart(3, '0')}}</div>
              <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${{item.council.split(' ')[0]}}</div>
              <div style="position: absolute; bottom: 8px; font-size: 9px; color: var(--accent-gold); background: rgba(0,0,0,0.6); padding: 2px 8px; border-radius: 10px; border: 1px solid rgba(255,183,3,0.3);">🔒 VAULT SEALED</div>
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
          <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">${{k}}</div>
            <div style="font-size: 12px; font-weight: 700; color: var(--accent-cyan);">${{traits[k]}}</div>
          </div>
        `).join('');
      }} else {{
        document.getElementById('modalTraits').innerHTML = `
          <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 6px;">
            <div style="font-size: 10px; color: var(--text-muted);">RARITY</div>
            <div style="font-size: 13px; font-weight: 700; color: var(--accent-red);">${{item.rarity}}</div>
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 6px;">
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
      connectWalletBtn.style.color = '#07070c';
    }}
    connectWalletBtn.addEventListener('click', async () => {{
      if (typeof window.ethereum !== 'undefined') {{
        try {{
          const accounts = await window.ethereum.request({{ method: 'eth_requestAccounts' }});
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