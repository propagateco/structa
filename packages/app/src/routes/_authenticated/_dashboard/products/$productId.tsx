import { createFileRoute, useRouterState, useNavigate, useLocation } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { productQueryOptions } from '@/clients/product/product.query.client';
import {
	useUpdateProduct,
	useDeleteProduct,
	useCreateProduct,
	usePublishProduct,
} from '@/clients/product/product.mutation.client';
import { NavigationHeader } from '@/components/nav/nav-header';
import { Badge } from '@/components/ui/badge';
import { ProductHero } from '@/components/product/ProductHero';
import { ProductCalendar } from '@/components/product/ProductCalendar';
import { useState, useEffect, useRef } from 'react';
import { ProductModel } from '@core/product/product.model';
import { ProductInterface } from '@core/product/product.interface';
import { toast } from 'sonner';
import ResponsiveBreadcrumbs from '@/components/nav/responsive-breadcrumbs';
import { PageContainer } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAutoSave } from '@/hooks/use-auto-save';
import { Saving } from '@/components/ui/saving';
import { Skeleton } from '@/components/ui/skeleton';

// Stub content type for now
type ContentByWeekAndDay = Record<string, any>;

export const Route = createFileRoute('/_authenticated/_dashboard/products/$productId')({
	component: RouteComponent,
	staticData: {
		title: 'Product Details',
	},
	head: () => ({
		meta: [{ title: 'Product | Structa' }],
	}),
});

