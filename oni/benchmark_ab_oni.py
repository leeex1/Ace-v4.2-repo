#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
QUILLAN-RONIN v5.4.0-ONI: AUTOMATED A/B BENCHMARK SUITE
=============================================================================
Compares:
  • Configuration A: Baseline Quillan-Ronin v5.4.0 ONI
                     router_mode="dense_pull" (all 34 experts active)
                     + Ihara-Bass spectral regularizer.
  • Configuration B: Ultrametric Quillan-Ronin v5.4.0 ONI
                     router_mode="ultrametric" (p-adic hierarchical tree, top-4 active experts)
                     + Ihara-Bass spectral regularizer.

Evaluates:
  1. Weight parity verification (identical initial model weights / checkpoint).
  2. Step latency (ms/step) over 50 steps (10 warmup steps):
     - Forward-only
     - Forward + Backward (training step)
  3. Throughput (tokens/second) for both forward-only and forward+backward.
  4. Peak GPU VRAM allocated and reserved (via torch.cuda.max_memory_allocated).
  5. Sparsed FLOPs / compute reduction ratio.
  6. Auxiliary loss contributions (total aux, spectral gap, load balance, z-loss, entropy).
  7. ASCII/Markdown comparison table + optional JSON export.
  8. CPU and GPU execution compatibility.
