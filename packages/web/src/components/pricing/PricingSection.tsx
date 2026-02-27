import { cn } from "@/lib/utils";
import { PricingTierBar, type PricingTierBarProps } from "./PricingTierBar";

export interface PricingTier extends Omit<PricingTierBarProps, "className"> {
	/** Unique identifier for the tier */
	id?: string;
}

export interface PricingSectionProps {
	/** Array of pricing tiers to display */
	tiers: PricingTier[];
	/** Section title - defaults to "Pricing" */
	title?: string;
	/** Current price display (e.g., "$179 /per year") */
	currentPrice?: number;
	/** Currency symbol - defaults to £ */
	currency?: string;
	/** Optional description text below the current price */
	description?: string;
	/** Additional CSS classes */
	className?: string;
}

/**
 * A pricing section component matching the Digital Creator Club design.
 * Displays the current price, a description, and multiple pricing tier bars.
 */
export function PricingSection({
	tiers,
	title = "Pricing",
	currentPrice,
	currency = "£",
	description,
	className,
}: PricingSectionProps) {
	// Find the current (first non-sold-out) tier price if not specified
	const displayPrice =
		currentPrice ?? tiers.find((t) => !t.isSoldOut)?.price ?? 0;

	return (
		<div className={cn("space-y-3", className)}>
			{/* Title */}
			<p className="text-muted-foreground">{title}</p>

			{/* Current price display */}
			<div>
				<p className="text-3xl font-semibold text-foreground">
					{currency}
					{displayPrice}{" "}
					<span className="text-sm font-normal text-muted-foreground">
						/per year
					</span>
				</p>
				{description && (
					<p className="text-sm text-muted-foreground">{description}</p>
				)}
			</div>

			{/* Tier bars */}
			<div className="space-y-3">
				{tiers.map((tier, index) => (
					<PricingTierBar
						key={tier.id ?? index}
						price={tier.price}
						currency={tier.currency ?? currency}
						isSoldOut={tier.isSoldOut}
						filledCount={tier.filledCount}
						barCount={tier.barCount}
					/>
				))}
			</div>
		</div>
	);
}