function RouteComponent() {
	const navigate = useNavigate();
	const location = useLocation();
	const matches = useRouterState({ select: (s) => s.matches });
	const crumbs = matches
		.map((match) => ({
			title: (match.staticData as { title: string }).title,
			path: match.pathname,
		}))
		.filter((crumb) => Boolean(crumb.title));
	const { productId } = Route.useParams();
	
	// Check if this is a new product from URL search params
	const isNewFromSearch = location.search.includes('new=true');

	// Only fetch if not a new product
	const productQuery = useQuery({
		...productQueryOptions(productId),
		enabled: !isNewFromSearch,
	});
	const createProductMutation = useCreateProduct();
	const updateProductMutation = useUpdateProduct();
	const deleteProductMutation = useDeleteProduct();
	const publishProductMutation = usePublishProduct();

	// Track if this is a new product
	const isNewProduct = isNewFromSearch || productQuery.isError || !productQuery.data;
	const hasCreatedProduct = useRef(false);

	// Default values for new products
	const defaultProductData: ProductModel.QueryType = {
		id: productId,
		userId: '',
		appId: '',
		name: 'Untitled Product',
		description: 'Add a description for your product',
		coverImage: null,
		durationWeeks: 4,
		difficultyLevel: 'beginner',
		daysPerWeek: 3,
		trainingStyle: 'mixed',
		prerequisites: '',
		goals: '',
		metadata: null,
		active: true,
		publishedAt: null,
		publishedName: null,
		publishedDescription: null,
		publishedCoverImage: null,
		publishedDurationWeeks: null,
		publishedDifficultyLevel: null,
		publishedDaysPerWeek: null,
		publishedTrainingStyle: null,
		publishedPrerequisites: null,
		publishedGoals: null,
		publishedMetadata: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
	};

	const [productData, setProductData] = useState<ProductModel.QueryType>(
		productQuery.data?.product || defaultProductData
	);
	const [contentData, setContentData] = useState<ContentByWeekAndDay>({});

	// Track changes for auto-save
	const [hasChanges, setHasChanges] = useState(false);
	const [pendingUpdates, setPendingUpdates] = useState<ProductModel.MutateClientType>({});
	const isSaving = createProductMutation.isPending || updateProductMutation.isPending;

	// Track active image upload to prevent duplicates
	const activeImageUploadRef = useRef<string | null>(null);

	// Determine publish button state and badge visibility
	const currentProduct = productQuery.data?.product || productData;
	const hasUnpublishedChanges =
		!isNewProduct &&
		(!currentProduct.publishedAt || currentProduct.updatedAt > currentProduct.publishedAt);
	const canPublish =
		!isSaving &&
		!publishProductMutation.isPending &&
		(!isNewProduct || hasCreatedProduct.current) &&
		hasUnpublishedChanges;

	// Handle publish action with auto-save integration
	const handlePublish = async () => {
		// If there are pending changes, trigger auto-save first
		if (hasChanges && pendingUpdates && Object.keys(pendingUpdates).length > 0) {
			// Wait for auto-save to complete
			if (isNewProduct && !hasCreatedProduct.current) {
				// For new products, create first
				const createData = {
					id: productId,
					name: productData.name,
					description: productData.description,
					durationWeeks: productData.durationWeeks,
					difficultyLevel: productData.difficultyLevel,
					daysPerWeek: productData.daysPerWeek,
					trainingStyle: productData.trainingStyle,
					prerequisites: productData.prerequisites || undefined,
					goals: productData.goals || undefined,
				};

				await new Promise<void>((resolve, reject) => {
					createProductMutation.mutate(createData, {
						onSuccess: () => {
							hasCreatedProduct.current = true;
							setHasChanges(false);
							setPendingUpdates({});
							resolve();
						},
						onError: reject,
					});
				});
			} else {
				// For existing products, update first
				await new Promise<void>((resolve, reject) => {
					updateProductMutation.mutate(
						{ id: productId, updates: pendingUpdates },
						{
							onSuccess: () => {
								setPendingUpdates({});
								setHasChanges(false);
								resolve();
							},
							onError: reject,
						}
					);
				});
			}
		}

		// Now publish the product
		publishProductMutation.mutate(productId);
	};

	// Auto-save functionality
	useAutoSave({
		data: pendingUpdates,
		hasChanges,
		onSave: (data) => {
			if (isNewProduct && !hasCreatedProduct.current) {
				// Create the product
				hasCreatedProduct.current = true;
				const createData = {
					id: productId,
					name: productData.name,
					description: productData.description,
					durationWeeks: productData.durationWeeks,
					difficultyLevel: productData.difficultyLevel,
					daysPerWeek: productData.daysPerWeek,
					trainingStyle: productData.trainingStyle,
					prerequisites: productData.prerequisites || undefined,
					goals: productData.goals || undefined,
				};

				createProductMutation.mutate(
					{ ...createData },
					{
						onSuccess: () => {
							// After creation, any future saves should be updates
							setHasChanges(false);
							setPendingUpdates({});
							// Clear the query param to prevent issues on refresh
							navigate({ to: `/products/${productId}`, replace: true });
						},
					}
				);
			} else {
				// Check if image is already being uploaded
				if (data.coverImage && activeImageUploadRef.current) {
					console.log('Image upload already in progress, skipping duplicate');
					return;
				}

				// Track image upload if present
				if (data.coverImage) {
					activeImageUploadRef.current = `${Date.now()}-${data.coverImage.name}`;
				}

				// Update existing product
				updateProductMutation.mutate(
					{ id: productId, updates: data },
					{
						onSuccess: () => {
							// Clear all pending updates after successful save
							setPendingUpdates({});
							setHasChanges(false);
							activeImageUploadRef.current = null;
						},
						onError: () => {
							activeImageUploadRef.current = null;
						},
					}
				);
			}
		},
		isPending: isSaving,
		debounceMs: 2000,
		enabled: true,
	});

	const handleProductUpdate = (updates: ProductModel.MutateClientType) => {
		// Update local state (excluding the image file)
		const { coverImage, ...dataUpdates } = updates;

		// Update local state
		setProductData((prev) => ({ ...prev, ...dataUpdates }) as ProductModel.QueryType);

		// Track changes for auto-save
		setPendingUpdates((prev: ProductModel.MutateClientType) => ({
			...prev,
			...updates,
		}));
		setHasChanges(true);
	};

	// Update local state when query data changes
	useEffect(() => {
		if (productQuery.data?.product) {
			setProductData(productQuery.data.product);
			// Stub out content data for now
			setContentData({});
		}
	}, [productQuery.data]);

	const handleAddContent = async (
		_weekNumber: number,
		_dayNumber: number,
		_type: ProductInterface.ContentType
	) => {
		// Stub for now
		toast.info('Content functionality coming soon');
	};

	const handleDeleteContent = async (_contentId: string) => {
		// Stub for now
		toast.info('Content functionality coming soon');
	};

	// Show loading state only for existing products
	if (!isNewProduct && productQuery.isLoading) {
		return <ProductPageSkeleton />;
	}

	return (
		<>
			<NavigationHeader>
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-0.5">
						<ResponsiveBreadcrumbs
							crumbs={crumbs}
							base={{ title: 'Products', path: '/products' }}
							dynamicTitle={productData.name}
						/>
						{hasUnpublishedChanges && (
							<Badge className="text-xs px-2 py-1 animate-in fade-in duration-300">
								Draft
							</Badge>
						)}
					</div>
					<div className="flex items-center gap-3">
						<Saving
							isLoading={isSaving}
							isPublishing={publishProductMutation.isPending}
							error={
								updateProductMutation.isError ||
								createProductMutation.isError ||
								publishProductMutation.isError
							}
							product={
								!isNewProduct || hasCreatedProduct.current
									? currentProduct
									: undefined
							}
						/>
						<Button
							onClick={handlePublish}
							disabled={!canPublish}
							isLoading={publishProductMutation.isPending}
							size="xs"
							variant="outline"
						>
							<Upload className="h-4 w-4" />
							Publish
						</Button>
					</div>
				</div>
			</NavigationHeader>

			<PageContainer type="narrow">
				<ProductHero
					product={productQuery.data?.product || productData}
					onUpdate={handleProductUpdate}
				/>
				<div className="mt-12">
					<ProductCalendar
						productId={productId}
						durationWeeks={(productQuery.data?.product || productData).durationWeeks}
						content={contentData}
						onAddContent={handleAddContent}
						onUpdateContent={() => {}}
						onDeleteContent={handleDeleteContent}
					/>
				</div>

				{!isNewProduct && (
					<div className="mt-16 flex justify-start pb-8">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="destructive"
									disabled={deleteProductMutation.isPending}
								>
									Delete product
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										the product "{productData.name}" and all its associated
										content.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => deleteProductMutation.mutate(productId)}
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				)}
			</PageContainer>
		</>
	);
}

