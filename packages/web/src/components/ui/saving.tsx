// TODO: STUB - Replace with actual AppModel, BrandingModel, ProductModel from @core when available
// Currently using stub types until models are implemented

export interface AppModelStub {
	publishedAt?: string | null;
	updatedAt: string;
}

export interface BrandingModelStub {
	icon?: string | null;
	publishedAt?: string | null;
	updatedAt: string;
}

export interface ProductModelStub {
	id: string;
	name: string;
	publishedAt?: string | null;
	updatedAt: string;
}

import { cn } from "@/lib/utils";
import { getBrandingStatusInfo } from "@/utils/branding-status";
import { getProductStatusInfo } from "@/utils/product-status";
import { MutationDot, type MutationState } from "./dot";

export interface SavingProps {
	isLoading?: boolean;
	isPublishing?: boolean;
	error?: boolean;
	product?: ProductModelStub;
	branding?: BrandingModelStub;
	app?: AppModelStub;
	wasRecentlyPublished?: boolean;
	className?: string;
}

export function Saving({
	isLoading = false,
	isPublishing = false,
	error = false,
	product,
	branding,
	app,
	wasRecentlyPublished = false,
	className,
}: SavingProps) {
	// Determine the state to display
	const getMutationState = (): MutationState => {
		if (error) {
			return "error";
		}
		if (isPublishing) {
			return "publishing";
		}
		if (isLoading) {
			return "saving";
		}

		// If recently published, show published state
		if (wasRecentlyPublished) {
			return "published";
		}

		// If we have product data, check its status
		if (product) {
			const productStatus = getProductStatusInfo(product);

			// Published and up to date
			if (productStatus.type === "success") {
				return "published";
			}
		}

		// If we have branding and app data, check their status
		if (branding && app) {
			const brandingStatus = getBrandingStatusInfo(branding, app);

			// Published and up to date
			if (brandingStatus.type === "success") {
				return "published";
			}
		}

		// Default to saved state
		return "saved";
	};

	const mutationState = getMutationState();

	return (
		<div className="flex items-center">
			<MutationDot
				state={mutationState}
				textSize="text-xs"
				className={cn("text-text-secondary", className)}
			/>
		</div>
	);
}
