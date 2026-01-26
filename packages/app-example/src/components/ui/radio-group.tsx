"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { Circle } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Root
			className={cn("grid gap-2", className)}
			{...props}
			ref={ref}
		/>
	);
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Item
			ref={ref}
			className={cn(
				"aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
				<Circle className="h-2.5 w-2.5 fill-current text-current" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const RadioGroupCard = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Item
			ref={ref}
			className={cn(
				"group rounded-lg border bg-card text-text-muted shadow-sm focus:ring-2 focus:ring-ring focus:outline-none data-[state=checked]:ring-2 data-[state=checked]:ring-ring hover:bg-muted transition-all duration-200 ease",
				className,
			)}
			{...props}
			asChild={false}
		>
			{children}
		</RadioGroupPrimitive.Item>
	);
});

RadioGroupCard.displayName = "RadioGroupCards.Item";

const iconVariants = cva(
	"h-12 w-12 ml-6 text-muted-foreground group-data-[state=checked]:text-primary",
	{
		variants: {
			variant: {
				default: "text-muted-foreground",
			},
			size: {
				default: "h-12 w-12",
				sm: "h-10 w-10",
				lg: "h-20 w-20",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface RadioGroupCardIconProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof iconVariants> {
	icon: React.ElementType;
}

const RadioGroupCardIcon = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	RadioGroupCardIconProps
>(({ icon: Icon, variant, size, className, ...props }, ref) => {
	return (
		<Icon
			className={cn(iconVariants({ variant, size, className }), className)}
			{...props}
			ref={ref}
		/>
	);
});

RadioGroupCardIcon.displayName = "RadioGroupCardIcon";

const RadioGroupCardTitle = ({
	className,
	children,
	...props
}: {
	className?: string;
	children?: React.ReactNode;
}) => {
	return (
		<h3
			className={cn(
				"text-text-muted font-medium mb-1 group-data-[state=checked]:text-primary",
				className,
			)}
			{...props}
		>
			{children}
		</h3>
	);
};

RadioGroupCardTitle.displayName = "RadioGroupCardTitle";

const RadioGroupCardText = ({
	className,
	children,
	...props
}: {
	className?: string;
	children?: React.ReactNode;
}) => {
	return (
		<p
			className={cn(
				"text-sm text-muted-foreground group-data-[state=checked]:text-primary text-left",
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
};

RadioGroupCardText.displayName = "RadioGroupCardText";

export {
	RadioGroup,
	RadioGroupItem,
	RadioGroupCard,
	RadioGroupCardIcon,
	iconVariants,
	RadioGroupCardTitle,
	RadioGroupCardText,
};
