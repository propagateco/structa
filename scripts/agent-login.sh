#!/usr/bin/env bash
#
# agent-login.sh — authenticate the agent-browser profile behind Structa's
# auth-gated `/app` route, idempotently.
#
# Why this exists:
#   Structa uses better-auth email-OTP login (no password), and `/app`
#   additionally requires the user to have a non-"waitlist" `plan`. This
#   script:
#     1. Opens `/app` with a persistent Chrome profile (`~/.structa-agent`).
#     2. If already authenticated (session cookie valid), exits 0.
#     3. Otherwise walks the email-OTP login flow, reading the OTP straight
#        from the Postgres `verification` table via scripts/get-otp.ts.
#     4. If the freshly-logged-in user lands on `/onboarding` (no plan), it
#        runs scripts/bypass-onboarding.ts once and reloads `/app`.
#
# Prerequisites:
#   - `sst dev` is already running (this repo's convention — agents never
#     start it). scripts/get-otp.ts and scripts/bypass-onboarding.ts use
#     `npx sst shell` to reach the database.
#   - `agent-browser` is on PATH (the dev-browser agent already has it).
#   - First run only: a real human must complete Google's consent screen if
#     you'd rather use OAuth — but this script uses email OTP, so no human
#     step is needed as long as the email below is allowed to sign in.
#
# Usage:
#   ./scripts/agent-login.sh                      # default email + profile
#   AGENT_EMAIL=agent@structa.dev ./scripts/agent-login.sh
#   AGENT_PROFILE=~/.structa-agent ./scripts/agent-login.sh
#   ./scripts/agent-login.sh http://localhost:3000/app   # optional target URL
#
# Exit codes:
#   0  authenticated (profile now holds a valid session cookie)
#   1  unrecoverable failure (see stderr)
#
set -euo pipefail

AGENT_EMAIL="${AGENT_EMAIL:-agent@structa.dev}"
AGENT_PROFILE="${AGENT_PROFILE:-$HOME/.structa-agent}"
TARGET="${1:-http://localhost:3000/app}"
WEB_BASE="${WEB_BASE:-http://localhost:3000}"

# agent-browser command prefix — pass --profile on every invocation so the
# persistent profile (cookies + localStorage) is reused across runs.
AB=(agent-browser --profile "$AGENT_PROFILE")

log() { printf '[agent-login] %s\n' "$*" >&2; }

current_url() { "${AB[@]}" get url; }

# Run a repo helper under `sst shell` (reads from the live dev DB).
with_sst() { npx sst shell npx tsx "$@"; }

# Ensure the test user has a real plan so /app admits them. Idempotent.
ensure_plan() {
	log "Ensuring user $AGENT_EMAIL has a non-waitlist plan…"
	if with_sst "scripts/bypass-onboarding.ts" "$AGENT_EMAIL" \
		| grep -q "onboarding bypassed"; then
		log "Plan set (pro)."
	else
		log "bypass-onboarding produced no success line — continuing anyway."
	fi
}

# ----------------------------------------------------------------------
# 1. Try the happy path: already authenticated.
# ----------------------------------------------------------------------
log "Opening $TARGET with profile $AGENT_PROFILE …"
"${AB[@]}" open "$TARGET" >/dev/null
# Give TanStack Start a moment to run the beforeLoad redirect (unauthed → /login).
"${AB[@]}" wait --load networkidle >/dev/null 2>&1 || true
URL="$(current_url)"

case "$URL" in
	*/app)
		log "Already authenticated (URL=$URL)."
		exit 0
		;;
	*/login*)
		log "Not authenticated (URL=$URL). Starting email-OTP login…"
		;;
	*/onboarding*)
		log "Authenticated but needs a plan (URL=$URL)."
		ensure_plan
		"${AB[@]}" open "$TARGET" >/dev/null
		"${AB[@]}" wait --load networkidle >/dev/null 2>&1 || true
		URL="$(current_url)"
		case "$URL" in
			*/app) log "Plan applied; now on /app."; exit 0 ;;
			*) log "Unexpected URL after onboarding fix: $URL"; exit 1 ;;
		esac
		;;
	*)
		log "Unexpected URL after open: $URL"; exit 1
		;;
