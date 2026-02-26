import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

const crosshairVariants = cva(
	"absolute text-ds-azure dark:text-ds-teal pointer-events-none z-20",
	{
		variants: {
			size: {
				sm: "",
				md: "",
				lg: "",
			},
		},
	},
);

interface CrosshairProps extends VariantProps<typeof crosshairVariants> {
	position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	className?: string;
}

/**
 * Size configurations for the crosshair component
 * Each size defines dimensions and position offset
 */
const SIZE_CONFIGS = {
	sm: { width: 14, height: 15, offset: -7.5 },
	md: { width: 28, height: 29, offset: -15 },
	lg: { width: 36, height: 37, offset: -19 },
};

/**
 * Crosshair marker for section corners
 * A crosshair SVG that marks corners of containers with relative positioning
 */
export const Crosshair: React.FC<CrosshairProps> = ({
	position,
	size,
	className,
}) => {
	// Use size config if provided, otherwise use default dimensions
	const config = size
		? SIZE_CONFIGS[size]
		: { width: 20, height: 21, offset: -10.5 };

	const positionStyles: Record<string, React.CSSProperties> = {
		"top-left": { top: `${config.offset}px`, left: `${config.offset}px` },
		"top-right": { top: `${config.offset}px`, right: `${config.offset}px` },
		"bottom-left": { bottom: `${config.offset}px`, left: `${config.offset}px` },
		"bottom-right": {
			bottom: `${config.offset}px`,
			right: `${config.offset}px`,
		},
	};

	// Calculate center point for the viewBox
	const centerX = config.width / 2;
	const centerY = config.height / 2;

	return (
		<svg
			className={cn(crosshairVariants({ size }), className)}
			style={positionStyles[position]}
			width={config.width}
			height={config.height}
			viewBox={`0 0 ${config.width} ${config.height}`}
			fill="none"
			stroke="currentColor"
			role="img"
			aria-label="Corner crosshair marker"
		>
			<title>Corner crosshair</title>
			<path d={`M${centerX} 0V${config.height}`} />
			<path d={`M0 ${centerY}L${config.width} ${centerY}`} />
		</svg>
	);
};
