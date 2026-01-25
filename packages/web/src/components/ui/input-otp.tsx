import * as React from "react";
import { Input } from "@/components/ui/input";

interface OTPInputProps {
	length?: number;
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

export function OTPInput({
	length = 6,
	value,
	onChange,
	disabled = false,
}: OTPInputProps) {
	const inputRefs = React.useRef<(HTMLInputElement | null)[]>(
		new Array(length).fill(null),
	);

	const handleChange = (
		index: number,
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const newValue = e.target.value;
		if (newValue.length > 1) return;

		const newOtp = value.split("");
		newOtp[index] = newValue;
		const otpValue = newOtp.join("");

		onChange(otpValue);

		// Auto-focus next input
		if (newValue && index < length - 1) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Backspace" && !value[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text").slice(0, length);
		if (/^\d+$/.test(pastedData)) {
			onChange(pastedData);
			// Focus the last input
			inputRefs.current[Math.min(pastedData.length, length) - 1]?.focus();
		}
	};

	return (
		<div className="flex gap-2 justify-center">
			{Array.from({ length }).map((_, index) => (
				<Input
					key={`otp-${index}`}
					ref={(ref) => {
						inputRefs.current[index] = ref;
					}}
					type="text"
					inputMode="numeric"
					pattern="[0-9]*"
					maxLength={1}
					value={value[index] || ""}
					onChange={(e) => handleChange(index, e)}
					onKeyDown={(e) => handleKeyDown(index, e)}
					onPaste={handlePaste}
					disabled={disabled}
					className="w-12 h-12 text-center text-xl font-bold"
					autoFocus={index === 0}
				/>
			))}
		</div>
	);
}
