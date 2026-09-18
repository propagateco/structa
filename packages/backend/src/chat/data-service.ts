import type { ChatModel } from "@structa/core/conversation";
import { ClerkRunConflictError } from "./clerk-runtime";

export type DataServiceRunInput = ChatModel.RunInputType & {
	userId: string;
	projectId: string | null;
};

/**
 * Thrown when the DataService worker is not configured for this environment
 * (no DATA_SERVICE_URL / DATA_SERVICE_TOKEN). Callers fall back to the
 * in-Lambda clerk runtime.
 */
export class DataServiceUnavailableError extends Error {
	constructor() {
		super("Data service is not configured for this environment");
		this.name = "DataServiceUnavailableError";
	}
}

const RUN_BODY_MAX = 20000;

/**
 * Relay a run start to the conversation Durable Object. The Worker verifies
 * our bearer token, the Durable Object executes the model and streams events
 * over WebSocket(s), then materializes the assistant message + run status
 * back into Neon.
 */
export const dataServiceClient = {
	async startRun(input: DataServiceRunInput): Promise<void> {
		const url = process.env.DATA_SERVICE_URL;
		const token = process.env.DATA_SERVICE_TOKEN;
		if (!url || !token) throw new DataServiceUnavailableError();
		if (input.content.length > RUN_BODY_MAX) {
			throw new Error("Run content exceeds the data service limit");
		}

		const response = await fetch(
			`${url.replace(/\/$/, "")}/conversations/${encodeURIComponent(input.conversationId)}/run`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
					"x-structa-user-id": input.userId,
				},
				body: JSON.stringify({
					messageId: input.messageId,
					runId: input.runId,
					userId: input.userId,
					content: input.content,
					projectId: input.projectId,
				}),
			},
		);

		if (response.status === 409) {
			const body = (await response.json().catch(() => null)) as {
				message?: string;
			} | null;
			throw new ClerkRunConflictError(body?.message);
		}
		if (!response.ok) {
			throw new Error(
				`Data service relay failed with status ${response.status}`,
			);
		}
	},
};
