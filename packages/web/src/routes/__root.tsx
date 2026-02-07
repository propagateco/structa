/// <reference types="vite/client" />
// Import Buffer polyfill first to ensure gray-matter works in browser during HMR
import '@/lib/buffer-polyfill';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    createRootRoute,
    HeadContent,
    Outlet,
    ScriptOnce,
    Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { PostHogProvider } from 'posthog-js/react';
import * as React from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import appCss from '@/styles/app.css?url';
import { updateFavicon } from '@/utils/favicon';
import { seo } from '@/utils/seo';

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            ...seo({
                title: 'Structa | Digital Workspace for Modern Renovators. Powered by Agentic AI.',
                description: `Structa's AI-powered workspace brings context, clarity, and confidence to every renovation project.`,
            }),
        ],
        links: [
            // Preconnect for better performance
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
                crossOrigin: '',
            },

            // Lora (Serif) - from Google Fonts
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap',
            },

            // Inter Tight (Variable Sans-serif) - from Google Fonts
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap',
            },

            // Space Grotesk (Sans-serif) - from Google Fonts
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap',
            },

            // Newsreader (Serif) - from Google Fonts
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700&display=swap',
            },

            // EB Garamond (Serif) - from Google Fonts
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap',
            },

            // Cormorant Garamond (Serif) - from Google Fonts
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap',
            },

            // Figtree (Sans-serif) - from Google Fonts
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&display=swap',
            },
            { rel: 'icon', href: '/logo-light.svg' },
            { rel: 'stylesheet', href: appCss },
        ],
    }),
    component: RootComponent,
});

const posthogOptions = {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    defaults: '2025-11-30',
} as const;

function RootComponent() {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <PostHogProvider
                apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
                options={posthogOptions}
            >
                <ThemeProvider defaultTheme="system">
                    <RootDocument>
                        <Outlet />
                    </RootDocument>
                </ThemeProvider>
            </PostHogProvider>
        </QueryClientProvider>
    );
}

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <HeadContent />
                <ScriptOnce>
                    {`
            (function() {
              try {
                const storedTheme = localStorage.getItem('structa-ui-theme') || 'system';
                const html = document.documentElement;
                html.classList.remove('light', 'dark');
                if (storedTheme === 'system') {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  html.classList.add(systemTheme);
                } else {
                  html.classList.add(storedTheme);
                }
                // Update favicon based on theme
                ${updateFavicon.toString()}
                updateFavicon(storedTheme);
              } catch (e) {
                // Fallback to system theme if localStorage fails
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.classList.add(systemTheme);
              }
            })();
          `}
                </ScriptOnce>
            </head>
            <body className="min-h-screen flex flex-col">
                {children}
                <Toaster position="top-center" richColors />
                <TanStackRouterDevtools position="bottom-right" />
                <Scripts />
            </body>
        </html>
    );
}
