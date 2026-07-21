import { createFileRoute } from "@tanstack/react-router";
import {
	Header,
	HeaderMain,
	HeaderSubSection,
	HeaderTitle,
} from "@/components/layout/typography";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_auth/_settings/settings/billing")({
	component: BillingSettings,
	head: () => ({
		meta: [{ title: "Billing | Structa" }],
	}),
});

function BillingSettings() {
	return (
		<>
			<Header>
				<HeaderMain>
					<HeaderTitle>Billing</HeaderTitle>
					<HeaderSubSection>
						Manage your subscription and billing information.
					</HeaderSubSection>
				</HeaderMain>
			</Header>
			<Card className="border">
				<CardContent className="space-y-6 py-8">
					<div className="flex flex-col items-center justify-center text-center py-8">
						<p className="text-muted-foreground">
							Billing management coming soon.
						</p>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
