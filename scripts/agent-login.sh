#!/usr/bin/env bash
#
# agent-login.sh — authenticate the agent-browser profile behind Structa's
# auth-gated `/app` route, idempotently.
#
# Two modes:
#
#   OTP mode (default) — for local dev against a running `sst dev`:
#     Structa uses better-auth email-OTP login (no password), and `/app`
#     additionally requires the user to have a non-"waitlist" `plan`. This
#     mode:
#       1. Opens `/app` with a persistent Chrome profile (`~/.structa-agent`).
#       2. If already authenticated (session cookie valid), exits 0.
#       3. Otherwise walks the email-OTP login flow, reading the OTP straight
#          from the Postgres `verification` table via scripts/get-otp.ts.
#       4. If the freshly-logged-in user lands on `/onboarding` (no plan), it
#          runs scripts/bypass-onboarding.ts once and reloads `/app`.
#     Requires `sst dev` to be running (this repo's convention — agents never
#     start it); get-otp.ts and bypass-onboarding.ts use `npx sst shell` to
#     reach the database.
#
#   Bot mode (--bot) — for PR preview environments (no local DB, no OTP):
#     POSTs the dev-only /api/auth/bot-login endpoint as the bot user
#     (agent@structa.dev), replays the session cookie into the profile, then
#     opens /app. No sst dev and no database access needed.
#       ./scripts/agent-login.sh --bot https://pr-123.dev.structa.so
#
# Prerequisites:
#   - `agent-browser` is on PATH (the dev-browser agent already has it).
#   - First run only (OTP mode): a real human must complete Google's consent
#     screen if you'd rather use OAuth — but this script uses email OTP, so no
#     human step is needed as long as the email below is allowed to sign in.
#
# Usage:
#   ./scripts/agent-login.sh                          # OTP mode, localhost
#   ./scripts/agent-login.sh http://localhost:3000/app   # OTP mode, custom target
#   ./scripts/agent-login.sh --bot <preview-url>      # bot-login against a preview
#   AGENT_EMAIL=agent@structa.dev ./scripts/agent-login.sh
#   AGENT_PROFILE=~/.structa-agent ./scripts/agent-login.sh
#
# Exit codes:
#   0  authenticated (profile now holds a valid session cookie)
#   1  unrecoverable failure (see stderr)
#
set -euo pipefail

AGENT_EMAIL="${AGENT_EMAIL:-agent@structa.dev}"
AGENT_PROFILE="${AGENT_PROFILE:-$HOME/.structa-agent}"

