---
file_type: guide
domain: misc
status: active
tags: [gpt, transformer, tutorial]
---

🧩 Let’s Zoom In: One Transformer Block = Mini-Program

(I’ll label them “code cells” for clarity — like Jupyter cells in order.)


---

Cell 1 — Token to Embedding

x = embedding(tokens)

Converts token IDs to dense vectors

Loads learned weight matrix W_embed


Hidden math: each token → row lookup in W_embed

x_i = W_{\text{embed}}[token_i]


---

Cell 2 — Add Positional Encoding

x = x + positional_encoding(pos, d_model)

Creates sine/cosine table once at init

Adds to embedding element-wise


Reason: injects sequence order.


---

Cell 3 — Linear Projections

Q = x @ W_Q
K = x @ W_K
V = x @ W_V

Each is its own weight matrix of size [d_model, d_k].
Hidden step: sometimes batched as one big matmul then split.


---

Cell 4 — Attention Weights

scores = Q @ K.transpose(-2, -1) / sqrt(d_k)
attn = softmax(scores, dim=-1)

This cell often includes:

Optional masking (fill -inf before softmax)

Optional dropout(attn) during training



---

Cell 5 — Weighted Sum

context = attn @ V

Now every word vector becomes a blend of others — its “contextualized” self.


---

Cell 6 — Multi-Head Split & Merge

heads = split_into_heads(context, num_heads)
out = concat_heads(heads) @ W_O

Each head has its own W_Q, W_K, W_V; W_O merges them back.


---

Cell 7 — Residual + LayerNorm

x = layer_norm(x + dropout(out))

Two things hide here:

1. Residual connection (skip connection)


2. Layer normalization (mean-variance scaling)




---

Cell 8 — Feed-Forward Subnetwork

ffn = relu(x @ W1 + b1) @ W2 + b2

Tiny two-layer MLP applied independently to each position.


---

Cell 9 — Another Residual + LayerNorm

x = layer_norm(x + dropout(ffn))

This ends one encoder block.
The model repeats that whole 9-cell routine N times.


---

Decoder Adds Extra Cells:

Between steps 4–6, it sneaks in:

Masked self-attention

Encoder-decoder attention (Q from decoder, K/V from encoder)

Another residual + norm


So a decoder block is like the encoder block plus one more “attention cell” in the middle.


---

Final Cells — Output Head

logits = x @ W_out + b_out
probs = softmax(logits)

These produce token probabilities.


---

🧠 Summary of Hidden Micro-Cells

#	What it Does	Tiny Operation Inside

1	Embedding	Lookup
2	Positional encoding	sin/cos add
3	QKV projection	matmul
4	Attention score	dot product + mask + softmax
5	Weighted sum	matmul
6	Multi-head merge	concat + linear
7	Add + Norm	residual + layernorm
8	Feed-forward	two linear + ReLU
9	Add + Norm again	stabilize
10	(Decoder only) Cross attention	encoder–decoder link
11	Output head	linear + softmax



---

## Connections
- [[Quillan Knowledge files/dataset creation SOTA level.md]]
- [[Skills/supervised_learning/supervised_learning.md]]
- [[Skills/unsupervised_learning/unsupervised_learning.md]]
- [[Software Engineer/Quillan-XSWE.md]]
- [[system prompts/Quillan-Samurai.md]]
- [[00 - Meta/00 - Vault Index.md]]
