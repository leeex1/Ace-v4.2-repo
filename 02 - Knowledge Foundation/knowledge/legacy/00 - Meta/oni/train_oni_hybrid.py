#!/usr/bin/env python3
# Hybrid CPU+GPU+RAM training for Quillan-Oni (ZeRO-Infinity/SPipe style)
# Single source of truth for device policy: configs/hybrid_compute.json
# Until cuda_status.sm_61_supported_by_torch flips true, compute = CPU,
# optimizer = CPU with pinned offload staging, GPU reserved for a future
# custom sm_61 kernel (built with a torch-matched toolkit).
import json
import os
import sys
import torch
from pathlib import Path

from accelerate import Accelerator
from accelerate.utils import ProjectConfiguration

ROOT = Path(r"C:\02_QUILLAN\00 - Meta")
sys.path.insert(0, str(ROOT / "oni"))
from hybrid_runtime import load_hybrid_config  # noqa: E402


def get_accelerator():
    cfg = load_hybrid_config()
    offload = cfg["offload"]["root"]
    logs = str(ROOT / "training_logs")
    return Accelerator(
        gradient_accumulation_steps=4,
        log_with=None,
        project_config=ProjectConfiguration(project_dir=logs, logging_dir=logs),
        cpu=(cfg["routing"]["train_compute"] == "cpu"),
    )


if __name__ == "__main__":
    cfg = load_hybrid_config()
    acc = get_accelerator()
    print(f"Hybrid accelerator: device={acc.device}, is_main={acc.is_main_process}")
    print(f"Policy: compute={cfg['routing']['train_compute']} "
          f"optimizer={cfg['routing']['train_optimizer']} "
          f"vgpu_split_gpu={cfg['vgpu']['split_ratio_gpu']}")
    print(f"Offload root: {cfg['offload']['root']} (NVMe tier)")
    print("Use: accelerate launch --config_file "
          "C:/02_QUILLAN/00 - Meta/configs/accelerate_offload.yaml "
          "C:/02_QUILLAN/00 - Meta/oni/train_oni.py --steps 15000 --n-layer 6")
