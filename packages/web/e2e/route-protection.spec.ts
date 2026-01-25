import { test, expect } from "@playwright/test";

test.describe("Route Protection", () => {
	test.beforeEach(async ({ page }) => {
		// Clear all cookies before each test to ensure no existing session
		await page.context().clearCookies();
	});

	test("should redirect unauthenticated user from /app to /login", async ({ page }) => {
		await page.goto("/app");

		// Should be redirected to login
		await expect(page).toHaveURL("/login");

		// Should see login form
		await expect(page.locator("h1")).toContainText("Welcome Back");
		await expect(page.locator('input[type="email"]')).toBeVisible();
	});

	test("should redirect unauthenticated user from /app/settings to /login", async ({
		page,
	}) => {
		await page.goto("/app/settings");

		// Should be redirected to login
		await expect(page).toHaveURL("/login");

		// Should see login form
		await expect(page.locator("h1")).toContainText("Welcome Back");
	});

	test("should allow navigation to public pages without auth", async ({ page }) => {
		// Landing page
		await page.goto("/");
		await expect(page).toHaveURL("/");
		await expect(page.locator("h1")).toContainText("Renovate Smarter");

		// Login page
		await page.goto("/login");
		await expect(page).toHaveURL("/login");
		await expect(page.locator("h1")).toContainText("Welcome Back");
	});
});
