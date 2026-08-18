import { Link } from "@tanstack/react-router";
import {
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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

export function NavChats({
    title,
    conversations,
    onRename,
    onDelete,
}: {
    title: string;
    conversations: { id: string; title: string }[];
    onRename?: (
        conversation: { id: string; title: string },
        title: string,
    ) => Promise<void> | void;
    onDelete?: (conversation: { id: string; title: string }) => void;
}) {
    const { isMobile } = useSidebar();
    const [renaming, setRenaming] = React.useState<{
        conversation: { id: string; title: string };
        value: string;
    } | null>(null);

    const commitRename = async () => {
        if (!renaming) return;
        const value = renaming.value.trim();
        if (value && value !== renaming.conversation.title) {
            await onRename?.(renaming.conversation, value);
        }
        setRenaming(null);
    };

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {conversations.map((item) => (
                    <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton asChild>
                            <Link
                                to="/app/chat/$conversationId"
                                params={{ conversationId: item.id }}
                            >
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                        {(onRename || onDelete) && <DropdownMenu>
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
                                        setRenaming({ conversation: item, value: item.title })
                                    }
                                >
                                    <Pencil />
                                    <span>Rename Chat</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    variant="destructive"
                                    onSelect={() => onDelete?.(item)}
                                >
                                    <Trash2 />
                                    <span>Delete Chat</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
            <Dialog
                open={renaming !== null}
                onOpenChange={(open) => {
                    if (!open) setRenaming(null);
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            void commitRename();
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>Rename chat</DialogTitle>
                            <DialogDescription>
                                Choose a name for this conversation.
                            </DialogDescription>
                        </DialogHeader>
                        <Input
                            autoFocus
                            aria-label="Chat name"
                            value={renaming?.value ?? ""}
                            className="mt-4"
                            onChange={(event) =>
                                setRenaming((current) =>
                                    current
                                        ? { ...current, value: event.target.value }
                                        : current,
                                )
                            }
                        />
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </SidebarGroup>
    );
}
