// TODO: STUB - Replace with actual TanStack Query when product client is implemented
// Currently using mock data until product client is available

import { NavProducts } from "./nav-products";
import { NavProductsSkeleton } from "./nav-products-skeleton";

// Mock data for products
const MOCK_PRODUCTS = [
	{ id: "1", name: "Product 1", url: "/products/1" },
	{ id: "2", name: "Product 2", url: "/products/2" },
	{ id: "3", name: "Product 3", url: "/products/3" },
	{ id: "4", name: "Product 4", url: "/products/4" },
	{ id: "5", name: "Product 5", url: "/products/5" },
];

// Mock mutation functions
const handleCreateProduct = () => {
	// TODO: Implement actual product creation when product client is available
	console.log("Create product clicked - not implemented yet");
};

const handleDeleteProduct = (id: string) => {
	// TODO: Implement actual product deletion when product client is available
	console.log(`Delete product ${id} clicked - not implemented yet`);
};

export function NavProductsWrapper() {
	return (
		<NavProducts
			products={MOCK_PRODUCTS}
			onCreateProduct={handleCreateProduct}
			onDeleteProduct={handleDeleteProduct}
		/>
	);
}
