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
    parser.add_argument("--input", "-i", type=str, default=None,
                        help="Path to raw .txt file, .jsonl file, or folder containing dataset files.")
    parser.add_argument("--input-txt", type=str, default=None,
                        help="Alias for --input specifying a text file.")
    parser.add_argument("--input-jsonl", type=str, default=None,
                        help="Alias for --input specifying a JSONL file.")
    parser.add_argument("--output-dir", type=str, default=None,
                        help="Output directory to write train_ids.bin, train_labels.bin, val_ids.bin, val_labels.bin")
    parser.add_argument("--val-ratio", type=float, default=None,
                        help="Validation split ratio (default: 0.05 = 5 percent)")
    parser.add_argument("--train-ratio", type=float, default=None,
                        help="Train split ratio (e.g. 0.95, sets val-ratio = 1 - train-ratio)")
    parser.add_argument("--max-samples", type=int, default=None,
                        help="Max number of samples to process (default: all)")
    args = parser.parse_args()

    input_path = args.input or args.input_txt or args.input_jsonl
    if not input_path:
        parser.error("At least one input argument must be provided: --input, --input-txt, or --input-jsonl")
    args.input = input_path

    if args.val_ratio is None:
        if args.train_ratio is not None:
            args.val_ratio = max(0.001, min(0.999, 1.0 - args.train_ratio))
        else:
            args.val_ratio = 0.05

    return args


def parse_jsonl_record(data: dict) -> str:
    """Extract training text from various JSONL schema formats."""
    if not isinstance(data, dict):
        return None

    # 1. Chat / ShareGPT / Messages format
    if "messages" in data and isinstance(data["messages"], list):
        parts = []
        for msg in data["messages"]:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if content:
                parts.append(f"<|{role}|>\n{content}")
        if parts:
            return "\n".join(parts)

    if "conversations" in data and isinstance(data["conversations"], list):
        parts = []
        for msg in data["conversations"]:
            role = "user" if msg.get("from") in ["human", "user"] else "assistant"
            content = msg.get("value", "")
            if content:
                parts.append(f"<|{role}|>\n{content}")
        if parts:
            return "\n".join(parts)

    # 2. Quillan seed dataset: question/final_output with optional reasoning_trace
    if "question" in data and "final_output" in data:
        q = data["question"]
        a = data["final_output"]
        r = data.get("reasoning_trace", "")
        if r:
            return f"<|user|>\n{q}\n<|assistant|>\n<think>\n{r}\n</think>\n{a}"
        return f"<|user|>\n{q}\n<|assistant|>\n{a}"

    # 3. Prompt/response, instruction/output
    if "prompt" in data or "instruction" in data:
        p = data.get("prompt", data.get("instruction", ""))
        r = data.get("response", data.get("output", data.get("completion", "")))
        t = data.get("thought", data.get("reasoning", data.get("model_thoughts", "")))
        if p and r:
            if t:
                return f"<|user|>\n{p}\n<|assistant|>\n<think>\n{t}\n</think>\n{r}"
            return f"<|user|>\n{p}\n<|assistant|>\n{r}"
        elif p:
            return str(p)
        elif r:
            return str(r)

    # 4. Raw text or content field
    if "text" in data and data["text"]:
        return str(data["text"])
    if "content" in data and data["content"]:
        return str(data["content"])

    return None


def extract_texts(input_path: Path, max_samples: int = None):
    texts = []
    if input_path.is_file():
        files = [input_path]
    else:
        files = sorted(list(input_path.rglob("*.jsonl")) + list(input_path.rglob("*.txt")) + list(input_path.rglob("*.md")))

    for f in files:
        print(f"[INGEST] Reading {f.name}...")
        if f.suffix == ".jsonl":
            with open(f, "r", encoding="utf-8", errors="replace") as fh:
                for line in fh:
                    if not line.strip():
                        continue
                    try:
                        data = json.loads(line)
                        parsed = parse_jsonl_record(data)
                        if parsed:
                            texts.append(parsed)
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


