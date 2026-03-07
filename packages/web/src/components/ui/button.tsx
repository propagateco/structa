import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { TwoBodyLoaderIcon } from "@/components/ui/loader";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"group inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-none font-medium hover:cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 transition-colors duration-300 ease-in-out",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-foreground",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				remove:
					"border border-input bg-background text-text-secondary hover:bg-muted hover:text-text active:bg-muted",
				outline:
					"bg-background border border-input hover:bg-foreground hover:text-primary-foreground",
				secondary:
					"bg-secondary text-foreground hover:bg-foreground hover:text-primary-foreground",
				ghost:
					"hover:bg-ds-powder/40 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-ds-powder",
				ghostPrimary:
					"text-primary hover:bg-ds-powder/40 hover:text-accent dark:hover:bg-primary/20 dark:hover:text-ds-powder",
				link: "text-primary hover:text-primary transition-colors duration-200",
			},
			size: {
				default: "h-9 px-4 py-2 text-sm sm:text-base",
				xs: "h-6 px-2 text-xs [&_svg]:size-3 [&_svg]:shrink-0",
				sm: "h-7 px-3 text-sm gap-1",
				lg: "h-9 px-4 text-sm sm:h-10 sm:px-7 sm:text-base gap-2",
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
	isError?: boolean;
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
			isError = false,
			icon,
			children,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";

		// When using asChild, don't pass button-specific props like disabled
		const componentProps = asChild
			? {
					className: cn(
						buttonVariants({ variant, size, className }),
						isError && "bg-destructive text-destructive-foreground",
					),
				}
			: {
					className: cn(
						buttonVariants({ variant, size, className }),
						isError && "bg-destructive text-destructive-foreground",
					),
					ref,
					disabled: isLoading || props.disabled,
					...props,
				};

		return (
			<Comp {...componentProps}>
				{isLoading ? (
					<>
						<TwoBodyLoaderIcon className="size-4" />

						<div className="[&>svg]:hidden">{children}</div>
					</>
				) : variant === "link" ? (
					<>
						{icon}
						<span className="relative inline-block after:content-[''] after:absolute after:w-full after:h-0.25 after:left-0 after:bottom-0 after:bg-current after:origin-bottom-right after:scale-x-0 group-hover:after:origin-bottom-left group-hover:after:scale-x-100 after:transition-transform after:duration-300">
							{children}
						</span>
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
