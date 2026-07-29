'use client';

import * as React from 'react';
import { ScriptOnce } from '@tanstack/react-router';
import { updateFavicon } from '@/utils/favicon';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    actualTheme: 'light' | 'dark';
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(
    undefined,
);

/**
 * Inline script that runs once, before React hydrates, to set the
 * `light`/`dark` class on <html> from localStorage (or system preference).
 * This is the canonical shadcn/ui TanStack Start dark-mode pattern and
 * prevents a flash of unstyled content (FOUC) on first paint.
 *
 * Using `ScriptOnce` (not `<script>`) ensures the script is hoisted above
 * React hydration and never re-executes on client navigations.
 */
function getThemeScript(storageKey: string, defaultTheme: Theme) {
    const key = JSON.stringify(storageKey);
    const fallback = JSON.stringify(defaultTheme);
    return `(function(){try{var t=localStorage.getItem(${key});if(t!=='light'&&t!=='dark'&&t!=='system'){t=${fallback}}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.add(r);e.style.colorScheme=r;}catch(e){}})();`;
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
    if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }
    return theme;
}

function applyTheme(theme: Theme) {
    const root = window.document.documentElement;
    const resolved = resolveTheme(theme);
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
    return resolved;
}

const ThemeProvider = ({
    children,
    defaultTheme = 'system',
    storageKey = 'structa-ui-theme',
}: ThemeProviderProps) => {
    // Initialise to default on both server and client to avoid hydration
    // mismatch. The real stored value is read after mount.
    const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
    const [actualTheme, setActualTheme] = React.useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = React.useState(false);

    // Load stored theme after hydration.
    React.useEffect(() => {
        const stored = localStorage.getItem(storageKey) as Theme | null;
        const initial =
            stored === 'light' || stored === 'dark' || stored === 'system'
                ? stored
                : defaultTheme;
        setThemeState(initial);
        const resolved = resolveTheme(initial);
        setActualTheme(resolved);
        setMounted(true);
    }, [defaultTheme, storageKey]);

    // Apply theme class whenever it changes (after mount).
    React.useEffect(() => {
        if (!mounted) return;
        const resolved = applyTheme(theme);
        setActualTheme(resolved);
    }, [theme, mounted]);

    // React to OS-level changes when in `system` mode.
    React.useEffect(() => {
        if (!mounted || theme !== 'system') return;
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = () => {
            const resolved = applyTheme('system');
            setActualTheme(resolved);
        };
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, [theme, mounted]);

    // Favicon follows the resolved theme.
    React.useEffect(() => {
        updateFavicon(actualTheme);
    }, [actualTheme]);

    const setTheme = React.useCallback(
        (next: Theme) => {
            localStorage.setItem(storageKey, next);
            setThemeState(next);
            const resolved = resolveTheme(next);
            setActualTheme(resolved);
        },
        [storageKey],
    );

    const resolvedTheme = React.useMemo<'light' | 'dark'>(() => {
        if (typeof window === 'undefined') return 'light';
        return actualTheme;
    }, [actualTheme]);

    const value: ThemeProviderState = {
        theme,
        actualTheme,
        resolvedTheme,
        setTheme,
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            <ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
            {children}
        </ThemeProviderContext.Provider>
    );
};

const useTheme = () => {
    const context = React.useContext(ThemeProviderContext);
    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

export { ThemeProvider, useTheme };