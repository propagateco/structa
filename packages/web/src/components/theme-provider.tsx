'use client';

import * as React from 'react';

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
    const [theme, setThemeState] = React.useState<Theme>(() => {
        if (typeof window === 'undefined') return defaultTheme;

        const stored = localStorage.getItem(storageKey) as Theme;
        if (stored) return stored;

        return defaultTheme;
    });

    // Track actual system theme state for useTheme hook
    const [actualTheme, setActualTheme] = React.useState<'light' | 'dark'>(() => {
        if (typeof window === 'undefined') return 'light';

        const stored = localStorage.getItem(storageKey) as Theme;
        if (stored && stored !== 'system') return stored;

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

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
                setActualTheme(newSystemTheme); // Update state for useTheme hook
            };

            mediaQuery.addEventListener('change', handleChange);

            // Cleanup listener on unmount or when theme changes
            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            };
        }

        root.classList.add(theme);
        setActualTheme(theme); // Update state for useTheme hook
    }, [theme]);

    const setTheme = React.useCallback(
        (theme: Theme) => {
            setThemeState(theme);
            localStorage.setItem(storageKey, theme);
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
