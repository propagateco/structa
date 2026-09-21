import { describe, expect, it } from "vitest";
import { normalizeUserRow } from "../user-row";

describe("parseUserRow", () => {
	it("normalizes JSON date strings from tRPC", () => {
		const user = normalizeUserRow({
			id: "user-123",
			name: "Test User",
			email: "test@example.com",
			emailVerified: true,
			image: null,
			createdAt: "2026-09-18T12:00:00.000Z",
			updatedAt: "2026-09-18T12:00:00.000Z",
			workspaceId: null,
			workspaceName: null,
			role: null,
			plan: "pro",
			product: null,
		});

		expect(user).toMatchObject({
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
		});
	});
});
