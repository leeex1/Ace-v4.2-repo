"""Full-step phase profile, 6-layer production shape, CPU. No checkpoints touched."""
import sys, time, cProfile, pstats, io
sys.path.insert(0, r"C:\02_QUILLAN\00 - Meta\oni")
import torch
from quillan_v5_4_oni import QuillanOniConfig, QuillanRoninOni

torch.set_num_threads(4)
cfg = QuillanOniConfig(n_layer=6, max_seq_len=512, hidden_dim=1024, n_head=4)
model = QuillanRoninOni(cfg)
model.train()
x = torch.randint(0, 50257, (1, 256))
opt = torch.optim.AdamW(model.parameters(), lr=3e-4)

def one_step():
    t = {}
    t0 = time.perf_counter()
    logits, ce, aux = model(x, labels=x)
    t["forward"] = time.perf_counter() - t0
    t0 = time.perf_counter()
    loss = ce + model.total_aux_loss(aux)
    loss.backward()
    t["backward"] = time.perf_counter() - t0
    t0 = time.perf_counter()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    opt.step()
    opt.zero_grad()
    t["optim"] = time.perf_counter() - t0
    return t, float(ce.item())

# warmup
one_step()
T, L = {"forward": 0.0, "backward": 0.0, "optim": 0.0}, None
N = 3
for _ in range(N):
    t, L = one_step()
    for k in T:
        T[k] += t[k]
print(f"batch=1 seq=256 6-layer CPU per-step: " +
      " ".join(f"{k}={T[k]/N:.2f}s" for k in T) +
      f" total={sum(T.values())/N:.2f}s loss={L:.3f}")

# per-block forward split (eval, no grad): attention vs MoE
model.eval()
xe = torch.randint(0, 50257, (1, 256))
with torch.no_grad():
    h = model.wte(xe)
    for i, blk in enumerate(model.h):
        t0 = time.perf_counter()
        for _ in range(3):
            _ = blk(h)
        print(f"block{i} fwd x3: {(time.perf_counter()-t0)/3*1000:.0f} ms")
        break
