import { test, expect } from "@playwright/test";

test.describe("Authentication Flows", () => {
	test.beforeEach(async ({ page }) => {
		// Clear all cookies before each test
		await page.context().clearCookies();
	});

	test("should navigate to login from landing page", async ({ page }) => {
		await page.goto("/");

		// Click "Get Started" button
		await page.click('button:has-text("Get Started")');

		// Should be on login page
		await expect(page).toHaveURL("/login");
		await expect(page.locator("h1")).toContainText("Welcome Back");
	});

	test("should send OTP to email", async ({ page }) => {
		await page.goto("/login");

		// Enter email
		await page.fill('input[type="email"]', "test@example.com");

		// Click send code button
		await page.click('button:has-text("Send Code")');

		// Should show success message and redirect to /login/code
		await expect(page.locator('text=Code sent to your email!')).toBeVisible();
		await expect(page).toHaveURL(/\/login\/code/);
	});

	test("should show validation error when email is empty", async ({ page }) => {
		await page.goto("/login");

		// Click send code without entering email
		await page.click('button:has-text("Send Code")');

		// Button should be disabled
		const sendButton = page.locator('button:has-text("Send Code")');
		await expect(sendButton).toBeDisabled();
	});

	test("should allow resend code from verification page", async ({ page }) => {
		await page.goto("/login");

		// Enter email and send code
		await page.fill('input[type="email"]', "test@example.com");
		await page.click('button:has-text("Send Code")');
		await page.waitForURL(/\/login\/code/);

		// Click resend code
		await page.click('button:has-text("Resend code")');

		// Should show success message
		await expect(page.locator('text=New code sent to your email!')).toBeVisible();
	});

	test("should show validation when OTP is incomplete", async ({ page }) => {
		await page.goto("/login/code?email=test@example.com");

		// Try to verify with incomplete OTP
		const verifyButton = page.locator('button:has-text("Verify & Sign In")');
		await expect(verifyButton).toBeDisabled();
	});

	test("should show Google OAuth button", async ({ page }) => {
		await page.goto("/login");

		// Google button should be visible
		await expect(page.locator('button:has-text("Google")')).toBeVisible();
	});

	test("should redirect to login if email is missing from verification URL", async ({
		page,
	}) => {
		await page.goto("/login/code");

		// Should redirect to login with error
		await expect(page).toHaveURL("/login");
		// Note: Toast error might not be visible due to redirect
	});

	test("should navigate back to home from login", async ({ page }) => {
		await page.goto("/login");

		// Click back to home
		await page.click('button:has-text("Back to home")');

		// Should be on landing page
		await expect(page).toHaveURL("/");
		await expect(page.locator("h1")).toContainText("Renovate Smarter");
	});
});
