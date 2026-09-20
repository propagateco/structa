import { selectUserSchema } from "@core/auth/auth.sql";
import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryClient } from "@/lib/query-client";
import { trpc } from "@/lib/trpc-client";
import { normalizeRowDates } from "@/lib/row-dates";
import { normalizeUserRow } from "@/lib/user-row";
import { z } from "zod";

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

/** Users collection backed by the authenticated tRPC API and TanStack Query. */
export const usersCollection = createCollection(
	queryCollectionOptions({
		id: "users",
		schema: selectUserSchema,
		queryKey: ["users", "me"],
		queryClient,
		queryFn: async () => {
			const user = await trpc.users.get.query();
			return [selectUserSchema.parse(normalizeUserRow(user))];
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
			return result.items.map((item) =>
				chatSessionSchema.parse(normalizeRowDates(item)),
			);
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

const fetchChatRows = async <T>(path: string, schema: z.ZodType<T>) => {
	const response = await fetch(`${getApiBase()}${path}`, {
		credentials: "include",
	});
	if (!response.ok)
		throw new Error(`Failed to load chat data (${response.status})`);
	const rows = (await response.json()) as unknown[];
	return rows.map((row) => schema.parse(normalizeRowDates(row)));
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

export type ChatSession = z.infer<typeof chatSessionSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRun = z.infer<typeof chatRunSchema>;
