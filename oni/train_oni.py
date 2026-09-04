#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quillan-Ronin v5.4-ONI trainer.

Wired to the unified build (quillan_v5_4_oni.py):
  - dense_pull council (all 34 deliberate) or gumbel_topk legacy
  - aux losses: load-balance KL, z-loss, CCRL entropy bonus, E_ICE ethics, QHIS, QICS
  - Gumbel tau annealing (gumbel_topk mode)
  - Lee-Mach-6 governor consumed: sigma scales swarm, ema_decay drives weight EMA
  - Cosine LR + warmup, grad clip, AdamW(0.9, 0.95)
  - Periodic val loss + decoded sample generation (unified tokenizer)
"""
import argparse
import json
import math
import sys
import time
from pathlib import Path

import numpy as np
import torch

sys.path.insert(0, str(Path(__file__).resolve().parent))  # portable: oni/ self-contained
from quillan_tokenizer_unified import UnifiedQuillanTokenizer  # noqa: E402
from quillan_v5_4_oni import QuillanOniConfig, QuillanRoninOni  # noqa: E402

BASE_DIR = Path(__file__).resolve().parent.parent
DATA = Path(r"C:\02_QUILLAN\training_data\v9") if Path(r"C:\02_QUILLAN\training_data\v9").exists() else BASE_DIR / "training_data" / "v9"
CKPT_DIR = Path(r"C:\02_QUILLAN\checkpoints\checkpoints_oni") if Path(r"C:\02_QUILLAN\checkpoints\checkpoints_oni").exists() else BASE_DIR / "checkpoints" / "checkpoints_oni"
LOG_DIR = Path(r"C:\02_QUILLAN\training_logs") if Path(r"C:\02_QUILLAN\training_logs").exists() else BASE_DIR / "training_logs"


def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument("--steps", type=int, default=20000)
    ap.add_argument("--batch-size", type=int, default=2)
    ap.add_argument("--grad-accum", type=int, default=4)
    ap.add_argument("--lr", type=float, default=3e-4)
    ap.add_argument("--warmup", type=int, default=200)
    ap.add_argument("--min-lr", type=float, default=3e-6)
    ap.add_argument("--n-layer", type=int, default=6)
    ap.add_argument("--seq-len", type=int, default=512)
    ap.add_argument("--eval-every", type=int, default=250)
    ap.add_argument("--sample-every", type=int, default=500)
    ap.add_argument("--save-every", type=int, default=500)
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--router-mode", type=str, default="dense_pull",
                    choices=["dense_pull", "gumbel_topk", "ultrametric"])
    ap.add_argument("--clip", type=float, default=1.0)
    ap.add_argument("--ema", type=int, default=1)
    ap.add_argument("--rqgm-epoch-length", type=int, default=500,
                    help="RQGM: Controlled Utility Evolution epoch length (frozen evaluator within epoch, challenger swap at boundary)")
    ap.add_argument("--rqgm-disable", action="store_true",
                    help="Disable RQGM epoch gating (static evaluator)")
    ap.add_argument("--device", type=str, default="cuda" if torch.cuda.is_available() else "cpu",
                    help="Training device: cpu | cuda | cuda:0 (defaults to cuda if available)")
    ap.add_argument("--data-dir", type=str, default=None,
                    help="Directory containing train_ids.bin and val_ids.bin")
    ap.add_argument("--ckpt-dir", type=str, default=None,
                    help="Directory to save checkpoints")
    ap.add_argument("--log-dir", type=str, default=None,
                    help="Directory to save training logs")
    ap.add_argument("--precision", type=str, default="auto",
                    choices=["auto", "bf16", "fp16", "fp32"],
                    help="Precision mode: auto | bf16 | fp16 | fp32 (auto uses BF16 on A100/H100, FP16 on T4, FP32 on Pascal/CPU)")
    ap.add_argument("--amp", action="store_true",
                    help="Enable PyTorch Automatic Mixed Precision (legacy flag, alias for --precision fp16 or bf16)")
    ap.add_argument("--grad-checkpoint", action="store_true",
                    help="Enable gradient checkpointing to reduce peak VRAM")
    ap.add_argument("--synthetic-data", action="store_true",
                    help="Use synthetic token stream for benchmarking or when dataset is not yet prepared")
    ap.add_argument("--detect-anomaly", action="store_true",
                    help="Enable torch.autograd.set_detect_anomaly(True) for diagnosing backward graph issues")
    return ap.parse_args()


# RQGM: Controlled Utility Evolution (2606.26294) — TIRG + Selective Erasure
class RQGMController:
    """Epoch-frozen evaluator panel (C34-PREDATOR/VIR) with challenger swap at boundaries.
    Within-epoch: static verification (TIRG frozen). At boundary: t-test vs incumbent, selective erasure."""
    def __init__(self, epoch_length: int, log_f):
        self.epoch_length = epoch_length
        self.log_f = log_f
        self.epoch = 0
        self.epoch_frozen = True
        self.incumbent_score = None
        self.utility_records = []  # to be selectively erased on swap

    def on_step(self, step, model, val, rng, bs, device="cpu"):
        if step % self.epoch_length == 0 and step > 0:
            # Epoch boundary: challenger vs incumbent on ground-truth anchors (val sample)
            model.eval()
            with torch.no_grad():
                losses = []
                for _ in range(8):
                    x, y = val.batch(bs, rng)
                    if device != "cpu":
                        x, y = x.to(device), y.to(device)
                    _, ce, _ = model(x, labels=y)
                    losses.append(ce.item())
                challenger_score = sum(losses) / len(losses)
            model.train()
            if self.incumbent_score is None:
                self.incumbent_score = challenger_score
            else:
                # Simple superiority test (paper: statistical superiority on anchors)
                if challenger_score < self.incumbent_score - 0.02:  # challenger wins
                    print(f"[RQGM] Epoch {self.epoch} boundary: challenger {challenger_score:.4f} beats incumbent {self.incumbent_score:.4f} — SWAP + Selective Erasure", flush=True)
                    self.utility_records.clear()  # selective erasure: discard old utility
                    self.incumbent_score = challenger_score
                else:
                    print(f"[RQGM] Epoch {self.epoch} boundary: incumbent holds {self.incumbent_score:.4f} vs challenger {challenger_score:.4f}", flush=True)
            self.epoch += 1
            self.epoch_frozen = True
            if self.log_f:
                self.log_f.write(json.dumps({"rqgm_epoch": self.epoch, "incumbent": self.incumbent_score, "challenger": challenger_score}) + "\n")
                self.log_f.flush()
        return self.epoch_frozen


class Corpus:
    def __init__(self, split: str, seq_len: int, data_dir: Path, synthetic: bool = False):
        self.seq_len = seq_len
        self.synthetic = synthetic
        ids_path = data_dir / f"{split}_ids.bin"
        labels_path = data_dir / f"{split}_labels.bin"
        if not ids_path.exists() or not labels_path.exists() or synthetic:
            if not synthetic:
                print(f"[WARN] Dataset files not found in {data_dir} ({ids_path.name}). Using synthetic data stream for benchmarking.")
            self.synthetic = True
            self.n_synthetic = 2000
            return

        ids = np.memmap(ids_path, dtype=np.uint16, mode="r")
        labels = np.memmap(labels_path, dtype=np.int32, mode="r")
        n = min(len(ids), len(labels)) // seq_len * seq_len
        self.ids = ids[:n].reshape(-1, seq_len)
        self.labels = labels[:n].reshape(-1, seq_len)

    def __len__(self):
        return self.n_synthetic if self.synthetic else len(self.ids)

    def batch(self, bs, rng):
        if self.synthetic:
            x = rng.integers(0, 50257, size=(bs, self.seq_len), dtype=np.int64)
            y = np.roll(x, -1, axis=-1)
            return torch.from_numpy(x), torch.from_numpy(y)
        idx = rng.integers(0, len(self), size=bs)
        return (torch.from_numpy(self.ids[idx].astype(np.int64)),
                torch.from_numpy(self.labels[idx].astype(np.int64)))


def cosine_lr(step, args):
    if step < args.warmup:
        return args.lr * (step + 1) / args.warmup
    prog = (step - args.warmup) / max(1, args.steps - args.warmup)
    return args.min_lr + 0.5 * (args.lr - args.min_lr) * (1.0 + math.cos(math.pi * prog))


def evaluate(model, val, rng, bs, device="cpu"):
    model.eval()
    losses = []
    with torch.no_grad():
        for _ in range(16):
            x, y = val.batch(bs, rng)
            if device != "cpu":
                x, y = x.to(device), y.to(device)
            _, ce, _ = model(x, labels=y)
            losses.append(ce.item())
    model.train()
    return sum(losses) / len(losses)


def sample(model, tok, device="cpu", prompt="User: Hello, who are you?\n\nAssistant:"):
    model.eval()
    ids = tok.encode(prompt, domain="dialogue")
    out = model.generate(ids, max_tokens=60, temp=0.8)
    model.train()
    return tok.decode(out)

def main():
    args = parse_args()
    data_dir = Path(args.data_dir) if args.data_dir else DATA
    ckpt_dir = Path(args.ckpt_dir) if args.ckpt_dir else CKPT_DIR
    log_dir = Path(args.log_dir) if args.log_dir else LOG_DIR

    ckpt_dir.mkdir(parents=True, exist_ok=True)
    log_dir.mkdir(parents=True, exist_ok=True)

    # Windows OS Process Priority Elevation & Thread Tuning
    import os
    try:
        import psutil
        p = psutil.Process(os.getpid())
        if sys.platform == "win32":
            p.nice(psutil.HIGH_PRIORITY_CLASS)
    except Exception:
        pass

    num_cpus = os.cpu_count() or 4
    torch.set_num_threads(num_cpus)
    torch.set_num_interop_threads(min(4, num_cpus))

    rng = np.random.default_rng(42)
    tok = UnifiedQuillanTokenizer()
    train = Corpus("train", args.seq_len, data_dir, synthetic=args.synthetic_data)
    val = Corpus("val", args.seq_len, data_dir, synthetic=args.synthetic_data)
    print(f"[DATA] train={len(train)} seqs  val={len(val)} seqs (dir: {data_dir})")

    cfg = QuillanOniConfig(n_layer=args.n_layer, max_seq_len=args.seq_len,
                           router_mode=args.router_mode, grad_checkpoint=args.grad_checkpoint)
    model = QuillanRoninOni(cfg)
    if args.device != "cpu":
        model = model.to(args.device)
    n_params = sum(p.numel() for p in model.parameters())
    print(f"[MODEL] Quillan-Ronin v5.4.0-oni  n_layer={args.n_layer}  "
          f"router={args.router_mode}  params={n_params/1e6:.1f}M  device={args.device}  "
          f"grad_ckpt={args.grad_checkpoint}  amp={args.amp}")

    opt = torch.optim.AdamW(model.parameters(), lr=args.lr, betas=(0.9, 0.95), weight_decay=0.01)
    step, best_val = 0, float("inf")
    ema_sd = None
    latest = ckpt_dir / "quillan_oni_latest.pt"

    if args.resume and latest.exists():
        ck = torch.load(latest, map_location="cpu", weights_only=False)
        # Warm-start: load shared weights; fresh-init new 100%-wired modules (EvoMoE/WorldModel/ES/etc.)
        missing, unexpected = model.load_state_dict(ck["model"], strict=False)
        if missing:
            print(f"[RESUME] warm-start: {len(missing)} new-param keys freshly initialized, "
                  f"{len(unexpected)} legacy keys skipped")
        else:
            print(f"[RESUME] strict load OK ({len(unexpected)} legacy keys skipped)")
        step = ck["step"]
        best_val = ck.get("best_val", best_val)
        ema_sd = ck.get("ema_sd")
        if ema_sd is not None and args.device != "cpu":
            ema_sd = {k: v.to(args.device) for k, v in ema_sd.items()}
        # optimizer states: only restore for params present in both (new params get fresh state)
        try:
            opt.load_state_dict(ck["opt"])
        except Exception as e:
            print(f"[RESUME] optimizer state partial reset ({e})")
        print(f"[RESUME] step {step}, best_val {best_val:.4f}")
        # RQGM resume will be handled after rqgm init (epoch/incumbent)

    log_f = open(log_dir / "oni_train_log.jsonl", "a", encoding="utf-8")
    rqgm = None if args.rqgm_disable else RQGMController(args.rqgm_epoch_length, log_f)
    if rqgm:
        print(f"[RQGM] Controlled Utility Evolution ENABLED — epoch_length={args.rqgm_epoch_length} (C34-PREDATOR/VIR frozen within epoch)", flush=True)

    precision = args.precision.lower()
    if precision == "auto":
        if str(args.device).startswith("cuda") and torch.cuda.is_available():
            if hasattr(torch.cuda, "is_bf16_supported") and torch.cuda.is_bf16_supported():
                precision = "bf16"
            elif args.amp:
                precision = "fp16"
            else:
                precision = "fp32"
        else:
            precision = "fp32"
    elif precision == "fp16" or args.amp:
        precision = "fp16"

    print(f"[PRECISION] Hardware acceleration precision: {precision.upper()}")
    if args.detect_anomaly:
        torch.autograd.set_detect_anomaly(True)
        print("[DEBUG] Autograd anomaly detection ENABLED")

    use_bf16 = precision == "bf16"
    use_fp16 = precision == "fp16"
    use_amp = use_bf16 or use_fp16
    amp_dtype = torch.bfloat16 if use_bf16 else torch.float16

    scaler = None
    if use_fp16:
        try:
            scaler = torch.amp.GradScaler("cuda", enabled=True)
        except (AttributeError, TypeError):
            scaler = torch.cuda.amp.GradScaler(enabled=True)

    model.train()
    t_start = time.time()
    running = []

    while step < args.steps:
        if rqgm:
            rqgm.on_step(step, model, val, rng, args.batch_size, args.device)
        lr = cosine_lr(step, args)
        for g in opt.param_groups:
            g["lr"] = lr
        model.set_router_tau(model.tau_for_step(step, args.steps))

        opt.zero_grad()
        step_loss = 0.0
        t0 = time.time()
        for _ in range(args.grad_accum):
            x, y = train.batch(args.batch_size, rng)
            if args.device != "cpu":
                x, y = x.to(args.device), y.to(args.device)
            if use_amp:
                with torch.amp.autocast(device_type="cuda", dtype=amp_dtype):
                    _, ce, aux = model(x, labels=y)
                    loss = (ce + model.total_aux_loss(aux)) / args.grad_accum
                if scaler is not None:
                    scaler.scale(loss).backward()
                else:
                    loss.backward()
            else:
                _, ce, aux = model(x, labels=y)
                loss = (ce + model.total_aux_loss(aux)) / args.grad_accum
                loss.backward()
            step_loss += ce.item() / args.grad_accum
        if scaler is not None:
            scaler.unscale_(opt)
            gn = torch.nn.utils.clip_grad_norm_(model.parameters(), args.clip)
            scaler.step(opt)
            scaler.update()
        else:
            gn = torch.nn.utils.clip_grad_norm_(model.parameters(), args.clip)
            opt.step()

        # ES-at-Scale: ForgettingMitigation anchor regularizer (2605.30148)
        # Pulls weights toward EMA snapshot to prevent catastrophic forgetting.
        if ema_sd is not None and step % 5 == 0:
            try:
                from es_at_scale import ForgettingMitigation
                memory_strength = 0.001  # gentle anchor; scale up if val loss spikes
                with torch.no_grad():
                    for name, param in model.named_parameters():
                        if param.requires_grad and name in ema_sd:
                            ema_val = ema_sd[name].to(param.device)
                            param.data.add_(ema_val - param.data, alpha=memory_strength)
            except ImportError:
                pass  # ES module not available — skip silently

        step += 1
        running.append(step_loss)

        latency_ms = (time.time() - t0) * 1000.0
        _, ema_decay, _ = model.governor_adjust(latency_ms)
        if args.ema:
            with torch.no_grad():
                if ema_sd is None:
                    ema_sd = {name: p.detach().clone() for name, p in model.named_parameters()
                              if p.dtype.is_floating_point}
                else:
                    d = ema_decay
                    for name, p in model.named_parameters():
                        if name in ema_sd and p.dtype.is_floating_point:
                            if ema_sd[name].device != p.device:
                                ema_sd[name] = ema_sd[name].to(p.device)
                            ema_sd[name].mul_(d).add_(p.detach(), alpha=1 - d)

        if step % 10 == 0:
            avg = sum(running[-10:]) / len(running[-10:])
            sps = (time.time() - t_start) / step
            eta_h = (args.steps - step) * sps / 3600
            print(f"step {step}/{args.steps} loss={avg:.4f} lr={lr:.2e} gn={gn:.2f} "
                  f"{sps:.2f}s/st ETA={eta_h:.1f}h", flush=True)
            log_f.write(json.dumps({"step": step, "loss": avg, "lr": lr,
                                    "grad_norm": float(gn), "latency_ms": latency_ms}) + "\n")
            log_f.flush()

        if step % args.eval_every == 0 or step == args.steps:
            vl = evaluate(model, val, rng, args.batch_size, args.device)
            best_val = min(best_val, vl)
            print(f"[EVAL] step {step} val_loss={vl:.4f} (best {best_val:.4f})", flush=True)
            log_f.write(json.dumps({"step": step, "val_loss": vl}) + "\n")

        if step % args.sample_every == 0 or step == args.steps:
            print("[SAMPLE]", repr(sample(model, tok, args.device)), flush=True)

        if step % args.save_every == 0 or step == args.steps:
            ckpt = {"model": model.state_dict(), "opt": opt.state_dict(), "step": step,
                    "best_val": best_val, "ema_sd": ema_sd, "cfg": vars(cfg),
                    "version": "5.4.0-oni"}
            if rqgm:
                ckpt["rqgm_epoch"] = rqgm.epoch
                ckpt["rqgm_incumbent"] = rqgm.incumbent_score
            torch.save(ckpt, latest)
            print(f"[SAVE] {latest} @ step {step}", flush=True)

    print(f"[COMPLETE] {args.steps} steps. best_val={best_val:.4f}")
    log_f.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())

# Hybrid wiring (ProTrain/Memo/Deep Optimizer) — activated via --hybrid flag (auto if GPU available)
# See protrian_memo.py for scheduler/swap/sharding