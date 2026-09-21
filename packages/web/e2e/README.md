# E2E Tests for @structa/web

This directory contains end-to-end tests for the web package using Playwright.

## Running Tests

### Prerequisites

Before running E2E tests, ensure the development server is running:

```bash
# From the root directory
npx sst dev --mode=mono
```

This will start the web server at `https://localhost:3010` (via Caddy HTTP/2 proxy).

### Run all tests

```bash
npm run test
```

### Run tests with UI

```bash
npm run test:ui
```

This opens the Playwright Test UI where you can:
- Select which tests to run
- View test results with screenshots
- Debug tests step-by-step

### Debug a specific test

```bash
npm run test:debug
```

This runs tests with the Playwright Inspector for debugging.

## Test Files

- `route-protection.spec.ts` - Tests that protected routes redirect unauthenticated users
- `auth-flows.spec.ts` - Tests authentication flows (login, OTP verification, navigation)

## Test Configuration

The Playwright configuration is in `playwright.config.ts` at the root of the web package.

Tests run against multiple browsers:
- Chromium
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- Microsoft Edge
- Google Chrome

## Writing New Tests

1. Create a new `.spec.ts` file in this directory
2. Import the test utilities:
   ```typescript
   import { test, expect } from "@playwright/test";
   ```
3. Use the test describe pattern:
   ```typescript
   test.describe("Feature Name", () => {
     test.beforeEach(async ({ page }) => {
       // Setup before each test
       await page.context().clearCookies();
     });

     test("should do something", async ({ page }) => {
       // Test implementation
       await page.goto("/");
       await expect(page).toHaveURL("/");
     });
   });
   ```

## CI/CD

Tests will run in CI with retries enabled. Failed tests will generate HTML reports with screenshots and traces for debugging.
