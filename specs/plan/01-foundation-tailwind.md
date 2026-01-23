# Phase 1.1: Foundation & Tailwind v4 Setup

**Parent Phase:** 01 - Project Setup (Web & Auth)
**Status:** 📋 Ready for Implementation
**Estimated Duration:** 45-60 minutes
**Complexity:** Medium (Tailwind v4 is different from v3)

---

## Overview

Set up Tailwind v4 with CSS-first configuration, Shadcn component library, and teal/cyan brand theme.

**This phase includes:**
- Installing core dependencies (Tailwind v4, Better Auth, TanStack Query)
- Configuring Vite for Tailwind v4
- Creating Tailwind v4 CSS configuration with OKLCH colors
- Updating TypeScript path aliases
- Creating Shadcn CLI configuration
- Installing Shadcn UI components
- Testing Tailwind v4 and teal theme

---

## Step 1.1: Install Core Dependencies

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

## Step 1.2: Configure Vite for Tailwind v4

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

## Step 1.3: Create Tailwind v4 CSS Configuration

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

## Step 1.4: Update TypeScript Path Aliases

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

## Step 1.5: Create Shadcn CLI Configuration

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

## Step 1.6: Create Utility Files

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

## Step 1.7: Install Shadcn UI Components

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

## Step 1.8: Test Tailwind v4 Setup

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

## Phase 1.1 Checklist

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

## Related Files

- **Parent Phase Spec:** `specs/plan/01-project-setup.md` (original combined plan)
- **Next Phase:** `specs/plan/02-authentication-backend.md`
- **Master Overview:** `specs/plan/00-overview.md`

---

## Notes

This is a **sub-phase** of Phase 01 (Project Setup). After completing this phase:

1. Tailwind v4 should be fully configured with teal theme
2. All required Shadcn components should be installed
3. Build system should be working correctly
4. Ready to move to **Phase 1.2: Authentication Backend**