usage() {
	cat >&2 <<'EOF'
Usage:
  ./scripts/agent-login.sh [target-url]          OTP login (default: http://localhost:3000/app)
  ./scripts/agent-login.sh --bot <preview-url>   bot-login against a PR preview (no OTP / DB)

Environment:
  AGENT_EMAIL     bot/test user email (default: agent@structa.dev)
  AGENT_PROFILE   Chrome profile dir (default: ~/.structa-agent)
EOF
}

# Parse flags: --bot <url> consumes the preview URL; anything else is the
# OTP-mode positional target.
BOT_MODE=false
BOT_URL=""
while [[ $# -gt 0 ]]; do
	case "$1" in
		--bot)
			BOT_MODE=true
			shift
			if [[ $# -eq 0 ]]; then
				usage
				exit 1
			fi
			BOT_URL="$1"
			shift
			;;
		-h | --help)
			usage
			exit 0
			;;
		*)
			break
			;;
	esac
done

TARGET="${1:-http://localhost:3000/app}"
WEB_BASE="${WEB_BASE:-http://localhost:3000}"

# agent-browser command prefix — pass --profile on every invocation so the
# persistent profile (cookies + localStorage) is reused across runs.
AB=(agent-browser --profile "$AGENT_PROFILE")

log() { printf '[agent-login] %s\n' "$*" >&2; }

current_url() { "${AB[@]}" get url; }

# Navigate to a URL and wait for the page to settle. `tab new` (rather than
# `open`) is used so the new tab becomes active even when the persistent
# profile restores tabs from a previous browser session.
navigate() {
	"${AB[@]}" tab new "$1" >/dev/null
	"${AB[@]}" wait --load networkidle >/dev/null 2>&1 || true
}

# ----------------------------------------------------------------------
# Bot mode: login against a PR preview via the dev-only bot-login endpoint.
# ----------------------------------------------------------------------
bot_login() {
	local base host
	base="${BOT_URL%/}"
	base="$(printf '%s' "$base" | sed -E 's#^(https?://[^/]+).*#\1#')"
	if [[ ! "$base" =~ ^https?:// ]]; then
		log "Invalid preview URL: $BOT_URL"
		return 1
	fi
	host="$(printf '%s' "$base" | sed -E 's#^https?://##; s#/.*##')"
	local target="$base/app"

	log "Bot mode against $base (email: $AGENT_EMAIL)…"

	# 1. Happy path: already authenticated.
	local url
	navigate "$target"
	url="$(current_url)"
	case "$url" in
		*/app)
			log "Already authenticated (URL=$url)."
			return 0
			;;
		*/login*)
			log "Not authenticated (URL=$url). Logging in via bot-login…"
			;;
		*/onboarding*)
			log "Bot user has no plan (URL=$url). Seed $AGENT_EMAIL with a plan in the dev DB."
			return 1
			;;
		*)
			log "Unexpected URL after open: $url"
			return 1
			;;
	esac

	# 2. POST the dev-only bot-login endpoint. Headers are captured to a temp
	#    file so the session cookie can be replayed into the profile; the body
	#    is kept for error messages. Cookie values are never echoed.
	local headers body code
	headers="$(mktemp)"
	body="$(mktemp)"
	trap 'rm -f "$headers" "$body"' RETURN
	code="$(curl -sS -o "$body" -D "$headers" -w '%{http_code}' \
		-X POST "$base/api/auth/bot-login" \
		-H 'Content-Type: application/json' \
		--data "{\"email\":\"$AGENT_EMAIL\"}")"

	if [[ "$code" == "404" ]]; then
		log "bot-login returned 404 — the endpoint is dev-only and disabled on this stage."
		return 1
	fi
	if [[ "$code" != "2"* ]]; then
		log "bot-login failed (HTTP $code): $(tr -d '\r\n' < "$body" | head -c 300)"
		return 1
	fi

	# 3. Replay every Set-Cookie from the response into the profile.
	#    `--secure`/`--sameSite None` are only valid on https origins (CDP
	#    rejects Secure cookies set from http://); previews are always https.
	local domain_attr="" line cookie name value
	local cookie_flags=(--path / --httpOnly)
	if [[ "$base" == https* ]]; then
		cookie_flags+=(--secure --sameSite None)
	fi
	while IFS= read -r line; do
		line="${line%%$'\r'*}"
		[[ "$line" =~ ^[Ss]et-[Cc]ookie:[[:space:]]*(.*)$ ]] || continue
		cookie="${BASH_REMATCH[1]}"
		name="${cookie%%=*}"
		# Keep only RFC 6265 token chars that cookie names actually use
		# (blocking whitespace/quotes/semicolons as injection hygiene).
		name="${name//[^a-zA-Z0-9._-]/}"
		value="${cookie#*=}"
		value="${value%%;*}"
		[[ -n "$name" && -n "$value" ]] || continue
		if [[ "$cookie" =~ [Dd]omain=([^;]+) ]]; then
			domain_attr="${BASH_REMATCH[1]}"
		fi
		if [[ -n "$domain_attr" ]]; then
			"${AB[@]}" cookies set "$name" "$value" \
				--domain "$domain_attr" "${cookie_flags[@]}" >/dev/null
		else
			"${AB[@]}" cookies set "$name" "$value" \
				--url "$base" "${cookie_flags[@]}" >/dev/null
		fi
		log "Cookie '$name' replayed into profile."
	done < "$headers"

	# 4. Verify the session is accepted.
	navigate "$target"
	url="$(current_url)"
	case "$url" in
		*/app)
			log "Authenticated as $AGENT_EMAIL; now on /app."
			return 0
			;;
		*/onboarding*)
			log "Authenticated but needs a plan (URL=$url). Seed $AGENT_EMAIL with a plan in the dev DB."
			return 1
			;;
		*)
			log "Session not accepted (URL=$url)."
			return 1
			;;
	esac
}

if $BOT_MODE; then
	if [[ $# -gt 0 ]]; then
		usage
		exit 1
	fi
	bot_login
	exit $?
fi

# ----------------------------------------------------------------------
# OTP mode below (requires sst dev).
# ----------------------------------------------------------------------

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
navigate "$TARGET"
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
		navigate "$TARGET"
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
		navigate "$TARGET"
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
