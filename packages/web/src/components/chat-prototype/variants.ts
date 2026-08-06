/** The three structural disclosures of sessions the prototype compares. */
export const CHAT_VARIANTS = ["rail", "breadcrumb", "document-flow"] as const;

export type PrototypeVariant = (typeof CHAT_VARIANTS)[number];

export const VARIANT_LABELS: Record<PrototypeVariant, string> = {
	rail: "Sessions rail",
	breadcrumb: "Breadcrumb menu",
	"document-flow": "Document flow",
};
