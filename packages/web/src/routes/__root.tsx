/// <reference types="vite/client" />
import * as React from 'react'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  ScriptOnce,
} from '@tanstack/react-router'
import appCss from '@/styles/app.css?url'
import { ThemeProvider } from '@/components/theme-provider'

export const Route = createRootRoute({
  head: () => ({
    links: [
      // Preconnect for better performance
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: '' },

      // 1. Space Grotesk (Sans-serif) - from Google Fonts
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap'
      },

      // 2. Lora (Serif) - from Google Fonts
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap'
      },

      // 3. Inter Tight (Variable Sans-serif) - from Google Fonts
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap'
      },

      // App CSS (keep this last)
      { rel: 'stylesheet', href: appCss }
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <RootDocument>
          <Outlet />
        </RootDocument>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <ScriptOnce
          children={`
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
              } catch (e) {
                // Fallback to system theme if localStorage fails
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.classList.add(systemTheme);
              }
            })();
          `}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
        <Toaster position="top-center" richColors />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
