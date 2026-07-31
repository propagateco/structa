# Git Workflow & Quality Checks

This document describes Git workflow, PR process, and quality checks used in Structa monorepo.

## Contents

- [Pull Request Workflow](#pull-request-workflow)
- [Quality Checks](#quality-checks)
- [CI Checks](#ci-checks)
- [Code Review](#code-review)
- [Branch Protection](#branch-protection)
- [CI Configuration](#ci-configuration)
- [Troubleshooting CI](#troubleshooting-ci)
- [Commit Message Style](#commit-message-style)
- [Related Documentation](#related-documentation)

---

## Pull Request Workflow

This project uses a **trunk-based development** approach with PRs:

- **Feature branches** are created from `dev` (the active integration branch)
- **PRs** are opened against `dev` by default
- **CI checks** must pass before merge (typecheck, lint, tests)
- **`dev`**: PR required, no human approval (CI is the gate) — the fast loop
  for agents and day-to-day work
- **`production`**: PR required, 1 approval, stricter review — promotes
  `dev` (or a hotfix branch) to production
- **GitHub Actions** deploys the `dev` stage on merge (`deploy.yml`);
  production deploys from `production` branch only
- **Each PR also deploys a `pr-N` preview environment** — see
  [Worktrees & the No-Dev-Server Workflow](../development/WORKTREES.md) and
  [DEPLOYMENT.md](./DEPLOYMENT.md)

> **No local dev server:** for the agent workflow, do not run `npx sst dev`.
> Work in an isolated worktree, run local checks only, and test interactively
> against the `pr-N` preview via the bot login.

---

## Quality Checks

**Before committing**, run these commands to ensure code quality:

```bash
npm run typecheck    # Check types
npm run check:fix    # Run Biome (lint + format + auto-fix)
npm test             # Run all tests
```

---

## CI Checks

**Runs automatically when PR is opened/updated**:

- ✅ Full TypeScript type check
- ✅ Complete linting check (Biome)
- ✅ Full test suite
- ✅ Security audit (warning only)

**Performance:** ~1-3 minutes per PR update

**Cannot bypass:** Required by branch protection

---

## Code Review

**For production PRs, a human reviewer must:**
- ✅ Review code changes
- ✅ Verify CI passed
- ✅ Approve PR before merge

**For `dev` PRs** no approval is required — passing CI checks is the gate.

---

## Branch Protection

- 🔒 **Production branch:** Protected
  - Cannot push directly
  - Requires PR with 1 approval
  - Requires passing CI checks
  - Even admins cannot bypass

- 🔒 **Dev branch (optional):** Protected
  - Requires PR (no approval needed)
  - Requires passing CI checks

---

## CI Configuration

**Workflow files:**
- `.github/workflows/pr-checks.yml` - Quality checks on PRs

**What CI checks:**
```bash
npm run typecheck  # All packages
npm run check      # Biome lint (check only, no fixes)
npm test           # Full test suite
```

**CI optimizations:**
- Caches npm dependencies
- Skips draft PRs
- Cancels outdated runs
- Comments results on PR

---

## Troubleshooting CI

**CI fails but works locally:**
```bash
# Reproduce CI environment locally
npm ci  # Clean install
npm run typecheck
npm run check
npm test
```

**CI is slow:**
- Check Actions tab for bottlenecks
- Consider caching improvements
- Tests should be < 2 minutes total

**CI is stuck:**
- Check GitHub Actions status page
- May need to cancel and restart

---

## Commit Message Style

- Keep commits focused and scoped to the requested task.
- Format:
  - Short imperative subject (max ~72 chars)
  - Optional body: one or two sentences describing why, not just what.
- Do not commit secrets (`infra/secret.ts` is a helper; never add real secrets or .env files).

---

## Related Documentation

| Topic | Document |
|-------|----------|
| Development tools (checked by CI) | [../development/DEVELOPMENT_TOOLS.md](../development/DEVELOPMENT_TOOLS.md) |
| Worktrees & the no-dev-server workflow | [../development/WORKTREES.md](../development/WORKTREES.md) |
| Testing (run by CI) | [../development/TESTING.md](../development/TESTING.md) |
| Deployment (triggered by CI) | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| Coding style (checked by CI) | [../development/CODING_STYLE.md](../development/CODING_STYLE.md) |
