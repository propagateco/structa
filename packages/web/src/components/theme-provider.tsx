'use client';

import * as React from 'react';
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
    setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined);

const ThemeProvider = ({ children, defaultTheme = 'system', storageKey = 'structa-ui-theme' }: ThemeProviderProps) => {
    // Initialize with consistent defaults to prevent hydration mismatches
    const [theme, setThemeState] = React.useState<Theme>(defaultTheme);

    // Track actual system theme state for useTheme hook
    // Start with 'light' on both server and client for consistency
    const [actualTheme, setActualTheme] = React.useState<'light' | 'dark'>('light');

    // Load stored theme from localStorage after hydration completes
    React.useEffect(() => {
        const stored = localStorage.getItem(storageKey) as Theme;
        if (stored && stored !== defaultTheme) {
            setThemeState(stored);
        }
    }, [storageKey, defaultTheme]);

    // Load actual theme from localStorage or system preference after hydration completes
    React.useEffect(() => {
        const stored = localStorage.getItem(storageKey) as Theme;

        if (stored && stored !== 'system') {
            setActualTheme(stored);
        } else {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            setActualTheme(systemTheme);
        }
    }, [storageKey]);

    React.useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';

            root.classList.add(systemTheme);

            // Listen for system preference changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
                const newSystemTheme = e.matches ? 'dark' : 'light';
                root.classList.remove('light', 'dark');
                root.classList.add(newSystemTheme);
                setActualTheme(newSystemTheme);
            };

            mediaQuery.addEventListener('change', handleChange);

            // Cleanup listener on unmount or when theme changes
            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            };
        }

        root.classList.add(theme);
    }, [theme]);

    // Update favicon when actualTheme changes
    React.useEffect(() => {
        updateFavicon(actualTheme);
    }, [actualTheme]);

    const setTheme = React.useCallback(
        (newTheme: Theme) => {
            setThemeState(newTheme);
            localStorage.setItem(storageKey, newTheme);

            // Update actualTheme synchronously to prevent race conditions
            if (newTheme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
                setActualTheme(systemTheme);
            } else {
                setActualTheme(newTheme);
            }
        },
        [storageKey],
    );

    const value = {
        theme,
        actualTheme,
        setTheme,
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
};

const useTheme = () => {
    const context = React.useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');

    const { theme, actualTheme } = context;

    const resolvedTheme = React.useMemo(() => {
        // Check for SSR (server-side rendering)
        if (typeof window === 'undefined') return 'light';

        if (theme === 'system') {
            return actualTheme; // Use the tracked actualTheme from context
        }

        return theme;
    }, [theme, actualTheme]); // Now depends on actualTheme as well

    return { ...context, resolvedTheme };
};

export { ThemeProvider, useTheme };
