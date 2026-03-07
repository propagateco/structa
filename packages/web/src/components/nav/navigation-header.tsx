import { Sidebar } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NavigationSeparator } from "../ui/navigation-separator";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";

interface NavigationHeaderProps {
	children?: ReactNode;
	title?: string;
	className?: string;
}

export function NavigationHeader({
	children,
	title,
	className,
}: NavigationHeaderProps) {
	const { state } = useSidebar();

	return (
		<header
			className={cn(
				"relative flex h-14 w-full shrink-0 items-center gap-4 border-b border-border px-4 text-sm font-medium",
				className,
			)}
		>
			{state === "collapsed" && (
				<SidebarTrigger>
					<Sidebar />
				</SidebarTrigger>
			)}
			{title ? (
				<div className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center text-sm font-medium text-foreground">
					{title}
				</div>
			) : null}
			{children && (
				<>
					{state === "collapsed" && <NavigationSeparator />}
					{children}
				</>
			)}
		</header>
	);
}
