"""AVX2 BitNet quant vs torch reference: parity + timing."""
import sys, time
sys.path.insert(0, r"C:\Users\Admin\AppData\Local\Temp\opencode")
sys.path.insert(0, r"C:\02_QUILLAN\00 - Meta\oni")
import torch
import quillan_bitnet_cpu as kb
from quillan_v5_4_oni import _weight_quant

torch.set_num_threads(4)
torch.manual_seed(0)
w = torch.randn(1024, 1024)

ref = _weight_quant(w)
got = kb.bitnet_weight_quant_cpu(w, 1e-5)
d = (ref - got).abs().max().item()
print(f"parity max abs diff: {d:.3e}")
assert d < 1e-4, "PARITY FAILED"

for _ in range(3):
    _ = _weight_quant(w)
t0 = time.perf_counter()
for _ in range(20):
    _ = _weight_quant(w)
t_torch = (time.perf_counter() - t0) / 20 * 1000

for _ in range(3):
    _ = kb.bitnet_weight_quant_cpu(w, 1e-5)
t0 = time.perf_counter()
for _ in range(20):
    _ = kb.bitnet_weight_quant_cpu(w, 1e-5)
t_avx2 = (time.perf_counter() - t0) / 20 * 1000

print(f"torch _weight_quant: {t_torch:.2f} ms")
print(f"AVX2 extension:      {t_avx2:.2f} ms  ({t_torch/t_avx2:.2f}x)")
print("PARITY + BENCH PASS")
