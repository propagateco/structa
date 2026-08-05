/**
 * In-memory model for the chat UX prototype (`/app/prototype-chat`).
 *
 * Mirrors the locked iss-016/iss-017 shape: a session owns an ordered list of
 * runs; each run streams an ordered list of events; a user message can be
 * referenced by multiple runs (retry = new run, same `userMessageId`). The
 * prototype renders this from an `ExternalStoreRuntime` — see `fold.ts`,
 * `engine.ts`, `adapter.ts`.
 */

export type MockEvent =
	| { type: "content"; seq: number; at: number; text: string }
	| {
			type: "tool_call";
			seq: number;
			at: number;
			toolCallId: string;
			toolName: string;
			args: Record<string, unknown>;
			argsText: string;
	  }
	| {
			type: "tool_result";
			seq: number;
			at: number;
			toolCallId: string;
			result: string;
			isError?: boolean;
	  }
	| { type: "done"; seq: number; at: number }
	| { type: "error"; seq: number; at: number; message: string };

export type MockRunStatus = "running" | "complete" | "error";

export type MockRun = {
	runId: string;
	sessionId: string;
	/** Client-generated user message id (iss-016 optimistic echo). */
	userMessageId: string;
	prompt: string;
	status: MockRunStatus;
	errorMessage?: string;
	/** Events appended in seq order as the run streams. */
	events: MockEvent[];
	startedAt: number;
};

export type MockSession = {
	id: string;
	title: string;
	createdAt: number;
	/** Ordered oldest → newest. Retried runs append (failed bubble stays). */
	runs: MockRun[];
	/** Archived sessions drop out of the regular thread list. */
	archived?: boolean;
};

export type MockState = {
	version: number;
	activeSessionId: string;
	sessions: MockSession[];
};

/** The external-store message shape: user texts + assistant runs. */
export type MockMessage =
	| { role: "user"; id: string; text: string; at: number }
	| { role: "assistant"; id: string; run: MockRun };
