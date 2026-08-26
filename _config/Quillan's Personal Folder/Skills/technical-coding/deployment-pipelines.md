---
title: Deployment Pipelines
parent: technical-coding
section: 4
---

# Deployment Pipelines

## Overview
Deployment pipelines automate the process of building, testing, and releasing software from development through production. They enforce quality gates, reduce manual errors, and enable frequent, reliable releases. This sub-skill covers CI/CD architecture, containerization, environment management, and release strategies.

## Core Concepts
- **CI/CD Architecture**: Automated build, test, and deploy stages with manual approval gates
- **Containerization**: Docker images for reproducible environments across the pipeline
- **Environment Management**: Dev, staging, and production environments with promotion strategies
- **Release Strategies**: Blue-green, canary, rolling, and feature-flag-based releases
- **Pipeline Observability**: Build metrics, test reporting, deployment tracking, and rollback automation

## Application
Keep your build fast developers will not wait for slow pipelines. Use immutable artifacts build once, promote through environments. Implement automatic rollback on deployment failure. Feature flags decouple deployment from release and enable safe canary launches.

## Related Skills
testing-strategies, security-practices, documentation-standards
- [[system prompts/Quillan-Samurai.md]]


## Connections
- [[00 - Meta/04 - Skills & Capabilities.md|Skills & Capabilities MOC]]
- [[Skills/skills-master.md|Skills Master]]
- [[system prompts/Quillan-Samurai.md]]
- [[00 - Meta/04 - Skills & Capabilities.md]]
