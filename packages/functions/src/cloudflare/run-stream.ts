/**
 * Folding of a model stream into Structa's run events.
 *
 * The Durable Object streams from the OpenRouter adapter and reduces each
 * chunk into the same event shapes the web client already renders via
 * `fold.ts` (content, tool_call, tool_result, done, error).
 */

export type RunStreamChunk = {
	type: string;
	delta?: string;
	toolCallId?: string;
	name?: string;
	input?: unknown;
	output?: unknown;
	error?: string;
};

export type RunEventPayload = Record<string, unknown>;

export type RouteRunEvent =
	| { type: "content"; payload: { text: string } }
	| {
			type: "tool_call";
			payload: { toolCallId?: string; name?: string; input?: unknown };
	  }
	| {
			type: "tool_result";
			payload: { toolCallId?: string; output?: unknown; error?: string };
	  }
	| { type: "done"; payload: Record<string, never> }
	| { type: "error"; payload: { message: string } };

/**
 * Reduce a stream of adapter chunks into `RouteRunEvent`s. Always terminates
 * with a `done` event, even when the stream is empty.
 */
export async function* foldRunStream(
	chunks: AsyncIterable<RunStreamChunk> | Iterable<RunStreamChunk>,
): AsyncGenerator<RouteRunEvent> {
	for await (const chunk of chunks) {
		switch (chunk.type) {
			case "TEXT_MESSAGE_CONTENT": {
				const delta = typeof chunk.delta === "string" ? chunk.delta : "";
				if (delta.length > 0) {
					yield { type: "content", payload: { text: delta } };
				}
				break;
			}
			case "TOOL_CALL_START": {
				yield {
					type: "tool_call",
					payload: {
						toolCallId: chunk.toolCallId,
						name: chunk.name,
						input: chunk.input,
					},
				};
				break;
			}
			// TOOL_CALL_END duplicates the START payload; skip it to avoid
			// double-rendering the tool call in the client.
			case "TOOL_CALL_END": {
				break;
			}
			case "TOOL_CALL_RESULT": {
				yield {
					type: "tool_result",
					payload: {
						toolCallId: chunk.toolCallId,
						output: chunk.output,
						error: chunk.error,
					},
				};
				break;
			}
			default:
				break;
		}
	}
	yield { type: "done", payload: {} };
}
