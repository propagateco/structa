import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/page-container";

type Conversation = {
	id: string;
	title: string;
	projectId: string | null;
	updatedAt: string;
};

export const Route = createFileRoute("/_auth/app/chat/$conversationId")({
	component: ConversationComponent,
});

function ConversationComponent() {
	const { conversationId } = Route.useParams();
	const isDraft = conversationId === "new";
	const [conversation, setConversation] = useState<Conversation | null>(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (isDraft) return;
		void fetch(`/api/conversations/${conversationId}`, {
			credentials: "include",
		})
			.then((response) => {
				if (!response.ok) throw new Error("Conversation not found");
				return response.json() as Promise<Conversation>;
			})
			.then(setConversation)
			.catch(() => setError(true));
	}, [conversationId, isDraft]);

	return (
		<PageContainer>
			{isDraft ? (
				<section aria-labelledby="conversation-title">
					<h1 id="conversation-title" className="text-2xl font-semibold">
						New chat
					</h1>
					<p className="text-muted-foreground mt-2 text-sm">
						This draft will be saved when you send the first message.
					</p>
				</section>
			) : error ? (
				<p>Conversation not found.</p>
			) : conversation ? (
				<section aria-labelledby="conversation-title">
					<h1 id="conversation-title" className="text-2xl font-semibold">
						{conversation.title}
					</h1>
					<p className="text-muted-foreground mt-2 text-sm">
						Recent messages will appear here.
					</p>
				</section>
			) : (
				<p>Loading conversation...</p>
			)}
		</PageContainer>
	);
}
