# Phase 1.4: Routes & Protected Pages

**Parent Phase:** 01 - Project Setup (Web & Auth)
**Status:** 📋 Ready for Implementation
**Estimated Duration:** 60-90 minutes
**Complexity:** Medium (route structure + middleware integration)

---

## Overview

Create all route files, update root layout, and implement protected pages with middleware.

**This phase includes:**
- Updating root layout with QueryClient and Toaster
- Creating landing page with redirect logic
- Creating login pages (email + OAuth options)
- Creating protected layout route with middleware
- Creating dashboard and settings pages with tabs
- Deleting example files from original TanStack Start template

---

## Step 4.1: Update Root Layout

**File:** `packages/web/src/routes/__root.tsx`

**Action:** Update to include QueryClient provider, Toaster, and direct CSS import.

**Complete Updated Content:**

```typescript
/// <reference types="vite/client" />
import * as React from 'react'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '@/components/ui/sonner'

// Direct CSS import for Tailwind v4
import '@/styles/app.css'

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
})

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootDocument>
        <Outlet />
      </RootDocument>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Structa</title>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
```

**Key Changes:**

| Before | After | Reason |
|--------|-------|--------|
| `import appCss from '~/styles/app.css?url'` | `import '@/styles/app.css'` | Direct import for Tailwind v4 |
| No QueryClient | `QueryClientProvider` wrapper | Required for TanStack Query |
| No Toaster | `<Toaster />` component | Required for toast notifications |
| Navigation links in body | Removed | Routes have their own navigation |
| No meta tags | Added charset, viewport | SEO and mobile best practices |

**Verification:**
```bash
npm run typecheck
```

**Expected:** No TypeScript errors.

---

## Step 4.2: Create Landing Page

**File:** `packages/web/src/routes/index.tsx`

**Action:** Replace with landing page that redirects authenticated users.

**Content:**

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { loginMiddleware } from '@/middleware/auth'
import { NavigationBar } from '@/components/landing/navigation-bar'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Footer } from '@/components/landing/footer'

export const Route = createFileRoute('/')({
  beforeLoad: loginMiddleware, // Redirects authenticated users to /app
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />

      <main className="flex-1">
        <Hero />
        <Features />
      </main>

      <Footer />
    </div>
  )
}
```

**Behavior:**
- **Unauthenticated users:** See landing page with "Get Started" CTA
- **Authenticated users:** Automatically redirected to `/app` (via `loginMiddleware`)

**Testing:**
1. Visit `http://localhost:3000/` while logged out → See landing page
2. Sign in, then visit `/` → Automatically redirected to `/app`

---

## Step 4.3: Create Login Page

**File:** `packages/web/src/routes/login/index.tsx` (new directory)

**Action:** Create login page with email OTP and Google OAuth options.

**Content:**

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { loginMiddleware } from '@/middleware/auth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LoginCodeForm } from '@/components/auth/login-code-form'
import { Divider } from '@/components/divider'
import { LoginGoogleForm } from '@/components/auth/login-google-form'

export const Route = createFileRoute('/login/')({
  beforeLoad: loginMiddleware, // Redirects authenticated users to /app
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">S</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Enter your email to receive a sign-in code
          </p>
        </CardHeader>

        <CardContent>
          <LoginCodeForm />
          <Divider />
          <LoginGoogleForm />
        </CardContent>
      </Card>
    </div>
  )
}
```

**Layout Reference:** Based on `packages/app-example/src/routes/_login/login/index.tsx`

**Key Features:**
- Centered card layout
- Logo placeholder (simple "S" letter)
- Email OTP form
- "Or" divider
- Google OAuth button
- Redirects authenticated users to `/app`

**Visual Structure:**
```
┌────────────────────────────┐
│          [Logo]            │
│        Sign In             │
│  Enter your email to...    │
│                            │
│  Email: [input field]      │
│  [Continue with Email]     │
│                            │
│  ────────── Or ──────────  │
│                            │
│  [Continue with Google]    │
└────────────────────────────┘
```

---

## Step 4.4: Create OTP Verification Page

**File:** `packages/web/src/routes/login/code.tsx`

**Action:** Create 6-digit OTP verification page.

**Content:**

```typescript
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { loginMiddleware } from '@/middleware/auth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { VerifyCodeForm } from '@/components/auth/verify-code-form'

