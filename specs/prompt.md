# PHASE DETECTION

**CRITICAL: Run this section FIRST, before anything else.**

This determines whether you're in WORK mode, PR_READY mode, or POST-MERGE mode.

1. Read `specs/progress.txt` to find promise markers:
   - Search for: `<promise>MERGED</promise>`
   - Search for: `<promise>PR_READY</promise>`
   - Search for: `<promise>COMPLETE</promise>`
   - Search for: `<promise>FAILED</promise>`

2. If `<promise>FAILED</promise>` is present:
   - Read the failure notes in progress.txt
   - Leave a comment on the current GitHub issue explaining the failure
   - Abort this session (do not proceed further)
   - User will fix manually and restart afk.sh

3. If `<promise>MERGED</promise>` is present:
   - User has manually merged the PR
   - Proceed to POST-MERGE CLEANUP section

4. If `<promise>PR_READY</promise>` is present:
   - PR is created and CI passed, waiting for manual merge
   - Check if PR still exists: `gh pr view --json number,merged,state 2>/dev/null`
   - **If PR doesn't exist (deleted):**
     - User did full manual cleanup (merge + delete + close)
     - Clear progress.txt and output "Full manual cleanup detected"
     - STOP - ready for next issue
   - **If PR exists and is merged:**
     - Replace `PR_READY` with `MERGED` in progress.txt
     - Proceed to POST-MERGE CLEANUP section
   - **If PR exists and not merged:**
     - Output "PR still waiting for manual merge" and STOP

5. If `<promise>COMPLETE</promise>` is present:
   - Skip all sections except PR CREATION & WAIT
   - Go directly to PR CREATION & WAIT section

6. If no promise markers present:
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

**IMPORTANT: Ensure branches are created from production, not the repository's default branch.**

First, checkout and update production:
```bash
git checkout production && git pull origin production
```

Then use this command:
```bash
gh issue develop <ISSUE_NUMBER>
```

This will:
- Create a branch with GitHub's auto-generated name (e.g., `<ISSUE_NUMBER>-name-of-the-issue`)
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

After branch setup, write ONLY state markers to `specs/progress.txt` (overwrite, not append):
```
[CURRENT_ISSUE] <issue-number>
[CURRENT_BRANCH] <branch-name>
[STARTED] <timestamp>
```

Note: progress.txt uses a state-only model. No log entries or history - just current state markers.

## Verification

- Run: `git status`
- Verify you're on the correct branch
- Verify it's up-to-date with production
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

Progress tracking is handled via git commits. The progress.txt file only stores state markers (current issue, branch, promise flags) - no task history.

Ensure meaningful commit messages capture what was done.

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
   - Append ONLY the promise marker to `specs/progress.txt`:
     ```
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

**Do NOT close the issue directly.** The issue will be automatically closed after the PR is merged in the POST-MERGE CLEANUP section.

Only when the issue is fully complete and you've output `<promise>COMPLETE</promise>`, proceed to the PR CREATION & WAIT section which will:
- Create a PR for this issue
- Wait for CI checks to pass
- Stop and wait for manual merge

# FINAL RULES

ONLY WORK ON A SINGLE TASK.

# PR CREATION & WAIT

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
     --base production \
     --head {{BRANCH_NAME}} \
     --labels $ISSUE_LABELS
   ```

   Note: We specify `--head` explicitly even though `gh issue develop` created the branch,
   to ensure the PR is created from the correct branch.

3. If PR creation fails:
   - Leave a comment on the GitHub issue explaining the error
   - Output `<promise>FAILED</promise>`
   - Abort this session

