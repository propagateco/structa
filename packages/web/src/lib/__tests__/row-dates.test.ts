import { describe, expect, it } from "vitest";
import { normalizeRowDates } from "../row-dates";

describe("normalizeRowDates", () => {
	it("normalizes nullable and required JSON timestamps", () => {
		const row = normalizeRowDates({
			createdAt: "2026-09-20T12:00:00.000Z",
			updatedAt: "2026-09-20T12:01:00.000Z",
			lastMessageAt: null,
		});

		expect(row).toMatchObject({
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
			lastMessageAt: null,
		});
	});
});
