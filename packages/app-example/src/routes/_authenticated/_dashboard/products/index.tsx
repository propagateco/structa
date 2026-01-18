import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQueryOptions } from "@/clients/product/product.query.client";
import { userQueryOptions } from "@/clients/user/user.query.client";
import { ProductEmptyState } from "@/components/product/ProductEmptyState";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Box, Plus } from "lucide-react";
import { ProductInterface } from "@core/product/product.interface";
import { createId } from "@paralleldrive/cuid2";
import { NavigationHeader } from "@/components/nav/nav-header";

export const Route = createFileRoute("/_authenticated/_dashboard/products/")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Products | Structa" }],
  }),
  staticData: {
    title: "Products",
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const productsQuery = useSuspenseQuery(productsQueryOptions);
  const userQuery = useSuspenseQuery(userQueryOptions);
  const user = userQuery.data;
  const products = productsQuery.data.products || [];
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on search
  const filteredProducts = products.filter(
    (product: any) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle keyboard shortcut for creating new product
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "c") {
        e.preventDefault();
        handleCreateProduct();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleCreateProduct = () => {
    // Generate a new product ID using cuid2 (same as backend)
    const newProductId = createId();
    navigate({
      to: `/products/${newProductId}`,
      search: { new: true },
    });
  };

  const handleProductClick = (productId: string) => {
    navigate({ to: `/products/${productId}` });
  };

  // Map products to the card data format
  const productCardData: ProductInterface.ProductCardData[] =
    filteredProducts.map((product: any) => ({
      id: product.id,
      title: product.name,
      description: product.description || "",
      coverImage: product.coverImage,
      durationWeeks: product.durationWeeks,
      difficultyLevel: product.difficultyLevel,
      trainingStyle: product.trainingStyle,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      publishedAt: product.publishedAt,
      userId: product.userId,
    }));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <NavigationHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="pl-2">Products</h1>
            <Button variant="outline" size="xs">
              <Box />
              All products
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {/* <div className="relative w-40">
							<Input
								placeholder="Search products..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="h-5 text-xs font-medium"
							/>
						</div> */}
            <Button variant="ghost" size="xs" onClick={handleCreateProduct}>
              <Plus />
              Create product
            </Button>
          </div>
        </div>
      </NavigationHeader>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">
        {productCardData.length === 0 ? (
          searchQuery ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            <ProductEmptyState onCreateClick={handleCreateProduct} />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productCardData.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product.id)}
                user={user}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
