import { isNumber } from "advanced-cropper";
import cn from "classnames";
import { Minus, Plus } from "lucide-react";
import type { FC } from "react";
import { Slider } from "./slider";

interface CropperNavigationProps {
	zoom?: number;
	onZoom?: (value: number, transitions?: boolean) => void;
	className?: string;
	disabled?: unknown;
}

export const CropperNavigation: FC<CropperNavigationProps> = ({
	className,
	onZoom,
	zoom,
}) => {
	const onZoomIn = () => {
		if (onZoom && isNumber(zoom)) {
			onZoom(Math.min(1, zoom + 0.1), true);
		}
	};

	const onZoomOut = () => {
		if (onZoom && isNumber(zoom)) {
			onZoom(Math.max(0, zoom - 0.1), true);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center w-full">
			<div
				className={cn(
					"mx-auto flex justify-center items-center text-primary bg-white",
					className,
				)}
			>
				<button
					className="w-10 h-full flex items-center justify-center bg-transparent border-none outline-none p-0 cursor-pointer"
					onClick={onZoomOut}
				>
					<Minus strokeWidth={1} size={16} />
				</button>
				<Slider value={zoom} onChange={onZoom} className="mx-2" />
				<button
					className="w-10 h-full flex items-center justify-center bg-transparent border-none outline-none p-0 cursor-pointer"
					onClick={onZoomIn}
				>
					<Plus strokeWidth={1} size={16} />
				</button>
			</div>
		</div>
	);
};
