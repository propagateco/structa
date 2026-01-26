import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

// Create Expo project mutation
export function useCreateProjectMutation() {
	return useMutation({
		mutationFn: async (projectData: { appId: string; appName: string }) => {
			const response = await api.expo.project.create.$post({
				json: projectData,
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to create Expo project");
			}

			return response.json();
		},
		onSuccess: (data) => {
			toast.success("Expo project created successfully!", {
				description: data.project?.easProjectId
					? `EAS Project ID: ${data.project.easProjectId}. Check your Expo dashboard to verify.`
					: `Project "${data.projectName}" (${data.projectSlug}" is ready for deployments.`,
			});
		},
		onError: (error) => {
			toast.error("Failed to create Expo project", {
				description: error.message,
			});
		},
	});
}

// Test build queue mutation
export function useCreateBuildMutation() {
	return useMutation({
		mutationFn: async () => {
			const response = await api.expo.build.create.$post();

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to queue test build");
			}

			return response.json();
		},
		onSuccess: (data) => {
			toast.success("Started building app", {
				description: `You can monitor the build status in your dashboard.`,
			});
		},
		onError: (error) => {
			toast.error("Failed to create build", {
				description: error.message,
			});
		},
	});
}
