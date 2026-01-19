import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userQueryOptions } from "@/clients/user/user.query.client";
import { computeSHA256Checksum } from "@core/storage/storage.utils";
import { api } from "@/lib/api";
import { UserModel } from "@core/user/user.model";
import { toast } from "sonner";

export async function completeOnboarding(value: UserModel.OnboardingType) {
    const userRes = await api.user.onboarding.$put({
        json: {
            name: value.name,
            workspaceName: value.workspaceName,
            product: value.product,
            plan: value.plan,
        },
    });

    if (!userRes.ok) {
        const errorData = await userRes.json().catch(() => null);
        console.error("Failed to update user information:", {
            status: userRes.status,
            statusText: userRes.statusText,
            error: errorData,
        });
        throw new Error(
            `Could not update user information: ${userRes.status} ${userRes.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ""}`
        );
    }

    const { user } = await userRes.json();
    if (!user.workspaceId) {
        throw new Error("Failed to generate workspace ID during onboarding");
    }

    // TypeScript doesn't narrow the type after the throw, so we assert it's a string
    const workspaceId = user.workspaceId as string;

    const appRes = await api.app.$post({
        json: {
            id: workspaceId,
            name: value.workspaceName,
        },
    });

    if (!appRes.ok) {
        const errorData = await appRes.json().catch(() => null);
        console.error("Failed to create app:", {
            status: appRes.status,
            statusText: appRes.statusText,
            error: errorData,
        });
        throw new Error(
            `Could not create app: ${appRes.status} ${appRes.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ""}`
        );
    }

    const brandingRes = await api.branding.$post({
        json: {
            appId: workspaceId,
        },
    });

    if (!brandingRes.ok) {
        const errorData = await brandingRes.json().catch(() => null);
        console.error("Failed to create branding assets:", {
            status: brandingRes.status,
            statusText: brandingRes.statusText,
            error: errorData,
        });
        throw new Error(
            `Could not create branding assets: ${brandingRes.status} ${brandingRes.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ""}`
        );
    }

    const userData = await userRes.json();
    return userData;
}

export function useCompleteOnboardingMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: completeOnboarding,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: userQueryOptions.queryKey,
                refetchType: "all",
            });
        },
        onError: (error) => {
            console.error("Onboarding mutation error:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to update onboarding. Please try again.";
            toast.error(errorMessage);
        },
    });
}

export async function updateUserSettings(values: UserModel.SettingsFormType) {
    let avatarKey: string | undefined;
    if (values.image) {
        // Get the pre-signed URL from your API
        const urlResponse = await api.storage.upload.user.image.$put({
            json: {
                contentType: values.image.type,
                size: values.image.size,
                checksum: await computeSHA256Checksum(values.image),
            },
        });

        if (!urlResponse.ok) {
            throw new Error("Failed to get pre-signed URL");
        }

        // Extract the pre-signed URL from the response
        const { url, key } = await urlResponse.json();
        avatarKey = key;

        // Directly upload the file to S3 using the pre-signed URL
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

    // Update user profile info
    const res = await api.user.settings.$put({
        json: {
            name: values.name,
            workspaceName: values.workspaceName,
            avatarKey: avatarKey,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to update user profile entry in database");
    }

    const user = await res.json();

    return user;
}

export function useUpdateUserSettingsMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateUserSettings"],
        mutationFn: updateUserSettings,
        onMutate: async (newValues) => {
            await queryClient.cancelQueries({
                queryKey: userQueryOptions.queryKey,
            });

            // Snapshot the previous value
            const previousUser = queryClient.getQueryData(
                userQueryOptions.queryKey
            );

            // Optimistically update to the new value
            if (previousUser) {
                const updated = {
                    ...previousUser,
                    name: newValues.name,
                    workspaceName: newValues.workspaceName,
                };
                if (newValues.image) {
                    updated.image = URL.createObjectURL(newValues.image);
                }

                queryClient.setQueryData(userQueryOptions.queryKey, updated);
            }

            // Return a context with the previous value
            return { previousUser };
        },
        // If the mutation fails, use the context returned above
        onError: (error, _newValues, context) => {
            if (context) {
                queryClient.setQueryData(
                    userQueryOptions.queryKey,
                    context.previousUser
                );
            }
            console.log("Error updating user settings:", error);
            toast.error("Failed to update account settings. Please try again.");
        },
        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: userQueryOptions.queryKey,
                refetchType: "all",
            });
        },
    });
}
