// TODO: STUB - Replace with actual TanStack Query when product client is implemented
// Currently using mock data until product client is available

import { NavProducts } from "./nav-products";
import { NavProductsSkeleton } from "./nav-products-skeleton";

// Mock products data
const MOCK_PRODUCTS = [
	{
		id: "1",
		name: "Product 1",
		url: "#",
	},
	{
		id: "2",
		name: "Product 2",
		url: "#",
	},
	{
		id: "3",
		name: "Product 3",
		url: "#",
	},
	{
		id: "4",
		name: "Product 4",
		url: "#",
	},
	{
		id: "5",
		name: "Product 5",
		url: "#",
	},
];

export function NavProductsWrapper() {
	// TODO: Replace with actual useQuery when product client is implemented
	// const { data, isLoading } = useQuery(productsQueryOptions);

	// Simulating loading state
	// For now, we'll just return the mock products directly
	// since there's no actual TanStack Query set up for this yet

	const isLoading = false; // Simulating loaded state

	if (isLoading) {
		return <NavProductsSkeleton />;
	}

	// Sort by most recently updated and limit to 5
	// For mock data, we'll use the existing order
	const sortedProducts = MOCK_PRODUCTS.slice(0, 5);

	// Transform products to match NavProducts format
	const products = sortedProducts.map((product) => ({
		id: product.id,
		name: product.name,
		url: product.url,
	}));

	const handleCreateProduct = () => {
		// TODO: Implement product creation when TanStack Query is set up
		// const newProductId = createId();
		// navigate({
		//   to: `/products/${newProductId}`,
		//   search: { new: true },
		// });
		console.log("Create product - not implemented yet");
	};

	const handleDeleteProduct = (id: string) => {
		// TODO: Implement product deletion when TanStack Query is set up
		// deleteProductMutation.mutate(id);
		console.log(`Delete product ${id} - not implemented yet`);
	};

	return (
		<NavProducts
			products={products}
			onCreateProduct={handleCreateProduct}
			onDeleteProduct={handleDeleteProduct}
		/>
	);
}
