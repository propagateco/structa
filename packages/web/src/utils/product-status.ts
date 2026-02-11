// TODO: STUB - Replace with actual ProductModel from @core/product/product.model when available
// Currently using stub types until product model is implemented

export interface ProductModelStub {
	id: string;
	name: string;
	publishedAt?: string | null;
	updatedAt: string;
}

export interface ProductStatusInfo {
	type: "success" | "warning" | "info";
	label: string;
	detail: string;
}

/**
 * Get status info based on product state
 * This function can be reused across different components that need to display product status
 */
export const getProductStatusInfo = (
	product: ProductModelStub,
): ProductStatusInfo => {
	// Product is published and up to date
	if (product.publishedAt && product.updatedAt <= product.publishedAt) {
		return {
			type: "success",
			label: "Published",
			detail: "This product is published and visible to users.",
		};
	}

	// Product has unpublished changes
	if (product.publishedAt && product.updatedAt > product.publishedAt) {
		return {
			type: "warning",
			label: "Draft",
			detail: "This product has unpublished changes.",
		};
	}

	// Product has never been published
	if (!product.publishedAt) {
		return {
			type: "info",
			label: "Draft",
			detail: "This product has not been published yet.",
		};
	}

	// Default case (shouldn't reach here)
	return {
		type: "info",
		label: "Draft",
		detail: "Product status unknown.",
	};
};
