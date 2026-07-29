"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

// Lazy-load so that `motion` / `framer-motion` (pulled in by
// @/components/ui/animated-background) ends up in its own client-only
// dynamic chunk instead of being statically linked into the SSR/Nitro
// bundle. The SSR/nitro graph holds the entire import closure in memory
// while Vite serializes the Lambda bundle, and ~80 motion/framer-motion
// modules were contributing to the heap pressure that OOM'd the SST
// Console autodeploy (see 22 Jul 2026 failure logs). The component is
// already gated behind the `mounted` flag (useEffect doesn't fire during
// SSR), so this lazy import never triggers server-side — motion is
// therefore eliminated from the SSR bundle entirely.
const AnimatedBackground = React.lazy(async () => {
    const mod = await import("@/components/ui/animated-background");
    return { default: mod.AnimatedBackground };
});

const THEME_OPTIONS = [
    { label: "Light", id: "light", icon: Sun },
    { label: "Dark", id: "dark", icon: Moon },
    { label: "System", id: "system", icon: Monitor },
] as const;

/* ── cva variants ──────────────────────────────────── */

const toggleVariants = cva("inline-flex gap-0.5 p-0.5 rounded-lg", {
    variants: {
        variant: {
            default: "bg-surface-active",
            accent: "bg-background/50",
        },
        size: {
            default: "rounded-lg",
            sm: "rounded-lg",
            xs: "rounded-lg",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

const toggleButtonVariants = cva(
    "inline-flex items-center justify-center rounded-md transition-colors duration-100 focus-visible:outline-2 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "text-muted-foreground hover:text-foreground data-[checked=true]:bg-background data-[checked=true]:text-foreground",
                accent: "text-muted-foreground hover:text-accent data-[checked=true]:text-accent",
            },
            size: {
                default: "h-7 w-7 [&_svg]:size-4",
                sm: "h-6 w-6 [&_svg]:size-3.5",
                xs: "h-5 w-5 [&_svg]:size-3",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

const toggleBgVariants = cva("pointer-events-none", {
    variants: {
        variant: {
            default: "bg-background",
            accent: "bg-accent/10",
        },
        size: {
            default: "rounded-lg",
            sm: "rounded-lg",
            xs: "rounded-lg",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

/* ── types ─────────────────────────────────────────── */

export interface ThemeToggleProps extends VariantProps<typeof toggleVariants> {
    className?: string;
}

/* ── sub-components ────────────────────────────────── */

function PlaceholderButtons({
    variant = "default",
    size = "default",
}: {
    variant?: "default" | "accent" | null;
    size?: "default" | "sm" | "xs" | null;
}) {
    return (
        <div className={cn(toggleVariants({ variant, size }))}>
            {THEME_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                    <button
                        key={option.id}
                        className={cn(
                            toggleButtonVariants({ variant, size }),
                            "opacity-50",
                        )}
                        type="button"
                        aria-label={`Switch to ${option.label} theme`}
                        disabled
                    >
                        <Icon />
                    </button>
                );
            })}
        </div>
    );
}

/* ── main component ────────────────────────────────── */

export function ThemeToggle({
    variant = "default",
    size = "default",
    className,
}: ThemeToggleProps) {
    const [mounted, setMounted] = React.useState(false);
    const { theme, setTheme } = useTheme();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <PlaceholderButtons variant={variant} size={size} />;
    }

    return (
        <div className={cn(toggleVariants({ variant, size }), className)}>
            <React.Suspense
                fallback={<PlaceholderButtons variant={variant} size={size} />}
            >
                <AnimatedBackground
                    className={cn(toggleBgVariants({ variant, size }))}
                    defaultValue={theme || "light"}
                    transition={{
                        type: "tween",
                        duration: 0.12,
                        ease: "easeOut",
                    }}
                    enableHover={false}
                    onValueChange={(id) => {
                        setTheme(id as "light" | "dark" | "system");
                    }}
                >
                    {THEME_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        return (
                            <button
                                key={option.id}
                                className={cn(
                                    toggleButtonVariants({ variant, size }),
                                )}
                                type="button"
                                aria-label={`Switch to ${option.label} theme`}
                                data-id={option.id}
                            >
                                <Icon className="fill-current" />
                            </button>
                        );
                    })}
                </AnimatedBackground>
            </React.Suspense>
        </div>
    );
}
