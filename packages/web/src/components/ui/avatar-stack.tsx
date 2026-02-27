import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface AvatarItem {
	src: string;
	alt: string;
	fallback?: string;
}

interface AvatarStackProps {
	avatars: AvatarItem[];
	className?: string;
	maxDisplay?: number;
}

/**
 * AvatarStack - Displays overlapping avatars in a stack layout
 * Inspired by ui.sh creator avatars
 */
const AvatarStack = React.forwardRef<HTMLDivElement, AvatarStackProps>(
	({ avatars, className, maxDisplay = 3 }, ref) => {
		const displayAvatars = avatars.slice(0, maxDisplay);
		const remainingCount = avatars.length - maxDisplay;

		return (
			<div ref={ref} className={cn("flex shrink-0", className)}>
				{displayAvatars.map((avatar) => (
					<Avatar
						key={avatar.src}
						className={cn(
							"size-10 ring-2 ring-background dark:ring-neutral-950",
							index > 0 && "-ml-3", // Overlap avatars
						)}
					>
						<AvatarImage src={avatar.src} alt={avatar.alt} />
						<AvatarFallback>
							{avatar.fallback || avatar.alt.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				))}
				{remainingCount > 0 && (
					<Avatar className="size-10 ring-2 ring-background dark:ring-neutral-950 -ml-3">
						<AvatarFallback className="text-xs">
							+{remainingCount}
						</AvatarFallback>
					</Avatar>
				)}
			</div>
		);
	},
);
AvatarStack.displayName = "AvatarStack";

export { AvatarStack };
export type { AvatarStackProps, AvatarItem };
