import type { ConversationMessage } from "./conversation-object";

const roles = new Set<ConversationMessage["role"]>([
	"user",
	"assistant",
	"tool",
]);

export function parseConversationMessage(
	value: unknown,
): ConversationMessage | null {
	if (typeof value !== "object" || value === null) return null;
	const message = value as Partial<ConversationMessage>;
	if (
		typeof message.id !== "string" ||
		message.id.length === 0 ||
		typeof message.content !== "string" ||
		message.content.length === 0 ||
		!roles.has(message.role as ConversationMessage["role"])
	) {
		return null;
	}
	return {
		id: message.id,
		role: message.role as ConversationMessage["role"],
		content: message.content,
		createdAt:
			typeof message.createdAt === "number" ? message.createdAt : Date.now(),
	};
}
