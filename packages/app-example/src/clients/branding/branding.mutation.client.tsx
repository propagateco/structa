import type { BrandingModel } from "@core/branding/branding.model";
import { computeSHA256Checksum } from "@core/storage/storage.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { appQueryOptions } from "../app/app.query.client";
import { brandingQueryOptions } from "./branding.query.client";

export async function updateBranding(
	values: BrandingModel.BrandingContextType,
) {
	const updatePromises: Promise<any>[] = [];
	const errors: Error[] = [];

	/** Icon file upload or removal
	 *
	 * If the icon is a File, it's uploaded to the server using a PUT request to the storage API.
	 * If the icon is null, a DELETE request is sent to remove the icon.
	 * The response contains a URL and a key for the uploaded file. This key is then
	 * used to update the icon in the database.
	 */
	if (values.icon !== undefined) {
		const icon = values.icon;
		const iconUploadPromise = (async () => {
			try {
				// Handle icon removal
				if (icon === null) {
					const response = await api.branding.icon.$delete();

					if (!response.ok) {
						throw new Error(
							`Failed to remove icon from database: ${response.status}`,
						);
					}

					return await response.json();
				}

				// Handle icon upload
				const urlResponse = await api.storage.upload.app.icon.$put({
					json: {
						contentType: icon.type,
						size: icon.size,
						checksum: await computeSHA256Checksum(icon),
					},
				});

				if (!urlResponse.ok) {
					throw new Error(`Failed to get upload URL: ${urlResponse.status}`);
				}

				const { url, key } = await urlResponse.json();
				console.log(url, key);

				const uploadResponse = await fetch(url, {
					method: "PUT",
					body: values.icon,
					headers: { "Content-Type": icon.type },
				});

				if (!uploadResponse.ok) {
					throw new Error(
						`Failed to upload app icon: ${uploadResponse.status}`,
					);
				}

				const response = await api.branding.icon.$put({
					json: {
						icon: key,
					},
				});

				if (!response.ok) {
					throw new Error(
						`Failed to update icon in database: ${response.status}`,
					);
				}

				const branding = await response.json();
				return branding;
			} catch (err) {
				errors.push(err as Error);
				return {};
			}
		})();
		updatePromises.push(iconUploadPromise);
	}

	/** Light large logo file upload or removal
	 *
	 * The light large logo file is uploaded to the server using a PUT request to the storage API.
	 * If the value is null, it removes the logo from the database.
	 *
	 * The response contains a URL and a key for the uploaded file. This key is then
	 * used to update the light large logo in the database.
	 */
	if (values.lightLargeLogo !== undefined) {
		const lightLargeLogo = values.lightLargeLogo;
		const lightLargeLogoUploadPromise = (async () => {
			try {
				// Handle logo removal
				if (lightLargeLogo === null) {
					const response = await api.branding.logo.light.large.$delete();

					if (!response.ok) {
						throw new Error(
							`Failed to remove light large logo from database: ${response.status}`,
						);
					}

					return await response.json();
				}

				// Handle logo upload
				const urlResponse = await api.storage.upload.app.logo[":mode"].$put({
					param: { mode: "light" },
					json: {
						contentType: lightLargeLogo.type,
						size: lightLargeLogo.size,
						checksum: await computeSHA256Checksum(lightLargeLogo),
					},
				});

				if (!urlResponse.ok) {
					throw new Error(`Failed to get upload URL: ${urlResponse.status}`);
				}

				const { url, key } = await urlResponse.json();

				const uploadResponse = await fetch(url, {
					method: "PUT",
					body: values.lightLargeLogo,
					headers: { "Content-Type": lightLargeLogo.type },
				});

				if (!uploadResponse.ok) {
					throw new Error(
						`Failed to upload light large logo: ${uploadResponse.status}`,
					);
				}

				const response = await api.branding.logo.light.large.$put({
					json: {
						lightLargeLogo: key,
					},
				});

				if (!response.ok) {
					throw new Error(
						`Failed to update light large logo in database: ${response.status}`,
					);
				}

				return await response.json();
			} catch (err) {
				errors.push(err as Error);
			}
		})();
		updatePromises.push(lightLargeLogoUploadPromise);
	}

	if (values.colours) {
		const accentColour = values.colours.accent;
		const greyColour = values.colours.grey;

		const coloursUpdatePromise = (async () => {
			try {
				const response = await api.branding.colours.$put({
					json: {
						...accentColour?.getHexValues(),
						...greyColour?.getHexValues(),
					},
				});

				if (!response.ok) {
					throw new Error(
						`Failed to update colours in database: ${response.status}`,
					);
				}

				return await response.json();
			} catch (err) {
				errors.push(err as Error);
			}
		})();
		updatePromises.push(coloursUpdatePromise);
	}

	if (values.font) {
		const fontUpdatePromise = (async () => {
			const font = values.font;
			// Ensure font is a non-null string before sending to API
			if (font !== null && font !== undefined) {
				try {
					const response = await api.branding.font.$put({
						json: {
							font: font,
						},
					});

					if (!response.ok) {
						throw new Error(
							`Failed to update font in database: ${response.status}`,
						);
					}

					return await response.json();
				} catch (err) {
					errors.push(err as Error);
				}
			}
		})();
		updatePromises.push(fontUpdatePromise);
	}

	if (values.name || values.description) {
		const appUpdatePromise = (async () => {
			try {
				const payload: Record<string, any> = {};
				if (values.name !== undefined) payload.name = values.name;
				if (values.description !== undefined)
					payload.description = values.description;

				if (Object.keys(payload).length > 0) {
					const appRes = await api.app.branding.$put({ json: payload });

					if (!appRes.ok) {
						throw new Error(`Failed to update app: ${appRes.status}`);
					}

					return await appRes.json();
				}
			} catch (err) {
				errors.push(err as Error);
			}
		})();

		updatePromises.push(appUpdatePromise);
	}

	// Wait for all promises to complete
	await Promise.all(updatePromises);

	if (errors.length > 0) {
		throw new Error(
			`Failed to update branding: ${errors.map((e) => e.message).join(", ")}`,
		);
	}

	console.log("Branding updated successfully");
}

