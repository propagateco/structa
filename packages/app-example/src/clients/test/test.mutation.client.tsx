import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

// Test build queue demo task mutation
export function useTestTaskMutation() {
	return useMutation({
		mutationFn: async () => {
			const response = await api.test["task"].$post();

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to run build queue demo task");
			}

			return response.json();
		},
		onSuccess: (data) => {
			toast.success("Build queue demo task started successfully!", {
				description: `Task ID: ${data.taskId}. Check CloudWatch logs for task execution results.`,
			});
		},
		onError: (error) => {
			toast.error("Failed to start build queue demo task", {
				description: error.message,
			});
		},
	});
}
