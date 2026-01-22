# Implementation Plan: Conditional Typecheck in Pre-commit Hook

**Plan ID**: 02  
**Created**: 2026-01-21  
**Status**: Ready for Implementation  
**Estimated Time**: 1-2 hours  
**Priority**: MEDIUM  
**Dependencies**: Plan 01 (AWS OIDC) should be implemented first for CI compatibility

---

## Overview

Implement a conditional typecheck strategy in the pre-commit hook that gracefully handles AWS SSO credential expiration. When AWS credentials are expired, the hook automatically falls back to a local typecheck (without SST shell), allowing developers to continue committing while being reminded to refresh credentials when convenient.

---

## Context & Problem Statement

### Current State
- ✅ Pre-commit hook runs `npm run typecheck` (includes SST shell for core/backend)
- ❌ Hook fails when AWS SSO credentials expire (~every 12 hours)
- ❌ Developers are blocked from committing until they run `aws sso login`
- ⚠️ Disruptive to workflow (interrupts focus)

### Desired State
- ✅ Pre-commit hook tries full typecheck first (with AWS)
- ✅ If AWS credentials expired, automatically falls back to local typecheck
- ✅ Developers can commit even when AWS credentials expired
- ✅ Clear messaging about which typecheck ran (full vs. local)
- ✅ CI still runs full typecheck (catches issues missed by local typecheck)

### Why Conditional Approach?

**Considered Alternatives:**

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **A: Conditional (Recommended)** | Best of both worlds, never blocks | More complex hook logic | ✅ **SELECTED** |
| **B: Always Local** | Simple, never blocks | Skips library checks (`--skipLibCheck`) | ❌ Less comprehensive |
| **C: Remove Typecheck** | Fastest, never blocks | Type errors only caught in CI | ❌ Delayed feedback |

**Decision**: Use **Approach A (Conditional)** because:
- ✅ Uses full typecheck when AWS available (most comprehensive)
- ✅ Graceful fallback when AWS unavailable (never blocks)
- ✅ Clear messaging to developer (knows which ran)
- ✅ CI acts as safety net (always runs full typecheck)

---

## Prerequisites

### Required Knowledge
- Basic bash scripting (if/else, grep, exit codes)
- Understanding of npm scripts (package.json)
- Familiarity with pre-commit hooks (Husky)

### Required Access
- Write access to repository files
- Ability to test pre-commit hook locally

### Current Setup (Assumptions)
- ✅ Husky installed (`.husky/` directory exists)
- ✅ Pre-commit hook exists (`.husky/pre-commit`)
- ✅ lint-staged configured (package.json or .lintstagedrc)
- ✅ All packages have `typecheck` and `typecheck:local` scripts

### Dependencies
- **Soft dependency**: Plan 01 (AWS OIDC) should be implemented first
  - Ensures CI has same conditional logic capabilities
  - Can be implemented independently, but CI will need separate handling

---

## Phase 1: Add Local Typecheck Scripts (15-20 minutes)

### Step 1.1: Verify Package Scripts (5 minutes)

Check that all packages have the necessary scripts defined.

**Expected scripts in `packages/core/package.json` and `packages/backend/package.json`:**

```json
{
  "scripts": {
    "typecheck": "npx sst shell -- tsc --noEmit",
    "typecheck:local": "tsc --noEmit --skipLibCheck"
  }
}
```

**Verify**:
```bash
# Check core package
cat packages/core/package.json | jq '.scripts | {typecheck, "typecheck:local"}'

# Check backend package
cat packages/backend/package.json | jq '.scripts | {typecheck, "typecheck:local"}'
```

**If missing**, add them:

```bash
# For packages/core/package.json
cd packages/core
npm pkg set scripts.typecheck:local="tsc --noEmit --skipLibCheck"
cd ../..

# For packages/backend/package.json
cd packages/backend
npm pkg set scripts.typecheck:local="tsc --noEmit --skipLibCheck"
cd ../..
```

**Success Criteria**:
- [ ] `packages/core/package.json` has `typecheck:local` script
- [ ] `packages/backend/package.json` has `typecheck:local` script
- [ ] Both scripts use `tsc --noEmit --skipLibCheck`

