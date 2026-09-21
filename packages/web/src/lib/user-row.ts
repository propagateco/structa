const parseDate = (value: unknown): Date =>
	value instanceof Date ? value : new Date(String(value));

/** Normalize JSON-serialized user timestamps before schema validation. */
export const normalizeUserRow = (row: unknown) => {
	if (!row || typeof row !== "object") {
		return row;
	}

	const user = row as Record<string, unknown>;
	return {
		...user,
		createdAt: parseDate(user.createdAt),
		updatedAt: parseDate(user.updatedAt),
	};
};
