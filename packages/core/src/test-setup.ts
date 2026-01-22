import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";

// Global test setup for packages/core
// This runs before all tests in the core package

beforeAll(async () => {
	// Setup: Initialize test database connection, seed data, etc.
	console.log("Setting up test environment for @structa/core");
});

beforeEach(async () => {
	// Setup before each test
});

afterEach(async () => {
	// Cleanup after each test
});

afterAll(async () => {
	// Cleanup: Close database connections, clear test data, etc.
	console.log("Cleaning up test environment for @structa/core");
});
