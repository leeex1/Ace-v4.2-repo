#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quillan-Ronin v5.4.0 ONI — HuggingFace Dataset Downloader & Binary Packer
========================================================================
Automated downloader and memory-mapped binary dataset packer for datasets
owned by CrashOverrideX:

Primary Repositories:
  1. CrashOverrideX/Quillan_Samurai_sets (~3.2 GB)
     - Quillan_Ronin_v5.3.1_Samurai_Training_Seed_Dataset.jsonl
     - code_train.jsonl
     - instruct_train.jsonl
     - quillan_science_absolute.jsonl
     - quillan_corpus_CLEAN_V7.jsonl
     - (and tokenizer/sample sets: tokenizer_micro_sample.jsonl, etc.)

  2. CrashOverrideX/QuillanTrainingdata (~15.6 GB)
     - quillan_final_holy_grail_v2.jsonl
     - quillan_corpus_merged.jsonl
     - quillan_corpus.jsonl
     - quillan_corpus_robust.jsonl
     - quillan_corpus_secure.jsonl
     - quillan_final_holy_grail.jsonl

Features:
  - Resilient downloads via huggingface_hub (hf_hub_download) with automatic
    streaming urllib.request fallback.
  - Interactive tqdm progress bars tracking download speed, ETA, and byte counters.
  - Multi-schema JSONL parsing supporting Chat/ShareGPT, Quillan Reasoning Trace
    (<think>...</think>), Prompt/Response, and Raw Text formats.
  - Direct pipeline into oni/prepare_data.py's UnifiedQuillanTokenizer packing logic.
  - Produces train_ids.bin, train_labels.bin, val_ids.bin, val_labels.bin (uint16 IDs, int32 labels)
    ready for train_oni.py.
  - Built-in --dry-run testing mode for self-contained CI/verification.
