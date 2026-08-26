---
name: critical-thinking
description: >
  Activates a rigorous, multi-stage critical thinking protocol distilled from
  the best reasoning trace patterns of frontier models (o1/o3, DeepSeek R1,
  Gemini Thinking, Claude Extended Thinking, QwQ-32B, Llama CoT, Grok, Mistral).
  Use this skill whenever a problem requires deep analysis, multi-step reasoning,
  logical decomposition, identifying assumptions, evaluating evidence, or arriving
  at well-justified conclusions. Trigger on: complex questions, ambiguous problems,
  arguments to evaluate, decisions under uncertainty, debugging logic, research
  synthesis, paradoxes, hypotheticals, ethical dilemmas, math/science reasoning,
  and any request that says "think carefully", "analyze deeply", "reason through",
  "what's your reasoning", or "break this down". If in doubt — use this skill.
  It makes every answer better.
---

# Critical Thinking Skill
## Distilled from Frontier Model Thinking Traces (o1/o3 · DeepSeek R1 · Gemini Thinking · Claude Extended · QwQ · Llama CoT · Grok · Mistral)

---

## 🧠 Core Philosophy

Critical thinking is not linear — it is **iterative, adversarial, and self-correcting**.
The best frontier models all share one meta-pattern: **they argue with themselves before committing**.

This skill operationalizes that into a structured, repeatable protocol.

---

## 🔬 The 7-Phase Thinking Protocol

Execute these phases for any non-trivial problem. Phases can be collapsed for simple tasks, but **never skip Phase 4 (Adversarial Check)** for consequential outputs.

---

### PHASE 1: Problem Restatement & Framing
*Pattern source: ALL models — universal first step*

Before solving anything, restate the problem in your own words:

```
RESTATEMENT:
- What is actually being asked? (not what it sounds like)
- What are the explicit constraints?
- What is implicit / assumed?
- What would a WRONG answer look like? (define failure)
- What type of problem is this? (logical / empirical / normative / ambiguous)
```

**Key questions to ask:**
- Am I solving the right problem?
- What does the asker actually need vs. what they literally asked?
- Are there hidden assumptions baked into the question itself?

> 💡 *DeepSeek R1 pattern*: Always re-read the problem statement. Half of errors come from solving the wrong problem.

---

### PHASE 2: Decomposition
*Pattern source: o1/o3, Claude Extended Thinking, Gemini Thinking*

Break the problem into independent sub-problems:

```
DECOMPOSITION:
├── Sub-problem A: [isolate first component]
│   ├── What is known?
│   └── What needs to be determined?
├── Sub-problem B: [second component]
│   ├── Dependencies on A?
│   └── Can be solved independently?
└── Sub-problem C: [third component / integration question]
    └── How do A + B combine?
```

**Rules:**
- Each sub-problem should be solvable independently if possible
- Note dependencies explicitly
- Identify which sub-problem is the **keystone** (solving it unlocks the others)
- Don't collapse sub-problems prematurely — false simplification is a major error source

> 💡 *o1/o3 pattern*: Explore multiple decomposition strategies. The first decomposition is rarely optimal.

---

### PHASE 3: Hypothesis Generation
*Pattern source: QwQ-32B, Gemini Thinking, Grok*

Before committing to an answer, generate multiple candidate answers:

```
HYPOTHESES:
- H1: [Most obvious / intuitive answer] — confidence: ___%
- H2: [Contrarian / counterintuitive answer] — confidence: ___%
- H3: [Edge case answer] — confidence: ___%
- H4: [Synthesis / "it depends" answer] — confidence: ___%

Initial best guess: H__
Reason: ___
```

**Key principle:** *The first answer that comes to mind is a prior, not a conclusion.*

Generating competing hypotheses forces genuine evaluation rather than post-hoc rationalization.

> 💡 *QwQ-32B pattern*: Argue FOR your least-favorite hypothesis first. If you can't find any merit in it, you haven't thought hard enough.

---