// Validate search params
const searchSchema = z.object({
  email: z.string().email(),
})

export const Route = createFileRoute('/login/code')({
  beforeLoad: loginMiddleware, // Redirects authenticated users to /app

  // Validate search params
  validateSearch: (search: Record<string, unknown>) => {
    const result = searchSchema.safeParse(search)

    if (!result.success) {
      // If no email in params, redirect back to login
      throw redirect({ to: '/login' })
    }

    return result.data
  },

  component: VerifyCodePage,
})

function VerifyCodePage() {
  const { email } = Route.useSearch()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Verify Code</CardTitle>
          <p className="text-center text-sm text-muted-foreground mt-2">
            We sent a 6-digit code to
          </p>
          <p className="text-center text-sm font-medium">
            {email}
          </p>
        </CardHeader>

        <CardContent>
          <VerifyCodeForm email={email} />
        </CardContent>
      </Card>
    </div>
  )
}
```

**Key Features:**
- Validates `email` query param (redirects to `/login` if missing)
- Displays email address for context
- 6-digit OTP input with auto-submit
- "Back to login" link

**URL Format:** `/login/code?email=user@example.com`

**Behavior:**
- **Valid email param:** Show verification form
- **Missing/invalid email:** Redirect to `/login`
- **Authenticated user:** Redirect to `/app` (via `loginMiddleware`)

---

## Step 4.5: Create Protected Layout

**File:** `packages/web/src/routes/_auth/route.tsx` (new directory)

**Action:** Create layout route for all protected pages.

**Content:**

```typescript
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { authMiddleware } from '@/middleware/auth'
import { AppHeader } from '@/components/app-header'
import { TabNavigation } from '@/components/tab-navigation'

export const Route = createFileRoute('/_auth')({
  beforeLoad: authMiddleware, // Enforces authentication
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <TabNavigation />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
```

**Key Features:**
- **Route Protection:** `authMiddleware` enforces authentication
- **Shared Layout:** All child routes share header + tabs
- **Container:** Content wrapped with max-width container
- **Outlet:** Renders child route content

**Route Structure:**
```
/_auth/                     (this layout)
  ├── app/                  (dashboard)
  │   ├── index.tsx         (renders inside <Outlet />)
  │   └── settings.tsx      (renders inside <Outlet />)
```

**Behavior:**
- **Authenticated user:** Renders layout with child content
- **Unauthenticated user:** Redirected to `/login?redirect=/app`

**Visual Structure:**
```
┌─────────────────────────────────────────┐
│  [Logo]            [Account Dropdown]   │ ← AppHeader
├─────────────────────────────────────────┤
│  Dashboard  |  Settings                 │ ← TabNavigation
├─────────────────────────────────────────┤
│                                         │
│  <Outlet /> (child route content here)  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Step 4.6: Create Dashboard Page

**File:** `packages/web/src/routes/_auth/app/index.tsx` (new directory structure)

**Action:** Create protected dashboard page (placeholder content).

**Content:**

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { useSession } from '@/lib/auth-client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_auth/app/')({
  component: Dashboard,
})

function Dashboard() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {session?.user?.name || session?.user?.email || 'User'}!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
            <p className="text-sm text-muted-foreground mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">456</p>
            <p className="text-sm text-muted-foreground mt-1">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3.2%</p>
            <p className="text-sm text-muted-foreground mt-1">
              +0.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No recent activity to display. This is a placeholder dashboard page.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Key Features:**
- Personalized greeting using session data
- Placeholder metrics cards (3-column grid)
- Placeholder activity section
- Responsive layout (stacks on mobile)

**URL:** `/app`

**Behavior:**
- Protected by `_auth` layout (requires authentication)
- Shows "Dashboard" tab as active in navigation
- Uses `useSession()` hook for user data

---

## Step 4.7: Create Settings Page with Tabs

**File:** `packages/web/src/routes/_auth/app/settings.tsx`

**Action:** Create settings page with Profile/Account/Security tabs.

**Content:**

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { useSession } from '@/lib/auth-client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/_auth/app/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details and public information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  defaultValue={user?.name || ''}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Profile editing coming soon
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ''}
                  disabled
                />
              </div>

              <Button disabled>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Account Status</h3>
                <p className="text-sm text-muted-foreground">
                  Your account is active and in good standing
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Data Export</h3>
                <p className="text-sm text-muted-foreground">
                  Download a copy of your data
                </p>
                <Button variant="outline" disabled>
                  Export Data
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
                <Button variant="destructive" disabled>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your security preferences and authentication methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Authentication Methods</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Email OTP</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <span className="text-sm text-primary">Active</span>
                  </div>

                  {/* Check if Google account is linked */}
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Google</p>
                      <p className="text-sm text-muted-foreground">
                        Sign in with Google account
                      </p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Configure
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline" disabled>
                  Enable 2FA
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Active Sessions</h3>
                <p className="text-sm text-muted-foreground">
                  Manage devices where you're currently signed in
                </p>
                <Button variant="outline" disabled>
                  View Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

