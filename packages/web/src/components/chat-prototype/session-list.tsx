"use client";

import type { MockSession } from "@/lib/chat-mock/types";
import { mockEngine, useMockChatState } from "@/lib/chat-mock/use-mock-chat";
import { cn } from "@/lib/utils";

/**
 * Shared session list helpers for the prototype variants. Each variant
 * discloses the same sessions differently (rail / breadcrumb / context cards);
 * all of them mutate the shared mock engine.
 */

export function useSessions() {
	const state = useMockChatState();
	const sessions = state.sessions.filter((session) => !session.archived);
	const active = sessions.find(
		(session) => session.id === state.activeSessionId,
	);
	return { sessions, active, state };
}

export function sessionRunning(session: MockSession) {
	return session.runs.at(-1)?.status === "running";
}

/** The user's first input, used as the compact session preview. */
export function sessionPreview(session: MockSession) {
	return session.runs[0]?.prompt ?? "No messages yet";
}

/** Small running indicator used across variants. */
export function RunningDot({ running }: { running: boolean }) {
	if (!running) return null;
	return (
		<span
			role="img"
			aria-label="Running"
			className="size-1.5 shrink-0 animate-pulse rounded-full bg-primary"
		/>
	);
}

/** Session item row shared by rail + breadcrumb menus. */
export function SessionRow({
	session,
	active,
	onSelect,
}: {
	session: MockSession;
	active: boolean;
	onSelect: (sessionId: string) => void;
}) {
	return (
		<button
			type="button"
			onClick={() => onSelect(session.id)}
			className={cn(
				"flex h-8 w-full items-center gap-2 rounded-md px-2.5 text-start text-sm transition-colors",
				active
					? "bg-muted text-foreground font-medium"
					: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
			)}
		>
			<RunningDot running={sessionRunning(session)} />
			<span className="min-w-0 flex-1 truncate">{session.title}</span>
		</button>
	);
}

/** New-chat row used by rail + breadcrumb variants. */
export function NewChatRow() {
	return (
		<button
			type="button"
			onClick={() => mockEngine.createSession()}
			className="flex h-8 w-full items-center gap-2 rounded-md px-2.5 text-start text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
		>
			<span className="text-base leading-none">+</span>
			<span className="min-w-0 flex-1 truncate">New chat</span>
		</button>
	);
}