4. Get the PR number:
   ```bash
   PR_NUMBER=$(gh pr view --json number --jq '.number')
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
   - Leave a comment on the GitHub issue: "✅ CI checks passed. Ready for manual merge."
   - Update progress.txt:
     ```
     [CURRENT_ISSUE] <issue-number>
     [CURRENT_BRANCH] <branch-name>
     [STARTED] <timestamp>
     <promise>PR_READY</promise>
     ```
   - Commit progress.txt with message: "PR #<pr-number> ready for manual merge"
   - Output completion message:
     ```
     === PR Ready for Manual Merge ===
     PR #<pr-number> created and CI checks passed
     Issue #<issue-number> waiting for manual merge
     Link: https://github.com/<owner>/<repo>/pull/<pr-number>
     ```
   - STOP - wait for user to manually merge

4. If any checks FAIL:
   - Proceed to Failure Handling section

## Failure Handling (Test Failures)

**Only do this if CI checks fail.**

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

2. Append ONLY the promise marker to progress.txt:
   ```
   <promise>FAILED</promise>
   ```

3. Commit progress.txt

4. Output failure message and abort

## Important Notes

- This section runs independently - it doesn't do any coding
- The agent here is purely orchestrating PR creation and CI checks
- All coding happens in WORK mode before this section
- **Merging is manual** - the agent stops after CI passes
- After manual merge, run the agent again to detect MERGED state and cleanup

# POST-MERGE CLEANUP

**This section only runs when `<promise>MERGED</promise>` is in progress.txt.**

The MERGED promise is set by the user after manually merging the PR. This section handles cleanup.

## Preconditions

Before proceeding:
- Read `[CURRENT_BRANCH]` and `[CURRENT_ISSUE]` from progress.txt

## Check If Cleanup Already Done

First, check if the user already did the cleanup manually:

1. Check if branch exists locally:
   ```bash
   git show-ref --verify --quiet refs/heads/<BRANCH_NAME>
   ```

2. Check if issue is still open:
   ```bash
   gh issue view <ISSUE_NUMBER> --json state --jq '.state'
   ```

**If branch doesn't exist locally AND issue is closed:**
- User did full cleanup manually
- Just clear progress.txt and finish:
  ```bash
  > specs/progress.txt
  git add specs/progress.txt
  git commit -m "Clear progress.txt - cleanup already done"
  git push
  ```
- Output:
  ```
  === Issue #<issue-number> Already Cleaned Up ===
  Branch deleted and issue closed (manual cleanup detected)
  Progress state cleared
  Ready for next issue
  ```
- STOP

**Otherwise, proceed with cleanup steps below.**

## Cleanup

1. Delete the remote branch (if it exists):
   ```bash
   git push origin --delete <BRANCH_NAME> 2>/dev/null || echo "Remote branch already deleted"
   ```

2. Checkout production:
   ```bash
   git checkout production
   ```

3. Delete the local branch (if it exists):
   ```bash
   git branch -D <BRANCH_NAME> 2>/dev/null || echo "Local branch already deleted"
   ```

4. Pull latest production (with your merged changes):
   ```bash
   git pull origin production
   ```

5. Close the GitHub issue (if still open):
   ```bash
   gh issue close <ISSUE_NUMBER> 2>/dev/null || echo "Issue already closed"
   ```

6. Add success message to the issue (if it exists):
   ```bash
   gh issue comment <ISSUE_NUMBER> --body "✅ Issue resolved and merged to production" 2>/dev/null || echo "Could not comment (issue may not exist)"
   ```

7. **Clear progress.txt (state-only model)**:

   Simply truncate the file:
   ```bash
   > specs/progress.txt
   ```

8. Commit the cleared progress.txt:
   ```bash
   git add specs/progress.txt
   git commit -m "Clear progress.txt after merging issue #<issue-number>"
   git push
   ```

9. Output completion message:
   ```
   === Issue #<issue-number> Complete ===
   PR merged to production
   Feature branch deleted
   Issue closed
   Progress state cleared
   Ready for next issue
   ```

10. Output the MERGED promise for afk.sh to detect (already in progress.txt):
    ```markdown
    <promise>MERGED</promise>
    ```
