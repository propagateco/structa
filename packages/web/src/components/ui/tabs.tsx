import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Link } from "@tanstack/react-router";
import * as React from "react";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.List
		ref={ref}
		className={cn(
			"inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
			className,
		)}
		{...props}
	/>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(
			"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
			className,
		)}
		{...props}
	/>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			className,
		)}
		{...props}
	/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

const TabNav = NavigationMenuPrimitive.Root;

const TabNavList = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.List
		ref={ref}
		className={cn(
			"inline-flex items-center justify-center bg-transparent p-0 text-text-muted h-full",
			className,
		)}
		{...props}
	/>
));
TabNavList.displayName = NavigationMenuPrimitive.List.displayName;

const TabNavLink = React.forwardRef<
	React.ElementRef<typeof Link>,
	React.ComponentPropsWithoutRef<typeof Link> & {
		active?: boolean;
	}
>(({ className, children, active, ...props }, ref) => (
	<Link
		ref={ref}
		to={props.href}
		className={cn(
			"group inline-flex items-center justify-center whitespace-nowrap text-sm font-normal ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-foreground",
			"border-b-2 border-transparent font-medium",
			className,
		)}
		{...props}
		activeProps={{
			className: "border-b-2 border-b-primary text-foreground font-medium",
		}}
		inactiveProps={{
			className: "hover:text-foreground",
		}}
	>
		<div className="group-hover:bg-muted px-2 py-1 rounded-sm">
			{typeof children === "function"
				? children({ isActive: false, isTransitioning: false })
				: children}
		</div>
	</Link>
));
TabNavLink.displayName = "TabNavLink";

export {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
	TabNav,
	TabNavList,
	TabNavLink,
};
