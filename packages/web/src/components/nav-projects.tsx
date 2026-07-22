import { Link } from "@tanstack/react-router";
import {
    FolderClosed,
    MoreHorizontal,
    Plus,
    Eye,
    Share,
    Trash2,
    type LucideIcon,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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

export function NavProjects({
    title,
    projects,
}: {
    title: string;
    projects: {
        name: string;
        url: string;
    }[];
}) {
    const { isMobile } = useSidebar();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <Link to={item.url}>
                                <FolderClosed />
                                <span>{item.name}</span>
                            </Link>
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
                                <DropdownMenuItem>
                                    <Eye />
                                    <span>View Project</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Share />
                                    <span>Share Project</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant={"destructive"}>
                                    <Trash2 />
                                    <span>Delete Project</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <SidebarMenuButton>
                        <Plus />
                        <span>New Project</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
