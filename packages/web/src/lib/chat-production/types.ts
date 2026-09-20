export type ChatRunEvent = {
	runId: string;
	sessionId: string;
	userId: string | null;
	seq: number;
	type: "content" | "tool_call" | "tool_result" | "done" | "error";
	payload: Record<string, unknown>;
	createdAt: Date;
};
