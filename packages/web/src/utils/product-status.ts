// TODO: Replace with actual ProductModel from @core when available
// Currently using stub types until product model is implemented

export type ProductModelStub = {
	id: string;
	name: string;
	publishedAt?: string | null;
	updatedAt: string;
};

export function getProductStatus(
	product: ProductModelStub | null | undefined,
): "published" | "draft" | "none" {
	if (!product) return "none";
	return product.publishedAt ? "published" : "draft";
}

export function isProductPublished(
	product: ProductModelStub | null | undefined,
): boolean {
	return getProductStatus(product) === "published";
}

export function isProductDraft(
	product: ProductModelStub | null | undefined,
): boolean {
	return getProductStatus(product) === "draft";
}
