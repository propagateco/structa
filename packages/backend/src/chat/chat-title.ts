const CHAT_TITLE_MAX_LENGTH = 80;

export function createChatTitle(content: string): string {
	return content.trim().replace(/\s+/g, " ").slice(0, CHAT_TITLE_MAX_LENGTH);
}
