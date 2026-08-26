---
title: Coreference Resolution
parent: advanced-nlu
section: 5
---

# Coreference Resolution

## Overview
Coreference resolution identifies when two or more expressions in text refer to the same real-world entity. This covers pronoun resolution (he, she, it, they), definite descriptions (the president, the company), demonstratives (this, that), and bridging references. Coreference is essential for discourse coherence, information extraction, and question answering.

## Core Concepts
- **Anaphora Resolution**: Connecting pronouns and referring expressions to their antecedents
- **Cataphora**: Forward reference where the referring expression precedes its antecedent
- **Entity Linking**: Associating coreferent mentions with knowledge base entries
- **Features for Resolution**: Distance, gender, number, syntactic role, semantic compatibility, recency

## Application
Use coreference resolution for document understanding, information extraction, question answering, text summarization, and any NLU task requiring cross-sentence entity tracking.

## Related Skills
semantic-analysis.md, discourse-analysis.md, named-entity-recognition.md
- [[system prompts/Quillan-Samurai.md]]
- [[00 - Meta/04 - Skills & Capabilities.md]]