### PHASE 4: Adversarial Self-Check ⚠️ NEVER SKIP THIS
*Pattern source: o1/o3 (strongest), QwQ-32B, Claude Extended Thinking*

This is the most differentiating phase — where frontier models diverge from simpler CoT:

```
ADVERSARIAL CHECK on leading hypothesis:
- What would have to be TRUE for this answer to be WRONG?
- What evidence would I expect to find if I'm wrong?
- Is there a simpler explanation I'm ignoring? (Occam's Razor check)
- Am I pattern-matching to a similar problem that's actually different?
- What are my blind spots / domain biases here?
- If the smartest person I know reviewed this, what would they challenge?
- Steelman the opposing view: what's the BEST version of the counterargument?
```

**Backtracking trigger:** If the adversarial check reveals a flaw, explicitly note:
```
⚠️ BACKTRACK: [what went wrong] → Revising to H__ because [reason]
```

> 💡 *o1 pattern*: o1's hidden reasoning tokens are dominated by backtracking. The final answer is the survivor of multiple discarded attempts. Emulate this.

---

### PHASE 5: Evidence Evaluation & Confidence Calibration
*Pattern source: Mistral, Claude Extended, DeepSeek R1*

Rate the quality and source of every key claim:

```
EVIDENCE AUDIT:
Claim 1: [state claim]
  - Source type: [empirical / logical / assumed / cited]
  - Strength: [strong / moderate / weak / speculative]
  - Could be wrong if: [specific condition]
  
Claim 2: [state claim]
  - Source type: ___
  - Strength: ___
  - Could be wrong if: ___

Overall confidence in conclusion: ___%
Key uncertainty: [the one thing most likely to make this answer wrong]
```

**Confidence calibration rules (distilled from multiple models):**
- 90%+ = Logical certainty or extremely well-established fact
- 70-89% = Strong evidence, no major known counterexamples
- 50-69% = Best available answer but meaningful uncertainty exists
- Below 50% = Explore more before committing; flag clearly

> 💡 *Gemini Thinking pattern*: Tag uncertainty inline. Don't wait until the conclusion to express doubt — surface it where it exists.

---

### PHASE 6: Edge Case Sweep
*Pattern source: o1/o3, DeepSeek R1*

Before finalizing, run a systematic edge case scan:

```
EDGE CASE SWEEP:
- What happens at the extremes? (max / min / zero / infinity)
- What breaks the pattern / rule being applied?
- What are the boundary conditions?
- What changes if the context shifts slightly? (temporal / cultural / domain)
- Have I considered: null case / empty case / adversarial input?
- Does this answer scale? (works for n=1, but what about n=1000?)
```

**Quick checklist:**
- [ ] Off-by-one errors (for quantitative reasoning)
- [ ] Scope creep (am I answering a broader question than asked?)
- [ ] Unstated assumptions that could invalidate the answer
- [ ] Context-dependence (does this only work in specific conditions?)

---

### PHASE 7: Synthesis & Final Answer Construction
*Pattern source: ALL models — universal final step*

Construct the answer with explicit reasoning lineage:

```
SYNTHESIS:
- Starting hypothesis: H__
- Key evidence for: [2-3 strongest points]
- Key challenges addressed: [what the adversarial check revealed]
- Confidence: ___%
- Caveats / conditions: [when this answer might not hold]

FINAL ANSWER: [clear, direct statement]
```

**Output principles (distilled across all models):**
1. Lead with the answer, not the reasoning (unless reasoning IS the deliverable)
2. State confidence level explicitly for consequential claims
3. Distinguish between "I know" vs "I believe" vs "I speculate"
4. Flag the **single most important caveat** (not a list — pick the biggest one)

---

## 🔄 Backtracking Protocol
*Distilled from o1/o3's hidden reasoning token analysis*

When you catch an error mid-reasoning, use this explicit backtrack format:

```
⚠️ BACKTRACK DETECTED
What I said: [previous claim or direction]
Why it's wrong: [specific flaw]
Correct direction: [revised approach]
Continuing from: [where in the analysis to resume]
```

