#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

# Get GitHub issues as JSON
ISSUES=$(gh issue list --state open --json number,title,body,comments)

# Progress counters
COMPLETED=0
ITERATIONS=0

# Main loop
for ((i=1; i<=$1; i++)); do
  ITERATIONS=$i
  echo "=== Iteration $i of $1 ==="

  # Run OpenCode with build agent
  # Pass issues JSON and prompt instructions
  opencode run --agent build "Here are the open issues: $ISSUES

Follow the instructions in specs/prompt.md for task breakdown, selection, and execution."

  # Check for completion signal in progress.txt
  if grep -q "<promise>COMPLETE</promise>" specs/progress.txt; then
    COMPLETED=1
    break
  fi

  echo "---"
done

# Summary at end
echo ""
echo "========================================="
echo "Summary:"
echo "  Iterations: $ITERATIONS / $1"
if [ $COMPLETED -eq 1 ]; then
  echo "  Status: ✓ Complete"
  exit 0
else
  echo "  Status: Max iterations reached"
  exit 1
fi
echo "========================================="
