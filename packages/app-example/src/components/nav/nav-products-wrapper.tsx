import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { createId } from '@paralleldrive/cuid2';
import { NavProducts } from './nav-products';
import { NavProductsSkeleton } from './nav-products-skeleton';
import { productsQueryOptions } from '@/clients/product/product.query.client';
import { useDeleteProduct } from '@/clients/product/product.mutation.client';

function NavProductsContent() {
	const { data, isLoading } = useQuery(productsQueryOptions);
	const navigate = useNavigate();
	const deleteProductMutation = useDeleteProduct({ skipNavigation: true });
	
	if (isLoading || !data) {
		return <NavProductsSkeleton />;
	}
	
	// Sort by most recently updated and limit to 5
	const sortedProducts = [...data.products]
		.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
		.slice(0, 5);
	
	// Transform products to match NavProducts format
	const products = sortedProducts.map((product) => ({
		id: product.id,
		name: product.name,
		url: `/products/${product.id}`,
	}));
	
	const handleCreateProduct = () => {
		// Generate a new product ID using cuid2 (same as backend)
		const newProductId = createId();
		navigate({ 
			to: `/products/${newProductId}`,
			search: { new: true }
		});
	};
	
	const handleDeleteProduct = (id: string) => {
		deleteProductMutation.mutate(id);
	};
	
	return <NavProducts products={products} onCreateProduct={handleCreateProduct} onDeleteProduct={handleDeleteProduct} />;
}

export function NavProductsWrapper() {
	return <NavProductsContent />;
}