import { selectUserSchema } from "@core/auth/auth.sql";
import { snakeCamelMapper } from "@electric-sql/client";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryClient } from "@/lib/query-client";
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

/** Users collection backed by the authenticated API and TanStack Query. */
export const usersCollection = createCollection(
	queryCollectionOptions({
		id: "users",
		schema: selectUserSchema,
		queryKey: ["users", "me"],
		queryClient,
		queryFn: async () => {
			const response = await fetch(`${getApiBase()}/api/users`, {
				credentials: "include",
			});
			if (!response.ok)
				throw new Error(`Failed to load user (${response.status})`);
			return [selectUserSchema.parse(await response.json())];
		},
		getKey: (item) => item.id,
		onUpdate: async ({ transaction }) => {
			const { changes } = transaction.mutations[0];
			await trpc.users.update.mutate({
				name: changes.name as string | undefined,
				workspaceName: changes.workspaceName as string | undefined,
				image: changes.image as string | null | undefined,
			});
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

export const chatSessionsCollection = createCollection(
	queryCollectionOptions({
		id: "chat_sessions",
		schema: chatSessionSchema,
		queryKey: ["chat-sessions"],
		queryClient,
		queryFn: async () => {
			const response = await fetch(`${getApiBase()}/api/chat/conversations`);
			if (!response.ok)
				throw new Error(`Failed to load conversations (${response.status})`);
			const result = (await response.json()) as { items: unknown[] };
			return result.items.map((item) => chatSessionSchema.parse(item));
		},
		getKey: (row) => row.id,
	}),
);

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

const fetchChatRows = async <T>(path: string, schema: z.ZodType<T>) => {
	const response = await fetch(`${getApiBase()}${path}`, {
		credentials: "include",
	});
	if (!response.ok)
		throw new Error(`Failed to load chat data (${response.status})`);
	const rows = (await response.json()) as unknown[];
	return rows.map((row) => schema.parse(row));
};

export const chatMessagesCollection = createCollection(
	queryCollectionOptions({
		id: "chat_messages",
		schema: chatMessageSchema,
		queryKey: ["chat-messages"],
		queryClient,
		queryFn: () => fetchChatRows("/api/chat/messages", chatMessageSchema),
		getKey: (row) => row.id,
	}),
);

export const chatRunsCollection = createCollection(
	queryCollectionOptions({
		id: "chat_runs",
		schema: chatRunSchema,
		queryKey: ["chat-runs"],
		queryClient,
		queryFn: () => fetchChatRows("/api/chat/runs", chatRunSchema),
		getKey: (row) => row.id,
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
