import { Link, type LinkProps, useLocation } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as React from "react";
import {
	StructaIcon,
	type structaIconColorVariants,
	type structaIconSizeVariants,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const pageLinkVariants = cva(
	"inline-flex items-center gap-1.5 font-medium transition-colors duration-300 cursor-pointer group [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "hover:text-accent",
				primary: "text-primary hover:text-accent dark:hover:text-ds-powder",
				secondary: "text-text-secondary hover:text-accent",
				muted: "text-text-muted hover:text-accent",
			},
			size: {
				default: "text-sm sm:text-base [&_svg]:size-4",
				xs: "text-xs [&_svg]:size-3",
				sm: "text-sm [&_svg]:size-4",
				lg: "text-sm sm:text-base [&_svg]:size-4",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
		},
	},
);

export interface PageLinkProps
	extends LinkProps,
		VariantProps<typeof pageLinkVariants> {
	children: React.ReactNode;
	className?: string;
	ref?: React.ComponentPropsWithRef<"a">["ref"];
	arrowForward?: boolean;
	arrowBack?: boolean;
	/** Optional params for dynamic routes (e.g., { postId: 'my-first-blog-post' } for /blog/post/$postId) */
	params?: Record<string, string>;
}

export function PageLink({
        ref,
        variant,
        size,
        arrowForward,
        arrowBack,
        className,
        children,
        params,
        ...props
}: PageLinkProps) {
		const showForwardArrow = arrowForward;
		const showBackArrow = !arrowForward && arrowBack;

		return (
			<Link
				ref={ref}
				data-slot="page-link"
				className={cn(pageLinkVariants({ variant, size, className }))}
				params={params}
				{...props}
			>
				{showBackArrow && (
					<ArrowLeft className="transition-transform group-hover:-translate-x-1" />
				)}
				<span>{children}</span>
				{showForwardArrow && (
					<ArrowRight className="transition-transform group-hover:translate-x-1" />
				)}
			</Link>
	);
}

export interface ArrowLinkProps extends LinkProps {
	children: React.ReactNode;
	className?: string;
	ref?: React.ComponentPropsWithRef<"a">["ref"];
}

export function ArrowLink({ to, className, children, ref, ...props }: ArrowLinkProps) {
		return (
			<Link
				to={to}
				data-slot="arrow-link"
				className={cn(
					"flex items-center text-primary hover:text-accent dark:hover:text-accent cursor-pointer group",
					className,
				)}
				ref={ref}
				{...props}
			>
				<span className=" text-sm font-medium">{children}</span>
				<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
			</Link>
		);
}

export interface HomeIconLinkProps
	extends Omit<LinkProps, "to">,
		VariantProps<typeof structaIconColorVariants>,
		VariantProps<typeof structaIconSizeVariants> {
	className?: string;
	ref?: React.ComponentPropsWithRef<"a">["ref"];
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function HomeIconLink({
	className,
	variant,
	size,
	onClick,
	ref,
	...props
}: HomeIconLinkProps) {
	const location = useLocation();

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (location.pathname === "/") {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
		onClick?.(e);
	};

	return (
		<Link
			to="/"
			data-slot="home-icon-link"
			className={cn(
				"flex items-center hover:opacity-80 transition-opacity cursor-pointer",
				className,
			)}
			ref={ref}
			onClick={handleClick}
			{...props}
		>
			<StructaIcon size={size} variant={variant} />
		</Link>
	);
}

/**
 * A link that scrolls to the top of the current page if we're already on that route,
 * instead of doing a no-op navigation.
 */
export interface ScrollToTopLinkProps extends LinkProps {
	children: React.ReactNode;
	className?: string;
	ref?: React.ComponentPropsWithRef<"a">["ref"];
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function ScrollToTopLink({
	to,
	className,
	onClick,
	children,
	ref,
	...props
}: ScrollToTopLinkProps) {
	const location = useLocation();

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (location.pathname === to) {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
		onClick?.(e);
	};

	return (
		<Link
			to={to}
			data-slot="scroll-to-top-link"
			className={className}
			ref={ref}
			onClick={handleClick}
			{...props}
		>
			{children}
		</Link>
	);
}
