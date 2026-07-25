'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import * as React from 'react';

import { useTheme } from '@/components/theme-provider';

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
    const mod = await import('@/components/ui/animated-background');
    return { default: mod.AnimatedBackground };
});

const THEME_OPTIONS = [
    {
        label: 'Light',
        id: 'light',
        icon: <Sun className="h-4 w-4" />,
    },
    {
        label: 'Dark',
        id: 'dark',
        icon: <Moon className="h-4 w-4" />,
    },
    {
        label: 'System',
        id: 'system',
        icon: <Monitor className="h-4 w-4" />,
    },
] as const;

function PlaceholderButtons() {
    return (
        <div className="bg-background/50 inline-flex gap-0.5 rounded-lg p-0.5">
            {THEME_OPTIONS.map(option => (
                <button
                    key={option.id}
                    className="text-muted-foreground inline-flex h-7 w-7 items-center justify-center transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-accent"
                    type="button"
                    aria-label={`Switch to ${option.label} theme`}
                    disabled
                >
                    {option.icon}
                </button>
            ))}
        </div>
    );
}

export function ThemeToggle() {
    const [mounted, setMounted] = React.useState(false);
    const { theme, setTheme } = useTheme();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Return a placeholder with the same structure to avoid hydration mismatch
        return <PlaceholderButtons />;
    }

    return (
        <div className="bg-background/50 inline-flex gap-0.5 rounded-lg p-0.5">
            <React.Suspense fallback={<PlaceholderButtons />}>
                <AnimatedBackground
                    className="bg-accent/10 pointer-events-none rounded-lg"
                    defaultValue={theme || 'light'}
                    transition={{
                        type: 'spring',
                        bounce: 0,
                        duration: 0.2,
                    }}
                    enableHover={false}
                    onValueChange={id => {
                        setTheme(id as 'light' | 'dark' | 'system');
                    }}
                >
                    {THEME_OPTIONS.map(option => (
                        <button
                            key={option.id}
                            className="cursor-pointer hover:text-accent text-muted-foreground inline-flex h-7 w-7 items-center justify-center transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-accent"
                            type="button"
                            aria-label={`Switch to ${option.label} theme`}
                            data-id={option.id}
                        >
                            {option.icon}
                        </button>
                    ))}
                </AnimatedBackground>
            </React.Suspense>
        </div>
    );
}
