import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:pointer-events-none [&_svg]:text-current transition-all duration-300 ease-in-out",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				opposite: "bg-background text-foreground hover:bg-ds-mono-200",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				remove:
					"border border-input bg-background text-text-secondary hover:bg-muted hover:text-text active:bg-muted",
				outline:
					"border border-input bg-background text-text-secondary hover:bg-muted hover:text-text active:bg-muted",
				secondary:
					"bg-secondary/70 text-secondary-foreground hover:bg-secondary",
				ghost: "hover:bg-muted text-text-secondary hover:text-text",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-4 py-2",
				xs: "h-6 rounded-sm px-2 gap-1 text-xs [&_svg]:size-3 [&_svg]:shrink-0",
				sm: "h-7 rounded-md px-3 text-sm",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
	icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			isLoading = false,
			icon,
			children,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";

		// When using asChild, don't pass button-specific props like disabled
		const componentProps = asChild
			? { className: cn(buttonVariants({ variant, size, className })) }
			: {
					className: cn(buttonVariants({ variant, size, className })),
					ref,
					disabled: isLoading || props.disabled,
					...props,
				};

		return (
			<Comp {...componentProps}>
				{isLoading ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						<div className="[&>svg]:hidden">{children}</div>
					</>
				) : (
					<>
						{icon}
						{children}
					</>
				)}
			</Comp>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