**Key Features:**
- **Three Tabs:** Profile, Account, Security
- **Placeholder Content:** All actions disabled (coming soon)
- **User Data:** Shows current user email/name
- **Responsive:** Stacks on mobile
- **Consistent Design:** Uses Card components for sections

**URL:** `/app/settings`

**Behavior:**
- Protected by `_auth` layout (requires authentication)
- Shows "Settings" tab as active in navigation
- Default tab: "Profile"

**Tab Content Summary:**

| Tab | Content | Actions (Disabled) |
|-----|---------|-------------------|
| **Profile** | Name, Email fields | Save Changes |
| **Account** | Account status, Data export, Delete account | Export Data, Delete Account |
| **Security** | Auth methods, 2FA, Active sessions | Enable 2FA, View Sessions |

---

## Step 4.8: Delete Example Files

**Action:** Remove files from original TanStack Start bare example.

**Files to Delete:**

```bash
# Delete example routes
rm packages/web/src/routes/about.tsx

# Delete example components
rm -rf packages/web/src/components/Counter.tsx
rm -rf packages/web/src/components/Counter.css
```

**Verification:**
```bash
# Check that files are deleted
ls packages/web/src/routes/
# Expected: __root.tsx, index.tsx, login/, _auth/, api/

ls packages/web/src/components/
# Expected: ui/, auth/, landing/, *.tsx (no Counter files)
```

**Why delete:**
- `about.tsx` - Not needed in new route structure
- `Counter.tsx` / `Counter.css` - Example component not relevant to auth app

---

## Phase 1.4 Checklist

- [ ] `__root.tsx` updated with QueryClient + Toaster
- [ ] `index.tsx` replaced with landing page
- [ ] `login/index.tsx` created (email + Google auth)
- [ ] `login/code.tsx` created (OTP verification)
- [ ] `_auth/route.tsx` created (protected layout)
- [ ] `_auth/app/index.tsx` created (dashboard)
- [ ] `_auth/app/settings.tsx` created (settings with tabs)
- [ ] Example files deleted (`about.tsx`, `Counter.*`)
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Dev server starts without errors (`npm run dev`)

---

## Related Files

- **Previous Phase:** `specs/plan/03-ui-components.md`
- **Next Phase:** `specs/plan/05-testing-validation.md`
- **Parent Phase Spec:** `specs/plan/01-project-setup.md` (original combined plan)
- **Master Overview:** `specs/plan/00-overview.md`

---

## Notes

This is a **sub-phase** of Phase 01 (Project Setup). After completing this phase:

1. All routes should be created
2. Root layout should include QueryClient and Toaster
3. Landing page should redirect authenticated users
4. Login pages should be functional
5. Protected layout should enforce authentication
6. Dashboard and settings pages should be created
7. Example files should be deleted
8. Ready to move to **Phase 1.5: Testing & Validation**

**Route Structure After This Phase:**
```
/                          (landing, redirects if auth)
/login                     (login form, redirects if auth)
/login/code                (OTP verification, redirects if auth)
/app                       (dashboard, protected)
/app/settings              (settings, protected)
/api/auth/$                (Better Auth API handler)
```

**Important:**
- All routes are fully typed (no `any` types)
- Middleware is correctly configured for protection
- Components from Phase 1.3 are properly used
- QueryClient and Toaster are available globally
- All imports resolve correctly
