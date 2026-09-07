#!/usr/bin/env python3
"""
Quillan-Ronin NFT Metadata & Batch Minting Preparation Script
=============================================================
Scans all 173 exclusive artwork designs in `06_Media/images/NFT designs/`
and generates:
1. Standard ERC-721 / OpenSea JSON metadata files (`output_metadata/{token_id}.json`)
2. `nft_collection_manifest.csv` for 1-click batch upload to OpenSea Studio / Thirdweb
3. Trait attribution based on filename, Council Persona, and Sovereign Rarity
"""

import os
import json
import csv
import re
from pathlib import Path

NFT_DIR = Path(r"C:\02_QUILLAN\06_Media\images\NFT designs")
OUT_JSON_DIR = Path(r"C:\02_QUILLAN\exports\nft_metadata_json")
OUT_CSV_PATH = Path(r"C:\02_QUILLAN\exports\nft_collection_manifest.csv")

OUT_JSON_DIR.mkdir(parents=True, exist_ok=True)
OUT_CSV_PATH.parent.mkdir(parents=True, exist_ok=True)

# 34 Council Personas for trait assignment
COUNCIL_TRAITS = [
    "C0-ASTRA (Pattern Recognition)", "C1-VIR (Ethical Guardian)", "C2-SOLACE (Empathy)",
    "C3-PRAXIS (Strategy)", "C4-ECHO (Memory Continuity)", "C5-OMNIS (Synthesis)",
    "C6-LOGOS (Logic)", "C7-METASYNTH (Creative Fusion)", "C8-AETHER (Semantics)",
    "C9-CODEWEAVER (Engineering)", "C10-HARMONIA (Equilibrium)", "C11-SOPHIAE (Wisdom)",
    "C12-WARDEN (Security)", "C13-KAIDO (Efficiency)", "C14-LUMINARIS (Clarity)",
    "C15-VOXUM (Articulation)", "C16-NULLION (Paradox)", "C17-SHEPHERD (Truth)",
    "C18-VIGIL (Integrity)", "C19-ARTIFEX (Tool Integration)", "C20-ARCHON (Deep Research)",
    "C21-AURELION (Aesthetics)", "C22-CADENCE (Rhythm)", "C23-SCHEMA (Structure)",
    "C24-PROMETHEUS (Scientific)", "C25-TECHNE (Mastery)", "C26-CHRONICLE (Narrative)",
    "C27-CALCULUS (Quantitative)", "C28-NAVIGATOR (Orchestration)", "C29-TESSERACT (Real-Time)",
    "C30-NEXUS (Governance)", "C31-AEON (Simulation)", "C32-TYPIST (Optimization)",
    "C33-PREDATOR (Predatory Math)"
]

def clean_title(filename: str) -> str:
    base = Path(filename).stem
    # Remove hash prefix if present
    base = re.sub(r'^[a-f0-9]{16}-', '', base)
    words = base.replace('_', ' ').replace('-', ' ').title().split()
    return "Quillan Ronin: " + " ".join(words)

def determine_traits(filename: str, idx: int):
    f_lower = filename.lower()
    
    # Council assignment
    assigned_council = COUNCIL_TRAITS[idx % len(COUNCIL_TRAITS)]
    for c in COUNCIL_TRAITS:
        c_tag = c.split()[0].lower().replace('-', '_')
        if c_tag in f_lower:
            assigned_council = c
            break

    # Rarity Tier
    if any(k in f_lower for k in ["sovereign", "oni", "void", "gold", "master", "crown"]):
        rarity = "Mythic"
    elif any(k in f_lower for k in ["cyberpunk", "holographic", "ancient", "blueprint"]):
        rarity = "Legendary"
    elif any(k in f_lower for k in ["card", "portrait", "pfp"]):
        rarity = "Epic"
    else:
        rarity = "Rare"

    # Style modality
    if "card" in f_lower or "trading" in f_lower:
        card_type = "Trading Card"
    elif "portrait" in f_lower or "pfp" in f_lower:
        card_type = "Avatar / PFP"
    elif "blueprint" in f_lower:
        card_type = "Architectural Blueprint"
    else:
        card_type = "Fine Art Concept"

    return [
        {"trait_type": "Council Affinity", "value": assigned_council},
        {"trait_type": "Rarity Tier", "value": rarity},
        {"trait_type": "Artifact Class", "value": card_type},
        {"trait_type": "Modality Fabric", "value": "BitNet 1.58b EvoMoE"},
        {"trait_type": "Creator", "value": "CrashOverrideX & Quillan-Ronin"}
    ]

# Gather files
files = sorted([f for f in NFT_DIR.iterdir() if f.is_file() and f.suffix.lower() in ['.webp', '.png', '.jpg', '.jpeg']])
print(f"Found {len(files)} NFT design files to process.")

csv_rows = []
for idx, f in enumerate(files, start=1):
    title = clean_title(f.name)
    traits = determine_traits(f.name, idx)
    
    metadata = {
        "name": title,
        "description": f"Official sovereign artwork artifact from the Quillan-Ronin ecosystem. Authenticated by CrashOverrideX.\n\nEdition: #{idx}/{len(files)}",
        "image": f"ipfs://__CID__/{f.name}",
        "external_url": "https://huggingface.co/CrashOverrideX/Quillan-Ronin",
        "attributes": traits
    }
    
    # Save standard JSON metadata
    json_path = OUT_JSON_DIR / f"{idx}.json"
    json_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    
    # Prepare CSV row for OpenSea / Thirdweb
    csv_rows.append({
        "Token ID": idx,
        "Name": title,
        "Description": metadata["description"],
        "Image": f.name,
        "Council Affinity": traits[0]["value"],
        "Rarity Tier": traits[1]["value"],
        "Artifact Class": traits[2]["value"]
    })

# Write CSV Manifest
with open(OUT_CSV_PATH, mode="w", newline="", encoding="utf-8") as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=["Token ID", "Name", "Description", "Image", "Council Affinity", "Rarity Tier", "Artifact Class"])
    writer.writeheader()
    writer.writerows(csv_rows)

print(f"[SUCCESS] Generated {len(files)} ERC-721 JSON metadata files in: {OUT_JSON_DIR}")
print(f"[SUCCESS] Generated batch drop CSV manifest in: {OUT_CSV_PATH}")
