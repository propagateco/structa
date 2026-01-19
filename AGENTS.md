# Structa – AGENTS GUIDE

Welcome, agent 👋
This document provides guidance on how to work within the Structa monorepo.

Before you write _any_ code, understand the structure:
- **Main Web App**: `packages/web` – The primary application (TanStack Start, UI, Auth).
- **Core Logic**: `packages/core` – Business logic, DB schemas, and shared utilities.
- **API Layer**: `packages/backend` – Backend API services.
- **Infrastructure**: Root level `infra/` and `sst.config.ts` (SST).
- **Reference Projects**: `packages/app-example/` and `packages/marketing-site-example/` – Use these as your primary source for UI components, design patterns, and coding style.

---

## 1. Your Responsibilities

As an agent, your job is to:

1. **Implement incrementally**: Follow the user's plan step-by-step.
2. **Respect Architecture**: Keep business logic in Core, UI in Web, and API definitions in Backend.
3. **Use the Examples**: Study and copy patterns from `packages/app-example/` and `packages/marketing-site-example/`. Do not modify these example projects unless explicitly instructed to update the examples themselves.
4. **Write Tests First**: This is a TDD project. Write tests before implementing features (see Section 5).
5. **Run Quality Checks**: Ensure all code passes typecheck, linting, and formatting before committing.

---

## 2. Package & Layer Rules

### `packages/web` (The Main App)
This is the consumer-facing application.
- **Framework**: TanStack Start (Router + Server-side).
- **Auth**: Better Auth. **Note**: Auth configuration lives here, NOT in the backend.
- **UI**: Shadcn UI + Tailwind CSS.
- **Data**: TanStack Query for client-side caching.
- **Database Access**: Direct DB access via Drizzle (server functions) or API calls to Backend.

### `packages/core` (Business Logic)
This package contains the domain logic and shared definitions.
- **Responsibility**: Pure business logic, Data transformations, Drizzle Schema definitions.
- **Constraints**: Keep this environment-agnostic where possible. Avoid heavy UI dependencies.
- **Testing**: Rigorous unit testing via Vitest with `sst shell` for environment context.

### `packages/backend` (API Layer)
This package handles the server-side API.
- **Responsibility**: API Endpoints, external service integrations.
- **Auth**: Relies on the authentication context established by the Web app.

---

## 3. Quality Assurance Tools

This project uses a comprehensive tooling stack for quality assurance:

### 3.1 TypeScript Type Checking

TypeScript is used with strict mode for type safety.

#### Running Type Checks

```bash
# Typecheck all packages
npm run typecheck

# Typecheck specific packages
npm run typecheck:core    # packages/core
npm run typecheck:backend # packages/backend
npm run typecheck:app     # packages/app-example
npm run typecheck:web     # packages/web

# Typecheck individual package directly
cd packages/web && npm run typecheck
```

**Note**: Packages `core` and `backend` use SST shell for environment variables during typechecking.

---

### 3.2 Biome (Linter & Formatter)

Biome is used for linting, formatting, and import organization. It's a fast, modern alternative to ESLint + Prettier.

#### Configuration

Each package has its own `biome.json` configuration:
- `packages/web/biome.json`
- `packages/core/biome.json`
- `packages/backend/biome.json`

#### Running Linting

```bash
# Lint all packages (check only, no changes)
npm run lint

# Lint and auto-fix issues across all packages
npm run lint:fix

# Lint specific packages
cd packages/web && npm run lint
cd packages/core && npm run lint
cd packages/backend && npm run lint
```

#### Running Formatting

```bash
# Format all packages
npm run format

# Format specific packages
cd packages/web && npm run format
cd packages/core && npm run format

# Format single file (from package directory)
cd packages/web && npx biome format --write src/components/Button.tsx
```

#### Running Checks (Lint + Format)

```bash
# Check all packages (lint + format check)
npm run check

# Check and auto-fix all packages
npm run check:fix

# Check single file
cd packages/web && npx biome check src/components/Button.tsx
```

#### Individual File Operations

```bash
# Check a single file
cd packages/web && npx biome check src/components/Button.tsx

# Format a single file
cd packages/web && npx biome format --write src/components/Button.tsx

# Check with specific diagnostic level
npx biome check --diagnostic-level=error src/components/Header.tsx
```

---

### 3.3 Vitest (Unit Testing)

Vitest is used for unit testing. It's fast and integrated with the project's TypeScript setup.

#### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests for specific package
npm run test:core
npm run test:app
npm run test:web

# Run tests with coverage
npm run test:coverage
```

**Note**: `packages/core` uses `sst shell vitest` to provide SST environment variables during test runs.

---

## 4. Testing Philosophy (TDD)

This project follows **Test-Driven Development (TDD)** principles.

### 4.1 TDD Workflow

When implementing new features or fixing bugs:

1. **Write the test first** – Before writing any implementation code, write a failing test that describes the expected behavior.
2. **Run the test** – Verify that it fails (red).
3. **Write minimal implementation** – Write just enough code to make the test pass.
4. **Run the test again** – Verify that it now passes (green).
5. **Refactor** – Clean up the code while keeping tests green.
6. **Repeat** – Add more tests as needed to cover edge cases and requirements.

### 4.2 Test Organization

Tests are organized alongside source code:

```
packages/
├── core/
│   ├── src/
│   │   ├── image/
│   │   │   └── image.service.ts
│   │   └── test-setup.ts        # Global test setup
│   └── vitest.config.ts        # Vitest configuration
└── web/
    └── src/
        └── components/
            └── __tests__/       # Component tests
                └── Button.test.tsx
