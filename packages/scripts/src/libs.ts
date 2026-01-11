export type DocPage = {
  lib: string
  name: string
  url: string
  filename: string
}

export const registry: DocPage[] = [
  // TanStack
  { lib: 'tanstack-query', name: 'overview', url: 'https://tanstack.com/query/latest/docs/framework/react/overview', filename: 'overview.md' },
  { lib: 'tanstack-query', name: 'api', url: 'https://tanstack.com/query/latest/docs/framework/react/reference/useQuery', filename: 'api.md' },
  { lib: 'tanstack-router', name: 'overview', url: 'https://tanstack.com/router/latest/docs/overview', filename: 'overview.md' },
  { lib: 'tanstack-start', name: 'overview', url: 'https://tanstack.com/start/latest/docs/overview', filename: 'overview.md' },
  { lib: 'tanstack-db', name: 'overview', url: 'https://tanstack.com/db/latest/docs/overview', filename: 'overview.md' },
  // ElectricSQL
  { lib: 'electricsql', name: 'overview', url: 'https://electric-sql.com/docs', filename: 'overview.md' },
  // SST
  { lib: 'sst', name: 'overview', url: 'https://docs.sst.dev/', filename: 'overview.md' },
  // Drizzle
  { lib: 'drizzle', name: 'overview', url: 'https://orm.drizzle.team/docs/overview', filename: 'overview.md' },
  // Better Auth
  { lib: 'better-auth', name: 'overview', url: 'https://better-auth.com/docs', filename: 'overview.md' },
  // Hono
  { lib: 'hono', name: 'overview', url: 'https://hono.dev/docs', filename: 'overview.md' },
  // shadcn/ui
  { lib: 'shadcn-ui', name: 'overview', url: 'https://ui.shadcn.com/docs', filename: 'overview.md' },
]
