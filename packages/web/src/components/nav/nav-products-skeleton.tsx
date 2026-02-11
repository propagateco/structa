import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function NavProductsSkeleton() {
	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Products</SidebarGroupLabel>
			<SidebarMenu>
				{/* Show 5 skeleton items plus create button */}
				{[1, 2, 3, 4, 5].map((i) => (
					<SidebarMenuItem key={i}>
						<Skeleton className="h-8 w-full" />
					</SidebarMenuItem>
				))}
				<SidebarMenuItem>
					<Skeleton className="h-8 w-full" />
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
