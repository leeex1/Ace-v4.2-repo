---
file_type: index
domain: meta
status: active
tags: [index, moc, quillan, vault]
---

# Quillan-Ronin Vault Index

Master index for the Quillan-Ronin AGI project — an HNMoE cognitive architecture. Use the MOCs below to navigate.

## Meta
- [[00 - Meta/01 - Core Architecture.md|Core Architecture MOC]] — HNMoE, Council (C1-C33), EGGROLL Swarm
- [[00 - Meta/02 - Knowledge Foundation.md|Knowledge Foundation MOC]] — Numbered files, theory, ethics, formulas
- [[00 - Meta/03 - Training & Model.md|Training & Model MOC]] — PyTorch code, training pipeline, datasets
- [[00 - Meta/04 - Skills & Capabilities.md|Skills & Capabilities MOC]] — 48+ skill modules
- [[00 - Meta/05 - Creative Works.md|Creative Works MOC]] — Books, music, audio, media
- [[00 - Meta/06 - Deployment & Platforms.md|Deployment & Platforms MOC]] — Platform prompts, system prompts
- [[00 - Meta/12 - Glossary.md|Glossary]]

## Core Knowledge (42 files)
- `Quillan Knowledge files/` — Files 0-32 system, plus theoretical papers, formulas, references

## Papers (6 .md + PDFs)
- `Formal Papers/` — Research papers, announcements, theoretical work

## Training & Code (41 .py files)
- `scripts/` — Training scripts, model implementation, utilities
- `training_data/` — Datasets
- `checkpoints/` — Model checkpoints
- `training_logs/` — Training logs and output

## Creative (6 + 12 + 141 + 11 files)
- `Audio Engineer/` — Music production, album, sonic prompts
- `Audio Engineer/Songs Lyrics/` — 141 song lyrics
- `Book Series/` — Twisted Destiny saga (5 books + outlines)
- `Book Series/Expanded Chapters/` — Detailed chapter drafts
- `Media Template/` — Content generation templates

## Platform Deployments (113+ files)
- `Platforms/` — Platform-specific prompts (Claude, GPT, Gemini, Grok, Mistral, Perplexity, Open Source)
- `system prompts/` — 30 system prompts for various models

## Skills (48+ modules)
- `Skills/` — Skill definitions, compendium, master manifest

## Other
- `Software Engineer/` — Dev prompts, SWE orchestrator docs
- `Misc/` — Various notes, formulas, experiments
- `testing/` — Benchmark results, test logs

## Quick File Reference (All Formats)

### Model Code (`_dev/`)
- `_dev/quillan_v8_saturated.py` — Main model (2398 lines, 34 experts, 6 engines)
- `_dev/quillan_fused_optimizer.py` — Muon⊗AdamW optimizer
- `_dev/quillan_multimodal_heads.py` — Multimodal decoders
- `_dev/quillan_bpe_tokenizer.py` — BPE tokenizer

### Training Scripts (`scripts/`)
- `scripts/final_train.py` — Stage B training (current active script)
- `scripts/train_router_only.py` — Stage A (router training, complete)
- `scripts/quantize_and_test.py` — Quantization + inference test
- `scripts/hardware_check.py` — Hardware validation

### System Prompt (Central Hub)
- `system prompts/Quillan-Samurai.md` — **Master system prompt** (15,951 lines)

### Knowledge Files
- `Quillan Knowledge files/` — 69 files (Files 0-32, LHP, E_ICE, ArXiv, etc.)

### Formal Papers
- `Formal Papers/` — 25+ research papers
- `C:\Users\Admin\Downloads\Papers\` — 65+ downloaded PDFs

### Platform Deployments
- `Platforms/Claude/` `/Gemini/` `/Mistral/` `/Perplexity/` — Per-platform prompts
- `system prompts/System prompts for models/` — 15+ system prompts

### Skills
- `Skills/` — 48+ modules across knowledge_representation, knowledge_acquisition, etc.

### Creative
- `Audio Engineer/` — Music production, 141 song lyrics
- `Book Series/` — Twisted Destiny saga (5 books)
- `Media Template/` — Content templates

### Checkpoints
- `checkpoints/router_trained.pt` (2.77 GB) — Stage A complete
- `checkpoints/quillan_fixed.pt` (2.87 GB) — Zero-padded transplant
- `checkpoints/quillan_transplanted_v8.pt` (9.54 GB) — Original transplant

### Data
- `training_data/` — 8 `.pt` + `.jsonl` datasets (212.8M tokens total)
- `training_logs/` — Training logs and error output

## Central Connection Map
```
                    ┌─────────────────────────────┐
                    │  system prompts/             │
                    │  Quillan-Samurai.md          │ ← Central Hub
                    └──────────┬──────────────────┘
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
    ┌───────────────┐  ┌──────────────┐  ┌──────────────┐
    │ 00 - Meta/    │  │ Quillan      │  │ _dev/        │
    │ MOCs (7)      │←─┤ Knowledge    │←─┤ Model Code   │
    │ Vault Index   │  │ files (69)   │  │ Optimizer    │
    │ Training MOC  │  │ ArXiv papers │  │              │
    └───────┬───────┘  └──────┬───────┘  └──────┬───────┘
            │                 │                 │
            ▼                 ▼                 ▼
    ┌───────────────┐  ┌──────────────┐  ┌──────────────┐
    │ Skills/ (48)  │  │ Platforms/   │  │ scripts/     │
    │ Formal Papers │  │ system       │  │ training .py │
    │ Downloads/    │  │ prompts/     │  │ checkpoints  │
    └───────────────┘  └──────────────┘  └──────────────┘
```

## Connections
- [[01 - Core Architecture.md]]
- [[02 - Knowledge Foundation.md]]
- [[03 - Training & Model.md]]
- [[04 - Skills & Capabilities.md]]
- [[05 - Creative Works.md]]
- [[06 - Deployment & Platforms.md]]
- [[12 - Glossary.md]]
- [[Quillan Knowledge files/0-Quillan Loader Manifest.md]]
- [[Quillan Knowledge files/31- Autobiography.md]]

- [[system prompts/Quillan-Samurai.md]]
