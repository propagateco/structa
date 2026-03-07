import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const kbdVariants = cva(
    "text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium [&_svg:not([class*='size-'])]:size-3 [[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",
    {
        variants: {
            variant: {
                default: "bg-transparent border border-border",
                ghost: "border-none bg-transparent",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

function Kbd({
    className,
    variant,
    ...props
}: React.ComponentProps<"kbd"> & VariantProps<typeof kbdVariants>) {
    return (
        <kbd
            data-slot="kbd"
            className={cn(kbdVariants({ variant }), className)}
            {...props}
        />
    );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <kbd
            data-slot="kbd-group"
            className={cn(
                "text-muted-foreground text-[11px] font-medium inline-flex items-center gap-1",
                className,
            )}
            {...props}
        />
    );
}

function KbdWrapper({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="kbd-wrapper"
            className={cn(
                "text-muted-foreground text-[11px] font-medium inline-flex items-center gap-1",
                className,
            )}
            {...props}
        />
    );
}

export { Kbd, KbdGroup, KbdWrapper };
