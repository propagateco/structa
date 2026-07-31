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
| Git worktrees & the no-dev-server workflow | [docs/development/WORKTREES.md](docs/development/WORKTREES.md) |
| Testing philosophy & TDD workflow | [docs/development/TESTING.md](docs/development/TESTING.md) |
| Coding conventions & style | [docs/development/CODING_STYLE.md](docs/development/CODING_STYLE.md) |
| Debugging & log locations | [docs/development/DEBUGGING.md](docs/development/DEBUGGING.md) |
| UI components (shadcn) & best practices | [docs/design/UI.md](docs/design/UI.md) |
| Tech stack with documentation links | [docs/architecture/TECH_STACK.md](docs/architecture/TECH_STACK.md) |
| Git workflow & PR process | [docs/workflow/GIT_WORKFLOW.md](docs/workflow/GIT_WORKFLOW.md) |
| Deployment rules | [docs/workflow/DEPLOYMENT.md](docs/workflow/DEPLOYMENT.md) |

## Important Rules

- When the user asks to commit, NEVER reset or discard unrelated changes. Only stage the specific files we touched for the requested task. If the repo has additional changes, call them out and ask whether to include them.

- Write tests before implementing (TDD project) → [docs/development/TESTING.md](docs/development/TESTING.md)
- Study patterns from `packages/app-example/` before coding
- Only deploy to personal stage: `npx sst deploy`
- Never run `npx sst deploy --stage dev` or `--stage production` (CI only)

## Agent Development Workflow (No Local Dev Server)

Agents do **not** run `npx sst dev`. Instead:

1. Work in an isolated worktree: `./scripts/worktree-setup.sh -c <branch>`
   (or `-c` omitted for an existing branch). Never work directly in a shared
   checkout if a worktree exists for the branch.
2. Run only local, offline checks before committing:
   ```bash
   npm run typecheck && npm run check:fix && npm test
   ```
3. Push and open a PR against **`dev`** (not `production`):
   ```bash
   git push -u origin HEAD:<branch>
   gh pr create --base dev --head <branch> --fill
   ```
4. CI deploys a `pr-N` preview environment (own Neon branch, seeded from the
   dev database — includes the bot user). Wait for the preview URL comment,
   then test interactively with agent-browser, authenticated via the bot
   login (no OTP):
   ```bash
   ./scripts/agent-login.sh --bot <preview-url>
   agent-browser --profile ~/.structa-agent open <preview-url>/app
   ```
5. Clean up after merge: `git worktree remove .worktrees/<branch>`.

Details & rationale: [docs/development/WORKTREES.md](docs/development/WORKTREES.md)

## Local Development

- Run `sst dev` manually in your terminal before asking agents to diagnose issues:
  ```bash
  npx sst dev --mode=mono
  ```
- **Important**: Agents assume `sst dev` is already running - they only read and analyze logs
- Use `--mode=mono` to see all logs (Functions, Tasks, Frontends, Services) in one terminal
- Agents search logs for errors, warnings, and diagnostic information
- For more SST dev mode options, see [docs/development/DEVELOPMENT_TOOLS.md](docs/development/DEVELOPMENT_TOOLS.md#sst-dev-mode)

## Browser Verification (authed routes)

For UI checks of the auth-gated `/app` route with `@dev-browser` / agent-browser,
authenticate the persistent profile first — **one command, idempotent**:

```bash
./scripts/agent-login.sh
```

It opens `/app` with a persistent Chrome profile (`~/.structa-agent`); if the
session is valid it exits immediately, otherwise it walks the email-OTP login
(reading the OTP from the DB via `scripts/get-otp.ts`) and applies
`scripts/bypass-onboarding.ts` if the test user lacks a `plan`. After it
succeeds, all subsequent `agent-browser --profile ~/.structa-agent …` calls
are already authenticated — repeat only on session expiry (~7d) for OTP mode.
Bot-mode cookies (CDP-set, for PR previews) do not persist to disk — re-login
after each `agent-browser close`.

**Against a PR preview** (no local DB, no OTP) use the bot login instead:

```bash
./scripts/agent-login.sh --bot <preview-url>
```

Details: [docs/development/TESTING.md#agent-browser-workflow-dev-browser-agent](docs/development/TESTING.md#agent-browser-workflow-dev-browser-agent)
and [docs/development/WORKTREES.md](docs/development/WORKTREES.md#bot-authentication)

**After UI checks, post a validation comment on the PR** — evidence
(screenshots, console logs, network logs) against the acceptance criteria,
flagging anything that's wrong for another developer to pick up:
[docs/development/TESTING.md#reporting-validation-findings-on-the-pr](docs/development/TESTING.md#reporting-validation-findings-on-the-pr)

## Project Context

- **Vision**: [docs/OVERVIEW.md](docs/OVERVIEW.md)
- **Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Maths & Physics Rules**: [docs/maths/]
- **Current Status**: [docs/STATUS.md](docs/STATUS.md)
- **Development Plan**: [specs/plan/00-overview.md](specs/plan/00-overview.md)

## Subdirectory Overrides

If a subdirectory includes its own `AGENTS.md`, its instructions take precedence
for files within that subtree.
