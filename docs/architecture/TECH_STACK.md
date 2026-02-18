# Structa Tech Stack

This document describes approved technologies used in Structa monorepo,
with links to official documentation.

## Contents

- [Overview](#overview)
- [UI & Styling](#ui--styling)
- [Data & State](#data--state)
- [Backend & Infrastructure](#backend--infrastructure)
- [Database](#database)
- [Development Tools](#development-tools)
- [Reference Implementations](#reference-implementations)
- [When in Doubt](#when-in-doubt)
- [Related Documentation](#related-documentation)

---

## Overview

For architectural context and how these technologies work together,
see [../ARCHITECTURE.md](../ARCHITECTURE.md).

---

## UI & Styling

| Technology | Purpose | Documentation |
|------------|---------|---------------|
| **TanStack Start** | Router + Server-Side Rendering | [tanstack.com/start/latest](https://tanstack.com/start/latest) |
| **React** | UI Library | [react.dev](https://react.dev) |
| **Shadcn UI** | Accessible component library | [ui.shadcn.com](https://ui.shadcn.com) |
| **Tailwind CSS** | Utility-first styling | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| **Radix UI** | Headless primitives (used by Shadcn) | [www.radix-ui.com](https://www.radix-ui.com) |

---

## Data & State

| Technology | Purpose | Documentation |
|------------|---------|---------------|
| **TanStack Query** | Async state management & caching | [tanstack.com/query/latest](https://tanstack.com/query/latest) |
| **TanStack DB** | Live queries & database collections | [tanstack.com/db/latest/docs](https://tanstack.com/db/latest/docs) |
| **Drizzle ORM** | Database interactions & schema definitions | [orm.drizzle.team/docs](https://orm.drizzle.team/docs) |
| **Zod** | Schema validation & type inference | [zod.dev](https://zod.dev) |
| **Electric SQL** | Local-first PostgreSQL sync | [electric-sql.com/docs/](https://electric-sql.com/docs/) |
| **Yjs** | CRDT documents for floor plans | [docs.yjs.dev](https://docs.yjs.dev) |
| **Durable Streams** | Document storage & real-time broadcast | [guides](https://electric-sql.com/guides/2025/12/09/announcing-durable-streams) • [Source](https://github.com/durable-streams/durable-streams) |

---

## Backend & Infrastructure

| Technology | Purpose | Documentation |
|------------|---------|---------------|
| **SST (Serverless Stack)** | AWS infrastructure deployment | [sst.dev/docs](https://sst.dev/docs) |
| **Better Auth** | Authentication (Email OTP + Google OAuth) | [www.better-auth.com](https://www.better-auth.com) |
| **TanStack AI** | AI orchestration (The Clerk) | [tanstack.com/ai/latest/docs](https://tanstack.com/ai/latest/docs) |
| **Nitro** | Serverless framework for AWS Lambda | [nitro.unjs.io](https://nitro.unjs.io) |

---

## Database

| Technology | Purpose | Documentation |
|------------|---------|---------------|
| **Neon (PostgreSQL)** | Primary database (serverless Postgres) | [neon.com/docs](https://neon.com/docs) |
| **Drizzle ORM** | Database interactions & schema definitions | [orm.drizzle.team/docs](https://orm.drizzle.team/docs) |

> **Note:** Neon is a serverless PostgreSQL provider. Drizzle ORM is used for database interactions.

---

## Development Tools

| Technology | Purpose | Documentation |
|------------|---------|---------------|
| **TypeScript** | Type system | [www.typescriptlang.org/docs](https://www.typescriptlang.org/docs) |
| **Vite** | Build tool & dev server | [vitejs.dev](https://vitejs.dev) |
| **pnpm** | Package manager | [pnpm.io](https://pnpm.io) |
| **Biome** | Linter & Formatter (replaces ESLint/Prettier) | [biomejs.dev](https://biomejs.dev) |
| **Vitest** | Unit testing framework | [vitest.dev](https://vitest.dev) |

---

## Reference Implementations

- `packages/app-example/` - Better Auth + Tailwind v3 reference
- `packages/marketing-site-example/` - Tailwind config patterns, grid system

---

## When in Doubt

1. Check existing reference implementations in `packages/app-example/`
2. Consult [../ARCHITECTURE.md](../ARCHITECTURE.md) for design decisions
3. Search this project's codebase for similar patterns

---

## Related Documentation

| Topic | Document |
|-------|----------|
| Architecture (how tech works together) | [../ARCHITECTURE.md](../ARCHITECTURE.md) |
| Development practices | [../development/](../development/) |
| Git & deployment workflows | [../workflow/](../workflow/) |