```

### 4.3 Test Guidelines

- **Unit Tests**: Test pure functions, business logic, and data transformations (especially in `packages/core`).
- **Integration Tests**: Test interactions between components and modules.
- **Component Tests**: Test React components for UI behavior and user interactions.
- **Coverage**: Aim for high coverage on critical business logic and utility functions.
- **Test Isolation**: Each test should be independent and not rely on other tests.

---

## 5. Preferred Libraries & Tooling

When building features, use these approved libraries:

### UI & Styling
- **Shadcn UI**: Use the components in `src/components/ui`.
- **Tailwind CSS**: Utility-first styling.
- **Radix UI**: Headless primitives (used by Shadcn).

### Data & State
- **TanStack Query**: For async state management.
- **Drizzle ORM**: For all database interactions and schema definitions.
- **Zod**: For schema validation and type inference.

### Infrastructure
- **SST**: For deploying and managing infrastructure (defined in `sst.config.ts`).

---

## 6. Coding Style Guide (TypeScript)

### 6.1 General

- **Strict TypeScript**: No `any`. Use explicit types.
- **ESM**: Use ES modules (`import`/`export`).
- **Pure Functions**: Keep functions small and side-effect-free where possible.

### 6.2 Naming Conventions

- **Components**: `PascalCase` (e.g., `UserProfile`, `ButtonGroup`)
- **Functions/Variables**: `camelCase` (e.g., `getUserData`, `isValid`)
- **Types/Interfaces**: `PascalCase` (e.g., `UserData`, `ApiResponse`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`, `API_BASE_URL`)

### 6.3 Imports

- Prefer absolute imports (configured via `tsconfig.json` paths):
  ```ts
  import { Button } from '@/components/ui/button'
  import { createUser } from '@structa/core/user'
  ```
- Group imports: third-party libraries first, then internal imports

### 6.4 Style & Formatting

- **Indentation**: Tabs (enforced by Biome)
- **Quotes**: Double quotes (enforced by Biome)
- **Line Width**: 100 characters (configurable)
- **Import Organization**: Auto-organized by Biome (enabled by default)

---

## 7. Deployment Guidelines

**CRITICAL**: Deployment commands must follow these strict rules.

### Allowed Command
- ✅ `npx sst deploy` – Deploys to your **personal stage** for testing
  - **If this fails**, note the failure clearly for investigation (service name, error details, what was changed)

### FORBIDDEN COMMANDS (NEVER RUN THESE)
- ❌ `npx sst deploy --stage dev` – Deployed by CI only
- ❌ `npx sst deploy --stage production` – Deployed by CI only

**Why?** Deployments to `dev` and `production` are triggered by **CI pipelines** after:
- All tests pass
- Pre-commit hooks pass
- Linting and type checking passes

**Never manually deploy to these stages** – it bypasses the automated safety checks.

---

## 8. Log Visibility & Debugging

### SST Logs Available to Agents

| Log Type | Location | Can I Read? | Shows |
|-----------|-----------|--------------|-------|
| **Deployment logs** | `.sst/log/pulumi.log` | ✅ Yes | Resources created/updated, deployment errors, stack outputs, duration |
| **Orchestration logs** | `.sst/log/sst.log` | ✅ Yes | File watcher events, service starts, infrastructure changes |
| **Runtime logs (dev)** | Terminal only | ❌ No | Vite/TanStack Start logs, server-side `console.log()`, HMR events |

### Reading Logs

To check deployment logs:
```bash
cat .sst/log/pulumi.log | tail -50
```

To check SST orchestration logs:
```bash
cat .sst/log/sst.log | tail -100
```

### Important: SST Dev Server

- **Do NOT run** `npx sst dev` yourself – it will **always** be running when you work on this project
- The dev server logs (Vite, HMR, runtime console output) are **not captured** in log files
- For runtime debugging issues, ask the user to paste terminal output or set up log redirection

---

## 9. Commit Message Style

- Keep commits focused and scoped to the requested task.
- Format:
  - Short imperative subject (max ~72 chars)
  - Optional body: one or two sentences describing why, not just what.
- Do not commit secrets (`infra/secret.ts` is a helper; never add real secrets or .env files).

---

## 10. Subdirectory Overrides

- If a subdirectory includes its own `AGENTS.md`, its instructions take precedence for files within that subtree.
- Example future overrides:
  - `packages/web/AGENTS.md` may add UI-specific style guidelines.

---

## 11. Summary

- **Web** = UI + Auth + App wiring.
- **Core** = Logic + DB Schema.
- **Backend** = API.
- **Examples** = Source of Truth for patterns.
- **TDD** = Write tests first, then implement.
- **Tools** = TypeScript (typecheck), Biome (lint/format), Vitest (tests).
- **Deployment** = Only `npx sst deploy` to personal stage; never use `--stage dev` or `--stage production`.
- **Logs** = Can read deployment (`.sst/log/pulumi.log`) and orchestration (`.sst/log/sst.log`), but NOT runtime dev server logs.

---

## 12. Quick Reference

### Common Quality Commands

```bash
# Before committing, run these to ensure code quality:
npm run typecheck    # Check types
npm run check:fix    # Run Biome (lint + format + auto-fix)
npm test             # Run all tests
```

### Individual Package Workflow

```bash
# For packages/web
cd packages/web
npm run typecheck    # Type check
npm run check:fix    # Biome check and fix
npm run test         # Run tests

# For packages/core
cd packages/core
npm run typecheck    # Type check with SST context
npm run check:fix    # Biome check and fix
npm run test         # Run tests with SST context
```

### Working with Individual Files

```bash
# Typecheck a single file
cd packages/web && npx tsc --noEmit src/components/Button.tsx

# Check a single file with Biome
cd packages/web && npx biome check src/components/Button.tsx

# Format a single file
cd packages/web && npx biome format --write src/components/Button.tsx

# Run tests for a single file
cd packages/web && npx vitest run src/components/Button.test.tsx
```
