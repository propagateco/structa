# Phase 1.2: Authentication Backend

**Parent Phase:** 01 - Project Setup (Web & Auth)
**Status:** 📋 Ready for Implementation
**Estimated Duration:** 60-90 minutes
**Complexity:** High (integrates multiple packages)

---

## Overview

Configure Better Auth server/client, create middleware for route protection, and set up API handlers.

**This phase includes:**
- Creating Better Auth server configuration (emailOTP + Google OAuth)
- Creating Better Auth client configuration with React hooks
- Implementing auth middleware for route protection
- Setting up Better Auth API route handler
- Integrating with SST Resources and database

---

## Step 2.1: Create Better Auth Server Configuration

**File:** `packages/web/src/lib/auth.ts` (new file)

**Action:** Configure Better Auth server-side instance with emailOTP plugin, Google OAuth, and location tracking.

**Source Pattern:** Based on `packages/app-example/src/lib/auth.tsx` (adapt for `packages/web`)

**Critical Imports:**
```typescript
import { betterAuth } from "better-auth"
import { emailOTP } from "better-auth/plugins"
import { db } from "@structa/core/drizzle"
import { AuthSchema } from "@structa/core/auth/"
import { sendVerificationOTP } from "@structa/backend/auth/email"
import { Resource } from "sst"
import { extractIPAddress, getLocationFromIP } from "@structa/core/utils/geolocation"
```

**Configuration Structure:**
```typescript
export const auth = betterAuth({
  // Base configuration
  baseURL: Resource.Domain.platform, // e.g., https://app.structa.so
  secret: Resource.BetterAuthSecret.value,

  // Database connection (from @structa/core)
  database: {
    db,
    type: "pg",
    schema: AuthSchema,
  },

  // Disable password auth (using OTP only)
  emailAndPassword: {
    enabled: false,
  },

  // Email OTP plugin configuration
  plugins: [
    emailOTP({
      // Custom email sender (uses @structa/backend)
      async sendVerificationOTP({ email, otp, type }) {
        await sendVerificationOTP(email, otp)
      },

      // OTP expiration (15 minutes)
      expiresIn: 15 * 60, // seconds

      // OTP length (6 digits)
      otpLength: 6,
    }),
  ],

  // Social providers (Google OAuth)
  socialProviders: {
    google: {
      clientId: Resource.GoogleOAuthClientId.value,
      clientSecret: Resource.GoogleOAuthClientSecret.value,
      redirectURI: `${Resource.Domain.platform}/api/auth/callback/google`,
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache for 5 minutes
    },
  },

  // Custom session data (location tracking)
  user: {
    additionalFields: {
      ipAddress: {
        type: "string",
        required: false,
      },
      city: {
        type: "string",
        required: false,
      },
      country: {
        type: "string",
        required: false,
      },
    },
  },

  // Hooks for location tracking
  hooks: {
    after: [
      {
        matcher(context) {
          return context.path === "/sign-in/email"
        },
        async handler(ctx) {
          if (ctx.session) {
            const ip = extractIPAddress(ctx.request)
            const location = await getLocationFromIP(ip)

            // Update session with location data
            await db
              .update(AuthSchema.session)
              .set({
                ipAddress: ip,
                city: location?.city,
                country: location?.country,
              })
              .where(eq(AuthSchema.session.token, ctx.session.token))
          }
        },
      },
    ],
  },
})
```

**Key Configuration Points:**

1. **Base URL:** Uses SST Resource for environment-aware domain
2. **Secret:** Pulled from SST Secrets (secure, per-environment)
3. **Database:** Direct connection via Drizzle (no API layer)
4. **Email OTP:** Custom sender using existing `@structa/backend` service
5. **Google OAuth:** Credentials from SST Resources
6. **Location Tracking:** IP address → City/Country (custom feature from app-example)

**SST Resources Expected:**
- `Resource.Domain.platform` → `https://app.structa.so`
- `Resource.BetterAuthSecret.value` → Auto-generated secret
- `Resource.GoogleOAuthClientId.value` → From Google Cloud Console
- `Resource.GoogleOAuthClientSecret.value` → From Google Cloud Console

