import { selectUserSchema, user } from "@core/auth/auth.sql";
import { db } from "@core/drizzle";
import { eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, router } from "@/lib/trpc";

/**
 * Users tRPC router
 * Provides type-safe reads and mutations for user profile data.
 */
export const usersRouter = router({
	/**
	 * Get the current user's profile
	 */
	get: protectedProcedure.query(async ({ ctx }) => {
		const result = await db
			.select()
			.from(user)
			.where(eq(user.id, ctx.user.id))
			.limit(1);

		if (!result[0]) {
			throw new Error("USER_NOT_FOUND");
		}

		return selectUserSchema.parse(result[0]);
	}),

	/**
	 * Update the current user's profile
	 *
	 * Persists the update directly to Neon so the users Query Collection picks
	 * it up on its next refetch. Optimistic UI confirmation is handled by the
	 * collection's own persistence tracking.
	 */
	update: protectedProcedure
		.input(
			z.object({
				name: z.string().optional(),
				workspaceName: z.string().optional(),
				image: z.string().nullable().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// drizzle skips `undefined` values in .set(), so only provided fields
			// are updated. `null` is written explicitly (e.g. clearing the image).
			const [row] = await db
				.update(user)
				.set({
					name: input.name,
					workspaceName: input.workspaceName,
					image: input.image,
					updatedAt: new Date(),
				})
				.where(eq(user.id, ctx.user.id))
				.returning({
					...getTableColumns(user),
				});

			if (!row) {
				throw new Error("UPDATE_FAILED");
			}

			return selectUserSchema.parse(row);
		}),
});
