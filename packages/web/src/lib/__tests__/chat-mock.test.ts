/**
 * Unit tests for the chat mock's pure fold/script logic
 * (`lib/chat-mock/`). The engine itself is timer-driven and UI-verified via
 * the preview; these tests pin the retry/error semantics that carry the
 * iss-017 decisions.
 */
import { describe, expect, it } from "vitest";
import { convertMessage, deriveMessages, extractText } from "../chat-mock/fold";
import { scriptForPrompt, titleForPrompt } from "../chat-mock/scripts";
import type { MockRun, MockSession } from "../chat-mock/types";

function makeRun(overrides: Partial<MockRun> = {}): MockRun {
	return {
		runId: "run-1",
		sessionId: "ses-1",
		userMessageId: "msg-1",
		prompt: "Test prompt",
		status: "complete",
		startedAt: 1_700_000_000_000,
		events: [{ type: "done", seq: 1, at: 1_700_000_000_100 }],
		...overrides,
	};
}

function makeSession(runs: MockRun[]): MockSession {
	return {
		id: "ses-1",
		title: "Session",
		createdAt: 1_700_000_000_000,
		runs,
	};
}

describe("deriveMessages", () => {
	it("emits one user + one assistant message per run", () => {
		const messages = deriveMessages(makeSession([makeRun()]));
		expect(messages).toHaveLength(2);
		expect(messages[0]).toMatchObject({ role: "user", text: "Test prompt" });
		expect(messages[1]).toMatchObject({ role: "assistant", id: "run-1" });
	});

	it("shares the user bubble across a retried run (iss-017 retry semantics)", () => {
		const messages = deriveMessages(
			makeSession([
				makeRun({ runId: "run-fail", status: "error" }),
				makeRun({ runId: "run-retry" }),
			]),
		);
		expect(messages).toHaveLength(3);
		expect(messages.map((m) => m.role)).toEqual([
			"user",
			"assistant",
			"assistant",
		]);
		// Failed attempt stays; retry appends below.
		expect(messages[1]).toMatchObject({ id: "run-fail" });
		expect(messages[2]).toMatchObject({ id: "run-retry" });
	});
});

describe("convertMessage", () => {
	it("converts a user message to a text part", () => {
		const like = convertMessage({
			role: "user",
			id: "msg-1",
			text: "hi",
			at: 1_700_000_000_000,
		});
		expect(like.role).toBe("user");
		expect(like.content).toEqual([{ type: "text", text: "hi" }]);
	});

	it("folds consecutive content events into a single bubble", () => {
		const run = makeRun({
			events: [
				{ type: "content", seq: 1, at: 0, text: "Hello " },
				{ type: "content", seq: 2, at: 100, text: "world" },
				{ type: "done", seq: 3, at: 200 },
			],
		});
		const like = convertMessage({ role: "assistant", id: run.runId, run });
		expect(like.content).toEqual([{ type: "text", text: "Hello world" }]);
	});

	it("renders a tool-call chip and fills its result when available", () => {
		const run = makeRun({
			events: [
				{
					type: "tool_call",
					seq: 1,
					at: 0,
					toolCallId: "tc-1",
					toolName: "measure_room",
					args: { room: "kitchen" },
					argsText: '{"room": "kitchen"}',
				},
				{
					type: "tool_result",
					seq: 2,
					at: 100,
					toolCallId: "tc-1",
					result: "4.2m x 3.6m",
				},
				{ type: "done", seq: 3, at: 200 },
			],
		});
		const like = convertMessage({ role: "assistant", id: run.runId, run });
		const content = Array.isArray(like.content) ? like.content : [];
		const toolPart = content.find(
			(part) => typeof part === "object" && part.type === "tool-call",
		);
		expect(toolPart).toMatchObject({
			type: "tool-call",
			toolName: "measure_room",
			toolCallId: "tc-1",
			result: "4.2m x 3.6m",
		});
		expect((toolPart as { isError?: boolean }).isError).toBeUndefined();
	});

	it("leaves the chip running (no result) until the tool_result arrives", () => {
		const run = makeRun({
			status: "running",
			events: [
				{
					type: "tool_call",
					seq: 1,
					at: 0,
					toolCallId: "tc-1",
					toolName: "check_structural",
					args: {},
					argsText: "{}",
				},
			],
		});
		const like = convertMessage({ role: "assistant", id: run.runId, run });
		const content = Array.isArray(like.content) ? like.content : [];
		const toolPart = content.find(
			(part) => typeof part === "object" && part.type === "tool-call",
		);
		expect(toolPart).toMatchObject({ type: "tool-call", toolCallId: "tc-1" });
		expect((toolPart as { result?: unknown }).result).toBeUndefined();
	});

	it("maps run status to message status (running/complete/error)", () => {
		const running = convertMessage({
			role: "assistant",
			id: "r",
			run: makeRun({ status: "running", events: [] }),
		});
		expect(running.status).toEqual({ type: "running" });

		const complete = convertMessage({
			role: "assistant",
			id: "r",
			run: makeRun({ status: "complete" }),
		});
		expect(complete.status).toEqual({ type: "complete", reason: "stop" });

		const errored = convertMessage({
			role: "assistant",
			id: "r",
			run: makeRun({ status: "error", errorMessage: "boom" }),
		});
		expect(errored.status).toMatchObject({
			type: "incomplete",
			reason: "error",
			error: { message: "boom" },
		});
	});
});

describe("extractText", () => {
	it("extracts a single text part", () => {
		expect(extractText([{ type: "text", text: "plain" }])).toBe("plain");
	});

	it("joins text parts", () => {
		expect(
			extractText([
				{ type: "text", text: "a" },
				{ type: "data", name: "x", data: 1 },
				{ type: "text", text: "b" },
			]),
		).toBe("a\nb");
	});
});

describe("scriptForPrompt", () => {
	it("routes to themed scripts", () => {
		expect(
			scriptForPrompt("Measure the kitchen", 0).some(
				(step) => step.kind === "tool" && step.toolName === "measure_room",
			),
		).toBe(true);
		expect(
			scriptForPrompt("Is the wall load-bearing?", 0).some(
				(step) => step.kind === "tool" && step.toolName === "check_structural",
			),
		).toBe(true);
	});

	it("fails on a failure keyword for the first attempt", () => {
		const steps = scriptForPrompt("check and fail please", 0);
		expect(steps.some((step) => step.kind === "error")).toBe(true);
	});

	it("recovers on retry (attempt >= 1) even for failure prompts", () => {
		const steps = scriptForPrompt("check and fail please", 1);
		expect(steps.some((step) => step.kind === "error")).toBe(false);
		expect(steps.some((step) => step.kind === "done")).toBe(true);
	});
});

describe("titleForPrompt", () => {
	it("derives a stable session title from keywords", () => {
		expect(titleForPrompt("Measure the living room")).toBe(
			"Kitchen measurements",
		);
		expect(titleForPrompt("compare quotes")).toBe("Quote comparison");
		expect(titleForPrompt("what about patio tiles?")).toBe(
			"Materials research",
		);
	});

	it("falls back to a truncated prompt", () => {
		expect(titleForPrompt("something else entirely")).toBe(
			"something else entirely",
		);
	});
});
