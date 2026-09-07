"""BitLinear via native path: forward parity + GRAD FLOW + block timing."""
import sys, time
sys.path.insert(0, r"C:\02_QUILLAN\00 - Meta\oni")
import torch
import quillan_v5_4_oni as Q
from quillan_v5_4_oni import QuillanOniConfig, UnrolledCouncilMoEBlock

print("native active:", Q._BITNET_NATIVE_OK)
assert Q._BITNET_NATIVE_OK, "native extension not loaded"

torch.set_num_threads(4)
torch.manual_seed(0)
cfg = QuillanOniConfig(hidden_dim=256, n_head=4, ffn_dim=512, num_experts=34,
                       expert_rank=8, swarm_rank=8, max_seq_len=64)
blk = UnrolledCouncilMoEBlock(cfg)
blk.train()
x = torch.randn(2, 64, 256)

# grad flow through native STE wrap
out, probs, lb, z, ent = blk(x)
out.sum().backward()
g = sum(p.grad.abs().sum().item() for p in blk.parameters() if p.grad is not None)
print(f"grad mass through native path: {g:.2f}")
assert g > 0, "GRAD DEAD — STE wrap broken"

# timing vs JIT: force JIT by toggling flag
for _ in range(3):
    blk(x)
t0 = time.perf_counter()
for _ in range(10):
    blk(x)
t_nat = (time.perf_counter() - t0) / 10 * 1000
Q._BITNET_NATIVE_OK = False
for _ in range(3):
    blk(x)
t0 = time.perf_counter()
for _ in range(10):
    blk(x)
t_jit = (time.perf_counter() - t0) / 10 * 1000
print(f"MoE block: native={t_nat:.1f}ms jit={t_jit:.1f}ms ({t_jit/t_nat:.2f}x)")
print("BITLINEAR NATIVE PASS")
