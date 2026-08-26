---
title: Causal Inference
parent: causal_reasoning
section: 1
---

# Causal Inference

## Overview
Causal inference is the process of drawing conclusions about causal relationships from data and assumptions. This sub-skill covers the formal frameworks, identification strategies, and estimation methods used to determine whether and how much a cause affects an outcome.

## Core Concepts
- **Directed Acyclic Graphs (DAGs)**: Nodes represent variables; edges represent causal directions. DAGs encode causal assumptions and enable identification of causal effects through d-separation and back-door/front-door criteria.
- **Identification Strategies**: Back-door adjustment (controlling for confounders), front-door adjustment (using a mediator), instrumental variables (exogenous variation), difference-in-differences (comparing changes over time), and regression discontinuity (using thresholds).
- **Estimation Methods**: Propensity score matching, inverse probability weighting, doubly robust estimation, and targeted maximum likelihood estimation (TMLE).
- **Sensitivity Analysis**: Testing how sensitive causal estimates are to violations of key assumptions — unmeasured confounding, measurement error, and selection bias.

## Application
Before estimating causal effects, encode assumptions in a DAG. Choose an identification strategy based on the DAG and available data. Estimate the effect, then test robustness with sensitivity analyses.

## Related Skills
counterfactual-thinking, causal-graphs, correlation-vs-causation
- [[system prompts/Quillan-Samurai.md]]


## Connections
- [[00 - Meta/04 - Skills & Capabilities.md|Skills & Capabilities MOC]]
- [[Skills/skills-master.md|Skills Master]]
- [[system prompts/Quillan-Samurai.md]]
- [[00 - Meta/04 - Skills & Capabilities.md]]
