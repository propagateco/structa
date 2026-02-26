import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

export interface WaitlistInput {
	email: string;
	name?: string;
}

export async function joinWaitlist(input: WaitlistInput) {
	const res = await api.waitlist.$post({
		json: input,
	});

	if (!res.ok) {
		const errorData = await res.json().catch(() => null);
		console.error("Failed to join waitlist:", {
			status: res.status,
			statusText: res.statusText,
			error: errorData,
		});
		throw new Error(
			`Could not join waitlist: ${res.status} ${res.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ""}`,
		);
	}

	return await res.json();
}

export function useJoinWaitlistMutation() {
	return useMutation({
		mutationFn: joinWaitlist,
		onSuccess: () => {
			toast.success("You've been added to the waitlist!");
		},
		onError: (error) => {
			console.error("Waitlist mutation error:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to join waitlist. Please try again.";
			toast.error(errorMessage);
		},
	});
}
