import { Sidebar } from "lucide-react";
import ResponsiveBreadcrumbs from "@/components/nav/responsive-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

interface NavBreadcrumbProps {
	crumbs: { title: string; path: string }[];
}

export function NavBreadcrumb({ crumbs }: NavBreadcrumbProps) {
	const { state } = useSidebar();

	return (
		<header className="mb-3 flex h-11 shrink-0 items-center gap-4">
			<div className="flex items-center gap-2 px-4">
				{state === "collapsed" && (
					<>
						<SidebarTrigger className="ml-1">
							<Sidebar />
						</SidebarTrigger>
						<Separator orientation="vertical" className="mr-2 h-4" />
					</>
				)}
				<ResponsiveBreadcrumbs crumbs={crumbs} />
			</div>
		</header>
	);
}
