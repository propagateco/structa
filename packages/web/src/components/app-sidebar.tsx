import { Link } from "@tanstack/react-router";
import {
    Birdhouse,
    BotMessageSquare,
    Box,
    Building2,
    Container,
    DoorClosedLocked,
    DoorOpen,
    Frame,
    GalleryVerticalEnd,
    Globe,
    House,
    LayoutGrid,
    LifeBuoy,
    Map,
    MessageCircleQuestion,
    MessageSquare,
    MessageSquareDot,
    PieChart,
    School,
    Send,
    Settings2,
    SquareTerminal,
    UsersRound,
    Wallet,
} from "lucide-react";
import type * as React from "react";
import { NavChats } from "@/components/nav-chats";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Logo } from "@/components/ui/logo";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// User type for the sidebar
export type SidebarUser = {
    name: string;
    email: string;
    avatar?: string;
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: SidebarUser;
    /** Override the logo height. Default is h-5 */
    logoClassName?: string;
}

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/app",
            icon: LayoutGrid,
            isActive: true,
        },
        {
            title: "Chat",
            url: "/app",
            icon: BotMessageSquare,
            isActive: true,
        },
        {
            title: "Budget",
            url: "/app",
            icon: PieChart,
            isActive: true,
        },
        {
            title: "Property Profile",
            url: "/app",
            icon: School,
            isActive: true,
        },
        {
            title: "Catalog",
            url: "/app",
            icon: GalleryVerticalEnd,
            isActive: true,
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
    ],
    chats: [
        {
            name: "How much will it cost to build a loft extension",
            url: "#",
        },
        {
            name: "Can you help me find quotes for new radiators",
            url: "#",
        },
        {
            name: "I think we have damp under the bay window, what should I do?",
            url: "#",
        },
    ],
};

export function AppSidebar({
    user,
    logoClassName,
    className,
    ...props
}: AppSidebarProps) {
    const { state } = useSidebar();

    return (
        <Sidebar className={cn("group", className)} {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center justify-between gap-2">
                        <Link to="/app" className="inline-flex px-2">
                            <Logo
                                className={cn("h-6", logoClassName)}
                                aria-label="Structa"
                            />
                        </Link>
                        {state === "expanded" && (
                            <SidebarTrigger
                                className={cn(
                                    "ml-1 cursor-pointer text-text-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:bg-sidebar-accent/40",
                                    "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100",
                                )}
                            />
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavChats title="Chats" projects={data.chats} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