"""

import argparse
import json
import os
import sys
import time
import tempfile
import urllib.request
import urllib.parse
from pathlib import Path
from typing import List, Optional, Dict, Any

import numpy as np

try:
    from tqdm import tqdm
except ImportError:
    # Graceful fallback if tqdm is missing
    class tqdm:
        def __init__(self, iterable=None, desc="", total=None, unit="it", unit_scale=False, unit_divisor=1000, leave=True):
            self.iterable = iterable
            self.desc = desc
            self.total = total
            self.n = 0
        def __enter__(self):
            return self
        def __exit__(self, *args):
            pass
        def update(self, n=1):
            self.n += n
        def __iter__(self):
            for x in self.iterable:
                yield x

# Add current directory to path for local oni imports
oni_dir = Path(__file__).resolve().parent
if str(oni_dir) not in sys.path:
    sys.path.insert(0, str(oni_dir))

from quillan_tokenizer_unified import UnifiedQuillanTokenizer
from prepare_data import parse_jsonl_record, pack_tokens_to_bin, tokenize_texts


# Curated catalog of primary datasets and files owned by CrashOverrideX
KNOWN_DATASETS: Dict[str, List[str]] = {
    "CrashOverrideX/Quillan_Samurai_sets": [
        "Quillan_Ronin_v5.3.1_Samurai_Training_Seed_Dataset.jsonl",
        "code_train.jsonl",
        "instruct_train.jsonl",
        "quillan_science_absolute.jsonl",
        "quillan_corpus_CLEAN_V7.jsonl",
        "quillan_12mb_training_dataset.jsonl",
        "quillan_science_additional.jsonl",
        "full_dataset.jsonl",
        "full_train.jsonl",
        "train.jsonl",
        "tokenizer_micro_sample.jsonl",
        "tokenizer_mini_sample.jsonl",
    ],
    "CrashOverrideX/QuillanTrainingdata": [
        "quillan_final_holy_grail_v2.jsonl",
        "quillan_corpus_merged.jsonl",
        "quillan_corpus.jsonl",
        "quillan_corpus_robust.jsonl",
        "quillan_corpus_secure.jsonl",
        "quillan_final_holy_grail.jsonl",
    ],
}


def parse_args():
    parser = argparse.ArgumentParser(
        description="Automated HuggingFace Dataset Downloader & Binary Packer for Quillan-Ronin ONI.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--dataset", "-d",
        type=str,
        default="CrashOverrideX/Quillan_Samurai_sets",
        help="HuggingFace dataset repository ID.",
    )
    parser.add_argument(
        "--files", "-f",
        nargs="*",
        default=["all"],
        help="Subset of .jsonl files to download/pack, comma-separated or space-separated, or 'all'.",
    )
    parser.add_argument(
        "--output-dir", "-o",
        type=str,
        default=None,
        help="Target directory to write train_ids.bin, train_labels.bin, val_ids.bin, val_labels.bin.",
    )
    parser.add_argument(
        "--raw-dir",
        type=str,
        default=None,
        help="Directory to store downloaded raw .jsonl files (default: <output-dir>/raw).",
    )
    parser.add_argument(
        "--max-samples", "-m",
        type=int,
        default=None,
        help="Maximum number of samples to process across all files (default: all).",
    )
    parser.add_argument(
        "--val-ratio",
        type=float,
        default=0.05,
        help="Validation split ratio (default: 0.05).",
    )
    parser.add_argument(
        "--train-ratio",
        type=float,
        default=None,
        help="Train split ratio (e.g. 0.95, overrides val-ratio = 1 - train-ratio).",
    )
    parser.add_argument(
        "--domain",
        type=str,
        default="general",
        choices=["general", "code", "dialogue", "scientific"],
        help="Domain tagging for UnifiedQuillanTokenizer.",
    )
    parser.add_argument(
        "--token",
        type=str,
        default=None,
        help="HuggingFace API token (optional, checks HF_TOKEN env var).",
    )
    parser.add_argument(
        "--skip-download",
        action="store_true",
        help="Skip downloading and only process existing files in raw-dir.",
    )
    parser.add_argument(
        "--force-redownload",
        action="store_true",
        help="Force redownload even if local cached file exists.",
    )
    parser.add_argument(
        "--list-files",
        action="store_true",
        help="List available files in dataset repository and exit.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Execute end-to-end self-test with mock data or small seed file.",
    )
    return parser.parse_args()


def normalize_files_arg(files_arg: List[str]) -> List[str]:
    """Parse comma-separated or multi-string args into a clean list of filenames."""
    result = []
    for item in files_arg:
        if "," in item:
            for part in item.split(","):
                part = part.strip()
                if part:
                    result.append(part)
        else:
            item = item.strip()
            if item:
                result.append(item)
    return result


def get_repo_files(repo_id: str, token: Optional[str] = None) -> List[str]:
    """Query HuggingFace Hub to discover available .jsonl files in the dataset."""
    token = token or os.environ.get("HF_TOKEN")
    try:
        from huggingface_hub import HfApi
        api = HfApi(token=token)
        all_files = api.list_repo_files(repo_id=repo_id, repo_type="dataset")
        jsonl_files = [f for f in all_files if f.endswith(".jsonl")]
        if jsonl_files:
            return sorted(jsonl_files)
    except Exception as exc:
        print(f"[WARN] HfApi query failed for {repo_id}: {exc}")

    # Fallback to known dataset catalog
    if repo_id in KNOWN_DATASETS:
        print(f"[CATALOG] Using catalog entries for {repo_id}")
        return KNOWN_DATASETS[repo_id]

    return []


def download_file_urllib(
    repo_id: str,
    filename: str,
    dest_path: Path,
    token: Optional[str] = None
) -> Path:
    """Download a file directly from HuggingFace resolve URL using urllib and tqdm."""
    token = token or os.environ.get("HF_TOKEN")
    encoded_filename = urllib.parse.quote(filename)
    url = f"https://huggingface.co/datasets/{repo_id}/resolve/main/{encoded_filename}"

    headers = {"User-Agent": "Mozilla/5.0 (Quillan-Ronin ONI Ingestion Pipeline)"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    dest_path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = dest_path.with_suffix(dest_path.suffix + ".part")

    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            total_size = resp.headers.get("content-length")
            total_size = int(total_size) if total_size else None

            with open(temp_path, "wb") as f_out, tqdm(
                desc=f"[URL] {filename}",
                total=total_size,
                unit="B",
                unit_scale=True,
                unit_divisor=1024,
                leave=True,
            ) as bar:
                while True:
                    chunk = resp.read(1024 * 1024)  # 1MB buffer
                    if not chunk:
                        break
                    f_out.write(chunk)
                    bar.update(len(chunk))

        if dest_path.exists():
            dest_path.unlink()
        temp_path.rename(dest_path)
        return dest_path
    except Exception as exc:
        if temp_path.exists():
            try:
                temp_path.unlink()
            except OSError:
                pass
        raise RuntimeError(f"Urllib download failed for {url}: {exc}") from exc


def download_file(
    repo_id: str,
    filename: str,
    dest_dir: Path,
    token: Optional[str] = None,
    force_redownload: bool = False
) -> Path:
    """Download a dataset file using huggingface_hub with urllib fallback."""
    dest_dir.mkdir(parents=True, exist_ok=True)
    target_path = dest_dir / filename

    if target_path.exists() and target_path.stat().st_size > 0 and not force_redownload:
        sz_mb = target_path.stat().st_size / (1024 * 1024)
        print(f"[CACHE] Found local file: {target_path.name} ({sz_mb:.2f} MB). Skipping download.")
        return target_path

    token = token or os.environ.get("HF_TOKEN")

    # Strategy 1: huggingface_hub
    try:
        from huggingface_hub import hf_hub_download
        print(f"[HF_HUB] Downloading {filename} from {repo_id}...")
        downloaded = hf_hub_download(
            repo_id=repo_id,
            filename=filename,
            repo_type="dataset",
            local_dir=str(dest_dir),
            token=token,
            force_download=force_redownload,
        )
        return Path(downloaded)
    except Exception as exc:
        print(f"[WARN] huggingface_hub download error: {exc}. Attempting urllib streaming fallback...")

    # Strategy 2: urllib streaming fallback
    return download_file_urllib(repo_id, filename, target_path, token=token)


def download_selected_files(
    repo_id: str,
    requested_files: List[str],
    raw_dir: Path,
    token: Optional[str] = None,
    force_redownload: bool = False
) -> List[Path]:
    """Download requested files from repository, matching against repo contents."""
    available_files = get_repo_files(repo_id, token=token)
    
    if not requested_files or requested_files == ["all"]:
        if available_files:
            targets = available_files
        elif repo_id in KNOWN_DATASETS:
            targets = KNOWN_DATASETS[repo_id]
        else:
            raise ValueError(f"No .jsonl files found or specified for dataset {repo_id}.")
    else:
        # Match requested file names against available files
        targets = []
        for req in requested_files:
            if req in available_files:
                targets.append(req)
            else:
                # Try basename matching
                matched = [av for av in available_files if Path(av).name == req]
                if matched:
                    targets.append(matched[0])
                else:
                    # Keep as-is; attempt download anyway
                    targets.append(req)

    print(f"[INGEST] Selected {len(targets)} file(s) for ingestion:")
    for t in targets:
        print(f"  - {t}")

    downloaded_paths = []
    for t in targets:
        try:
            p = download_file(repo_id, t, raw_dir, token=token, force_redownload=force_redownload)
            downloaded_paths.append(p)
        except Exception as exc:
            print(f"[ERROR] Failed to download {t}: {exc}")
            raise

    return downloaded_paths


def pipe_files_to_packer(
    files: List[Path],
    output_dir: Path,
    val_ratio: float = 0.05,
    max_samples: Optional[int] = None,
    domain: str = "general"
) -> Dict[str, Any]:
    """
    Stream and parse records from JSONL files, tokenize using UnifiedQuillanTokenizer,
    and pipe into pack_tokens_to_bin for training-ready binary output.
    """
    tok = UnifiedQuillanTokenizer()
    all_tokens = []
    total_samples = 0

    print(f"\n===========================================================================")
    print(f"  TOKENIZING & PACKING PIPELINE")
    print(f"===========================================================================")
    print(f"Output Directory: {output_dir}")
    print(f"Domain Tag:       {domain}")
    print(f"Validation Ratio: {val_ratio * 100:.1f}%")
    if max_samples:
        print(f"Max Samples:      {max_samples:,}")

    for file_idx, fpath in enumerate(files):
        print(f"\n[{file_idx + 1}/{len(files)}] Parsing {fpath.name}...")
        file_samples = 0
        with open(fpath, "r", encoding="utf-8", errors="replace") as fh:
            for line_idx, line in enumerate(fh):
                line_str = line.strip()
                if not line_str:
                    continue
                try:
                    data = json.loads(line_str)
                    text = parse_jsonl_record(data)
                    if text:
                        tokens = tok.encode(text, domain=domain)
                        tokens.append(tok.eos_token_id)
                        all_tokens.extend(tokens)
                        file_samples += 1
                        total_samples += 1

                        if total_samples % 5000 == 0:
                            print(f"  Streamed {total_samples:,} samples | {len(all_tokens):,} tokens generated...")

                        if max_samples and total_samples >= max_samples:
                            print(f"  Reached --max-samples limit of {max_samples:,}.")
                            break
                except Exception as parse_err:
                    # Tolerant of malformed lines in large corpora
                    continue

        print(f"  Finished {fpath.name}: {file_samples:,} valid samples extracted.")
        if max_samples and total_samples >= max_samples:
            break

    if total_samples == 0 or len(all_tokens) == 0:
        raise RuntimeError("No valid training text could be extracted from input files.")

    print(f"\n[TOKENIZE] Extraction complete: {total_samples:,} samples, {len(all_tokens):,} total tokens.")
    stats = pack_tokens_to_bin(all_tokens, output_dir, val_ratio=val_ratio)
    stats["total_samples"] = total_samples
    return stats


def run_dry_run_test() -> bool:
    """Self-contained end-to-end dry run verifying download, parsing, packing, and mmap."""
    print("===========================================================================")
    print("  RUNNING QUILLAN ONI HF INGEST DRY-RUN TEST")
    print("===========================================================================")
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as temp_dir:
        temp_path = Path(temp_dir)
        raw_dir = temp_path / "raw"
        out_dir = temp_path / "packed"

        print("[1/4] Verifying synthetic multi-schema JSONL parsing...")
        mock_file = raw_dir / "mock_test.jsonl"
        raw_dir.mkdir(parents=True, exist_ok=True)
        with open(mock_file, "w", encoding="utf-8") as f:
            # Format 1: Quillan seed schema (question, reasoning_trace, final_output)
            f.write(json.dumps({
                "id": "mock-001",
                "question": "What is the 9-Vector Decomposition?",
                "reasoning_trace": "Decomposes representations into 9 orthogonal cognitive subspaces.",
                "final_output": "The 9-Vector decomposition routes tokens through specialized personas."
            }) + "\n")
            # Format 2: Chat/ShareGPT format
            f.write(json.dumps({
                "messages": [
                    {"role": "user", "content": "Explain BitNet 1.58b ternary quantization."},
                    {"role": "assistant", "content": "BitLinear constrains weights to {-1, 0, +1} using STE."}
                ]
            }) + "\n")
            # Format 3: Instruction/Output
            f.write(json.dumps({
                "instruction": "Summarize RQGM utility evolution.",
                "output": "Controlled utility evolution dynamically gates challenger weights across epochs."
            }) + "\n")
            # Format 4: Raw text
            f.write(json.dumps({"text": "Quillan-Ronin v5.4.0 ONI architectural specification."}) + "\n")
            # Format 5: Corrupt/empty line to verify resilient error handling
            f.write("{invalid_json}\n")

        print("[2/4] Testing pipeline packaging into binary format...")
        stats = pipe_files_to_packer(
            files=[mock_file],
            output_dir=out_dir,
            val_ratio=0.2,
            domain="general"
        )
        assert stats["total_samples"] == 4, f"Expected 4 valid samples, got {stats['total_samples']}"
        assert stats["train_tokens"] > 0, "Train tokens should be > 0"
        assert stats["val_tokens"] > 0, "Val tokens should be > 0"

        print("[3/4] Verifying binary artifacts on disk...")
        for name in ["train_ids.bin", "train_labels.bin", "val_ids.bin", "val_labels.bin"]:
            p = out_dir / name
            assert p.exists() and p.stat().st_size > 0, f"Missing or empty file: {p}"
            print(f"  Verified {name}: {p.stat().st_size:,} bytes")

        print("[4/4] Verifying memory-map compatibility with train_oni.py Corpus...")
        train_ids = np.memmap(out_dir / "train_ids.bin", dtype=np.uint16, mode="r")
        train_lbl = np.memmap(out_dir / "train_labels.bin", dtype=np.int32, mode="r")
        assert len(train_ids) == len(train_lbl), "IDs and Labels length mismatch"
        assert train_ids.dtype == np.uint16, "Train IDs dtype must be uint16"
        assert train_lbl.dtype == np.int32, "Train Labels dtype must be int32"
        print(f"  Memory-mapped train_ids: shape={train_ids.shape}, dtype={train_ids.dtype}")

        # Windows-safe resource cleanup: explicitly close underlying mmap handles
        if hasattr(train_ids, "_mmap") and train_ids._mmap is not None:
            train_ids._mmap.close()
        del train_ids
        if hasattr(train_lbl, "_mmap") and train_lbl._mmap is not None:
            train_lbl._mmap.close()
        del train_lbl

        print("===========================================================================")
        print("  [SUCCESS] DRY-RUN VERIFICATION PASSED 100%")
        print("===========================================================================")
        return True


def main():
    args = parse_args()

    if args.dry_run:
        success = run_dry_run_test()
        sys.exit(0 if success else 1)

    if args.list_files:
        print(f"[INFO] Querying available files for dataset: {args.dataset}")
        files = get_repo_files(args.dataset, token=args.token)
        if files:
            print(f"Found {len(files)} .jsonl file(s):")
            for f in files:
                print(f"  - {f}")
        else:
            print(f"[WARN] No .jsonl files found in repository {args.dataset}")
        sys.exit(0)

    # Resolve train/val split ratios
    val_ratio = args.val_ratio
    if args.train_ratio is not None:
        val_ratio = max(0.001, min(0.999, 1.0 - args.train_ratio))

    # Resolve output directory
    base_dir = Path(__file__).resolve().parent.parent
    default_out = Path(r"C:\02_QUILLAN\training_data\v9") if Path(r"C:\02_QUILLAN\training_data\v9").exists() else base_dir / "training_data" / "v9"
    output_dir = Path(args.output_dir) if args.output_dir else default_out
    output_dir.mkdir(parents=True, exist_ok=True)

    # Resolve raw storage directory
    raw_dir = Path(args.raw_dir) if args.raw_dir else (output_dir / "raw")
    raw_dir.mkdir(parents=True, exist_ok=True)

    # Normalize file arguments
    requested_files = normalize_files_arg(args.files)

    print(f"===========================================================================")
    print(f"  QUILLAN-RONIN v5.4.0 ONI — HUGGINGFACE DATASET INGESTION")
    print(f"===========================================================================")
    print(f"Repository:       {args.dataset}")
    print(f"Requested Files:  {requested_files}")
    print(f"Raw Cache Dir:    {raw_dir}")
    print(f"Packed Target:    {output_dir}")
    print(f"Validation Ratio: {val_ratio * 100:.1f}%")
    if args.max_samples:
        print(f"Max Samples:      {args.max_samples:,}")

    # Step 1: Download or retrieve local files
    # Step 1: Download or retrieve local files
    try:
        if args.skip_download:
            print(f"[INFO] --skip-download set. Looking for existing files in {raw_dir}...")
            downloaded_files = sorted(list(raw_dir.glob("*.jsonl")))
            if requested_files != ["all"]:
                downloaded_files = [f for f in downloaded_files if f.name in requested_files]
            if not downloaded_files:
                print(f"[ERROR] No matching .jsonl files found in {raw_dir}")
                sys.exit(1)
        else:
            downloaded_files = download_selected_files(
                repo_id=args.dataset,
                requested_files=requested_files,
                raw_dir=raw_dir,
                token=args.token,
                force_redownload=args.force_redownload,
            )
    except Exception as err:
        print(f"\n[FATAL ERROR] Download failed: {err}")
        print(f"Tip: Run with --list-files to view all available files in repository '{args.dataset}'.")
        sys.exit(1)

    # Step 2: Pipe directly into prepare_data tokenizer packing logic
    try:
        stats = pipe_files_to_packer(
            files=downloaded_files,
            output_dir=output_dir,
            val_ratio=val_ratio,
            max_samples=args.max_samples,
            domain=args.domain,
        )
    except Exception as err:
        print(f"\n[FATAL ERROR] Packing pipeline failed: {err}")
        sys.exit(1)

    print(f"\n===========================================================================")
    print(f"  INGESTION & BINARY PACKING COMPLETED SUCCESSFULLY")
    print(f"===========================================================================")
    print(f"  Samples Processed: {stats['total_samples']:,}")
    print(f"  Train IDs:         {stats['train_ids_path']} ({stats['train_tokens']:,} tokens)")
    print(f"  Train Labels:      {stats['train_labels_path']}")
    print(f"  Val IDs:           {stats['val_ids_path']} ({stats['val_tokens']:,} tokens)")
    print(f"  Val Labels:        {stats['val_labels_path']}")
    print(f"  Launch training with:")
    print(f"    python oni/train_oni.py --data-dir \"{output_dir}\"")
    print(f"===========================================================================")


if __name__ == "__main__":
    main()
