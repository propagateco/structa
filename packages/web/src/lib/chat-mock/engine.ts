/**
 * Mock chat engine: an in-memory, timer-driven store of sessions + runs that
 * the `ExternalStoreRuntime` adapter reads from. State is immutable — every
 * mutation clones, bumps `version` and notifies subscribers, so
 * `useSyncExternalStore` sees a fresh snapshot per tick (simulated streaming).
 *
 * Behavior mirrors the locked iss-017 decisions:
 * - Retry (`retryRun`) appends a *new* run; the failed bubble stays (Q6).
 * - No stop button; the composer is gated while a run is in-flight (Q7).
 * - Runs keep streaming in the background after switching sessions, so the
 *   run materializes when you come back (active-session-only subscription
 *   + server-side completion from iss-017).
 */
import { type ScriptStep, scriptForPrompt, titleForPrompt } from "./scripts";
import type { MockRun, MockSession, MockState } from "./types";

export type MockEngine = {
	getState: () => MockState;
	subscribe: (listener: () => void) => () => void;
	sendMessage: (text: string) => void;
	/** Q6 retry: new run on the same user message; null → last run in active session. */
	retryRun: (runId: string | null) => void;
	createSession: () => string;
	switchSession: (sessionId: string) => void;
	renameSession: (sessionId: string, title: string) => void;
	deleteSession: (sessionId: string) => void;
	archiveSession: (sessionId: string) => void;
	refresh: () => void;
	dispose: () => void;
};

const uid = () => Math.random().toString(36).slice(2, 10);

function seedRuns(sessionId: string): MockRun[] {
	const at = Date.now() - 1000 * 60 * 60 * 24 * 2; // ~2 days ago

	const makeEvent = (seq: number, minutesAgo: number) => ({
		seq,
		at: at + minutesAgo * 60 * 1000,
	});

	return [
		{
			runId: "run-kitchen-1",
			sessionId,
			userMessageId: "msg-kitchen-1",
			prompt: "Measure the kitchen for new countertops",
			status: "complete",
			startedAt: at + 60 * 1000,
			events: [
				{
					type: "content",
					text: "I'll pull the kitchen measurements from the floor plan and check the current countertop layout.",
					...makeEvent(1, 1),
				},
				{
					type: "tool_call",
					toolCallId: "tc-kitchen-1",
					toolName: "measure_room",
					args: { room: "kitchen", scope: ["counters", "sink", "island"] },
					argsText:
						'{"room": "kitchen", "scope": ["counters", "sink", "island"]}',
					...makeEvent(2, 1),
				},
				{
					type: "tool_result",
					toolCallId: "tc-kitchen-1",
					result:
						"kitchen: 4.2m x 3.6m · 6.8m counter run · island 1.8m x 0.9m · 1.2m aisle",
					...makeEvent(3, 1),
				},
				{
					type: "content",
					text: "The kitchen is **4.2 × 3.6 m** with a **6.8 m counter run** including the island. I've added the measurements to the floor-plan notes.",
					...makeEvent(4, 2),
				},
				{ type: "done", ...makeEvent(5, 2) },
			],
		},
	];
}

