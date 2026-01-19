#!/bin/bash
# Ralph Wiggum - Long-running AI agent loop (Planning variant)
# Usage: ./plan-loop.sh [max_iterations]

set -e

MAX_ITERATIONS=${1:-3}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$SCRIPT_DIR/progress.txt"
ARCHIVE_DIR="$SCRIPT_DIR/archive"
LAST_BRANCH_FILE="$SCRIPT_DIR/.last-branch"

# ============================================
# COLOR SUPPORT
# ============================================

# Detect if terminal supports colors
if [[ -t 1 ]] && command -v tput &>/dev/null && [[ $(tput colors 2>/dev/null || echo 0) -ge 8 ]]; then
  RED=$(tput setaf 1)
  GREEN=$(tput setaf 2)
  YELLOW=$(tput setaf 3)
  BLUE=$(tput setaf 4)
  MAGENTA=$(tput setaf 5)
  CYAN=$(tput setaf 6)
  BOLD=$(tput bold)
  DIM=$(tput dim)
  RESET=$(tput sgr0)
else
  RED="" GREEN="" YELLOW="" BLUE="" MAGENTA="" CYAN="" BOLD="" DIM="" RESET=""
fi

# ============================================
# LOGGING FUNCTIONS
# ============================================

log_info() {
  echo "${BLUE}[INFO]${RESET} $*"
}

log_success() {
  echo "${GREEN}[OK]${RESET} $*"
}

log_warn() {
  echo "${YELLOW}[WARN]${RESET} $*"
}

log_error() {
  echo "${RED}[ERROR]${RESET} $*" >&2
}

# ============================================
# TASK COUNTING FUNCTIONS
# ============================================

count_completed_tasks() {
  if [ -f "$PRD_FILE" ]; then
    jq '[.userStories[] | select(.passes == true)] | length' "$PRD_FILE" 2>/dev/null || echo "0"
  else
    echo "0"
  fi
}

count_remaining_tasks() {
  if [ -f "$PRD_FILE" ]; then
    jq '[.userStories[] | select(.passes == false)] | length' "$PRD_FILE" 2>/dev/null || echo "0"
  else
    echo "0"
  fi
}

# ============================================
# PROGRESS MONITOR
# ============================================

