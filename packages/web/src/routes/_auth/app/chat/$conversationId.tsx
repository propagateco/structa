import { createFileRoute } from "@tanstack/react-router";
import { ProductionChatWorkspace } from "@/components/chat-production/workspace";

export const Route = createFileRoute("/_auth/app/chat/$conversationId")({
	component: ConversationComponent,
});

function ConversationComponent() {
	const { conversationId } = Route.useParams();
	return <ProductionChatWorkspace sessionId={conversationId === "new" ? null : conversationId} />;
}
