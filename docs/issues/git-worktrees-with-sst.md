# Agent Workflow: Isolated Worktrees + PR Preview Testing + Bot Auth

**See:** [GitHub Issue #61](https://github.com/propagateco/structa/issues/61)

## Summary

Reframe the dev workflow so that **agents never run a local dev server**. Instead:
1. Agents work in isolated git worktrees, make code changes, and run local quality checks (typecheck, lint, test).
2. Agents open PRs against `dev`. CI runs quality checks + deploys a `pr-N` preview environment.
3. Agents test interactively in the PR preview using `agent-browser`, authenticated as a bot user.
4. A lightweight bot-login endpoint (dev-only) lets agents authenticate without the OTP flow.

---

## Motivation

### What changed since this issue was filed

| Then | Now |
|---|---|
| SST v3 (`3.19.3`) | SST v4 (`4.17.1`) — migration complete |
| No PR preview environments | `pr-preview-deploy.yml` exists — full CI → deploy → comment flow |
| No Neon branching | `infra/database.ts` creates Neon branches per preview stage |
| No agent login tooling | `scripts/agent-login.sh` + `get-otp.ts` exist (local-dev only) |
| #58 (v3→v4 migration) pending | #58 closed, migration done |
| `.sst` path-substring bug was a future risk | Bug is still open upstream — guardrail still needed |

### The old model (what we're moving away from)

The original issue assumed agents would run `sst dev` inside worktrees, needing stage collision prevention, port hygiene, etc. That's complex, resource-heavy, and fragile.

### The new model

```
┌─────────────────────────────────────────────────────────────────────┐
│                     AGENT WORKFLOW (per iteration)                   │
│                                                                      │
│  1. git worktree add .worktrees/<branch> <branch>                    │
│     (scripts/worktree-setup.sh automates this)                       │
│                                                                      │
│  2. Make code changes in the worktree                                │
│     Run: npm run typecheck && npm run check:fix && npm test          │
│                                                                      │
│  3. Commit + push → Open PR targeting `dev`                          │
│     CI runs quality checks + deploys pr-N preview environment        │
│     (Neon branch is auto-created; bot user exists via copy-on-write) │
│                                                                      │
│  4. Visit PR preview URL with agent-browser                          │
│     Authenticate via bot-login endpoint (no OTP)                     │
│     Test the feature interactively                                   │
│                                                                      │
│  5. PR merged → preview destroyed (auto-cleanup)                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Technical Approach

### 1. Bot-Login API Endpoint (`POST /api/auth/bot-login`)

A single dev-only endpoint that shortcuts the OTP flow for the bot user.

**Guardrails:**
- Only registered in non-production stages (check `$app.stage` at auth-config time)
- Only works for the configured bot email (`agent@structa.dev`)
- Returns 404 in production — no security surface

**Agent usage:**
```bash
curl -X POST https://pr-61.xyz.structa.dev/api/auth/bot-login \
  -H "Content-Type: application/json" \
  -d '{"email":"agent@structa.dev"}' \
  -c /tmp/cookies.txt

agent-browser --profile ~/.structa-agent \
  open https://pr-61.xyz.structa.dev/app
```

### 2. Retool `scripts/worktree-setup.sh`

Rewrite the worktree helper to reflect the new no-dev-server workflow.

### 3. `docs/development/WORKTREES.md`

Document the full model — isolation, `.sst` bug, bot-login auth, PR preview cycle.

### 4. Update `docs/workflow/GIT_WORKFLOW.md`

Reflect that feature branches target `dev`, and document the PR → preview → test → merge cycle.

### 5. Update `AGENTS.md`

Codify the no-dev-server, worktree-based, PR-preview-tested workflow.

### 6. Update `scripts/agent-login.sh`

Add a `--bot` mode that calls the bot-login endpoint instead of OTP flow.

---

## Tasks

- [ ] **Backend: Bot-login endpoint** — Add `POST /api/auth/bot-login` in `packages/backend`, gated by stage check
- [ ] **Worktree setup script** — Rewrite `scripts/worktree-setup.sh` with no-dev-server workflow
- [ ] **Worktree docs** — Write `docs/development/WORKTREES.md`
- [ ] **Git workflow docs** — Update `docs/workflow/GIT_WORKFLOW.md` (target `dev`, PR preview cycle)
- [ ] **Agent instructions** — Update `AGENTS.md` to codify the workflow
- [ ] **Dev tools cross-ref** — Add one-line pointer in `docs/development/DEVELOPMENT_TOOLS.md`
- [ ] **Agent-login update** — Update `scripts/agent-login.sh` with `--bot` mode for preview environments
- [ ] **Smoke test** — Open a test PR, verify the full cycle: worktree → push → preview deploy → bot-login → agent-browser test → merge → cleanup

## Acceptance Criteria

- [ ] `POST /api/auth/bot-login` returns a valid session cookie for `agent@structa.dev` in dev/preview stages and 404 in production
- [ ] `scripts/worktree-setup.sh <branch>` creates `.worktrees/<branch>`, installs deps, prints the workflow (no `sst dev` command)
- [ ] The script refuses paths containing `.sst` and explains why
- [ ] `scripts/agent-login.sh --bot <preview-url>` authenticates without OTP and exits on `/app`
- [ ] `docs/development/WORKTREES.md` documents the isolation model, `.sst` bug, bot-login auth, and PR preview cycle
- [ ] Full end-to-end test: agent creates a worktree → makes a visible change → opens PR → CI deploys → agent visits preview URL → bot-login → verifies change in browser

## Non-Goals

- Running `sst dev` in worktrees
- Multi-developer stage collision handling (irrelevant without local dev server)
- Changing the production deployment pipeline
- Adding real user auth methods (bot-login is dev-only)
- Changing branch protection rules
