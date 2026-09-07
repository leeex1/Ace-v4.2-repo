"""Real-scale timing: BT=1024 tokens, D=1024 (production shape, CPU)."""
import sys, time
sys.path.insert(0, r"C:\02_QUILLAN\00 - Meta\oni")
import torch
from evo_moe import EvoMoE

torch.set_num_threads(4)
torch.manual_seed(0)
evo = EvoMoE(hidden_dim=1024, n_experts=34, rank=24)
evo.train()
x = torch.randn(2, 512, 1024)

evo.use_sorted_dispatch = False
for _ in range(2):
    ref = evo(x)
t0 = time.perf_counter()
for _ in range(5):
    ref = evo(x)
t_loop = (time.perf_counter() - t0) / 5 * 1000

evo.use_sorted_dispatch = True
for _ in range(2):
    new = evo(x)
t0 = time.perf_counter()
for _ in range(5):
    new = evo(x)
t_sorted = (time.perf_counter() - t0) / 5 * 1000

print(f"loop:   {t_loop:.1f} ms")
print(f"sorted: {t_sorted:.1f} ms  ({t_loop/t_sorted:.2f}x)")
d = (ref - new).abs().max().item()
print(f"max abs diff: {d:.3e}")
