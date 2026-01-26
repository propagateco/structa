import type { ProductModel } from "@core/product/product.model";
import { computeSHA256Checksum } from "@core/storage/storage.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { productQueryOptions } from "./product.query.client";

export const useCreateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createProduct"],
		mutationFn: async (
			data: Omit<ProductModel.MutateServerType, "userId" | "appId"> & {
				id?: string;
			},
		) => {
			const response = await api.product.$post({ json: data });
			if (!response.ok) {
				throw new Error("Failed to create product");
			}
			return response.json();
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			queryClient.invalidateQueries({ queryKey: ["product", data.id] });
		},
		onError: () => {
			toast.error("Failed to create product");
		},
	});
};

export const useUpdateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["updateProduct"],
		mutationFn: async ({
			id,
			updates,
		}: {
			id: string;
			updates: ProductModel.MutateClientType;
		}) => {
			let coverImageKey: string | undefined;
			console.log("Mutation updates: ", updates);

			// Handle image upload if provided
			if (updates.coverImage) {
				// Get the pre-signed URL from the API
				const urlResponse = await api.storage.upload.product.cover[
					":productId"
				].$put({
					param: { productId: id },
					json: {
						contentType: updates.coverImage.type,
						size: updates.coverImage.size,
						checksum: await computeSHA256Checksum(updates.coverImage),
					},
				});

				if (!urlResponse.ok) {
					throw new Error("Failed to get pre-signed URL");
				}

				// Extract the pre-signed URL from the response
				const { url, key } = await urlResponse.json();
				coverImageKey = key;
				console.log("Cover image key: ", coverImageKey);

				// Upload the file to S3 using the pre-signed URL
				const uploadResponse = await fetch(url, {
					method: "PUT",
					body: updates.coverImage,
					headers: {
						"Content-Type": updates.coverImage.type,
					},
				});

				if (!uploadResponse.ok) {
					throw new Error("Failed to upload cover image to storage");
				}
			}

			// Prepare the update data (remove image from updates)
			const { coverImage, ...productUpdates } = updates;
			const updateData = coverImageKey
				? { ...productUpdates, coverImage: coverImageKey }
				: productUpdates;

			// Update product data
			const response = await api.product[":id"].$patch({
				param: { id },
				json: updateData,
			});

			if (!response.ok) {
				throw new Error("Failed to update product");
			}

			return response.json();
		},
		onMutate: async ({ id, updates }) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["product", id] });

			// Snapshot the previous value
			const previousProduct = queryClient.getQueryData(
				productQueryOptions(id).queryKey,
			);

			// Optimistically update to the new value
			if (previousProduct) {
				const { product, content } = previousProduct as any;
				const optimisticProduct = {
					...product,
					// Always update the updatedAt timestamp to reflect changes
					updatedAt: new Date(),
				};

				// Apply regular updates
				Object.assign(optimisticProduct, updates);

				// If there's an image, create a temporary URL for preview
				if (updates.coverImage) {
					optimisticProduct.coverImage = URL.createObjectURL(
						updates.coverImage,
					);
				}

				queryClient.setQueryData(productQueryOptions(id).queryKey, {
					product: optimisticProduct,
					content,
				});
			}

			// Return a context with the previous values
			return { previousProduct, id };
		},
		onError: (error, variables, context) => {
			// If the mutation fails, use the context to roll back
			if (context) {
				queryClient.setQueryData(
					productQueryOptions(context.id).queryKey,
					context.previousProduct,
				);
			}
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update pricing";
			console.log(errorMessage);
			toast.error("Failed to update product. Please try again.");
		},
		onSettled: (data, error, variables) => {
			// Always refetch after error or success
			queryClient.invalidateQueries({ queryKey: ["products"] });
			queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
		},
	});
};

export const useDeleteProduct = (options?: { skipNavigation?: boolean }) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const router = useRouterState();

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await api.product[":id"].$delete({ param: { id } });
			if (!response.ok) {
				throw new Error("Failed to delete product");
			}
			return response.json();
		},
		onSuccess: (_, deletedProductId) => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			toast.success("Product deleted successfully");

			// Check if we're currently on the deleted product's page
			const currentLocation = router.location;
			const isOnDeletedProductPage = currentLocation.pathname.includes(
				`/products/${deletedProductId}`,
			);

			// Always redirect if we're on the deleted product's page (can't stay on deleted product)
			// Otherwise, only redirect if skipNavigation is not explicitly set to true
			if (isOnDeletedProductPage || !options?.skipNavigation) {
				navigate({ to: "/products" });
			}
		},
		onError: () => {
			toast.error("Failed to delete product");
		},
	});
};

/**
 * Publish Product Mutation
 * ------------------------
 *
 * Publishes draft product data to make it visible to end users.
 * This copies all current draft fields to published fields.
 */
export const usePublishProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["publishProduct"],
		mutationFn: async (productId: string) => {
			const response = await api.product[":id"].publish.$post({
				param: { id: productId },
			});
			if (!response.ok) {
				throw new Error(`Failed to publish product: ${response.status}`);
			}
			return response.json();
		},
		onMutate: async (productId) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["product", productId] });

			// Snapshot the previous value
			const previousProduct = queryClient.getQueryData(
				productQueryOptions(productId).queryKey,
			);

			// Optimistically update to published state
			if (previousProduct) {
				const { product, content } = previousProduct as any;
				const optimisticProduct = {
					...product,
					publishedAt: new Date(),
					// Copy all current draft fields to published fields
					publishedName: product.name,
					publishedDescription: product.description,
					publishedCoverImage: product.coverImage,
					publishedDurationWeeks: product.durationWeeks,
					publishedDifficultyLevel: product.difficultyLevel,
					publishedDaysPerWeek: product.daysPerWeek,
					publishedTrainingStyle: product.trainingStyle,
					publishedPrerequisites: product.prerequisites,
					publishedGoals: product.goals,
					publishedMetadata: product.metadata,
				};

				queryClient.setQueryData(productQueryOptions(productId).queryKey, {
					product: optimisticProduct,
					content,
				});
			}

			// Return a context with the previous values
			return { previousProduct, productId };
		},
		onSuccess: (data, productId) => {
			// Invalidate queries to refresh data
			queryClient.invalidateQueries({
				queryKey: ["product", productId],
			});
			queryClient.invalidateQueries({
				queryKey: ["products"],
			});
		},
		onError: (error, productId, context) => {
			// If the mutation fails, use the context to roll back
			if (context) {
				queryClient.setQueryData(
					productQueryOptions(context.productId).queryKey,
					context.previousProduct,
				);
			}
			toast.error("Failed to publish product. Please try again.");
			console.error("Failed to publish product:", error);
		},
	});
};
