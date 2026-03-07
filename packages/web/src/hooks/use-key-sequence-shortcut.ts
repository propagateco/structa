import * as React from "react";

type KeySequenceOptions = {
	sequence: string[];
	timeoutMs?: number;
	enabled?: boolean;
	allowInInputs?: boolean;
};

const DEFAULT_TIMEOUT_MS = 700;

function isEditableElement(element: Element | null) {
	if (!element || !(element instanceof HTMLElement)) {
		return false;
	}

	const tagName = element.tagName;
	return (
		tagName === "INPUT" || tagName === "TEXTAREA" || element.isContentEditable
	);
}

function normalizeKey(key: string) {
	return key.toLowerCase();
}

export function useKeySequenceShortcut(
	options: KeySequenceOptions,
	onMatch: () => void,
) {
	const {
		sequence,
		timeoutMs = DEFAULT_TIMEOUT_MS,
		enabled = true,
		allowInInputs = false,
	} = options;
	const sequenceRef = React.useRef(sequence.map(normalizeKey));
	const stepRef = React.useRef(0);
	const lastKeyTimeRef = React.useRef(0);

	React.useEffect(() => {
		sequenceRef.current = sequence.map(normalizeKey);
	}, [sequence]);

	React.useEffect(() => {
		if (!enabled) {
			return undefined;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (!allowInInputs && isEditableElement(document.activeElement)) {
				return;
			}

			const expectedSequence = sequenceRef.current;
			if (!expectedSequence.length) {
				return;
			}

			const now = Date.now();
			if (stepRef.current > 0 && now - lastKeyTimeRef.current > timeoutMs) {
				stepRef.current = 0;
			}

			const key = normalizeKey(event.key);
			const expectedKey = expectedSequence[stepRef.current];
			if (key !== expectedKey) {
				stepRef.current = 0;
				return;
			}

			lastKeyTimeRef.current = now;
			stepRef.current += 1;

			if (stepRef.current >= expectedSequence.length) {
				stepRef.current = 0;
				event.preventDefault();
				onMatch();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [allowInInputs, enabled, onMatch, timeoutMs]);
}
