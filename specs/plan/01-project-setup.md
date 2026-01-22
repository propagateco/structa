# Phase 00: TanStack Start Authentication Implementation Plan

**Status:** 📋 Planning Complete - Ready for Implementation
**Created:** 2026-01-21
**Target Package:** `packages/web`
**Estimated Duration:** 4-6 hours

---

## Executive Summary

Transform `packages/web/` from a minimal TanStack Start example into a fully authenticated application with Better Auth integration, featuring:

- **Authentication Methods:** Email OTP (passwordless) + Google OAuth
- **UI Framework:** Tailwind v4 (CSS-first) + Shadcn UI components
- **Theme:** Teal/cyan brand colors using OKLCH color space
- **Architecture:** Direct database access via Drizzle, SST Resources for configuration
- **Route Structure:** `/` (landing) → `/login` → `/login/code` → `/app` (protected dashboard)

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Target Architecture](#target-architecture)
3. [Phase 1: Foundation & Tailwind v4 Setup](#phase-1-foundation--tailwind-v4-setup)
4. [Phase 2: Authentication Backend](#phase-2-authentication-backend)
5. [Phase 3: UI Components](#phase-3-ui-components)
6. [Phase 4: Routes & Protected Pages](#phase-4-routes--protected-pages)
7. [Phase 5: Testing & Validation](#phase-5-testing--validation)
8. [Success Criteria](#success-criteria)
9. [Technical Decisions Log](#technical-decisions-log)
10. [Risk Assessment](#risk-assessment)

---

## Current State Analysis

### What Exists

✅ **Infrastructure:**
- Basic TanStack Start setup (Router + SSR)
- TypeScript configuration with path aliases (`~/*`)
- Vite config with TanStack Start plugin
- SST infrastructure (Domain, Secrets, OAuth credentials configured)
- Nitro preset for AWS Lambda deployment

✅ **Packages Available:**
- `@structa/core` - Database schema, Drizzle ORM, auth tables
- `@structa/backend` - Email service (`sendVerificationOTP`)
- `@structa/app-example` - Reference implementation (Tailwind v3, Better Auth)

✅ **Current Routes:**
- `/` - Index page with minimal content
- `/about` - Example page (will be removed)

✅ **Current Styling:**
- `src/styles/app.css` - 214 bytes of basic CSS (will be replaced)

### What's Missing

❌ **Authentication:**
- Better Auth server/client configuration
- Auth middleware for route protection
- Login/logout flows
- Session management

❌ **UI Framework:**
- No Tailwind CSS (neither v3 nor v4)
- No component library (Shadcn)
- No design system or theme

❌ **Protected Routes:**
- No auth middleware
- No protected layout
- No dashboard/settings pages

❌ **Landing Experience:**
- No marketing/landing page
- No navigation components
- No call-to-action flows

---

## Target Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Landing Page (/)                        │
│                                                              │
│  - Public marketing page                                     │
│  - Redirects to /app if authenticated                        │
│  - CTA button → /login                                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                     Login Page (/login)                      │
│                                                              │
│  - Email OTP input form                                      │
│  - Google OAuth button                                       │
│  - Redirects to /app if already authenticated                │
└─────────────┬───────────────────────────┬───────────────────┘
              │                           │
       Email OTP                    Google OAuth
              │                           │
              ▼                           ▼
┌──────────────────────┐      ┌──────────────────────┐
│  Verification Page   │      │   OAuth Provider     │
│  (/login/code)       │      │   (Google)           │
│                      │      │                      │
│  - 6-digit OTP input │      │  - Consent screen    │
│  - Auto-submit       │      │  - Redirect callback │
└──────────┬───────────┘      └──────────┬───────────┘
           │                             │
           └─────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Protected App (/app)                        │
│                                                              │
│  - Dashboard page (placeholder)                              │
│  - Settings page (Profile/Account/Security tabs)             │
│  - Requires authentication (authMiddleware)                  │
│  - Header with account dropdown                              │
│  - Tab navigation (Dashboard/Settings)                       │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure (Target State)

```
packages/web/
├── src/
│   ├── components/
│   │   ├── ui/                      # Shadcn components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── form.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── separator.tsx
│   │   │   └── label.tsx
│   │   ├── auth/                    # Auth-specific components
│   │   │   ├── login-code-form.tsx
│   │   │   ├── login-google-form.tsx
│   │   │   ├── verify-code-form.tsx
│   │   │   └── account-dropdown.tsx
│   │   ├── landing/                 # Landing page components
│   │   │   ├── navigation-bar.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   └── footer.tsx
│   │   ├── app-header.tsx           # Protected app header
│   │   ├── tab-navigation.tsx       # Dashboard/Settings tabs
│   │   └── divider.tsx              # "Or" separator
│   ├── lib/
│   │   ├── auth.ts                  # Better Auth server config
│   │   ├── auth-client.ts           # Better Auth client hooks
│   │   └── utils.ts                 # cn() utility
│   ├── middleware/
│   │   └── auth.ts                  # authMiddleware + loginMiddleware
│   ├── routes/
│   │   ├── __root.tsx               # Root layout (QueryClient, Toaster)
│   │   ├── index.tsx                # Landing page
│   │   ├── login/
│   │   │   ├── index.tsx            # Login page
│   │   │   └── code.tsx             # OTP verification page
│   │   ├── _auth/                   # Protected layout route
│   │   │   ├── route.tsx            # Layout (header + tabs)
│   │   │   └── app/
│   │   │       ├── index.tsx        # Dashboard
│   │   │       └── settings.tsx     # Settings (tabs)
│   │   └── api/
│   │       └── auth.$.ts            # Better Auth API handler
│   ├── styles/
│   │   └── app.css                  # Tailwind v4 CSS config
│   └── router.tsx                   # TanStack Router setup
├── components.json                  # Shadcn CLI config
├── package.json
├── tsconfig.json                    # Updated with @/* alias
└── vite.config.ts                   # Updated with Tailwind plugin
```

### Technology Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Framework** | TanStack Start | ^1.154.0 | Router + SSR |
| **UI Library** | React | ^19.0.0 | Latest stable |
| **Styling** | Tailwind CSS | @next (v4) | CSS-first config |
| **Components** | Shadcn UI | Latest | Radix primitives |
| **Auth** | Better Auth | Latest | With emailOTP plugin |
| **Forms** | React Hook Form | Latest | + Zod validation |
| **Data Fetching** | TanStack Query | Latest | Client-side caching |
| **Database** | Drizzle ORM | Via @structa/core | PostgreSQL |
| **Infrastructure** | SST | Latest | AWS Lambda + CloudFront |
| **Deployment** | Nitro | Latest | AWS Lambda preset |

---

## Phase 1: Foundation & Tailwind v4 Setup

### Overview
Set up Tailwind v4 with CSS-first configuration, Shadcn component library, and teal/cyan brand theme.

**Duration:** 45-60 minutes
**Complexity:** Medium (Tailwind v4 is different from v3)

---

### Step 1.1: Install Core Dependencies

**Location:** `packages/web/`

```bash
# Tailwind v4 (CSS-first approach - no config file needed)
npm install -D tailwindcss@next @tailwindcss/vite@next

# Better Auth
npm install better-auth @better-auth/plugin-email-otp

# TanStack Query (client-side data fetching)
npm install @tanstack/react-query @tanstack/react-query-devtools

# Form handling + validation
npm install react-hook-form @hookform/resolvers

# Radix UI primitives (required by Shadcn)
npm install @radix-ui/react-avatar @radix-ui/react-dropdown-menu \
  @radix-ui/react-dialog @radix-ui/react-scroll-area \
  @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-label

# Utility libraries
npm install class-variance-authority clsx tailwind-merge lucide-react sonner input-otp cmdk
```

**Verification:**
```bash
npm list | grep -E "(tailwindcss|better-auth|@tanstack/react-query)"
```

**Expected Output:**
- `tailwindcss@4.x.x` (prerelease version)
- `@tailwindcss/vite@2.x.x`
- `better-auth@x.x.x`
- `@tanstack/react-query@x.x.x`

---

### Step 1.2: Configure Vite for Tailwind v4

**File:** `packages/web/vite.config.ts`

**Action:** Add Tailwind Vite plugin BEFORE `tanstackStart()` plugin.

**Changes:**
```diff
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
+ import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    nitro(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
+   tailwindcss(), // MUST come before tanstackStart()
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
```

**Why this order matters:**
- Tailwind needs to process CSS before TanStack Start bundles it
- Plugin order affects build pipeline execution

**Verification:**
```bash
npm run typecheck
```

**Expected:** No TypeScript errors related to imports.

---

### Step 1.3: Create Tailwind v4 CSS Configuration

**File:** `packages/web/src/styles/app.css` (replace existing file)

**Action:** Replace entire file with CSS-first Tailwind v4 configuration.

**Content:**

```css
/* Tailwind v4 - CSS-first approach (no tailwind.config.js needed) */
@import "tailwindcss";

/* Base variables using OKLCH color space for better color perception */
:root {
  /* Brand colors - Teal/Cyan theme */
  --primary: oklch(0.62 0.14 187);           /* Teal */
  --primary-foreground: oklch(1 0 0);        /* White */

  /* Background & Foreground */
  --background: oklch(1 0 0);                /* White */
  --foreground: oklch(0.2 0 0);              /* Near black */

  /* Card */
  --card: oklch(1 0 0);                      /* White */
  --card-foreground: oklch(0.2 0 0);         /* Near black */

  /* Popover */
  --popover: oklch(1 0 0);                   /* White */
  --popover-foreground: oklch(0.2 0 0);      /* Near black */

  /* Secondary */
  --secondary: oklch(0.96 0 0);              /* Light gray */
  --secondary-foreground: oklch(0.2 0 0);    /* Near black */

  /* Muted */
  --muted: oklch(0.96 0 0);                  /* Light gray */
  --muted-foreground: oklch(0.55 0 0);       /* Medium gray */

  /* Accent */
  --accent: oklch(0.96 0 0);                 /* Light gray */
  --accent-foreground: oklch(0.2 0 0);       /* Near black */

  /* Destructive */
  --destructive: oklch(0.58 0.22 25);        /* Red */
  --destructive-foreground: oklch(1 0 0);    /* White */

  /* Border */
  --border: oklch(0.90 0 0);                 /* Light gray */
  --input: oklch(0.90 0 0);                  /* Light gray */
  --ring: oklch(0.62 0.14 187);              /* Teal (same as primary) */

  /* Radius */
  --radius: 0.5rem;
}

/* Dark mode (optional - can be implemented later) */
.dark {
  --background: oklch(0.15 0 0);             /* Dark background */
  --foreground: oklch(0.98 0 0);             /* Near white */
  /* ... other dark mode colors ... */
}

/* Map CSS variables to Tailwind utilities */
@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --border-radius: var(--radius);
}

/* Base styles */
@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
}
```

**Key Differences from Tailwind v3:**
- Uses `@import "tailwindcss"` instead of `@tailwind` directives
- Uses `@theme inline` to map CSS variables to Tailwind utilities
- No separate `tailwind.config.js` file needed
- Uses OKLCH color space for better color perception

**Reference:**
- [Tailwind v4 Alpha Documentation](https://tailwindcss.com/docs/v4-beta)
- Color values derived from `packages/app-example/src/styles.css` but adapted for Tailwind v4 syntax

---

### Step 1.4: Update TypeScript Path Aliases

**File:** `packages/web/tsconfig.json`

**Action:** Add `@/*` alias for Shadcn components (in addition to existing `~/*` alias).

**Changes:**
```diff
{
  "include": ["**/*.ts", "**/*.tsx", "public/script*.js"],
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "isolatedModules": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "target": "ES2022",
    "allowJs": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"],
+     "@/*": ["./src/*"]
    },
    "noEmit": true,
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```

**Why both aliases:**
- `~/*` - Existing convention in this project
- `@/*` - Shadcn CLI expects this convention

**Verification:**
```bash
npm run typecheck
```

---

### Step 1.5: Create Shadcn CLI Configuration

**File:** `packages/web/components.json` (new file)

**Action:** Create configuration file for `npx shadcn@latest add` command.

**Content:**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/app.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**Configuration Explanation:**
- `style: "new-york"` - Shadcn design style (cleaner than "default")
- `rsc: false` - Not using React Server Components (TanStack Start handles SSR differently)
- `tsx: true` - TypeScript with JSX
- `tailwind.config: ""` - Empty because Tailwind v4 doesn't use config file
- `cssVariables: true` - Use CSS variables for theming
- `aliases` - Path aliases for imports

---

### Step 1.6: Create Utility Files

**File:** `packages/web/src/lib/utils.ts` (new file)

**Action:** Create utility function for merging Tailwind classes.

**Content:**
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS classes intelligently.
 *
 * Combines clsx (conditional classes) with tailwind-merge (deduplication).
 *
 * @example
 * cn("px-4 py-2", "px-6") // => "py-2 px-6" (px-4 removed, px-6 takes precedence)
 * cn("text-red-500", isError && "text-blue-500") // => conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Purpose:**
- Required by ALL Shadcn components
- Handles conditional class application
- Prevents Tailwind class conflicts (e.g., `px-4` overridden by `px-6`)

**Usage Example:**
```typescript
<Button className={cn("bg-primary", isLoading && "opacity-50")} />
```

---

### Step 1.7: Install Shadcn UI Components

**Location:** `packages/web/`

**Action:** Run Shadcn CLI to install required components.

**Commands:**
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add form
npx shadcn@latest add input-otp
npx shadcn@latest add tabs
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add sonner
npx shadcn@latest add separator
```

**What this does:**
- Creates `src/components/ui/` directory
- Generates component files (e.g., `button.tsx`, `card.tsx`)
- Each component is customizable (not a node_module)
- Uses Radix UI primitives under the hood

**Expected Result:**
```
packages/web/src/components/ui/
├── button.tsx
├── card.tsx
├── input.tsx
├── label.tsx
├── form.tsx
├── input-otp.tsx
├── tabs.tsx
├── dropdown-menu.tsx
├── avatar.tsx
├── sonner.tsx
└── separator.tsx
```

**Verification:**
```bash
ls -la src/components/ui/
```

**Expected:** 11 `.tsx` files created.

---

### Step 1.8: Test Tailwind v4 Setup

**File:** `packages/web/src/routes/test-tailwind.tsx` (temporary test file)

**Action:** Create a test route to verify Tailwind v4 and teal theme are working.

**Content:**
```typescript
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/test-tailwind')({
  component: TestTailwind,
})

function TestTailwind() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-primary">
            Tailwind v4 + Teal Theme Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            If you can see teal colors and proper styling, Tailwind v4 is working!
          </p>

          <div className="space-y-2">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Primary Button (Teal)
            </Button>
            <Button variant="outline" className="w-full">
              Outline Button
            </Button>
            <Button variant="secondary" className="w-full">
              Secondary Button
            </Button>
          </div>

          <div className="rounded-md border border-border p-4">
            <p className="text-sm text-foreground">
              Border and padding test
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Testing Steps:**
1. Ensure `npx sst dev` is running in background
2. Start dev server: `npm run dev`
3. Visit: `http://localhost:3000/test-tailwind`
4. Verify:
   - ✅ Page renders without errors
   - ✅ Teal color visible on heading and primary button
   - ✅ Button hover states work
   - ✅ Card component renders with proper styling
   - ✅ Border and spacing look correct

**Cleanup:**
- Delete this file after successful verification

**Troubleshooting:**

| Issue | Solution |
|-------|----------|
| **White screen / no styles** | Check Vite config - ensure `tailwindcss()` plugin is present |
| **"Cannot find module @/components"** | Check tsconfig.json paths and restart TypeScript server |
| **Colors not appearing** | Check `app.css` - ensure `@theme inline` block exists |
| **Button component error** | Re-run `npx shadcn@latest add button` |

---

### Phase 1 Checklist

- [ ] All dependencies installed (`npm list` shows versions)
- [ ] Vite config updated with Tailwind plugin
- [ ] `app.css` replaced with Tailwind v4 configuration
- [ ] TypeScript paths include `@/*` alias
- [ ] `components.json` created
- [ ] `utils.ts` created with `cn()` function
- [ ] All Shadcn components installed (11 files in `ui/`)
- [ ] Test page renders with teal theme
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Test page deleted after verification

---

## Phase 2: Authentication Backend

### Overview
Configure Better Auth server/client, create middleware for route protection, and set up API handlers.

**Duration:** 60-90 minutes
**Complexity:** High (integrates multiple packages)

---

### Step 2.1: Create Better Auth Server Configuration

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

### Step 2.2: Create Better Auth Client Configuration

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

### Step 2.3: Create Auth Middleware

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

### Step 2.4: Create Better Auth API Route Handler

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

### Phase 2 Checklist

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

## Phase 3: UI Components

### Overview
Create all React components needed for authentication flows, layouts, and landing page.

**Duration:** 90-120 minutes
**Complexity:** Medium (many files, but straightforward patterns)

---

### Step 3.1: Create Auth Components

**Directory:** `packages/web/src/components/auth/` (new directory)

---

#### Component 3.1.1: Login Code Form (Email Input)

**File:** `packages/web/src/components/auth/login-code-form.tsx`

**Purpose:** Email input form that sends OTP code.

**Reference:** `packages/app-example/src/components/auth/login-code-form.tsx`

**Features:**
- React Hook Form + Zod validation
- Email format validation
- Success toast on OTP sent
- Error handling with inline errors + toast
- Navigates to `/login/code?email=X` on success

**Content Structure:**
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Validation schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type FormData = z.infer<typeof formSchema>

export function LoginCodeForm() {
  const navigate = useNavigate()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: FormData) {
    try {
      // Send OTP via Better Auth
      await signIn.email({
        email: data.email,
      })

      // Show success message
      toast.success("Code sent! Check your email.")

      // Navigate to verification page
      navigate({
        to: "/login/code",
        search: { email: data.email },
      })
    } catch (error) {
      // Show error message
      toast.error("Failed to send code. Please try again.")
      console.error("Login code error:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Sending..." : "Continue with Email"}
        </Button>
      </form>
    </Form>
  )
}
```

**Key Features:**
- Email validation (Zod schema)
- Loading state during submission
- Toast notifications (success + error)
- Navigation with email in query params

---

#### Component 3.1.2: Login Google Form (OAuth Button)

**File:** `packages/web/src/components/auth/login-google-form.tsx`

**Purpose:** Google OAuth sign-in button.

**Content:**
```typescript
import { toast } from "sonner"
import { signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function LoginGoogleForm() {
  async function handleGoogleSignIn() {
    try {
      // Initiate Google OAuth flow
      await signIn.social.google()

      // User will be redirected to Google
      // No need for success toast (they're leaving) page
    } catch (error) {
      // Show error message
      toast.error("Failed to sign in with Google. Please try again.")
      console.error("Google sign-in error:", error)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleSignIn}
    >
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Continue with Google
    </Button>
  )
}
```

**Key Features:**
- Google logo SVG embedded
- Outline button variant (not primary color)
- Error handling with toast
- Initiates OAuth flow (Better Auth handles redirect)

---

#### Component 3.1.3: Verify Code Form (6-digit OTP Input)

**File:** `packages/web/src/components/auth/verify-code-form.tsx`

**Purpose:** 6-digit OTP input with auto-submit.

**Reference:** `packages/app-example/src/components/auth/verify-code-form.tsx`

**Content:**
```typescript
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

interface VerifyCodeFormProps {
  email: string
}

export function VerifyCodeForm({ email }: VerifyCodeFormProps) {
  const navigate = useNavigate()
  const [code, setCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  async function handleVerify(otpCode: string) {
    if (otpCode.length !== 6) return

    setIsVerifying(true)

    try {
      // Verify OTP via Better Auth
      await signIn.emailOTP.verify({
        email,
        code: otpCode,
      })

      // Success! Redirect to app
      toast.success("Signed in successfully!")
      navigate({ to: "/app" })
    } catch (error) {
      // Show error message
      toast.error("Invalid code. Please try again.")
      console.error("OTP verification error:", error)

      // Clear code for retry
      setCode("")
    } finally {
      setIsVerifying(false)
    }
  }

  function handleChange(value: string) {
    setCode(value)

    // Auto-submit when 6 digits entered
    if (value.length === 6) {
      handleVerify(value)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <InputOTP
          value={code}
          onChange={handleChange}
          maxLength={6}
          disabled={isVerifying}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {isVerifying && (
        <p className="text-center text-sm text-muted-foreground">
          Verifying code...
        </p>
      )}

      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => navigate({ to: "/login" })}
        disabled={isVerifying}
      >
        Back to login
      </Button>
    </div>
  )
}
```

**Key Features:**
- 6 individual input slots (Shadcn `input-otp` component)
- Auto-submit when 6th digit entered
- Loading state during verification
- Error handling clears code for retry
- "Back to login" button

---

#### Component 3.1.4: Account Dropdown

**File:** `packages/web/src/components/auth/account-dropdown.tsx`

**Purpose:** User avatar + dropdown menu (logout, settings).

**Content:**
```typescript
import { useNavigate } from "@tanstack/react-router"
import { LogOut, Settings, User } from "lucide-react"
import { signOut, useSession } from "@/lib/auth-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function AccountDropdown() {
  const navigate = useNavigate()
  const { data: session } = useSession()

  if (!session?.user) return null

  const user = session.user

  // Get user initials for avatar fallback
  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : user.email[0].toUpperCase()

  async function handleSignOut() {
    await signOut()
    navigate({ to: "/login" })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={user.image || undefined} alt={user.name || user.email} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate({ to: "/app" })}>
          <User className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate({ to: "/app/settings" })}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

**Key Features:**
- Shows user avatar (image or initials)
- Dropdown menu with navigation links
- Logout functionality
- Icons from `lucide-react`

---

### Step 3.2: Create Layout Components

**Directory:** `packages/web/src/components/` (root components directory)

---

#### Component 3.2.1: Divider

**File:** `packages/web/src/components/divider.tsx`

**Purpose:** "Or" separator for login page.

**Content:**
```typescript
export function Divider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">Or</span>
      </div>
    </div>
  )
}
```

**Visual Result:**
```
────────── Or ──────────
```

---

#### Component 3.2.2: App Header

**File:** `packages/web/src/components/app-header.tsx`

**Purpose:** Top navigation bar for protected pages.

**Content:**
```typescript
import { Link } from "@tanstack/react-router"
import { AccountDropdown } from "@/components/auth/account-dropdown"

export function AppHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/app" className="text-xl font-bold text-primary">
          Structa
        </Link>

        {/* Right side - Account dropdown */}
        <AccountDropdown />
      </div>
    </header>
  )
}
```

**Features:**
- Logo links to `/app`
- Account dropdown on right side
- Container with max-width
- Border bottom for separation

---

#### Component 3.2.3: Tab Navigation

**File:** `packages/web/src/components/tab-navigation.tsx`

**Purpose:** Horizontal tabs for Dashboard / Settings.

**Content:**
```typescript
import { Link, useMatchRoute } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

const tabs = [
  { to: "/app", label: "Dashboard" },
  { to: "/app/settings", label: "Settings" },
]

export function TabNavigation() {
  const matchRoute = useMatchRoute()

  return (
    <div className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <nav className="flex gap-6">
          {tabs.map((tab) => {
            const isActive = matchRoute({ to: tab.to, fuzzy: false })

            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={cn(
                  "py-4 text-sm font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
```

**Features:**
- Active tab highlighted with primary color
- Underline indicator for active tab
- Hover state for inactive tabs
- Uses TanStack Router's `useMatchRoute` for active state

---

### Step 3.3: Create Landing Page Components

**Directory:** `packages/web/src/components/landing/` (new directory)

**Note:** These are placeholder implementations focused on auth flow, not polish.

---

#### Component 3.3.1: Navigation Bar

**File:** `packages/web/src/components/landing/navigation-bar.tsx`

**Content:**
```typescript
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export function NavigationBar() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary">
          Structa
        </Link>

        {/* CTA Button */}
        <Button asChild>
          <Link to="/login">Get Started</Link>
        </Button>
      </div>
    </header>
  )
}
```

---

#### Component 3.3.2: Hero

**File:** `packages/web/src/components/landing/hero.tsx`

**Content:**
```typescript
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold mb-6 text-foreground">
          Welcome to Structa
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A modern authentication example built with TanStack Start, Better Auth, and Tailwind v4.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/login">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

---

#### Component 3.3.3: Features

**File:** `packages/web/src/components/landing/features.tsx`

**Content:**
```typescript
import { Mail, Shield, Zap } from "lucide-react"

const features = [
  {
    icon: Mail,
    title: "Email OTP",
    description: "Passwordless authentication with one-time codes sent to your email.",
  },
  {
    icon: Shield,
    title: "OAuth Support",
    description: "Sign in securely with your Google account.",
  },
  {
    icon: Zap,
    title: "Fast & Modern",
    description: "Built with TanStack Start for optimal performance and DX.",
  },
]

export function Features() {
  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

#### Component 3.3.4: Footer

**File:** `packages/web/src/components/landing/footer.tsx`

**Content:**
```typescript
export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>© 2026 Structa. Built with TanStack Start.</p>
      </div>
    </footer>
  )
}
```

---

### Phase 3 Checklist

- [ ] `auth/` directory created
- [ ] `login-code-form.tsx` created (email input)
- [ ] `login-google-form.tsx` created (OAuth button)
- [ ] `verify-code-form.tsx` created (6-digit OTP)
- [ ] `account-dropdown.tsx` created (user menu)
- [ ] `divider.tsx` created ("Or" separator)
- [ ] `app-header.tsx` created (top bar)
- [ ] `tab-navigation.tsx` created (Dashboard/Settings tabs)
- [ ] `landing/` directory created
- [ ] `navigation-bar.tsx` created
- [ ] `hero.tsx` created
- [ ] `features.tsx` created
- [ ] `footer.tsx` created
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] All imports resolve correctly

---

## Phase 4: Routes & Protected Pages

### Overview
Create all route files, update root layout, and implement protected pages with middleware.

**Duration:** 60-90 minutes
**Complexity:** Medium (route structure + middleware integration)

---

### Step 4.1: Update Root Layout

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

### Step 4.2: Create Landing Page

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

### Step 4.3: Create Login Page

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

### Step 4.4: Create OTP Verification Page

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

### Step 4.5: Create Protected Layout

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

### Step 4.6: Create Dashboard Page

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

### Step 4.7: Create Settings Page with Tabs

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

### Step 4.8: Delete Example Files

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

### Phase 4 Checklist

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

## Phase 5: Testing & Validation

### Overview
Comprehensive testing checklist to verify all authentication flows, route protection, and UI interactions work correctly.

**Duration:** 30-45 minutes
**Complexity:** Low (manual testing)

---

### Step 5.1: Pre-Flight Checks

**Action:** Verify project builds and compiles before manual testing.

**Commands:**

```bash
# TypeScript compilation check
npm run typecheck

# Expected output:
# No errors found

# Development server check
npm run dev

# Expected output:
# Server running on http://localhost:3000

# Production build check
npm run build

# Expected output:
# Build completed successfully
```

**Troubleshooting:**

| Error | Solution |
|-------|----------|
| **Module not found: @/components** | Check `tsconfig.json` has `@/*` path alias |
| **Cannot find module 'better-auth'** | Run `npm install` again |
| **Tailwind classes not applying** | Check `vite.config.ts` has `tailwindcss()` plugin |
| **SST Resource errors** | Ensure `npx sst dev` is running |

---

### Step 5.2: Authentication Flow Testing

#### Test Case 5.2.1: Email OTP Sign-In (Happy Path)

**Steps:**

1. **Visit login page**
   ```
   Navigate to: http://localhost:3000/login
   ```

2. **Enter valid email**
   ```
   Email: your-email@example.com
   Click: "Continue with Email"
   ```

3. **Verify toast notification**
   - ✅ Toast appears: "Code sent! Check your email."
   - ✅ Redirected to `/login/code?email=your-email@example.com`

4. **Check email for OTP code**
   - ✅ Email received with 6-digit code
   - ✅ Email sender is correct (configured in backend)

5. **Enter OTP code**
   ```
   Enter: [6-digit code from email]
   (Auto-submits when 6th digit entered)
   ```

6. **Verify successful sign-in**
   - ✅ Toast appears: "Signed in successfully!"
   - ✅ Redirected to `/app` (dashboard)
   - ✅ User avatar appears in header
   - ✅ Dashboard shows personalized greeting

7. **Verify session persistence**
   ```
   Refresh page: F5
   ```
   - ✅ Still logged in (no redirect to login page)
   - ✅ Session data still available

**Expected Duration:** 2-3 minutes

---

#### Test Case 5.2.2: Email OTP Sign-In (Error Cases)

**Test A: Invalid Email Format**

1. Navigate to `/login`
2. Enter invalid email: `not-an-email`
3. Click "Continue with Email"

**Expected:**
- ❌ Inline error: "Please enter a valid email address"
- ❌ Submit button remains disabled or form doesn't submit

**Test B: Wrong OTP Code**

1. Complete email step successfully
2. On `/login/code` page, enter wrong code: `000000`

**Expected:**
- ❌ Toast error: "Invalid code. Please try again."
- ✅ Code input cleared for retry
- ✅ User can enter new code

**Test C: Expired OTP Code**

1. Request OTP code
2. Wait 15+ minutes (OTP expiration time)
3. Enter expired code

**Expected:**
- ❌ Toast error: "Invalid code. Please try again."
- ✅ Option to request new code (via "Back to login" button)

---

#### Test Case 5.2.3: Google OAuth Sign-In

**Steps:**

1. **Visit login page**
   ```
   Navigate to: http://localhost:3000/login
   ```

2. **Click Google button**
   ```
   Click: "Continue with Google"
   ```

3. **Verify redirect to Google**
   - ✅ Redirected to Google OAuth consent screen
   - ✅ URL contains `accounts.google.com`

4. **Sign in with Google**
   ```
   Enter Google credentials
   Click: "Allow" on consent screen
   ```

5. **Verify callback and redirect**
   - ✅ Redirected back to app via `/api/auth/callback/google`
   - ✅ Automatically redirected to `/app`
   - ✅ User avatar shows Google profile picture
   - ✅ Dashboard shows Google account name

6. **Verify session persistence**
   ```
   Refresh page: F5
   ```
   - ✅ Still logged in
   - ✅ Google profile data persists

**Expected Duration:** 1-2 minutes

**Troubleshooting:**

| Issue | Solution |
|-------|---------|
| **OAuth error: redirect_uri_mismatch** | Check Google Cloud Console → OAuth credentials → Authorized redirect URIs includes `https://app.structa.so/api/auth/callback/google` |
| **OAuth error: invalid_client** | Verify `Resource.GoogleOAuthClientId` and `Resource.GoogleOAuthClientSecret` are correct |

---

### Step 5.3: Route Protection Testing

#### Test Case 5.3.1: Protected Routes Redirect Unauthenticated Users

**Test A: Access /app while logged out**

1. **Open incognito window** (to ensure no session)
2. Navigate to: `http://localhost:3000/app`

**Expected:**
- ✅ Immediately redirected to `/login`
- ✅ No flash of dashboard content
- ✅ URL shows `/login?redirect=/app` (optional redirect parameter)

**Test B: Access /app/settings while logged out**

1. Navigate to: `http://localhost:3000/app/settings`

**Expected:**
- ✅ Redirected to `/login`
- ✅ No flash of settings content

---

#### Test Case 5.3.2: Login Pages Redirect Authenticated Users

**Test A: Access / (landing) while logged in**

1. **Sign in** using email OTP or Google
2. Navigate to: `http://localhost:3000/`

**Expected:**
- ✅ Immediately redirected to `/app`
- ✅ No flash of landing page content

**Test B: Access /login while logged in**

1. **Ensure logged in**
2. Navigate to: `http://localhost:3000/login`

**Expected:**
- ✅ Redirected to `/app`
- ✅ No flash of login form

**Test C: Access /login/code while logged in**

1. **Ensure logged in**
2. Navigate to: `http://localhost:3000/login/code?email=test@example.com`

**Expected:**
- ✅ Redirected to `/app`
- ✅ No flash of OTP verification form

---

### Step 5.4: Navigation & UI Testing

#### Test Case 5.4.1: Tab Navigation

**Steps:**

1. **Sign in and land on /app (dashboard)**
2. Verify "Dashboard" tab is highlighted (primary color + underline)
3. Click "Settings" tab

**Expected:**
- ✅ Navigated to `/app/settings`
- ✅ "Settings" tab now highlighted
- ✅ "Dashboard" tab no longer highlighted
- ✅ URL updated in browser

4. Click "Dashboard" tab

**Expected:**
- ✅ Navigated back to `/app`
- ✅ "Dashboard" tab highlighted again

5. **Direct URL access test**
   - Navigate to `/app/settings` via URL bar

**Expected:**
- ✅ "Settings" tab highlighted (not "Dashboard")
- ✅ Active state matches current route

---

#### Test Case 5.4.2: Settings Tabs

**Steps:**

1. **Navigate to /app/settings**
2. Verify default tab is "Profile"
3. Click "Account" tab

**Expected:**
- ✅ Tab content changes to Account section
- ✅ "Account" tab highlighted
- ✅ URL remains `/app/settings` (no query params)

4. Click "Security" tab

**Expected:**
- ✅ Tab content changes to Security section
- ✅ Shows authentication methods (Email OTP)
- ✅ Shows user email address

5. Click "Profile" tab

**Expected:**
- ✅ Back to Profile tab content
- ✅ Shows user name/email in form fields

---

#### Test Case 5.4.3: Account Dropdown

**Steps:**

1. **Signed in on /app**
2. Click user avatar in top-right header

**Expected:**
- ✅ Dropdown menu opens
- ✅ Shows user name (or email if no name)
- ✅ Shows user email below name
- ✅ "Dashboard" menu item visible
- ✅ "Settings" menu item visible
- ✅ "Log out" menu item visible

3. Click "Settings" in dropdown

**Expected:**
- ✅ Navigated to `/app/settings`
- ✅ Dropdown closes

4. Open dropdown again, click "Dashboard"

**Expected:**
- ✅ Navigated to `/app`
- ✅ Dropdown closes

5. Open dropdown again, click "Log out"

**Expected:**
- ✅ Redirected to `/login`
- ✅ Avatar no longer visible (logged out)
- ✅ Cannot access `/app` anymore (redirect to `/login`)

---

### Step 5.5: Logout Testing

#### Test Case 5.5.1: Logout Flow

**Steps:**

1. **Sign in** (email OTP or Google)
2. Verify session is active (`/app` accessible)
3. Click account dropdown → "Log out"

**Expected:**
- ✅ Toast notification: "Logged out successfully" (optional)
- ✅ Redirected to `/login`
- ✅ Session cleared (cookie removed)

4. **Verify logout completion:**
   - Try accessing `/app`

**Expected:**
- ✅ Redirected to `/login` (session no longer valid)

5. **Verify login page access:**
   - Visit `/login`

**Expected:**
- ✅ Login form visible (not redirected to `/app`)
- ✅ Can sign in again

---

### Step 5.6: Theme & Styling Testing

#### Test Case 5.6.1: Teal/Cyan Theme Verification

**Check these elements:**

1. **Primary buttons** (`/login` page)
   - ✅ Teal background color
   - ✅ White text
   - ✅ Hover state darkens slightly

2. **Tab navigation active state** (`/app`)
   - ✅ Active tab has teal text
   - ✅ Active tab has teal underline

3. **Logo/heading colors**
   - ✅ "Structa" logo is teal
   - ✅ Primary headings use theme colors

4. **Focus states**
   - ✅ Input fields show teal ring on focus
   - ✅ Buttons show teal ring on keyboard focus

---

#### Test Case 5.6.2: Responsive Layout

**Desktop (1920x1080):**

1. Visit all pages (`/`, `/login`, `/app`, `/app/settings`)

**Expected:**
- ✅ Content centered with max-width container
- ✅ No horizontal scroll
- ✅ Proper spacing and padding

**Tablet (768x1024):**

1. Resize browser to tablet width
2. Visit all pages

**Expected:**
- ✅ Layout adjusts appropriately
- ✅ Tab navigation remains horizontal
- ✅ Settings tabs remain horizontal
- ✅ Dashboard metrics stack (3 columns → fewer)

**Mobile (375x667):**

1. Resize browser to mobile width
2. Visit all pages

**Expected:**
- ✅ Login card takes full width (with padding)
- ✅ Dashboard metrics stack vertically (1 column)
- ✅ Tab navigation remains usable
- ✅ Account dropdown works correctly
- ✅ No text overflow

---

### Step 5.7: Edge Cases & Error Handling

#### Test Case 5.7.1: Missing Email Parameter

**Steps:**

1. Navigate directly to: `http://localhost:3000/login/code`
   (No `?email=` parameter)

**Expected:**
- ✅ Redirected to `/login` (email param validation)
- ✅ No error screen shown

---

#### Test Case 5.7.2: Invalid Email Parameter

**Steps:**

1. Navigate to: `http://localhost:3000/login/code?email=invalid`

**Expected:**
- ✅ Redirected to `/login` (email format validation)
- ✅ No error screen shown

---

#### Test Case 5.7.3: Network Errors

**Test A: OTP Send Failure**

1. **Simulate backend error** (optional: temporarily break email service)
2. Enter email on `/login` page
3. Click "Continue with Email"

**Expected:**
- ❌ Toast error: "Failed to send code. Please try again."
- ✅ User remains on `/login` page
- ✅ Can retry

**Test B: OTP Verify Failure**

1. On `/login/code` page, enter invalid code
2. Observe behavior

**Expected:**
- ❌ Toast error: "Invalid code. Please try again."
- ✅ Code input cleared
- ✅ Can enter new code

---

### Step 5.8: Browser Compatibility Testing

**Browsers to Test:**

- [ ] **Chrome/Chromium** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest, if on macOS)
- [ ] **Edge** (latest)

**Test in Each Browser:**

1. Complete email OTP flow
2. Test Google OAuth flow
3. Verify tab navigation works
4. Test logout
5. Check styling (Tailwind v4 compatibility)

**Expected:**
- ✅ All flows work identically across browsers
- ✅ No console errors
- ✅ Styling consistent

---

### Phase 5 Checklist

**Pre-Flight:**
- [ ] TypeScript compiles with no errors
- [ ] Dev server starts successfully
- [ ] Production build completes

**Email OTP Flow:**
- [ ] Email input validates correctly
- [ ] OTP code sent successfully
- [ ] Email received with 6-digit code
- [ ] OTP verification works
- [ ] Redirect to `/app` after success
- [ ] Session persists on refresh
- [ ] Invalid email shows error
- [ ] Wrong OTP code shows error

**Google OAuth Flow:**
- [ ] Google button redirects to Google
- [ ] Sign-in with Google works
- [ ] Callback returns to `/app`
- [ ] Google profile data shown
- [ ] Session persists on refresh

**Route Protection:**
- [ ] `/app` redirects to `/login` when logged out
- [ ] `/app/settings` redirects to `/login` when logged out
- [ ] `/` redirects to `/app` when logged in
- [ ] `/login` redirects to `/app` when logged in

**Navigation:**
- [ ] Dashboard/Settings tabs work
- [ ] Active tab highlighted correctly
- [ ] Settings tabs (Profile/Account/Security) work
- [ ] Account dropdown opens and closes
- [ ] Dropdown menu items navigate correctly

**Logout:**
- [ ] Logout button works
- [ ] Redirects to `/login`
- [ ] Session cleared
- [ ] Cannot access `/app` after logout

**Theme & Styling:**
- [ ] Teal colors applied throughout
- [ ] Button hover states work
- [ ] Focus rings are teal
- [ ] Responsive layout works (desktop/tablet/mobile)

**Edge Cases:**
- [ ] Missing email parameter redirects
- [ ] Invalid email parameter redirects
- [ ] Network errors show toast notifications

**Browser Compatibility:**
- [ ] Chrome works
- [ ] Firefox works
- [ ] Safari works (if available)
- [ ] Edge works

---

## Success Criteria

The implementation is considered **complete and successful** when:

### Functional Requirements

✅ **Authentication Works End-to-End**
- Email OTP flow: Send code → Verify → Redirect to app
- Google OAuth flow: Redirect → Consent → Callback → Redirect to app
- Both methods result in authenticated session

✅ **Route Protection Works**
- Unauthenticated users cannot access `/app` routes
- Authenticated users cannot access `/login` routes
- Redirects happen automatically (no manual navigation needed)

✅ **Session Management Works**
- Session persists across page refreshes
- Session cookie set with proper expiration
- Logout clears session completely

✅ **Navigation Works**
- Tab navigation highlights active route
- Settings tabs switch content correctly
- Account dropdown navigates correctly

✅ **Logout Works**
- Logout button clears session
- Redirects to login page
- User cannot access protected routes after logout

### Technical Requirements

✅ **Code Quality**
- TypeScript compiles with zero errors
- No `any` types used
- All imports resolve correctly
- No console errors in browser

✅ **Build & Deployment**
- Production build completes successfully
- No build warnings (critical)
- Bundle size reasonable (<500KB initial)

✅ **Styling & Theme**
- Tailwind v4 CSS applies correctly
- Teal/cyan theme visible throughout
- Responsive layout works on all screen sizes
- No style conflicts or missing styles

✅ **Performance**
- Page load time <2 seconds (on localhost)
- No layout shifts on route changes
- Smooth transitions and interactions

### User Experience Requirements

✅ **Error Handling**
- Invalid inputs show clear error messages
- Network errors show toast notifications
- Users can retry failed operations
- No cryptic error messages or stack traces visible

✅ **Feedback & Confirmation**
- Success toast on OTP sent
- Success toast on sign-in
- Loading states on buttons during async operations
- Clear feedback for all user actions

✅ **Accessibility (Basic)**
- Keyboard navigation works
- Focus visible on all interactive elements
- Semantic HTML used (headings, labels)
- Form labels associated with inputs

---

## Technical Decisions Log

This section documents key technical decisions made during planning and rationale.

### Decision 1: Tailwind v4 CSS-First Approach

**Decision:** Use Tailwind v4 with CSS-first configuration (no `tailwind.config.js`)

**Rationale:**
- Tailwind v4 is the future of Tailwind (current alpha/beta)
- CSS-first approach eliminates build config complexity
- OKLCH color space provides better color perception
- Better alignment with web standards

**Trade-offs:**
- ❌ Alpha/beta version may have bugs
- ❌ Less community examples/documentation
- ✅ Simpler configuration (just CSS)
- ✅ Better color accuracy
- ✅ Future-proof

**Alternatives Considered:**
- Tailwind v3 (more stable, but requires config file)
- Vanilla CSS (too much manual work)

---

### Decision 2: Better Auth Over NextAuth/Auth.js

**Decision:** Use Better Auth for authentication

**Rationale:**
- Already used in `packages/app-example` (consistency)
- Designed for modern frameworks (not Next.js-specific)
- Supports email OTP out of box
- Flexible plugin system

**Trade-offs:**
- ❌ Smaller community than NextAuth
- ❌ Less mature (fewer edge cases handled)
- ✅ Modern API design
- ✅ TanStack Start compatible
- ✅ Direct database access (no API required)

**Alternatives Considered:**
- NextAuth.js (too Next.js-focused)
- Lucia Auth (more manual setup)
- Clerk (third-party service, costs money)

---

### Decision 3: Email OTP Over Magic Links

**Decision:** Use 6-digit OTP codes instead of magic links for email authentication

**Rationale:**
- Better UX on mobile (no link clicking required)
- Easier to implement (no link expiration handling)
- Familiar pattern (similar to 2FA codes)
- Better Auth has built-in support

**Trade-offs:**
- ❌ Users must type 6 digits (slightly more friction)
- ✅ Works better on mobile
- ✅ No email client redirect issues
- ✅ Auto-submit when complete (smooth UX)

**Alternatives Considered:**
- Magic links (requires link expiration, email client compatibility)
- Password + email verification (more complex, less secure)

---

### Decision 4: Direct Database Access (Not API Layer)

**Decision:** Use direct Drizzle database access in Better Auth config

**Rationale:**
- Simpler architecture (fewer layers)
- Better performance (no HTTP round-trips)
- Auth logic already isolated in `@structa/core`
- TanStack Start supports server-side database access

**Trade-offs:**
- ❌ Tighter coupling between web and database
- ❌ Cannot easily swap database without code changes
- ✅ Faster response times
- ✅ Simpler codebase (no API duplication)
- ✅ Type safety maintained across layers

**Alternatives Considered:**
- API layer (`@structa/backend`) for all database access
- GraphQL layer (too complex for auth)

---

### Decision 5: TanStack Router Layout Routes for Protection

**Decision:** Use TanStack Router's layout route pattern (`_auth/route.tsx`) for protected routes

**Rationale:**
- Declarative route protection (via `beforeLoad` middleware)
- Shared layout (header + tabs) automatically applied
- Nested route structure (clean URL patterns)
- Type-safe route context

**Trade-offs:**
- ❌ Requires understanding of layout route concept
- ✅ Very clean code organization
- ✅ Automatic layout rendering
- ✅ Route-level auth enforcement

**Alternatives Considered:**
- HOC pattern (withAuth wrapper component)
- Context provider (requires manual checks in every component)
- Separate auth boundary component

---

### Decision 6: Placeholder Content for MVP

**Decision:** Use placeholder content for landing page and settings tabs

**Rationale:**
- Focus on proving auth works (core goal)
- Real content can be added later
- Avoids scope creep
- Faster implementation

**Trade-offs:**
- ❌ Not production-ready UI
- ✅ Faster development
- ✅ Clear focus on auth functionality
- ✅ Easy to enhance later

---

### Decision 7: Toast Notifications + Inline Errors

**Decision:** Use both toast notifications (Sonner) and inline form errors

**Rationale:**
- Toast for global feedback (OTP sent, sign-in success)
- Inline errors for form validation (email format)
- Better UX than either alone

**Trade-offs:**
- ❌ Slightly more complex error handling logic
- ✅ Clear feedback for all scenarios
- ✅ Users don't miss important messages
- ✅ Validation errors stay visible

---

## Risk Assessment

### High Priority Risks

#### Risk 1: Tailwind v4 Breaking Changes

**Probability:** Medium
**Impact:** High
**Mitigation:**
- Test thoroughly during development
- Keep fallback plan (revert to Tailwind v3 if needed)
- Document any workarounds discovered
- Monitor Tailwind v4 release notes

**Contingency:**
- If critical bugs found, downgrade to Tailwind v3:
  ```bash
  npm uninstall tailwindcss @tailwindcss/vite
  npm install -D tailwindcss@^3.4.0
  # Create tailwind.config.js
  # Update vite.config.ts
  ```

---

#### Risk 2: SST Resource Access Failures

**Probability:** Medium
**Impact:** Critical (blocks auth completely)
**Mitigation:**
- Ensure `npx sst dev` runs before starting development
- Verify SST Resources in `sst.config.ts` are deployed
- Check AWS credentials are valid
- Test Resource access early in Phase 2

**Contingency:**
- Hardcode values temporarily for development:
  ```typescript
  // TEMPORARY - Remove before production
  const baseURL = process.env.BASE_URL || "http://localhost:3000"
  const secret = process.env.AUTH_SECRET || "dev-secret-12345"
  ```

---

#### Risk 3: Better Auth Integration Issues

**Probability:** Low-Medium
**Impact:** High (core functionality)
**Mitigation:**
- Reference `packages/app-example` closely (proven working)
- Test each auth method independently (email OTP first, then OAuth)
- Check Better Auth GitHub issues for known problems
- Start with simplest config, add features incrementally

**Contingency:**
- Simplify Better Auth config (remove custom features):
  - Remove location tracking if causing issues
  - Use default session config
  - Remove custom hooks

---

### Medium Priority Risks

#### Risk 4: Google OAuth Callback URL Mismatch

**Probability:** Medium
**Impact:** Medium (Google auth doesn't work)
**Mitigation:**
- Verify SST Domain resource matches Google Cloud Console config
- Test OAuth flow in development first
- Document exact callback URL: `${Resource.Domain.platform}/api/auth/callback/google`

**Contingency:**
- Update Google Cloud Console → OAuth credentials → Authorized redirect URIs
- Add both development and production URLs

---

#### Risk 5: Session Persistence Issues

**Probability:** Low
**Impact:** Medium (users logged out frequently)
**Mitigation:**
- Use Better Auth's default session config initially
- Test session persistence early (Phase 5.2)
- Check cookie settings (secure, httpOnly, sameSite)

**Contingency:**
- Increase session `expiresIn` value
- Enable `cookieCache` to reduce database queries
- Debug cookie settings in browser DevTools

---

### Low Priority Risks

#### Risk 6: Type Errors with Drizzle Schema

**Probability:** Low
**Impact:** Low (slows development)
**Mitigation:**
- Verify `@structa/core` exports `AuthSchema` correctly
- Check Drizzle schema matches Better Auth expectations
- Use `skipLibCheck` temporarily if needed

**Contingency:**
- Cast types explicitly where needed
- Update Drizzle schema to match Better Auth's expected structure

---

#### Risk 7: Landing Page Content Iteration

**Probability:** High
**Impact:** Low (doesn't block auth)
**Mitigation:**
- Use placeholders for MVP (acknowledged in plan)
- Document that landing page is "good enough" for testing

**No contingency needed** - Landing page content is explicitly out of scope for MVP.

---

## Troubleshooting Guide

### Common Issues & Solutions

#### Issue 1: "Cannot find module '@/components'"

**Symptoms:**
- TypeScript error: `Cannot find module '@/components/ui/button'`
- Import statements underlined in red

**Solution:**
```bash
# 1. Check tsconfig.json has @/* alias
cat packages/web/tsconfig.json | grep "@/\*"
# Should show: "@/*": ["./src/*"]

# 2. Restart TypeScript server
# In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

# 3. If still broken, restart dev server
# Ctrl+C, then npm run dev
```

---

#### Issue 2: Tailwind Styles Not Applying

**Symptoms:**
- Page renders but no colors/spacing
- Elements look unstyled (Times New Roman font)

**Solution:**
```bash
# 1. Check Vite config has Tailwind plugin
cat packages/web/vite.config.ts | grep tailwindcss
# Should show: import tailwindcss from '@tailwindcss/vite'
#              tailwindcss(),

# 2. Check app.css has @import
head packages/web/src/styles/app.css
# Should show: @import "tailwindcss";

# 3. Check __root.tsx has CSS import
cat packages/web/src/routes/__root.tsx | grep app.css
# Should show: import '@/styles/app.css'

# 4. Restart dev server
npm run dev
```

---

#### Issue 3: "Resource is not defined" Error

**Symptoms:**
- Runtime error: `Resource is not defined`
- Occurs in `auth.ts` configuration

**Solution:**
```bash
# 1. Check if SST dev is running
ps aux | grep "sst dev"

# 2. If not running, start it
npx sst dev

# 3. Wait for SST to fully start (shows "Ready")

# 4. Restart web dev server
cd packages/web && npm run dev
```

---

#### Issue 4: Email OTP Not Sending

**Symptoms:**
- Click "Continue with Email" but no email received
- Toast says "Code sent!" but no email

**Solution:**
```bash
# 1. Check backend email service is configured
# Verify @structa/backend/auth/email exports sendVerificationOTP

# 2. Check SST logs for email sending errors
# (Logs from sst dev terminal)

# 3. Test email service directly (optional)
# Create test script to call sendVerificationOTP

# 4. Check spam folder
# OTP emails sometimes flagged as spam
```

---

#### Issue 5: Google OAuth "redirect_uri_mismatch" Error

**Symptoms:**
- Click "Continue with Google"
- Error page: "Error 400: redirect_uri_mismatch"

**Solution:**
```bash
# 1. Check SST Domain resource value
# In sst dev terminal, look for Domain.platform output

# 2. Go to Google Cloud Console
# APIs & Services → Credentials → OAuth 2.0 Client IDs

# 3. Add redirect URI
# Format: https://app.structa.so/api/auth/callback/google
# (Replace with your actual domain)

# 4. Save and wait 5 minutes for Google to propagate changes

# 5. Retry OAuth flow
```

---

#### Issue 6: TypeScript Errors in Shadcn Components

**Symptoms:**
- TypeScript errors in `src/components/ui/*.tsx` files
- Errors about missing types or incompatible props

**Solution:**
```bash
# 1. Re-install problematic component
npx shadcn@latest add button --overwrite

# 2. Check React version (should be ^19.0.0)
npm list react

# 3. If React version mismatch, update
npm install react@^19.0.0 react-dom@^19.0.0

# 4. Restart TypeScript server
```

---

#### Issue 7: "Missing email parameter" on /login/code

**Symptoms:**
- Redirected to `/login/code` but immediately redirected back to `/login`
- URL shows `/login/code` with no `?email=` parameter

**Solution:**
This is **expected behavior** - code page requires an email parameter.

```typescript
// In login-code-form.tsx, verify navigation includes email:
navigate({
  to: "/login/code",
  search: { email: data.email }, // MUST include this
})
```

---

#### Issue 8: Session Not Persisting on Refresh

**Symptoms:**
- Sign in successfully
- Refresh page (F5)
- Logged out / redirected to `/login`

**Solution:**
```bash
# 1. Check browser cookies
# DevTools → Application → Cookies
# Should see cookie named "better-auth.session_token"

# 2. Check cookie settings in auth.ts
# Verify session config has proper expiresIn value

# 3. Check if cookie is secure-only in HTTP context
# If developing on http://localhost, ensure cookie not secure-only

# 4. Clear browser cookies and retry sign-in
```

---

## Future Enhancements

These features are **explicitly out of scope** for this MVP but documented for future reference.

### Authentication Enhancements

1. **Email Magic Links**
   - Alternative to OTP codes
   - One-click sign-in from email
   - Requires link expiration handling

2. **Password Authentication**
   - Optional password-based login
   - Password reset flow
   - Password strength requirements

3. **Two-Factor Authentication (2FA)**
   - TOTP (Google Authenticator, Authy)
   - SMS-based OTP
   - Backup codes

4. **Additional OAuth Providers**
   - GitHub
   - Microsoft
   - Apple
   - Twitter/X

5. **Passkey Support**
   - WebAuthn integration
   - Biometric authentication
   - Passwordless + phishing-resistant

---

### User Management Features

6. **Email Change Flow**
   - Verify new email address
   - Confirm via OTP to new email
   - Update account record

7. **Account Deletion Flow**
   - Confirmation modal
   - Re-authentication required
   - Soft delete with grace period

8. **Session Management Page**
   - View all active sessions
   - See device info (IP, location, browser)
   - Revoke sessions remotely

9. **Profile Editing**
   - Update name
   - Upload avatar image
   - Change display preferences

10. **Account Settings**
    - Email preferences
    - Notification settings
    - Privacy controls

---

### Security Enhancements

11. **Rate Limiting**
    - Limit OTP requests per IP
    - Limit login attempts
    - Prevent brute force attacks

12. **CAPTCHA Integration**
    - Add to signup/login forms
    - Cloudflare Turnstile or hCaptcha
    - Reduce bot signups

13. **Security Audit Logging**
    - Log all authentication events
    - Track failed login attempts
    - Alert on suspicious activity

14. **IP Geofencing**
    - Block/allow specific countries
    - Suspicious location alerts
    - Travel mode (temporary access from new location)

---

### User Experience Improvements

15. **Onboarding Flow**
    - Welcome screen after first sign-in
    - Product tour
    - Setup checklist

16. **Landing Page Polish**
    - Professional hero section
    - Feature showcases with screenshots
    - Testimonials
    - Pricing page (if applicable)

17. **Dark Mode Toggle**
    - Switch between light/dark themes
    - Persist preference in localStorage
    - Respect system preference

18. **Mobile App Header**
    - Hamburger menu for mobile
    - Slide-out navigation drawer
    - Better touch targets

19. **Loading States & Skeletons**
    - Skeleton screens for data loading
    - Better loading indicators
    - Optimistic UI updates

20. **Error Boundaries**
    - React error boundaries for graceful failures
    - Fallback UI for errors
    - Error reporting (Sentry, LogRocket)

---

### Performance Optimizations

21. **Code Splitting**
    - Lazy load routes
    - Split vendor bundles
    - Reduce initial bundle size

22. **Image Optimization**
    - Use Next.js Image component (or equivalent)
    - WebP format
    - Lazy loading

23. **Caching Strategy**
    - Service worker for offline support
    - Cache static assets
    - Prefetch critical routes

---

### Production Readiness

24. **SEO Optimization**
    - Meta tags for all pages
    - Open Graph tags
    - Structured data

25. **Analytics Integration**
    - Google Analytics or Plausible
    - Track user flows
    - Conversion funnels

26. **Error Monitoring**
    - Sentry for error tracking
    - User session replay
    - Performance monitoring

27. **Accessibility Audit**
    - WCAG 2.1 AA compliance
    - Screen reader testing
    - Keyboard navigation improvements

28. **Internationalization (i18n)**
    - Multi-language support
    - Locale-aware date/number formatting
    - RTL language support

---

## Appendix A: File Checklist

Complete list of files to be created/modified during implementation.

### Files to Create (New)

```
packages/web/
├── components.json
├── src/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── auth-client.ts
│   │   └── utils.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login-code-form.tsx
│   │   │   ├── login-google-form.tsx
│   │   │   ├── verify-code-form.tsx
│   │   │   └── account-dropdown.tsx
│   │   ├── landing/
│   │   │   ├── navigation-bar.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   └── footer.tsx
│   │   ├── ui/ (auto-generated by Shadcn)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── sonner.tsx
│   │   │   └── separator.tsx
│   │   ├── app-header.tsx
│   │   ├── tab-navigation.tsx
│   │   └── divider.tsx
│   ├── routes/
│   │   ├── login/
│   │   │   ├── index.tsx
│   │   │   └── code.tsx
│   │   ├── _auth/
│   │   │   ├── route.tsx
│   │   │   └── app/
│   │   │       ├── index.tsx
│   │   │       └── settings.tsx
│   │   └── api/
│   │       └── auth.$.ts
```

### Files to Modify (Existing)

```
packages/web/
├── package.json (add dependencies)
├── tsconfig.json (add @/* path alias)
├── vite.config.ts (add Tailwind plugin)
├── src/
│   ├── styles/
│   │   └── app.css (replace with Tailwind v4 config)
│   └── routes/
│       ├── __root.tsx (add QueryClient + Toaster)
│       └── index.tsx (replace with landing page)
```

### Files to Delete

```
packages/web/
├── src/
│   ├── routes/
│   │   └── about.tsx
│   └── components/
│       ├── Counter.tsx
│       └── Counter.css
```

---

## Appendix B: Dependency Reference

Complete list of npm packages to install.

### Core Dependencies

```json
{
  "dependencies": {
    "better-auth": "^1.x.x",
    "@better-auth/plugin-email-otp": "^1.x.x",
    "@tanstack/react-query": "^5.x.x",
    "@tanstack/react-query-devtools": "^5.x.x",
    "react-hook-form": "^7.x.x",
    "@hookform/resolvers": "^3.x.x",
    "@radix-ui/react-avatar": "^1.x.x",
    "@radix-ui/react-dropdown-menu": "^2.x.x",
    "@radix-ui/react-dialog": "^1.x.x",
    "@radix-ui/react-scroll-area": "^1.x.x",
    "@radix-ui/react-slot": "^1.x.x",
    "@radix-ui/react-tabs": "^1.x.x",
    "@radix-ui/react-label": "^2.x.x",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x.x",
    "tailwind-merge": "^2.x.x",
    "lucide-react": "^0.x.x",
    "sonner": "^1.x.x",
    "input-otp": "^1.x.x",
    "cmdk": "^1.x.x"
  }
}
```

### Dev Dependencies

```json
{
  "devDependencies": {
    "tailwindcss": "next",
    "@tailwindcss/vite": "next"
  }
}
```

---

## Appendix C: Quick Reference

### Key Commands

```bash
# Install dependencies
npm install -D tailwindcss@next @tailwindcss/vite@next
npm install better-auth @better-auth/plugin-email-otp
npm install @tanstack/react-query @tanstack/react-query-devtools

# Install Shadcn components
npx shadcn@latest add button card input label form input-otp tabs dropdown-menu avatar sonner separator

# Development
npm run dev

# Type checking
npm run typecheck

# Build
npm run build
```

### Key Routes

| Path | Purpose | Protected? |
|------|---------|------------|
| `/` | Landing page | No (redirects if auth) |
| `/login` | Login form | No (redirects if auth) |
| `/login/code` | OTP verification | No (redirects if auth) |
| `/app` | Dashboard | Yes |
| `/app/settings` | Settings page | Yes |

### Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `LoginCodeForm` | Email OTP input | `components/auth/login-code-form.tsx` |
| `LoginGoogleForm` | Google OAuth button | `components/auth/login-google-form.tsx` |
| `VerifyCodeForm` | 6-digit OTP input | `components/auth/verify-code-form.tsx` |
| `AccountDropdown` | User menu (logout) | `components/auth/account-dropdown.tsx` |
| `AppHeader` | Protected app header | `components/app-header.tsx` |
| `TabNavigation` | Dashboard/Settings tabs | `components/tab-navigation.tsx` |

---

## Appendix D: Testing Checklist Summary

Use this as a quick reference during testing.

### Before Starting Implementation
- [ ] `npx sst dev` is running
- [ ] AWS credentials are valid
- [ ] All package dependencies installed

### Phase 1: Tailwind v4
- [ ] Teal colors render correctly
- [ ] Buttons work (hover states)
- [ ] Responsive layout (mobile/desktop)

### Phase 2: Auth Backend
- [ ] Better Auth config loads without errors
- [ ] Database connection works
- [ ] SST Resources are accessible

### Phase 3: Components
- [ ] All components render
- [ ] TypeScript compiles
- [ ] No console errors

### Phase 4: Routes
- [ ] Landing page loads
- [ ] Login page loads
- [ ] OTP verification page loads
- [ ] Protected routes work
- [ ] Redirects work correctly

### Phase 5: Integration Testing
- [ ] Email OTP flow works
- [ ] Google OAuth flow works
- [ ] Session persistence works
- [ ] Logout works
- [ ] Navigation works

---

## Appendix E: Common Patterns

### Better Auth Client Hooks

```typescript
// Get current session
const { data: session, isPending, error } = useSession()

// Get current user
const { data: user } = useUser()

// Sign in with email
await signIn.email({ email: "user@example.com" })

// Verify OTP
await signIn.emailOTP.verify({ email, code })

// Sign in with Google
await signIn.social.google()

// Sign out
await signOut()
```

### TanStack Router Navigation

```typescript
// Navigate to a route
const navigate = useNavigate()
navigate({ to: "/app/settings" })

// Navigate with search params
navigate({
  to: "/login/code",
  search: { email: "user@example.com" }
})

// Access search params
const { email } = Route.useSearch()
```

### Form Validation with React Hook Form + Zod

```typescript
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: { email: "" },
})

async function onSubmit(data: FormData) {
  try {
    // Handle submission
  } catch (error) {
    // Handle error
  }
}
```

### Toast Notifications with Sonner

```typescript
import { toast } from "sonner"

// Success toast
toast.success("Signed in successfully!")

// Error toast
toast.error("Failed to send code. Please try again.")

// Promise toast (shows loading state)
toast.promise(signIn({ email }), {
  loading: "Signing in...",
  success: "Signed in!",
  error: "Sign in failed"
})
```

---

## Conclusion

This plan provides a complete, step-by-step guide for transforming `packages/web/` from a minimal TanStack Start example into a fully authenticated application with Better Auth integration.

The implementation is broken down into 5 phases:

1. **Phase 1:** Foundation & Tailwind v4 Setup (~60 min)
2. **Phase 2:** Authentication Backend (~90 min)
3. **Phase 3:** UI Components (~120 min)
4. **Phase 4:** Routes & Protected Pages (~90 min)
5. **Phase 5:** Testing & Validation (~45 min)

**Total Estimated Time:** 4-6 hours

The plan includes:
- ✅ Detailed code examples for every file
- ✅ Complete testing checklists
- ✅ Troubleshooting guides
- ✅ Technical decisions with rationale
- ✅ Risk assessment and mitigation strategies
- ✅ Future enhancement ideas

Follow this plan linearly (Phase 1 → 2 → 3 → 4 → 5) and refer to the checklists at the end of each phase to ensure nothing is missed.

Good luck! 🚀
