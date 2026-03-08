import { computeSHA256Checksum } from "@core/storage/storage.utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { usersCollection } from "@/lib/collections";

interface UpdateUserInput {
	name: string;
	workspaceName: string;
	image?: File;
}

interface UpdateUserContext {
	previousUser: unknown;
}

/**
 * Hook to update user settings via Electric collection
 *
 * Flow:
 * 1. If image provided, upload to S3 first via presigned URL
 * 2. Update via Electric collection (triggers optimistic update + tRPC)
 * 3. Collection's onUpdate handler calls tRPC mutation
 */
export function useUpdateUser() {
	return useMutation({
		mutationKey: ["updateUserSettings"],
		mutationFn: async (values: UpdateUserInput) => {
			let imageKey: string | undefined;

			// Upload image to S3 if provided
			if (values.image) {
				const checksum = await computeSHA256Checksum(values.image);
				const urlResponse = await api.storage.upload.user.image.$put({
					json: {
						contentType: values.image.type,
						size: values.image.size,
						checksum,
					},
				});

				if (!urlResponse.ok) {
					throw new Error("Failed to get presigned URL for image upload");
				}

				const { url, key } = await urlResponse.json();
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

			// Get current user ID from the collection
			const currentUser = await usersCollection.utils.first();
			if (!currentUser) {
				throw new Error("No current user found in collection");
			}

			// Update via Electric collection - this triggers optimistic update
			// and the collection's onUpdate handler calls tRPC
			usersCollection.update(currentUser.id, (draft) => {
				draft.name = values.name;
				draft.workspaceName = values.workspaceName;
				if (imageKey) {
					draft.image = imageKey;
				}
			});

			return { success: true };
		},
		onSuccess: () => {
			toast.success("Settings saved");
		},
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
