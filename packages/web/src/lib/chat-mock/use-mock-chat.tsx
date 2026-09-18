"use client";

import { useExternalStoreRuntime } from "@assistant-ui/react";
import { useMemo, useSyncExternalStore } from "react";
import { buildAdapter } from "./adapter";
import { createMockEngine } from "./engine";
import type { MockState } from "./types";

/**
 * Shared singleton engine for the whole prototype. Module-level so the chat
 * survives variant switches and route re-mounts within a session; a page
 * reload resets to the seeded demo data (fine for a throwaway prototype).
 */
export const mockEngine = createMockEngine();

/** Raw engine state — for chrome components that must not build a runtime. */
export function useMockChatState(): MockState {
	return useSyncExternalStore(
		mockEngine.subscribe,
		mockEngine.getState,
		mockEngine.getState,
	);
}

/**
 * Engine state + the ExternalStoreRuntime. `useExternalStoreRuntime` calls
 * `setAdapter` whenever the memoized adapter identity changes, which happens
 * exactly when the engine state changes (every simulated stream tick).
 */
export function useMockChat() {
	const state = useMockChatState();
	const adapter = useMemo(() => buildAdapter(state, mockEngine), [state]);
	const runtime = useExternalStoreRuntime(adapter);
	return { runtime, state };
}
