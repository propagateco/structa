import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

interface NavigationHeaderProps {
	children?: ReactNode;
	className?: string;
}

export function NavigationHeader({
	children,
	className,
}: NavigationHeaderProps) {
	return (
		<header
			className={cn(
				"flex h-12 shrink-0 items-center gap-2 border-b px-4",
				className,
			)}
		>
			<SidebarTrigger className="-ml-1" />
			{children && (
				<>
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					{children}
				</>
			)}
		</header>
	);
}
