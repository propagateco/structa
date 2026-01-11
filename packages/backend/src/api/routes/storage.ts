import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { authenticatedMiddleware } from "../middleware";
import { StorageController, StorageService } from "@structa/core/storage";
import { Resource } from "sst";

export const StorageRoute = new Hono()
  .use(authenticatedMiddleware)
  .put(
    "/upload/user/image",
    zValidator(
      "json",
      z.object({
        contentType: z.string(),
        size: z.number(),
        checksum: z.string(),
      }),
    ),
    async (c) => {
      const userId = c.var.user.id;
      const { contentType, size, checksum } = c.req.valid("json");

      const { url, key } = await StorageController.getUploadAvatarFromId(
        userId,
        size,
        contentType,
        checksum,
      );
      return c.json({ url, key }, 200);
    },
  )
  .put(
    "/upload/app/logo/:mode",
    zValidator("param", z.object({ mode: z.enum(["light", "dark"]) })),
    zValidator(
      "json",
      z.object({
        contentType: z.string(),
        size: z.number(),
        checksum: z.string(),
      }),
    ),
    async (c) => {
      const appId = c.var.user.workspaceId;
      if (!appId) {
        return c.json({ error: "User has not completed onboarding" }, 400);
      }
      const userId = c.var.user.id;

      const canEdit = await StorageController.canEdit(appId, userId);
      if (!canEdit) {
        return c.text("You do not have permission to edit this app", 403);
      }

      const { contentType, size, checksum } = c.req.valid("json");

      const mode = c.req.param("mode") as "light" | "dark";

      const { url, key } = await StorageController.getUploadLogoUrlFromId(
        userId,
        appId,
        mode,
        size,
        contentType,
        checksum,
      );

      return c.json({ url, key }, 200);
    },
  )
  .put(
    "/upload/app/icon",
    zValidator(
      "json",
      z.object({
        contentType: z.string(),
        size: z.number(),
        checksum: z.string(),
      }),
    ),
    async (c) => {
      const appId = c.var.user.workspaceId;
      if (!appId) {
        return c.json({ error: "User has not completed onboarding" }, 400);
      }
      const userId = c.var.user.id;

      const canEdit = await StorageController.canEdit(appId, userId);
      if (!canEdit) {
        return c.text("You do not have permission to edit this app", 403);
      }

      const { contentType, size, checksum } = c.req.valid("json");

      const { url, key } = await StorageController.getUploadIconUrlFromId(
        userId,
        appId,
        size,
        contentType,
        checksum,
      );

      return c.json({ url, key }, 200);
    },
  )
  .put(
    "/upload/product/cover/:productId",
    zValidator("param", z.object({ productId: z.string() })),
    zValidator(
      "json",
      z.object({
        contentType: z.string(),
        size: z.number(),
        checksum: z.string(),
      }),
    ),
    async (c) => {
      const userId = c.var.user.id;
      const appId = c.var.user.workspaceId;
      if (!appId) {
        return c.json({ error: "User has not completed onboarding" }, 400);
      }
      const productId = c.req.param("productId");
      const { contentType, size, checksum } = c.req.valid("json");

      const canEdit = await StorageController.canEdit(appId, userId);
      if (!canEdit) {
        return c.text("You do not have permission to edit this product", 403);
      }

      const { url, key } =
        await StorageController.getUploadProductCoverUrlFromId(
          userId,
          appId,
          productId,
          size,
          contentType,
          checksum,
        );

      return c.json({ url, key }, 200);
    },
  )
  .delete("/delete", async (c) => {
    const key =
      "users/user-bz6hfbfr5rb8ogbp1abh1bka/images/image-p1t0gvr4kxxm8qikvgnu3wml";
    const bucket = Resource.Storage.name;

    const response = await StorageService.deleteFile(bucket, key);

    return c.json({ message: "File deleted successfully" }, 200);
  });
