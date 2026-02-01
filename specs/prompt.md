# PHASE DETECTION

**CRITICAL: Run this section FIRST, before anything else.**

This determines whether you're in WORK mode or PR_MERGE mode.

1. Read `specs/progress.txt` to find promise markers:
   - Search for: `<promise>MERGED</promise>`
   - Search for: `<promise>COMPLETE</promise>`
   - Search for: `<promise>FAILED</promise>`

2. If `<promise>FAILED</promise>` is present:
   - Read the failure notes in progress.txt
   - Leave a comment on the current GitHub issue explaining the failure
   - Abort this session (do not proceed further)
   - User will fix manually and restart afk.sh

3. If `<promise>MERGED</promise>` is present:
   - This issue is done and merged
   - Remove the MERGED promise marker from progress.txt (keep the log entry)
   - Proceed to BRANCH SETUP section to start next issue

4. If `<promise>COMPLETE</promise>` is present:
   - Skip all sections except PR CREATION & MERGE
   - Go directly to PR CREATION & MERGE section

5. If no promise markers present:
   - Proceed to BRANCH SETUP section

# BRANCH SETUP

**Run this section once when starting a new issue.**

## Determine Current Issue

1. Read the GitHub issues JSON provided at the start of context
2. Select the most appropriate issue using the TASK SELECTION priority framework
3. Extract:
   - Issue number: `ISSUE_NUMBER`
   - Issue title: `ISSUE_TITLE`
   - Issue labels: Store for PR creation later

## Determine Expected Branch Name

Use GitHub's auto-generated branch name. Do NOT manually construct one.

Use this command:
```bash
gh issue develop <ISSUE_NUMBER>
```

This will:
- Create a branch with GitHub's auto-generated name (e.g., `feature/my-cool-feature` or `bug/123-fix-something`)
- Checkout the branch
- Set up tracking if needed

**Important**: This command may ask for confirmation. Use `--yes` flag to auto-confirm:
```bash
gh issue develop <ISSUE_NUMBER> --yes
```

## Check If Resume or New

Read `specs/progress.txt` and search for:
- `[CURRENT_ISSUE]` - The issue number being worked on
- `[CURRENT_BRANCH]` - The branch name for that issue

**If both match and branch exists locally**:
- You're resuming work on this issue
- Do NOT run `gh issue develop` again
- Just verify you're on the correct branch: `git branch --show-current`
- Proceed to TASK SELECTION

**If they don't match OR don't exist**:
- Run `gh issue develop <ISSUE_NUMBER> --yes`
- This will create/set up the branch for you

## Update Progress State

After branch setup, append to `specs/progress.txt`:
```
## <timestamp>: Issue #<number> Started

- Issue title: <issue-title>
- Branch: <branch-name>
[CURRENT_ISSUE] <issue-number>
[CURRENT_BRANCH] <branch-name>
[STARTED] <timestamp>
```

## Verification

- Run: `git status`
- Verify you're on the correct branch
- Verify it's up-to-date with dev
- If any errors, abort and leave a comment on the issue

# ISSUES

Issues JSON is provided at start of context. Parse it to get open issues with their bodies and comments.

# TASK BREAKDOWN

Break down issues into tasks. An issue may contain a single task (a small bugfix or visual tweak) or many, many tasks (a PRD or a large refactor).

Make each task as smallest possible unit of work. We don't want to outrun our headlights. Aim for one small change per task.

# TASK SELECTION

Pick the next issue and task. Use the following priority framework, but use your judgment to pick the most impactful issue:

1. **Critical Bugfixes** (highest impact)
   - Issues labeled "critical" or "bug: critical"
   - Blockers preventing work on other issues
   - User-facing failures

2. **Tracer Bullets** (strategic value)
   - New features that provide immediate feedback
   - Infrastructure that unlocks multiple issues
   - End-to-end slices of functionality

   Tracer bullets comes from the Pragmatic Programmer. When building systems, you want to write code that gets you feedback as quickly as possible. Tracer bullets are small slices of functionality that go through all layers of system, allowing you to test and validate your approach early. This helps in identifying potential issues and ensures that the overall architecture is sound before investing significant time in development.

   TL;DR - build a tiny, end-to-end slice of the feature first, then expand it out.

3. **Polish & Quick Wins** (visibility)
   - UI improvements
   - Small enhancements
   - Documentation fixes

4. **Refactors** (technical debt)
   - Code quality improvements
   - Performance optimizations

**Agent Agency**:
- You may reorder these priorities based on context
- Consider dependencies (what unblocks other issues)
- Consider time to completion (quick wins vs large refactors)
- If multiple issues have similar priority, pick the oldest issue