**Database Schema Expected:**
```typescript
// From @structa/core/auth/
export const AuthSchema = {
  user: userTable,          // id, email, emailVerified, name, image, createdAt, updatedAt
  session: sessionTable,    // id, userId, token, expiresAt, ipAddress, city, country
  account: accountTable,    // id, userId, provider, providerAccountId, ...
  verification: verificationTable, // id, identifier, value, expiresAt
}
```

**Verification:**
```bash
npm run typecheck
```

**Expected:** No errors. If import errors occur, verify `@structa/core` and `@structa/backend` exports.

---

## Step 2.2: Create Better Auth Client Configuration

**File:** `packages/web/src/lib/auth-client.ts` (new file)

**Action:** Configure Better Auth client-side instance with React hooks.

**Source Pattern:** Based on `packages/app-example/src/lib/auth-client.ts`

**Content:**
```typescript
import { createAuthClient } from "better-auth/react"
import { emailOTPClient } from "better-auth/client/plugins"

/**
 * Better Auth client instance for React components.
 *
 * Uses emailOTP plugin for passwordless authentication.
 * Base URL automatically set to current origin (works in dev + production).
 */
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",

  plugins: [
    emailOTPClient(), // Adds emailOTP-specific methods
  ],
})

/**
 * Export all auth hooks and methods.
 *
 * Usage:
 * - const { data: session } = useSession()
 * - await signIn.email({ email: "user@example.com" })
 * - await signIn.social.google()
 * - await signOut()
 */
export const {
  // Hooks
  useSession,
  useUser,

  // Sign-in methods
  signIn,

  // Sign-out method
  signOut,

  // Email OTP specific
  $Infer,
} = authClient
```

**Available Methods:**

| Method | Description | Usage |
|--------|-------------|-------|
| `useSession()` | React hook for current session | `const { data: session, isPending } = useSession()` |
| `useUser()` | React hook for current user | `const { data: user } = useUser()` |
| `signIn.email()` | Send email OTP | `await signIn.email({ email })` |
| `signIn.emailOTP.verify()` | Verify OTP code | `await signIn.emailOTP.verify({ email, code })` |
| `signIn.social.google()` | Google OAuth | `await signIn.social.google()` |
| `signOut()` | Sign out user | `await signOut()` |

**Type Safety:**
- All methods are fully typed
- Session and user types inferred from server config
- No `any` types needed

---

## Step 2.3: Create Auth Middleware

**File:** `packages/web/src/middleware/auth.ts` (new directory + file)

**Action:** Create two middleware functions for route protection and login redirection.

**Content:**
```typescript
import { createMiddleware, redirect } from '@tanstack/react-start'
import { auth } from '@/lib/auth'

/**
 * Auth Middleware - Protects routes requiring authentication.
 *
 * Usage: Add to `beforeLoad` for protected routes.
 *
 * @example
 * export const Route = createFileRoute('/_auth')({
 *   beforeLoad: authMiddleware,
 *   component: AuthLayout,
 * })
 */
export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  // Get session from request headers (cookie)
  const session = await auth.api.getSession({
    headers: request.headers
  })

  // If no session, redirect to login
  if (!session?.user) {
    throw redirect({
      to: '/login',
      search: {
        // Preserve redirect URL for post-login return
        redirect: request.url,
      },
    })
  }

  // Pass session to route context
  return next({
    context: {
      session: session.user,
    }
  })
})

/**
 * Login Middleware - Redirects authenticated users away from login pages.
 *
 * Usage: Add to `beforeLoad` for login/landing routes.
 *
 * @example
 * export const Route = createFileRoute('/login')({
 *   beforeLoad: loginMiddleware,
 *   component: LoginPage,
 * })
 */
export const loginMiddleware = createMiddleware().server(async ({ next, request }) => {
  // Get session from request headers (cookie)
  const session = await auth.api.getSession({
    headers: request.headers
  })

  // If session exists, redirect to app
  if (session?.user) {
    throw redirect({
      to: '/app',
    })
  }

  // No session, continue to login page
  return next()
})
```

**Key Behaviors:**

