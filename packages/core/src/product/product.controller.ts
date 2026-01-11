export * as ProductController from "./product.controller";

import { ProductModel } from "./product.model";
import { ProductService } from "./product.service";
import { ProductContentModel } from "./product-content.model";
import { ProductContentService } from "./product-content.service";
import { z } from "zod";
import {
  buildObjectDirectoryKey,
  buildObjectKey,
} from "@/storage/storage.utils";
import { StorageController, StorageService } from "@/storage";
import { Resource } from "sst";

/**
 * Product CRUD Operations
 * ----------------------
 *
 * High-level operations for managing products
 */

export async function createProduct(params: {
  userId: string;
  appId: string;
  productData: Omit<Parameters<typeof ProductService.create>[0], 'userId' | 'appId'>;
}) {
  const { userId, appId, productData } = params;

  // Create the product
  const product = await ProductService.create({
    userId,
    appId,
    ...productData,
  });

  return product;
}

export async function updateProduct(params: {
  productId: string;
  updates: ProductModel.MutateServerType;
}) {
  const { productId, updates } = params;
  console.log(`Updating product ${productId}`);

  // Check if coverImage is being updated (key provided)
  if ("coverImage" in updates && updates.coverImage) {
    const coverImageKey = updates.coverImage;
    const oldCoverImageKey =
      await ProductService.coverImageKeyFromId(productId);

    // Build the full CDN URL for the new cover image
    const coverImageUrl = `${Resource.Cdn.url}/${coverImageKey}`;

    // Update the product with the full URL
    const product = await ProductService.update({
      id: productId,
      ...updates,
      coverImage: coverImageUrl,
    });

    // Delete the old cover image if it exists
    if (oldCoverImageKey) {
      const key = buildObjectKey({
        baseDirectory: "products",
        relativeDirectory: `product-${productId}/images`,
        objectName: oldCoverImageKey,
      });
      await StorageController.deleteImagesFromKey(key);
    }

    return product;
  }

  // Update the product without coverImage changes
  const product = await ProductService.update({
    id: productId,
    ...updates,
  });

  return product;
}

export async function getProductWithContent(productId: string) {
  // Get product and its content
  const [product, content] = await Promise.all([
    ProductService.fromId(productId),
    ProductContentService.fromProductId(productId),
  ]);

  if (!product) {
    throw new Error("Product not found");
  }

  // Organize content by week and day
  const organizedContent: Record<
    number,
    Record<number, ProductContentModel.SchemaType[]>
  > = {};

  content.forEach((item) => {
    if (!organizedContent[item.weekNumber]) {
      organizedContent[item.weekNumber] = {};
    }
    if (!organizedContent[item.weekNumber][item.dayNumber]) {
      organizedContent[item.weekNumber][item.dayNumber] = [];
    }
    organizedContent[item.weekNumber][item.dayNumber].push(item);
  });

  return {
    product,
    content: organizedContent,
  };
}

/**
 * Content Management Operations
 * ----------------------------
 *
 * Operations for managing product content
 */

export async function addContent(params: {
  productId: string;
  content: ProductContentModel.AddProductContentFormType;
}) {
  const { productId, content } = params;

  // For now, create placeholder content since actual content creation is stubbed
  const newContent = await ProductContentService.create({
    productId,
    ...content,
    contentId: null, // No actual content ID yet
    metadata: {
      placeholder: true,
      createdAt: new Date().toISOString(),
    },
  });

  return newContent;
}

export async function copyWeek(params: {
  productId: string;
  sourceWeek: number;
  targetWeek: number;
}) {
  const { productId, sourceWeek, targetWeek } = params;

  // Get all content from source week
  const allContent = await ProductContentService.fromProductId(productId);
  const sourceWeekContent = allContent.filter(
    (c) => c.weekNumber === sourceWeek,
  );

  // Create copies for target week
  const copiedContent = await Promise.all(
    sourceWeekContent.map((content) =>
      ProductContentService.create({
        productId,
        weekNumber: targetWeek,
        dayNumber: content.dayNumber,
        orderIndex: content.orderIndex,
        contentType: content.contentType,
        contentId: content.contentId,
        title: content.title,
        description: content.description,
        duration: content.duration,
        metadata: {
          ...((content.metadata as any) || {}),
          copiedFrom: {
            weekNumber: sourceWeek,
            contentId: content.id,
          },
        },
      }),
    ),
  );

  return copiedContent;
}

/**
 * Publish Product
 * ---------------
 *
 * Copies all draft product fields to their published counterparts.
 * This makes the current draft state visible to end users.
 */
export async function publishProduct(productId: string) {
  console.log('Publishing product:', productId);
  
  // Use the service layer to publish the product
  const result = await ProductService.publishProductFromId(productId);
  
  return result;
}

export async function deleteProduct(productId: string) {
  // Define a custom error class for better error handling
  class ProductDeletionError extends Error {
    details: any;
    constructor(message: string, details: any) {
      super(message);
      this.name = "ProductDeletionError";
      this.details = details;
    }
  }

  // Create a key for the product's storage location
  const productFolderKey = buildObjectDirectoryKey({
    baseDirectory: "products",
    relativeDirectory: `product-${productId}`,
  });

  console.log(`Deleting product ${productId}...`);

  // Run all operations in parallel to maximize performance
  try {
    const [deleteResults, product] = await Promise.all([
      // 1. Start all storage operations in parallel and collect results with Promise.allSettled
      Promise.allSettled([
        // Delete optimized storage
        StorageService.deleteFolder(
          Resource.OptimisedStorage.name,
          productFolderKey,
        ),
        // Delete original storage
        StorageService.deleteFolder(Resource.Storage.name, productFolderKey),
        // Delete all content in one operation by deleting from the product first
        // We don't need to fetch and delete each content separately
        ProductContentService.fromProductId(productId).then((content) =>
          Promise.allSettled(
            content.map((c) => ProductContentService.deleteContent(c.id)),
          ),
        ),
      ]),

      // 2. Delete the product from the database (run in parallel with storage operations)
      ProductService.deleteProduct(productId),
    ]);

    // Check for storage deletion failures but don't block the overall process
    const failedOperations = deleteResults.filter(
      (r) => r.status === "rejected",
    );
    if (failedOperations.length > 0) {
      console.warn(
        `${failedOperations.length} delete operations failed for product ${productId}:`,
        failedOperations.map((f) => (f as PromiseRejectedResult).reason),
      );
    }

    if (!product) {
      throw new ProductDeletionError("Failed to delete product from database", {
        productId,
      });
    }

    return product;
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error);

    // Re-throw with more context for better debugging
    if (error instanceof ProductDeletionError) {
      throw error;
    } else {
      throw new ProductDeletionError("Failed to delete product", {
        productId,
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
