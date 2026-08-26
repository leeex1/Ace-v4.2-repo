# 👑 QUILLAN-RONIN v5.3.1 — COMPLETE REPOSITORY & DATASET MAPPING

This document serves as the **authoritative reference master** mapping all code components, checkpoints, training datasets, multi-modal assets, formal research papers, and sampling parameters across the `C:\02_QUILLAN` repository.

---

## 1. 🏗️ Core Model Architecture (`Quillan-Ronin v5.3.1`)

- **Primary Source Code**: [`_dev/quillan_v8_saturated.py`](file:///C:/02_QUILLAN/_dev/quillan_v8_saturated.py)
- **Active Parameter Count**: **~342 Million Physical Parameters**
- **Simulated Swarm Capacity**: **9 Billion Swarm Agents** (emulated via Rank-24 EGGROLL low-rank dynamic adapters)
- **Layer Allocation**:
  - **Input Ingestion Layer**: 50,257 vocabulary embeddings + 4 modality embeddings + dual Q1/Q2 ingestion bridges.
  - **9-Vector Prism Decomposition**: Projects input across 9 parallel vectors (`Language`, `Sentiment`, `Context`, `Intent`, `Meta`, `Creativity`, `Ethics`, `Strategy`, `Constraint`).
  - **34 Council Experts**: `C0-ASTRA` through `C33-PREDATOR` with Top-4 sparse Mixture-of-Experts routing.
  - **Sovereign Flash Diffusion Core**: 14-step flash diffusion attention backbone.
  - **Residual Skip Bridges**: 4 internal skip connections ($z + \text{decomp}$, $\text{blueprint} + \text{diff}$, $x_{\text{diff}} + \text{moe}$, $x_{\text{norm}} + \text{finalizer}$).

---

## 2. 💾 Checkpoints Registry (`C:\02_QUILLAN\checkpoints`)

### A. SFT Aligned Checkpoints (`checkpoints/checkpoints_sft/`)
1. [`quillan_hyper_tuned_v531.pt`](file:///C:/02_QUILLAN/checkpoints/checkpoints_sft/quillan_hyper_tuned_v531.pt) **(Active Production Master)**
   - **Best Loss**: **0.3054** (Step loss: 0.5616)
   - **Capabilities**: Zero-stutter fluent English, 34 Council Expert routing, code synthesis.
2. [`quillan_final_explanatory_master.pt`](file:///C:/02_QUILLAN/checkpoints/checkpoints_sft/quillan_final_explanatory_master.pt)
   - **Best Loss**: **1.5305**
   - **Capabilities**: Multi-paragraph explanatory speech generation.
3. [`quillan_thinking_reasoning_master.pt`](file:///C:/02_QUILLAN/checkpoints/checkpoints_sft/quillan_thinking_reasoning_master.pt) *(In Progress)*
   - **Goal**: Full `<think> ... </think>` Chain-of-Thought step-by-step reasoning alignment.
4. [`quillan_omni_general_v531.pt`](file:///C:/02_QUILLAN/checkpoints/checkpoints_sft/quillan_omni_general_v531.pt)
   - **Goal**: Multi-domain general knowledge generalization.

### B. Pre-trained Base Checkpoints (`checkpoints/checkpoints_v2/`)
1. [`quillan_full_base_final.pt`](file:///C:/02_QUILLAN/checkpoints/checkpoints_v2/quillan_full_base_final.pt) **(1.81 GB)**: Pre-trained master base weights.
2. [`quillan_sovereign_step2000.pt`](file:///C:/02_QUILLAN/checkpoints/checkpoints_v2/quillan_sovereign_step2000.pt) **(1.81 GB)**: 2,000-step pre-trained sovereign base checkpoint.
3. [`quillan_finetuned.pt`](file:///C:/02_QUILLAN/checkpoints/checkpoints_v2/quillan_finetuned.pt) **(1.81 GB)**: Fine-tuned base checkpoint.

---

## 3. 📊 Training Datasets Registry (`C:\02_QUILLAN\training_data`)

| Dataset Name | File Size | Description |
| :--- | :--- | :--- |
| `quillan_corpus_CLEAN_V7.jsonl` | **550.8 MB** | Master multi-domain clean knowledge & reasoning corpus |
| `full_train.jsonl` | **71.4 MB** | Full instruction & multi-turn training data |
| `instruct_train.jsonl` | **60.6 MB** | Instruction pairs containing gold `<think>` reasoning traces |
| `GPT_5.5_Distilled.jsonl` | **46.7 MB** | Distilled step-by-step reasoning from frontier models |
| `train.jsonl` | **30.7 MB** | Core training set |
| `quillan_12mb_training_dataset.jsonl` | **12.5 MB** | Compact multi-domain dataset |
| `code_train.jsonl` | **12.5 MB** | Software engineering & algorithmic `<think>` reasoning traces |
| `pdf_papers_corpus.jsonl` | **9.48 MB** | Extracted formal academic research paper corpus |
| `quillan_science_additional.jsonl` | **4.39 MB** | Additional scientific & mathematical reasoning data |
| `quillan_science_absolute.jsonl` | **2.65 MB** | Fundamental physics, quantum mechanics & calculus data |
| `Quillan_Hyper_Tune_Gold_Dataset.jsonl` | **114.9 KB** | 150 gold-standard alignment samples |
| `Quillan_Explanatory_Prose_Dataset.jsonl` | **76.2 KB** | Multi-paragraph explanatory speech dataset |
| `Quillan_General_Knowledge_Dataset.jsonl` | **56.2 KB** | 10-domain real-world general knowledge dataset |

---

## 4. 🎨 Multi-Modal & Knowledge Base Directory Mappings

- **`06_Media/`**: Videos, music tracks, explainer videos, and media production assets.
- **`Formal Papers/`**: Academic PDF papers covering deep learning, quantum physics, and mathematics.
- **`Audio Engineer/`**: Sound engineering assets, waveforms, and audio processing pipelines.
- **`01_Knowledge_Base/`**: Structured knowledge notes, architectural records, and system specifications.
- **`Book Series/`**: Narrative literature, technical books, and long-form prose corpus.
- **`Quillan Knowledge files/`**: Custom domain knowledge files.
- **`Main images/`**: Visual assets and image datasets.

---

## 5. ⚙️ Production Inference & Sampling Rules

To maintain **0% token stuttering** and articulate English speech:

1. **Immediate Previous-Token Hard Blocking**:
   ```python
   if len(generated) > 0:
       prev_tok = generated[-1]
       curr_logits[0, prev_tok] -= 50.0  # Prevents back-to-back word repetition loops
   ```
2. **Window Repetition Penalty**: `curr_logits[0, tid] -= (4.0 * count)` over a 48-token sliding window.
3. **Sampling Parameters**:
   - `temp`: `0.25` (Optimal balance between creativity and structural precision)
   - `top_p`: `0.90` (Nucleus sampling)
   - `max_tokens`: `2500` (Full multi-paragraph speech headroom)

---

*Document generated and mapped for Quillan-Ronin v5.3.1 system reference.*
