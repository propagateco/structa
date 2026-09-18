"use client";

import { Thread } from "@/components/assistant-ui/thread";

/**
 * Variant A — "Sessions rail": session navigation now lives in the app
 * sidebar ("Recent chats" + the sidebar "New chat" button), so this variant
 * is the plain full-width thread — the baseline for comparing thread-area
 * chrome against the breadcrumb / document-flow variants.
 */
export function ChatRail() {
	return (
		<div className="flex h-full">
			<main className="min-w-0 flex-1">
				<Thread />
			</main>
		</div>
	);
}
