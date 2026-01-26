import { BrandingModel } from "@core/branding";
import {
	AccentColour,
	type Colour,
	ColourComposition,
	GreyColour,
} from "@core/utils/colour";
import { cva, type VariantProps } from "class-variance-authority";
import { useAtomValue, useSetAtom } from "jotai";
import { cn } from "@/lib/utils";
import {
	brandingChangesAtom,
	updateBrandingChangeAtom,
} from "@/state/branding";
import { ColourPicker } from "./colour-picker";

const colourBlockVariants = cva("p-3", {
	variants: {
		isLight: {
			true: "text-text-dark",
			false: "text-ds-paper",
		},
		editable: {
			true: "cursor-pointer",
			false: "cursor-not-allowed",
		},
	},
	defaultVariants: {
		isLight: true,
	},
});

interface ColourBlockProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof colourBlockVariants> {
	colour: Colour | AccentColour | GreyColour;
	name: string;
	hoveredElement?: "accent" | "grey" | null;
	visibleFor?: "accent" | "grey" | "both" | "default";
	isDefault?: boolean;
}

export const ColourBlock = ({
	colour,
	name,
	className,
	onMouseEnter,
	onMouseLeave,
	hoveredElement,
	visibleFor = "both",
	isDefault = false,
	...props
}: ColourBlockProps) => {
	// Use Jotai atoms for state management
	const updateChange = useSetAtom(updateBrandingChangeAtom);
	const changes = useAtomValue(brandingChangesAtom);

	const handleColourChange = (updatedColour: AccentColour | GreyColour) => {
		if (name === "Accent") {
			updateChange({
				colours: {
					...changes.colours,
					accent: updatedColour as AccentColour,
				},
			});
		} else if (name === "Grey") {
			updateChange({
				colours: {
					...changes.colours,
					grey: updatedColour as GreyColour,
				},
			});
		}
	};

	const ColourBlob = ({ showText }: { showText: boolean }) => {
		return (
			<div
				className={cn(
					className,
					colour.isCloseToWhite() && "border border-border",
					"w-full h-full flex flex-col justify-end rounded-lg",
				)}
				style={{
					backgroundColor: colour.formatHex(),
				}}
				{...props}
			>
				<div
					className={cn(
						colourBlockVariants({ isLight: colour.isLight() }),
						"p-3",
					)}
				>
					<p
						className={cn(showText ? "block" : "hidden", "font-medium text-lg")}
					>
						{name}
					</p>
					<p className="text-xs font-normal uppercase">
						{colour.formatHex().substring(1)}
					</p>
				</div>
			</div>
		);
	};

	// Calculate visibility based on hoveredElement and visibleFor props
	const getVisibility = (): string => {
		// If hoveredElement is not provided, always show
		if (hoveredElement === undefined) return "opacity-100";

		// Default blocks are visible when nothing is hovered (null) or when their specific type is hovered
		if (isDefault) {
			if (hoveredElement === null) return "opacity-100";
			if (visibleFor === "accent" && hoveredElement === "accent")
				return "opacity-100";
			if (visibleFor === "grey" && hoveredElement === "grey")
				return "opacity-100";
			if (visibleFor === "both") return "opacity-100";
			return "opacity-0";
		}

		// Non-default blocks follow specific visibility rules
		if (visibleFor === "accent" && hoveredElement === "accent")
			return "opacity-100";
		if (visibleFor === "grey" && hoveredElement === "grey")
			return "opacity-100";
		if (
			visibleFor === "both" &&
			(hoveredElement === "accent" || hoveredElement === "grey")
		)
			return "opacity-100";
		if (visibleFor === "default" && hoveredElement === null)
			return "opacity-100";

		return "opacity-0";
	};

	// Add opacity classes to the wrapper div based on visibility rules
	const wrapperClassName = cn(
		className,
		"absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out",
		getVisibility(),
	);

	const isEditableColour =
		colour instanceof AccentColour || colour instanceof GreyColour;

	// When using popover, we need to preserve the original className for grid layout
	return isEditableColour ? (
		<div
			className={wrapperClassName}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			{...props}
		>
			<ColourPicker colour={colour} onChange={handleColourChange}>
				{ColourBlob({ showText: true })}
			</ColourPicker>
		</div>
	) : (
		<div
			className={wrapperClassName}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			{...props}
		>
			{ColourBlob({ showText: false })}
		</div>
	);
};
