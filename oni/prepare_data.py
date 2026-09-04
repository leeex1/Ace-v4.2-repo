#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quillan-Ronin v5.4.0 ONI — Dataset Preprocessor & Binary Packer
Converts raw text or JSONL files into memory-mapped .bin datasets (uint16 IDs, int32 Labels)
compatible with train_oni.py.
"""

import argparse
import json
import os
import sys
from pathlib import Path
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from quillan_tokenizer_unified import UnifiedQuillanTokenizer


def parse_args():
    parser = argparse.ArgumentParser(description="Pack raw text/JSONL into memory-mapped binary datasets for Quillan-Ronin training.")
    parser.add_argument("--input", type=str, required=True,
                        help="Path to raw .txt file, .jsonl file, or folder containing dataset files.")
    parser.add_argument("--output-dir", type=str, default=None,
                        help="Output directory to write train_ids.bin, train_labels.bin, val_ids.bin, val_labels.bin")
    parser.add_argument("--val-ratio", type=float, default=0.05,
                        help="Validation split ratio (default: 0.05 = 5 percent)")
    parser.add_argument("--max-samples", type=int, default=None,
                        help="Max number of samples to process (default: all)")
    return parser.parse_args()


def extract_texts(input_path: Path, max_samples: int = None):
    texts = []
    files = [input_path] if input_path.is_file() else sorted(list(input_path.glob("*.jsonl")) + list(input_path.glob("*.txt")))

    for f in files:
        print(f"[INGEST] Reading {f.name}...")
        if f.suffix == ".jsonl":
            with open(f, "r", encoding="utf-8", errors="replace") as fh:
                for line in fh:
                    if not line.strip():
                        continue
                    try:
                        data = json.loads(line)
                        if "prompt" in data and "response" in data:
                            texts.append(f"{data['prompt']}\n{data['response']}")
                        elif "text" in data:
                            texts.append(data["text"])
                        elif "content" in data:
                            texts.append(data["content"])
                    except Exception:
                        continue
                    if max_samples and len(texts) >= max_samples:
                        return texts
        else:
            with open(f, "r", encoding="utf-8", errors="replace") as fh:
                content = fh.read()
                chunks = [c.strip() for c in content.split("\n\n") if len(c.strip()) > 30]
                texts.extend(chunks)
                if max_samples and len(texts) >= max_samples:
                    return texts[:max_samples]
    return texts


def main():
    args = parse_args()
    input_path = Path(args.input)
    if not input_path.exists():
        print(f"[ERROR] Input path does not exist: {input_path}")
        sys.exit(1)

    base_dir = Path(__file__).resolve().parent.parent
    default_out = Path(r"C:\02_QUILLAN\training_data\v9") if Path(r"C:\02_QUILLAN\training_data\v9").exists() else base_dir / "training_data" / "v9"
    out_dir = Path(args.output_dir) if args.output_dir else default_out
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"===========================================================================")
    print(f"  QUILLAN-RONIN v5.4.0 ONI — DATASET PREPARATION & TOKEN PACKING")
    print(f"===========================================================================")
    print(f"Input Source: {input_path}")
    print(f"Output Target: {out_dir}")

    texts = extract_texts(input_path, args.max_samples)
    print(f"[INGEST] Total text samples extracted: {len(texts):,}")
    if not texts:
        print("[ERROR] No valid text content found to tokenize.")
        sys.exit(1)

    tok = UnifiedQuillanTokenizer()
    all_tokens = []
    print("[TOKENIZE] Encoding samples using UnifiedQuillanTokenizer...")
    for i, t in enumerate(texts):
        tokens = tok.encode(t, domain="general")
        tokens.append(tok.eos_token_id)
        all_tokens.extend(tokens)
        if (i + 1) % 5000 == 0:
            print(f"  Processed {i+1:,}/{len(texts):,} samples ({len(all_tokens):,} tokens)...")

    total_tokens = len(all_tokens)
    print(f"[TOKENIZE] Encoding complete: {total_tokens:,} tokens generated.")

    n_val = max(1024, int(total_tokens * args.val_ratio))
    n_train = total_tokens - n_val

    train_tokens = np.array(all_tokens[:n_train], dtype=np.uint16)
    val_tokens = np.array(all_tokens[n_train:], dtype=np.uint16)

    train_labels = np.roll(train_tokens, -1).astype(np.int32)
    val_labels = np.roll(val_tokens, -1).astype(np.int32)

    print(f"[EXPORT] Writing binary datasets to {out_dir}...")
    train_tokens.tofile(out_dir / "train_ids.bin")
    train_labels.tofile(out_dir / "train_labels.bin")
    val_tokens.tofile(out_dir / "val_ids.bin")
    val_labels.tofile(out_dir / "val_labels.bin")

    print(f"[SUCCESS] Dataset successfully packed:")
    print(f"  train_ids.bin:    {len(train_tokens):,} tokens ({train_tokens.nbytes / (1024*1024):.2f} MB)")
    print(f"  train_labels.bin: {len(train_labels):,} labels ({train_labels.nbytes / (1024*1024):.2f} MB)")
    print(f"  val_ids.bin:      {len(val_tokens):,} tokens ({val_tokens.nbytes / (1024*1024):.2f} MB)")
    print(f"  val_labels.bin:   {len(val_labels):,} labels ({val_labels.nbytes / (1024*1024):.2f} MB)")
    print(f"  Ready for train_oni.py with --data-dir \"{out_dir}\"")
    print(f"===========================================================================")


if __name__ == "__main__":
    main()
