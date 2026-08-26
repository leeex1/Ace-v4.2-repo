---
title: Bayesian Inference
parent: probabilistic_reasoning
section: 1
---

# Bayesian Inference

## Overview
Bayesian inference is a formal framework for updating beliefs in light of new evidence using Bayes' theorem. This sub-skill covers prior specification, likelihood construction, posterior computation, model comparison, and Bayesian decision theory.

## Core Concepts
- **Bayes' Theorem**: P(H|E) = P(E|H) * P(H) / P(E). The posterior probability of a hypothesis given evidence is proportional to the likelihood of the evidence under the hypothesis times the prior probability.
- **Prior Distributions**: Informative priors (domain knowledge), weakly informative priors (broad constraints), and non-informative/reference priors (minimal influence). Sensitivity to prior choice must always be assessed.
- **Posterior Computation**: Analytical solutions for conjugate models; Markov Chain Monte Carlo (MCMC) for complex models; variational inference for large-scale problems.
- **Model Comparison**: Bayes factors, WAIC, LOO-CV, and posterior predictive checks for evaluating and comparing competing models.

## Application
Specify a prior that honestly reflects existing knowledge. Choose a likelihood that captures the data-generating process. Compute the posterior and assess sensitivity to prior assumptions. Report full posterior distributions, not just point estimates.

## Related Skills
uncertainty-quantification, monte-carlo-methods, probability-distributions
- [[system prompts/Quillan-Samurai.md]]


## Connections
- [[00 - Meta/04 - Skills & Capabilities.md|Skills & Capabilities MOC]]
- [[Skills/skills-master.md|Skills Master]]
- [[system prompts/Quillan-Samurai.md]]
- [[00 - Meta/04 - Skills & Capabilities.md]]
