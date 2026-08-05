"use client";

import { Thread } from "@/components/assistant-ui/thread";
import { mockEngine } from "@/lib/chat-mock/use-mock-chat";
import { NewChatRow, SessionRow, useSessions } from "./session-list";

/**
 * Variant A — "Sessions rail": a persistent left column of sessions beside
 * the chat (iss-009 sidebar shape). The list is the always-visible session
 * disclosure.
 */
export function ChatRail() {
	const { sessions, active } = useSessions();

	return (
		<div className="flex h-full">
			<aside className="flex w-60 shrink-0 flex-col border-r bg-sidebar/40">
				<div className="flex items-center justify-between px-3 pt-3 pb-1">
					<p className="text-xs font-medium text-muted-foreground">Sessions</p>
					<span className="text-muted-foreground/70 text-[11px] tabular-nums">
						{sessions.length}
					</span>
				</div>
				<div className="px-2">
					<NewChatRow />
				</div>
				<nav
					aria-label="Sessions"
					className="flex-1 space-y-0.5 overflow-y-auto px-2 py-1.5"
				>
					{sessions.map((session) => (
						<SessionRow
							key={session.id}
							session={session}
							active={session.id === active?.id}
							onSelect={(id) => mockEngine.switchSession(id)}
						/>
					))}
				</nav>
			</aside>
			<main className="min-w-0 flex-1">
				<Thread />
			</main>
		</div>
	);
}