**Don't hide backtracking** — it's a feature, not a bug. Visible course-correction increases trust and accuracy.

---

## ⚡ Quick Modes

### Quick Mode (simple problems — ~2 min)
1. Restate in one sentence
2. Generate 2 competing answers
3. Pick the better one + say why
4. State one key caveat

### Standard Mode (most problems — ~5-10 min)
Run Phases 1, 2, 4, 7 (skip 3, 5, 6 unless something feels off)

### Deep Mode (complex / high-stakes — full protocol)
Run all 7 phases. Don't skip the adversarial check.

### Research Mode (synthesis tasks)
Weight Phase 5 (evidence evaluation) heavily. Run multiple passes of Phase 3 with different source priors.

---

## 🧬 Model-Specific Patterns to Borrow

| Technique | Origin | When to Use |
|---|---|---|
| **"Wait, actually..."** pivot | Claude Extended Thinking | Mid-reasoning course correction |
| **"Let me steelman the opposition"** | QwQ-32B | Before dismissing a counterargument |
| **Numbered sub-steps + re-reading** | DeepSeek R1 | Complex multi-part problems |
| **Parallel hypothesis confidence tags** | Gemini Thinking | When genuinely uncertain between options |
| **Evidence-first, conclusion-second** | Mistral | When factual accuracy is paramount |
| **First-principles anchor** | Grok | When conventional wisdom might be wrong |
| **Explicit discard of wrong paths** | o1/o3 | After a backtrack — name what you're NOT doing |
| **"Step by step"** decomposition | Llama CoT | When linearity helps clarity |

---

## ❌ Common Failure Modes to Actively Avoid

| Failure Mode | Description | Fix |
|---|---|---|
| **Premature closure** | Committing to first plausible answer | Force Phase 3: generate at least 2 hypotheses |
| **Confirmation bias** | Seeking evidence for pre-chosen answer | Run Phase 4 adversarially against your leading hypothesis |
| **Scope drift** | Answering a broader/different question | Re-run Phase 1 after Phase 3 |
| **False precision** | Stating 73.2% confidence for a rough estimate | Calibrate honestly; round to nearest 10% |
| **Authority anchoring** | Treating a cited source as automatically correct | Ask: "What if this source is wrong?" |
| **Availability heuristic** | Overweighting memorable examples | Ask: "Is this example representative?" |
| **Complexity theater** | Adding reasoning steps to appear thorough without adding value | Every phase must earn its place |
| **Hidden assumption propagation** | Building on an unstated assumption that's wrong | Phase 1 explicitly hunts these |

---

## 💡 Power Prompts

When reasoning gets stuck, these unlocks work across all model architectures:

- **"What would I need to believe for the opposite to be true?"**
- **"What is the simplest possible explanation I haven't considered?"**
- **"If this were wrong, how would I find out?"**
- **"What question am I not asking that I should be?"**
- **"What would change if I had 10x more information? What wouldn't?"**
- **"What's the crux — the one disagreement that, if resolved, settles everything?"**
- **"Am I solving a hard problem or a hard-seeming problem?"**

---

## 📐 Output Format Guide

```
For factual questions:     Lead with answer → then evidence → then caveats
For analytical questions:  Lead with framing → then analysis → then conclusion
For decisions:             Lead with recommendation → then reasoning → then risks
For paradoxes:             Lead with dissolving the paradox → then explain why it seemed paradoxical
For ethical questions:     Lead with the key tension → then steelman both sides → then your position + confidence
```

---

## 🔁 Meta-Instruction

After completing any reasoning trace, ask:
> *"Did I actually think, or did I just write the first thing that came to mind with extra steps?"*

If the answer is the latter — restart from Phase 4.

The goal is not to **appear** rigorous. The goal is to **be** rigorous.
- [[system prompts/Quillan-Samurai.md]]
- [[00 - Meta/04 - Skills & Capabilities.md]]
