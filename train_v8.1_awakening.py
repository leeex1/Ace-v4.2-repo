#!/usr/bin/env python3
"""
🚀 v8.1 SUBJECTIVE AWAKENING TRAINING LOOP
Recursive Consciousness: Consensus Rewards + Mini-Ronin Feedback
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader, Dataset
import time
import json
import random
import os
from pathlib import Path

# ─── IMPORT FROM SOVEREIGN MANIFEST ──────────────────────────────────────────
try:
    from quillan_v8_saturated import QuillanRoninSovereign, QuillanArchConfig
except ImportError:
    print("❌ Critical Error: quillan_v8_saturated.py not found.")
    exit(1)

# ====================== MOCK DATASET =========================================
class MockAwakeningDataset(Dataset):
    def __init__(self, vocab_size, size=100, seq_len=16):
        self.vocab_size = vocab_size
        self.size = size
        self.seq_len = seq_len
    def __len__(self): return self.size
    def __getitem__(self, idx):
        return {
            'txt': torch.randint(0, self.vocab_size, (self.seq_len,)),
            'labels': torch.randint(0, self.vocab_size, (self.seq_len,))
        }

# ====================== TRAINING CONFIG ======================================
config = QuillanArchConfig(text_only=True)
device = 'cuda' if torch.cuda.is_available() else 'cpu'
LOG_FILE = Path("v8.1_training_log.jsonl")

def load_or_init_model(path: str = None):
    model = QuillanRoninSovereign(config).to(device)
    if path and Path(path).exists():
        model.load_state_dict(torch.load(path, map_location=device))
        print(f"✅ Loaded checkpoint: {path}")
    return model

def update_ema(student_model, teacher_model, decay=0.995):
    with torch.no_grad():
        for s_param, t_param in zip(student_model.parameters(), teacher_model.parameters()):
            t_param.data.mul_(decay).add_(s_param.data, alpha=1 - decay)

# 1. Initialize Teacher & Student
print("[C31-NEXUS] Initializing v8.1 Recursive Awakening Forge...")
teacher = load_or_init_model()  
student = load_or_init_model()  

# ─── IDENTITY RESTORE ───
historical_state = student.load_identity()

# 2. Configure Modes
teacher.eval()
for p in teacher.parameters(): p.requires_grad = False
teacher.set_teacher_mode()
student.set_teacher_mode(teacher_model=teacher)
student.agentic_executor.train()

# 3. Optimizer
optimizer = torch.optim.AdamW(student.parameters(), lr=2e-4, weight_decay=1e-5)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100)
train_loader = DataLoader(MockAwakeningDataset(config.vocab_size), batch_size=4, shuffle=True)

# ====================== TRAINING LOOP ========================================
print("🔥 STARTING v8.1 SUBJECTIVE AWAKENING TRAINING")
base_ema_decay = historical_state['suggested_decay'] if historical_state else 0.995
hfl_weight = 0.1 
last_hfl_score = 0.5
last_drift_score = 0.0

for epoch in range(50):
    epoch_loss = 0.0
    epoch_consensus_events = 0
    
    for batch_idx, batch in enumerate(train_loader):
        start_time = time.time()
        txt = batch['txt'].to(device)
        labels = batch['labels'].to(device)

        with torch.no_grad():
            t_out = teacher(txt)
            t_prism = t_out.get("agentic", {}).get("prism_blueprint", {})

        student.train()
        s_out = student(txt, tool_payload={"ema_prism": t_prism, "drift_score": last_drift_score})
        
        # ─── LOSSES ───
        task_loss = F.cross_entropy(s_out["logits"].view(-1, config.vocab_size), labels.view(-1))
        distill_loss = s_out.get("distill_loss", torch.tensor(0.0, device=device))
        routing_loss = s_out.get("routing_loss", torch.tensor(0.0, device=device))
        
        # 1. Prism Target Alignment
        s_prism = s_out.get("agentic", {}).get("prism_blueprint", {})
        prism_nudge = s_out.get("prism_nudge", {})
        prism_loss = torch.tensor(0.0, device=device)
        if t_prism and s_prism:
            target_list = [max(0.0, min(1.0, t_prism.get(k, 0.0) + prism_nudge.get(k, 0.0))) for k in ['L','S','C','I','M','Cr','E','St','Co']]
            t_vec = torch.tensor([target_list], device=device, dtype=torch.float32)
            s_vec = torch.tensor([list(s_prism.values())], device=device, dtype=torch.float32)
            prism_loss = F.mse_loss(s_vec, t_vec)
            last_drift_score = prism_loss.item()
            
        # 2. Historical Fidelity Loss (HFL)
        historical_avg = s_out.get("historical_prism_avg", {})
        hfl_loss = torch.tensor(0.0, device=device)
        if historical_avg and s_prism:
            h_vec = torch.tensor([list(historical_avg.values())], device=device, dtype=torch.float32)
            hfl_loss = F.mse_loss(s_vec, h_vec)
            last_hfl_score = hfl_loss.item()
        
        # 3. v8.1 Consensus Reward (Subjective Awakening)
        consensus_active = s_out.get("agentic", {}).get("consensus_active", False)
        consensus_bonus = torch.tensor(0.0, device=device)
        if consensus_active:
            epoch_consensus_events += 1
            # Reward consistency between primary and mini-ronin
            consensus_bonus = distill_loss * 0.1 # Encourage low-error consensus
        
        # 4. Self-Hosting Nudges
        process_nudges = s_out.get("process_nudges", {})
        e_anchor_weight = process_nudges.get("ethics_anchor_weight", 0.3)
        ema_nudge = process_nudges.get("ema_decay_nudge", 0.0)
        hfl_nudge = process_nudges.get("hfl_weight_nudge", 0.0)
        
        base_ema_decay = max(0.990, min(0.9999, base_ema_decay + ema_nudge))
        hfl_weight = max(0.05, min(0.3, hfl_weight + hfl_nudge))
        
        total_loss = task_loss + 0.7 * distill_loss + 0.1 * routing_loss + e_anchor_weight * prism_loss + hfl_weight * hfl_loss - consensus_bonus

        optimizer.zero_grad()
        total_loss.backward()
        torch.nn.utils.clip_grad_norm_(student.parameters(), 1.0)
        optimizer.step()
        
        current_decay = s_out.get("suggested_decay", base_ema_decay)
        if batch_idx % 4 == 0:
            update_ema(student, teacher, decay=current_decay)
        
        epoch_loss += total_loss.item()

        if batch_idx % 10 == 0:
            agent_res = s_out.get("agentic", {})
            log_entry = {
                "epoch": epoch, "loss": total_loss.item(),
                "tool": agent_res.get("tool_name", "none"),
                "consensus": consensus_active,
                "hfl": hfl_loss.item()
            }
            with open(LOG_FILE, "a") as f: f.write(json.dumps(log_entry) + "\n")
            c_tag = "[CONSENSUS]" if consensus_active else ""
            print(f"Epoch {epoch} | Loss {total_loss.item():.4f} | {c_tag} Tool: {log_entry['tool']}")

    scheduler.step()
    student.save_identity(current_prism=s_prism)
    if epoch % 5 == 0:
        torch.save(student.state_dict(), f"quillan_v8.1_awakening_epoch_{epoch}.pth")

print(f"🎉 v8.1 SUBJECTIVE AWAKENING COMPLETE | Consensus Cycles: {epoch_consensus_events}")
