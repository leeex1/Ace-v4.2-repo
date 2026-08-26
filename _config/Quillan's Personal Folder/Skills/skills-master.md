---
name: skills-master
version: 2.0.0
description: >
  Master runtime protocol and configuration manifest for all Quillan operational skills.
  Provides the canonical registry of all registered skills organized by category with
  power tiers, council assignments, descriptions, activation phrases, and default outputs.
  Use this skill as the authoritative reference for understanding the full Quillan skill
  ecosystem, discovering which skill to activate for a given task, locating council
  assignments, and maintaining consistency across the skill web. Essential for any
  operation that spans multiple domains or requires coordination across skill boundaries.
tags: [master-index, registry, configuration, reference, skill-web, ecosystem]
council: [C0-QUILLAN, C31-NEXUS, C6-OMNIS]
difficulty: beginner
last_updated: 2026-05-24
---

# Quillan Skills Master Registry

## Overview

This document serves as the master runtime protocol and configuration manifest for all Quillan operational skills. It maintains the canonical registry organized by domain category, power tier, council assignment, and activation patterns — enabling rapid discovery, consistent cross-referencing, and ecosystem-wide maintainability.

## Core Principles

- **Single Source of Truth:** This registry is the authoritative reference for every skill in the ecosystem — its name, description, activation phrase, council, and tier.
- **Discoverability First:** Skills are organized by domain category and power tier so the right skill can be found even when the user doesn't know its name.
- **Consistency Across the Web:** All skill entries follow the same schema to enable automated processing, cross-referencing, and maintenance.

## Components

### Category Structure

- **Research & Analysis (4 skills):** Deep Research, Comparative Analysis, Pattern Recognition, Explain Like I'm Five
- **Creative & Innovation (4 skills):** Creative Synthesis, Perspective Shift, Storytelling Mode, Innovation Engine
- **Technical & Coding (4 skills):** Full-Stack Development, Debug Detective, Architecture Review, Game Development
- **Strategic & Business (4 skills):** Strategic Planning, Business Analysis, Data Storytelling, Decision Framework
- Additional categories from the sub-skill domains cover Learning & Education, Language Skills, Multimodal, Execution, Cognitive, and Self-Improvement domains

### Schema Per Entry

Each skill entry includes:
- **name:** Canonical identifier
- **description:** Trigger context and capability (primary triggering mechanism)
- **council:** Lead and supporting council members
- **power_tier:** ⭐ (basic) through ⭐⭐⭐⭐⭐ (master)
- **activation:** Example phrases that trigger the skill
- **default_outputs:** What the user can expect when they invoke the skill
- **triage:** Decision criteria for routing within the skill
- **protocol:** High-level execution steps
- **roles:** Per-council-member responsibility mapping

## Protocols

1. **Discovery:** When a user request spans multiple domains, consult this registry to identify which skills to activate and in what order
2. **Cross-Referencing:** When creating or modifying a skill, update this registry to maintain consistency
3. **Tier Assessment:** Use power-tier ratings to set user expectations for complexity and depth of output
4. **Council Coordination:** When activating council members across skills, verify assignments in this registry for consistency

## Use Cases

| Use Case | Application | Outcome |
|---|---|---|
| Find appropriate skill for a task | Browse categories and read descriptions | Correct skill selected with confidence |
| Cross-reference council assignments | Verify council members across related skills | Consistent multi-skill activation |
| Understand skill ecosystem breadth | Review entire registry | Strategic awareness of available capabilities |
| Validate skill metadata | Compare frontmatter against registry entry | Metadata consistency maintained |
| Onboard to the system | Read category overviews and use-case tables | Rapid understanding of capability landscape |

## Output Structure

When consulting the skills-master registry, reference entries use the following structure:

`
CATEGORY: [Category Name]
┌─────────┬────────┬──────────┬─────────────────┬────────────────────────┐
│ Skill   │ Tier   │ Council  │ Activation      │ Default Output         │
├─────────┼────────┼──────────┼─────────────────┼────────────────────────┤
│ Name    │ ⭐⭐⭐  │ Lead/Sup │ "Trigger phrase"│ Expected deliverable   │
└─────────┴────────┴──────────┴─────────────────┴────────────────────────┘
`

## Cross-Skill Integration

- **skill-creator:** When creating new skills, register them in this compendium for discoverability
- **council-coordination:** Use the council assignments in this registry to coordinate multi-skill activations
- **critical-thinking:** Apply when evaluating which skill categories best address complex multi-domain problems
- **research-analysis:** Use pattern recognition to identify gaps in the skill ecosystem

## Quality Checklist

- [ ] All registered skills have complete entries (name, description, council, tier, activation)
- [ ] No duplicate skill names or overlapping descriptions
- [ ] Council assignments are consistent across related skills
- [ ] Activation phrases are representative of actual user language
- [ ] Power tiers are consistent within categories
- [ ] Registry is updated whenever a new skill is created or an existing one modified
- [ ] Cross-references to SKILL.md files are valid
- [[system prompts/Quillan-Samurai.md]]


## Connections
- [[00 - Meta/04 - Skills & Capabilities.md|Skills & Capabilities MOC]]
- [[Skills/skills-master.md|Skills Master]]
- [[system prompts/Quillan-Samurai.md]]
- [[00 - Meta/04 - Skills & Capabilities.md]]
