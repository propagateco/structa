import * as React from 'react';
import { cn } from '@/lib/utils';

interface PropagateIconProps extends React.HTMLAttributes<HTMLDivElement> {
	mode: 'light' | 'dark';
	size: 'xs' | 'sm';
}

const PropagateIcon = React.forwardRef<HTMLDivElement, PropagateIconProps>((props, ref) => {
	const { size, mode, className } = props;

	const xsIcon = (
		<svg
			width="45"
			height="25"
			viewBox="0 0 45 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="h-3.5 w-auto"
		>
			<path
				d="M2 16.4188C6.39044 26.662 11.355 26.3912 15.6442 16.4188C23.8171 -4.1396 34.388 -4.1396 43 16.4188H2Z"
				stroke="currentColor"
				strokeWidth="2.2"
			/>
		</svg>
	);

	// Update this to the true small icon
	const smIcon = (
		<svg
			width="366"
			height="206"
			viewBox="0 0 366 206"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="h-6 w-auto"
		>
			<path
				d="M10 136.054C47.0511 222.453 88.9473 220.169 125.143 136.054C194.115 -37.3514 283.323 -37.3514 356 136.054H10Z"
				stroke="currentColor"
				strokeWidth="12"
			/>
		</svg>
	);

	return (
		<div
			ref={ref}
			className={cn(
				mode === 'light' ? 'text-text-muted/50' : 'text-background',
				'flex items-center justify-center rounded-md hover:text-accent transition-all duration-500 ease-in-out',
				className
			)}
			{...props}
		>
			{size === 'xs' && xsIcon}
			{size === 'sm' && smIcon}
		</div>
	);
});

PropagateIcon.displayName = 'PropagateIcon';

export { PropagateIcon };
