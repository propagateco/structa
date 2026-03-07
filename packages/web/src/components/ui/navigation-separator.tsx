import type * as React from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type NavigationSeparatorProps = React.ComponentPropsWithoutRef<
	typeof Separator
>;

export function NavigationSeparator({
	className,
	...props
}: NavigationSeparatorProps) {
	return (
		<Separator
			orientation="vertical"
			className={cn("h-4 w-[1px] shrink-0 bg-border", className)}
			{...props}
		/>
	);
}