function ProductPageSkeleton() {
	return (
		<>
			<NavigationHeader>
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-2">
						{/* Breadcrumb skeleton */}
						<Skeleton className="h-4 w-20" />
						<span className="text-muted-foreground">/</span>
						<Skeleton className="h-4 w-32" />
					</div>
					<div className="flex items-center gap-3">
						{/* Saving status skeleton */}
						<Skeleton className="h-4 w-16" />
						{/* Publish button skeleton */}
						<Skeleton className="h-8 w-24" />
					</div>
				</div>
			</NavigationHeader>

			<PageContainer type="narrow">
				{/* Product Hero skeleton */}
				<div className="space-y-6">
					{/* Cover image skeleton */}
					<Skeleton className="w-full aspect-video rounded-lg" />

					{/* Title and description */}
					<div className="space-y-4">
						<Skeleton className="h-8 w-3/4" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
					</div>

					{/* Product details grid */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="space-y-2">
							<Skeleton className="h-3 w-20" />
							<Skeleton className="h-6 w-24" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-3 w-20" />
							<Skeleton className="h-6 w-24" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-3 w-20" />
							<Skeleton className="h-6 w-24" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-3 w-20" />
							<Skeleton className="h-6 w-24" />
						</div>
					</div>
				</div>

				{/* Product Calendar skeleton */}
				<div className="mt-12 space-y-4">
					<Skeleton className="h-6 w-32" />

					{/* Calendar grid */}
					<div className="space-y-4">
						{/* Week 1 */}
						<div className="border rounded-lg p-4 space-y-3">
							<Skeleton className="h-5 w-24" />
							<div className="grid grid-cols-3 gap-3">
								<Skeleton className="h-24 rounded" />
								<Skeleton className="h-24 rounded" />
								<Skeleton className="h-24 rounded" />
							</div>
						</div>

						{/* Week 2 */}
						<div className="border rounded-lg p-4 space-y-3">
							<Skeleton className="h-5 w-24" />
							<div className="grid grid-cols-3 gap-3">
								<Skeleton className="h-24 rounded" />
								<Skeleton className="h-24 rounded" />
								<Skeleton className="h-24 rounded" />
							</div>
						</div>
					</div>
				</div>
			</PageContainer>
		</>
	);
}
