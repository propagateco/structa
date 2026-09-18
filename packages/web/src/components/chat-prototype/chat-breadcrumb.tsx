"use client";

import { ChevronDownIcon, MessageSquareTextIcon } from "lucide-react";
import { Thread } from "@/components/assistant-ui/thread";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockEngine } from "@/lib/chat-mock/use-mock-chat";
import {
	NewChatRow,
	RunningDot,
	SessionRow,
	useSessions,
} from "./session-list";

/**
 * Variant B — "Breadcrumb menu": no persistent list. The active session is a
 * breadcrumb-level trigger in a slim bar above the chat; sessions live behind
 * a disclosure menu. Freed-up horizontal space goes to the thread.
 */
export function ChatBreadcrumb() {
	const { sessions, active } = useSessions();

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center gap-2 border-b px-3 py-1.5">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 max-w-sm justify-start gap-2 px-2 text-sm font-medium"
						>
							<RunningDot running={active?.runs.at(-1)?.status === "running"} />
							<MessageSquareTextIcon className="text-muted-foreground size-4 shrink-0" />
							<span className="min-w-0 flex-1 truncate">
								{active?.title ?? "New chat"}
							</span>
							<ChevronDownIcon className="text-muted-foreground size-4 shrink-0" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" sideOffset={6} className="w-64">
						<DropdownMenuLabel>Sessions</DropdownMenuLabel>
						<div className="px-1 pb-1">
							<NewChatRow />
						</div>
						<DropdownMenuSeparator />
						<div className="space-y-0.5 p-1">
							{sessions.map((session) => (
								<SessionRow
									key={session.id}
									session={session}
									active={session.id === active?.id}
									onSelect={(id) => mockEngine.switchSession(id)}
								/>
							))}
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="min-h-0 flex-1">
				<Thread />
			</div>
		</div>
	);
}
