import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { Link } from '@tanstack/react-router';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(
            'inline-flex h-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 p-1 text-gray-500 dark:text-gray-400',
            className
        )}
        {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
        data-slot="tabs-trigger"
        className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            className
        )}
        {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
        data-slot="tabs-content"
        className={cn(
            'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2',
            className
        )}
        {...props}
    />
  )
}

const TabNav = NavigationMenuPrimitive.Root;

function TabNavList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
        data-slot="tab-nav-list"
        className={cn(
            'inline-flex items-center justify-center bg-transparent p-0 text-text-muted h-full',
            className
        )}
        {...props}
    />
  )
}

function TabNavLink({ className, children, active, ...props }: React.ComponentProps<typeof Link> & { active?: boolean }) {
  return (
    <Link
        data-slot="tab-nav-link"
        to={props.href}
        className={cn(
            'group inline-flex items-center justify-center whitespace-nowrap text-sm font-normal ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-foreground',
            'border-b-2 border-transparent font-medium',
            className
        )}
        {...props}
        activeProps={{
            className:
                'border-b-2 border-b-primary text-foreground font-medium',
        }}
        inactiveProps={{
            className: 'hover:text-foreground',
        }}
    >
        <div className="px-2 py-1 rounded-sm">
            {typeof children === 'function'
                ? children({ isActive: false, isTransitioning: false })
                : children}
        </div>
    </Link>
  )
}

export {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    TabNav,
    TabNavList,
    TabNavLink,
};