| Middleware | Input State | Action | Result |
|------------|-------------|--------|--------|
| `authMiddleware` | No session | Redirect | `/login?redirect=/app` |
| `authMiddleware` | Has session | Continue | Render protected route |
| `loginMiddleware` | No session | Continue | Render login page |
| `loginMiddleware` | Has session | Redirect | `/app` |

**Session Context:**
- After `authMiddleware` runs, routes can access `session` via context:
  ```typescript
  const context = Route.useRouteContext()
  console.log(context.session.email)
  ```

**Redirect URL Preservation:**
- If user tries to access `/app/settings` while logged out
- They're redirected to `/login?redirect=/app/settings`
- After login, they're sent back to `/app/settings`
- (Implementation of redirect handling in login form is optional for MVP)

---

## Step 2.4: Create Better Auth API Route Handler

**File:** `packages/web/src/routes/api/auth.$.ts` (new directory structure)

**Action:** Create catch-all API route handler for Better Auth.

**Directory Structure:**
```
src/routes/api/
└── auth.$.ts  (handles /api/auth/*)
```

**Content:**
```typescript
import { auth } from '@/lib/auth'
import { createAPIFileRoute } from '@tanstack/react-router/api'

/**
 * Better Auth API route handler.
 *
 * Handles all Better Auth API requests:
 * - POST /api/auth/sign-in/email (send OTP)
 * - POST /api/auth/sign-in/email-otp/verify (verify OTP)
 * - GET /api/auth/sign-in/social/google (initiate OAuth)
 * - GET /api/auth/callback/google (OAuth callback)
 * - POST /api/auth/sign-out (logout)
 * - GET /api/auth/get-session (get current session)
 * - ... and all other Better Auth endpoints
 */
export const APIRoute = createAPIFileRoute('/api/auth/$')({
  GET: async ({ request }) => {
    return auth.handler(request)
  },
  POST: async ({ request }) => {
    return auth.handler(request)
  },
})
```

**What this does:**
- Catches all `/api/auth/*` requests
- Passes them to Better Auth's built-in handler
- Better Auth routes requests to appropriate controllers
- Returns proper HTTP responses (JSON, redirects, etc.)

**Example Requests Handled:**

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/sign-in/email` | Send OTP to email |
| POST | `/api/auth/sign-in/email-otp/verify` | Verify OTP code |
| GET | `/api/auth/sign-in/social/google` | Start Google OAuth flow |
| GET | `/api/auth/callback/google` | Handle OAuth callback |
| POST | `/api/auth/sign-out` | Logout user |
| GET | `/api/auth/get-session` | Get current session |

**Testing:**
```bash
# After implementation, test with curl:
curl -X GET http://localhost:3000/api/auth/get-session
# Expected: {"session": null} (if not logged in)
```

---

## Phase 1.2 Checklist

- [ ] `auth.ts` created with Better Auth server config
- [ ] All SST Resources import correctly
- [ ] Database connection works (test with `npm run typecheck`)
- [ ] `auth-client.ts` created with React hooks
- [ ] `auth.ts` middleware file created
- [ ] `authMiddleware` function implemented
- [ ] `loginMiddleware` function implemented
- [ ] `api/auth.$.ts` route handler created
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] No import errors from `@structa/core` or `@structa/backend`

---

## Related Files

- **Previous Phase:** `specs/plan/01-foundation-tailwind.md`
- **Next Phase:** `specs/plan/03-ui-components.md`
- **Parent Phase Spec:** `specs/plan/01-project-setup.md` (original combined plan)
- **Master Overview:** `specs/plan/00-overview.md`

---

## Notes

This is a **sub-phase** of Phase 01 (Project Setup). After completing this phase:

1. Better Auth server should be configured and working
2. Better Auth client hooks should be available
3. Auth middleware should be protecting routes
4. API handler should be ready to accept auth requests
5. Ready to move to **Phase 1.3: UI Components**

**Important Prerequisites:**
- `npx sst dev` must be running before implementing this phase
- AWS credentials must be valid
- SST Resources must be deployed
- `@structa/core` and `@structa/backend` packages must be accessible
