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

For detailed architecture, see [docs/core/architecture/overview.md](docs/core/architecture/overview.md)

## Progressive Documentation

| Topic | Location |
|-------|----------|
| Development tools (Biome, Vitest, TypeScript, SST Dev) | [docs/core/development/development_tools.md](docs/core/development/development_tools.md) |
| Git worktrees & the no-dev-server workflow | [docs/core/development/worktrees.md](docs/core/development/worktrees.md) |
| Testing philosophy & TDD workflow | [docs/core/development/testing.md](docs/core/development/testing.md) |
| Coding conventions & style | [docs/core/development/coding_style.md](docs/core/development/coding_style.md) |
| Debugging & log locations | [docs/core/development/debugging.md](docs/core/development/debugging.md) |
| UI components (shadcn) & best practices | [docs/core/design/ui.md](docs/core/design/ui.md) |
| Tech stack with documentation links | [docs/core/architecture/tech_stack.md](docs/core/architecture/tech_stack.md) |
| Git workflow & PR process | [docs/core/workflow/git_workflow.md](docs/core/workflow/git_workflow.md) |
| Deployment rules | [docs/core/workflow/deployment.md](docs/core/workflow/deployment.md) |

## Important Rules

- When the user asks to commit, NEVER reset or discard unrelated changes. Only stage the specific files we touched for the requested task. If the repo has additional changes, call them out and ask whether to include them.

- Write tests before implementing (TDD project) → [docs/core/development/testing.md](docs/core/development/testing.md)
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

Details & rationale: [docs/core/development/worktrees.md](docs/core/development/worktrees.md)

## Local Development

- Run `sst dev` manually in your terminal before asking agents to diagnose issues:
  ```bash
  npx sst dev --mode=mono
  ```
- **Important**: Agents assume `sst dev` is already running - they only read and analyze logs
- Use `--mode=mono` to see all logs (Functions, Tasks, Frontends, Services) in one terminal
- Agents search logs for errors, warnings, and diagnostic information
- For more SST dev mode options, see [docs/core/development/development_tools.md](docs/core/development/development_tools.md#sst-dev-mode)

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

Details: [docs/core/development/testing.md#agent-browser-workflow-dev-browser-agent](docs/core/development/testing.md#agent-browser-workflow-dev-browser-agent)
and [docs/core/development/worktrees.md](docs/core/development/worktrees.md#bot-authentication)

**After UI checks, post a validation comment on the PR** — evidence
(screenshots, console logs, network logs) against the acceptance criteria,
flagging anything that's wrong for another developer to pick up:
[docs/core/development/testing.md#3-report-findings-as-a-pr-comment](docs/core/development/testing.md#3-report-findings-as-a-pr-comment)

## Project Context

- **Vision**: [docs/core/overview.md](docs/core/overview.md)
- **Architecture**: [docs/core/architecture/overview.md](docs/core/architecture/overview.md)
- **Strategy**: [docs/strategy/memo.md](docs/strategy/memo.md)
- **Research**: [docs/research/maths/](docs/research/maths/)
- **Plan**: See `.plan/` directory

## Navigating Docs with kdb

This project uses [kdb](https://kdb.digimata.dev) as a knowledge graph for documentation. Use it to find broken links, trace references, and navigate the doc structure.

```bash
kdb check docs/           # Find broken links across all docs
kdb refs <file>           # Find every doc that links to a target
kdb deps <file>           # Show outbound dependencies
kdb tree docs/            # Visualize doc structure
```

**Doc layout:**
- `docs/core/` — Architecture, dev practices, workflows
- `docs/tools/` — Feature ideas and specs
- `docs/strategy/` — Product vision, GTM
- `docs/research/` — Maths, physics, domain knowledge
- `docs/landing/` — Marketing (empty)
- `.issues/` — Draft feature proposals (push to GH when ready)
- `.plan/` — Deep-dive planning specs

## Subdirectory Overrides

If a subdirectory includes its own `AGENTS.md`, its instructions take precedence
for files within that subtree.

## Agent skills

### Issue tracker

Issues are drafted and tracked as local markdown files under `.issues/` (`iss-NNN-slug.md`),
pushed to GitHub when ready. Open GitHub issues can be imported with
`npm run issues:sync -w @structa/scripts`. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical triage roles, recorded as a `Status:` line in each `.issues/` file:
`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.
See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
