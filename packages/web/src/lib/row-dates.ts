const normalizeDate = (value: unknown): Date | null => {
	if (value === null || value === undefined) return null;
	return value instanceof Date ? value : new Date(String(value));
};

/** Normalize timestamp fields serialized by JSON APIs before Zod validation. */
export function normalizeRowDates(row: unknown): unknown {
	if (!row || typeof row !== "object") return row;

	const value = row as Record<string, unknown>;
	const normalized = { ...value };
	if ("createdAt" in value) normalized.createdAt = normalizeDate(value.createdAt);
	if ("updatedAt" in value) normalized.updatedAt = normalizeDate(value.updatedAt);
	if ("lastMessageAt" in value)
		normalized.lastMessageAt = normalizeDate(value.lastMessageAt);
	return normalized;
}
