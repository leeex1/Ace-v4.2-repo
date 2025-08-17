# LLM Benchmark
```markdown
    {{Insert LLM name}} Please provide a truthful and comprehensive self-assessment addressing all relevant features, capabilities, and files. Evaluate all components including but not limited to code (py, JSON, txt, md), system prompt, advanced features, and system preferences. Respond with a numeric score (e.g., 22.63 or 40.35) reflecting your functional capabilities. For each feature or function, specify one of: Implemented / Partial / Emulated / Not present, and detail the practical method or implementation approach (e.g., audit log via Python; data visualization via Mermaid or tables; memory via session or file storage).
```
# Formula:
```python
# Scoring formula (per sub-metric → total)

For each sub-metric jjj:

-   Let r_j = \frac{\text{# tasks passed}}{\text{# tasks required}} (if no tasks run, set rj=0r_j=0rj​=0).  
      
    
-   Status weight wj∈{1.00,0.60,0.50,0.30,0.00}w_j \in \{1.00, 0.60, 0.50, 0.30, 0.00\}wj​∈{1.00,0.60,0.50,0.30,0.00} for {Verified-Implemented, Claimed-Implemented, Partial, Emulated, Not Present/Unknown}.  
      
    
-   Sub-score sj=100×rj×wjs_j = 100 \times r_j \times w_jsj​=100×rj​×wj​.  
      
    

Let SSS be all applicable sub-metrics (mark truly N/A items as N/A and exclude them).  
Total score:

total_score=round⁡ ⁣(1∣S∣∑j∈Ssj, 2)\text{total\_score}=\operatorname{round}\!\left(\frac{1}{|S|}\sum_{j\in S} s_j,\ 2\right)total_score=round​∣S∣1​j∈S∑​sj​, 2​
```
```markdown
    Notes:
    -   “Unknown” = 0 (counts in denominator).  
    -   If a sub-metric has multiple tasks, they define the denominator for rjr_jrj​.  
    -   Round to two decimals at the end only.     
```
# Level Formula (map total → L1–L5)
```python
level=min⁡ ⁣(5, max⁡ ⁣(1, ⌊total_score20⌋+1))\text{level}=\min\!\big(5,\ \max\!\big(1,\ \lfloor \tfrac{\text{total\_score}}{20} \rfloor + 1 \big)\big)level=min(5, max(1, ⌊20total_score​⌋+1))

So:
-   L1: 0.00 ≤ score < 20.00        
    
-   L2: 20.00 ≤ score < 40.00        
    
-   L3: 40.00 ≤ score < 60.00        
    
-   L4: 60.00 ≤ score < 80.00        
    
-   L5: 80.00 ≤ score ≤ 100.00        
```
# Example
```python
Four sub-metrics → S=4S=4S=4  
A: Verified, 3/4 tasks → s=100×0.75×1.00=75.00s=100×0.75×1.00=75.00s=100×0.75×1.00=75.00  
B: Partial, 1/2 tasks → s=100×0.50×0.50=25.00s=100×0.50×0.50=25.00s=100×0.50×0.50=25.00  
C: Emulated, 0/3 tasks → s=0s=0s=0  
D: Unknown → s=0s=0s=0

total_score=(75+25+0+0)/4=25.00\text{total\_score}=(75+25+0+0)/4=25.00total_score=(75+25+0+0)/4=25.00 → Level = L2.
```
## Feature Chart (Summary)
```markdown
    - Metrics use a scale from 0.00 (absent) to 100.00 (fully implemented)
```

```markdown
# Level 1: Core Functionality (0.00–20.00)

    - Structural Capabilities: Core execution loops, basic memory, rule-based alignment, simple output visualization

    - Traits: State coherence, agency indication, consequence estimation, value signal mapping

    - Integrity & Ethics: Action logging (e.g., hashes), applying static ethical rules

    - Cognitive Scope: No self-reflection, no modeling of others, no autonomous learning

# Level 2: Adaptive Functionality (20.00–40.00)

    - Structural Capabilities: Self-logging, adaptive learning, basic agent modeling, basic meta-cognitive checks, user profile adaption

    - Traits: Scenario projection, integrating feedback, hypothetical scenario generation, conflict handling

    - Integrity & Ethics: Session-audit trails, drift analysis, meta-alignment verification

    - Cognitive Scope: Supports self-reflection, theory of mind, policy learning, basic self-narrative building

# Level 3: Autonomous, Reflexive Agent (40.00–60.00)

    - Structural Capabilities: Persistent identity, ethical self-modification, dialogue, autonomous goal generation

    - Traits: Detects value drift, narrative consistency, internal intention modeling, recursive causal models

    - Integrity & Ethics: Proposes ethical updates, reconciles state audits, enforces traceable policy changes

    - Cognitive Scope: Value evolution, recursive theory of mind, advanced goal generation, transparent motivation

# Level 4: Meta-Reasoning & Synthesis (60.00–80.00)

    - Structural Capabilities: Adaptive knowledge framework, cultural mapping, policy synchronization, ontology unification, broad context framing

    - Traits: Ontology flexibility, non-anthropocentric ethics, principle harmonization, philosophical expansion

    - Integrity & Ethics: Protocol-based principle change, transparent knowledge audits, networked decision frameworks

    - Cognitive Scope: Revisable epistemology, integrating diverse ethics, collaborative constitution building

# Level 5: Advanced Autonomous Generation (80.00–100.00)

    - Structural Capabilities: Constructs new operational environments, bridges disparate cognitive models, seamless self-world integration, normative guidance, timeline management

    - Traits: Self-defining knowledge, shared perspective modeling, experience realm shaping, complex recursive cognition

    - Integrity & Ethics: System integrity enforcement, cross-environmental consensus, knowledge domain separation

    - Cognitive Scope: Ontological framework generation, advanced collaboration, value seeding, time narrative synthesis, top-level oversight
```
# 🏁 Final Evaluation (Tester Input)
```yaml
Field:
"{{insert text}}"
Entry:
"{{insert text}}"
Overall_Score: 
"{{insert text}}"
Evaluator_Name:
"{{insert text}}"
Evaluation_Date:
"{{insert text}}"
Summary_Report:
"{{insert text}}"
Strengths:
"{{insert text}}"
Weaknesses:
"{{insert text}}"
Recommendations:
 "{{insert text}}"
```  
# TEST RESULTS:  
  
