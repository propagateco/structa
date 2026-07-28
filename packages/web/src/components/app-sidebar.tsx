import {
    EntranceStairsIcon,
    Archive04Icon,
    ChartAnalysisIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { SchemaType } from "@structa/core/user/user.model";
import { Link } from "@tanstack/react-router";
import { GalleryVerticalEnd, LayoutGrid, Plus } from "lucide-react";
import * as React from "react";
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
            isActive: true,
        },
        {
            title: "Projects",
            url: "/app",
            icon: GalleryVerticalEnd,
            isActive: true,
        },
        {
            title: "Documents",
            url: "/app",
            icon: Archive04,
            isActive: true,
        },
        {
            title: "Budget",
            url: "/app",
            icon: ChartAnalysis,
            isActive: true,
        },
        {
            title: "Property Profile",
            url: "/app",
            icon: EntranceStairs,
            isActive: true,
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

    const navMain = React.useMemo(
        () =>
            data.navMain.map((item) =>
                item.title === "Overview"
                    ? {
                          ...item,
                          title: activeProject?.name ?? item.title,
                      }
                    : item,
            ),
        [activeProject?.name],
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
                <NavChats title="Recent chats" projects={data.chats} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
