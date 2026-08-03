# Phase 1.3: UI Components

**Parent Phase:** 01 - Project Setup (Web & Auth)
**Status:** 📋 Ready for Implementation
**Estimated Duration:** 90-120 minutes
**Complexity:** Medium (many files, but straightforward patterns)

---

## Overview

Create all React components needed for authentication flows, layouts, and landing page.

**This phase includes:**
- Creating authentication components (login forms, OTP input, account dropdown)
- Creating layout components (app header, tab navigation, dividers)
- Creating landing page components (navigation, hero, features, footer)
- All components use Shadcn UI primitives and teal theme

---

## Step 3.1: Create Auth Components

**Directory:** `packages/web/src/components/auth/` (new directory)

---

### Component 3.1.1: Login Code Form (Email Input)

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

### Component 3.1.2: Login Google Form (OAuth Button)

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

### Component 3.1.3: Verify Code Form (6-digit OTP Input)

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

### Component 3.1.4: Account Dropdown

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

## Step 3.2: Create Layout Components

**Directory:** `packages/web/src/components/` (root components directory)

---

### Component 3.2.1: Divider

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
───────── Or ──────────
```

---

### Component 3.2.2: App Header

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

### Component 3.2.3: Tab Navigation

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

## Step 3.3: Create Landing Page Components

**Directory:** `packages/web/src/components/landing/` (new directory)

**Note:** These are placeholder implementations focused on auth flow, not polish.

---

### Component 3.3.1: Navigation Bar

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

### Component 3.3.2: Hero

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

### Component 3.3.3: Features

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

### Component 3.3.4: Footer

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

## Prototyping interactions with Leva (dev-only)

When a task asks you to *prototype* an interaction (drawing, snapping,
gestures, canvas behaviour, tuning maths/physics constants), reach for
[Leva](https://github.com/pmndrs/leva) instead of hard-coding constants —
sweeping parameter changes instantly makes finding good ideas easy.

The plumbing already exists and is dev-only by construction (leva never ships
to prod; verified via `npm run build`):

| File | Role |
|------|------|
| `packages/web/src/components/dev/dev-leva.tsx` | Global floating `<Leva />` panel, mounted once in `routes/_auth.tsx`. Any `useControls(...)` anywhere in the tree registers into it — no per-component mounting. |
| `packages/web/src/routes/_auth/app/lab.tsx` | Dev-only sandbox route `/app/lab`. `beforeLoad` redirects to `/app` when `!import.meta.env.DEV`; scene is lazy-loaded behind the same guard. |
| `packages/web/src/lab/lab-scene.tsx` | Reference scene — copy as the starting point for a new prototype. |

### Steps when instructed to create a new prototype component

1. Build the scene at `packages/web/src/lab/<name>-scene.tsx`, modelled on
   `lab/lab-scene.tsx`; export a named component.
2. Wire it into `routes/_auth/app/lab.tsx` via a DEV-guarded lazy import. Keep
   the guard — never let `import("leva")` become statically reachable in prod.
3. Colocate `useControls` next to the interaction. Reactive values for
   React-driven UI (`useControls("Folder", {...})`); isolated
   `useCreateStore()` + `store.get("Folder.key")` for canvas/rAF loops.
4. Capture winning presets via Leva's clipboard (JSON export), then paste them
   back into code as constants.
5. Verify `npm run typecheck`, `npx biome check`, and `npm run build` (no
   `leva` chunk in `.output`).

See `packages/web/src/components/AGENTS.md` for the full do/don't list.

---

## Phase 1.3 Checklist

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
- [ ] Interaction prototypes use Leva via `dev/dev-leva.tsx` + `/app/lab` (see above)

---

## Related Files

- **Previous Phase:** `.plan/STR-003-fonts.md`
- **Next Phase:** (planned)
- **Parent Phase Spec:** `.plan/STR-001-project-setup.md`
- **Master Overview:** `.plan/index.md`

---

## Notes

This is a **sub-phase** of Phase 01 (Project Setup). After completing this phase:

1. All authentication components should be created
2. All layout components should be created
3. All landing page components should be created
4. Components should use Shadcn UI primitives
5. Components should use teal theme colors
6. Ready to move to **Phase 1.4: Routes & Protected Pages**

**Important:**
- These are placeholder implementations for MVP
- Real marketing/landing page content can be added in future phases
- Components follow consistent patterns (Shadcn, Tailwind, teal theme)
- All components are fully typed (no `any` types)
