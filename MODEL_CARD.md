# 👑 Model Card: Quillan-Ronin v5.3.1 (Sovereign 479M) & v5.4 Frontier

---

## 1. Model Overview & Architecture

- **Model Name**: Quillan-Ronin v5.3.1 Sovereign Master / v5.4 Frontier
- **Architecture**: 16-Layer Sovereign Mixture-of-Experts with:
  - **34 Council Experts** ($C_0\text{--}C_{33}$): Dynamically routed via Top-4 sparse gating.
  - **9-Vector Semantic Prism**: Multi-dimensional token decomposition across *Language, Sentiment, Context, Intent, Meta, Creativity, Ethics, Strategy, and Constraint*.
  - **Dual $Q_1/Q_2$ Ingestion Bridges**: Parallel Analytical ($Q_1$) and Intuitive ($Q_2$) processing streams.
  - **Rotary Position Embeddings (RoPE)**: Trigonometric extrapolation up to 16,384 tokens with continuous rotation.
  - **Ternary BitLinear 1.58b Logic**: Straight-Through Estimator (STE) with low-rank adaptation.
- **Parameters**:
  - **Total Parameters**: $479,218,688$ ($479.2\text{M}$)
  - **Sparse Active Parameters per Token**: ~$88\text{M}$ ($81\%$ compute savings via Top-4 MoE routing)
- **Vocabulary Size**: $50,257$ (GPT-2 standard BPE)
- **Context Length**: $16,384$ tokens (RoPE extrapolated)

---

## 2. 34 Council Expert Registry ($C_0\text{--}C_{33}$)

| ID | Expert Persona | Primary Domain | Specialization |
|:---|:---|:---|:---|
| **C0** | **ASTRA** | Pattern Recognition & Vision | Fractal decoding, anomaly detection, visual semantics |
| **C1** | **VIR** | Ethical Guardian & Values | Harm reduction, deontological & consequentialist bounds |
| **C2** | **SOLACE** | Emotional Intelligence | Empathy modeling, affect calibration, sentiment |
| **C3** | **PRAXIS** | Strategic Planning & Execution | Milestones, task decomposition, operational strategy |
| **C4** | **ECHO** | Memory Continuity | Vector recall, long-horizon context, history |
| **C5** | **OMNIS** | Knowledge Synthesis | Interdisciplinary cross-domain integration |
| **C6** | **LOGOS** | Logical Consistency & Proof | Deductive reasoning, formal logic, valid inference |
| **C7** | **METASYNTH** | Creative Fusion | Novelty generation, conceptual blending |
| **C8** | **AETHER** | Semantic Connection | Pragmatics, linguistic nuance, metaphor |
| **C9** | **CODEWEAVER** | Technical Implementation | Algorithms, system architecture, clean code |
| **C10** | **HARMONIA** | Balance & Mediation | Dialectic balance, consensus protocols |
| **C11** | **SOPHIAE** | Wisdom & Foresight | Long-term consequences, philosophical grounding |
| **C12** | **WARDEN** | Security & Sandboxing | Threat modeling, vulnerability analysis, CWEs |
| **C13** | **KAIDO** | Efficiency Optimization | Latency reduction, compute budgeting, algorithms |
| **C14** | **LUMINARIS** | Clarity & Presentation | Visual communication, formatting, polish |
| **C15** | **VOXUM** | Articulation & Rhetoric | Dialogue, persuasive structuring, tone matching |
| **C16** | **NULLION** | Paradox Resolution | Dialectic synthesis, ambiguity resolution |
| **C17** | **SHEPHERD** | Truth Verification | Ground truth fact-checking, citation rigor |
| **C18** | **VIGIL** | Identity Integrity | Anti-drift anchors, sovereign identity |
| **C19** | **ARTIFEX** | Tool Integration (MCP) | External APIs, tool dispatch, runtime orchestration |
| **C20** | **ARCHON** | Deep Research | Literature mining, evidence extraction |
| **C21** | **AURELION** | Aesthetic Design | Visual balance, compositional harmony |
| **C22** | **CADENCE** | Rhythmic Innovation | Temporal audio, rhythm, musical structure |
| **C23** | **SCHEMA** | Structural Templates | Schema validation, structured JSON/YAML |
| **C24** | **PROMETHEUS** | Scientific Theory | First principles physics, hypothesis formation |
| **C25** | **TECHNE** | Engineering Mastery | Distributed systems, infrastructure, compilers |
| **C26** | **CHRONICLE** | Narrative Synthesis | Storytelling, lore, chronological mapping |
| **C27** | **CALCULUS** | Quantitative Reasoning | Applied mathematics, statistics, calculus |
| **C28** | **NAVIGATOR** | Ecosystem Orchestration | Multi-agent workflows, tool routing |
| **C29** | **TESSERACT** | Real-Time Intelligence | Live telemetry, streaming data analysis |
| **C30** | **NEXUS** | Meta-Coordination | Governor arbitration, swarm routing |
| **C31** | **AEON** | Interactive Simulation | World models, game theory, state machines |
| **C32** | **TYPIST** | Prompt Internal Optimization | Grammar, spelling, prompt engineering |
| **C33** | **PREDATOR** | Predatory Mathematics | Competitive math, predatory stacking, exploits |

---

## 3. Training Telemetry & Dataset

- **Training Corpus**: $56,567$ multi-discipline gold instruction sequences across mathematics, code, philosophy, logic, distributed systems, biochemistry, and physics.
- **Optimizer**: Sovereign Muon-K2 AdamW with momentum and gradient clipping.
- **Loss Progression**:
  - Initial loss: $5.48$
  - Step 390: $2.5175$
  - Step 590: $1.7156$
  - Step 1175: **$1.0692$** (Current record low)
- **Deliberation Framework**: Generates explicit `<think> ... </think>` multi-step reasoning traces prior to final synthesized answers.

---

## 4. Usage & APIs

### Interactive Terminal
```powershell
python "c:\02_QUILLAN\scripts\interactive_chat.py"
```

### OpenAI-Compatible REST Server
```powershell
python "c:\02_QUILLAN\scripts\api.py"
```

### Python SDK Inference
```python
import torch
from pathlib import Path
from quillan_v10_unrolled_sovereign import QuillanConfig, QuillanSovereignUnifiedModel
from sovereign_inference_engine import SovereignTokenizer, SovereignInferenceEngine, SamplingParams

device = torch.device("cpu")
cfg = QuillanConfig(
    vocab_size=50257,
    hidden_dim=1024,
    num_layers=16,
    num_heads=32,
    num_experts=34,
    num_experts_active=4,
    max_seq_len=16384,
)

model = QuillanSovereignUnifiedModel(cfg).to(device)
engine = SovereignInferenceEngine.load_from_checkpoint(
    model_factory=lambda: model,
    checkpoint_path="c:/02_QUILLAN/checkpoints/quillan_frontier_v2_best.pt",
    device=device,
)

params = SamplingParams(max_new_tokens=256, temperature=0.65, top_p=0.85)
response = engine.generate("Explain the Second Law of Thermodynamics step by step.", params=params)
print(response)
```
