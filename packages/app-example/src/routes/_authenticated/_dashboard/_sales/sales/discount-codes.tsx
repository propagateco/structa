import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Percent } from "lucide-react";
import { stripeAccountQueryOptions } from "@/clients/stripe/stripe.query.client";
import { SalesEmptyState } from "@/components/sales/SalesEmptyState";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute(
	"/_authenticated/_dashboard/_sales/sales/discount-codes",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: stripeStatus } = useSuspenseQuery(stripeAccountQueryOptions);

	if (!stripeStatus.connected) {
		return <SalesEmptyState />;
	}

	return (
		<div className="flex flex-col items-center justify-center h-full">
			<div className="flex flex-col items-start justify-center min-h-max max-w-sm">
				<div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
					<Percent className="w-8 h-8 text-muted-foreground stroke-1" />
				</div>
				<h2 className="text-base font-semibold mb-2">
					Discount Codes Coming Soon
				</h2>
				<p className="text-md text-muted-foreground max-w-2xl mb-8">
					We're working on building a comprehensive discount code system. Soon
					you'll be able to create and manage promotional codes to boost your
					sales including percentage and fixed amount discounts, usage limits
					and expiration dates, customer-specific codes, and usage analytics.
					You can upvote this feature on the Feature requests page if you want
					to see this built sooner.
				</p>
				<div className="flex flex-row items-center gap-3">
					<Button size="sm" disabled>
						Coming soon
					</Button>
					<a
						href="https://docs.structa.so/feature-requests"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button variant="outline" size="sm">
							Feature requests
						</Button>
					</a>
				</div>
			</div>
		</div>
	);
}
