import { Hono } from "hono";
import {
    ProductController,
    ProductService,
    ProductModel,
    ProductContentModel,
    ProductContentService,
} from "@structa/core/product";
import { zValidator } from "@hono/zod-validator";
import { authenticatedMiddleware } from "../middleware";
import { z } from "zod";

export const ProductRoute = new Hono()
    .use(authenticatedMiddleware)

    // Get all products for the workspace
    .get("/", async (c) => {
        const appId = c.var.user.workspaceId;
        if (!appId) {
            return c.json({ error: "User has not completed onboarding" }, 400);
        }
        const products = await ProductService.fromAppId(appId);
        if (!products) {
            return c.json({ error: "No products found" }, 404);
        }

        return c.json(products, 200);
    })

    // Create a new product
    .post(
        "/",
        zValidator(
            "json",
            ProductModel.MutateServer.extend({
                id: z.string().optional(),
            }).omit({
                userId: true,
                appId: true,
            })
        ),
        async (c) => {
            const userId = c.var.user.id;
            const appId = c.var.user.workspaceId;
            if (!appId) {
                return c.json({ error: "User has not completed onboarding" }, 400);
            }
            const productData = await c.req.json();

            const product = await ProductController.createProduct({
                userId,
                appId,
                productData,
            });

            return c.json(product, 201);
        }
    )

    // Get a specific product with content
    .get("/:id", async (c) => {
        const productId = c.req.param("id");
        const productWithContent =
            await ProductController.getProductWithContent(productId);
        return c.json(productWithContent, 200);
    })

    // Update a product
    .patch(
        "/:id",
        zValidator(
            "json",
            ProductModel.MutateServer.omit({
                id: true,
                userId: true,
                appId: true,
            })
        ),
        async (c) => {
            const productId = c.req.param("id");
            const updates = await c.req.json();

            const product = await ProductController.updateProduct({
                productId,
                updates,
            });

            return c.json(product, 200);
        }
    )

    // Delete a product
    .delete("/:id", async (c) => {
        const productId = c.req.param("id");
        const product = await ProductController.deleteProduct(productId);
        return c.json(product, 200);
    })

    // Add content to a product
    .post(
        "/:id/content",
        zValidator("json", ProductContentModel.AddProductContentForm),
        async (c) => {
            const productId = c.req.param("id");
            const content = await c.req.json();

            const newContent = await ProductController.addContent({
                productId,
                content,
            });

            return c.json(newContent, 201);
        }
    )

    // Update content
    .put(
        "/content/:contentId",
        zValidator("json", ProductContentModel.UpdateProductContent),
        async (c) => {
            const contentId = c.req.param("contentId");
            const updates = await c.req.json();

            const content = await ProductContentService.update({
                id: contentId,
                ...updates,
            });

            return c.json(content, 200);
        }
    )

    // Delete content
    .delete("/content/:contentId", async (c) => {
        const contentId = c.req.param("contentId");
        const content = await ProductContentService.deleteContent(contentId);
        return c.json(content, 200);
    })

    // Reorder content (drag and drop)
    .post(
        "/content/reorder",
        zValidator("json", ProductContentModel.ReorderProductContent),
        async (c) => {
            const { items } = await c.req.json();
            const reorderedContent = await ProductContentService.reorder({
                items,
            });
            return c.json(reorderedContent, 200);
        }
    )

    // Copy week
    .post(
        "/:id/copy-week",
        zValidator(
            "json",
            z.object({
                sourceWeek: z.number().min(1).max(16),
                targetWeek: z.number().min(1).max(16),
            })
        ),
        async (c) => {
            const productId = c.req.param("id");
            const { sourceWeek, targetWeek } = await c.req.json();

            const copiedContent = await ProductController.copyWeek({
                productId,
                sourceWeek,
                targetWeek,
            });

            return c.json(copiedContent, 201);
        }
    )

    // Publish product
    .post("/:id/publish", async (c) => {
        const productId = c.req.param("id");
        const product = await ProductController.publishProduct(productId);
        return c.json(product, 200);
    });
