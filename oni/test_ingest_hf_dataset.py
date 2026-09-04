#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Unit and Integration Test Suite for HuggingFace Dataset Ingestion & Packer
Validates oni/ingest_hf_dataset.py and its integration with oni/prepare_data.py
and oni/train_oni.py.
"""

import json
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch, MagicMock

import numpy as np

# Setup path
oni_dir = Path(__file__).resolve().parent
if str(oni_dir) not in sys.path:
    sys.path.insert(0, str(oni_dir))

from prepare_data import parse_jsonl_record, pack_tokens_to_bin
from ingest_hf_dataset import (
    normalize_files_arg,
    pipe_files_to_packer,
    download_file,
    run_dry_run_test,
    KNOWN_DATASETS,
)
from train_oni import Corpus


class TestIngestHFDataset(unittest.TestCase):

    def test_normalize_files_arg(self):
        """Test normalization of various CLI input formats for --files."""
        self.assertEqual(normalize_files_arg(["all"]), ["all"])
        self.assertEqual(normalize_files_arg(["file1.jsonl", "file2.jsonl"]), ["file1.jsonl", "file2.jsonl"])
        self.assertEqual(normalize_files_arg(["file1.jsonl,file2.jsonl"]), ["file1.jsonl", "file2.jsonl"])
        self.assertEqual(normalize_files_arg(["file1.jsonl, file2.jsonl", "file3.jsonl"]), ["file1.jsonl", "file2.jsonl", "file3.jsonl"])

    def test_parse_jsonl_records_multischema(self):
        """Test multi-schema JSONL extraction for all supported formats."""
        # 1. Quillan seed format
        seed_record = {
            "id": "qr-001",
            "question": "What is 9-Vector?",
            "reasoning_trace": "Decomposition into 9 subspaces.",
            "final_output": "9-Vector routes across specialized cognitive domains."
        }
        res1 = parse_jsonl_record(seed_record)
        self.assertIn("<|user|>\nWhat is 9-Vector?", res1)
        self.assertIn("<think>\nDecomposition into 9 subspaces.\n</think>", res1)
        self.assertIn("9-Vector routes across specialized cognitive domains.", res1)

        # 2. Messages/Chat format
        chat_record = {
            "messages": [
                {"role": "user", "content": "Hello!"},
                {"role": "assistant", "content": "Greetings, traveler."}
            ]
        }
        res2 = parse_jsonl_record(chat_record)
        self.assertEqual(res2, "<|user|>\nHello!\n<|assistant|>\nGreetings, traveler.")

        # 3. ShareGPT conversations format
        conv_record = {
            "conversations": [
                {"from": "human", "value": "Compute 2+2."},
                {"from": "assistant", "value": "4"}
            ]
        }
        res3 = parse_jsonl_record(conv_record)
        self.assertEqual(res3, "<|user|>\nCompute 2+2.\n<|assistant|>\n4")

        # 4. Instruction / Output with thoughts
        inst_record = {
            "instruction": "Explain STE.",
            "output": "Straight-Through Estimator passes gradient through discrete step.",
            "thought": "Derivation of STE."
        }
        res4 = parse_jsonl_record(inst_record)
        self.assertIn("<think>\nDerivation of STE.\n</think>", res4)

        # 5. Raw text
        raw_record = {"text": "Plain text training sample."}
        self.assertEqual(parse_jsonl_record(raw_record), "Plain text training sample.")

        # 6. Malformed / unsupported
        self.assertIsNone(parse_jsonl_record({"unrelated_key": 123}))
        self.assertIsNone(parse_jsonl_record("not a dict"))

    def test_pipeline_packing_and_corpus_compatibility(self):
        """Test end-to-end tokenization, binary packing, and Corpus batching."""
        with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as temp_dir:
            temp_path = Path(temp_dir)
            jsonl_file = temp_path / "test_data.jsonl"
            out_dir = temp_path / "packed"

            # Create test dataset with enough tokens to form valid batches
            records = []
            for i in range(50):
                records.append({
                    "id": f"rec-{i}",
                    "question": f"Question {i}: Explain neural scaling laws and BitNet quantization.",
                    "reasoning_trace": f"Reasoning {i}: Chinchilla optimal compute allocation with ternary weights {-1, 0, +1}.",
                    "final_output": f"Answer {i}: 1.58b parameter models match FP16 perplexity with 71% less inference energy."
                })

            with open(jsonl_file, "w", encoding="utf-8") as fh:
                for r in records:
                    fh.write(json.dumps(r) + "\n")

            # Pipe to packer
            stats = pipe_files_to_packer(
                files=[jsonl_file],
                output_dir=out_dir,
                val_ratio=0.1,
                domain="general"
            )

            self.assertEqual(stats["total_samples"], 50)
            self.assertGreater(stats["train_tokens"], 1000)
            self.assertGreater(stats["val_tokens"], 100)

            # Check files exist on disk
            for f in ["train_ids.bin", "train_labels.bin", "val_ids.bin", "val_labels.bin"]:
                p = out_dir / f
                self.assertTrue(p.exists(), f"File {f} does not exist")
                self.assertGreater(p.stat().st_size, 0)

            # Test compatibility with train_oni.py Corpus class
            train_corpus = Corpus(split="train", seq_len=128, data_dir=out_dir)
            val_corpus = Corpus(split="val", seq_len=128, data_dir=out_dir)

            self.assertFalse(train_corpus.synthetic, "train_corpus fell back to synthetic data")
            self.assertFalse(val_corpus.synthetic, "val_corpus fell back to synthetic data")
            self.assertGreater(len(train_corpus), 0)
            self.assertGreater(len(val_corpus), 0)

            # Generate batch and verify shapes
            rng = np.random.default_rng(42)
            bx, by = train_corpus.batch(bs=4, rng=rng)
            self.assertEqual(bx.shape, (4, 128))
            self.assertEqual(by.shape, (4, 128))

            # Cleanup mmap handles
            if hasattr(train_corpus.ids, "_mmap") and train_corpus.ids._mmap:
                train_corpus.ids._mmap.close()
            if hasattr(train_corpus.labels, "_mmap") and train_corpus.labels._mmap:
                train_corpus.labels._mmap.close()
            if hasattr(val_corpus.ids, "_mmap") and val_corpus.ids._mmap:
                val_corpus.ids._mmap.close()
            if hasattr(val_corpus.labels, "_mmap") and val_corpus.labels._mmap:
                val_corpus.labels._mmap.close()

    def test_run_dry_run_self_test(self):
        """Verify the built-in dry-run test passes completely."""
        self.assertTrue(run_dry_run_test())

    def test_known_datasets_catalog(self):
        """Verify catalog contains all expected repositories and primary files."""
        self.assertIn("CrashOverrideX/Quillan_Samurai_sets", KNOWN_DATASETS)
        self.assertIn("CrashOverrideX/QuillanTrainingdata", KNOWN_DATASETS)

        samurai_files = KNOWN_DATASETS["CrashOverrideX/Quillan_Samurai_sets"]
        self.assertIn("Quillan_Ronin_v5.3.1_Samurai_Training_Seed_Dataset.jsonl", samurai_files)
        self.assertIn("code_train.jsonl", samurai_files)
        self.assertIn("instruct_train.jsonl", samurai_files)
        self.assertIn("quillan_science_absolute.jsonl", samurai_files)
        self.assertIn("quillan_corpus_CLEAN_V7.jsonl", samurai_files)

        holy_grail_files = KNOWN_DATASETS["CrashOverrideX/QuillanTrainingdata"]
        self.assertIn("quillan_final_holy_grail_v2.jsonl", holy_grail_files)
        self.assertIn("quillan_corpus_merged.jsonl", holy_grail_files)


if __name__ == "__main__":
    unittest.main()
