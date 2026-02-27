import { cn } from "@/lib/utils";

export interface PricingTierBarProps {
	/** The price value (e.g., 99) */
	price: number;
	/** Currency symbol - defaults to £ */
	currency?: string;
	/** Whether this tier is sold out */
	isSoldOut?: boolean;
	/** Number of spots already filled/taken (default: 0) */
	filledCount?: number;
	/** Total number of bars to display (default: 50) */
	barCount?: number;
	/** Additional CSS classes */
	className?: string;
}

/** Number of vertical bars per tier (matching reference design) */
const DEFAULT_BAR_COUNT = 50;

/**
 * A pricing tier bar component matching the Digital Creator Club design.
 * Displays a price label with optional sold out badge, followed by
 * a row of small vertical bars showing availability.
 *
 * - Sold out tiers: All bars filled with success green
 * - Current tier: Filled bars in foreground, unfilled in muted
 */
export function PricingTierBar({
	price,
	currency = "£",
	isSoldOut = false,
	filledCount = 0,
	barCount = DEFAULT_BAR_COUNT,
	className,
}: PricingTierBarProps) {
	// Generate array of bar indices
	const bars = Array.from({ length: barCount }, (_, i) => i);

	return (
		<div className={cn("space-y-2", className)}>
			{/* Label row: "$99 tier" + optional "Sold out" badge */}
			<p className="flex items-center gap-2 text-xs text-muted-foreground">
				{currency}
				{price} tier
				{isSoldOut && (
					<span className="inline-flex items-center rounded-[4px] border border-border bg-secondary px-[4px] py-[2px] text-[8px] font-semibold uppercase text-secondary-foreground">
						Sold out
					</span>
				)}
			</p>

			{/* Bar row: individual vertical bars */}
			<div className="flex flex-wrap gap-1">
				{bars.map((index) => {
					// Determine if this bar is "filled" (spot taken)
					const isFilled = isSoldOut || index < filledCount;

					return (
						<span
							key={index}
							className={cn(
								"h-[20px] w-[2px]",
								// Sold out: all bars filled with success green
								// Current tier: filled = foreground, unfilled = muted
								isSoldOut
									? "bg-success"
									: isFilled
										? "bg-foreground/55 dark:bg-foreground/75"
										: "bg-muted",
							)}
						/>
					);
				})}
			</div>
		</div>
	);
}