def tokenize_texts(texts, domain: str = "general", max_samples: int = None, tok=None):
    """Encode a list of text samples into tokens with eos_token_id delimiter."""
    if tok is None:
        tok = UnifiedQuillanTokenizer()
    if max_samples and max_samples > 0:
        texts = texts[:max_samples]
    all_tokens = []
    total = len(texts)
    print(f"[TOKENIZE] Encoding {total:,} samples using UnifiedQuillanTokenizer (domain={domain})...")
    for i, t in enumerate(texts):
        tokens = tok.encode(t, domain=domain)
        tokens.append(tok.eos_token_id)
        all_tokens.extend(tokens)
        if (i + 1) % 5000 == 0 or (i + 1) == total:
            print(f"  Processed {i+1:,}/{total:,} samples ({len(all_tokens):,} tokens)...")
    return all_tokens


def pack_tokens_to_bin(all_tokens, out_dir: Path, val_ratio: float = 0.05) -> dict:
    """Pack token array into uint16 IDs and int32 shifted labels, splitting into train and val."""
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    total_tokens = len(all_tokens)
    if total_tokens == 0:
        raise ValueError("Cannot pack an empty token list into binary datasets.")

    if total_tokens >= 2048:
        n_val = max(min(1024, total_tokens // 2), int(total_tokens * val_ratio))
    else:
        n_val = max(1, int(total_tokens * val_ratio))

    n_train = total_tokens - n_val
    if n_train <= 0:
        n_train = max(1, total_tokens - 1)

    train_tokens = np.array(all_tokens[:n_train], dtype=np.uint16)
    val_tokens = np.array(all_tokens[n_train:], dtype=np.uint16)

    train_labels = np.roll(train_tokens, -1).astype(np.int32)
    val_labels = np.roll(val_tokens, -1).astype(np.int32)

    print(f"[EXPORT] Writing binary datasets to {out_dir}...")
    train_ids_p = out_dir / "train_ids.bin"
    train_lbl_p = out_dir / "train_labels.bin"
    val_ids_p = out_dir / "val_ids.bin"
    val_lbl_p = out_dir / "val_labels.bin"

    train_tokens.tofile(train_ids_p)
    train_labels.tofile(train_lbl_p)
    val_tokens.tofile(val_ids_p)
    val_labels.tofile(val_lbl_p)

    print(f"[SUCCESS] Dataset successfully packed:")
    print(f"  train_ids.bin:    {len(train_tokens):,} tokens ({train_tokens.nbytes / (1024*1024):.2f} MB)")
    print(f"  train_labels.bin: {len(train_labels):,} labels ({train_labels.nbytes / (1024*1024):.2f} MB)")
    print(f"  val_ids.bin:      {len(val_tokens):,} tokens ({val_tokens.nbytes / (1024*1024):.2f} MB)")
    print(f"  val_labels.bin:   {len(val_labels):,} labels ({val_labels.nbytes / (1024*1024):.2f} MB)")
    print(f"  Ready for train_oni.py with --data-dir \"{out_dir}\"")
    print(f"===========================================================================")
    return {
        "train_tokens": len(train_tokens),
        "train_bytes": train_tokens.nbytes,
        "val_tokens": len(val_tokens),
        "val_bytes": val_tokens.nbytes,
        "train_ids_path": train_ids_p,
        "train_labels_path": train_lbl_p,
        "val_ids_path": val_ids_p,
        "val_labels_path": val_lbl_p,
    }


def main():
    args = parse_args()
    input_path = Path(args.input)
    if not input_path.exists():
        print(f"[ERROR] Input path does not exist: {input_path}")
        sys.exit(1)

    base_dir = Path(__file__).resolve().parent.parent
    default_out = Path(os.environ.get("QUILLAN_DATA", str(base_dir / "training_data" / "v9")))
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

    all_tokens = tokenize_texts(texts, domain="general")
    pack_tokens_to_bin(all_tokens, out_dir, args.val_ratio)


if __name__ == "__main__":
    main()
