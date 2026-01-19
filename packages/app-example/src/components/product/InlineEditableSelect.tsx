import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface InlineEditableSelectProps {
	value: string;
	onUpdate: (value: string) => void;
	options: { value: string; label: string }[];
	placeholder?: string;
	className?: string;
}

export function InlineEditableSelect({
	value,
	onUpdate,
	options,
	placeholder = 'Select...',
	className,
}: InlineEditableSelectProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleValueChange = (newValue: string) => {
		onUpdate(newValue);
		setIsOpen(false);
	};

	const currentOption = options.find((opt) => opt.value === value);
	const displayValue = currentOption?.label || placeholder;

	return (
		<div
			className={cn(
				'cursor-pointer rounded px-2 py-1 -my-1 hover:bg-muted transition-colors inline-block w-full',
				!value && 'text-muted-foreground',
				className
			)}
			onClick={() => setIsOpen(true)}
		>
			{isOpen ? (
				<Select
					open={isOpen}
					onOpenChange={setIsOpen}
					value={value}
					onValueChange={handleValueChange}
				>
					<SelectTrigger className="h-auto p-0 border-none shadow-none focus:ring-0 text-md">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{options.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			) : (
				displayValue
			)}
		</div>
	);
}
