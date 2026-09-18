import { describe, expect, it } from "vitest";
import {
	foldRunStream,
	type RouteRunEvent,
	type RunStreamChunk,
} from "./run-stream";

async function collect(chunks: RunStreamChunk[]): Promise<RouteRunEvent[]> {
	const events: RouteRunEvent[] = [];
	for await (const event of foldRunStream(chunks)) {
		events.push(event);
	}
	return events;
}

describe("foldRunStream", () => {
	it("folds text deltas into content events and ends with done", async () => {
		const events = await collect([
			{ type: "TEXT_MESSAGE_CONTENT", delta: "Hel" },
			{ type: "TEXT_MESSAGE_CONTENT", delta: "lo" },
		]);

		expect(events).toEqual([
			{ type: "content", payload: { text: "Hel" } },
			{ type: "content", payload: { text: "lo" } },
			{ type: "done", payload: {} },
		]);
	});

	it("skips empty deltas", async () => {
		const events = await collect([{ type: "TEXT_MESSAGE_CONTENT", delta: "" }]);

		expect(events).toEqual([{ type: "done", payload: {} }]);
	});

	it("folds tool calls and results", async () => {
		const events = await collect([
			{
				type: "TOOL_CALL_START",
				toolCallId: "tc-1",
				name: "renovate",
				input: { room: "kitchen" },
			},
			{
				type: "TOOL_CALL_END",
				toolCallId: "tc-1",
				name: "renovate",
				input: { room: "kitchen" },
			},
			{ type: "TOOL_CALL_RESULT", toolCallId: "tc-1", output: { cost: 5000 } },
		]);

		expect(events).toEqual([
			{
				type: "tool_call",
				payload: {
					toolCallId: "tc-1",
					name: "renovate",
					input: { room: "kitchen" },
				},
			},
			// TOOL_CALL_END is dropped
			{
				type: "tool_result",
				payload: {
					toolCallId: "tc-1",
					output: { cost: 5000 },
					error: undefined,
				},
			},
			{ type: "done", payload: {} },
		]);
	});

	it("folds tool errors into tool_result error payloads", async () => {
		const events = await collect([
			{ type: "TOOL_CALL_RESULT", toolCallId: "tc-2", error: "boom" },
		]);

		expect(events[0]).toEqual({
			type: "tool_result",
			payload: { toolCallId: "tc-2", output: undefined, error: "boom" },
		});
	});

	it("yields done for an empty stream", async () => {
		expect(await collect([])).toEqual([{ type: "done", payload: {} }]);
	});

	it("ignores unknown chunk types", async () => {
		const events = await collect([
			{ type: "MYSTERY" },
			{ type: "TEXT_MESSAGE_CONTENT", delta: "ok" },
		]);

		expect(events).toEqual([
			{ type: "content", payload: { text: "ok" } },
			{ type: "done", payload: {} },
		]);
	});
});
