#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
 QUILLAN-RONIN v5.4.0 ONI - DATASET PREPARATION & TOKEN PACKING
================================================================================
Ingests markdown and text papers from Formal Papers / Knowledge Base,
tokenizes them via UnifiedQuillanTokenizer (50,257 vocab), and serializes
zero-copy memory-mapped binary datasets (train_ids, train_labels, val_ids, val_labels).

Output files:
  - {output_dir}/train_ids.bin     (dtype uint16)
  - {output_dir}/train_labels.bin  (dtype int32)
  - {output_dir}/val_ids.bin       (dtype uint16)
  - {output_dir}/val_labels.bin    (dtype int32)
"""

import argparse
import os
import sys
import time
from pathlib import Path
from typing import List, Tuple

import numpy as np

# Ensure local oni package imports correctly
REPO_ROOT = Path(__file__).resolve().parent.parent
ONI_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ONI_DIR))

try:
    from quillan_tokenizer_unified import UnifiedQuillanTokenizer
except ImportError:
    # Fallback path if run from root
    sys.path.insert(0, str(REPO_ROOT / "oni"))
    from quillan_tokenizer_unified import UnifiedQuillanTokenizer


def discover_all_corpus_files(repo_root: Path) -> List[Path]:
    """Discovers markdown and text files across all 11 knowledge base domains."""
    subdirs = [
        "Formal Papers",
        "01_Knowledge_Base/Formal Papers",
        "01_Knowledge_Base/Book Series",
        "01_Knowledge_Base",
        "Book Series",
        "Quillan Knowledge files",
        "system prompts",
        "Software Engineer",
        "Audio Engineer",
        "Skills",
        "03_Skills",
        "00 - Meta",
        "docs",
    ]
    seen = set()
    files = []
    for s in subdirs:
        d = repo_root / s
        if d.is_dir():
            for f in d.rglob("*"):
                if f.is_file() and f.suffix.lower() in [".md", ".txt", ".json"]:
                    if f.name.endswith(".bin") or ".git" in f.parts or "node_modules" in f.parts:
                        continue
                    try:
                        resolved = f.resolve()
                        if resolved not in seen:
                            seen.add(resolved)
                            files.append(f)
                    except Exception:
                        pass
    return files


def discover_input_dir(candidate: str | None = None) -> Path:
    """Finds the formal papers / knowledge documents directory."""
    if candidate and Path(candidate).is_dir():
        return Path(candidate).resolve()

    defaults = [
        REPO_ROOT / "01_Knowledge_Base" / "Formal Papers",
        REPO_ROOT / "Formal Papers",
        Path("/content/Quillan-Ronin/Formal Papers"),
        Path("/content/Quillan-Ronin/01_Knowledge_Base/Formal Papers"),
        Path("Formal Papers"),
        Path("01_Knowledge_Base/Formal Papers"),
    ]
    for d in defaults:
        if d.is_dir():
            return d.resolve()

    # Fallback to REPO_ROOT
    return REPO_ROOT


def extract_samples_from_file(file_path: Path, min_chars: int = 40) -> List[str]:
    """Reads a markdown/text file and segments it into cohesive text chunks."""
    try:
        text = file_path.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        print(f"[WARN] Failed to read {file_path.name}: {e}")
        return []

    # Clean Windows CRLF
    text = text.replace("\r\n", "\n")

    # Split into sections / paragraphs
    paragraphs = text.split("\n\n")
    samples = []
    current_chunk = []
    current_len = 0

    for p in paragraphs:
        p_clean = p.strip()
        if not p_clean or len(p_clean) < min_chars:
            continue
        
        # If adding this paragraph exceeds ~1200 chars, flush chunk
        if current_len + len(p_clean) > 1200 and current_chunk:
            samples.append("\n\n".join(current_chunk))
            current_chunk = [p_clean]
            current_len = len(p_clean)
        else:
            current_chunk.append(p_clean)
            current_len += len(p_clean)

    if current_chunk:
        samples.append("\n\n".join(current_chunk))

    return samples


def pack_corpus(
    input_dir: Path,
    output_dir: Path,
    seq_len: int = 512,
    val_ratio: float = 0.02,
    vocab_size: int = 50257,
) -> Tuple[int, int, int]:
    """Tokenizes all formal papers and writes binary memmap datasets."""
    print("=" * 80)
    print(" QUILLAN-RONIN v5.4.0 ONI - DATASET PREPARATION & TOKEN PACKING")
    print("=" * 80)
    print(f"Input Source:  {input_dir}")
    print(f"Output Target: {output_dir}")

    output_dir.mkdir(parents=True, exist_ok=True)
    md_files = sorted(
        list(input_dir.glob("*.md")) + list(input_dir.glob("*.txt")),
        key=lambda f: f.name.lower(),
    )

    if not md_files:
        raise ValueError(f"No markdown (.md) or text (.txt) files found in {input_dir}")

    all_samples: List[str] = []
    for f in md_files:
        print(f"[INGEST] Reading {f.name}...")
        file_samples = extract_samples_from_file(f)
        all_samples.extend(file_samples)

    total_samples = len(all_samples)
    print(f"[INGEST] Total text samples extracted: {total_samples:,}")
    print(f"[TOKENIZE] Encoding samples using UnifiedQuillanTokenizer...")

    tok = UnifiedQuillanTokenizer()
    all_tokens: List[int] = []

    t0 = time.time()
    eos_id = getattr(tok, "eos_token_id", 0)
    for idx, sample in enumerate(all_samples, 1):
        ids = tok.encode(sample)
        if ids:
            all_tokens.extend(ids)
            if eos_id is not None:
                all_tokens.append(eos_id)

        if idx % 1000 == 0 or idx == total_samples:
            print(f" Processed {idx:,}/{total_samples:,} samples ({len(all_tokens):,} tokens)...")

    total_tokens = len(all_tokens)
    elapsed = time.time() - t0
    print(f"[TOKENIZE] Encoding complete: {total_tokens:,} tokens generated ({elapsed:.2f}s).")

    if total_tokens < seq_len:
        raise ValueError(f"Total tokens ({total_tokens}) is less than sequence length ({seq_len}).")

    # Sanitize and bound tokens
    token_arr = np.array(all_tokens, dtype=np.uint16)
    token_arr = np.clip(token_arr, 0, vocab_size - 1)

    # Calculate full sequences
    n_seqs = len(token_arr) // seq_len
    truncated_len = n_seqs * seq_len
    token_arr = token_arr[:truncated_len]

    # Split into train and val sequences
    val_interval = max(2, int(1.0 / val_ratio)) if val_ratio > 0 else 0
    seq_grid = token_arr.reshape(n_seqs, seq_len)

    train_seqs = []
    val_seqs = []

    for i, seq in enumerate(seq_grid):
        if val_interval > 0 and (i + 1) % val_interval == 0:
            val_seqs.append(seq)
        else:
            train_seqs.append(seq)

    print(f"[TOKENIZE] Generated {total_tokens:,} total tokens in {t_tok:.2f}s ({total_tokens / max(1e-5, t_tok):,.0f} tok/s).")

    # Sequence packing
    num_full_seqs = total_tokens // seq_len
    truncated_tokens = num_full_seqs * seq_len
    packed_tokens = all_tokens[:truncated_tokens]

    seqs = np.array(packed_tokens, dtype=np.uint16).reshape(num_full_seqs, seq_len)
    
    # Shuffle sequences deterministically
    np.random.seed(42)
    indices = np.random.permutation(num_full_seqs)
    seqs = seqs[indices]

    n_val = max(1, int(num_full_seqs * val_ratio))
    val_seqs = seqs[:n_val]
    train_seqs = seqs[n_val:]

    train_arr = train_seqs.flatten()
    val_arr = val_seqs.flatten()

    train_ids_path = output_dir / "train_ids.bin"
    train_labels_path = output_dir / "train_labels.bin"
    val_ids_path = output_dir / "val_ids.bin"
    val_labels_path = output_dir / "val_labels.bin"

    with open(train_ids_path, "wb") as f:
        f.write(train_arr.tobytes())
    with open(train_labels_path, "wb") as f:
        f.write(train_arr.astype(np.int32).tobytes())

    with open(val_ids_path, "wb") as f:
        f.write(val_arr.tobytes())
    with open(val_labels_path, "wb") as f:
        f.write(val_arr.astype(np.int32).tobytes())

    n_train_seq = len(train_seqs)
    n_val_seq = len(val_seqs)

    print(f"[SUCCESS] Dataset successfully packed:")
    print(f"  - Train: {len(train_arr):,} tokens ({n_train_seq} sequences of {seq_len})")
    print(f"  - Val:   {len(val_arr):,} tokens ({n_val_seq} sequences of {seq_len})")
    print(f"  - Files: {train_ids_path.name}, {train_labels_path.name}, {val_ids_path.name}, {val_labels_path.name}")
    print("=" * 80)

    return total_tokens, n_train_seq, n_val_seq


def main():
    parser = argparse.ArgumentParser(
        description="Quillan-Ronin v5.4.0 ONI - Formal Papers Dataset Preparation & Token Packing"
    )
    parser.add_argument(
        "--input-dir",
        type=str,
        default=None,
        help="Path to directory containing .md / .txt papers (default: auto-detect 01_Knowledge_Base/Formal Papers)",
    )
    parser.add_argument(
        "--full-corpus",
        action="store_true",
        help="Pack all 11 knowledge domains across the repository (20.34M tokens)",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default=str(ONI_DIR / "data"),
        help="Path to output directory for binary memmap datasets (default: oni/data)",
    )
    parser.add_argument(
        "--seq-len",
        type=int,
        default=512,
        help="Sequence length for token packaging (default: 512)",
    )
    parser.add_argument(
        "--val-ratio",
        type=float,
        default=0.02,
        help="Validation split ratio (default: 0.02 / 2%%)",
    )
    args = parser.parse_args()

    input_path = discover_input_dir(args.input_dir) if not args.full_corpus else None
    output_path = Path(args.output_dir).resolve()
    pack_corpus(
        input_path,
        output_path,
        seq_len=args.seq_len,
        val_ratio=args.val_ratio,
        full_corpus=args.full_corpus,
    )


if __name__ == "__main__":
    main()
