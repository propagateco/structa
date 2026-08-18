import {
    EntranceStairsIcon,
    Archive04Icon,
    ChartAnalysisIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { SchemaType } from "@structa/core/user/user.model";
import { Link, useLocation } from "@tanstack/react-router";
import { GalleryVerticalEnd, LayoutGrid, Plus } from "lucide-react";
import * as React from "react";
import { NavMockChats } from "@/components/chat-prototype/nav-mock-chats";
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
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { useProjectSwitcher } from "@/hooks/use-project-switcher";
import { mockEngine } from "@/lib/chat-mock/use-mock-chat";
import { cn } from "@/lib/utils";

// Wrap a Hugeicon so it can be used interchangeably with a Lucide icon
// component (both are rendered as `<item.icon />`). All Hugeicon wrappers
// get the `hugeicon` class so the global CSS in app.css can enforce
// `currentColor` + a 1px stroke weight to match Lucide icons in the sidebar.
function makeHugeicon(
    iconData: React.ComponentProps<typeof HugeiconsIcon>["icon"],
): React.FC<{ className?: string }> {
    const Cmp: React.FC<{ className?: string }> = ({ className }) => (
        <HugeiconsIcon icon={iconData} className={cn("hugeicon", className)} />
    );
    return Cmp;
}

const EntranceStairs = makeHugeicon(EntranceStairsIcon);
const Archive04 = makeHugeicon(Archive04Icon);
const ChartAnalysis = makeHugeicon(ChartAnalysisIcon);

// User type for the sidebar — the canonical DB type from the core package.
// NavUser receives the full user object so it can access id, plan, etc.
export type SidebarUser = SchemaType;

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: SidebarUser;
    /** Override the logo height. Default is h-5 */
    logoClassName?: string;
}

const data = {
    navMain: [
        {
            title: "Welcome",
            url: "/app",
            icon: LayoutGrid,
            isActive: true,
        },
        {
            title: "New Chat",
            url: "/app",
            icon: Plus,
        },
        {
            title: "Projects",
            url: "/app",
            icon: GalleryVerticalEnd,
        },
        {
            title: "Documents",
            url: "/app",
            icon: Archive04,
        },
        {
            title: "Budget",
            url: "/app",
            icon: ChartAnalysis,
        },
        {
            title: "Property Profile",
            url: "/app",
            icon: EntranceStairs,
        },
    ],
    projects: [
        {
            name: "Bathroom Renovation",
            url: "#",
        },
        {
            name: "Roof Extension",
            url: "#",
        },
        {
            name: "Windows Replacement",
            url: "#",
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
    const { activeProject } = useProjectSwitcher();
    const [conversations, setConversations] = React.useState<
        { id: string; title: string }[]
    >([]);

    React.useEffect(() => {
        const query = activeProject
            ? `?projectId=${encodeURIComponent(activeProject.id)}`
            : "";
        void fetch(`/api/conversations${query}`, { credentials: "include" })
            .then((response) => (response.ok ? response.json() : null))
            .then((result: { items?: { id: string; title: string }[] } | null) => {
                if (result?.items) setConversations(result.items);
            });
    }, [activeProject]);

    const renameConversation = async (
        item: { id: string; title: string },
        title: string,
    ) => {
        const response = await fetch(`/api/conversations/${item.id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ title }),
        });
        if (response.ok) {
            const updated = (await response.json()) as { id: string; title: string };
            setConversations((items) =>
                items.map((conversation) =>
                    conversation.id === updated.id ? updated : conversation,
                ),
            );
        }
    };

    const deleteConversation = async (item: { id: string; title: string }) => {
        if (!window.confirm(`Delete “${item.title}”?`)) return;
        const response = await fetch(`/api/conversations/${item.id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (response.ok) {
            setConversations((items) =>
                items.filter((conversation) => conversation.id !== item.id),
            );
        }
    };

    // While the iss-017 chat-layout prototype route is active, the sidebar
    // adopts the mock chat: "New chat" creates a session and "Recent chats"
    // lists the mock sessions (see NavMockChats).
    const pathname = useLocation({ select: (loc) => loc.pathname });
    const onPrototypeChat = pathname.startsWith("/app/prototype-chat");

    const navMain = React.useMemo(
        () =>
            data.navMain.map((item) => {
                if (item.title === "Overview") {
                    return {
                        ...item,
                        title: activeProject?.name ?? item.title,
                    };
                }
                if (onPrototypeChat && item.title === "New Chat") {
                    return {
                        ...item,
                        onClick: () => mockEngine.createSession(),
                    };
                }
                if (item.title === "New Chat") {
                    return { ...item, url: "/app/chat/new" };
                }
                return item;
            }),
        [activeProject?.name, onPrototypeChat],
    );

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
                                    "ml-1 cursor-pointer",
                                    "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100",
                                )}
                            />
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
                <NavProjects title="Projects" projects={data.projects} />
                {onPrototypeChat ? (
                    <NavMockChats />
                ) : (
                    <NavChats
                        title="Recent chats"
                        conversations={conversations}
                        onRename={renameConversation}
                        onDelete={deleteConversation}
                    />
                )}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
