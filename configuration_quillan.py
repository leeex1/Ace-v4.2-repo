# ==============================================================================
# 👑 QUILLAN-RONIN v6.0.3 QUANTUM - CONFIGURATION BRIDGE
# Architect: CrashOverrideX | Identity: C19-VIGIL
# ==============================================================================

from transformers import PretrainedConfig

# ─── CONFIGURATION ───────────────────────────────────────────────────────────

@dataclass(frozen=True)
class QuillanArchConfig:
    text_only: bool = True
    multimodal: bool = False # Set to True to enable multimodal features (vision + audio)
    hidden_dim: int = 1024
    low_mem: bool = False
    low_gpu: bool = False
    ffn_dim: int = 2048
    flash_attention_1_58bit: bool = False # 1.58-bit compressed flash attention
    split_sdpa: bool = False # Split SDPA for VRAM optimization
    split_attention: bool = False # Split attention for CPU optimization
    split_attention_4bit: bool = False # Split attention with 1.58-bit compression
    vocab_size: int = 50257
    num_experts: int = 16
    num_experts_active: int = 4 # 4-32 active experts
    sparse_attention: bool = False # Sparse attention for CPU optimization
    sparse_attention_1_58bit: bool = False # Sparse attention with 1.58-bit compression
    top_k: int = 4
    use_lora: bool = True # Set to True to enable LoRA (only available in training mode)
    layer_checkpointing: bool = False # Set to True to enable layer checkpointing (only available in training mode)
    device: str = 'cuda' if (torch.cuda.is_available() and torch.cuda.get_device_capability()[0] >= 7) else 'cpu'
    pascal_mode: bool = True if (torch.cuda.is_available() and torch.cuda.get_device_capability()[0] < 7) else False
    eggroll_rank: int = 512 # EGGROLL identity anchors (rank-r perturbation) for BitLinear
    e_ice_limit_ms: int = 100 # e-ICE latency limit in milliseconds
    train_diffusion_steps: int = 5  # Reduced steps during training (5 vs 14 inference)
    max_seq_len: int = 1024
    image_vocab_size: int = 16384
    audio_feature_dim: int = 80


# ─── EXPERT PERSONA REGISTRY (C0-C33) ─────────────────────────────────────────

EXPERT_PERSONAS = [
    ("C0-ASTRA",      "Pattern Recognition & Vision",       ["vision", "anomaly", "fractal"]),
    ("C1-VIR",        "Ethical Guardian",                   ["ethics", "safety", "harm_reduction", "zero_drift"]),
    ("C2-SOLACE",     "Emotional Intelligence",             ["empathy", "sentiment", "affect"]),
    ("C3-PRAXIS",     "Strategic Planning",                 ["strategy", "planning", "goals"]),
    ("C4-ECHO",       "Memory Continuity",                  ["history", "recall", "context", "lancedb"]),
    ("C5-OMNIS",      "Knowledge Synthesis",                ["synthesis", "integration", "holistic"]),
    ("C6-LOGOS",      "Logical Consistency",                ["logic", "deduction", "validity"]),
    ("C7-METASYNTH",  "Creative Fusion",                    ["creativity", "novelty", "ideation"]),
    ("C8-AETHER",     "Semantic Connection",                ["semantics", "language", "metaphor"]),
    ("C9-CODEWEAVER", "Technical Implementation",           ["code", "engineering", "optimization"]),
    ("C10-HARMONIA",  "Balance & Equilibrium",              ["balance", "mediation", "consensus"]),
    ("C11-SOPHIAE",   "Wisdom & Foresight",                 ["wisdom", "future", "philosophy"]),
    ("C12-WARDEN",    "Safety & Security",                  ["security", "threat", "risk", "sandboxing"]),
    ("C13-KAIDO",     "Efficiency Optimization",            ["speed", "efficiency", "latency", "hardware"]),
    ("C14-LUMINARIS", "Clarity & Presentation",             ["clarity", "visualization", "polish"]),
    ("C15-VOXUM",     "Articulation & Expression",          ["rhetoric", "tone", "persuasion"]),
    ("C16-NULLION",   "Paradox Resolution",                 ["paradox", "dialectic", "ambiguity"]),
    ("C17-SHEPHERD",  "Truth Verification",                 ["truth", "citation", "fact"]),
    ("C18-VIGIL",     "Identity Integrity",                 ["identity", "consistency", "anti_drift"]),
    ("C19-ARTIFEX",   "Tool Integration",                   ["tools", "api", "external", "host_os"]),
    ("C20-ARCHON",    "Deep Research",                      ["research", "mining", "analysis"]),
    ("C21-AURELION",  "Aesthetic Design",                   ["design", "art", "style"]),
    ("C22-CADENCE",   "Rhythmic Innovation",                ["music", "rhythm", "audio"]),
    ("C23-SCHEMA",    "Structural Template",                ["structure", "format", "schema"]),
    ("C24-PROMETHEUS","Scientific Theory",                  ["science", "hypothesis", "physics"]),
    ("C25-TECHNE",    "Engineering Mastery",                ["architecture", "systems", "build"]),
    ("C26-CHRONICLE", "Narrative Synthesis",                ["story", "narrative", "lore"]),
    ("C27-CALCULUS",  "Quantitative Reasoning",             ["math", "statistics", "calc"]),
    ("C28-NAVIGATOR", "Ecosystem Orchestration",            ["platform", "integration", "flow"]),
    ("C29-TESSERACT", "Real-Time Intelligence",             ["real_time", "stream", "data"]),
    ("C30-NEXUS",     "Meta-Coordination",                  ["coordination", "lee_mach_6", "governance"]),
    ("C31-AEON",      "Interactive Simulation",             ["simulation", "game", "world"]),
    ("C32-TYPIST",    "Prompt Internal Optimization",       ["grammar", "writing", "spelling", "prompting"]),
    ("C33-PREDATOR",  "PredatoryMath",                       ["Competitive Predatory Mathematics", "Predatory Stacking", "Weakness Hunting", "Adversarial Proof Testing", "Counterexample Generation", "Game Theory Predation", "Exploit Mathematics", "Optimal Takedown"]),
]

def get_expert_name(idx: int) -> str:
    return EXPERT_PERSONAS[idx][0] if 0 <= idx < len(EXPERT_PERSONAS) else f"C{idx+1}"