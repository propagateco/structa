import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { Thread } from "@/components/assistant-ui/thread";
import { useProductionChat } from "@/lib/chat-production/use-production-chat";

export function ProductionChatWorkspace({ sessionId }: { sessionId: string | null }) {
	const navigate = useNavigate();
	const { runtime } = useProductionChat(sessionId, (nextSessionId) => {
		void navigate({
			to: "/app/chat/$conversationId",
			params: { conversationId: nextSessionId },
		});
	});

	return (
		<AssistantRuntimeProvider key={sessionId ?? "new"} runtime={runtime}>
			<div className="h-[calc(100svh-3.5rem)] overflow-hidden">
				<main className="h-full min-w-0">
					<Thread />
				</main>
			</div>
		</AssistantRuntimeProvider>
	);
}
