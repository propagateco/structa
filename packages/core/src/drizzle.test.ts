/**
 * Database Connection Tests
 *
 * Tests the Drizzle ORM connection configuration using the Neon HTTP driver.
 * This verifies that the connection is properly configured for AWS Lambda.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the neon function to return a SQL query function
const mockSqlFunction = vi.fn();
const mockNeon = vi.hoisted(() => vi.fn(() => mockSqlFunction));

// Mock @neondatabase/serverless
vi.mock("@neondatabase/serverless", () => ({
	neon: mockNeon,
}));

// Mock SST Resource
vi.mock("sst", () => ({
	Resource: {
		Database: {
			url: "postgresql://test:test@localhost:5432/test",
		},
	},
}));

describe("Database Connection", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should call neon with the database URL", async () => {
		// Clear module cache to get fresh import
		vi.resetModules();

		// Import the module to trigger the connection setup
		await import("./drizzle");

		expect(mockNeon).toHaveBeenCalledWith(
			"postgresql://test:test@localhost:5432/test",
		);
	});

	it("should export a db instance with expected methods", async () => {
		// Clear module cache to get fresh import
		vi.resetModules();

		const { db } = await import("./drizzle");

		expect(db).toBeDefined();
		expect(db).toHaveProperty("select");
		expect(db).toHaveProperty("insert");
		expect(db).toHaveProperty("update");
		expect(db).toHaveProperty("delete");
	});
});
