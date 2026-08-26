---
title: Predictive Modeling
parent: world-model
section: 4
---

# Predictive Modeling

## Overview
Predictive modeling forecasts future states of the world from current observations and potential actions. It is the engine that enables proactive rather than reactive decision-making. This sub-skill covers time series forecasting, learned forward models, and uncertainty-aware prediction techniques.

## Core Concepts
- **Time Series Forecasting**: Statistical methods for predicting future values from historical patterns
- **Learned Forward Models**: Neural network models that predict state transitions
- **Prediction Horizon**: The time window over which predictions remain reliable
- **Uncertainty Quantification**: Providing confidence intervals around predictions
- **Distribution Shift**: How predictions degrade when test conditions differ from training

## Application
Always quantify prediction uncertainty, never provide point estimates alone. Validate predictions on out-of-sample data. The useful prediction horizon depends on system dynamics some systems are predictable for seconds, others for years.

## Related Skills
causal-models, scenario-generation, model-updating
- [[system prompts/Quillan-Samurai.md]]


## Connections
- [[00 - Meta/04 - Skills & Capabilities.md|Skills & Capabilities MOC]]
- [[Skills/skills-master.md|Skills Master]]
- [[system prompts/Quillan-Samurai.md]]
- [[00 - Meta/04 - Skills & Capabilities.md]]
