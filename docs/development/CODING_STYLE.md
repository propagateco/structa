# Coding Style Guide

This document describes coding conventions and style guidelines for Structa monorepo.

## Contents

- [General](#general)
- [Naming Conventions](#naming-conventions)
- [Imports](#imports)
- [Style & Formatting](#style--formatting)
- [Related Documentation](#related-documentation)

---

## General

- **Strict TypeScript**: No `any`. Use explicit types.
- **ESM**: Use ES modules (`import`/`export`).
- **Pure Functions**: Keep functions small and side-effect-free where possible.

---

## Naming Conventions

- **Components**: `PascalCase` (e.g., `UserProfile`, `ButtonGroup`)
- **Functions/Variables**: `camelCase` (e.g., `getUserData`, `isValid`)
- **Types/Interfaces**: `PascalCase` (e.g., `UserData`, `ApiResponse`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`, `API_BASE_URL`)

---

## Imports

- Prefer absolute imports (configured via `tsconfig.json` paths):
  ```ts
  import { Button } from '@/components/ui/button'
  import { createUser } from '@structa/core/user'
  ```
- Group imports: third-party libraries first, then internal imports

---

## Style & Formatting

- **Indentation**: Tabs (enforced by Biome)
- **Quotes**: Double quotes (enforced by Biome)
- **Line Width**: 100 characters (configurable)
- **Import Organization**: Auto-organized by Biome (enabled by default)

---

## Related Documentation

| Topic | Document |
|-------|----------|
| Quality tools (Biome enforcement) | [QUALITY_TOOLS.md](./QUALITY_TOOLS.md) |
| Testing style guidelines | [TESTING.md](./TESTING.md) |
| Tech stack (TypeScript) | [../stack/TECH_STACK.md](../stack/TECH_STACK.md) |