monitor_progress() {
  local file=$1
  local task=$2
  local spinstr='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
  local spin_idx=0
  local start_time
  start_time=$(date +%s)
  local current_step="Thinking"

  # Truncate task name for display
  task="${task:0:40}"

  while true; do
    local elapsed=$(($(date +%s) - start_time))
    local mins=$((elapsed / 60))
    local secs=$((elapsed % 60))

    # Check latest output for step indicators
    if [ -f "$file" ] && [ -s "$file" ]; then
      local content
      content=$(tail -c 5000 "$file" 2>/dev/null | tr -d '\0' || true)

      if echo "$content" | grep -qE 'git commit|"command":"git commit'; then
        current_step="Committing"
      elif echo "$content" | grep -qE 'git add|"command":"git add'; then
        current_step="Staging"
      elif echo "$content" | grep -qE 'progress\.txt'; then
        current_step="Logging"
      elif echo "$content" | grep -qE 'prd\.json'; then
        current_step="Updating PRD"
      elif echo "$content" | grep -qE 'lint|eslint|biome|prettier'; then
        current_step="Linting"
      elif echo "$content" | grep -qE 'vitest|jest|bun test|npm test|pytest|go test'; then
        current_step="Testing"
      elif echo "$content" | grep -qE '\.test\.|\.spec\.|__tests__|_test\.go'; then
        current_step="Writing tests"
      elif echo "$content" | grep -qE '"tool":"[Ww]rite"|"tool":"[Ee]dit"|"name":"write"|"name":"edit"'; then
        current_step="Implementing"
      elif echo "$content" | grep -qE '"tool":"[Rr]ead"|"tool":"[Gg]lob"|"tool":"[Gg]rep"|"name":"read"|"name":"glob"|"name":"grep"'; then
        current_step="Reading code"
      fi
    fi

    local spinner_char="${spinstr:$spin_idx:1}"
    local step_color=""

    # Color-code steps
    case "$current_step" in
      "Thinking"|"Reading code") step_color="$CYAN" ;;
      "Implementing"|"Writing tests") step_color="$MAGENTA" ;;
      "Testing"|"Linting") step_color="$YELLOW" ;;
      "Staging"|"Committing") step_color="$GREEN" ;;
      *) step_color="$BLUE" ;;
    esac

    # Clear line and show progress
    tput cr 2>/dev/null || printf "\r"
    tput el 2>/dev/null || true
    printf "  %s ${step_color}%-16s${RESET} │ %s ${DIM}[%02d:%02d]${RESET}" \
      "$spinner_char" "$current_step" "$task" "$mins" "$secs"

    spin_idx=$(( (spin_idx + 1) % ${#spinstr} ))
    sleep 0.12
  done
}

# ============================================
# CLEANUP HANDLER
# ============================================

cleanup() {
  local exit_code=$?

  # Kill background processes
  [[ -n "$monitor_pid" ]] && kill "$monitor_pid" 2>/dev/null || true
  [[ -n "$ai_pid" ]] && kill "$ai_pid" 2>/dev/null || true

  # Remove temp file
  [[ -n "$tmpfile" ]] && rm -f "$tmpfile"

  # Kill any remaining child processes
  pkill -P $$ 2>/dev/null || true

  # Show message on interrupt
  if [[ $exit_code -eq 130 ]]; then
    printf "\n"
    log_warn "Interrupted! Cleaned up."
  fi
}

trap cleanup EXIT INT TERM

# ============================================
# ARCHIVE PREVIOUS RUN
# ============================================

if [ -f "$PRD_FILE" ] && [ -f "$LAST_BRANCH_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  LAST_BRANCH=$(cat "$LAST_BRANCH_FILE" 2>/dev/null || echo "")

  if [ -n "$CURRENT_BRANCH" ] && [ -n "$LAST_BRANCH" ] && [ "$CURRENT_BRANCH" != "$LAST_BRANCH" ]; then
    log_info "Archiving previous run: $LAST_BRANCH"
    DATE=$(date +%Y-%m-%d)
    # Strip "ralph/" prefix from branch name for folder
    FOLDER_NAME=$(echo "$LAST_BRANCH" | sed 's|^ralph/||')
    ARCHIVE_FOLDER="$ARCHIVE_DIR/$DATE-$FOLDER_NAME"

    mkdir -p "$ARCHIVE_FOLDER"
    [ -f "$PRD_FILE" ] && cp "$PRD_FILE" "$ARCHIVE_FOLDER/"
    [ -f "$PROGRESS_FILE" ] && cp "$PROGRESS_FILE" "$ARCHIVE_FOLDER/"
    log_success "Archived to: $ARCHIVE_FOLDER"

    # Reset progress file for new run
    echo "# Metis Progress Log" > "$PROGRESS_FILE"
    echo "Started: $(date)" >> "$PROGRESS_FILE"
    echo "---" >> "$PROGRESS_FILE"
  fi
fi

# ============================================
# TRACK CURRENT BRANCH
# ============================================

if [ -f "$PRD_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  if [ -n "$CURRENT_BRANCH" ]; then
    echo "$CURRENT_BRANCH" > "$LAST_BRANCH_FILE"
  fi
fi

# Initialize progress file if it doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
  echo "# Metis Progress Log" > "$PROGRESS_FILE"
  echo "Started: $(date)" >> "$PROGRESS_FILE"
  echo "---" >> "$PROGRESS_FILE"
fi

# ============================================
# START METIS
# ============================================

log_info "Starting Metis (Planning) - Max iterations: $MAX_ITERATIONS"

# Global variables for cleanup
monitor_pid=""
ai_pid=""
tmpfile=""

# ============================================
# MAIN LOOP
# ============================================

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "${BOLD}═══════════════════════════════════════════════════════${RESET}"
  echo "  ${BOLD}Metis Iteration $i of $MAX_ITERATIONS${RESET}"
  echo "${BOLD}═══════════════════════════════════════════════════════${RESET}"

  # Show task progress
  completed=$(count_completed_tasks | tr -d '[:space:]')
  remaining=$(count_remaining_tasks | tr -d '[:space:]')
  completed=${completed:-0}
  remaining=${remaining:-0}
  echo "${DIM}    Completed: $completed | Remaining: $remaining${RESET}"
  echo "--------------------------------------------"

  # Create temp file for AI output monitoring
  tmpfile=$(mktemp)

  # Run opencode in background, capture output to temp file
  log_info "Starting iteration $i..."
  opencode run --agent metis "Start iteration $i" > "$tmpfile" 2>&1 &
  ai_pid=$!

  # Start progress monitor in background
  monitor_progress "$tmpfile" "Iteration $i" &
  monitor_pid=$!

  # Wait for AI process to finish
  wait "$ai_pid" 2>/dev/null || true

  # Stop the progress monitor
  kill "$monitor_pid" 2>/dev/null || true
  wait "$monitor_pid" 2>/dev/null || true
  monitor_pid=""

  # Clear the progress line
  tput cr 2>/dev/null || printf "\r"
  tput el 2>/dev/null || true

  # Read the captured output
  OUTPUT=$(cat "$tmpfile" 2>/dev/null || echo "")

  # Display the output to user
  if [ -n "$OUTPUT" ]; then
    echo ""
    echo "$OUTPUT"
  fi

  # Clean up temp file
  rm -f "$tmpfile"
  tmpfile=""

  # Check for completion signal
  if echo "$OUTPUT" | grep -q "<promise>PLAN COMPLETE</promise>"; then
    echo ""
    log_success "Metis completed the plan!"
    echo "Completed at iteration $i of $MAX_ITERATIONS"
    exit 0
  fi

  log_info "Iteration $i complete. Continuing..."
  sleep 2
done

# ============================================
# MAX ITERATIONS REACHED
# ============================================

echo ""
log_warn "Metis reached max iterations ($MAX_ITERATIONS) without completing all tasks."
log_info "Check $PROGRESS_FILE for status."
exit 1
