import * as React from "react";
import { cn } from "@/lib/utils";

const Header = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"flex flex-col gap-y-5 md:gap-y-0 md:flex-row items-start justify-between md:items-center my-5 md:my-10 gap-x-10",
			className,
		)}
		{...props}
	/>
));
Header.displayName = "HeaderSection";

const HeaderMain = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex flex-col gap-y-2", className)}
		{...props}
	/>
));
HeaderMain.displayName = "HeaderSectionMain";

const HeaderTitle = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h1 ref={ref} className={cn("text-3xl font-medium", className)} {...props} />
));
HeaderTitle.displayName = "HeaderTitle";

const HeaderSubSection = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h2
		ref={ref}
		className={cn("text-base text-muted-foreground", className)}
		{...props}
	/>
));
HeaderSubSection.displayName = "HeaderSubSection";

const HeaderButtons = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"flex justify-end gap-2 transition-all duration-150",
			className,
		)}
		{...props}
	/>
));
HeaderButtons.displayName = "HeaderButtons";

export { Header, HeaderMain, HeaderTitle, HeaderSubSection, HeaderButtons };