**Do NOT output COMPLETE here.**
Completion is determined in the ISSUE COMPLETION CHECK section after each commit.

# EXPLORATION

Explore the repo and fill your context window with relevant information that will allow you to complete the task.

# EXECUTION

Complete the task.

If you find that the task is larger than you expected (for instance, it requires a refactor first), output "HANG ON A SECOND".

Then, find a way to break it into a smaller chunk and only do that chunk (i.e. complete the smaller refactor).

# FEEDBACK LOOPS

Before committing, run feedback loops in this order:

1. **UI Changes**: Use dev-browser agent to test and check browser logs for any issues
2. `npm run typecheck` to run type checker
   - Works without AWS credentials - uses committed `sst-env.d.ts` type files
   - Regenerate type files with `npx sst dev` when infrastructure changes
3. `npm run test` to run tests (E2E tests focus on browser console log issues)
4. `npx sst deploy` to deploy to current stage (your personal stage) and verify infrastructure works

Important: Always run `npx sst deploy` before committing to ensure infrastructure changes work and catch runtime errors early.

# PROGRESS

After completing, append to progress.txt:

- Task completed and PRD reference
- Key decisions made
- Files changed
- Blockers or notes for next iteration
  Keep entries concise.

- Ensure you commit progress.txt with the changed code

# COMMIT

Make a git commit with a clear message.

# ISSUE COMPLETION CHECK

After each commit, check if the issue is complete.

## How to Determine Completion

1. Read the GitHub issue body and all comments
2. Look for:
   - Are all tasks described in the issue done?
   - Are all user requirements satisfied?
   - Are all test criteria met?

3. If YES (issue is complete):
   - Append to `specs/progress.txt`:
     ```
     ## <timestamp>: Issue #<number> Complete

     - Issue title: <issue-title>
     - Branch: <current-branch>
     - All tasks completed
     - Outputting COMPLETE to trigger PR creation
     <promise>COMPLETE</promise>
     ```
   - Commit progress.txt with message: "Mark issue #<number> as COMPLETE"
   - STOP working - output completion message

4. If NO (issue not done):
   - Go back to TASK SELECTION to pick the next task
   - Do NOT output COMPLETE

## Multi-Task Issues

If the issue has many tasks:
- Complete ONE task at a time (see TASK SELECTION)
- Commit after each task
- Run this completion check after each commit
- Only output COMPLETE when ALL tasks are done

# THE ISSUE

If the task is not complete (issue still has unfinished work):
- Leave a comment on the GitHub issue with what was done in this session
- Include: task completed, files changed, any blockers found

**Do NOT close the issue directly.** The issue will be automatically closed after the PR is merged in the PR CREATION & MERGE section.

Only when the issue is fully complete and you've output `<promise>COMPLETE</promise>`, proceed to the PR CREATION & MERGE section which will:
- Create a PR for this issue
- Merge it to dev
- Close the issue automatically

# FINAL RULES

ONLY WORK ON A SINGLE TASK.

# PR CREATION & MERGE

**This section only runs when `<promise>COMPLETE</promise>` is in progress.txt.**

## Preconditions

Before proceeding:
- Verify the issue is marked COMPLETE
- Verify all changes are committed
- Read `[CURRENT_BRANCH]` and `[CURRENT_ISSUE]` from progress.txt

## Get Issue Labels

```bash
ISSUE_LABELS=$(gh issue view <ISSUE_NUMBER> --json labels --jq '.labels[].name')
```

This returns labels as a space-separated list (e.g., "bug critical enhancement")

## Create PR

1. Generate PR body using the template from `specs/pr-body-template.md`:
   - Replace `{{ISSUE_NUMBER}}` with the issue number
   - Replace `{{ISSUE_TITLE}}` with the issue title
   - Replace `{{BRANCH_NAME}}` with the branch name

2. Create PR using GitHub CLI with labels:
   ```bash
   gh pr create \
     --title "Issue #{{ISSUE_NUMBER}}: {{ISSUE_TITLE}}" \
     --body "$(cat specs/pr-body-template.md)" \
     --base dev \
     --head {{BRANCH_NAME}} \
     --labels $ISSUE_LABELS
   ```

   Note: We specify `--head` explicitly even though `gh issue develop` created the branch,
   to ensure the PR is created from the correct branch.

3. If PR creation fails:
   - Leave a comment on the GitHub issue explaining the error
   - Append failure note to progress.txt
   - Output `<promise>FAILED</promise>`
   - Abort this session

