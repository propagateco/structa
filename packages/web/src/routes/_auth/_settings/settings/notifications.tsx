import { createFileRoute } from "@tanstack/react-router";
import {
	Header,
	HeaderMain,
	HeaderSubSection,
	HeaderTitle,
} from "@/components/layout/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_auth/_settings/settings/notifications")(
	{
		component: NotificationsSettings,
		head: () => ({
			meta: [{ title: "Notifications | Structa" }],
		}),
	},
);

function NotificationsSettings() {
	return (
		<>
			<Header>
				<HeaderMain>
					<HeaderTitle>Notifications</HeaderTitle>
					<HeaderSubSection>
						Manage how and when you receive notifications.
					</HeaderSubSection>
				</HeaderMain>
			</Header>
			<Card className="border">
				<CardContent className="space-y-6 py-8">
					<div className="flex flex-col items-center justify-center text-center py-8">
						<p className="text-muted-foreground">
							Notification preferences coming soon.
						</p>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
