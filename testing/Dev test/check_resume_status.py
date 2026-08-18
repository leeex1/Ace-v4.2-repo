import os
import sys
import torch
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

REPO_ROOT = Path(r"C:\02_QUILLAN")
ckpt_path = REPO_ROOT / "checkpoints" / "checkpoints_sft" / "quillan_thinking_reasoning_master.pt"

print("==================================================================")
print("   👑 CHECKING MASTER CHECKPOINT STATUS")
print("==================================================================")

if ckpt_path.exists():
    ckpt = torch.load(ckpt_path, map_location="cpu", weights_only=False)
    print(f"[+] Checkpoint Found: {ckpt_path.name}")
    print(f"    Saved Step:  {ckpt.get('step', 'N/A')}")
    print(f"    Best Loss:   {ckpt.get('loss', 'N/A')}")
    print(f"    Version:     {ckpt.get('version', 'N/A')}")
    sd = ckpt.get("model_state_dict", ckpt)
    print(f"    Total Tensors: {len(sd)}")
    if "ingestion.txt_emb.weight" in sd:
        print(f"    txt_emb Shape: {sd['ingestion.txt_emb.weight'].shape}")

print("\n[+] Status Check Complete!")
