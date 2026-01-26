import {
	getAbsoluteZoom,
	getZoomFactor,
} from "advanced-cropper/extensions/absolute-zoom";
import type React from "react";
import type { CSSProperties } from "react";
import { CropperFade, type CropperRef } from "react-advanced-cropper";
import { cn } from "@/lib/utils";
import { CropperNavigation } from "./cropper-navigation";

interface CropperWrapperProps {
	cropper: CropperRef;
	loading: boolean;
	loaded: boolean;
	className?: string;
	style?: CSSProperties;
	children?: React.ReactNode;
}

export const CropperWrapper: React.FC<CropperWrapperProps> = ({
	cropper,
	children,
	loaded,
	loading,
	className,
}) => {
	const state = cropper.getState();
	const settings = cropper.getSettings();

	// Calculate absolute zoom and zoom limits
	const absoluteZoom = getAbsoluteZoom(state, settings);

	// Handle zoom changes
	const onZoom = (value: number, transitions?: boolean) => {
		const zoomFactor = getZoomFactor(state, settings, value);
		cropper.zoomImage(zoomFactor, {
			transitions: !!transitions,
		});
	};

	return (
		<CropperFade
			className={cn(
				"flex-grow min-h-0 h-full flex cursor-move bg-white",
				className,
			)}
			visible={state && loaded}
		>
			{children}
			<CropperNavigation
				className="absolute bottom-4 px-2 py-2 rounded-full"
				zoom={absoluteZoom}
				onZoom={onZoom}
			/>
		</CropperFade>
	);
};
