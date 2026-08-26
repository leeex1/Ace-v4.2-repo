---
file_type: moc
domain: training
status: active
tags: [moc, training, model, pytorch]
---

# Training & Model MOC

The PyTorch model implementation and training pipeline for Quillan-Ronin.
**Note: active model code lives in `_dev/`, not `scripts/`.**

## Import / Wiring Map

```
final_train.py (scripts/)
  ├── imports quillan_v8_saturated → _dev/quillan_v8_saturated.py
  │     └── imports quillan_multimodal_heads as mm → _dev/quillan_multimodal_heads.py
  ├── imports quillan_fused_optimizer → _dev/quillan_fused_optimizer.py
  └── loads checkpoint/ → checkpoints/router_trained.pt
```

## Active Model (`_dev/`)
- [[_dev/quillan_v8_saturated.py]] — **Main model (v5.3.1 Samurai, 2398 lines)**. Contains: QuillanRoninSovereign, BitLinear (1.58-bit STE), ComplexityRouter (3-path), EvolvableVectorizedMoE (34 experts C0-C33), CouncilExpertSwarm (9B agents), CouilAttention, SovereignFlashDiffusionCore (14-step), DQSO (Kuramoto), E_ICE, MARTA, CCRL, PrimeCovenantFramework, NineVectorDecomposition, InputIngestionLayer, QuillanAgenticExecutor
- [[_dev/quillan_fused_optimizer.py]] — **Muon ⊗ AdamW hybrid optimizer** with Sophia-H clipping, CCRL PID governor, CPU-offloaded momentum buffers (0 VRAM overhead)
- [[_dev/quillan_multimodal_heads.py]] — GeometricImageDecoder, GeometricAudioDecoder, GeometricVideoDecoder (frozen during text-only training)
- [[_dev/quillan_bpe_tokenizer.py]] — BPE tokenizer (may not be the active tokenizer — check tokenizer.pkl)

## BitNet Quantization (built into BitLinear in saturated model)
- `_dev/quillan_v8_saturated.py` contains `_weight_quant()` (STE ternary) and `BitLinear` (4-bit NVFP4 activations)
- [[scripts/ternary_pack.py]] — Ternary weight packing for export
- [[scripts/bitnet_linear.py]] — Older standalone BitLinear (may be superseded)

## Training Pipeline

### Stage A: Router Isolation ✅ (COMPLETE)
- [[scripts/train_router_only.py]] — Trains ComplexityRouter only
- Output: `checkpoints/router_trained.pt` (2.77 GB, 0 missing keys)

### Stage B: Full Model LoRA 🚧 (IN PROGRESS)
- [[scripts/final_train.py]] — Current training script (GTX 1050 optimized)
  - **KNOWN BUG (FIXED)**: `BitLinear.set_global_eggroll(False)` was disconnecting LoRA adapters from the computation graph — they received zero gradients. LoRA never trained.
  - Uses 8 datasets (212.8M tokens total), ctx=128, 1.58-bit STE, 4-bit activations, fp16
  - Uses QuillanFusedOptimizer with Muon (2D weights) + AdamW (scalars)
  - Saves every 250 steps to `checkpoints/model_final_step{N}.pt`
- [[scripts/progressive_train.py]] — Progressive P1-P8 training (optional, not executed)
- [[scripts/train_experts.py]] — Expert specialization training
- [[scripts/train_experts_v2.py]] — Expert training v2
- [[scripts/train_expert_cycle.py]] — Expert cycling

### Legacy Training Scripts (may not work with current model)
- [[scripts/train.py]] — Original training
- [[scripts/train_quillan.py]] — Quillan training
- [[scripts/train_finetune.py]] — Finetune (uses AdamW)
- [[scripts/train_finetune_v2.py]] — Finetune v2 (uses Adafactor)
- [[scripts/train_lightweight.py]] — Lightweight training
- [[scripts/train_multimodal.py]] — Multimodal training (uses QuillanFusedOptimizer)
- [[scripts/_archived_legacy_scripts/]] — Legacy optimizer implementations (CouncilOptimizer, MuonK2, etc.)

