# AGENTS.md

This file gives opencode agents repo-specific guidance. Scope: this root file applies to the entire repo. Subdirectories may include their own AGENTS.md to override or extend these rules.

## Repo Overview
- Monorepo managed via npm workspaces: see `package.json` workspaces.
- Main web app: TanStack Start (router + server-side).
- Data sync: ElectricSQL with TanStack DB; client cache via TanStack Query.
- UI: shadcn/ui components with Tailwind.
- ORM/DB: Drizzle for schema and migrations.
- Auth: Better Auth setup consistent with `../propagate/packages/app`.
- Packages:
  - `packages/template`: Vite + React + Tailwind UI template (may transition to TanStack Start).
  - `packages/core`: Shared core utilities; mirror structure from `../propagate/packages/core`.
  - `packages/scripts`: Small TS scripts.
- Infra with SST: `sst.config.ts` and `infra/*.ts` define stacks (API, DB, storage, email, DNS, secrets). Cross-project: see `../propagate` for similar SST patterns.

## Coding Conventions
- TypeScript preferred. Enable strict options consistent with existing `tsconfig.json`.
- TanStack Start + Router:
  - Use file-based routes and Start server handlers where applicable.
  - Keep loaders/actions typed; prefer `zod` or TS types for inputs.
- Data: ElectricSQL + TanStack DB + Query:
  - Define sync models in Drizzle; map to Electric schemas.
  - Use Query for client caching; invalidate keys consistently.
- React components:
  - Functional components and hooks.
  - File naming: `PascalCase.tsx` for components.
  - Props typed explicitly; avoid `any`.
- Styling:
  - Tailwind + shadcn/ui; reuse existing primitives.
- Auth:
  - Better Auth patterns consistent with `../propagate/packages/app`.
- Imports:
  - Prefer configured aliases; otherwise use relative paths.
- Linting/formatting:
  - Respect `eslint.config.js` in `packages/template`.
  - Keep changes minimal and aligned with existing style.

## Directory Layout
- Root
  - `infra/*.ts`: SST constructs and infrastructure helpers
  - `sst.config.ts`: SST app configuration
  - `README.md`: high-level docs
- `packages/template`
  - `src/components/ui/*`: shared UI primitives
  - `src/components/layout/*`: layout components
  - `src/pages/*`: page-level components
  - `vite.config.ts`, `tailwind.config.ts`: build and styling configs
- `packages/core` and `packages/scripts`: shared libraries and scripts

## Run & Test Commands
- Install dependencies (root + workspaces):
  - `npm install`
- Development (template app):
  - Check if dev server is already running before starting: `lsof -i :5173` (or whichever port)
  - Only start if not already running: `npm run -w packages/template dev`
- Build (template app):
  - `npm run -w packages/template build`
- Lint (template app):
  - `npm run -w packages/template lint` (if configured)
- Playwright tests (if present):
  - Configure via `playwright.config.ts` (tests may be added later). Use workspace-specific scripts.
- SST (infrastructure):
  - Deploy/Dev: use SST CLI scripts as defined in `package.json` when available. Avoid creating new infra without explicit user request.

## Commit Message Style
- Keep commits focused and scoped to the requested task.
- Format:
  - Short imperative subject (max ~72 chars)
  - Optional body: one or two sentences describing why, not just what.
- Do not commit secrets (`infra/secret.ts` is a helper; never add real secrets or .env files).

## Agent Rules
- Follow these conventions for any file you touch.
- Prefer root-cause fixes; avoid unrelated changes.
- Never add licenses or headers unless asked.
- Minimal edits; match existing patterns and naming.
- Validate with existing build/test scripts where applicable.

## Subdirectory Overrides
- If a subdirectory includes its own `AGENTS.md`, its instructions take precedence for files within that subtree.
- Example future overrides:
  - `packages/template/AGENTS.md` may add UI-specific style guidelines.

## Notes & Placeholders (to be refined)
- `packages/core`: document actual modules and usage once populated.
- SST commands: add exact scripts when they exist in `package.json`.
- Playwright: add test run commands when tests are added.

## Ways of Working
- Issue-first workflow via slash commands:
  - `create-issue`: generates a PRD-style issue with sections (Context, Problem, Goals/Non-Goals, Requirements, Acceptance Criteria, Risks, Rollback Plan). Automatically creates a git worktree and branch for implementation, and opens a draft PR.
  - `complete-issue`: validates acceptance criteria, ensures linked PR is merged and deployment verified, then cleans up the worktree and deletes the local branch.
- Git worktrees
  - Use dedicated worktrees under `worktrees/issue-<id>-<slug>`; branch name `issue/<id>-<slug>` based off `main` (configurable).
  - One worktree per issue; delete after merge. Avoid mixing scopes.
- PR practices
  - Open a draft PR early; link to the issue. Keep granular commits.
  - Use checklists in the issue; update as you progress.
- Code hygiene
  - Scope changes tightly; avoid drive-by fixes.
  - Add or adjust tests near changes; use Playwright for UI flows when applicable.

## How to Use
- Agents: read this file before editing.
- Humans: update this file when conventions change; add `AGENTS.md` to subdirs for specialized rules.

