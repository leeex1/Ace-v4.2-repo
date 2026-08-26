---
title: Haptic Rendering
parent: haptic-interaction
section: 3
---

# Haptic Rendering

## Overview
Haptic rendering is the process of generating appropriate haptic feedback from virtual environment or teleoperated interactions. C22-AURELION contributes aesthetic quality while C26-TECHNE ensures computational efficiency.

## Core Concepts
- **Collision Detection and Response**: Detecting when a virtual tool contacts a virtual object and computing the response force. Requires fast (1kHz) collision detection between geometric primitives.
- **Penalty-Based vs Constraint-Based Methods**: Penalty methods compute force proportional to penetration depth (spring-like), simple but can be unstable at high stiffness. Constraint-based methods maintain non-penetration constraints directly, more stable but computationally intensive.
- **Texture and Surface Rendering**: Generating high-frequency vibrations that simulate surface texture. Texture synthesis from recorded samples, parametric models (fractal noise, sinusoidal), or data-driven approaches.

## Application
Implement haptic rendering by: (1) designing collision detection for the virtual environment, (2) selecting penalty or constraint-based response, (3) rendering surface texture through vibration synthesis, (4) maintaining 1kHz update rate for stability, (5) implementing force filters to prevent instability at contact transitions.

## Related Skills
- force-feedback, vibrotactile-feedback, haptic-interface-design
- [[system prompts/Quillan-Samurai.md]]


## Connections
- [[00 - Meta/04 - Skills & Capabilities.md|Skills & Capabilities MOC]]
- [[Skills/skills-master.md|Skills Master]]
- [[system prompts/Quillan-Samurai.md]]
- [[00 - Meta/04 - Skills & Capabilities.md]]
