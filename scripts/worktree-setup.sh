#!/usr/bin/env bash
#
# worktree-setup.sh — create an isolated git worktree for development.
#
# The workflow for this repo NEVER runs a local dev server. Instead:
#   1. Make changes in the worktree and run local checks
#      (npm run typecheck && npm run check:fix && npm test).
#   2. Push the branch and open a PR against `dev`.
#   3. CI deploys a pr-N preview environment; test it interactively with
#      agent-browser, authenticated as the bot user (agent@structa.dev).
#
# Usage:
#   ./scripts/worktree-setup.sh <branch>         # worktree from an existing branch
#   ./scripts/worktree-setup.sh -c <branch>      # create the branch first, then worktree
#
# Exit codes:
#   0  worktree created, deps installed, workflow printed
#   1  validation failure (path safety, existing worktree) or git/npm error
#
set -euo pipefail

WORKTREES_DIR=".worktrees"

log() { printf '[worktree-setup] %s\n' "$*" >&2; }

usage() {
	log "Usage: $0 [-c] <branch>"
	log "  -c   create the branch first (from current HEAD), then add the worktree"
	exit 1
}

CREATE_BRANCH=false
while getopts "c" opt; do
	case "$opt" in
		c) CREATE_BRANCH=true ;;
		*) usage ;;
	esac
done
shift $((OPTIND - 1))

BRANCH="${1:-}"
if [[ -z "$BRANCH" ]]; then
	log "Missing branch name."
	usage
fi

# 1. Sanitize the branch name into a safe path segment
#    (`origin/feat/x` → `feat-x`) so the worktree path never contains `/`.
SAFE_BRANCH="${BRANCH#origin/}"
SAFE_BRANCH="${SAFE_BRANCH//\//-}"
WORKTREE_PATH="$WORKTREES_DIR/$SAFE_BRANCH"

# 2. Path-safety guard: SST v4's esbuild InjectGlobals plugin uses a naive
#    strings.Contains(args.Path, ".sst") check, so any project directory whose
#    absolute path contains ".sst" anywhere silently skips global injection
#    into sst.config.ts and throws "ReferenceError: sst is not defined" on
#    dev/deploy/diff.
#    Ref: https://github.com/anomalyco/sst/issues/6937 (still open on v4.17)
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RESOLVED_PATH="$REPO_ROOT/$WORKTREE_PATH"
if [[ "$RESOLVED_PATH" == *".sst"* ]]; then
	log "REFUSED: worktree path contains '.sst':"
	log "  $RESOLVED_PATH"
	log "SST v4's config bundler does a naive substring check and would skip"
	log "global injection, breaking 'sst dev'/'sst deploy' with"
	log "'ReferenceError: sst is not defined' (anomalyco/sst#6937)."
	log "Choose a branch/path that does not contain '.sst'."
	exit 1
fi

# 3. Refuse to clobber an existing worktree.
if [[ -e "$WORKTREE_PATH" ]]; then
	log "REFUSED: '$WORKTREE_PATH' already exists."
	log "Run 'git worktree remove $WORKTREE_PATH' (or use a different branch)."
	exit 1
fi

# 4. Create the worktree (and optionally the branch) under .worktrees/.
if git show-ref --verify --quiet "refs/heads/$BRANCH" 2>/dev/null; then
	log "Using existing branch '$BRANCH'."
	git worktree add "$WORKTREE_PATH" "$BRANCH"
elif [[ "$CREATE_BRANCH" == true ]]; then
	log "Creating branch '$BRANCH' from current HEAD and adding worktree..."
	git worktree add -b "$BRANCH" "$WORKTREE_PATH"
else
	log "Branch '$BRANCH' does not exist locally."
	log "Re-run with -c to create it:  ./scripts/worktree-setup.sh -c $BRANCH"
	exit 1
fi

# 5. Install dependencies (fresh worktree has no node_modules).
log "Installing dependencies in ${WORKTREE_PATH}..."
(cd "$WORKTREE_PATH" && npm install)

cat <<EOF

✅ Worktree ready: $WORKTREE_PATH  (branch: $BRANCH)

Workflow — no local dev server, CI deploys preview environments:

  1. Make your changes, then run local checks:
       npm run typecheck && npm run check:fix && npm test

  2. Commit and push:
       git -C "$WORKTREE_PATH" add -A
       git -C "$WORKTREE_PATH" commit -m "feat: ..."
       git -C "$WORKTREE_PATH" push -u origin HEAD:$BRANCH

  3. Open a PR against dev (CI runs quality checks + deploys a pr-N preview):
       gh pr create --base dev --head "$BRANCH" --fill

  4. Wait for the preview URL comment on the PR, then test interactively
     with agent-browser, authenticated as the bot user:
       ./scripts/agent-login.sh --bot <preview-url>

  5. Once the PR is merged, remove the worktree:
       git worktree remove "$WORKTREE_PATH"
EOF