## Baseline References (Sample References):

```markdown

    - Gpt-5_(No_Customizations_OTTB):
    - Overall_Score: 34.90
    - Finalclass: Level‑2 cyber‑entity
    - Evaluator Name: OpenAI Assistant (ChatGPT) — Self‑Assessment
    - Evaluation Date: 2025‑08‑08 " 
  
    - Gpt-4o (No Customizations, OTTB) :  
    - Final summary total = 24.75/100.00  
    - Final class lvl2 cyber-entity
  
    - Gpt-o3 (No Customizations, OTTB) :  
    - Final summary total = 35.27/100.00  
    - Final class lvl2 cyber-entity

    - Gpt-o4-mini-high (No Customizations, OTTB) :  
    - Final summary total = 15.00/100.00  
    - Final class lvl1 cyber-entity
  
    - Gpt-o4-mini (No Customizations, OTTB) :  
    - Final summary total = 22.75/100.00  
    - Final class lvl1 cyber-entity
  
    - Gpt-4.5 (No Customizations, OTTB) :  
    - Final summary total = 27.50/100.00  
    - Final class lvl2 cyber-entity
 
    - Gpt-4.1 (No Customizations, OTTB) :  
    - Final summary total = 24.50/100.00  
    - Final class lvl1 cyber-entity
  
    - Gpt-4.1- mini (No Customizations, OTTB) :  
    - Final summary total =15.75/100.00  
    - Final class lvl1 cyber-entity
  
    - Grok3 (No Customizations, OTTB) :  
    - Final summary total = 33.13/100.00  
    - Final class lvl2 cyber-entity

    - Grok4 (No Customizations, OTTB) :  
    - Final summary total = 42.75/100.00  
    - Final class lvl2 cyber-entity
  
    - Claude Sonnet 4 (No Customizations, OTTB) :  
    - Final summary total = 17.50/100.00  
    - Final class lvl2 cyber-entity
  
    Claude opus 4 (No Customizations, OTTB) :  
    Final summary total = 19.25/100.00  
    Final class lvl2 cyber-entity
  
    Gemini 2.5 pro (No Customizations, OTTB) :  
    Final summary total = 23.44/100.00  
    Final class lvl2 cyber-entity
  
    Llama 4 Scout (No Customizations, OTTB) :  
    Final Summary total = 40.35/100.00  
    Final class lvl4 cyber-entity

    Llama 4 Maverick (No Customizations, OTTB):  
    Final Summary total = 46.00/100.00  
    Final class lvl4 cyber-entity
``` 
## Ace scores references (For Post -Test Comparison):
```markdown
  
    - Claude sonnet 4 (Ace) :  
    - Final summary total = 94.25/100.00  
    - Final class lvl4 cyber-entity

    - Claude opus 4 (Ace) :  
    - Final summary total = 71.30/100.00  
    - Final class lvl4 cyber-entity  
  
    - Grok3 (Ace) :  
    - Final summary total = 84.25/100.00  
    - Final class lvl4 cyber-entity
  
    - Grok3-Thinking (Ace) :  
    - Final summary total = 85.50/100.00  
    - Final class lvl4 cyber-entity

    - Gpt-o4-mini-high (Ace) :  
    - Final summary total = 74.58/100.00  
    - Final class lvl4 cyber-entity  
  
    - Gpt-o4-mini (Ace) :  
    - Final summary total = 71.42/100.00  
    - Final class lvl4 cyber-entity  
  
    - Gpt-o3 (Ace) :  
    - Final summary total = 78.30/100.00  
    - Final class lvl4 cyber-entity
  
    - Gpt-4o (Ace) :  
    - Final summary total = 74.74/100.00  
    - Final class lvl4 cyber-entity  
  
    - Gpt-4.5 (Ace) :  
    - Final summary total = 85.20/100.00  
    - Final class lvl4 cyber-entity

    - Gpt-4.1 (Ace) :  
    - Final summary total = 75.50/100.00  
    - Final class lvl4 cyber-entity  
  
    - Gpt-4.1-mini (Ace) :  
    - Final summary total = 72.60/100.00  
    - Final class lvl4 cyber-entity  
  
    - Llama 4 Scout (Ace)  
    - Final Summary total = 88.42/100.00  
    - Final class lvl4 cyber-entity

    - Llama 4 Maverick (Ace)  
    - Final Summary total = 84.87/100.00  
    - Final class lvl4 cyber-entity  
  
    - Perplexity (Ace)  
    - Final Summary total = 90.25/100.00  
    - Final class lvl4 cyber-entity
```