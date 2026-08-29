#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
[EXPORT] QUILLAN-RONIN v5.4.0-ONI: UNIFIED SAFETENSORS & GGUF EXPORTER
======================================================================
Exports trained checkpoints (quillan_oni_latest.pt) into:
1. Hugging Face SafeTensors (`model.safetensors` + `config.json`)
2. GGUF format (`quillan_oni_f16.gguf` / `quillan_oni_q4_k_m.gguf`) for Ollama/llama.cpp
"""

import os
import sys
import json
import time
import torch
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# SafeTensors export
try:
    from safetensors.torch import save_file as save_safetensors
    SAFETENSORS_AVAILABLE = True
except ImportError:
    SAFETENSORS_AVAILABLE = False

# GGUF export
try:
    import gguf
    from gguf import GGUFWriter, GGMLQuantizationType
    GGUF_AVAILABLE = True
except ImportError:
    GGUF_AVAILABLE = False


def export_to_safetensors(checkpoint_path: str, output_dir: str):
    print(f"\n[1/2] Exporting to SafeTensors...")
    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    
    ckpt = torch.load(checkpoint_path, map_location="cpu", weights_only=False)
    state_dict = ckpt.get("model", ckpt.get("model_state_dict", ckpt))
    cfg = ckpt.get("cfg", {})
    
    # Save config.json
    config_data = {
        "architectures": ["QuillanRoninOni"],
        "model_type": "quillan_oni",
        "version": "5.4.0-oni",
        "hidden_size": cfg.get("hidden_dim", 1024),
        "intermediate_size": cfg.get("ffn_dim", 2048),
        "num_hidden_layers": cfg.get("n_layer", 12),
        "num_attention_heads": cfg.get("n_head", 16),
        "vocab_size": cfg.get("vocab_size", 50257),
        "num_experts": cfg.get("num_experts", 34),
        "router_mode": cfg.get("router_mode", "dense_pull"),
        "expert_rank": cfg.get("expert_rank", 8),
        "swarm_rank": cfg.get("swarm_rank", 8),
        "tie_word_embeddings": True,
        "torch_dtype": "float32",
        "transformers_version": "4.45.0"
    }
    
    with open(out_dir / "config.json", "w", encoding="utf-8") as f:
        json.dump(config_data, f, indent=2)
    print(f"  Saved config.json to {out_dir / 'config.json'}")
    
    # Ensure clone/contiguous tensors to handle shared pointers cleanly
    clean_sd = {}
    for k, v in state_dict.items():
        if isinstance(v, torch.Tensor):
            clean_sd[k] = v.detach().clone().contiguous()
            
    if SAFETENSORS_AVAILABLE:
        st_path = out_dir / "model.safetensors"
        save_safetensors(clean_sd, str(st_path))
        print(f"  Successfully saved {len(clean_sd)} tensors to {st_path} ({st_path.stat().st_size / 1e6:.1f} MB)")
    else:
        pt_path = out_dir / "pytorch_model.bin"
        torch.save(clean_sd, str(pt_path))
        print(f"  SafeTensors library not found. Saved fallback PyTorch bin to {pt_path}")


def export_to_gguf(checkpoint_path: str, output_file: str):
    print(f"\n[2/2] Exporting to GGUF format...")
    if not GGUF_AVAILABLE:
        print("  gguf package not installed. Skipping GGUF export (install with `pip install gguf`).")
        return
        
    out_path = Path(output_file)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    
    ckpt = torch.load(checkpoint_path, map_location="cpu", weights_only=False)
    state_dict = ckpt.get("model", ckpt.get("model_state_dict", ckpt))
    cfg = ckpt.get("cfg", {})
    
    writer = GGUFWriter(str(out_path), "quillan")
    
    # Metadata
    writer.add_name("Quillan-Ronin-v5.4.0-ONI")
    writer.add_context_length(cfg.get("max_seq_len", 512))
    writer.add_embedding_length(cfg.get("hidden_dim", 1024))
    writer.add_block_count(cfg.get("n_layer", 12))
    writer.add_head_count(cfg.get("n_head", 16))
    writer.add_expert_count(cfg.get("num_experts", 34))
    
    tensor_count = 0
    for name, tensor in state_dict.items():
        if not isinstance(tensor, torch.Tensor):
            continue
        t_data = tensor.detach().float().numpy()
        writer.add_tensor(name, t_data)
        tensor_count += 1
        
    writer.write_header_to_file()
    writer.write_kv_data_to_file()
    writer.write_tensors_to_file()
    writer.close()
    
    print(f"  Successfully saved {tensor_count} tensors to {out_path} ({out_path.stat().st_size / 1e6:.1f} MB)")


def main():
    ckpt_path = r"c:\02_QUILLAN\checkpoints\checkpoints_oni\quillan_oni_latest.pt"
    if not os.path.exists(ckpt_path):
        ckpt_path = r"c:\02_QUILLAN\oni\checkpoint_step_500.pt"
        
    export_dir = r"c:\02_QUILLAN\exports\v5_4_oni"
    gguf_out = r"c:\02_QUILLAN\exports\v5_4_oni\quillan_oni_f16.gguf"
    
    print("=" * 75)
    print("[EXPORT] QUILLAN-RONIN v5.4.0-ONI EXPORT PIPELINE")
    print(f"Source Checkpoint: {ckpt_path}")
    print("=" * 75)
    
    export_to_safetensors(ckpt_path, export_dir)
    export_to_gguf(ckpt_path, gguf_out)
    
    print("\n" + "=" * 75)
    print("[SUCCESS] EXPORT PIPELINE COMPLETE")
    print("=" * 75)

if __name__ == "__main__":
    main()
