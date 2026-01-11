import React, { FC, useState, PureComponent } from 'react';
import { cn } from '@/lib/utils';
import { isNumber } from 'advanced-cropper';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface Props {
	className?: string;
	onChange?: (value: number) => void;
	value?: number;
}

export class Slider extends PureComponent<Props> {
	line = React.createRef<HTMLDivElement>();

	state = {
		focus: false,
	};

	componentDidMount() {
		window.addEventListener('mouseup', this.onStop, { passive: false });
		window.addEventListener('mousemove', this.onDrag, { passive: false });
		window.addEventListener('touchmove', this.onDrag, { passive: false });
		window.addEventListener('touchend', this.onStop, { passive: false });

		const line = this.line.current;
		if (line) {
			line.addEventListener('mousedown', this.onStart);
			line.addEventListener('touchstart', this.onStart);
		}
	}
	componentWillUnmount() {
		window.removeEventListener('mouseup', this.onStop);
		window.removeEventListener('mousemove', this.onDrag);
		window.removeEventListener('touchmove', this.onDrag);
		window.removeEventListener('touchend', this.onStop);

		const line = this.line.current;
		if (line) {
			line.removeEventListener('mousedown', this.onStart);
			line.removeEventListener('touchstart', this.onStart);
		}
	}
	onDrag = (e: MouseEvent | TouchEvent) => {
		const { onChange } = this.props;
		if (this.state.focus) {
			const position = 'touches' in e ? e.touches[0].clientX : e.clientX;
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
					'w-[200px] h-5 flex items-center flex-col justify-center rounded-md cursor-pointer',
					className
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
							'absolute-zoom-cropper-slider__circle',
							this.state.focus && 'absolute-zoom-cropper-slider__circle--focus'
						)}
						style={{
							left: `${value * 100}%`,
						}}
					>
						<div
							className={cn(
								'absolute-zoom-cropper-slider__inner-circle',
								this.state.focus &&
									'absolute-zoom-cropper-slider__inner-circle--focus'
							)}
						/>
					</div>
					<div
						className={cn(
							'w-6 h-6 -ml-2.5 rounded-full flex items-center justify-center absolute',
							'transition-colors duration-200',
							'bg-transparent',
							'hover:bg-muted-foreground/10',
							this.state.focus ? 'bg-muted/20' : ''
						)}
						style={{
							left: `${value * 100}%`,
						}}
					>
						<div
							className={cn(
								'w-3 h-3 rounded-full bg-sidebar-primary',
								'scale-100 transition-transform duration-100',
								'shadow-[0_0_7px_rgba(var(--accent-rgb),0.2),0_1px_3px_1px_rgba(var(--accent-rgb),0.15)]',
								this.state.focus ? 'scale-120' : ''
							)}
						/>
					</div>
				</div>
			</div>
		);
	}
}