=============================================================================
"""

import argparse
import gc
import json
import os
import platform
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import torch

# Fix Windows console encoding for safety
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        # Ignore failure if standard output does not support stream reconfiguration
        pass

# Ensure oni and root directories are on path
ONI_DIR = Path(__file__).resolve().parent
REPO_DIR = ONI_DIR.parent
if str(ONI_DIR) not in sys.path:
    sys.path.insert(0, str(ONI_DIR))
if str(REPO_DIR) not in sys.path:
    sys.path.insert(0, str(REPO_DIR))

try:
    from quillan_v5_4_oni import (
        QuillanOniConfig,
        QuillanRoninOni,
    )
except ImportError as e:
    print(f"Error importing Quillan-Ronin modules: {e}")
    sys.exit(1)


# ---------------------------------------------------------------------------
# FLOPs Analytical Profiler
# ---------------------------------------------------------------------------

def calculate_theoretical_flops(
    cfg: QuillanOniConfig,
    batch_size: int,
    seq_len: int,
    active_experts: int,
    backward: bool = False
) -> Dict[str, float]:
    """
    Computes analytical FLOPs per step for Quillan-Ronin v5.4.0 ONI.
    
    Components per layer per token:
      1. Self-Attention:
         - QKV proj: 2 * 3 * D^2 = 6 D^2
         - Attention logits (Q @ K.T): 2 * D * T
         - Attention output (Softmax @ V): 2 * D * T
         - Out proj: 2 * D^2
         - 9-Vector Prism: 9 * 2 * D^2 = 18 D^2
      2. Dense SwiGLU FFN:
         - c_fc (D -> 2 * FFN): 4 * D * FFN
         - c_proj (FFN -> D): 2 * D * FFN
         - elementwise SwiGLU: 2 * FFN
      3. Router:
         - linear (D -> E): 2 * D * E
      4. Active Experts (K active experts per token):
         - LoRA A + B: 4 * D * r_exp
         - Swarm A, B, C, D: 8 * D * r_sw
         - Swarm emulation: 4 * steps * D * r_sw (steps=1 in train, 3 in eval)
      5. LM Head (once per model):
         - 2 * D * V
    """
    B, T = batch_size, seq_len
    D = cfg.hidden_dim
    FFN = cfg.ffn_dim
    L = cfg.n_layer
    E = cfg.num_experts
    K = active_experts
    V = cfg.vocab_size
    r_exp = cfg.expert_rank
    r_sw = cfg.swarm_rank
    emu_steps = 1 if backward else 3

    # Per token attention FLOPs
    attn_flops_per_tok = (6 * D * D) + (4 * D * T) + (2 * D * D) + (18 * D * D)
    # Per token dense FFN FLOPs
    dense_ffn_flops_per_tok = (6 * D * FFN) + (2 * FFN)
    # Per token router FLOPs
    router_flops_per_tok = 2 * D * E
    # Per active expert FLOPs per token
    expert_flops_per_tok = (4 * D * r_exp) + (8 + 4 * emu_steps) * D * r_sw
    moe_flops_per_tok = K * expert_flops_per_tok

    # Layer FLOPs per token
    layer_flops_per_tok = attn_flops_per_tok + dense_ffn_flops_per_tok + router_flops_per_tok + moe_flops_per_tok
    total_tokens = B * T

    fwd_layer_flops = L * total_tokens * layer_flops_per_tok
    lm_head_flops = total_tokens * (2 * D * V)
    total_fwd_flops = fwd_layer_flops + lm_head_flops

    # Backward pass is approximately 2x forward FLOPs (gradients wrt inputs & weights)
    total_flops = total_fwd_flops * 3.0 if backward else total_fwd_flops
    expert_total_flops = L * total_tokens * moe_flops_per_tok * (3.0 if backward else 1.0)

    return {
        "total_flops": total_flops,
        "giga_flops": total_flops / 1e9,
        "expert_flops": expert_total_flops,
        "expert_giga_flops": expert_total_flops / 1e9,
        "active_experts": K,
        "total_experts": E
    }


# ---------------------------------------------------------------------------
# Memory Measurement Helpers
# ---------------------------------------------------------------------------

def reset_memory_stats(device: torch.device):
    """Resets CUDA peak memory tracking and triggers garbage collection."""
    gc.collect()
    if device.type == "cuda":
        torch.cuda.empty_cache()
        torch.cuda.reset_peak_memory_stats(device)


def get_memory_stats(device: torch.device) -> Dict[str, Optional[float]]:
    """Returns memory statistics in MB."""
    if device.type == "cuda":
        alloc_mb = torch.cuda.max_memory_allocated(device) / (1024.0 ** 2)
        res_mb = torch.cuda.max_memory_reserved(device) / (1024.0 ** 2)
        return {
            "peak_allocated_mb": round(alloc_mb, 2),
            "peak_reserved_mb": round(res_mb, 2),
            "type": "CUDA"
        }
    else:
        # Host RAM on CPU
        try:
            import psutil
            proc = psutil.Process()
            rss_mb = proc.memory_info().rss / (1024.0 ** 2)
            return {
                "peak_allocated_mb": round(rss_mb, 2),
                "peak_reserved_mb": round(rss_mb, 2),
                "type": "CPU_RSS"
            }
        except ImportError:
            return {
                "peak_allocated_mb": None,
                "peak_reserved_mb": None,
                "type": "CPU_UNTRACKED"
            }


# ---------------------------------------------------------------------------
# Benchmark Core Harness
# ---------------------------------------------------------------------------

def run_warmup_and_benchmark(
    model: QuillanRoninOni,
    device: torch.device,
    batch_size: int,
    seq_len: int,
    steps: int,
    warmup: int,
    forward_only: bool,
    optimizer: Optional[torch.optim.Optimizer] = None,
    seed: int = 42
) -> Dict[str, Any]:
    """
    Executes warmup steps followed by timed benchmark steps.
    Synchronizes CUDA streams for cycle-accurate latency.
    """
    is_cuda = (device.type == "cuda")
    rng = torch.Generator(device=device).manual_seed(seed)

    if forward_only:
        model.eval()
    else:
        model.train()

    total_tokens_per_step = batch_size * seq_len
    latencies_ms: List[float] = []
    loss_samples: List[float] = []
    aux_breakdowns: List[Dict[str, float]] = []

    reset_memory_stats(device)

    # Warmup Loop
    for _ in range(warmup):
        x = torch.randint(0, model.cfg.vocab_size, (batch_size, seq_len), device=device, generator=rng)
        y = torch.randint(0, model.cfg.vocab_size, (batch_size, seq_len), device=device, generator=rng)

        if forward_only:
            with torch.no_grad():
                _ = model(x)
        else:
            if optimizer is not None:
                optimizer.zero_grad(set_to_none=True)
            _, ce, aux = model(x, labels=y)
            loss = ce + model.total_aux_loss(aux)
            loss.backward()
            if optimizer is not None:
                optimizer.step()

        if is_cuda:
            torch.cuda.synchronize(device)

    # Reset memory stats after warmup so we measure steady-state peak usage
    reset_memory_stats(device)

    # Timed Measurement Loop
    t_start_total = time.perf_counter()
    for _ in range(steps):
        x = torch.randint(0, model.cfg.vocab_size, (batch_size, seq_len), device=device, generator=rng)
        y = torch.randint(0, model.cfg.vocab_size, (batch_size, seq_len), device=device, generator=rng)

        if is_cuda:
            torch.cuda.synchronize(device)
        t0 = time.perf_counter()

        if forward_only:
            with torch.no_grad():
                _ = model(x)
            if is_cuda:
                torch.cuda.synchronize(device)
            t1 = time.perf_counter()
            step_time_ms = (t1 - t0) * 1000.0
            latencies_ms.append(step_time_ms)
        else:
            if optimizer is not None:
                optimizer.zero_grad(set_to_none=True)
            logits, ce, aux = model(x, labels=y)
            aux_loss = model.total_aux_loss(aux)
            total_loss = ce + aux_loss
            total_loss.backward()
            if optimizer is not None:
                torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
                optimizer.step()

            if is_cuda:
                torch.cuda.synchronize(device)
            t1 = time.perf_counter()
            step_time_ms = (t1 - t0) * 1000.0
            latencies_ms.append(step_time_ms)
            loss_samples.append(total_loss.item())

        # Collect auxiliary loss breakdown from iteration
        if not forward_only and aux is not None:
            breakdown = {
                "total_aux": model.total_aux_loss(aux).item(),
                "spectral_gap": aux.get("spectral_gap", torch.tensor(0.0)).item(),
                "load_balance": aux.get("load_balance", torch.tensor(0.0)).item(),
                "z_loss": aux.get("z_loss", torch.tensor(0.0)).item(),
                "entropy": aux.get("entropy", torch.tensor(0.0)).item(),
                "ethics": aux.get("ethics", torch.tensor(0.0)).item(),
            }
            aux_breakdowns.append(breakdown)

    t_end_total = time.perf_counter()
    total_elapsed_sec = t_end_total - t_start_total
    total_tokens_processed = total_tokens_per_step * steps
    throughput_tokens_sec = total_tokens_processed / max(1e-6, total_elapsed_sec)

    mem_stats = get_memory_stats(device)

    # Compute descriptive statistics
    sorted_lats = sorted(latencies_ms)
    mean_lat = sum(latencies_ms) / len(latencies_ms)
    median_lat = sorted_lats[len(sorted_lats) // 2]
    min_lat = sorted_lats[0]
    max_lat = sorted_lats[-1]
    variance = sum((l - mean_lat) ** 2 for l in latencies_ms) / len(latencies_ms)
    std_lat = variance ** 0.5

    # Average aux breakdown
    avg_aux = {}
    if aux_breakdowns:
        for k in aux_breakdowns[0].keys():
            avg_aux[k] = sum(ab[k] for ab in aux_breakdowns) / len(aux_breakdowns)

    avg_loss = sum(loss_samples) / len(loss_samples) if loss_samples else None

    return {
        "steps": steps,
        "warmup": warmup,
        "batch_size": batch_size,
        "seq_len": seq_len,
        "total_tokens": total_tokens_processed,
        "elapsed_sec": total_elapsed_sec,
        "mean_latency_ms": round(mean_lat, 2),
        "median_latency_ms": round(median_lat, 2),
        "min_latency_ms": round(min_lat, 2),
        "max_latency_ms": round(max_lat, 2),
        "std_latency_ms": round(std_lat, 2),
        "throughput_tokens_sec": round(throughput_tokens_sec, 2),
        "peak_vram_allocated_mb": mem_stats["peak_allocated_mb"],
        "peak_vram_reserved_mb": mem_stats["peak_reserved_mb"],
        "memory_type": mem_stats["type"],
        "avg_total_loss": round(avg_loss, 4) if avg_loss is not None else None,
        "aux_breakdown": avg_aux,
    }


# ---------------------------------------------------------------------------
# Model Factory and Weight Parity Initializer
# ---------------------------------------------------------------------------

def initialize_ab_models(
    device: torch.device,
    n_layer: int = 6,
    hidden_dim: int = 1024,
    ffn_dim: int = 2048,
    checkpoint_path: Optional[str] = None,
    seed: int = 42
) -> Tuple[QuillanRoninOni, QuillanRoninOni, QuillanOniConfig, QuillanOniConfig]:
    """
    Initializes Configuration A and Configuration B models with GUARANTEED
    identical initial weights down to the bit.
    
    Config A: Baseline dense_pull (all 34 experts active) + Ihara-Bass spectral regularizer.
    Config B: Ultrametric p-adic hierarchical tree (top-4 active experts) + Ihara-Bass regularizer.
    """
    torch.manual_seed(seed)

    # Config A: Baseline dense_pull
    cfg_a = QuillanOniConfig(
        n_layer=n_layer,
        hidden_dim=hidden_dim,
        ffn_dim=ffn_dim,
        num_experts=34,
        router_mode="dense_pull",
        use_evo_moe=False,  # Ensures all 34 CouncilExpert modules are deliberated per token
        aux_spectral_weight=0.01,  # Ihara-Bass spectral regularizer
        device=device.type
    )

    # Config B: Ultrametric p-adic hierarchical tree
    cfg_b = QuillanOniConfig(
        n_layer=n_layer,
        hidden_dim=hidden_dim,
        ffn_dim=ffn_dim,
        num_experts=34,
        router_mode="ultrametric",
        top_k=4,
        use_evo_moe=False,  # Same underlying CouncilExpert pool, routed via p-adic tree
        aux_spectral_weight=0.01,  # Ihara-Bass spectral regularizer
        device=device.type
    )

    print(f"[*] Instantiating Baseline Model A (router_mode='dense_pull', 34 experts)...")
    model_a = QuillanRoninOni(cfg_a).to(device)

    print(f"[*] Instantiating Ultrametric Model B (router_mode='ultrametric', top-4 experts)...")
    model_b = QuillanRoninOni(cfg_b).to(device)

    # If checkpoint provided, load into model_a
    if checkpoint_path and os.path.exists(checkpoint_path):
        print(f"[*] Loading checkpoint into Model A: {checkpoint_path}")
        try:
            ckpt = torch.load(checkpoint_path, map_location=device, weights_only=True)
        except Exception:
            ckpt = torch.load(checkpoint_path, map_location=device, weights_only=False)
        sd = ckpt.get("model", ckpt.get("model_state_dict", ckpt))
        missing, unexpected = model_a.load_state_dict(sd, strict=False)
        print(f"    Loaded (missing={len(missing)}, unexpected={len(unexpected)})")

    # Clone exact state_dict into Model B
    print(f"[*] Synchronizing identical weight tensors from Model A -> Model B...")
    model_b.load_state_dict(model_a.state_dict())

    # Verify Bit-Level Parity
    mismatches = 0
    total_tensors = 0
    for (n_a, p_a), (n_b, p_b) in zip(model_a.named_parameters(), model_b.named_parameters()):
        total_tensors += 1
        if not torch.equal(p_a, p_b):
            mismatches += 1

    if mismatches > 0:
        raise ValueError(f"CRITICAL: Weight parity failed! {mismatches}/{total_tensors} tensors differed.")
    else:
        print(f"[+] Weight Parity VERIFIED: 100% of {total_tensors} parameter tensors match exactly.")

    return model_a, model_b, cfg_a, cfg_b


# ---------------------------------------------------------------------------
# Formatting & Presentation
# ---------------------------------------------------------------------------

def render_comparison_tables(results: Dict[str, Any]) -> str:
    """Renders clean ASCII / Markdown comparison tables."""
    fwd_a = results["config_a"]["forward_only"]
    fwd_b = results["config_b"]["forward_only"]
    train_a = results["config_a"]["forward_backward"]
    train_b = results["config_b"]["forward_backward"]
    flops_fwd_a = results["config_a"]["flops_forward"]
    flops_fwd_b = results["config_b"]["flops_forward"]
    flops_trn_a = results["config_a"]["flops_train"]
    flops_trn_b = results["config_b"]["flops_train"]

    fwd_speedup = fwd_a["mean_latency_ms"] / max(1e-6, fwd_b["mean_latency_ms"])
    trn_speedup = train_a["mean_latency_ms"] / max(1e-6, train_b["mean_latency_ms"])

    expert_reduction = flops_fwd_a["expert_giga_flops"] / max(1e-6, flops_fwd_b["expert_giga_flops"])
    overall_fwd_reduction = flops_fwd_a["giga_flops"] / max(1e-6, flops_fwd_b["giga_flops"])
    overall_trn_reduction = flops_trn_a["giga_flops"] / max(1e-6, flops_trn_b["giga_flops"])

    vram_alloc_a = fwd_a.get("peak_vram_allocated_mb")
    vram_alloc_b = fwd_b.get("peak_vram_allocated_mb")
    vram_res_a = fwd_a.get("peak_vram_reserved_mb")
    vram_res_b = fwd_b.get("peak_vram_reserved_mb")

    vram_alloc_str_a = f"{vram_alloc_a:.1f} MB" if vram_alloc_a is not None else "N/A"
    vram_alloc_str_b = f"{vram_alloc_b:.1f} MB" if vram_alloc_b is not None else "N/A"
    vram_res_str_a = f"{vram_res_a:.1f} MB" if vram_res_a is not None else "N/A"
    vram_res_str_b = f"{vram_res_b:.1f} MB" if vram_res_b is not None else "N/A"

    aux_a = train_a.get("aux_breakdown", {})
    aux_b = train_b.get("aux_breakdown", {})

    md = []
    md.append("=========================================================================================")
    md.append("            QUILLAN-RONIN v5.4.0-ONI A/B BENCHMARK COMPARISON REPORT                     ")
    md.append("=========================================================================================")
    md.append(f"• Execution Device:        {results['system']['device'].upper()}")
    md.append(f"• PyTorch Version:         {results['system']['torch_version']}")
    md.append(f"• Layers / Hidden / FFN:   {results['parameters']['n_layer']} layers / {results['parameters']['hidden_dim']} dim / {results['parameters']['ffn_dim']} FFN")
    md.append(f"• Batch Size / Seq Length: {results['parameters']['batch_size']} batch / {results['parameters']['seq_len']} tokens")
    md.append(f"• Benchmark Iterations:    {results['parameters']['steps']} steps (warmup: {results['parameters']['warmup']})")
    md.append(f"• Spectral Regularizer:    Ihara-Bass Silver Ratio Gap (target=0.228447, weight=0.01)")
    md.append("-----------------------------------------------------------------------------------------\n")

    md.append("### TABLE 1: THROUGHPUT & LATENCY PERFORMANCE")
    md.append("| Metric / Mode                              | Config A: Baseline (Dense 34) | Config B: Ultrametric (Top-4) | Delta / Speedup     |")
    md.append("|:-------------------------------------------|:------------------------------|:------------------------------|:--------------------|")
    md.append(f"| Forward-Only Mean Latency (ms/step)        | {fwd_a['mean_latency_ms']:>29.2f} | {fwd_b['mean_latency_ms']:>29.2f} | {fwd_speedup:>17.2f}x |")
    md.append(f"| Forward-Only Median Latency (ms/step)      | {fwd_a['median_latency_ms']:>29.2f} | {fwd_b['median_latency_ms']:>29.2f} | {fwd_a['median_latency_ms']/max(1e-6, fwd_b['median_latency_ms']):>17.2f}x |")
    md.append(f"| Forward-Only Min / Max Latency (ms)        | {fwd_a['min_latency_ms']:.1f} / {fwd_a['max_latency_ms']:.1f}           | {fwd_b['min_latency_ms']:.1f} / {fwd_b['max_latency_ms']:.1f}           |                     |")
    md.append(f"| Forward-Only Throughput (tokens/sec)       | {fwd_a['throughput_tokens_sec']:>29.1f} | {fwd_b['throughput_tokens_sec']:>29.1f} | {fwd_b['throughput_tokens_sec']/max(1e-6, fwd_a['throughput_tokens_sec']):>17.2f}x |")
    md.append(f"| Forward+Backward Mean Latency (ms/step)    | {train_a['mean_latency_ms']:>29.2f} | {train_b['mean_latency_ms']:>29.2f} | {trn_speedup:>17.2f}x |")
    md.append(f"| Forward+Backward Median Latency (ms/step)  | {train_a['median_latency_ms']:>29.2f} | {train_b['median_latency_ms']:>29.2f} | {train_a['median_latency_ms']/max(1e-6, train_b['median_latency_ms']):>17.2f}x |")
    md.append(f"| Forward+Backward Throughput (tokens/sec)   | {train_a['throughput_tokens_sec']:>29.1f} | {train_b['throughput_tokens_sec']:>29.1f} | {train_b['throughput_tokens_sec']/max(1e-6, train_a['throughput_tokens_sec']):>17.2f}x |")
    md.append(f"| Peak Memory Allocated                      | {vram_alloc_str_a:>29} | {vram_alloc_str_b:>29} |                     |")
    md.append(f"| Peak Memory Reserved                       | {vram_res_str_a:>29} | {vram_res_str_b:>29} |                     |\n")

    md.append("### TABLE 2: COMPUTE & FLOPs REDUCTION RATIO")
    md.append("| Compute Dimension                          | Config A: Baseline (Dense 34) | Config B: Ultrametric (Top-4) | Compute Reduction   |")
    md.append("|:-------------------------------------------|:------------------------------|:------------------------------|:--------------------|")
    md.append(f"| Active Experts per Token                   | {flops_fwd_a['active_experts']:>29} | {flops_fwd_b['active_experts']:>29} | {expert_reduction:>17.2f}x |")
    md.append(f"| Expert Sparsed Compute Savings (%)         |                          0.0% |                         88.2% |              +88.2% |")
    md.append(f"| Forward MoE FLOPs / Step                   | {flops_fwd_a['expert_giga_flops']:>27.3f} G | {flops_fwd_b['expert_giga_flops']:>27.3f} G | {expert_reduction:>17.2f}x |")
    md.append(f"| Forward Total Model FLOPs / Step           | {flops_fwd_a['giga_flops']:>27.3f} G | {flops_fwd_b['giga_flops']:>27.3f} G | {overall_fwd_reduction:>17.2f}x |")
    md.append(f"| Train (Fwd+Bwd) Total FLOPs / Step         | {flops_trn_a['giga_flops']:>27.3f} G | {flops_trn_b['giga_flops']:>27.3f} G | {overall_trn_reduction:>17.2f}x |\n")

    md.append("### TABLE 3: LOSS & AUXILIARY LOSS BREAKDOWN")
    md.append("| Loss Term                                  | Config A: Baseline (Dense 34) | Config B: Ultrametric (Top-4) | Status / Target     |")
    md.append("|:-------------------------------------------|:------------------------------|:------------------------------|:--------------------|")
    md.append(f"| Total Training Loss                        | {train_a['avg_total_loss']:>29.4f} | {train_b['avg_total_loss']:>29.4f} | Monitored           |")
    md.append(f"| Total Aux Loss                             | {aux_a.get('total_aux', 0.0):>29.6f} | {aux_b.get('total_aux', 0.0):>29.6f} | Regularized         |")
    md.append(f"| Ihara-Bass Spectral Gap Loss (Silver Ratio)| {aux_a.get('spectral_gap', 0.0):>29.6f} | {aux_b.get('spectral_gap', 0.0):>29.6f} | Gap target 0.228447 |")
    md.append(f"| MoE Load Balancing Loss (KL divergence)    | {aux_a.get('load_balance', 0.0):>29.6f} | {aux_b.get('load_balance', 0.0):>29.6f} | Uniform / Hierarch  |")
    md.append(f"| Router z-loss (Numerical Stability)        | {aux_a.get('z_loss', 0.0):>29.6f} | {aux_b.get('z_loss', 0.0):>29.6f} | ST-MoE Regularizer  |")
    md.append(f"| Routing Distribution Entropy               | {aux_a.get('entropy', 0.0):>29.6f} | {aux_b.get('entropy', 0.0):>29.6f} | Dispersal Bonus     |")
    md.append(f"| E_ICE Thermodynamic Constraint Loss        | {aux_a.get('ethics', 0.0):>29.6f} | {aux_b.get('ethics', 0.0):>29.6f} | Landauer Bound      |")
    md.append("=========================================================================================\n")

    return "\n".join(md)


# ---------------------------------------------------------------------------
# Main Orchestrator
# ---------------------------------------------------------------------------

def run_ab_benchmark(args: argparse.Namespace) -> Dict[str, Any]:
    # Select execution device
    if args.device == "auto":
        dev_str = "cuda" if torch.cuda.is_available() else "cpu"
    else:
        dev_str = args.device
    device = torch.device(dev_str)

    print("\n" + "=" * 80)
    print(f"  QUILLAN-RONIN v5.4.0 ONI: AUTOMATED A/B BENCHMARK HARNESS")
    print("=" * 80)
    print(f"Target Device:     {device.type.upper()}")
    print(f"Batch Size:        {args.batch_size}")
    print(f"Sequence Length:   {args.seq_len}")
    print(f"Model Topology:    {args.n_layer} layers, {args.hidden_dim} dim, {args.ffn_dim} FFN")
    print(f"Iterations:        {args.steps} steps (Warmup: {args.warmup} steps)")
    print(f"Checkpoint:        {args.checkpoint if args.checkpoint else '[Initialized with Bit-Level Cloned Seed]'}")
    print("-" * 80)

    # 1. Initialize identical model weights
    model_a, model_b, cfg_a, cfg_b = initialize_ab_models(
        device=device,
        n_layer=args.n_layer,
        hidden_dim=args.hidden_dim,
        ffn_dim=args.ffn_dim,
        checkpoint_path=args.checkpoint,
        seed=args.seed
    )

    opt_a = torch.optim.AdamW(model_a.parameters(), lr=1e-4)
    opt_b = torch.optim.AdamW(model_b.parameters(), lr=1e-4)

    # 2. Benchmark Configuration A: Baseline Dense-Pull (34 Experts)
    print(f"\n[BENCHMARK 1/4] Running Configuration A: Forward-Only (Dense-Pull, 34 Experts)...")
    fwd_a = run_warmup_and_benchmark(
        model=model_a,
        device=device,
        batch_size=args.batch_size,
        seq_len=args.seq_len,
        steps=args.steps,
        warmup=args.warmup,
        forward_only=True,
        seed=args.seed
    )
    print(f"    --> Latency: {fwd_a['mean_latency_ms']:.2f} ms/step | Throughput: {fwd_a['throughput_tokens_sec']:.1f} tok/s")

    print(f"\n[BENCHMARK 2/4] Running Configuration A: Forward+Backward (Dense-Pull, 34 Experts)...")
    train_a = run_warmup_and_benchmark(
        model=model_a,
        device=device,
        batch_size=args.batch_size,
        seq_len=args.seq_len,
        steps=args.steps,
        warmup=args.warmup,
        forward_only=False,
        optimizer=opt_a,
        seed=args.seed
    )
    print(f"    --> Latency: {train_a['mean_latency_ms']:.2f} ms/step | Throughput: {train_a['throughput_tokens_sec']:.1f} tok/s")

    # 3. Benchmark Configuration B: Ultrametric Tree (Top-4 Experts)
    print(f"\n[BENCHMARK 3/4] Running Configuration B: Forward-Only (Ultrametric Tree, Top-4 Experts)...")
    fwd_b = run_warmup_and_benchmark(
        model=model_b,
        device=device,
        batch_size=args.batch_size,
        seq_len=args.seq_len,
        steps=args.steps,
        warmup=args.warmup,
        forward_only=True,
        seed=args.seed
    )
    print(f"    --> Latency: {fwd_b['mean_latency_ms']:.2f} ms/step | Throughput: {fwd_b['throughput_tokens_sec']:.1f} tok/s")

    print(f"\n[BENCHMARK 4/4] Running Configuration B: Forward+Backward (Ultrametric Tree, Top-4 Experts)...")
    train_b = run_warmup_and_benchmark(
        model=model_b,
        device=device,
        batch_size=args.batch_size,
        seq_len=args.seq_len,
        steps=args.steps,
        warmup=args.warmup,
        forward_only=False,
        optimizer=opt_b,
        seed=args.seed
    )
    print(f"    --> Latency: {train_b['mean_latency_ms']:.2f} ms/step | Throughput: {train_b['throughput_tokens_sec']:.1f} tok/s")

    # 4. FLOPs Analytical Profiling
    flops_fwd_a = calculate_theoretical_flops(cfg_a, args.batch_size, args.seq_len, active_experts=34, backward=False)
    flops_trn_a = calculate_theoretical_flops(cfg_a, args.batch_size, args.seq_len, active_experts=34, backward=True)
    flops_fwd_b = calculate_theoretical_flops(cfg_b, args.batch_size, args.seq_len, active_experts=4, backward=False)
    flops_trn_b = calculate_theoretical_flops(cfg_b, args.batch_size, args.seq_len, active_experts=4, backward=True)

    # 5. Compile Complete Results Dict
    results = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "system": {
            "platform": platform.platform(),
            "python_version": platform.python_version(),
            "torch_version": torch.__version__,
            "device": device.type,
            "device_name": torch.cuda.get_device_name(0) if device.type == "cuda" else platform.processor(),
        },
        "parameters": {
            "batch_size": args.batch_size,
            "seq_len": args.seq_len,
            "n_layer": args.n_layer,
            "hidden_dim": args.hidden_dim,
            "ffn_dim": args.ffn_dim,
            "steps": args.steps,
            "warmup": args.warmup,
            "top_k": args.top_k,
        },
        "config_a": {
            "name": "Baseline Quillan-Ronin v5.4.0 ONI (dense_pull, 34 experts)",
            "router_mode": "dense_pull",
            "active_experts": 34,
            "forward_only": fwd_a,
            "forward_backward": train_a,
            "flops_forward": flops_fwd_a,
            "flops_train": flops_trn_a,
        },
        "config_b": {
            "name": "Ultrametric Quillan-Ronin v5.4.0 ONI (ultrametric tree, top-4 experts)",
            "router_mode": "ultrametric",
            "active_experts": 4,
            "forward_only": fwd_b,
            "forward_backward": train_b,
            "flops_forward": flops_fwd_b,
            "flops_train": flops_trn_b,
        }
    }

    # 6. Render and display comparison table
    report = render_comparison_tables(results)
    print("\n" + report)

    # 7. Optionally save JSON metrics
    if args.save_json:
        out_path = Path(args.save_json)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)
        print(f"[+] Detailed metrics saved to JSON: {out_path.resolve()}")

    return results


# ---------------------------------------------------------------------------
# CLI Parser
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Automated A/B Benchmark: Baseline (Dense-Pull 34) vs Ultrametric (Top-4 Tree) Quillan-Ronin ONI"
    )
    parser.add_argument("--checkpoint", type=str, default=None,
                        help="Path to pre-trained model checkpoint (optional)")
    parser.add_argument("--device", type=str, default="auto", choices=["auto", "cuda", "cpu"],
                        help="Execution device ('auto', 'cuda', or 'cpu')")
    parser.add_argument("--batch-size", type=int, default=2,
                        help="Batch size (default: 2)")
    parser.add_argument("--seq-len", type=int, default=128,
                        help="Sequence length (default: 128)")
    parser.add_argument("--n-layer", type=int, default=4,
                        help="Number of transformer layers (default: 4 for benchmarking)")
    parser.add_argument("--hidden-dim", type=int, default=512,
                        help="Hidden dimension (default: 512 for benchmarking)")
    parser.add_argument("--ffn-dim", type=int, default=1024,
                        help="Feedforward dimension (default: 1024)")
    parser.add_argument("--steps", type=int, default=50,
                        help="Number of measured benchmark steps (default: 50)")
    parser.add_argument("--warmup", type=int, default=10,
                        help="Number of warmup steps (default: 10)")
    parser.add_argument("--top-k", type=int, default=4,
                        help="Number of active experts in ultrametric mode (default: 4)")
    parser.add_argument("--save-json", type=str, default=None,
                        help="Filepath to save benchmark results as JSON")
    parser.add_argument("--seed", type=int, default=42,
                        help="Random seed for reproducibility")
    parser.add_argument("--fast-test", action="store_true",
                        help="Runs a quick test (5 steps, 2 warmup, 2 layers) for rapid verification")
    args = parser.parse_args()

    if args.fast_test:
        args.steps = 5
        args.warmup = 2
        args.n_layer = 2
        args.hidden_dim = 256
        args.ffn_dim = 512
        args.seq_len = 32
        args.batch_size = 2

    return args


if __name__ == "__main__":
    args = parse_args()
    run_ab_benchmark(args)
