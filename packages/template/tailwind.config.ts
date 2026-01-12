import type { Config } from 'tailwindcss';

export default {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            gridTemplateColumns: {
                '16': 'repeat(16, minmax(0, 1fr))',
            },
            fontFamily: {
                sans: [
                    'Inter Tight Variable',
                    'system-ui',
                    'Helvetica Neue',
                    'sans-serif',
                    'Apple Color Emoji',
                    'Segoe UI Emoji',
                    'Segoe UI Symbol',
                    'Noto Color Emoji',
                ],
                header: [
                    'Lora Variable',
                    'Inter Tight Variable',
                    'system-ui',
                    'Helvetica Neue',
                    'sans-serif',
                    'Apple Color Emoji',
                    'Segoe UI Emoji',
                    'Segoe UI Symbol',
                    'Noto Color Emoji',
                ],
                serif: ['Lora Variable', 'serif'],
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
            tracking: {
                widest: '0.2em',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                xs: 'calc(var(--radius) - 8px)',
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                paper: 'hsl(var(--paper))',
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
                text: {
                    DEFAULT: 'hsl(var(--textMain))',
                    secondary: 'hsl(var(--textSecondary))',
                    muted: 'hsl(var(--textMuted))',
                    link: 'hsl(var(--textLink))',
                    dark: 'hsl(var(--textDark))',
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
            aspectRatio: {
                'large-logo': 'var(--aspect-large-logo)',
            },
            boxShadow: {
                menu: 'var(--shadow-menu)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                'float-1': {
                    '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
                    '50%': { transform: 'translate(10px, -10px) rotate(5deg)' },
                },
                'float-2': {
                    '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
                    '50%': {
                        transform: 'translate(-15px, 10px) rotate(-5deg)',
                    },
                },
                'float-3': {
                    '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
                    '50%': { transform: 'translate(15px, 15px) rotate(5deg)' },
                },
                'float-4': {
                    '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
                    '50%': {
                        transform: 'translate(-10px, -15px) rotate(-5deg)',
                    },
                },
                'float-5': {
                    '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
                    '50%': { transform: 'translate(10px, 10px) rotate(5deg)' },
                },
                scroll: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
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
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                marquee: 'marquee 25s linear infinite',
                'float-1': 'float-1 8s ease-in-out infinite',
                'float-2': 'float-2 9s ease-in-out infinite',
                'float-3': 'float-3 10s ease-in-out infinite',
                'float-4': 'float-4 11s ease-in-out infinite',
                'float-5': 'float-5 12s ease-in-out infinite',
                scroll: 'scroll 30s linear infinite',
                'caret-blink': 'caret-blink 1.25s ease-out infinite',
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
        require('tailwind-scrollbar')({ nocompatible: true }),
    ],
} satisfies Config;