## Tokenizer & Data
- [[scripts/train_tokenizer.py]] — Train tokenizer
- [[scripts/train_bpe.py]] — Train BPE
- [[scripts/api.py]] — Model API
- [[scripts/clean_training_data.py]] — Clean training data
- [[scripts/check_training_data.py]] — Check training data
- `training_data/tokenizer.pkl` — Tokenizer file
- `training_data/quillan_bpe_tokenizer.pkl` — BPE tokenizer

## Weight Management
- [[scripts/transplant_weights.py]] — Weight transplant from Llama/Qwen/BitNet
- [[scripts/transplant_v8.py]] — Transplant v8
- [[scripts/transplant_clean.py]] — Clean transplant
- [[scripts/migrate_weights.py]] — Weight migration
- [[scripts/check_weights.py]] — Weight validation
- [[scripts/check_shapes.py]] — Shape checking
- [[scripts/fix_projections.py]] — Projection fix (Fix #10: randn→zeros)
- [[scripts/export_phase5_gguf.py]] — GGUF export

## Checkpoint Lineage
```
Quillan-v4.2-model/ (source safetensors: Llama 2.3GB, Qwen 1.6GB, BitNet 1.1GB)
  → transplant_weights.py
    → checkpoints/quillan_transplanted_v8.pt (9.54 GB)
      → quillan_fixed.pt (2.87 GB, zero-padded)
        → train_router_only.py (Stage A)
          → checkpoints/router_trained.pt (2.77 GB) ✅
            → final_train.py (Stage B)
              → checkpoints/model_final.pt ❌ (needs training)
              → checkpoints/model_final_step250.pt (periodic)
```

## Testing & Validation
- [[scripts/test_forward.py]] — Forward pass test
- [[scripts/test_generation.py]] — Generation test
- [[scripts/test_gpu_load.py]] — GPU VRAM test
- [[scripts/test_inference.py]] — Inference test (current)
- [[scripts/hardware_check.py]] — Hardware validation (Phase 0)
- [[scripts/quantize_and_test.py]] — Quantize → export → test inference
- [[scripts/check_diffusion_weights.py]] — Diffusion weight check
- [[scripts/trace_signal.py]] — Signal tracing

## Datasets (8 active, 212.8M tokens total)
| File | Tokens | Domain |
|------|--------|--------|
| `quillan_corpus_CLEAN_V7.pt` | 166.3M | Main corpus |
| `full_train.pt` | 16.0M | General text |
| `instruct_train.pt` | 13.5M | Instructions |
| `GPT_5.5_Distilled.pt` | 10.7M | GPT distilled |
| `code_train.pt` | 3.0M | Code |
| `quillan_12mb_training_dataset.pt` | 1.7M | Misc |
| `quillan_science_additional.pt` | 1.0M | Science |
| `quillan_science_absolute.pt` | 0.6M | Science |

## Hardware Configuration (GTX 1050)
- PyTorch 2.0.1+cu118 (supports sm_61, installed in venv)
- Pascal mode: forces fp32 compute for sm_61 (fp16 disabled on hardware)
- VRAM: ~4.0 GB (model loads at 2836 MB, trains at ~3520 MB)
- CPU: i5-7700, 28 GB RAM
- Strategy: fp16 for all weights, 1.58-bit STE forward, 4-bit activations, CPU-offloaded optimizer

## Code Connections
- [[Code Dependency Map.md]] — Full import chain, class hierarchy, checkpoint lineage, optimizer family

## Known Wiring Issues
1. ~~`BitLinear.set_global_eggroll(False)` was disconnecting LoRA from computation graph~~ ✅ FIXED
2. ~~4-bit activation quantization on txt_dec was destroying logit precision~~ ✅ FIXED (quantize_act=False)
3. ~~Training data concatenation was creating cross-boundary garbage chunks~~ ✅ FIXED (separate datasets)

## Connections
- [[00 - Vault Index.md]]
- [[01 - Core Architecture.md]]
- [[02 - Knowledge Foundation.md]]
- [[04 - Skills & Capabilities.md]]
- [[05 - Creative Works.md]]
- [[06 - Deployment & Platforms.md]]
- [[12 - Glossary.md]]
- [[Software Engineer/Quillan-XSWE.md]]
- [[testing/LLM Benchmark.md]]
- [[testing/Test Results.md]]

- [[system prompts/Quillan-Samurai.md]]
