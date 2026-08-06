/**
 * Mock run scripts — the canned event timelines the engine plays back with
 * timers to simulate streaming. Scripts mirror the locked event kinds:
 * `content` (streamed text), `tool_call`/`tool_result` (chips), `done`
 * (terminal success) and `error` (terminal failure + retry).
 */

export type ScriptStep =
	| { kind: "text"; delay: number; text: string }
	| {
			kind: "tool";
			delay: number;
			toolName: string;
			args: Record<string, unknown>;
			argsText: string;
			/** Gap between the tool_call and its tool_result (spinner time). */
			resultDelay: number;
			result: string;
			resultIsError?: boolean;
	  }
	| { kind: "error"; delay: number; message: string }
	| { kind: "done"; delay: number };

const DEFAULT_SCRIPT: ScriptStep[] = [
	{
		kind: "text",
		delay: 350,
		text: "On it — let me pull the relevant context first.",
	},
	{
		kind: "tool",
		delay: 500,
		toolName: "plan_step",
		args: { step: "gather project context" },
		argsText: '{"step": "gather project context"}',
		resultDelay: 700,
		result: "context ready: floor plan v3, budget sheet, 2 open quotes",
	},
	{
		kind: "text",
		delay: 500,
		text: "I've pulled the floor plan, the budget sheet, and the two open quotes. The kitchen counter layout and the quote comparison are the two things that most change your budget picture right now.",
	},
	{
		kind: "text",
		delay: 550,
		text: "Want me to dig into one of those, or start on the patio materials?",
	},
	{ kind: "done", delay: 300 },
];

const MEASURE_SCRIPT: ScriptStep[] = [
	{
		kind: "text",
		delay: 350,
		text: "I'll pull the kitchen measurements from the floor plan and check the current countertop layout.",
	},
	{
		kind: "tool",
		delay: 500,
		toolName: "measure_room",
		args: { room: "kitchen", scope: ["counters", "sink", "island"] },
		argsText: '{"room": "kitchen", "scope": ["counters", "sink", "island"]}',
		resultDelay: 850,
		result:
			"kitchen: 4.2m x 3.6m · 6.8m counter run · island 1.8m x 0.9m · 1.2m aisle",
	},
	{
		kind: "text",
		delay: 550,
		text: "The kitchen is **4.2 × 3.6 m** with a **6.8 m counter run** including the island — enough for a 40 cm-deep counter layout.",
	},
	{
		kind: "text",
		delay: 550,
		text: "Clearances work out: you keep a 1.2 m aisle. I've added the measurements to the floor-plan notes.",
	},
	{ kind: "done", delay: 300 },
];

const QUOTES_SCRIPT: ScriptStep[] = [
	{
		kind: "text",
		delay: 350,
		text: "Comparing quote A and quote B line by line…",
	},
	{
		kind: "tool",
		delay: 500,
		toolName: "compare_quotes",
		args: { quotes: ["Q-102", "Q-118"], focus: ["labour", "materials"] },
		argsText:
			'{"quotes": ["Q-102", "Q-118"], "focus": ["labour", "materials"]}',
		resultDelay: 900,
		result:
			"A $48,200 (labour 38%) · B $52,700 (labour 31%) · B includes engineered oak flooring + appliances omitted from A",
	},
	{
		kind: "text",
		delay: 600,
		text: "Quote **A ($48.2k)** looks cheaper, but **B ($52.7k)** includes engineered oak flooring and appliances that A leaves out.",
	},
	{
		kind: "text",
		delay: 600,
		text: "Adding those to A puts it at **$50.6k** — so B is really only **+$2.1k** once the specs match, with a lower labour share. I'd pick **B**.",
	},
	{ kind: "done", delay: 300 },
];

