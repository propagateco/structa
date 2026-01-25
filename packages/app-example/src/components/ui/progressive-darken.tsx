import { type HTMLMotionProps, motion } from "motion/react";
import { cn } from "@/lib/utils";

export const GRADIENT_ANGLES = {
	top: 0,
	right: 90,
	bottom: 180,
	left: 270,
};

export type ProgressiveDarkenProps = {
	direction?: keyof typeof GRADIENT_ANGLES;
	darkenLayers?: number;
	className?: string;
	darkenIntensity?: number;
} & HTMLMotionProps<"div">;

export function ProgressiveDarken({
	direction = "bottom",
	darkenLayers = 8,
	className,
	darkenIntensity = 0.15,
	...props
}: ProgressiveDarkenProps) {
	const layers = Math.max(darkenLayers, 2);
	const segmentSize = 1 / (darkenLayers + 1);

	return (
		<div className={cn("relative", className)}>
			{Array.from({ length: layers }).map((_, index) => {
				const angle = GRADIENT_ANGLES[direction];
				const opacity = darkenIntensity * (1 - index / layers);

				const gradientStops = [
					index * segmentSize,
					(index + 1) * segmentSize,
					(index + 2) * segmentSize,
					(index + 3) * segmentSize,
				].map(
					(pos, posIndex) =>
						`rgba(0, 0, 0, ${posIndex === 1 || posIndex === 2 ? opacity : 0}) ${pos * 100}%`,
				);

				const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(
					", ",
				)})`;

				return (
					<motion.div
						key={index}
						className="pointer-events-none absolute inset-0 rounded-[inherit]"
						style={{
							background: gradient,
						}}
						{...props}
					/>
				);
			})}
		</div>
	);
}