---

### Step 1.2: Add Root-Level Local Typecheck Scripts (10 minutes)

Add convenience scripts to the root `package.json` for running local typechecks.

**File**: `package.json` (root)

**Current structure** (reference):
```json
{
  "scripts": {
    "typecheck": "npm run typecheck:core && npm run typecheck:backend && npm run typecheck:app && npm run typecheck:web",
    "typecheck:core": "cd packages/core && npm run typecheck",
    "typecheck:backend": "cd packages/backend && npm run typecheck",
    "typecheck:app": "cd packages/app-example && npm run typecheck",
    "typecheck:web": "cd packages/web && npm run typecheck"
  }
}
```

**Add these new scripts**:

```json
{
  "scripts": {
    "typecheck": "npm run typecheck:core && npm run typecheck:backend && npm run typecheck:app && npm run typecheck:web",
    "typecheck:core": "cd packages/core && npm run typecheck",
    "typecheck:backend": "cd packages/backend && npm run typecheck",
    "typecheck:app": "cd packages/app-example && npm run typecheck",
    "typecheck:web": "cd packages/web && npm run typecheck",
    
    "typecheck:local": "npm run typecheck:core:local && npm run typecheck:backend:local && npm run typecheck:app && npm run typecheck:web",
    "typecheck:core:local": "cd packages/core && npm run typecheck:local",
    "typecheck:backend:local": "cd packages/backend && npm run typecheck:local"
  }
}
```

**What changed**:
- Added `typecheck:local` - runs local typecheck for core/backend, standard for app/web
- Added `typecheck:core:local` - wrapper for `packages/core` local typecheck
- Added `typecheck:backend:local` - wrapper for `packages/backend` local typecheck
- Note: app-example and web don't need `:local` variants (they don't use `sst shell`)

**Verify**:
```bash
# Test local typecheck (should work without AWS credentials)
npm run typecheck:local

# Should complete successfully even if AWS credentials expired
```

**Success Criteria**:
- [ ] Root `package.json` has new `:local` scripts
- [ ] `npm run typecheck:local` completes without AWS credentials
- [ ] Changes ready to commit

---

## Phase 2: Update Pre-commit Hook (30-45 minutes)

### Step 2.1: Read Current Pre-commit Hook (5 minutes)

**File**: `.husky/pre-commit`

**Current content** (reference):
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged

# Run typecheck
echo "Running TypeScript type check..."
npm run typecheck || exit 1

