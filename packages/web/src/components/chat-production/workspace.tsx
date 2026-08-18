import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { Thread } from "@/components/assistant-ui/thread";
import { useProductionChat } from "@/lib/chat-production/use-production-chat";

export function ProductionChatWorkspace({ sessionId }: { sessionId: string | null }) {
	const { runtime } = useProductionChat(sessionId);

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			<div className="h-[calc(100svh-3.5rem)] overflow-hidden">
				<main className="h-full min-w-0">
					<Thread />
				</main>
			</div>
		</AssistantRuntimeProvider>
	);
}
