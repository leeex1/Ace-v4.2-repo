# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (api-server)
- **Database**: PostgreSQL + Drizzle ORM (lib/db)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Metamon: Survival Rogue (`artifacts/metamon`)
- **Type**: react-vite, served at `/`
- **Description**: Pokémon × Metabots modular survival roguelike with 2.5D pixel sprites
- **Engine**: Pure canvas + React state — no external game libraries (hyper-optimized)
- **Features**:
  - 30 unique Metamon with individual base stats and visual designs
  - 6 modular part types per Metamon: head, body, arms, legs, tail, weapon
  - 30 parts across 5 element types (fire, water, grass, electric, dark/psychic/normal)
  - Team of 4 Metamon — mix and match for unique move loadouts
  - 6 auto-attack moves per Metamon (one per part slot)
  - Roguelike survival loop: progressive levels, enemy waves, increasing difficulty
  - Hyper-optimized: spatial grid hashing, object pooling (projectiles/enemies/particles), capped delta time
  - 3.5D pixel sprite rendering via SVG/canvas rect commands (rim lights, specular highlights, soft 2-layer drop shadows, ambient occlusion) — applied to both Metamon and enemies (incl. tier 1–4 and bosses)
  - Element-themed projectile sprites (fireball, water teardrop, lightning bolt, spinning leaf, dark crescent, psychic crystal shard) — switched on `Projectile.element` in renderer
  - Melee burst sprites (slash arc / shockwave / ring / fan) via `BurstEntity` pool in engine; spawned by `doMelee` based on weapon shape and element
  - Perspective ground floor: horizon-band gradient + transverse rows with quadratic perspective spacing + longitudinal lines converging to a vanishing point + corner vignette — replaces the flat scrolling grid
  - 8 attack patterns: aimed, spread3, spread5, horizontal, vertical, radial8, random, melee — non-aimed patterns auto-fire on cooldown
  - Enemy variety: tier 1–4 enemies with scaling HP/ATK, ranged/melee
  - Particle system, floating damage numbers, XP progression

### API Server (`artifacts/api-server`)
- **Type**: Express API, served at `/api`
- **Status**: Baseline only (health check endpoint)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/metamon run dev` — run game locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