echo "Running tests..."
npm test || exit 1
```

**Analysis**:
- Runs `npm run typecheck` directly
- If typecheck fails, hook fails (exit 1)
- No error handling for AWS credential expiration

---

### Step 2.2: Implement Conditional Typecheck Logic (30 minutes)

Replace the typecheck section with conditional logic.

**File**: `.husky/pre-commit`

**New content**:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged

# Run typecheck with AWS credential fallback
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Running TypeScript type check..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Temporary file for capturing output
TYPECHECK_OUTPUT="/tmp/typecheck-output-$$.txt"

# Try full typecheck first (includes SST shell with AWS)
if npm run typecheck > "$TYPECHECK_OUTPUT" 2>&1; then
  # Success - full typecheck passed
  echo "✅ Full typecheck passed (with AWS credentials)"
  rm -f "$TYPECHECK_OUTPUT"
else
  # Failed - check if it's due to expired AWS credentials
  if grep -q "cached SSO token is expired" "$TYPECHECK_OUTPUT"; then
    echo ""
    echo "⚠️  AWS credentials expired - falling back to local typecheck"
    echo "   (skips library type checking with --skipLibCheck)"
    echo ""
    
    # Clean up and try local typecheck
    rm -f "$TYPECHECK_OUTPUT"
    
    if npm run typecheck:local; then
      echo ""
      echo "✅ Local typecheck passed"
      echo ""
      echo "💡 Tip: Refresh AWS credentials when convenient:"
      echo "   aws sso login --sso-session=structa"
      echo ""
    else
      echo ""
      echo "❌ Local typecheck failed - fix type errors before committing"
      rm -f "$TYPECHECK_OUTPUT"
      exit 1
    fi
  else
    # Failed for a different reason (real type error)
    echo ""
    echo "❌ Typecheck failed (not due to AWS credentials)"
    echo ""
    echo "Error output:"
    cat "$TYPECHECK_OUTPUT"
    echo ""
    rm -f "$TYPECHECK_OUTPUT"
    exit 1
  fi
fi

# Clean up temp file if it still exists
rm -f "$TYPECHECK_OUTPUT"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Running tests..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

npm test || exit 1

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All pre-commit checks passed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

**Logic Explanation**:

1. **Try full typecheck**:
   - Run `npm run typecheck` (includes `sst shell`)
   - Capture stdout and stderr to temp file
   - If succeeds → Great! Print success and continue

2. **Check for AWS credential error**:
   - If fails, examine output for "cached SSO token is expired"
   - If found → AWS credentials are the problem (not a type error)

3. **Fall back to local typecheck**:
   - Run `npm run typecheck:local` (no AWS needed)
   - If succeeds → Print success with reminder to refresh AWS
   - If fails → Real type error, exit with failure

4. **Handle real type errors**:
   - If typecheck fails without AWS error → Real type error
   - Print error output
   - Exit with failure (block commit)

**Key Features**:
- ✅ Uses unique temp file per hook invocation (`$$` = process ID)
- ✅ Always cleans up temp file (even on failure)
- ✅ Clear emoji indicators for different outcomes
- ✅ Helpful tip to refresh AWS credentials
- ✅ Fails fast on real type errors

---

### Step 2.3: Test Pre-commit Hook (10 minutes)

Test all three scenarios to ensure hook behaves correctly.

#### Test 1: Full Typecheck (With Valid AWS Credentials)

```bash
# Ensure AWS credentials are valid
aws sts get-caller-identity --profile structa-dev

# Make a trivial change
echo "// test comment" >> packages/core/src/test-file.ts

# Stage the file
git add packages/core/src/test-file.ts

# Attempt to commit (hook should run)
git commit -m "test: verify pre-commit with valid AWS credentials"

