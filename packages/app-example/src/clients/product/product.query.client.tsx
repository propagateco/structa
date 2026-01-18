import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";
import * as ProductModel from "@core/product/product.model";
import { DEFAULT_STALE_TIME } from "@core/utils/constants";

export async function getProducts() {
    const response = await api.product.$get();
    if (response.status === 404) {
        return { products: [] };
    }
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    const data = (await response.json()) as any[];
    console.log("getProducts: ", data);

    // Parse each product with the API schema (includes date transformations)
    return {
        products: (data || []).map((product: any) =>
            ProductModel.Query.parse(product)
        ),
    };
}

export async function getProduct(id: string) {
    const response = await api.product[":id"].$get({ param: { id } });
    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }
    const data = (await response.json()) as { product: any; content?: any };

    // Parse and transform the product data (includes date transformations)
    return {
        product: ProductModel.Query.parse(data.product),
        content: data.content, // Keep content as-is for now
    };
}

export const productsQueryOptions = queryOptions({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_STALE_TIME,
});

export const productQueryOptions = (id: string) =>
    queryOptions({
        queryKey: ["product", id],
        queryFn: () => getProduct(id),
        staleTime: DEFAULT_STALE_TIME,
    });
