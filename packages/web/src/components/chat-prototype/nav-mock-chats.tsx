"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { mockEngine } from "@/lib/chat-mock/use-mock-chat";
import {
	RunningDot,
	sessionPreview,
	sessionRunning,
	useSessions,
} from "./session-list";

/**
 * Mock chat sessions surfaced in the app sidebar's "Recent chats" section
 * while the prototype route is active (iss-009 sidebar shape): the active
 * session is highlighted, running sessions show a pulsing dot, and each row
 * has a delete action wired to the mock engine.
 */
export function NavMockChats() {
	const { sessions, active } = useSessions();
	const { isMobile } = useSidebar();

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Recent chats</SidebarGroupLabel>
			<SidebarMenu>
				{sessions.map((session) => (
					<SidebarMenuItem key={session.id}>
						<SidebarMenuButton
							tooltip={session.title}
							isActive={session.id === active?.id}
							className="h-auto min-h-8 items-start py-1.5"
							onClick={() => mockEngine.switchSession(session.id)}
						>
							<RunningDot running={sessionRunning(session)} />
							<span className="min-w-0 flex-1">
								<span className="block truncate text-sm leading-4">
									{session.title}
								</span>
								<span className="text-muted-foreground/70 block truncate text-xs leading-4 font-normal">
									{sessionPreview(session)}
								</span>
							</span>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover>
									<MoreHorizontal />
									<span className="sr-only">More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-48"
								side={isMobile ? "bottom" : "right"}
								align={isMobile ? "end" : "start"}
							>
								<DropdownMenuItem
									variant="destructive"
									onClick={() => mockEngine.deleteSession(session.id)}
								>
									<Trash2 />
									<span>Delete Chat</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
