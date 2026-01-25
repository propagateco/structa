import {
	type AccentColour,
	Colour,
	ColourComposition,
	type GreyColour,
} from "@core/utils/colour";
import { Pipette } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface ColourPickerProps {
	colour: AccentColour | GreyColour;
	onChange: (colour: AccentColour | GreyColour) => void;
	children: React.ReactNode;
}

export function ColourPicker({
	colour,
	onChange,
	children,
}: ColourPickerProps) {
	const [hexColor, setHexColor] = useState(colour.formatHex());
	const [open, setOpen] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Update hex color when the colour prop changes
	useEffect(() => {
		setHexColor(colour.formatHex());
	}, [colour]);

	const handleColorChange = (hex: string) => {
		setHexColor(hex);

		colour.setColourFromHex(hex);
		onChange(colour);
	};

	const handleInputBlur = () => {
		const upperHex = hexColor.toUpperCase();
		if (upperHex !== hexColor) {
			setHexColor(upperHex);
			colour.setColourFromHex(upperHex);
			onChange(colour);
		}
	};

	const handleMouseEnter = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setOpen(true);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setOpen(false);
		}, 300);
	};

	const handleEyeDropper = async () => {
		// Check if EyeDropper API is available
		if (!("EyeDropper" in window)) {
			console.warn("EyeDropper API is not supported in this browser");
			return;
		}

		try {
			// @ts-expect-error - EyeDropper API types might not be available
			const eyeDropper = new window.EyeDropper();
			const result = await eyeDropper.open();

			// The result contains sRGBHex which is the hex color
			if (result && result.sRGBHex) {
				const upperHex = result.sRGBHex.toUpperCase();
				handleColorChange(upperHex);
			}
		} catch (error) {
			// User cancelled the eye dropper or error occurred
			console.log("Eye dropper cancelled or error:", error);
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div
					className="cursor-pointer hover:opacity-90 transition-opacity w-full h-full"
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onClick={() => setOpen(true)}
				>
					{children}
				</div>
			</PopoverTrigger>
			<PopoverContent
				className="w-auto p-3"
				align="center"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<HexColorPicker color={hexColor} onChange={handleColorChange} />
				<div className="mt-3 flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium text-muted-foreground">
							Hex
						</span>
						<HexColorInput
							color={hexColor}
							onChange={handleColorChange}
							onBlur={handleInputBlur}
							className="w-20 px-3 py-2 text-sm uppercase border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground"
							placeholder="#FFFFFF"
						/>
					</div>
					<Button
						size="icon"
						variant="ghost"
						className="h-8 w-8"
						onClick={handleEyeDropper}
						type="button"
						title="Pick color from screen"
					>
						<Pipette className="h-4 w-4" />
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
