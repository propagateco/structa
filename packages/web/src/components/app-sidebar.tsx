import { Link } from "@tanstack/react-router";
import {
	Frame,
	LifeBuoy,
	Map,
	PieChart,
	Send,
	Settings2,
	SquareTerminal,
} from "lucide-react";
import type * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
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
	/** Override the logo height. Default is h-4 */
	logoClassName?: string;
}

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "/app",
			icon: SquareTerminal,
			isActive: true,
		},
		{
			title: "Getting Started",
			url: "#",
			icon: SquareTerminal,
			items: [
				{
					title: "Upload Floor Plan",
					url: "#",
				},
				{
					title: "Describe Renovation",
					url: "#",
				},
				{
					title: "AI Recommendations",
					url: "#",
				},
			],
		},
		{
			title: "Settings",
			url: "/app/settings",
			icon: Settings2,
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
			icon: Frame,
		},
		{
			name: "Loft Conversion",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Extension",
			url: "#",
			icon: Map,
		},
	],
};

export function AppSidebar({ user, logoClassName, ...props }: AppSidebarProps) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to="/app">
								<img
									src="/wordmark-light.webp"
									alt="Structa"
									className={`h-4 dark:hidden ${logoClassName ?? ""}`}
								/>
								<img
									src="/wordmark-dark.webp"
									alt="Structa"
									className={`h-4 hidden dark:block ${logoClassName ?? ""}`}
								/>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
