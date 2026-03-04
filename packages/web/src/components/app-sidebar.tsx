import { Link } from "@tanstack/react-router";
import {
    Frame,
    LifeBuoy,
    PieChart,
    Send,
    Settings2,
    SquareTerminal,
    Box,
    GalleryVerticalEnd,
    Globe,
    School,
    Map,
    LayoutGrid,
    MessageCircleQuestion,
    UsersRound,
    Wallet,
    BotMessageSquare,
    MessageSquareDot,
    MessageSquare,
    Birdhouse,
    DoorOpen,
    DoorClosedLocked,
    Container,
    Building2,
    House,
} from "lucide-react";
import type * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavChats } from "@/components/nav-chats";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

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
    projects: [
        {
            name: "Kitchen Renovation",
            url: "#",
        },
        {
            name: "Loft Conversion",
            url: "#",
        },
        {
            name: "Extension",
            url: "#",
        },
    ],
};

export function AppSidebar({ user, logoClassName, ...props }: AppSidebarProps) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size={"default"} asChild>
                            <Link to="/app">
                                <img
                                    src="/wordmark-light.webp"
                                    alt="Structa"
                                    className={`h-5 dark:hidden ${logoClassName ?? ""}`}
                                />
                                <img
                                    src="/wordmark-dark.webp"
                                    alt="Structa"
                                    className={`h-5 hidden dark:block ${logoClassName ?? ""}`}
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects title="Projects" projects={data.projects} />
                <NavChats title="Chats" projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
