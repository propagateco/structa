import type { AppleModel } from "@core/apple/apple.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

/**
 * Apple Account Mutations
 * ----------------------
 *
 * This module provides mutations for managing Apple account connections.
 */

export function useConnectAppleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (credentials: AppleModel.MutateClientType) => {
			const response = await api.apple.account.connect.$post({
				json: credentials,
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error("Failed to connect Apple account");
			}

			return response.json();
		},
		onSuccess: () => {
			// Invalidate queries
			queryClient.invalidateQueries({ queryKey: ["apple"] });
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to connect Apple account");
		},
	});
}

export function useDisconnectAppleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const response = await api.apple.account.disconnect.$post();

			if (!response.ok) {
				const error = await response.json();
				throw new Error("Failed to disconnect Apple account");
			}

			return response.json();
		},
		onSuccess: () => {
			// Invalidate queries
			queryClient.invalidateQueries({ queryKey: ["apple"] });
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to disconnect Apple account");
		},
	});
}

export function useTestAppleConnectionMutation() {
	return useMutation({
		mutationFn: async () => {
			const response = await api.apple.account.test.$post();

			if (!response.ok) {
				const error = await response.json();
				throw new Error("Connection test failed");
			}

			const data = await response.json();
			return data;
		},
		onError: (error: Error) => {
			toast.error("Connection test failed");
		},
	});
}

export function useValidateAppleCredentialsMutation() {
	return useMutation({
		mutationFn: async (credentials: {
			keyId: string;
			issuerId: string;
			privateKey: string;
		}) => {
			const response = await api.apple.validate.$post({
				json: credentials,
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error("Validation failed");
			}

			return response.json();
		},
	});
}
