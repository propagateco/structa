import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth/onboarding/thank-you")({
	component: ThankYouPage,
});

function ThankYouPage() {
	return (
		<div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12">
			<div className="w-full max-w-sm sm:max-w-md space-y-8 p-8 text-center">
				<div className="space-y-4">
					<h1 className="font-heading text-2xl lg:text-3xl tracking-tight">
						You're on the list!
					</h1>
					<p className="text-text-secondary">
						Thanks for joining the waitlist. We'll be in touch soon with early
						access to Structa.
					</p>
				</div>

				<div className="space-y-4">
					<p className="text-sm text-text-muted">
						In the meantime, check out our renovation guides.
					</p>
					<Button asChild variant="outline" className="w-full">
						<Link to="/guides">Browse guides</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
