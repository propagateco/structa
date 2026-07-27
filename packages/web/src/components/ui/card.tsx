import * as React from 'react';

import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.ComponentProps<"div">) {
    return (
    <div
        data-slot="card"
        className={cn(
            'rounded-lg border border-border bg-card text-card-foreground shadow',
            className
        )}
        {...props}
    />
    );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
    <div
        data-slot="card-header"
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
    />
    );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
    return (
    <h3
        data-slot="card-title"
        className={cn('font-semibold leading-none tracking-tight', className)}
        {...props}
    />
    );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
    return (
    <p
        data-slot="card-description"
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
    />
    );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
    return <div data-slot="card-content" className={cn('p-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
    <div
        data-slot="card-footer"
        className={cn(
            'bg-background flex items-center px-6 py-4 rounded-b-lg border-t border-border',
            className
        )}
        {...props}
    />
    );
}

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
};
