# Structa – Agent Guide

This is a TypeScript monorepo for Structa, an AI-powered renovation assistant
combining floor plan editing with context-aware AI consultation (The Clerk).

## Quick Start

```bash
npm run typecheck    # Check types
npm run check:fix    # Lint and format
npm test             # Run tests
```

## Package Structure

- `packages/web` – Main app (TanStack Start, UI, Auth)
- `packages/core` – Business logic, DB schemas, utilities
- `packages/backend` – API endpoints, external integrations
- Reference projects: `packages/app-example/`, `packages/marketing-site-example/`

For detailed architecture, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Progressive Documentation

| Topic | Location |
|-------|----------|
| Development tools (Biome, Vitest, TypeScript, SST Dev) | [docs/development/DEVELOPMENT_TOOLS.md](docs/development/DEVELOPMENT_TOOLS.md) |
| Testing philosophy & TDD workflow | [docs/development/TESTING.md](docs/development/TESTING.md) |
| Coding conventions & style | [docs/development/CODING_STYLE.md](docs/development/CODING_STYLE.md) |
| Debugging & log locations | [docs/development/DEBUGGING.md](docs/development/DEBUGGING.md) |
| Tech stack with documentation links | [docs/stack/TECH_STACK.md](docs/stack/TECH_STACK.md) |
| Git workflow & PR process | [docs/workflow/GIT_WORKFLOW.md](docs/workflow/GIT_WORKFLOW.md) |
| Deployment rules | [docs/workflow/DEPLOYMENT.md](docs/workflow/DEPLOYMENT.md) |

## Important Rules

- Write tests before implementing (TDD project) → [docs/development/TESTING.md](docs/development/TESTING.md)
- Study patterns from `packages/app-example/` before coding
- Only deploy to personal stage: `npx sst deploy`
- Never run `npx sst deploy --stage dev` or `--stage production` (CI only)

## Local Development

- Run `sst dev` in mono mode to see all dev server logs in a single stream:
  ```bash
  npx sst dev --mode=mono
  ```
- This displays logs from Functions, Tasks, Frontends, and Services in one terminal
- Avoid `--mode=basic` - it doesn't start child processes and requires manual frontend startup
- For more SST dev mode options, see [docs/development/DEVELOPMENT_TOOLS.md](docs/development/DEVELOPMENT_TOOLS.md#sst-dev-mode)

## Project Context

- **Vision**: [docs/OVERVIEW.md](docs/OVERVIEW.md)
- **Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Current Status**: [docs/STATUS.md](docs/STATUS.md)
- **Development Plan**: [specs/plan/00-overview.md](specs/plan/00-overview.md)

## Subdirectory Overrides

If a subdirectory includes its own `AGENTS.md`, its instructions take precedence
for files within that subtree.
