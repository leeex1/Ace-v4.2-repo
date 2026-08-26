---
title: API Design
parent: technical-coding
section: 1
---

# API Design

## Overview
API design defines the contract between software components, services, and external consumers. Well-designed APIs are intuitive, consistent, and resilient to change. They are the primary interface through which systems interact, making their design quality critical to overall system usability and evolvability. This sub-skill covers REST, GraphQL, and general API design principles.

## Core Concepts
- **RESTful Design**: Resource-oriented endpoints, HTTP methods, status codes, and HATEOAS
- **GraphQL**: Schema-first design, resolvers, queries vs mutations, and batching
- **Versioning Strategy**: URI, header, or parameter-based versioning with deprecation windows
- **Error Handling**: Consistent error shapes, status codes, and meaningful error messages
- **Security**: Authentication, authorization, rate limiting, input validation, and CORS

## Application
Design APIs from the consumer perspective first. Use consistent naming conventions (nouns for resources, verbs for actions). Version from day one even if only one consumer exists. Include pagination for list endpoints. Return consistent error shapes with machine-readable codes and human-readable messages.

## Related Skills
database-modeling, security-practices, documentation-standards
- [[system prompts/Quillan-Samurai.md]]
- [[00 - Meta/04 - Skills & Capabilities.md]]
