import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 3000,
    watch: {
      // Use poll-based watching for WSL/Docker reliability
      usePolling: true,
      interval: 1000,
      // Prevent infinite loop by ignoring generated files
      ignored: ['**/routeTree.gen.ts', '**/routeTree.gen.ts.map', '.tanstack/**'],
    },
  },
  ssr: {
    noExternal: ['posthog-js', 'posthog-js/react'],
  },
  optimizeDeps: {
    // Pre-bundle gray-matter with Buffer polyfill support
    include: ['gray-matter'],
  },
  plugins: [
    tailwindcss(),
    nitro(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
      loose: true,
    }),
    tanstackStart(),
    viteReact(),
  ],
  nitro: {
    preset: 'aws-lambda',
    awsLambda: {
      streaming: true
    }
  }
})
