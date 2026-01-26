import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { AppleIntegrationCard } from "@/components/integrations/apple-integration-card";
import { StripeIntegrationCard } from "@/components/integrations/stripe-integration-card";
import {
	Header,
	HeaderMain,
	HeaderSubSection,
	HeaderTitle,
} from "@/components/layout/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

/**
 * Integrations Settings Page
 * -------------------------
 *
 * Manage all third-party integrations including Stripe, Apple App Store Connect,
 * and other services.
 */

export const Route = createFileRoute(
	"/_authenticated/_dashboard/_settings/settings/integrations",
)({
	component: RouteComponent,
});

function RouteComponent() {
	// Basic form setup (mainly for FormField wrapper compatibility)
	const form = useForm({
		defaultValues: {},
	});

	return (
		<>
			<Header>
				<HeaderMain>
					<HeaderTitle>Integrations</HeaderTitle>
					<HeaderSubSection>
						Manage your integrations with Stripe, Apple Store Connect, Google
						Play Store and more.
					</HeaderSubSection>
				</HeaderMain>
			</Header>

			<Form {...form}>
				<form className="space-y-6">
					{/* Stripe Integration */}
					<Card className="border">
						<CardContent>
							<StripeIntegrationCard />
						</CardContent>
					</Card>

					{/* Apple App Store Connect Integration */}
					<Card className="border">
						<CardContent>
							<AppleIntegrationCard />
						</CardContent>
					</Card>

					{/* Additional integrations can be added here as separate cards */}
				</form>
			</Form>
		</>
	);
}
