"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
	sessionLabel,
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
	const [renaming, setRenaming] = useState<{
		id: string;
		value: string;
	} | null>(null);
	const renameInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (renaming) renameInputRef.current?.select();
	}, [renaming]);

	const commitRename = () => {
		if (!renaming) return;
		const title = renaming.value.trim();
		if (title) mockEngine.renameSession(renaming.id, title);
		setRenaming(null);
	};

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Recent chats</SidebarGroupLabel>
			<SidebarMenu>
				{sessions.map((session) => (
					<SidebarMenuItem key={session.id}>
						{renaming?.id === session.id ? (
							<Input
								ref={renameInputRef}
								autoFocus
								aria-label="Rename chat"
								value={renaming.value}
								className="h-8 min-w-0 px-2 text-sm"
								onChange={(event) =>
									setRenaming({ ...renaming, value: event.target.value })
								}
								onBlur={commitRename}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										event.preventDefault();
										commitRename();
									} else if (event.key === "Escape") {
										event.preventDefault();
										setRenaming(null);
									}
								}}
							/>
						) : (
							<SidebarMenuButton
								tooltip={sessionLabel(session)}
								isActive={session.id === active?.id}
								onClick={() => mockEngine.switchSession(session.id)}
							>
								<RunningDot running={sessionRunning(session)} />
								<span className="min-w-0 flex-1 truncate text-sm">
									{sessionLabel(session)}
								</span>
							</SidebarMenuButton>
						)}
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
									onSelect={() =>
										setRenaming({
											id: session.id,
											value: sessionLabel(session),
										})
									}
								>
									<Pencil />
									<span>Rename</span>
								</DropdownMenuItem>
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
