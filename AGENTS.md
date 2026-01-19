# Structa – AGENTS GUIDE

Welcome, agent 👋
This document provides guidance on how to work within the Structa monorepo.

Before you write _any_ code, understand the structure:
- **Main Web App**: `packages/web` – The primary application (TanStack Start, UI, Auth).
- **Core Logic**: `packages/core` – Business logic, DB schemas, and shared utilities.
- **API Layer**: `packages/backend` – Backend API services.
- **Infrastructure**: Root level `infra/` and `sst.config.ts` (SST).

---

## Reference Projects

The following directories contain example projects. **Use these as your primary source for UI components, design patterns, and coding style.**

- `packages/app-example/` (@structa/app)
- `packages/marketing-site-example/`

**Guidance:**
- **Study** these projects to understand how to build components and structure files.
- **Copy** patterns and components from here into `packages/web` as needed.
- **Do not modify** these example projects unless explicitly instructed to update the examples themselves.

---

## 1. Your Responsibilities

As an agent, your job is to:

1. **Implement incrementally**: Follow the user's plan step-by-step.
2. **Respect Architecture**: Keep business logic in Core, UI in Web, and API definitions in Backend.
3. **Use the Examples**: Don't invent new UI patterns if a suitable one exists in the example packages.

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
- **Testing**: Rigorous unit testing via Vitest.

### `packages/backend` (API Layer)
This package handles the server-side API.
- **Responsibility**: API Endpoints, external service integrations.
- **Auth**: Relies on the authentication context established by the Web app.

---

## 3. Preferred Libraries & Tooling

When building features, use these approved libraries:

### UI & Styling
- **Shadcn UI**: Use the components in `src/components/ui`.
- **Tailwind CSS**: Utility-first styling.

### Data & State
- **TanStack Query**: For async state management.
- **Drizzle ORM**: For all database interactions and schema definitions.
- **Zod**: For schema validation and type inference.

### Infrastructure
- **SST**: For deploying and managing infrastructure (defined in `sst.config.ts`).

---

## 4. Coding Style Guide (TypeScript)

- **Strict TypeScript**: No `any`. Use explicit types.
- **Functional Components**: Use React functional components with hooks.
- **Naming**: `PascalCase` for components, `camelCase` for functions/variables.
- **Imports**: Prefer absolute imports (configured aliases) over relative paths where possible.
- **Linting**: Respect the existing `eslint` and `prettier` configurations.

---

## 5. Testing Expectations

- **Unit Tests**: Use **Vitest** for logic in `packages/core` and utility functions in `packages/web`.
- **E2E/Integration**: Use **Playwright** (if configured) for critical user flows.
- **Run Tests**: `npm test` (or workspace specific `npm run test -w packages/core`).

---

## 6. Commit Message Style

- Keep commits focused and scoped to the requested task.
- Format:
  - Short imperative subject (max ~72 chars)
  - Optional body: one or two sentences describing why, not just what.
- Do not commit secrets (`infra/secret.ts` is a helper; never add real secrets or .env files).

---

## 7. Subdirectory Overrides

- If a subdirectory includes its own `AGENTS.md`, its instructions take precedence for files within that subtree.
- Example future overrides:
  - `packages/web/AGENTS.md` may add UI-specific style guidelines.

---

## 6. Deployment Guidelines

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

## 7. Log Visibility & Debugging

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

## 8. Commit Message Style

- Keep commits focused and scoped to the requested task.
- Format:
  - Short imperative subject (max ~72 chars)
  - Optional body: one or two sentences describing why, not just what.
- Do not commit secrets (`infra/secret.ts` is a helper; never add real secrets or .env files).

---

## 9. Subdirectory Overrides

- If a subdirectory includes its own `AGENTS.md`, its instructions take precedence for files within that subtree.
- Example future overrides:
  - `packages/web/AGENTS.md` may add UI-specific style guidelines.

---

## 10. Summary

- **Web** = UI + Auth + App wiring.
- **Core** = Logic + DB Schema.
- **Backend** = API.
- **Examples** = Source of Truth for patterns.
- **Deployment** = Only `npx sst deploy` to personal stage; never use `--stage dev` or `--stage production`.
- **Logs** = Can read deployment (`.sst/log/pulumi.log`) and orchestration (`.sst/log/sst.log`), but NOT runtime dev server logs.
