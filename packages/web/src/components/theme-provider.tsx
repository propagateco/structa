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

    React.useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
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

    const { theme } = context;

    const resolvedTheme = React.useMemo(() => {
        // Check for SSR (server-side rendering)
        if (typeof window === 'undefined') return 'light';

        if (theme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        return theme;
    }, [theme]);

    return { ...context, resolvedTheme };
};

export { ThemeProvider, useTheme };
