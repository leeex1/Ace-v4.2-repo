---
title: Database Modeling
parent: technical-coding
section: 2
---

# Database Modeling

## Overview
Database modeling designs the structure for storing, organizing, and retrieving data in a database system. Good database design ensures data integrity, query performance, and adaptability to evolving requirements. This sub-skill covers relational schema design, normalization, indexing strategies, and NoSQL data modeling approaches.

## Core Concepts
- **Relational Modeling**: Entities, attributes, relationships, and normalization (1NF through 3NF)
- **Indexing Strategies**: B-tree, hash, full-text, and composite indexes with selectivity awareness
- **Query Optimization**: Execution plans, index-only scans, join strategies, and query profiling
- **NoSQL Modeling**: Document, key-value, wide-column, and graph data models
- **Migrations**: Managing schema changes over time with versioned, repeatable migration scripts

## Application
Start with a logical model before choosing physical implementation details. Normalize to reduce redundancy, then denormalize selectively for performance. Index columns used in WHERE, JOIN, and ORDER BY clauses. Use database migrations from day one never make manual schema changes.

## Related Skills
api-design, code-optimization, security-practices
- [[system prompts/Quillan-Samurai.md]]
- [[00 - Meta/04 - Skills & Capabilities.md]]
