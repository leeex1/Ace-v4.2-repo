"""Port test: contributor dispatcher vs eager loop in OUR tree, gumbel_topk path."""
import sys, time
sys.path.insert(0, r"C:\02_QUILLAN\00 - Meta\oni")
import torch
from quillan_v5_4_oni import QuillanOniConfig, UnrolledCouncilMoEBlock

torch.set_num_threads(4)
torch.manual_seed(1)
cfg = QuillanOniConfig(hidden_dim=256, n_head=4, ffn_dim=512, num_experts=34,
                       expert_rank=8, swarm_rank=8, max_seq_len=64,
                       router_mode="gumbel_topk", top_k=4, use_evo_moe=False,
                       use_moe_dispatcher=True)
blk = UnrolledCouncilMoEBlock(cfg)
assert blk.moe_dispatcher is not None, "dispatcher not constructed"
blk.eval()  # eval: swarm noise off -> deterministic, parity meaningful
x = torch.randn(2, 64, 256)

# dispatcher path
for _ in range(3):
    out_d, *_ = blk(x)
t0 = time.perf_counter()
for _ in range(10):
    out_d, *_ = blk(x)
t_disp = (time.perf_counter() - t0) / 10 * 1000

# eager path (same weights)
cfg.use_moe_dispatcher = False
blk.moe_dispatcher = None
torch.manual_seed(1)
for _ in range(3):
    out_e, *_ = blk(x)
t0 = time.perf_counter()
for _ in range(10):
    out_e, *_ = blk(x)
t_eager = (time.perf_counter() - t0) / 10 * 1000

# NOTE: dispatcher ran first, weights updated? No optimizer ran, weights identical.
# Recompute dispatcher output with same weights for parity:
cfg.use_moe_dispatcher = True
from moe_dispatcher import MoEDispatcher
blk.moe_dispatcher = MoEDispatcher(num_experts=34)
out_d2, *_ = blk(x)
d = (out_d2 - out_e).abs().max().item()
print(f"dispatcher: {t_disp:.2f} ms | eager: {t_eager:.2f} ms ({t_eager/t_disp:.2f}x)")
print(f"parity max abs diff: {d:.3e}")
assert d < 1e-4, "PARITY FAILED"

# grad through dispatcher path (train mode for real grad flow)
blk.train()
blk.zero_grad()
out, *_ = blk(x)
out.sum().backward()
g = sum(p.grad.abs().sum().item() for p in blk.parameters() if p.grad is not None)
print(f"grad mass: {g:.2f}")
assert g > 0, "GRAD FAILED"
print(f"last dispatch mode: {blk._last_dispatch}")
print("PORT PARITY + GRAD PASS")
