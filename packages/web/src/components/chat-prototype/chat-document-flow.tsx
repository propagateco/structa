"use client";

import { FileTextIcon, PlusIcon } from "lucide-react";
import { Thread } from "@/components/assistant-ui/thread";
import { mockEngine } from "@/lib/chat-mock/use-mock-chat";
import { cn } from "@/lib/utils";
import { RunningDot, sessionRunning, useSessions } from "./session-list";

/**
 * Variant C — "Document flow": sessions are *contexts* the Clerk pulls from,
 * disclosed as a horizontal strip of context cards above the chat (plus an
 * inline "referencing" line). Frames the sessions as project documents rather
 * than a chat list.
 */
export function ChatDocumentFlow() {
	const { sessions, active } = useSessions();

	return (
		<div className="flex h-full flex-col">
			<div className="shrink-0 border-b px-4 py-3">
				<div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
					<FileTextIcon className="size-3.5" />
					Context — what the Clerk is working from
				</div>
				<div className="flex items-center gap-2 overflow-x-auto pb-1">
					{sessions.map((session) => {
						const isActive = session.id === active?.id;
						const lastRun = session.runs.at(-1);
						return (
							<button
								key={session.id}
								type="button"
								onClick={() => mockEngine.switchSession(session.id)}
								className={cn(
									"flex min-w-40 max-w-56 flex-col gap-1 rounded-lg border p-2.5 text-start transition-colors",
									isActive
										? "border-primary/40 bg-primary/5 shadow-sm"
										: "border-border hover:border-foreground/20 hover:bg-muted/40",
								)}
							>
								<span className="flex items-center gap-1.5 text-sm font-medium">
									<RunningDot running={sessionRunning(session)} />
									<span className="truncate">{session.title}</span>
								</span>
								<span className="text-muted-foreground line-clamp-1 text-xs">
									{lastRun
										? lastRun.status === "error"
											? "Needs a retry"
											: lastRun.prompt
										: "No runs yet"}
								</span>
							</button>
						);
					})}
					<button
						type="button"
						onClick={() => mockEngine.createSession()}
						aria-label="New chat"
						className="flex h-full min-h-14 min-w-14 items-center justify-center rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
					>
						<PlusIcon className="size-4" />
					</button>
				</div>
			</div>
			<div className="min-h-0 flex-1">
				<Thread />
			</div>
		</div>
	);
}
