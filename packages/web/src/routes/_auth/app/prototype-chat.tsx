import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ChatBreadcrumb } from "@/components/chat-prototype/chat-breadcrumb";
import { ChatDocumentFlow } from "@/components/chat-prototype/chat-document-flow";
import { ChatRail } from "@/components/chat-prototype/chat-rail";
import { VariantSwitcher } from "@/components/chat-prototype/variant-switcher";
import { CHAT_VARIANTS } from "@/components/chat-prototype/variants";
import { useMockChat } from "@/lib/chat-mock/use-mock-chat";

/**
 * `/app/prototype-chat` — throwaway chat UX prototype (iss-017) on branch
 * `prototype/chat-layout`. Deliberately NOT DEV-guarded (unlike `/app/lab`):
 * it is verified against a CI preview production build. It is never linked
 * from the product nav and is removed when the prototype lands.
 */
const searchSchema = z.object({
	variant: z.enum(CHAT_VARIANTS).optional(),
});

export const Route = createFileRoute("/_auth/app/prototype-chat")({
	validateSearch: searchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { variant = "rail" } = Route.useSearch();
	const { runtime } = useMockChat();

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			{/* `h-[calc(100svh-3.5rem)]` pins the composer below the h-14 header. */}
			<div className="h-[calc(100svh-3.5rem)] overflow-hidden">
				{variant === "rail" && <ChatRail />}
				{variant === "breadcrumb" && <ChatBreadcrumb />}
				{variant === "document-flow" && <ChatDocumentFlow />}
				<VariantSwitcher variant={variant} />
			</div>
		</AssistantRuntimeProvider>
	);
}
