# Git Worktrees & the No-Dev-Server Agent Workflow

This document describes how to develop in isolated git worktrees **without
running a local dev server** (`npx sst dev`), and how interactive testing
happens against PR preview environments.

## Contents

- [The Model](#the-model)
- [Setup: One Command](#setup-one-command)
- [The Workflow](#the-workflow)
- [Path Safety: The `.sst` Substring Bug](#path-safety-the-sst-substring-bug)
- [PR Preview Environments & Neon Branching](#pr-preview-environments--neon-branching)
- [Bot Authentication](#bot-authentication)
- [Teardown](#teardown)
- [Related Documentation](#related-documentation)

---

## The Model

This repo's dev loop deliberately avoids local infrastructure:

1. **Work in an isolated worktree** — a separate directory for your branch.
   No stashing, no context-switching, no state collisions between branches.
2. **Never run `sst dev`** — agents and contributors make code changes and
   run **local, offline checks** only:
   ```bash
   npm run typecheck && npm run check:fix && npm test
   ```
3. **Open a PR against `dev`** — CI runs the same quality checks and deploys
   a `pr-N` preview environment with its own Neon database branch.
4. **Test interactively in the preview** — with `agent-browser`, logged in
   as the bot user (`agent@structa.dev`) via the bot-login endpoint.

SST state lives in S3 keyed by `app + stage`, and the local `.sst/` directory
is throwaway — so there is nothing to collide between worktrees.

---

## Setup: One Command

```bash
# From the main checkout:
./scripts/worktree-setup.sh -c my-feature      # create branch + worktree
./scripts/worktree-setup.sh existing-branch     # use an existing branch
```

The script:

1. Validates the resolved path does not contain `.sst` (see below).
2. Refuses to clobber an existing worktree.
3. Creates `git worktree add .worktrees/<branch> <branch>`.
4. Runs `npm install` in the fresh worktree.
5. Prints the workflow below.

Branch names are sanitized into path segments: `origin/feat/x` →
`.worktrees/feat-x`.

---

## The Workflow

```bash
# 1. Make your changes in the worktree
cd .worktrees/my-feature
# ... edit files ...

# 2. Run local checks (no AWS, no dev server)
npm run typecheck && npm run check:fix && npm test

# 3. Commit and push
git add -A
git commit -m "feat: ..."
git push -u origin HEAD:my-feature

# 4. Open a PR against dev — CI will deploy a pr-N preview environment
gh pr create --base dev --head my-feature --fill

# 5. Wait for the preview URL comment on the PR, then test interactively
./scripts/agent-login.sh --bot https://pr-123.dev.structa.so
agent-browser --profile ~/.structa-agent open https://pr-123.dev.structa.so/app

# 6. After browser testing, post a validation comment on the PR (evidence:
#    screenshots, console logs, network logs) to close acceptance criteria
#    or flag issues for another developer — see TESTING.md
gh pr comment 123 --body-file /tmp/validation.md
```

> **Why `dev`?** Branch protection on `dev` requires passing CI checks but
> no human approval, so the loop is fast. `production` requires review.

---

## Path Safety: The `.sst` Substring Bug

SST v4's esbuild `InjectGlobals` plugin uses a naive
`strings.Contains(args.Path, ".sst")` check: if a project directory's
**absolute path contains `.sst` anywhere**, global injection into
`sst.config.ts` is silently skipped and `sst dev`/`deploy`/`diff` fail with:

```
ReferenceError: sst is not defined
```

This is still **open upstream** (anomalyco/sst#6937) as of SST 4.17. The
classic trigger is a worktree tool that names directories `<repo>.<branch>`
(e.g. `structa.sst-v4-upgrade` → `.sst` appears in the path).

This repo's convention — `.worktrees/<branch>` — avoids the bug by
construction, and `scripts/worktree-setup.sh` refuses any path containing
`.sst` (e.g. a branch like `feat.sst-x`) with an explanatory error.

---

## PR Preview Environments & Neon Branching

Every PR against `dev`/`production` triggers
`.github/workflows/pr-preview-deploy.yml`, which:

1. Runs quality checks (typecheck, lint, tests).
2. Deploys `npx sst deploy --stage pr-<N>` to the dev AWS account.
3. Runs DB migrations on a fresh **Neon branch** created for that stage
   (`infra/database.ts` — a copy-on-write branch of the dev project's
   default branch).
4. Comments the preview Web/API URLs on the PR.

Because Neon branches are **copy-on-write from the dev database**, anything
seeded in the dev database — including the bot user — is present in every
preview environment automatically.

Preview environments are destroyed on PR close/merge
(`.github/workflows/pr-preview-cleanup.yml`).

---

## Bot Authentication

Auth-gated routes (anything under `/app`) require a logged-in user with a
non-waitlist plan. Agents use a dedicated bot user:

| Property | Value |
|----------|-------|
| Email | `agent@structa.dev` |
| Plan | `pro` (skips onboarding) |
| Login | `POST /api/auth/bot-login` (no OTP) |
| Created | Manually in the dev database (copied into every Neon branch) |

The bot-login endpoint (`packages/web/src/lib/bot-login.ts`) is a
better-auth plugin registered **only on non-production stages**, so it
returns 404 in production. It only accepts the configured bot email and
creates a normal session cookie — the same one the email-OTP flow creates.

### Local dev / manual login (OTP flow)

If you need the normal email-OTP flow (e.g. `sst dev` running locally):

```bash
./scripts/agent-login.sh                       # localhost, OTP via DB lookup
```

### Preview environments (bot-login flow)

```bash
# One command — authenticates the persistent agent-browser profile against
# a PR preview URL without any OTP or DB access:
./scripts/agent-login.sh --bot <preview-url>

# Subsequent agent-browser work reuses the same profile:
agent-browser --profile ~/.structa-agent open <preview-url>/app
```

---

## Teardown

```bash
git worktree remove .worktrees/my-feature
```

(Use `--force` if it contains uncommitted changes.) The local worktree is
throwaway — the branch lives on the remote, and preview environments are
cleaned up automatically by CI when the PR closes.

---

## Related Documentation

| Topic | Document |
|-------|----------|
| Dev tools (typecheck, lint, tests) | [DEVELOPMENT_TOOLS.md](./DEVELOPMENT_TOOLS.md) |
| Testing & agent-browser workflow | [TESTING.md](./TESTING.md) |
| Git workflow & PR process | [../workflow/GIT_WORKFLOW.md](../workflow/GIT_WORKFLOW.md) |
| Deployment & preview environments | [../workflow/DEPLOYMENT.md](../workflow/DEPLOYMENT.md) |
| Upstream `.sst` path bug | [anomalyco/sst#6937](https://github.com/anomalyco/sst/issues/6937) |
