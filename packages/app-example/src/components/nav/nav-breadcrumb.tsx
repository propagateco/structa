import { Sidebar } from "lucide-react";
import { Separator } from "../ui/separator";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import ResponsiveBreadcrumbs from "./responsive-breadcrumbs";

interface NavBreadcrumbProps {
	crumbs: { title: string; path: string }[];
}

export function NavBreadcrumb({ crumbs }: NavBreadcrumbProps) {
	const { state } = useSidebar();

	return (
		<header className="flex h-11 shrink-0 items-center gap-4 mb-3">
			<div className="flex items-center gap-2 px-4">
				{state === "collapsed" && (
					<>
						<SidebarTrigger className="ml-1 text-text-muted">
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