const STRUCTURAL_SCRIPT: ScriptStep[] = [
	{
		kind: "text",
		delay: 350,
		text: "Let me check the structural drawings for that wall…",
	},
	{
		kind: "tool",
		delay: 500,
		toolName: "check_structural",
		args: { wall: "K-L10 (kitchen ↔ living)" },
		argsText: '{"wall": "K-L10 (kitchen ↔ living)"}',
		resultDelay: 800,
		result:
			"K-L10 is a partition — no joists bear on it; the lintel above spans 3.1 m onto the external walls",
	},
	{
		kind: "text",
		delay: 500,
		text: "Good news — **the wall is a non-load-bearing partition**. The lintel above spans onto the external walls, so removing it is structurally safe.",
	},
	{
		kind: "text",
		delay: 550,
		text: "You'll still need a building-control check for the new opening, and the partition's wiring will need relocating.",
	},
	{ kind: "done", delay: 300 },
];

const MATERIALS_SCRIPT: ScriptStep[] = [
	{
		kind: "text",
		delay: 350,
		text: "Comparing paver options for the 24 m² patio…",
	},
	{
		kind: "tool",
		delay: 500,
		toolName: "search_materials",
		args: { surface: "patio", areaM2: 24, budget: 3500 },
		argsText: '{"surface": "patio", "area_m2": 24, "budget": 3500}',
		resultDelay: 800,
		result:
			"poured concrete $42/m² · pavers $58/m² · porcelain $95/m² · composite deck $120/m²",
	},
	{
		kind: "text",
		delay: 500,
		text: "For a $3.5k budget across 24 m²: **poured concrete (~$1.0k)** is cheapest; **pavers (~$1.4k)** are the sweet spot for looks and durability.",
	},
	{
		kind: "text",
		delay: 550,
		text: "Porcelain (~$2.3k) and composite decking (~$2.9k) blow the budget. I'd go pavers — flag me if you want a supplier shortlist.",
	},
	{ kind: "done", delay: 300 },
];

const FAILURE_SCRIPT: ScriptStep[] = [
	{
		kind: "text",
		delay: 350,
		text: "Let me pull the relevant plans and check…",
	},
	{
		kind: "tool",
		delay: 600,
		toolName: "check_structural",
		args: { source: "structural drawings", wall: "kitchen-living" },
		argsText: '{"source": "structural drawings", "wall": "kitchen-living"}',
		resultDelay: 900,
		result:
			"Document not ready: the ground-floor plan is still processing (uploaded 2 min ago).",
		resultIsError: true,
	},
	{
		kind: "error",
		delay: 400,
		message:
			"Couldn't read the structural drawings — the ground-floor plan is still uploading. Try again in a moment.",
	},
];

/** Keywords routed to a themed script so the mock feels on-topic. */
const ROUTES: Array<{ match: RegExp; steps: ScriptStep[] }> = [
	{ match: /measure|dimension|room size|countertop/i, steps: MEASURE_SCRIPT },
	{ match: /compare|quote|budget|cost/i, steps: QUOTES_SCRIPT },
	{ match: /load.?bearing|wall|structural/i, steps: STRUCTURAL_SCRIPT },
	{ match: /material|patio|floor|tile/i, steps: MATERIALS_SCRIPT },
];

const FAILURE_RE = /fail|error|give up|can't read|unavailable/i;

/**
 * Picks the script for a prompt. `attempt` is the number of prior runs bound
 * to the same user message (0 = first send). Retries (`attempt >= 1`) always
 * recover with a success script — the demo story is "retry gets you past the
 * failure".
 */
export function scriptForPrompt(prompt: string, attempt: number): ScriptStep[] {
	if (attempt === 0 && FAILURE_RE.test(prompt)) return FAILURE_SCRIPT;

	const match = ROUTES.find((route) => route.match.test(prompt));
	if (match) return match.steps;
	return DEFAULT_SCRIPT;
}

/** Title assigned to a session on its first run (iss-017: empty sessions never persist). */
export function titleForPrompt(prompt: string): string {
	if (/measure|dimension|countertop/i.test(prompt)) {
		return "Kitchen measurements";
	}
	if (/compare|quote|budget|cost/i.test(prompt)) return "Quote comparison";
	if (/load.?bearing|wall|structural/i.test(prompt)) return "Structural check";
	if (/material|patio|floor|tile/i.test(prompt)) return "Materials research";
	return prompt.length > 40 ? `${prompt.slice(0, 40)}…` : prompt;
}
