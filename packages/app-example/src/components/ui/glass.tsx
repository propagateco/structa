import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassProps extends HTMLAttributes<HTMLDivElement> {
	blur?: "sm" | "md" | "lg" | "xl" | number;
	isLight?: boolean;
	saturation?: number;
}

const Glass = forwardRef<HTMLDivElement, GlassProps>(
	(
		{
			className,
			blur = "sm",
			isLight = false,
			saturation = 125,
			children,
			style,
			...props
		},
		ref,
	) => {
		const blurClasses = {
			sm: "backdrop-blur-sm",
			md: "backdrop-blur-md",
			lg: "backdrop-blur-lg",
			xl: "backdrop-blur-xl",
		};

		// Convert blur to numeric value for backdrop-filter
		const getBlurValue = (blur: "sm" | "md" | "lg" | "xl" | number): number => {
			if (typeof blur === "number") {
				return blur;
			}

			const blurValues = {
				sm: 4,
				md: 12,
				lg: 16,
				xl: 24,
			};

			return blurValues[blur];
		};

		return (
			<div
				ref={ref}
				className={cn(
					// Base glass effect
					"relative overflow-hidden rounded-md",
					// Background with opacity - darker for light backgrounds, lighter for dark backgrounds
					isLight ? "bg-ds-mono-400/5 " : "bg-paper/20",
					// Border for glass edge - adjust based on background
					"border border-white/20",
					// Shadows for depth
					"shadow-lg shadow-black/5",
					// Inner shadow for glass effect - adjust gradient based on background
					"before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none",
					isLight
						? "before:bg-gradient-to-b before:from-black/10 before:to-transparent"
						: "before:bg-gradient-to-b before:from-white/10 before:to-transparent",
					className,
				)}
				style={{
					...style,
					backdropFilter: `blur(${getBlurValue(blur)}px) saturate(${saturation}%)`,
				}}
				{...props}
			>
				{children}
			</div>
		);
	},
);

Glass.displayName = "Glass";

export { Glass };
