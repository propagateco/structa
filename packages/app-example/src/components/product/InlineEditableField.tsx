import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface InlineEditableFieldProps {
	value: string;
	onUpdate: (value: string) => void;
	placeholder?: string;
	className?: string;
	as?: 'input' | 'textarea';
	rows?: number;
}

export function InlineEditableField({
	value,
	onUpdate,
	placeholder = 'Click to edit',
	className,
	as = 'input',
	rows = 2,
}: InlineEditableFieldProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [localValue, setLocalValue] = useState(value);
	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			// Set cursor at the end instead of selecting all text
			const length = inputRef.current.value.length;
			inputRef.current.setSelectionRange(length, length);
		}
	}, [isEditing]);

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
		if (e.key === 'Enter' && as === 'input') {
			e.preventDefault();
			handleSave();
		} else if (e.key === 'Escape') {
			handleCancel();
		}
	};

	if (isEditing) {
		const sharedProps = {
			ref: inputRef as any,
			value: localValue,
			onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
				setLocalValue(e.target.value),
			onBlur: handleSave,
			onKeyDown: handleKeyDown,
			className: cn(
				'w-full bg-transparent border-none outline-none ring-0 focus:ring-0 p-0',
				className
			),
			placeholder,
		};

		if (as === 'textarea') {
			return <textarea {...sharedProps} rows={rows} />;
		}

		return <input {...sharedProps} type="text" />;
	}

	return (
		<div
			onClick={() => setIsEditing(true)}
			className={cn(
				'cursor-pointer rounded px-2 py-1 -mx-2 -my-1 hover:bg-muted/50 transition-colors',
				!value && 'text-muted-foreground',
				className
			)}
		>
			{value || placeholder}
		</div>
	);
}