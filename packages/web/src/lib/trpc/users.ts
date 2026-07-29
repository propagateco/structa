import { selectUserSchema, user } from "@core/auth/auth.sql";
import { db } from "@core/drizzle";
import { eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { pgCurrentTxId, protectedProcedure, router } from "@/lib/trpc";

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
	 *
	 * Returns the Postgres txid of the mutation so the Electric collection can
	 * wait for the change to sync back (optimistic update confirmation).
	 *
	 * The txid is read with `pg_current_xact_id()` in the RETURNING clause of
	 * the UPDATE itself. neon-http executes each statement in its own implicit
	 * transaction, so this is the same transaction that performs the write —
	 * a separate `SELECT pg_current_xact_id()` would return a different txid
	 * that never appears in the Electric stream.
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
					// Same-statement read → same transaction as the write
					txid: pgCurrentTxId,
				});

			if (!row) {
				throw new Error("UPDATE_FAILED");
			}

			const { txid, ...updatedUser } = row;
			const parsedTxid = Number.parseInt(txid, 10);
			if (Number.isNaN(parsedTxid)) {
				throw new Error("TXID_FAILED");
			}

			return {
				data: selectUserSchema.parse(updatedUser),
				txid: parsedTxid,
			};
		}),
});