4. Get the PR number:
   ```bash
   PR_NUMBER=$(gh pr view --json number --jq '.number')
   ```

5. Append to progress.txt:
   ```
   ## <timestamp>: PR Created for Issue #<issue-number>

   - PR #<pr-number>
   - Branch: <branch-name>
   - Labels: <labels>
   - Waiting for CI checks...
   ```

## Wait for CI Checks

1. Wait for all CI checks to complete:
   ```bash
   gh pr checks --watch
   ```

2. Check check status:
   ```bash
   gh pr checks
   ```

3. If all checks PASS:
   - Proceed to Merge section

4. If any checks FAIL:
   - Proceed to Failure Handling section

## Merge PR

**Only do this if all CI checks PASS.**

1. Merge the PR:
   ```bash
   gh pr merge --merge
   ```

2. If merge fails:
   - Leave a comment on the issue explaining the merge failure
   - Append failure note to progress.txt
   - Output `<promise>FAILED</promise>`
   - Abort this session

3. Close the GitHub issue:
   ```bash
   gh issue close <ISSUE_NUMBER>
   ```

4. Add success message to the issue:
   ```bash
   gh issue comment <ISSUE_NUMBER> --body "✅ Issue resolved and merged to dev via PR #<PR_NUMBER>"
   ```

5. Append to progress.txt:
   ```
   ## <timestamp>: Issue #<issue-number> Merged

   - PR #<pr-number> merged to dev
   - Issue closed
   <promise>MERGED</promise>
   ```

6. Proceed to Cleanup section

## Failure Handling (Test Failures or Merge Conflicts)

**Only do this if CI checks fail or merge fails.**

### Attempt One Fix

1. Read the CI failure logs
2. Identify what needs to be fixed
3. Fix the issue (go through FEEDBACK LOOPS)

4. Commit the fix:
   ```bash
   git commit -am "Fix CI test failure"
   ```

5. Push to branch:
   ```bash
   git push
   ```

6. Wait for CI checks again:
   ```bash
   gh pr checks --watch
   ```

### If Still Failed

1. Leave a detailed comment on the GitHub issue:
   - What failed (test names or conflict details)
   - What was attempted
   - What manual action is needed

2. Append to progress.txt:
   ```
   ## <timestamp>: Issue #<issue-number> Failed to Merge

   - Failure reason: <details>
   - Attempted fix: <details>
   - Manual intervention required
   <promise>FAILED</promise>
   ```

3. Commit progress.txt

4. Output failure message and abort

## Cleanup (After Successful Merge)

**Only do this if merge succeeded.**

1. Delete the remote branch:
   ```bash
   git push origin --delete <BRANCH_NAME>
   ```

2. Checkout dev:
   ```bash
   git checkout dev
   ```

3. Delete the local branch:
   ```bash
   git branch -D <BRANCH_NAME>
   ```

4. Pull latest dev (with your merged changes):
   ```bash
   git pull origin dev
   ```

5. **Clean progress.txt (remove all entries for this issue)**:

   Use sed to remove all lines mentioning this issue number:
   ```bash
   sed -i '/Issue #<issue-number>/d' specs/progress.txt
   sed -i '/\[CURRENT_ISSUE\]/d' specs/progress.txt
   sed -i '/\[CURRENT_BRANCH\]/d' specs/progress.txt
   sed -i '/\[STARTED\]/d' specs/progress.txt
   sed -i '/<promise>COMPLETE<\/promise>/d' specs/progress.txt
   sed -i '/<promise>MERGED<\/promise>/d' specs/progress.txt
   sed -i '/<promise>FAILED<\/promise>/d' specs/progress.txt
   ```

6. Commit the cleaned progress.txt (only if changes were made):
   ```bash
   if [ -n "$(git diff specs/progress.txt)" ]; then
     git add specs/progress.txt
     git commit -m "Clean progress.txt after merging issue #<issue-number>"
     git push
   fi
   ```

7. Output completion message:
   ```
   === Issue #<issue-number> Complete ===
   PR #<pr-number> merged to dev
   Feature branch deleted
   Progress log cleaned
   Ready for next issue
   ```

8. Output the MERGED promise for afk.sh to detect:
   ```markdown
   <promise>MERGED</promise>
   ```

## Important Notes

- This section runs independently - it doesn't do any coding
- The agent here is purely orchestrating PR, checks, and merge
- All coding happens in WORK mode before this section
- If this section fails, it outputs FAILED and aborts
- The MERGED promise signals the afk.sh loop to complete (or move to next issue)
