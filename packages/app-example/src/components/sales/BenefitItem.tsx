import type { LucideIcon } from "lucide-react";
import React from "react";

interface BenefitItemProps {
	icon: LucideIcon;
	title: string;
	description: string;
	colors: {
		borderDefault: string;
		primaryText: string;
		secondaryText: string;
	};
	showBorder?: boolean;
}

export function BenefitItem({
	icon: Icon,
	title,
	description,
	colors,
	showBorder = true,
}: BenefitItemProps) {
	return (
		<div
			className="flex items-start gap-4 py-4"
			style={{
				borderBottom: showBorder
					? `1px solid ${colors.borderDefault}`
					: undefined,
			}}
		>
			<div
				className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
				style={{
					backgroundColor: colors.borderDefault,
				}}
			>
				<Icon className="size-5 text-muted-foreground stroke-1" />
			</div>
			<div className="flex-1">
				<h4
					className="font-medium text-base mb-1"
					style={{ color: colors.primaryText }}
				>
					{title}
				</h4>
				<p className="text-sm" style={{ color: colors.secondaryText }}>
					{description}
				</p>
			</div>
		</div>
	);
}