# Expected output:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔍 Running TypeScript type check...
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ✅ Full typecheck passed (with AWS credentials)
# 
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🧪 Running tests...
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ... test output ...
# 
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ✅ All pre-commit checks passed!
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Clean up test file
git reset HEAD~1
rm packages/core/src/test-file.ts
```

**Success Criteria**:
- [ ] Hook runs full typecheck
- [ ] Success message indicates "with AWS credentials"
- [ ] Commit succeeds

---

#### Test 2: Local Typecheck Fallback (With Expired AWS Credentials)

```bash
# Expire AWS credentials by removing cache
rm -f ~/.aws/sso/cache/*.json

# Verify credentials are expired
aws sts get-caller-identity --profile structa-dev
# Should fail with: "cached SSO token is expired"

# Make a trivial change
echo "// test comment 2" >> packages/core/src/test-file.ts

# Stage the file
git add packages/core/src/test-file.ts

# Attempt to commit (hook should run)
git commit -m "test: verify pre-commit fallback with expired AWS"

# Expected output:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔍 Running TypeScript type check...
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 
# ⚠️  AWS credentials expired - falling back to local typecheck
#    (skips library type checking with --skipLibCheck)
# 
# ✅ Local typecheck passed
# 
# 💡 Tip: Refresh AWS credentials when convenient:
#    aws sso login --sso-session=structa
# 
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🧪 Running tests...
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ... test output ...
# 
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ✅ All pre-commit checks passed!
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Clean up test file
git reset HEAD~1
rm packages/core/src/test-file.ts

# Restore AWS credentials (if desired)
# aws sso login --sso-session=structa
```

**Success Criteria**:
- [ ] Hook detects expired AWS credentials
- [ ] Fallback to local typecheck occurs automatically
- [ ] Warning message shown about AWS credentials
- [ ] Helpful tip shown to refresh credentials
- [ ] Commit succeeds

---

#### Test 3: Real Type Error (Should Block Commit)

```bash
# Introduce a real type error
echo "const x: number = 'string';" >> packages/core/src/test-file.ts

# Stage the file
git add packages/core/src/test-file.ts

# Attempt to commit (hook should run and FAIL)
git commit -m "test: verify pre-commit catches type errors"

# Expected output:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔍 Running TypeScript type check...
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 
# ❌ Typecheck failed (not due to AWS credentials)
# 
# Error output:
# packages/core/src/test-file.ts:1:7 - error TS2322: Type 'string' is not assignable to type 'number'.
# 
# 1 const x: number = 'string';
#         ~
# 
# Found 1 error.

# Commit should be blocked (exit code 1)

# Clean up test file
git reset
rm packages/core/src/test-file.ts
```

**Success Criteria**:
- [ ] Hook catches type error
- [ ] Error message displayed
- [ ] Commit is blocked (hook exits with code 1)
- [ ] Clear indication this is a real error (not AWS issue)

---

## Phase 3: Documentation Updates (15-20 minutes)

### Step 3.1: Update AGENTS.md (10 minutes)

Update the pre-commit hook documentation in `AGENTS.md`.

**File**: `AGENTS.md`

**Find Section 7.4** (or create it if doesn't exist):

```markdown
### 7.4 Pre-commit Hook Behavior

The pre-commit hook runs three checks:
1. **Lint-staged**: Auto-fixes linting/formatting issues
2. **Typecheck**: Full type check (with AWS fallback)
3. **Tests**: Related tests only (fast)

#### Typecheck with AWS Fallback

The typecheck uses conditional logic:

**First attempt**: Full typecheck via `npm run typecheck`
- Includes `packages/core` and `packages/backend` which use `sst shell`
- Requires valid AWS SSO credentials
- Most comprehensive type checking

**Fallback**: If AWS credentials expired, automatically runs `npm run typecheck:local`
- Uses `tsc --noEmit --skipLibCheck` (no AWS needed)
- Skips library type checking but verifies your code
- Allows you to continue committing

#### When AWS Credentials Expire

**What you'll see:**
```
⚠️  AWS credentials expired - falling back to local typecheck
   (skips library type checking with --skipLibCheck)

✅ Local typecheck passed

💡 Tip: Refresh AWS credentials when convenient:
   aws sso login --sso-session=structa
```

**What this means**:
- ✅ Your commit will succeed (not blocked)
- ⚠️ Library type checks were skipped (less comprehensive)
- ℹ️ CI will run full typecheck as safety net
- 💡 Refresh AWS credentials when you have a moment

**To refresh AWS credentials:**
```bash
aws sso login --sso-session=structa
```

#### Typecheck Differences

| Command | AWS Required | Library Checks | Speed |
|---------|--------------|----------------|-------|
| `npm run typecheck` | ✅ Yes | ✅ Full | ~30s |
| `npm run typecheck:local` | ❌ No | ❌ Skipped (`--skipLibCheck`) | ~20s |

**When to refresh AWS credentials**:
- ⚠️ When you see the fallback message multiple times
- ⚠️ Before making significant changes to core/backend packages
- ℹ️ AWS credentials expire every ~12 hours with SSO

**Safety net**: CI always runs full typecheck with AWS credentials (via OIDC), so any issues missed by local typecheck will be caught before merge.
```

**Success Criteria**:
- [ ] AGENTS.md Section 7.4 updated
- [ ] Clear explanation of conditional typecheck
- [ ] Table comparing full vs. local typecheck
- [ ] Instructions for refreshing credentials
- [ ] Changes ready to commit

---

### Step 3.2: Update README (Optional, 10 minutes)

If a README exists at the root, add a section on development workflow.

**File**: `README.md` (if exists)

**Add section**:

```markdown
## Development Workflow

### Pre-commit Hooks

This project uses Husky pre-commit hooks to ensure code quality before commits.

**What runs on commit:**
1. **Linting & Formatting**: Auto-fixed by lint-staged
2. **Typecheck**: Full typecheck (with AWS fallback if credentials expired)
3. **Tests**: Related tests for changed files

**AWS Credentials**:
- Pre-commit hooks use AWS credentials for type checking SST-related code
- If credentials expire, hooks automatically fall back to local typecheck
- Refresh when convenient: `aws sso login --sso-session=structa`
- AWS credentials typically expire every 12 hours

**Bypass hooks** (emergency only):
```bash
git commit --no-verify -m "emergency fix"
```
⚠️ Use sparingly - CI will still catch issues, but feedback will be slower.
```

**Success Criteria**:
- [ ] README updated with development workflow section
- [ ] Clear explanation of pre-commit hooks
- [ ] Instructions for handling AWS credentials
- [ ] Warning about bypassing hooks
- [ ] Changes ready to commit

---

## Phase 4: Commit and Test Integration (15-20 minutes)

### Step 4.1: Commit All Changes (10 minutes)

Create a feature branch and commit all changes.

```bash
# Create feature branch
git checkout -b feat/pre-commit-conditional-typecheck

# Stage all changes
git add package.json \
  packages/core/package.json \
  packages/backend/package.json \
  .husky/pre-commit \
  AGENTS.md \
  README.md  # if updated

# Commit (this will run the new pre-commit hook!)
git commit -m "feat: add conditional typecheck to pre-commit hook

- Add typecheck:local scripts to core and backend packages
- Add root-level typecheck:local convenience scripts
- Update pre-commit hook with AWS credential fallback logic
- Automatically falls back to local typecheck if AWS credentials expired
- Update AGENTS.md with pre-commit hook documentation

Benefits:
- Developers never blocked by expired AWS credentials
- Still gets comprehensive typecheck when AWS available
- Clear messaging about which typecheck ran
- CI acts as safety net with full typecheck

Related: specs/plans/02-pre-commit-conditional-typecheck.md"

# Push branch
git push -u origin feat/pre-commit-conditional-typecheck
```

**Expected**: Commit should succeed using the new hook logic.

**Success Criteria**:
- [ ] Feature branch created
- [ ] All changes committed
- [ ] Pre-commit hook ran successfully
- [ ] Branch pushed to remote

---

### Step 4.2: Create Pull Request (5 minutes)

```bash
gh pr create \
  --title "feat: Add conditional typecheck to pre-commit hook" \
  --body "## Summary

This PR implements conditional typecheck logic in the pre-commit hook to gracefully handle AWS SSO credential expiration.

## Changes
- Added \`typecheck:local\` scripts to core/backend packages
- Added root-level \`typecheck:local\` convenience scripts
- Updated \`.husky/pre-commit\` with conditional typecheck logic
- Updated AGENTS.md with documentation

## Behavior

### With Valid AWS Credentials
\`\`\`
✅ Full typecheck passed (with AWS credentials)
\`\`\`

### With Expired AWS Credentials
\`\`\`
⚠️  AWS credentials expired - falling back to local typecheck
   (skips library type checking with --skipLibCheck)

✅ Local typecheck passed

💡 Tip: Refresh AWS credentials when convenient:
   aws sso login --sso-session=structa
\`\`\`

### With Real Type Errors
\`\`\`
❌ Typecheck failed (not due to AWS credentials)

Error output:
[error details]
\`\`\`
Commit is blocked.

## Testing
- [x] Tested with valid AWS credentials (full typecheck runs)
- [x] Tested with expired AWS credentials (fallback works)
- [x] Tested with real type error (commit blocked)
- [x] CI checks pass

## Benefits
- ✅ Developers never blocked by expired AWS credentials
- ✅ Still gets comprehensive typecheck when AWS available
- ✅ Clear messaging about which typecheck ran
- ✅ CI acts as safety net with full typecheck (via OIDC)

## Related
- Implements: specs/plans/02-pre-commit-conditional-typecheck.md
- Depends on: #<PR_NUMBER_FROM_PLAN_01> (AWS OIDC, optional)"
```

**Success Criteria**:
- [ ] PR created
- [ ] PR description includes testing evidence
- [ ] PR linked to implementation plan

---

### Step 4.3: Monitor CI and Merge (5 minutes)

```bash
# Watch CI checks
gh pr checks --watch

# Once passed, merge
gh pr merge --squash --delete-branch
```

**Success Criteria**:
- [ ] CI checks pass (including full typecheck via OIDC)
- [ ] PR merged
- [ ] Feature branch deleted

---

## Phase 5: Team Rollout & Communication (Optional, 15 minutes)

### Step 5.1: Announce Changes to Team

If working in a team, communicate the change via Slack/email:

**Example announcement**:

```
📢 Update: Pre-commit hooks now handle expired AWS credentials gracefully!

**What changed:**
The pre-commit hook now automatically falls back to local typecheck when AWS SSO credentials expire. You'll no longer be blocked from committing when credentials expire.

**What you'll see:**
When AWS credentials expire, you'll see:
⚠️  AWS credentials expired - falling back to local typecheck
💡 Tip: Refresh AWS credentials when convenient

**What to do:**
✅ Nothing! Continue committing as normal
💡 Refresh AWS when convenient: `aws sso login --sso-session=structa`
ℹ️ CI still runs full typecheck, so nothing is missed

**Why this matters:**
- ✅ No more "credential expired" commit failures
- ✅ Less workflow disruption
- ✅ CI acts as safety net

Questions? See AGENTS.md Section 7.4 or ask in #dev
```

**Success Criteria**:
- [ ] Team notified (if applicable)
- [ ] Link to documentation provided

---

## Rollback Plan

If the conditional typecheck causes issues:

### Quick Rollback (Revert Commit)

```bash
# Find the commit hash
git log --oneline -5

# Revert the commit
git revert <commit-hash>

# Push revert
git push origin main
```

### Manual Rollback (Restore Simple Typecheck)

Edit `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged

# Run typecheck (simple version)
echo "Running TypeScript type check..."
npm run typecheck || exit 1

echo "Running tests..."
npm test || exit 1
```

Commit and push:
```bash
git add .husky/pre-commit
git commit -m "revert: restore simple typecheck in pre-commit hook"
git push
```

---

## Troubleshooting

### Issue 1: Hook Always Uses Local Typecheck

**Symptom**: Hook always falls back to local typecheck, even with valid AWS credentials.

**Possible Causes**:
1. AWS credentials not properly configured
2. `sst shell` not in PATH
3. SST state bucket inaccessible

**Debug**:
```bash
# Test full typecheck manually
npm run typecheck

# If fails, check AWS credentials
aws sts get-caller-identity --profile structa-dev

# Check SST shell works
cd packages/core
npx sst shell -- echo "SST shell works"
```

**Fix**: Ensure AWS credentials are configured correctly (see AGENTS.md Section 9).

---

### Issue 2: Hook Doesn't Detect AWS Credential Error

**Symptom**: Hook fails with AWS error instead of falling back.

**Possible Causes**:
1. Error message format changed
2. Grep pattern not matching

**Debug**:
```bash
# Manually run typecheck and capture output
npm run typecheck > /tmp/test-output.txt 2>&1

# Check for AWS error
cat /tmp/test-output.txt | grep -i "sso\|token\|expired"
```

**Fix**: Update grep pattern in `.husky/pre-commit` to match actual error message.

---

### Issue 3: Local Typecheck Fails but Full Succeeds

**Symptom**: Local typecheck fails, but full typecheck would pass.

**Cause**: Type error in node_modules or linked type definitions (caught by full, skipped by local due to `--skipLibCheck`).

**Fix**: 
1. Temporarily refresh AWS credentials: `aws sso login --sso-session=structa`
2. Run full typecheck: `npm run typecheck`
3. Fix any revealed type errors
4. Commit with full typecheck

**Long-term**: Consider if `--skipLibCheck` is appropriate for your project.

---

### Issue 4: Temp File Conflicts

**Symptom**: Hook fails with "permission denied" on temp file.

**Cause**: `/tmp/typecheck-output-$$.txt` already exists or has wrong permissions.

**Fix**: The hook uses `$$` (process ID) to ensure unique temp files, so this should be rare. If it occurs:
```bash
# Clean up old temp files
rm -f /tmp/typecheck-output-*.txt

# Try commit again
```

---

## Success Metrics

After implementation, you should observe:

### Developer Experience Metrics
- ✅ Zero commit failures due to expired AWS credentials
- ✅ Average commit time: ~30-45 seconds (lint + typecheck + tests)
- ✅ Developers refresh AWS credentials ~1-2x per day (vs. being forced to at commit time)
- ✅ Clear feedback on which typecheck ran

### Code Quality Metrics
- ✅ Type errors still caught (either in pre-commit or CI)
- ✅ CI catch rate: Low (most issues caught in pre-commit)
- ✅ No false positives (local typecheck doesn't over-report)

### Team Metrics
- ✅ Reduced developer frustration (no credential-related blocks)
- ✅ Maintained code quality (CI safety net)
- ✅ Faster iteration (less workflow disruption)

---

## Next Steps

After successfully implementing conditional pre-commit typecheck:

1. **Monitor metrics**:
   - Track how often fallback occurs
   - Monitor CI catch rate (issues missed by local typecheck)
   - Gather developer feedback

2. **Consider enhancements**:
   - Add notification when AWS credentials will expire soon
   - Create convenience script to check AWS credential status
   - Implement auto-refresh for AWS credentials (optional)

3. **Update CI** (if not done yet):
   - Ensure CI uses OIDC (Plan 01)
   - Verify CI always runs full typecheck
   - CI should be the ultimate safety net

---

## References

### Internal Documentation
- AGENTS.md Section 7.4: Pre-commit Hook Behavior
- AGENTS.md Section 9: AWS SSO Authentication
- Plan 01: AWS OIDC for GitHub Actions (specs/plans/01-aws-oidc-github-actions.md)

### Tools & Technologies
- [Husky](https://typicode.github.io/husky/) - Git hooks management
- [lint-staged](https://github.com/okonet/lint-staged) - Run linters on staged files
- [TypeScript Compiler Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html) - `--skipLibCheck` documentation

### Best Practices
- [Pre-commit hooks best practices](https://pre-commit.com/#usage)
- [Git hooks documentation](https://git-scm.com/docs/githooks)

---

## Appendix: Alternative Approaches

### Alternative A: Always Use Local Typecheck

**Implementation**:
```bash
# .husky/pre-commit
npm run typecheck:local || exit 1
```

**Pros**:
- ✅ Simple (no conditional logic)
- ✅ Never blocks on AWS credentials
- ✅ Fast (~20s vs ~30s)

**Cons**:
- ❌ Always skips library checks (less comprehensive)
- ❌ May miss type errors that full typecheck would catch
- ❌ Relies entirely on CI for full type checking

**When to use**: If team prefers simplicity over comprehensiveness.

---

### Alternative B: Remove Typecheck from Pre-commit

**Implementation**:
```bash
# .husky/pre-commit
# (remove typecheck entirely)
npx lint-staged
npm test || exit 1
```

**Pros**:
- ✅ Fastest (no typecheck at all)
- ✅ Never blocks
- ✅ Simplest possible hook

**Cons**:
- ❌ Type errors only caught in CI (slower feedback loop)
- ❌ Developers may push broken code more often
- ❌ Increased CI load (more failed runs)

**When to use**: If team strongly prefers fast commits over early error detection.

---

### Alternative C: Skip Hook When AWS Unavailable (Manual)

**Implementation**:
```bash
# When AWS credentials expired, developer manually skips hook
git commit --no-verify -m "commit message"
```

**Pros**:
- ✅ No code changes needed
- ✅ Simple for developers to understand

**Cons**:
- ❌ Requires manual intervention (developer must remember `--no-verify`)
- ❌ Easy to forget and get blocked
- ❌ Skips all hooks (lint, tests, etc.), not just typecheck
- ❌ Inconsistent workflow

**When to use**: Emergency only (not recommended for regular workflow).

---

**Plan Status**: Ready for Implementation  
**Estimated Complexity**: Low-Medium (bash scripting)  
**Risk Level**: Low (can be easily reverted)  
**Dependencies**: Soft dependency on Plan 01 (AWS OIDC for CI)
