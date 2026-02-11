// TODO: STUB - Replace with actual BrandingModel and UserModel from @core when available
// Currently using stub types until models are implemented

export type BrandingModelStub = {
	icon?: string | null;
	publishedAt?: string | null;
	updatedAt: string;
};

export type UserModelStub = {
	id: string;
	name: string;
	email: string;
	image?: string | null;
	workspaceName: string;
	plan?: string;
};

import {
	Box,
	Frame,
	GalleryVerticalEnd,
	Globe,
	LayoutGrid,
	LifeBuoy,
	MessageCircleQuestion,
	UsersRound,
	Wallet,
} from "lucide-react";
import type * as React from "react";
import { NavMain } from "@/components/nav/nav-main";
import { NavSecondary } from "@/components/nav/nav-secondary";
import { NavUser } from "@/components/nav/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavProductsWrapper } from "./nav-products-wrapper";
import { NavWorkspace } from "./nav-workspace";

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "/",
			parent: "",
			icon: LayoutGrid,
		},
		{
			title: "Members",
			url: "#", // TODO: Replace with actual members route when implemented
			parent: "members",
			icon: UsersRound,
		},
		{
			title: "Sales",
			url: "#", // TODO: Replace with actual sales route when implemented
			parent: "sales",
			icon: Wallet,
		},
	],
	navPlatform: [
		{
			title: "Products",
			url: "#", // TODO: Replace with actual products route when implemented
			parent: "products",
			icon: Box,
		},
		{
			title: "Design",
			url: "#", // TODO: Replace with actual design/branding route when implemented
			parent: "design",
			icon: Frame,
		},
		{
			title: "Media Library",
			url: "#", // TODO: Replace with actual media route when implemented
			parent: "media",
			icon: GalleryVerticalEnd,
		},
		{
			title: "Releases",
			url: "#", // TODO: Replace with actual releases/leases route when implemented
			parent: "leases",
			icon: Globe,
		},
	],
	navSecondary: [
		{
			title: "Help Centre",
			url: "#",
			icon: LifeBuoy,
		},
		{
			title: "Contact Us",
			url: "#",
			icon: MessageCircleQuestion,
		},
	],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	currentPathname: string;
	user: UserModelStub;
	branding: BrandingModelStub;
}

export function AppSidebar({
	currentPathname,
	user,
	branding,
	...props
}: AppSidebarProps) {
	return (
		<Sidebar variant="inset" {...props} className="group">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="flex flex-row items-center justify-between gap-2 shrink-0">
						<NavWorkspace user={user} branding={branding} />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} currentPathname={currentPathname} />
				<NavMain
					title="App"
					items={data.navPlatform}
					currentPathname={currentPathname}
				/>
				<NavProductsWrapper />
			</SidebarContent>
			<SidebarFooter>
				<NavSecondary
					items={data.navSecondary}
					currentPathname={currentPathname}
					className="mt-auto"
				/>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
