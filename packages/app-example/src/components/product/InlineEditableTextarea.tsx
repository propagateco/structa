import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface InlineEditableTextAreaProps {
	value: string;
	onUpdate: (value: string) => void;
	placeholder?: string;
	className?: string;
	minRows?: number;
	maxRows?: number;
}

export function InlineEditableTextArea({
	value,
	onUpdate,
	placeholder = "Click to edit",
	className,
	minRows = 1,
	maxRows = 10,
}: InlineEditableTextAreaProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [localValue, setLocalValue] = useState(value);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	useEffect(() => {
		if (isEditing && textareaRef.current) {
			textareaRef.current.focus();
			// Set cursor at the end instead of selecting all text
			const length = textareaRef.current.value.length;
			textareaRef.current.setSelectionRange(length, length);
			adjustHeight();
		}
	}, [isEditing]);

	useEffect(() => {
		if (textareaRef.current) {
			adjustHeight();
		}
	}, [localValue]);

	const adjustHeight = () => {
		if (textareaRef.current) {
			// Reset height to minimal (1 line) to get accurate scrollHeight
			textareaRef.current.style.height = "1.5rem";

			const scrollHeight = textareaRef.current.scrollHeight;
			const lineHeight = 24; // Approximate line height in pixels
			const minHeight = lineHeight * minRows;
			const maxHeight = lineHeight * maxRows;

			// Only grow if content requires more space
			const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

			textareaRef.current.style.height = `${newHeight}px`;
		}
	};

	const handleSave = () => {
		if (localValue !== value) {
			onUpdate(localValue);
		}
		setIsEditing(false);
	};

	const handleCancel = () => {
		setLocalValue(value);
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			handleCancel();
		} else if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSave();
		}
		// Shift+Enter will create a new line (default behavior)
	};

	if (isEditing) {
		return (
			<textarea
				ref={textareaRef}
				value={localValue}
				onChange={(e) => {
					setLocalValue(e.target.value);
					adjustHeight();
				}}
				onBlur={handleSave}
				onKeyDown={handleKeyDown}
				className={cn(
					"w-full bg-white shadow-md rounded px-2 py-1 border border-border outline-none ring-0 focus:ring-0 resize-none overflow-hidden",
					className,
				)}
				placeholder={placeholder}
				style={{ minHeight: "1.5rem" }}
			/>
		);
	}

	// Display text with proper line breaks when not editing
	return (
		<div
			onClick={() => setIsEditing(true)}
			className={cn(
				"cursor-pointer rounded px-2 py-1 hover:bg-muted/50 transition-colors whitespace-pre-wrap w-full",
				!value && "text-muted-foreground",
				className,
			)}
			style={{ minHeight: "1.5rem" }}
		>
			{value || placeholder}
		</div>
	);
}
