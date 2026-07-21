import { StorageController } from "@core/storage";
import { z } from "zod";
import { protectedProcedure, router } from "@/lib/trpc";

/**
 * Storage tRPC router
 *
 * Provides type-safe, same-origin, cookie-authenticated endpoints for
 * generating presigned S3 URLs. Binary bytes never touch our servers —
 * only the presigned URL is returned and the client PUTs the file
 * directly to S3.
 *
 * Replaces the cross-origin Hono `StorageRoute` for anything the web
 * app needs; the Hono route is retained for legacy / app-example
 * callers.
 */
export const storageRouter = router({
	/**
	 * Get a presigned S3 PUT URL for the current user's avatar.
	 *
	 * Returns `{ url, key }`. The caller then PUTs the raw File to `url`
	 * and persists `key` to the user row via the optimistic Electric
	 * collection update flow (see `use-update-user.ts`).
	 */
	uploadUserImage: protectedProcedure
		.input(
			z.object({
				contentType: z.string(),
				size: z.number(),
				checksum: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { url, key } = await StorageController.getUploadAvatarFromId(
				ctx.user.id,
				input.size,
				input.contentType,
				input.checksum,
			);
			return { url, key };
		}),
});
