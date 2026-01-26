import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/_dashboard/_settings/settings/billing",
)({
	component: RouteComponent,
	staticData: {
		title: "Billing",
	},
});

function RouteComponent() {
	return <div>Display notifications components here</div>;
}
