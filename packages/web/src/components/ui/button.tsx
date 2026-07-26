import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { TwoBodyLoaderIcon } from "@/components/ui/loader";

import { cn } from "@/lib/utils";

/**
 * Tailwind v4 / shadcn "new-york" conventions:
 *  - function component (no forwardRef)
 *  - `data-slot` for styling anchors
 *  - default cursor (no `cursor-pointer`) per shadcn v4 changelog
 *  - modern `focus-visible` ring + `aria-invalid` styling
 *  - `[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4`
 *
 * Project-specific extensions preserved on top of the canonical base:
 *  - `variant`: `remove` (subtle destructive-adjacent), `ghostPrimary`
 *  - `size`: `xs`, `sm`, `lg`, `icon`
 *  - props: `asChild`, `isLoading`, `isError`, `icon`
 *  - `isLoading` swaps children for the `TwoBodyLoaderIcon` spinner and
 *    disables the button (unless `asChild`).
 */
const buttonVariants = cva(
	"group inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
				remove:
					"border border-input bg-background text-text-secondary hover:bg-muted hover:text-text active:bg-muted",
				outline:
					"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				ghostPrimary:
					"text-foreground hover:bg-secondary hover:text-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
size: {
			default: "h-9 px-4 py-2 has-[>svg]:px-3",
			xs: "h-6 px-2 text-xs rounded-xs [&_svg]:size-3",
			sm: "h-7 px-3 text-sm gap-1",
			lg: "h-9 px-4 text-sm sm:h-10 sm:px-7 sm:text-base gap-2",
			icon: "h-6 w-6 rounded-md",
		},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ComponentProps<"button">,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
	isError?: boolean;
	icon?: React.ReactNode;
}

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	isLoading = false,
	isError = false,
	icon,
	children,
	disabled,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button";

	// When using asChild, don't pass button-specific props like disabled.
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
				disabled: isLoading || disabled,
				...props,
			};

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			{...(componentProps as React.ComponentProps<"button">)}
		>
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
}

export { Button, buttonVariants };