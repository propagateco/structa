#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

# Progress counters
ISSUES_COMPLETED=0
ITERATIONS=0

# Main loop
for ((i=1; i<=$1; i++)); do
  ITERATIONS=$i
  echo ""
  echo "========================================="
  echo "=== Iteration $i of $1 ==="
  echo "========================================="

  # Get fresh GitHub issues JSON each iteration (state may have changed)
  # Filter out issues that already have open PRs (waiting for manual review)
  # PRs can reference issues via: branch name (e.g., "39-..."), or PR body ("fixes #39", "closes #39")
  gh pr list --state open --json headRefName,body > /tmp/pr_data.json
  gh issue list --state open --json number,title,body,comments > /tmp/issues_raw.json
  
  # Filter issues and write to a file (avoids shell variable issues with JSON)
  jq '
    [.[] | select(
      (.number | tostring) as $num |
      ($pr_data[0] | map(
        (.headRefName | contains($num)) or 
        (.body | test("#\($num)"; "i"))
      ) | any | not)
    )]
  ' --slurpfile pr_data /tmp/pr_data.json /tmp/issues_raw.json > /tmp/issues.json

  # Check if there are any open issues (read count from file)
  ISSUE_COUNT=$(jq 'length' /tmp/issues.json)
  if [ "$ISSUE_COUNT" -eq 0 ]; then
    echo ""
    echo "No open issues found. All work complete!"
    echo "========================================="
    echo "Summary:"
    echo "  Iterations: $ITERATIONS / $1"
    echo "  Issues Completed: $ISSUES_COMPLETED"
    echo "  Status: ✓ All issues resolved"
    exit 0
  fi

  # Run OpenCode with build agent
  # Pass issues JSON file path and prompt instructions
  opencode run --agent build "Here are the open issues (from /tmp/issues.json):
$(cat /tmp/issues.json)

Follow the instructions in specs/prompt.md for task breakdown, selection, and execution."

  # Check for promise markers in progress.txt
  if grep -q "<promise>FAILED</promise>" specs/progress.txt 2>/dev/null; then
    echo ""
    echo "========================================="
    echo "⚠ FAILURE DETECTED"
    echo "Check specs/progress.txt and the GitHub issue for details."
    echo "Manual intervention required."
    echo "========================================="
    exit 1
  fi

  if grep -q "<promise>COMPLETE_CYCLE</promise>" specs/progress.txt 2>/dev/null; then
    ISSUES_COMPLETED=$((ISSUES_COMPLETED + 1))
    echo ""
    echo "✓ Issue completed and cleaned up. Moving to next issue..."
    # Clear the marker so next iteration starts fresh
    > specs/progress.txt
  fi

  echo "---"
done

# Summary at end
echo ""
echo "========================================="
echo "Summary:"
echo "  Iterations: $ITERATIONS / $1"
echo "  Issues Completed: $ISSUES_COMPLETED"
echo "  Status: Max iterations reached"
echo "========================================="
