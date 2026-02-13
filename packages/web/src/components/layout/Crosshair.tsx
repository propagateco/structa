import type React from "react";
import { cn } from "@/lib/utils";

interface CrosshairProps {
	position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	className?: string;
}

/**
 * Crosshair marker for section corners
 * A crosshair SVG that marks corners of containers with relative positioning
 */
export const Crosshair: React.FC<CrosshairProps> = ({
	position,
	className,
}) => {
	const positionStyles: Record<string, React.CSSProperties> = {
		"top-left": { top: "-11px", left: "-10.5px" },
		"top-right": { top: "-11px", right: "-10.5px" },
		"bottom-left": { bottom: "-11px", left: "-10.5px" },
		"bottom-right": { bottom: "-11px", right: "-10.5px" },
	};

	return (
		<svg
			className={cn(
				"absolute text-ds-azure dark:text-ds-teal pointer-events-none z-20",
				className,
			)}
			style={positionStyles[position]}
			width="20"
			height="21"
			viewBox="0 0 20 21"
			fill="none"
			stroke="currentColor"
			role="img"
			aria-label="Corner crosshair marker"
		>
			<title>Corner crosshair</title>
			<path d="M10 0.332031V20.332" />
			<path d="M0 10.332L20 10.332" />
		</svg>
	);
};