function seed(): MockState {
	const base = Date.now();
	const sessions: MockSession[] = [
		{
			id: "ses-kitchen",
			title: "Kitchen measurements",
			createdAt: base - 1000 * 60 * 60 * 24 * 2,
			runs: seedRuns("ses-kitchen"),
		},
		{
			id: "ses-quotes",
			title: "Quote comparison",
			createdAt: base - 1000 * 60 * 60 * 26,
			runs: [
				{
					runId: "run-quotes-1",
					sessionId: "ses-quotes",
					userMessageId: "msg-quotes-1",
					prompt: "Compare quote A and quote B for the renovation",
					status: "complete",
					startedAt: base - 1000 * 60 * 60 * 25,
					events: [
						{
							type: "content",
							text: "Comparing quote A and quote B line by line…",
							seq: 1,
							at: base - 1000 * 60 * 60 * 25,
						},
						{
							type: "tool_call",
							toolCallId: "tc-quotes-1",
							toolName: "compare_quotes",
							args: {
								quotes: ["Q-102", "Q-118"],
								focus: ["labour", "materials"],
							},
							argsText:
								'{"quotes": ["Q-102", "Q-118"], "focus": ["labour", "materials"]}',
							seq: 2,
							at: base - 1000 * 60 * 60 * 25,
						},
						{
							type: "tool_result",
							toolCallId: "tc-quotes-1",
							result:
								"A $48,200 (labour 38%) · B $52,700 (labour 31%) · B includes engineered oak flooring + appliances omitted from A",
							seq: 3,
							at: base - 1000 * 60 * 60 * 25,
						},
						{
							type: "content",
							text: "Quote **A ($48.2k)** looks cheaper, but **B ($52.7k)** includes engineered oak flooring and appliances that A leaves out. Once the specs match, B is really only **+$2.1k** — I'd pick **B**.",
							seq: 4,
							at: base - 1000 * 60 * 60 * 25,
						},
						{ type: "done", seq: 5, at: base - 1000 * 60 * 60 * 25 },
					],
				},
			],
		},
		{
			id: "ses-structural",
			title: "Structural check",
			createdAt: base - 1000 * 60 * 60 * 3,
			runs: [
				{
					runId: "run-structural-1",
					sessionId: "ses-structural",
					userMessageId: "msg-structural-1",
					prompt: "Can we remove the wall between kitchen and living room?",
					status: "error",
					errorMessage:
						"Couldn't read the structural drawings — the ground-floor plan is still uploading. Try again in a moment.",
					startedAt: base - 1000 * 60 * 60 * 2.5,
					events: [
						{
							type: "content",
							text: "Let me check the structural drawings for that wall…",
							seq: 1,
							at: base - 1000 * 60 * 60 * 2.5,
						},
						{
							type: "tool_call",
							toolCallId: "tc-structural-1",
							toolName: "check_structural",
							args: { source: "structural drawings", wall: "kitchen-living" },
							argsText:
								'{"source": "structural drawings", "wall": "kitchen-living"}',
							seq: 2,
							at: base - 1000 * 60 * 60 * 2.5,
						},
						{
							type: "tool_result",
							toolCallId: "tc-structural-1",
							result:
								"Document not ready: the ground-floor plan is still processing (uploaded 2 min ago).",
							isError: true,
							seq: 3,
							at: base - 1000 * 60 * 60 * 2.5,
						},
						{
							type: "error",
							message:
								"Couldn't read the structural drawings — the ground-floor plan is still uploading. Try again in a moment.",
							seq: 4,
							at: base - 1000 * 60 * 60 * 2.5,
						},
					],
				},
				{
					// Retry: same user message, new run, appended below the failure (iss-017).
					runId: "run-structural-2",
					sessionId: "ses-structural",
					userMessageId: "msg-structural-1",
					prompt: "Can we remove the wall between kitchen and living room?",
					status: "complete",
					startedAt: base - 1000 * 60 * 60 * 2,
					events: [
						{
							type: "content",
							text: "Retrying — checking the structural drawings again…",
							seq: 1,
							at: base - 1000 * 60 * 60 * 2,
						},
						{
							type: "tool_call",
							toolCallId: "tc-structural-2",
							toolName: "check_structural",
							args: { wall: "K-L10 (kitchen ↔ living)" },
							argsText: '{"wall": "K-L10 (kitchen ↔ living)"}',
							seq: 2,
							at: base - 1000 * 60 * 60 * 2,
						},
						{
							type: "tool_result",
							toolCallId: "tc-structural-2",
							result:
								"K-L10 is a partition — no joists bear on it; the lintel above spans 3.1 m onto the external walls",
							seq: 3,
							at: base - 1000 * 60 * 60 * 2,
						},
						{
							type: "content",
							text: "Good news — **the wall is a non-load-bearing partition**, so removing it is structurally safe. You'll still need a building-control check for the new opening.",
							seq: 4,
							at: base - 1000 * 60 * 60 * 2,
						},
						{ type: "done", seq: 5, at: base - 1000 * 60 * 60 * 2 },
					],
				},
			],
		},
		{
			id: "ses-materials",
			title: "Materials research",
			createdAt: base - 1000 * 60 * 45,
			runs: [
				{
					runId: "run-materials-1",
					sessionId: "ses-materials",
					userMessageId: "msg-materials-1",
					prompt: "What patio material fits a $3.5k budget?",
					status: "complete",
					startedAt: base - 1000 * 60 * 44,
					events: [
						{
							type: "content",
							text: "Comparing paver options for the 24 m² patio…",
							seq: 1,
							at: base - 1000 * 60 * 44,
						},
						{
							type: "tool_call",
							toolCallId: "tc-materials-1",
							toolName: "search_materials",
							args: { surface: "patio", areaM2: 24, budget: 3500 },
							argsText: '{"surface": "patio", "area_m2": 24, "budget": 3500}',
							seq: 2,
							at: base - 1000 * 60 * 44,
						},
						{
							type: "tool_result",
							toolCallId: "tc-materials-1",
							result:
								"poured concrete $42/m² · pavers $58/m² · porcelain $95/m² · composite deck $120/m²",
							seq: 3,
							at: base - 1000 * 60 * 44,
						},
						{
							type: "content",
							text: "For a $3.5k budget across 24 m²: **poured concrete (~$1.0k)** is cheapest; **pavers (~$1.4k)** are the sweet spot for looks and durability. I'd go pavers.",
							seq: 4,
							at: base - 1000 * 60 * 44,
						},
						{ type: "done", seq: 5, at: base - 1000 * 60 * 44 },
					],
				},
			],
		},
	];

	return { version: 0, activeSessionId: "ses-kitchen", sessions };
}

