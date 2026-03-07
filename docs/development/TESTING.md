# Testing Philosophy (TDD)

This document describes Test-Driven Development approach used in Structa monorepo.

## Contents

- [TDD Workflow](#tdd-workflow)
- [Test Organization](#test-organization)
- [Test Guidelines](#test-guidelines)
- [Browser Automation Testing](#browser-automation-testing)
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
| 1 | Navigate to login | `navigate_page({ url: "http://localhost:3000/login" })` |
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

---

## Related Documentation

| Topic | Document |
|-------|----------|
| Quality tools (test commands) | [QUALITY_TOOLS.md](./QUALITY_TOOLS.md) |
| Coding style for tests | [CODING_STYLE.md](./CODING_STYLE.md) |
| Tech stack (Vitest) | [../stack/TECH_STACK.md](../stack/TECH_STACK.md) |
