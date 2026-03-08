/**
 * Tests for tRPC Users Router
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock SST Resource first
vi.mock("sst", () => ({
	Resource: {
		BetterAuthSecret: { value: "test-auth-secret" },
		GoogleOAuthClientId: { value: "test-client-id" },
		GoogleOAuthClientSecret: { value: "test-client-secret" },
		Stage: { cookiePrefix: "structa" },
		Domain: { web: "http://localhost:3000" },
	},
}));

// Mock the database
vi.mock("@core/drizzle", () => ({
	db: {
		select: vi.fn(),
		update: vi.fn(),
	},
}));

// Mock eq from drizzle-orm
vi.mock("drizzle-orm", () => ({
	eq: vi.fn((a, b) => ({ column: a, value: b })),
}));

// Mock the auth schema with proper Zod schemas
vi.mock("@core/auth/auth.sql", () => ({
	user: {
		id: "id",
		name: "name",
		email: "email",
		image: "image",
	},
	selectUserSchema: {
		parse: (data: unknown) => data,
		_safeParse: (data: unknown) => ({ success: true, data }),
	},
	updateUserSchema: {
		parse: (data: unknown) => data,
		_safeParse: (data: unknown) => ({ success: true, data }),
	},
}));

// Mock better-auth modules
vi.mock("better-auth", () => ({
	betterAuth: vi.fn(() => ({
		api: {
			getSession: vi.fn(),
		},
		handler: vi.fn(),
	})),
}));

vi.mock("better-auth/adapters/drizzle", () => ({
	drizzleAdapter: vi.fn(),
}));

vi.mock("better-auth/plugins", () => ({
	emailOTP: vi.fn(() => ({ id: "email-otp" })),
	openAPI: vi.fn(() => ({ id: "openapi" })),
}));

vi.mock("better-auth/tanstack-start", () => ({
	tanstackStartCookies: vi.fn(() => ({ id: "cookies" })),
}));

// Mock @backend/auth/email
vi.mock("@backend/auth/email", () => ({
	sendVerificationOTP: vi.fn(),
}));

// Mock @core/marketing
vi.mock("@core/marketing", () => ({
	createContactInLoops: vi.fn(),
	MAILING_LISTS: {
		MARKETING: "marketing",
		PRODUCT: "product",
	},
}));

// Mock @core/utils/geolocation
vi.mock("@core/utils/geolocation", () => ({
	extractIPAddress: vi.fn(),
	getLocationFromIP: vi.fn(),
}));

// Import after all mocks are set up
import { db } from "@core/drizzle";
import { usersRouter } from "../users";

// Helper to create mock context
function createMockContext(overrides = {}) {
	return {
		session: {
			id: "session-123",
			userId: "user-123",
			expiresAt: new Date(Date.now() + 86400000),
			token: "token-123",
			createdAt: new Date(),
			updatedAt: new Date(),
			ipAddress: null,
			userAgent: null,
		},
		user: {
			id: "user-123",
			name: "Test User",
			email: "test@example.com",
			emailVerified: true,
			image: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			workspaceId: null,
			workspaceName: null,
			role: null,
			plan: "pro",
			product: null,
		},
		...overrides,
	};
}

describe("tRPC Users Router", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("get procedure", () => {
		it("returns the current user's profile", async () => {
			const mockUser = {
				id: "user-123",
				name: "Test User",
				email: "test@example.com",
				emailVerified: true,
				image: null,
				createdAt: new Date("2024-01-01"),
				updatedAt: new Date("2024-01-15"),
				workspaceId: null,
				workspaceName: null,
				role: "admin",
				plan: "pro",
				product: null,
			};

			// Set up the mock chain: select().from().where().limit()
			const mockLimit = vi.fn().mockResolvedValue([mockUser]);
			const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
			const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
			(db.select as ReturnType<typeof vi.fn>).mockReturnValue({
				from: mockFrom,
			});

			const caller = usersRouter.createCaller(createMockContext());
			const result = await caller.get();

			expect(result).toEqual(mockUser);
		});

		it("throws error when user not found", async () => {
			// Set up the mock chain with empty result
			const mockLimit = vi.fn().mockResolvedValue([]);
			const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
			const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
			(db.select as ReturnType<typeof vi.fn>).mockReturnValue({
				from: mockFrom,
			});

			const caller = usersRouter.createCaller(createMockContext());

			await expect(caller.get()).rejects.toThrow("USER_NOT_FOUND");
		});
	});

	describe("update procedure", () => {
		it("updates user name and returns txid", async () => {
			const updatedUser = {
				id: "user-123",
				name: "Updated Name",
				email: "test@example.com",
				emailVerified: true,
				image: null,
				createdAt: new Date("2024-01-01"),
				updatedAt: new Date(),
				workspaceId: null,
				workspaceName: null,
				role: null,
				plan: "pro",
				product: null,
			};

			// Set up the mock chain: update().set().where().returning()
			const mockReturning = vi.fn().mockResolvedValue([updatedUser]);
			const mockUpdateWhere = vi
				.fn()
				.mockReturnValue({ returning: mockReturning });
			const mockSet = vi.fn().mockReturnValue({ where: mockUpdateWhere });
			(db.update as ReturnType<typeof vi.fn>).mockReturnValue({ set: mockSet });

			const caller = usersRouter.createCaller(createMockContext());
			const result = await caller.update({ name: "Updated Name" });

			expect(result.data.name).toBe("Updated Name");
			expect(result.txid).toBeDefined();
			expect(typeof result.txid).toBe("number");
		});

		it("updates user image and returns txid", async () => {
			const updatedUser = {
				id: "user-123",
				name: "Test User",
				email: "test@example.com",
				emailVerified: true,
				image: "https://example.com/avatar.png",
				createdAt: new Date("2024-01-01"),
				updatedAt: new Date(),
				workspaceId: null,
				workspaceName: null,
				role: null,
				plan: "pro",
				product: null,
			};

			const mockReturning = vi.fn().mockResolvedValue([updatedUser]);
			const mockUpdateWhere = vi
				.fn()
				.mockReturnValue({ returning: mockReturning });
			const mockSet = vi.fn().mockReturnValue({ where: mockUpdateWhere });
			(db.update as ReturnType<typeof vi.fn>).mockReturnValue({ set: mockSet });

			const caller = usersRouter.createCaller(createMockContext());
			const result = await caller.update({
				image: "https://example.com/avatar.png",
			});

			expect(result.data.image).toBe("https://example.com/avatar.png");
			expect(result.txid).toBeDefined();
		});

		it("allows setting image to null", async () => {
			const updatedUser = {
				id: "user-123",
				name: "Test User",
				email: "test@example.com",
				emailVerified: true,
				image: null,
				createdAt: new Date("2024-01-01"),
				updatedAt: new Date(),
				workspaceId: null,
				workspaceName: null,
				role: null,
				plan: "pro",
				product: null,
			};

			const mockReturning = vi.fn().mockResolvedValue([updatedUser]);
			const mockUpdateWhere = vi
				.fn()
				.mockReturnValue({ returning: mockReturning });
			const mockSet = vi.fn().mockReturnValue({ where: mockUpdateWhere });
			(db.update as ReturnType<typeof vi.fn>).mockReturnValue({ set: mockSet });

			const caller = usersRouter.createCaller(createMockContext());
			const result = await caller.update({ image: null });

			expect(result.data.image).toBeNull();
		});

		it("throws error when update fails", async () => {
			const mockReturning = vi.fn().mockResolvedValue([]);
			const mockUpdateWhere = vi
				.fn()
				.mockReturnValue({ returning: mockReturning });
			const mockSet = vi.fn().mockReturnValue({ where: mockUpdateWhere });
			(db.update as ReturnType<typeof vi.fn>).mockReturnValue({ set: mockSet });

			const caller = usersRouter.createCaller(createMockContext());

			await expect(caller.update({ name: "New Name" })).rejects.toThrow(
				"UPDATE_FAILED",
			);
		});
	});
});
