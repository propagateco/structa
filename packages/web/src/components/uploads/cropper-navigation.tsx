import { isNumber } from "advanced-cropper";
import { Minus, Plus } from "lucide-react";
import React, { type FC, PureComponent } from "react";
import { cn } from "@/lib/utils";

interface CropperNavigationProps {
	zoom?: number;
	onZoom?: (value: number, transitions?: boolean) => void;
	className?: string;
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
					type="button"
				>
					<Minus strokeWidth={1} size={16} />
				</button>
				<Slider value={zoom} onChange={onZoom} className="mx-2" />
				<button
					className="w-10 h-full flex items-center justify-center bg-transparent border-none outline-none p-0 cursor-pointer"
					onClick={onZoomIn}
					type="button"
				>
					<Plus strokeWidth={1} size={16} />
				</button>
			</div>
		</div>
	);
};

interface SliderProps {
	className?: string;
	onChange?: (value: number) => void;
	value?: number;
}

class Slider extends PureComponent<SliderProps, { focus: boolean }> {
	line = React.createRef<HTMLDivElement>();

	state = {
		focus: false,
	};

	componentDidMount() {
		window.addEventListener("mouseup", this.onStop, { passive: false });
		window.addEventListener("mousemove", this.onDrag, { passive: false });
		window.addEventListener("touchmove", this.onDrag, { passive: false });
		window.addEventListener("touchend", this.onStop, { passive: false });

		const line = this.line.current;
		if (line) {
			line.addEventListener("mousedown", this.onStart);
			line.addEventListener("touchstart", this.onStart);
		}
	}

	componentWillUnmount() {
		window.removeEventListener("mouseup", this.onStop);
		window.removeEventListener("mousemove", this.onDrag);
		window.removeEventListener("touchmove", this.onDrag);
		window.removeEventListener("touchend", this.onStop);

		const line = this.line.current;
		if (line) {
			line.removeEventListener("mousedown", this.onStart);
			line.removeEventListener("touchstart", this.onStart);
		}
	}

	onDrag = (e: MouseEvent | TouchEvent) => {
		const { onChange } = this.props;
		if (this.state.focus) {
			const position = "touches" in e ? e.touches[0].clientX : e.clientX;
			const line = this.line.current;

			if (line) {
				const { left, width } = line.getBoundingClientRect();

				if (onChange) {
					onChange(Math.min(1, Math.max(0, position - left) / width));
				}
			}
			if (e.preventDefault) {
				e.preventDefault();
			}
		}
	};

	onStop = () => {
		this.setState({
			focus: false,
		});
	};

	onStart = (e: MouseEvent | TouchEvent) => {
		this.setState({
			focus: true,
		});
		this.onDrag(e);
	};

	render() {
		const { value = 0, className } = this.props;
		return (
			<div
				className={cn(
					"w-[200px] h-5 flex items-center flex-col justify-center rounded-md cursor-pointer",
					className,
				)}
				ref={this.line}
			>
				<div className="bg-sidebar-foreground/40 h-0.25 w-full rounded-md flex items-center relative">
					<div
						className="bg-primary self-stretch basis-auto flex-col flex-shrink-0"
						style={{
							flexGrow: value,
						}}
					/>
					<div
						className={cn(
							"w-6 h-6 -ml-2.5 rounded-full flex items-center justify-center absolute",
							"transition-colors duration-200",
							"bg-transparent",
							"hover:bg-muted-foreground/10",
							this.state.focus ? "bg-muted/20" : "",
						)}
						style={{
							left: `${value * 100}%`,
						}}
					>
						<div
							className={cn(
								"w-3 h-3 rounded-full bg-sidebar-primary",
								"scale-100 transition-transform duration-100",
								this.state.focus ? "scale-120" : "",
							)}
						/>
					</div>
				</div>
			</div>
		);
	}
}