export function useUpdateBrandingMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["updateBranding"],
		mutationFn: updateBranding,
		retry: (failureCount, error) => {
			// Retry up to 2 times for transient errors
			if (failureCount >= 2) return false;

			const errorMessage = error instanceof Error ? error.message : "";
			const isTransientError =
				errorMessage.includes("network") ||
				errorMessage.includes("timeout") ||
				errorMessage.includes("Failed to fetch") ||
				errorMessage.includes("409");

			return isTransientError;
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		onMutate: async (newData) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({
				queryKey: brandingQueryOptions.queryKey,
			});
			await queryClient.cancelQueries({ queryKey: appQueryOptions.queryKey });

			// Snapshot the previous values
			const previousBranding = queryClient.getQueryData(
				brandingQueryOptions.queryKey,
			);
			const previousApp = queryClient.getQueryData(appQueryOptions.queryKey);

			// Optimistically update branding data
			if (previousBranding) {
				const updated = { ...previousBranding };

				// Handle font updates
				if (newData.font) updated.font = newData.font;

				// Handle icon updates - File, null, or undefined
				if (newData.icon !== undefined) {
					switch (true) {
						case newData.icon === null:
							updated.icon = null;
							break;
						case newData.icon instanceof File:
							updated.icon = URL.createObjectURL(newData.icon);
							break;
					}
				}

				// Handle lightLargeLogo updates - File, null, or undefined
				if (newData.lightLargeLogo !== undefined) {
					switch (true) {
						case newData.lightLargeLogo === null:
							updated.lightLargeLogo = null;
							break;
						case newData.lightLargeLogo instanceof File:
							updated.lightLargeLogo = URL.createObjectURL(
								newData.lightLargeLogo,
							);
							break;
					}
				}

				// Handle darkLargeLogo updates - File, null, or undefined
				if (newData.darkLargeLogo !== undefined) {
					switch (true) {
						case newData.darkLargeLogo === null:
							updated.darkLargeLogo = null;
							break;
						case newData.darkLargeLogo instanceof File:
							updated.darkLargeLogo = URL.createObjectURL(
								newData.darkLargeLogo,
							);
							break;
					}
				}

				// Handle colour updates
				if (newData.colours) {
					updated.colours = {
						...updated.colours,
						...newData.colours,
					};
				}

				queryClient.setQueryData(brandingQueryOptions.queryKey, updated);
			}

			// Optimistically update app data (name and description)
			if (
				previousApp &&
				(newData.name !== undefined || newData.description !== undefined)
			) {
				const updatedApp = { ...previousApp };

				if (newData.name !== undefined) {
					updatedApp.name = newData.name;
				}

				if (newData.description !== undefined) {
					updatedApp.description = newData.description;
				}

				queryClient.setQueryData(appQueryOptions.queryKey, updatedApp);
			}

			return { previousBranding, previousApp };
		},
		onError: (error, _newValues, context) => {
			// Roll back to the previous values if the mutation fails
			if (context?.previousBranding) {
				queryClient.setQueryData(
					brandingQueryOptions.queryKey,
					context.previousBranding,
				);
			}
			if (context?.previousApp) {
				queryClient.setQueryData(appQueryOptions.queryKey, context.previousApp);
			}

			// Check if this is a transient error that might be retried
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			const isTransientError =
				errorMessage.includes("network") ||
				errorMessage.includes("timeout") ||
				errorMessage.includes("Failed to fetch") ||
				errorMessage.includes("409"); // Conflict errors from race conditions

			// Only show toast for non-transient errors
			if (!isTransientError) {
				toast.error("Failed to update branding assets. Please try again.");
			}

			console.log("Failed to update branding assets:", error);
		},
		onSuccess: () => {
			// Invalidate queries immediately on success to get fresh data with updated timestamps
			console.log("Mutation successful, invalidating queries");
			queryClient.invalidateQueries({
				queryKey: brandingQueryOptions.queryKey,
				refetchType: "all",
			});
			queryClient.invalidateQueries({
				queryKey: appQueryOptions.queryKey,
				refetchType: "all",
			});
		},
	});
}

