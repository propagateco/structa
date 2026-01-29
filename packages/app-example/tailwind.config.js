import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
    theme: {
        extend: {
            screens: {
                xs: '480px',
            },
            fontFamily: {
                sans: [
                    'Inter Tight',
                    'system-ui',
                    'Helvetica Neue',
                    'sans-serif',
                    'Apple Color Emoji',
                    'Segoe UI Emoji',
                    'Segoe UI Symbol',
                    'Noto Color Emoji',
                ],
                header: [
                    'Space Grotesk',
                    'Inter Tight',
                    'system-ui',
                    'Helvetica Neue',
                    'sans-serif',
                    'Apple Color Emoji',
                    'Segoe UI Emoji',
                    'Segoe UI Symbol',
                    'Noto Color Emoji',
                ],
            },
            fontSize: {
                xxs: [
                    '0.5625rem',
                    {
                        lineHeight: '0.625rem',
                    },
                ],
                xs: [
                    '0.75rem',
                    {
                        lineHeight: '0.875rem',
                    },
                ],
                sm: [
                    '0.8125rem',
                    {
                        lineHeight: '1.125rem',
                    },
                ],
                md: [
                    '0.875rem',
                    {
                        lineHeight: '1.25rem',
                    },
                ],
                base: [
                    '1rem',
                    {
                        lineHeight: '1.35rem',
                    },
                ],
                lg: [
                    '1.125rem',
                    {
                        lineHeight: '1.5625rem',
                    },
                ],
                xl: [
                    '1.25rem',
                    {
                        lineHeight: '1.625rem',
                    },
                ],
                '2xl': [
                    '1.5625rem',
                    {
                        lineHeight: '1.875rem',
                    },
                ],
                '3xl': [
                    '1.875rem',
                    {
                        lineHeight: '2rem',
                    },
                ],
            },
            // fontWeight: {
            // 	light: '350',
            // 	normal: '450',
            // 	bold: '650',
            // },
            tracking: {
                widest: '0.2em',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                xs: 'calc(var(--radius) - 8px)',
            },
            aspectRatio: {
                'large-logo': 'var(--aspect-large-logo)',
            },
            boxShadow: {
                menu: 'var(--shadow-menu)',
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                paper: 'hsl(var(--paper))',
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                text: {
                    DEFAULT: 'hsl(var(--textMain))',
                    secondary: 'hsl(var(--textSecondary))',
                    muted: 'hsl(var(--textMuted))',
                    link: 'hsl(var(--textLink))',
                    dark: 'hsl(var(--textDark))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                    background: 'hsl(var(--muted-background))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                success: {
                    DEFAULT: 'hsl(var(--success))',
                    foreground: 'hsl(var(--success-foreground))',
                    toast: 'hsl(var(--success-toast))',
                    toastForeground: 'hsl(var(--success-toast-foreground))',
                },
                error: {
                    DEFAULT: 'hsl(var(--error))',
                    foreground: 'hsl(var(--error-foreground))',
                    toast: 'hsl(var(--error-toast))',
                    toastForeground: 'hsl(var(--error-toast-foreground))',
                },
                warning: {
                    DEFAULT: 'hsl(var(--warning))',
                    foreground: 'hsl(var(--warning-foreground))',
                    toast: 'hsl(var(--warning-toast))',
                    toastForeground: 'hsl(var(--warning-toast-foreground))',
                },
                info: {
                    DEFAULT: 'hsl(var(--info))',
                    foreground: 'hsl(var(--info-foreground))',
                    toast: 'hsl(var(--info-toast))',
                    toastForeground: 'hsl(var(--info-toast-foreground))',
                },
                chart: {
                    1: 'hsl(var(--chart-1))',
                    2: 'hsl(var(--chart-2))',
                    3: 'hsl(var(--chart-3))',
                    4: 'hsl(var(--chart-4))',
                    5: 'hsl(var(--chart-5))',
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground':
                        'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground':
                        'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))',
                },
                ds: {
                    background: {
                        100: 'hsl(var(--ds-background-100))',
                        200: 'hsl(var(--ds-background-200))',
                    },
                    white: {
                        DEFAULT: 'hsl(var(--ds-white))',
                    },
                    paper: {
                        DEFAULT: 'hsl(var(--ds-paper))',
                    },
                    midnight: {
                        DEFAULT: 'hsl(var(--ds-midnight))',
                    },
                    ink: {
                        DEFAULT: 'hsl(var(--ds-ink))',
                    },
                    steel: {
                        DEFAULT: 'hsl(var(--ds-steel))',
                    },
                    teal: {
                        DEFAULT: 'hsl(var(--ds-teal))',
                    },
                    azure: {
                        DEFAULT: 'hsl(var(--ds-azure))',
                    },
                    powder: {
                        DEFAULT: 'hsl(var(--ds-powder))',
                    },
                    paper: {
                        DEFAULT: 'hsl(var(--ds-paper))',
                    },
                    eggshell: {
                        DEFAULT: 'hsl(var(--ds-eggshell))',
                    },
                    apricot: {
                        DEFAULT: 'hsl(var(--ds-apricot))',
                    },
                    terra: {
                        DEFAULT: 'hsl(var(--ds-terra))',
                    },
                    plum: {
                        DEFAULT: 'hsl(var(--ds-plum))',
                    },
                    lichen: {
                        DEFAULT: 'hsl(var(--ds-lichen))',
                    },
                    mono: {
                        50: 'hsl(var(--ds-mono-50))',
                        100: 'hsl(var(--ds-mono-100))',
                        200: 'hsl(var(--ds-mono-200))',
                        300: 'hsl(var(--ds-mono-300))',
                        400: 'hsl(var(--ds-mono-400))',
                        500: 'hsl(var(--ds-mono-500))',
                        600: 'hsl(var(--ds-mono-600))',
                        700: 'hsl(var(--ds-mono-700))',
                        800: 'hsl(var(--ds-mono-800))',
                        900: 'hsl(var(--ds-mono-900))',
                        950: 'hsl(var(--ds-mono-950))',
                    },
                },
            },
            keyframes: {
                'caret-blink': {
                    '0%,70%,100%': {
                        opacity: '1',
                    },
                    '20%,50%': {
                        opacity: '0',
                    },
                },
            },
            animation: {
                'caret-blink': 'caret-blink 1.5s ease-in-out infinite',
            },
        },
    },
    plugins: [animate],
};
