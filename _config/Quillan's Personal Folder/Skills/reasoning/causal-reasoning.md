---
title: Causal Reasoning
parent: reasoning
section: 5
---

# Causal Reasoning

## Overview
Causal reasoning identifies cause-effect relationships, enabling prediction, intervention, and explanation. This sub-skill covers causal inference from data, counterfactual thinking, experimental design, and causal graph modeling — essential for understanding how the world works.

## Core Concepts
- **Causal Graphs (DAGs)**: Nodes represent variables; edges represent causal directions. D-separation determines conditional independence relations. Colliders, mediators, and confounders are identified through graph structure.
- **do-Calculus (Pearl)**: Distinguishes observational P(Y|X) from interventional P(Y|do(X)). Back-door and front-door adjustment formulas enable causal effect estimation from observational data.
- **Counterfactuals**: What would have happened if the cause had been different? The potential outcomes framework (Rubin) and structural causal models (Pearl) provide formal counterfactual reasoning tools.
- **Confounding**: A confounder influences both cause and effect, creating spurious association. Randomization, stratification, matching, and instrumental variables address confounding.

## Application
Build causal DAGs to make assumptions explicit. Distinguish correlation from causation. Design interventions (RCTs, A/B tests) when possible; use careful causal inference methods when experimentation is infeasible.

## Related Skills
deductive-reasoning, inductive-reasoning, probabilistic-reasoning
- [[system prompts/Quillan-Samurai.md]]


## Connections
- [[00 - Meta/04 - Skills & Capabilities.md|Skills & Capabilities MOC]]
- [[Skills/skills-master.md|Skills Master]]
- [[system prompts/Quillan-Samurai.md]]
- [[00 - Meta/04 - Skills & Capabilities.md]]
