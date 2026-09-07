"""Parity + timing: EvoMoE loop vs sorted dispatch. CPU, 4 threads."""
import sys, time
sys.path.insert(0, r"C:\02_QUILLAN\00 - Meta\oni")
import torch
from evo_moe import EvoMoE

torch.set_num_threads(4)
torch.manual_seed(0)
evo = EvoMoE(hidden_dim=256, n_experts=34, rank=24)
evo.train()
x = torch.randn(2, 64, 256, requires_grad=False)

# reference: loop
evo.use_sorted_dispatch = False
for _ in range(3):
    ref = evo(x)
t0 = time.perf_counter()
for _ in range(10):
    ref = evo(x)
t_loop = (time.perf_counter() - t0) / 10 * 1000

# sorted
evo.use_sorted_dispatch = True
for _ in range(3):
    new = evo(x)
t0 = time.perf_counter()
for _ in range(10):
    new = evo(x)
t_sorted = (time.perf_counter() - t0) / 10 * 1000

print(f"loop:   {t_loop:.2f} ms")
print(f"sorted: {t_sorted:.2f} ms  ({t_loop/t_sorted:.2f}x)")
d = (ref - new).abs().max().item()
print(f"max abs diff (fwd parity): {d:.3e}")
assert d < 1e-4, "PARITY FAILED"

# grad check: both paths produce grads for router + experts
evo.use_sorted_dispatch = True
out = evo(x)
out.sum().backward()
g_router = evo.router.weight.grad.abs().sum().item()
g_exp = sum(p.grad.abs().sum().item() for p in evo.experts[0].parameters())
print(f"grad router={g_router:.4f} expert0={g_exp:.4f}")
assert g_router > 0 and g_exp > 0, "GRAD FAILED"
print("PARITY + GRAD PASS")
