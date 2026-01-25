import React from "react";
import AppPlaceholderIcon from "@/assets/icons/AppPlaceholderIcon";
import { cn } from "@/lib/utils";

interface AppIconProps extends React.HTMLAttributes<HTMLDivElement> {
	src?: string | null;
}

const AppIcon = React.forwardRef<HTMLDivElement, AppIconProps>(
	({ src, className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				{...props}
				className={cn(
					"overflow-hidden relative flex flex-col items-center justify-center bg-transparent",
					className,
				)}
				style={{
					borderRadius: "calc(23% + 1px)",
				}}
			>
				{src ? (
					<img src={src} alt="App Icon Image" />
				) : (
					<AppPlaceholderIcon className={cn("block")} />
				)}
			</div>
		);
	},
);

AppIcon.displayName = "AppIcon";

export { AppIcon };
