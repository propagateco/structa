import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_auth/onboarding")({
	component: OnboardingPage,
});

function OnboardingPage() {
	const [name, setName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// TODO: Replace with actual API call
		console.log("Early access request:", { name });

		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsSubmitting(false);
	};

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="w-full max-w-md space-y-8 p-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Apply for early access</h1>
				</div>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter your name"
							required
						/>
					</div>
					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "I want early access"}
					</Button>
				</form>
			</div>
		</div>
	);
}
