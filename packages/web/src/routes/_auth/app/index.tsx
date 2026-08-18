import { createFileRoute } from "@tanstack/react-router";
import { ProductionChatWorkspace } from "@/components/chat-production/workspace";

export const Route = createFileRoute("/_auth/app/")({
	component: DashboardComponent,
});

function DashboardComponent() {
	return <ProductionChatWorkspace sessionId={null} />;
}
