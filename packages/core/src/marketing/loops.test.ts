/**
 * Loops Marketing Integration Tests
 *
 * Tests the Loops SDK integration for contact creation and event tracking.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Define mock functions that will be used in tests
const mockUpdateContact = vi.hoisted(() => vi.fn());
const mockSendEvent = vi.hoisted(() => vi.fn());
const mockTestApiKey = vi.hoisted(() => vi.fn());
const mockFindContact = vi.hoisted(() => vi.fn());

// Mock the Loops SDK
vi.mock("loops", () => {
	// Mock error classes that match the SDK's interface
	class MockAPIError extends Error {
		json: Record<string, unknown> | null;
		statusCode: number;
		rawBody?: string;

		constructor(
			statusCode: number,
			json: Record<string, unknown> | null,
			rawBody?: string,
		) {
			super("API Error");
			this.json = json;
			this.statusCode = statusCode;
			this.rawBody = rawBody;
			this.name = "APIError";
		}
	}

	class MockRateLimitExceededError extends Error {
		limit: number;
		remaining: number;

		constructor(limit: number, remaining: number) {
			super("Rate limit exceeded");
			this.limit = limit;
			this.remaining = remaining;
			this.name = "RateLimitExceededError";
		}
	}

	return {
		LoopsClient: vi.fn(() => ({
			updateContact: mockUpdateContact,
			sendEvent: mockSendEvent,
			testApiKey: mockTestApiKey,
			findContact: mockFindContact,
		})),
		APIError: MockAPIError,
		RateLimitExceededError: MockRateLimitExceededError,
	};
});

// Mock SST Resource
vi.mock("sst", () => ({
	Resource: {
		LoopsApiKey: {
			value: "test-api-key-12345",
		},
	},
}));

// Import after mocking
import {
	createContactInLoops,
	findContactInLoops,
	sendEventInLoops,
	testLoopsApiKey,
} from "./loops";

describe("Loops Integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.spyOn(console, "log").mockImplementation(() => {});
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("createContactInLoops", () => {
		it("should successfully create/update a contact", async () => {
			mockUpdateContact.mockResolvedValueOnce({
				success: true,
				id: "contact-123",
			});

			const result = await createContactInLoops({
				email: "test@example.com",
				userId: "user-456",
				firstName: "John",
				lastName: "Doe",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe("contact-123");
				expect(result.data.email).toBe("test@example.com");
			}

			// Verify updateContact was called with correct parameters
			expect(mockUpdateContact).toHaveBeenCalledWith({
				email: "test@example.com",
				userId: "user-456",
				properties: {
					firstName: "John",
					lastName: "Doe",
				},
				mailingLists: undefined,
			});
		});

		it("should handle API errors", async () => {
			const { APIError } = await import("loops");
			mockUpdateContact.mockRejectedValueOnce(
				new APIError(400, {
					success: false,
					message: "The email address is not valid",
				} as any),
			);

			const result = await createContactInLoops({
				email: "invalid-email",
				userId: "user-456",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain("email address is not valid");
			}
		});

		it("should handle unauthorized errors", async () => {
			const { APIError } = await import("loops");
			mockUpdateContact.mockRejectedValueOnce(
				new APIError(401, { error: "Invalid API key" } as any),
			);

			const result = await createContactInLoops({
				email: "test@example.com",
				userId: "user-456",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain("Invalid API key");
			}
		});

		it("should handle rate limit errors", async () => {
			const { RateLimitExceededError } = await import("loops");
			mockUpdateContact.mockRejectedValueOnce(
				new RateLimitExceededError(10, 0),
			);

			const result = await createContactInLoops({
				email: "test@example.com",
				userId: "user-456",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain("Rate limit exceeded");
			}
		});

		it("should include optional fields when provided", async () => {
			mockUpdateContact.mockResolvedValueOnce({
				success: true,
				id: "contact-123",
			});

			await createContactInLoops({
				email: "test@example.com",
				userId: "user-456",
				firstName: "Jane",
				lastName: "Smith",
				properties: {
					source: "test",
					tier: 1,
				},
				mailingLists: {
					newsletter: true,
					updates: false,
				},
			});

			expect(mockUpdateContact).toHaveBeenCalledWith({
				email: "test@example.com",
				userId: "user-456",
				properties: {
					source: "test",
					tier: 1,
					firstName: "Jane",
					lastName: "Smith",
				},
				mailingLists: {
					newsletter: true,
					updates: false,
				},
			});
		});

		it("should handle network errors", async () => {
			mockUpdateContact.mockRejectedValueOnce(
				new Error("Network error: Failed to connect"),
			);

			const result = await createContactInLoops({
				email: "test@example.com",
				userId: "user-456",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain("Network error");
			}
		});
	});

	describe("sendEventInLoops", () => {
		it("should successfully send an event", async () => {
			mockSendEvent.mockResolvedValueOnce({ success: true });

			const result = await sendEventInLoops({
				eventName: "user_signup",
				email: "test@example.com",
				userId: "user-456",
			});

			expect(result.success).toBe(true);

			expect(mockSendEvent).toHaveBeenCalledWith({
				eventName: "user_signup",
				email: "test@example.com",
				userId: "user-456",
				eventProperties: undefined,
				contactProperties: undefined,
				mailingLists: undefined,
			});
		});

		it("should handle event API failures", async () => {
			const { APIError } = await import("loops");
			mockSendEvent.mockRejectedValueOnce(
				new APIError(404, {
					success: false,
					message: "The specified event does not exist",
				} as any),
			);

			const result = await sendEventInLoops({
				eventName: "invalid_event",
				email: "test@example.com",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain("event does not exist");
			}
		});
	});

	describe("testLoopsApiKey", () => {
		it("should return team name when API key is valid", async () => {
			mockTestApiKey.mockResolvedValueOnce({
				success: true,
				teamName: "Test Team",
			});

			const result = await testLoopsApiKey();

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.teamName).toBe("Test Team");
			}
		});

		it("should handle invalid API key", async () => {
			const { APIError } = await import("loops");
			mockTestApiKey.mockRejectedValueOnce(
				new APIError(401, { error: "Invalid API key" } as any),
			);

			const result = await testLoopsApiKey();

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toContain("Invalid API key");
			}
		});
	});

	describe("findContactInLoops", () => {
		it("should return contact when found", async () => {
			mockFindContact.mockResolvedValueOnce([
				{
					id: "contact-123",
					email: "test@example.com",
					firstName: "John",
					userId: "user-456",
				},
			]);

			const result = await findContactInLoops({ email: "test@example.com" });

			expect(result.success).toBe(true);
			if (result.success && result.data) {
				expect(result.data.id).toBe("contact-123");
				expect(result.data.email).toBe("test@example.com");
			}
		});

		it("should return null when contact not found", async () => {
			mockFindContact.mockResolvedValueOnce([]);

			const result = await findContactInLoops({ userId: "nonexistent" });

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBeNull();
			}
		});
	});
});
