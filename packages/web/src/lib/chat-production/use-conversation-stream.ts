"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatRun } from "@/lib/collections";
import type { ChatRunEvent } from "./types";

/**
 * Live WebSocket subscription to a conversation Durable Object. Provides the
 * Streams `events`, `messages`, and `runs`, merged with stale Neon rows on reconnect so the
 * production adapter can render running assistant turns immediately.
 *
 * Streams directly from the Worker over a short-lived HMAC capability ticket.
 */

type StreamEnvelope =
	| { type: "event"; event: RawEvent }
	| { type: "message"; message: RawMessage }
	| { type: "run"; run: RawRun };

/** Event payload exactly as the DO serialises it (createdAt is epoch ms). */
type RawEvent = Omit<ChatRunEvent, "createdAt"> & { createdAt: number };
type RawMessage = Omit<ChatMessage, "createdAt"> & { createdAt: number };
type RawRun = Omit<ChatRun, "createdAt" | "updatedAt"> & {
	createdAt: number;
	errorCode: string | null;
	updatedAt: number;
};

export type ConversationStreamState = {
	events: ChatRunEvent[];
	messages: ChatMessage[];
	runs: ChatRun[];
};

const MAX_BACKOFF_MS = 15_000;

const toDate = (value: number | Date): Date =>
	value instanceof Date ? value : new Date(value);

function mergeEvents(current: ChatRunEvent[], incoming: ChatRunEvent[]) {
	const byKey = new Map(
		current.map((event) => [`${event.runId}:${event.seq}`, event]),
	);
	for (const event of incoming) byKey.set(`${event.runId}:${event.seq}`, event);
	return [...byKey.values()].sort((a, b) => a.seq - b.seq);
}

function upsertById<T extends { id: string }>(current: T[], incoming: T): T[] {
	const index = current.findIndex((item) => item.id === incoming.id);
	const next = current.slice();
	if (index >= 0) next[index] = incoming;
	else next.push(incoming);
	return next;
}

export function useConversationStream(
	sessionId: string | null,
): ConversationStreamState {
	const queryClient = useQueryClient();
	const [events, setEvents] = useState<ChatRunEvent[]>([]);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [runs, setRuns] = useState<ChatRun[]>([]);
	const maxSeqRef = useRef(0);
	const socketRef = useRef<WebSocket | null>(null);

	const invalidate = useCallback(() => {
		void queryClient.invalidateQueries({ queryKey: ["chat-messages"] });
		void queryClient.invalidateQueries({ queryKey: ["chat-runs"] });
		void queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
	}, [queryClient]);

	useEffect(() => {
		setEvents([]);
		setMessages([]);
		setRuns([]);
		maxSeqRef.current = 0;

		if (!sessionId) return;
		let cancelled = false;
		let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
		let backoff = 1000;

		const openSocket = async () => {
			if (cancelled) return;

			try {
				const ticketRes = await fetch(
					`/api/chat/ticket?conversationId=${encodeURIComponent(sessionId)}`,
				);
				if (!ticketRes.ok) throw new Error(`Ticket ${ticketRes.status}`);
				const { ticket } = (await ticketRes.json()) as { ticket: string };

				// Hydrate with persisted events (e.g. a run started in another
				// tab or on a prior connection). Deduplication is handled in
				// mergeEvents so overlap with live WS messages is harmless.
				const replayRes = await fetch(
					`/api/chat/stream-events?conversationId=${encodeURIComponent(sessionId)}&afterSeq=${maxSeqRef.current}`,
				);
				if (replayRes.ok) {
					const { events: replayed } = (await replayRes.json()) as {
						events: RawEvent[];
					};
					if (replayed.length > 0) {
						const converted = replayed.map((event) => ({
							...event,
							createdAt: toDate(event.createdAt),
						}));
						setEvents((prev) => mergeEvents(prev, converted));
						for (const event of converted)
							if (event.seq > maxSeqRef.current) maxSeqRef.current = event.seq;
					}
				}

				const wsBase = import.meta.env.VITE_DATA_SERVICE_URL;
				if (!wsBase) throw new Error("VITE_DATA_SERVICE_URL is not set");
				const wsUrl = `${wsBase.replace(/^http/, "ws")}/conversations/${encodeURIComponent(sessionId)}/socket?ticket=${encodeURIComponent(ticket)}`;

				const socket = new WebSocket(wsUrl);
				socketRef.current = socket;

				socket.addEventListener("open", () => {
					backoff = 1000;
				});

				socket.addEventListener("message", (event: MessageEvent) => {
					let envelope: StreamEnvelope;
					try {
						envelope = JSON.parse(String(event.data));
					} catch {
						return;
					}

					if (envelope.type === "event") {
						const converted: ChatRunEvent = {
							...envelope.event,
							createdAt: toDate(envelope.event.createdAt),
						};
						setEvents((prev) => mergeEvents(prev, [converted]));
						if (converted.seq > maxSeqRef.current)
							maxSeqRef.current = converted.seq;
					} else if (envelope.type === "message") {
						const converted: ChatMessage = {
							...envelope.message,
							createdAt: toDate(envelope.message.createdAt),
						};
						setMessages((prev) => upsertById(prev, converted));
						// Persisted rows changed — refresh the Neon collection
						// caches (deliberately not on every event delta).
						invalidate();
					} else if (envelope.type === "run") {
						const converted: ChatRun = {
							...envelope.run,
							errorCode: envelope.run.errorCode ?? null,
							createdAt: toDate(envelope.run.createdAt),
							updatedAt: toDate(envelope.run.updatedAt),
						};
						setRuns((prev) => upsertById(prev, converted));
						invalidate();
					}
				});

				socket.addEventListener("close", () => {
					socketRef.current = null;
					if (cancelled) return;
					reconnectTimer = setTimeout(() => void openSocket(), backoff);
					backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
				});

				socket.addEventListener("error", () => {
					socket.close();
				});
			} catch (error) {
				console.error("Conversation stream connect failed", error);
				if (cancelled) return;
				reconnectTimer = setTimeout(() => void openSocket(), backoff);
				backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
			}
		};

		void openSocket();

		return () => {
			cancelled = true;
			if (reconnectTimer) clearTimeout(reconnectTimer);
			socketRef.current?.close();
			socketRef.current = null;
		};
	}, [sessionId, invalidate]);

	return { events, messages, runs };
}
