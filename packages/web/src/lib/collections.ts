import { selectUserSchema } from "@core/auth/auth.sql";
import { snakeCamelMapper } from "@electric-sql/client";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { trpc } from "@/lib/trpc-client";
import { z } from "zod";

/**
 * Parse a Postgres timestamp from the Electric wire format into a Date.
 *
 * Electric serves values as strings in Postgres text format:
 * - `timestamp`   → "2026-07-17 08:23:41.123456"    (no offset; stored as UTC)
 * - `timestamptz` → "2026-07-17 08:23:41.123456+00" (with offset)
 *
 * The default Electric parser leaves timestamps as strings, but our collection
 * schema (drizzle-zod) expects Date objects.
 */
const parsePgTimestamp = (value: string): Date => {
	const iso = value
		.replace(" ", "T")
		// Normalize "+00" → "+00:00" so Date parsing is reliable cross-browser
		.replace(
			/([+-]\d{2})(\d{2})?$/,
			(_match, hours, minutes) => `${hours}:${minutes ?? "00"}`,
		);
	// `timestamp` columns carry no offset — drizzle writes UTC via toISOString()
	return new Date(/(Z|[+-]\d{2}:\d{2})$/.test(iso) ? iso : `${iso}Z`);
};

/**
 * Get the API base URL for client-side requests.
 * Returns absolute URL to avoid "Invalid URL" errors during SSR.
 * MUST be called at runtime (not module load time) to ensure window is available.
 */
const getApiBase = (): string => {
	if (typeof window !== "undefined") {
		return window.location.origin;
	}
	// Fallback for SSR - use platform URL from env
	const platformUrl = import.meta.env.VITE_PLATFORM_URL;
	if (platformUrl) {
		return platformUrl;
	}
	throw new Error(
		"getApiBase() called during SSR without VITE_PLATFORM_URL - ensure collection is only used client-side or set VITE_PLATFORM_URL",
	);
};

/**
 * Users collection with Electric sync
 *
 * This collection syncs the current user's profile data via ElectricSQL.
 * Uses optimistic updates with tRPC mutations and txid-based confirmation.
 *
 * Note: URL is computed lazily via getter to avoid SSR issues with window.location
 *
 * Usage:
 * ```tsx
 * import { usersCollection } from '@/lib/collections';
 * import { useLiveQuery } from '@tanstack/react-db';
 *
 * function UserProfile() {
 *   const { data: users } = useLiveQuery((q) =>
 *     q.from({ user: usersCollection })
 *   );
 *
 *   const currentUser = users[0];
 *
 *   const updateName = (name: string) => {
 *     usersCollection.update(currentUser.id, (draft) => {
 *       draft.name = name;
 *     });
 *   };
 * }
 * ```
 */
export const usersCollection = createCollection(
	electricCollectionOptions({
		id: "users",
		schema: selectUserSchema,
		getKey: (item) => item.id,
		shapeOptions: {
			// Use getter to defer URL construction until sync actually starts (client-side only)
			get url() {
				return `${getApiBase()}/api/users`;
			},
			// The user table uses snake_case columns (created_at, workspace_id, ...)
			// while the app schema is camelCase. Map column names on the way in.
			columnMapper: snakeCamelMapper(),
			// Electric leaves non-scalar types as strings; parse timestamps into
			// Date objects so rows match the collection schema (z.date()).
			parser: {
				timestamp: parsePgTimestamp,
				timestamptz: parsePgTimestamp,
			},
		},
		onUpdate: async ({ transaction }) => {
			const { changes } = transaction.mutations[0];

			// Call tRPC mutation to persist changes
			const result = await trpc.users.update.mutate({
				name: changes.name as string | undefined,
				workspaceName: changes.workspaceName as string | undefined,
				image: changes.image as string | null | undefined,
			});

			// Return txid to wait for sync confirmation
			return { txid: result.txid };
		},
	}),
);

const chatSessionSchema = z.object({
	id: z.string(),
	userId: z.string(),
	projectId: z.string().nullable(),
	context: z.enum(["project", "editor", "mcp", "api"]),
	documentId: z.string().nullable(),
	title: z.string(),
	messageCount: z.number(),
	lastMessageAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

const chatMessageSchema = z.object({
	id: z.string(),
	sessionId: z.string(),
	userId: z.string(),
	runId: z.string().nullable(),
	role: z.enum(["user", "assistant"]),
	content: z.string(),
	createdAt: z.date(),
});

const chatRunSchema = z.object({
	id: z.string(),
	sessionId: z.string(),
	userId: z.string(),
	status: z.enum(["running", "complete", "error"]),
	errorCode: z.string().nullable(),
	errorMessage: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

const chatRunEventSchema = z.object({
	runId: z.string(),
	sessionId: z.string(),
	userId: z.string().nullable(),
	seq: z.number(),
	type: z.enum(["content", "tool_call", "tool_result", "done", "error"]),
	payload: z.record(z.string(), z.unknown()),
	createdAt: z.date(),
});

const chatShapeOptions = (path: string) => ({
	get url() {
		return `${getApiBase()}${path}`;
	},
	columnMapper: snakeCamelMapper(),
	parser: { timestamp: parsePgTimestamp, timestamptz: parsePgTimestamp },
});

/** Backend-owned chat rows. These collections intentionally have no write hooks. */
export const chatSessionsCollection = createCollection(
	electricCollectionOptions({
		id: "chat_sessions",
		schema: chatSessionSchema,
		getKey: (row) => row.id,
		shapeOptions: chatShapeOptions("/api/chat/sessions"),
	}),
);

export const chatMessagesCollection = createCollection(
	electricCollectionOptions({
		id: "chat_messages",
		schema: chatMessageSchema,
		getKey: (row) => row.id,
		shapeOptions: chatShapeOptions("/api/chat/messages"),
	}),
);

export const chatRunsCollection = createCollection(
	electricCollectionOptions({
		id: "chat_runs",
		schema: chatRunSchema,
		getKey: (row) => row.id,
		shapeOptions: chatShapeOptions("/api/chat/runs"),
	}),
);

/** Events are session-scoped so callers cannot accidentally subscribe globally. */
export const createChatRunEventsCollection = (sessionId: string) =>
	createCollection(
		electricCollectionOptions({
			id: `chat_run_events:${sessionId}`,
			schema: chatRunEventSchema,
			getKey: (row) => `${row.runId}:${row.seq}`,
			shapeOptions: chatShapeOptions(
				`/api/chat/events?sessionId=${encodeURIComponent(sessionId)}`,
			),
		}),
	);

export type ChatSession = z.infer<typeof chatSessionSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRun = z.infer<typeof chatRunSchema>;
export type ChatRunEvent = z.infer<typeof chatRunEventSchema>;
