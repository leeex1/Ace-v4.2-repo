"""Micro-benchmark: dense_pull MoE dispatch cost on CPU. Before/after proof."""
import sys, time
sys.path.insert(0, r"C:\02_QUILLAN\00 - Meta\oni")
import torch
from quillan_v5_4_oni import QuillanOniConfig, UnrolledCouncilMoEBlock

torch.set_num_threads(4)
cfg = QuillanOniConfig(hidden_dim=256, n_head=4, ffn_dim=512, num_experts=34,
                       expert_rank=8, swarm_rank=8, max_seq_len=64)
blk = UnrolledCouncilMoEBlock(cfg)
blk.train()
x = torch.randn(2, 64, 256)  # BT=128 tokens

# warmup
for _ in range(3):
    blk(x)

# time full block forward (train mode)
t0 = time.perf_counter()
N = 10
for _ in range(N):
    out, probs, lb, z, ent = blk(x)
dt = (time.perf_counter() - t0) / N * 1000
print(f"MoE block forward (train, loop dispatch): {dt:.1f} ms  out={tuple(out.shape)}")

# time experts-loop alone
flat = x.reshape(-1, 256)
t0 = time.perf_counter()
for _ in range(N):
    acc = torch.zeros_like(flat)
    for e in range(34):
        acc = acc + blk.experts[e](flat, 1.0)
dt2 = (time.perf_counter() - t0) / N * 1000
print(f"experts loop alone (34 full-token forwards): {dt2:.1f} ms  ({100*dt2/dt:.0f}% of block)")
torch.save({"out": out.detach(), "probs": probs.detach()},
           r"C:\Users\Admin\AppData\Local\Temp\opencode\moe_loop_ref.pt")
print("saved loop reference output")
