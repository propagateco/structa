import { computeSHA256Checksum } from "@core/storage/storage.utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersCollection } from "@/lib/collections";
import { trpc } from "@/lib/trpc-client";

interface UpdateUserInput {
	name: string;
	workspaceName: string;
	image?: File;
	userId: string;
}

/**
 * Hook to update user settings via Electric collection
 *
 * Flow:
 * 1. If image provided, upload to S3 first via presigned URL
 * 2. Update via Electric collection (applies optimistic update)
 * 3. Collection's onUpdate handler persists via tRPC mutation
 * 4. Wait for the mutation to be confirmed via Electric sync (txid match).
 *    Rejects — rolling back the optimistic update — if the server update
 *    fails or the txid never syncs back.
 *
 * @param userId - The ID of the user to update
 */
export function useUpdateUser(userId: string) {
	return useMutation({
		mutationKey: ["updateUserSettings", userId],
		mutationFn: async (values: UpdateUserInput) => {
			let imageKey: string | undefined;

			// Upload image to S3 if provided
			if (values.image) {
				const checksum = await computeSHA256Checksum(values.image);
				const { url, key } = await trpc.storage.uploadUserImage.mutate({
					contentType: values.image.type,
					size: values.image.size,
					checksum,
				});
				imageKey = key;

				// Upload the file to S3 using the presigned URL
				const uploadResponse = await fetch(url, {
					method: "PUT",
					body: values.image,
					headers: {
						"Content-Type": values.image.type,
					},
				});

				if (!uploadResponse.ok) {
					throw new Error("Failed to upload image to storage");
				}
			}

			// Update via Electric collection - applies an optimistic update and
			// triggers the collection's onUpdate handler (tRPC mutation)
			const transaction = usersCollection.update(values.userId, (draft) => {
				draft.name = values.name;
				draft.workspaceName = values.workspaceName;
				if (imageKey) {
					draft.image = imageKey;
				}
			});

			// Wait until the mutation is persisted and confirmed via Electric
			// sync (txid match) so the caller can react to the real outcome
			await transaction.isPersisted.promise;

			return { success: true };
		},
		// No success toast — the MutationDot in the header shows saved state.
		// Toasts are reserved for errors and warnings.
		onError: (error) => {
			console.error("Error updating user settings:", error);
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to update settings. Please try again.",
			);
		},
	});
}
