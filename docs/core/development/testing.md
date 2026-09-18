# Testing Philosophy (TDD)

This document describes Test-Driven Development approach used in Structa monorepo.

## Contents

- [TDD Workflow](#tdd-workflow)
- [Test Organization](#test-organization)
- [Test Guidelines](#test-guidelines)
- [Browser Automation Testing](#browser-automation-testing)
- [Interactive UI Testing in PR Previews](#interactive-ui-testing-in-pr-previews)
- [Report findings as a PR comment](#3-report-findings-as-a-pr-comment)
- [Related Documentation](#related-documentation)

---

## TDD Workflow

This project follows **Test-Driven Development (TDD)** principles.

When implementing new features or fixing bugs:

1. **Write the test first** – Before writing any implementation code, write a failing test that describes the expected behavior.
2. **Run the test** – Verify that it fails (red).
3. **Write minimal implementation** – Write just enough code to make the test pass.
4. **Run the test again** – Verify that it now passes (green).
5. **Refactor** – Clean up the code while keeping tests green.
6. **Repeat** – Add more tests as needed to cover edge cases and requirements.

---

## Test Organization

Tests are organized alongside source code:

```
packages/
├── core/
│   ├── src/
│   │   ├── image/
│   │   │   └── image.service.ts
│   │   └── test-setup.ts        # Global test setup
│   └── vitest.config.ts        # Vitest configuration
└── web/
    └── src/
        └── components/
            └── __tests__/       # Component tests
                └── Button.test.tsx
```

---

## Test Guidelines

- **Unit Tests**: Test pure functions, business logic, and data transformations (especially in `packages/core`).
- **Integration Tests**: Test interactions between components and modules.
- **Component Tests**: Test React components for UI behavior and user interactions.
- **Coverage**: Aim for high coverage on critical business logic and utility functions.
- **Test Isolation**: Each test should be independent and not rely on other tests.

---

## Browser Automation Testing

For testing authenticated routes (like `/app`) using Chrome DevTools MCP or similar browser automation tools, use the real login flow with database OTP lookup.

### Prerequisites

1. **SST dev mode running**:
   ```bash
   npx sst dev --mode=mono
   ```

2. **Test email address** - Any email (OTP is read from database, so email delivery doesn't matter)

### OTP Lookup Script

A script is provided to retrieve OTP codes from the database:

```bash
npx sst shell npx tsx scripts/get-otp.ts <email>
```

Example:
```bash
npx sst shell npx tsx scripts/get-otp.ts test@example.com
```

### Automated Login Workflow

When using Chrome DevTools MCP to test authenticated routes:

| Step | Action | Command |
|------|--------|---------|
| 1 | Navigate to login | `navigate_page({ url: "https://localhost:3010/login" })` |
| 2 | Get page snapshot | `take_snapshot()` to find email input UID |
| 3 | Enter email | `fill({ uid: "<email-input-uid>", value: "test@example.com" })` |
| 4 | Submit form | `click({ uid: "<continue-button-uid>" })` |
| 5 | Wait for code page | `wait_for({ text: ["verify your email"] })` |
| 6 | **Get OTP from DB** | Run: `npx sst shell npx tsx scripts/get-otp.ts test@example.com` |
| 7 | Enter OTP | `type_text({ text: "<otp-code>" })` - auto-submits on 6 digits |
| 8 | Wait for dashboard | `wait_for({ text: ["Dashboard"] })` |

### Notes

- **OTP Expiry**: OTPs expire after some time (check `verification.expiresAt` if issues)
- **Multiple OTPs**: Script fetches the most recent one
- **Session Persistence**: Once logged in, session cookies persist
- **Test User Plan**: Users without a `plan` or with `plan: "waitlist"` redirect to onboarding

### agent-browser workflow (dev-browser agent)

The same login flow is automated end-to-end by [`scripts/agent-login.sh`](../../scripts/agent-login.sh), which drives `agent-browser` with a **persistent Chrome profile** (`~/.structa-agent`) and reads the OTP straight from the database via `scripts/get-otp.ts`. It is idempotent: if the profile already holds a valid session it exits 0 with no login; otherwise it walks email-OTP, applies `bypass-onboarding.ts` if it lands on `/onboarding`, and reloads `/app`.

```bash
# One command — run from the repo root while `sst dev` is up:
./scripts/agent-login.sh                       # authenticates, then exits on /app

# Subsequent UI-agent work reuses the same profile (already authenticated):
agent-browser --profile ~/.structa-agent open https://localhost:3010/app
agent-browser --profile ~/.structa-agent snapshot -i
```

Manual equivalent (what the script does internally):

| Step | Action | Command |
|------|--------|---------|
| 1 | Open login (persisted profile) | `agent-browser --profile ~/.structa-agent open https://localhost:3010/app` |
| 2 | (If bounced to /login) snapshot | `agent-browser --profile ~/.structa-agent snapshot -i` |
| 3 | Enter email | `agent-browser --profile ~/.structa-agent find placeholder "Enter your email" fill "agent@structa.dev"` |
| 4 | Click continue | `agent-browser --profile ~/.structa-agent find role button click --name "Continue with Email"` |
| 5 | Get OTP from DB | `OTP=$(npx sst shell npx tsx scripts/get-otp.ts agent@structa.dev)` |
| 6 | Enter OTP (auto-submits at 6 digits) | `agent-browser --profile ~/.structa-agent fill 'input[data-input-otp-input="true"]' "$OTP"` |
| 7 | If on /onboarding, apply plan + reload | `npx sst shell npx tsx scripts/bypass-onboarding.ts agent@structa.dev` then `open /app` |

Notes:
- **Profile survives restarts (OTP mode)** — Chrome flushes the session cookie to disk, so repeat logins are *not* needed until the better-auth session expires (~7d). **Bot mode (PR previews):** CDP-set cookies do not persist across `agent-browser close` — re-run `agent-login.sh --bot` after each browser restart (idempotent, ~10s).
- **`input-otp`** renders one composite input (`input[data-input-otp-input="true"]`); `fill`-ing 6 chars triggers `verify-code-form`'s auto-submit effect.
- **Don't commit session state** — the profile lives at `~/.structa-agent` (outside the repo). Never copy it into the repo or commit it.

---

## Interactive UI Testing in PR Previews

When a PR's preview environment is deployed (CI comments the URLs), test the
changes **in the browser** before considering the work done. This is the
validation step that completes acceptance criteria. It applies to the
dev-browser subagent, the frontend-ui-ux-engineer agent, or any agent with
bash access.

### 1. Authenticate the agent-browser profile (bot login)

No OTP or DB access needed on previews — the dev-only bot-login endpoint
creates a session for the bot user (`agent@structa.dev`):

```bash
./scripts/agent-login.sh --bot https://pr-<N>.dev.structa.so
```

This replays a session cookie into the persistent profile (`~/.structa-agent`).
Subsequent agent-browser commands reuse it within the same daemon lifetime.
Bot-mode cookies don't survive `agent-browser close` — re-run `agent-login.sh
--bot` after each browser restart (see
[worktrees.md — Bot Authentication](./worktrees.md)):

```bash
agent-browser --profile ~/.structa-agent open https://pr-<N>.dev.structa.so/app
```

### 2. The verification checklist

Test the changed behavior against the PR's described changes and acceptance
criteria using **all four evidence channels**:

| Channel | Command | What to look for |
|---------|---------|------------------|
| **UI elements** | `snapshot -i`, then `click @e1` / `fill @e2 "text"` | Expected UI exists, is interactive, and behaves per the acceptance criteria |
| **Screenshots** | `screenshot <path>.png` (`--full` for full page) | Visual correctness: layout, spacing, empty/loading/error states; check at least one narrow viewport too |
| **Console logs** | `console` | No uncaught errors, React warnings, or console-level failures |
| **Network logs** | `network requests`; record flows with `network har start` → act → `network har stop <file>.har` | Requests succeed (2xx/3xx), expected endpoints are called, no unexpected 4xx/5xx, websockets/SSE connect |

Working loop:

1. `open` the target URL — start at the changed route, then follow the user journey.
2. `snapshot -i` → interact via refs → **re-snapshot after every page change**.
3. Screenshot key states (initial, filled, submitted, error).
4. Run `console` after each major interaction and `network requests` at the end.
5. If anything looks wrong, capture it: screenshot + `network har` capture + the
   exact console/network output, then reproduce in isolation if possible.

### 3. Report findings as a PR comment

After testing, post a structured validation comment on the PR. This is how
acceptance criteria get closed and how failures are handed off to another
developer:

```bash
gh pr comment <N> --body-file /tmp/validation.md
```

Template:

```markdown
## Browser Validation (agent-browser)
**Stage:** pr-<N> · **URL:** https://pr-<N>.dev.structa.so

**Status:** ✅ Pass / ⚠️ Partial / ❌ Fail

### Acceptance criteria
- [x] AC-1 — <criterion> (verified: screenshot `…/page.png`, interacted with …)
- [ ] AC-2 — <criterion> **FAILED** — <what happened>

### Evidence
- **Screenshots:** <paths>
- **Console:** clean / <errors found>
- **Network:** <summary, e.g. all 2xx; one failed POST /api/x → 500>

### Issues found (for a developer to pick up)
- **Issue 1:** <what's wrong>
  - Repro: <steps>
  - Evidence: <console/network output, screenshot path>
  - Suggested next step: <one-liner>
```

Rules:

- **Be evidence-based** — attach screenshots and paste console/network output,
  not just "it works" / "it's broken".
- **Never close a story that touches UI without browser validation.**
- **If something is not right, flag it** — mark the affected acceptance
  criteria as failing and describe the issue with reproduction steps. Do not
  silently fix unrelated problems or expand scope; leave a clear handoff for
  another developer to pick up.
- If the dev-browser **subagent** did the testing, it returns its findings to
  the orchestrating agent, who posts the comment (the subagent itself is
  read-only for bash).

---

## Related Documentation

| Topic | Document |
|-------|----------|
| Coding style for tests | [coding_style.md](./coding_style.md) |
| Tech stack (Vitest) | [../architecture/tech_stack.md](../architecture/tech_stack.md) |
