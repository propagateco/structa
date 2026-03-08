import { selectUserSchema, updateUserSchema, user } from "@core/auth/auth.sql";
import { db } from "@core/drizzle";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { generateTxId, protectedProcedure, router } from "@/lib/trpc";

/**
 * Users tRPC router
 * Provides type-safe mutations for user data with txid generation for Electric sync
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
	 * Returns txid for Electric sync confirmation
	 */
	update: protectedProcedure
		.input(
			z.object({
				name: z.string().optional(),
				image: z.string().nullable().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Validate input against schema
			const validatedInput = updateUserSchema.parse({
				...input,
				id: ctx.user.id,
			});

			// Update user in database
			const [updatedUser] = await db
				.update(user)
				.set({
					...validatedInput,
					updatedAt: new Date(),
				})
				.where(eq(user.id, ctx.user.id))
				.returning();

			if (!updatedUser) {
				throw new Error("UPDATE_FAILED");
			}

			// Generate txid for sync confirmation
			const txid = generateTxId();

			return {
				data: selectUserSchema.parse(updatedUser),
				txid,
			};
		}),
});

/**
 * App router type for tRPC client
 */
export type AppRouter = typeof usersRouter;
