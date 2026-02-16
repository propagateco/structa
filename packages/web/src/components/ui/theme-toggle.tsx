'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import * as React from 'react';

import { useTheme } from '@/components/theme-provider';
import { AnimatedBackground } from '@/components/ui/animated-background';

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

export function ThemeToggle() {
    const [mounted, setMounted] = React.useState(false);
    const { theme, setTheme } = useTheme();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Return a placeholder with the same structure to avoid hydration mismatch
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

    return (
        <div className="bg-background/50 inline-flex gap-0.5 rounded-lg p-0.5">
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
        </div>
    );
}
