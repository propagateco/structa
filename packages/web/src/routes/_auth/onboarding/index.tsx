import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useJoinWaitlistMutation } from "@/clients/waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth/onboarding/")({
	component: OnboardingPage,
});

function OnboardingPage() {
	const { data: session } = useSession();
	const joinWaitlist = useJoinWaitlistMutation();
	const navigate = useNavigate();

	// Only show name field if user doesn't have a name (i.e., signed up with email OTP, not OAuth)
	// Check for non-empty string (handles "", null, undefined, whitespace-only)
	const userName = session?.user?.name;
	const userHasName = userName != null && userName.trim().length > 0;
	const [name, setName] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!session?.user?.email) {
			return;
		}

		// Only send name if we're collecting it (user doesn't have one already)
		joinWaitlist.mutate(
			{
				email: session.user.email,
				name: !userHasName ? name || undefined : session.user.name || undefined,
			},
			{
				onSuccess: () => {
					navigate({ to: "/onboarding/thank-you" });
				},
			},
		);
	};

	return (
		<div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12">
			<div className="w-full max-w-sm sm:max-w-md space-y-8 p-8">
				{/* Structa Introduction */}
				<div className="space-y-4">
					<h1 className="font-heading text-2xl lg:text-3xl tracking-tight text-left">
						Renovate with confidence.
						<br />
						<span className="text-text-secondary">
							AI-powered workspace for UK homeowners.
						</span>
					</h1>
					<p className="text-text-secondary text-left">
						AI assistant that understands your property and guides your
						renovation. Request early access below.
					</p>
				</div>

				{/* Name Input Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Only show name field if user signed up with email (no OAuth name) */}
					{!userHasName && (
						<div className="space-y-2">
							<Input
								id="name"
								type="text"
								placeholder="Enter your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={joinWaitlist.isPending}
							/>
						</div>
					)}

					<Button
						type="submit"
						className="w-full"
						disabled={joinWaitlist.isPending || !session?.user?.email}
					>
						{joinWaitlist.isPending ? "Submitting..." : "Request an invite"}
					</Button>
				</form>
			</div>
		</div>
	);
}
