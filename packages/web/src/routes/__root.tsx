/// <reference types="vite/client" />
// Import Buffer polyfill first to ensure gray-matter works in browser during HMR
import '@/lib/buffer-polyfill';

import * as React from 'react';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import {
    HeadContent,
    Outlet,
    Scripts,
    createRootRoute,
    ScriptOnce,
} from '@tanstack/react-router';
import appCss from '@/styles/app.css?url';
import { PostHogProvider } from 'posthog-js/react';

import { ThemeProvider } from '@/components/theme-provider';
import { seo } from '@/utils/seo';
import { updateFavicon } from '@/utils/favicon';

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
