import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
    "relative w-full rounded-lg border border-muted px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
    {
        variants: {
            variant: {
                default: "bg-background text-foreground",
                multi: "bg-background text-text-muted",
                destructive:
                    "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

const alertActionVariants = cva("", {
    variants: {
        position: {
            default: "absolute top-2 right-2",
            block: "relative block mt-2",
        },
    },
    defaultVariants: {
        position: "default",
    },
});

function Alert({
    className,
    variant,
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
    return (
    <div
        data-slot="alert"
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
    />
    );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h5">) {
    return (
    <h5
        data-slot="alert-title"
        className={cn(
            "mb-1 font-medium leading-none tracking-tight",
            className,
        )}
        {...props}
    />
    );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
    return (
    <div
        data-slot="alert-description"
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        {...props}
    />
    );
}

function AlertAction({
    className,
    position,
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertActionVariants>) {
    return (
    <div
        data-slot="alert-action"
        className={cn(alertActionVariants({ position }), className)}
        {...props}
    />
    );
}

export { Alert, AlertTitle, AlertDescription, AlertAction };