export function createMockEngine(): MockEngine {
	let state: MockState = seed();
	const listeners = new Set<() => void>();
	const timers = new Set<ReturnType<typeof setTimeout>>();
	const timerSessions = new Map<ReturnType<typeof setTimeout>, string>();

	const notify = () => {
		for (const listener of listeners) listener();
	};

	const mutate = (mutator: (draft: MockState) => void) => {
		const next = structuredClone(state);
		mutator(next);
		next.version += 1;
		state = next;
		notify();
	};

	const schedule = (sessionId: string, fn: () => void, ms: number) => {
		const timer = setTimeout(() => {
			timers.delete(timer);
			timerSessions.delete(timer);
			fn();
		}, ms);
		timers.add(timer);
		timerSessions.set(timer, sessionId);
	};

	const findSession = (sessionId: string) =>
		state.sessions.find((session) => session.id === sessionId);

	const findRun = (runId: string) =>
		state.sessions
			.flatMap((session) => session.runs)
			.find((run) => run.runId === runId);

	const playScript = (
		sessionId: string,
		runId: string,
		steps: ScriptStep[],
	) => {
		let cursor = 0;
		for (const step of steps) {
			cursor += step.delay;
			schedule(
				sessionId,
				() => {
					mutate((draft) => {
						const run = draft.sessions
							.flatMap((session) => session.runs)
							.find((r) => r.runId === runId);
						if (!run) return;
						const seq = run.events.length + 1;
						const at = Date.now();

						if (step.kind === "text") {
							run.events.push({ type: "content", seq, at, text: step.text });
						} else if (step.kind === "tool") {
							run.events.push({
								type: "tool_call",
								seq,
								at,
								toolCallId: uid(),
								toolName: step.toolName,
								args: step.args,
								argsText: step.argsText,
							});
							// The result is a separate event `resultDelay` later.
							schedule(
								sessionId,
								() => {
									mutate((draft2) => {
										const run2 = draft2.sessions
											.flatMap((session) => session.runs)
											.find((r) => r.runId === runId);
										if (!run2) return;
										const call = [...run2.events]
											.reverse()
											.find((event) => event.type === "tool_call");
										if (!call) return;
										run2.events.push({
											type: "tool_result",
											seq: run2.events.length + 1,
											at: Date.now(),
											toolCallId: call.toolCallId,
											result: step.result,
											isError: step.resultIsError,
										});
									});
								},
								step.resultDelay,
							);
						} else if (step.kind === "error") {
							run.events.push({
								type: "error",
								seq,
								at,
								message: step.message,
							});
							run.status = "error";
							run.errorMessage = step.message;
						} else if (step.kind === "done") {
							run.events.push({ type: "done", seq, at });
							run.status = "complete";
						}
					});
				},
				cursor,
			);
		}
	};

	const sendMessage = (text: string) => {
		const trimmed = text.trim();
		if (!trimmed) return;
		const session = findSession(state.activeSessionId);
		if (!session) return;

		const userMessageId = uid();
		const run: MockRun = {
			runId: uid(),
			sessionId: session.id,
			userMessageId,
			prompt: trimmed,
			status: "running",
			events: [],
			startedAt: Date.now(),
		};

		mutate((draft) => {
			const target = draft.sessions.find((s) => s.id === session.id);
			if (!target) return;
			if (target.runs.length === 0) target.title = titleForPrompt(trimmed);
			target.runs.push(run);
		});

		playScript(session.id, run.runId, scriptForPrompt(trimmed, 0));
	};

	const retryRun = (runId: string | null) => {
		const target = runId ? findRun(runId) : undefined;
		const source =
			target ??
			state.sessions.find((s) => s.id === state.activeSessionId)?.runs.at(-1);
		if (!source || source.status === "running") return;

		const attempt =
			findSession(source.sessionId)?.runs.filter(
				(run) => run.userMessageId === source.userMessageId,
			).length ?? 1;

		const run: MockRun = {
			runId: uid(),
			sessionId: source.sessionId,
			userMessageId: source.userMessageId,
			prompt: source.prompt,
			status: "running",
			events: [],
			startedAt: Date.now(),
		};

		mutate((draft) => {
			const session = draft.sessions.find((s) => s.id === source.sessionId);
			if (!session) return;
			session.runs.push(run);
		});

		playScript(
			source.sessionId,
			run.runId,
			scriptForPrompt(source.prompt, attempt),
		);
	};

	const createSession = () => {
		const id = uid();
		mutate((draft) => {
			draft.sessions.push({
				id,
				title: "New chat",
				createdAt: Date.now(),
				runs: [],
			});
			draft.activeSessionId = id;
		});
		return id;
	};

	const switchSession = (sessionId: string) => {
		if (sessionId === state.activeSessionId) return;
		mutate((draft) => {
			draft.activeSessionId = sessionId;
		});
	};

	const renameSession = (sessionId: string, title: string) => {
		mutate((draft) => {
			const session = draft.sessions.find((s) => s.id === sessionId);
			if (session) session.title = title;
		});
	};

	const settleAfterRemoval = (draft: MockState) => {
		const remaining = draft.sessions.filter((s) => !s.archived);
		if (!remaining.some((s) => s.id === draft.activeSessionId)) {
			if (remaining.length > 0) {
				draft.activeSessionId = remaining[0].id;
			} else {
				const id = uid();
				draft.sessions.push({
					id,
					title: "New chat",
					createdAt: Date.now(),
					runs: [],
				});
				draft.activeSessionId = id;
			}
		}
	};

	const deleteSession = (sessionId: string) => {
		for (const timer of timers) {
			if (timerSessions.get(timer) === sessionId) clearTimeout(timer);
		}
		mutate((draft) => {
			draft.sessions = draft.sessions.filter((s) => s.id !== sessionId);
			settleAfterRemoval(draft);
		});
	};

	const archiveSession = (sessionId: string) => {
		mutate((draft) => {
			const session = draft.sessions.find((s) => s.id === sessionId);
			if (session) session.archived = true;
			settleAfterRemoval(draft);
		});
	};

	return {
		getState: () => state,
		subscribe: (listener) => {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		sendMessage,
		retryRun,
		createSession,
		switchSession,
		renameSession,
		deleteSession,
		archiveSession,
		refresh: notify,
		dispose: () => {
			for (const timer of timers) clearTimeout(timer);
			timers.clear();
			listeners.clear();
		},
	};
}
