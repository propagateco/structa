# Git Worktrees with SST: Setup & Guardrails

## Summary

Document and lightly tool the workflow for using git worktrees with this SST
repo so multiple branches can be developed in parallel without state
collisions, port clashes, or tripping the known SST v4 `.sst` path-substring
bug.

---

## Motivation

Git worktrees let you check out several branches of the same repo into
separate directories simultaneously — ideal for context-switching between
features without stashing, or for running parallel agent sessions on
isolated branches. For this repo there are two real obstacles worth
engineering around:

1. **Stage collisions.** `sst.config.ts` uses `home: "aws"`, so Pulumi
   state lives in S3 keyed by `app + stage`, not by directory. SST's own
   docs state that two `sst dev` sessions against the same stage will
   disconnect each other ("the person that connected first will get
   disconnected"). Our `.sst/stage` caches the default `hking`, so a naive
   `sst dev` in a new worktree would silently target the same stack as the
   main checkout.

2. **SST v4 `.sst` path-substring bug** (upstream, open). SST v4's esbuild
   `InjectGlobals` plugin uses a naive `strings.Contains(args.Path, ".sst")`
   check, so any project directory whose absolute path contains `.sst`
   anywhere — e.g. `git worktree add ../structa.sst-v4-upgrade`, a default
   of some worktree tools — silently skips global injection into
   `sst.config.ts` and throws `ReferenceError: sst is not defined` on
   `dev`/`deploy`/`diff`. Ref: anomalyco/sst#6937. We are on v3.19.3 today
   and immune, but issue #58 (v3 → v4 migration) will expose us. Worth
   landing a naming convention *before* the upgrade.

A third, minor concern: `sst dev` starts the multiplexer, web frontend, live
Lambda, and a tunnel. Running two `sst dev` sessions in parallel can clash
on the multiplexer port (currently `0.0.0.0:13557`) despite per-stage
resource name scoping.

---

## Goals

- Establish a worktree + stage naming convention that prevents Pulumi state
  collisions by construction.
- Provide a small `scripts/worktree-setup.sh` helper so the convention is
  one-command and hard to get wrong.
- Document the pitfalls (stage collisions, port clashes, v4 path bug) in
  `docs/development/` so future contributors don't rediscover them.
- Confirm the setup works on this repo end-to-end (one parallel
  `sst dev` smoke test in two worktrees).

## Non-Goals

- Switching SST's `home` to `local` state.
- Multi-AWS-account-per-developer setups (team uses a single dev account
  with stage-scoped resources today).
- Worktree-aware isolation of databases or external services — out of scope
  for v1; tracked separately if it becomes a problem.
- Changing the default `production` branch or git workflow.

---

## Technical Approach

### What's already true in this repo (verified)

| Check | State |
|---|---|
| `.sst` in `.gitignore` (line 8) | ✅ Each worktree gets a clean local `.sst/` |
| `.worktrees/` in `.gitignore` (line 2) | ✅ Worktree root already planned for |
| SST version | 3.19.3 (v3 / ion) |
| `home` in `sst.config.ts` | `home: "aws"` — state in S3, keyed by `app + stage` |
| `.sst/pulumi/` | Empty — confirms state is remote |
| `.sst/stage` | Contains `hking` (cached default for `sst dev`) |

No prerequisite changes to `.gitignore` or `sst.config.ts` are needed.

### Convention: branch-derived personal stages

Stage scheme: `<user>-<branch>` — matches SST's personal-stage model and
ensures two developers working the same branch aliased into their own
worktrees never collide.

```bash
# from the main checkout
git worktree add .worktrees/feat-a feat-a
cd .worktrees/feat-a
npm install
sst dev --stage hking-feat-a        # <user>-<branch>
```

Path scheme `.worktrees/<branch>` deliberately avoids the `<repo>.<branch>`
naming that would trip the v4 `.sst` substring bug (no `.sst` ever appears
in the absolute path, regardless of branch name).

### `scripts/worktree-setup.sh` (proposed, small)

Responsibilities:
1. Validate branch name and absence of `.sst` substring in the resolved
   absolute path (fail fast with a clear message — defense against v4).
2. `git worktree add .worktrees/<branch> <branch>`.
3. Run `npm install` in the new worktree.
4. Print the exact `sst dev --stage <user>-<branch>` command, deriving
   `<user>` from `whoami` (matching SST's personal-stage default) and
   sanitizing the branch name (strip `origin/`, replace `/` with `-`).

~40 lines of bash. No production code touched.

### Documentation: `docs/development/WORKTREES.md` (proposed)

A short page covering:
- The model: state is in S3 keyed by `app + stage`; local `.sst/` is throwaway.
- The naming convention and why (v4 path bug callout).
- The stage collision rule — never reuse a stage across two `sst dev` sessions.
- Port hygiene when running two `sst dev` sessions in parallel.
- A "Known upstream issues" section linking anomalyco/sst#6937 and the v3→v4
  migration (issue #58).

---

## Tasks

- [ ] Add `scripts/worktree-setup.sh` (branch derivation, `.sst` guard,
      `npm install`, prints `sst dev --stage` command).
- [ ] Add `docs/development/WORKTREES.md` (workflow + pitfalls + upstream
      bug links).
- [ ] Add a one-line pointer in `docs/development/DEVELOPMENT_TOOLS.md` to
      the new WORKTREES page.
- [ ] Smoke test: create two worktrees, run `sst dev --stage hking-<a>` in
      one and `sst dev --stage hking-<b>` in another; confirm both stay
      connected and resources are stage-scoped in AWS.
- [ ] Cross-reference issue #58 (v3 → v4 migration): add a checklist item
      to verify the `.sst` path-substring bug is fixed before upgrading,
      or that our convention continues to avoid it.

## Acceptance Criteria

- [ ] `scripts/worktree-setup.sh <branch>` creates a worktree under
      `.worktrees/<branch>`, installs deps, and prints the correct
      `sst dev --stage <user>-<branch>` command.
- [ ] The script refuses to create a worktree whose absolute path contains
      `.sst` and explains why.
- [ ] Two `sst dev` sessions in two worktrees with distinct `--stage` values
      run simultaneously without one disconnecting the other.
- [ ] `docs/development/WORKTREES.md` documents the stage-collision rule,
      port considerations, and the v4 `.sst` path bug.
- [ ] No changes to `.gitignore` or `sst.config.ts` are required by this work.

---

## Additional Context

- Related: #58 (SST v3 → v4 migration) — the v4 `.sst` substring bug is the
  main reason to land a naming convention now.
- Upstream bug: https://github.com/anomalyco/sst/issues/6937
- SST personal-stage docs: https://sst.dev/docs/basics/
- SST stage-management guide:
  https://mintlify.wiki/anomalyco/sst/guides/stage-management

## Labels

`refactor` `dev-workflow`