/**
 * Publish Branding Mutation
 * -------------------------
 *
 * Publishes both branding and app draft data to make it visible to end users.
 * This includes all branding assets, colors, fonts, and app name/description.
 */
export async function publishBranding() {
	const errors: Error[] = [];

	// Publish branding data
	try {
		const brandingResponse = await api.branding.publish.$post();
		if (!brandingResponse.ok) {
			throw new Error(`Failed to publish branding: ${brandingResponse.status}`);
		}
	} catch (err) {
		errors.push(err as Error);
	}

	// Publish app data
	try {
		const appResponse = await api.app.publish.$post();
		if (!appResponse.ok) {
			throw new Error(`Failed to publish app: ${appResponse.status}`);
		}
	} catch (err) {
		errors.push(err as Error);
	}

	if (errors.length > 0) {
		throw new Error(
			`Failed to publish: ${errors.map((e) => e.message).join(", ")}`,
		);
	}
}

export function usePublishBrandingMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["publishBranding"],
		mutationFn: publishBranding,
		onSuccess: () => {
			// Invalidate queries to refresh data
			queryClient.invalidateQueries({
				queryKey: brandingQueryOptions.queryKey,
			});
			queryClient.invalidateQueries({
				queryKey: appQueryOptions.queryKey,
			});
		},
		onError: (error) => {
			toast.error("Failed to publish changes. Please try again.");
			console.error("Failed to publish:", error);
		},
	});
}