esac

# ----------------------------------------------------------------------
# 2. Email step on /login.
# ----------------------------------------------------------------------
# On /login the page may already be at /login (no email submitted) or at
# /login/code (email already submitted in a previous interrupted run).
if [[ "$URL" == *"/login/code"* ]]; then
	log "Resuming at /login/code (email already submitted)…"
else
	log "Filling email ($AGENT_EMAIL) and submitting…"
	"${AB[@]}" snapshot -i >/dev/null
	"${AB[@]}" find placeholder "Enter your email" fill "$AGENT_EMAIL" >/dev/null
	"${AB[@]}" find role button click --name "Continue with Email" >/dev/null
	# Submitting sends the OTP via SES AND stores it in the `verification`
	# table (better-auth emailOTP stores the value as plaintext). We read it
	# from the DB, so email delivery is irrelevant.
	if ! "${AB[@]}" wait --url "**/login/code" >/dev/null 2>&1; then
		log "Did not reach /login/code. Current URL: $(current_url)"
		exit 1
	fi
fi

# ----------------------------------------------------------------------
# 3. Fetch the OTP from the database and type it.
# ----------------------------------------------------------------------
log "Fetching latest OTP from the database…"
OTP="$(with_sst "scripts/get-otp.ts" "$AGENT_EMAIL" | tail -n 1 | tr -d '[:space:]')"
if [[ -z "$OTP" || "${#OTP}" -lt 6 ]]; then
	log "No usable OTP found for $AGENT_EMAIL (got '$OTP')."
	log "Hint: ensure sst dev is running and the email form was submitted."
	exit 1
fi
log "Got OTP (${#OTP} chars). Typing into the OTP input…"

# The shadcn InputOTP renders one composite input: input[data-input-otp-input].
# Typing 6 digits triggers verify-code-form's auto-submit effect.
OTP_INPUT='input[data-input-otp-input="true"]'
if ! "${AB[@]}" fill "$OTP_INPUT" "$OTP" >/dev/null 2>&1; then
	# Fallback: focus via snapshot ref then send raw keystrokes.
	log "CSS fill failed; falling back to focus + keyboard type…"
	"${AB[@]}" snapshot -i >/dev/null
	"${AB[@]}" focus "$OTP_INPUT" >/dev/null 2>&1 || true
	"${AB[@]}" keyboard type "$OTP" >/dev/null 2>&1 || true
fi

# Auto-submit navigates to /app (plan set) or /onboarding (no plan yet).
"${AB[@]}" wait --load networkidle >/dev/null 2>&1 || true
URL="$(current_url)"
case "$URL" in
	*/app) log "Authenticated; now on /app."; exit 0 ;;
	*/onboarding*)
		log "On /onboarding — applying plan and reloading /app…"
		ensure_plan
		"${AB[@]}" open "$TARGET" >/dev/null
		"${AB[@]}" wait --load networkidle >/dev/null 2>&1 || true
		URL="$(current_url)"
		case "$URL" in
			*/app) log "Plan applied; now on /app."; exit 0 ;;
			*) log "Failed to reach /app after onboarding fix (URL=$URL)."; exit 1 ;;
		esac
		;;
	*/login*)
		log "Still on a login URL after OTP ($URL). OTP may have expired — retry once…"
		OTP2="$(with_sst "scripts/get-otp.ts" "$AGENT_EMAIL" | tail -n 1 | tr -d '[:space:]')"
		[[ -n "$OTP2" ]] && "${AB[@]}" fill "$OTP_INPUT" "$OTP2" >/dev/null 2>&1 || true
		"${AB[@]}" wait --load networkidle >/dev/null 2>&1 || true
		URL="$(current_url)"
		case "$URL" in
			*/app) log "Authenticated on retry."; exit 0 ;;
			*) log "Login failed (URL=$URL)."; exit 1 ;;
		esac
		;;
	*) log "Unexpected URL after OTP: $URL"; exit 1 ;;
esac