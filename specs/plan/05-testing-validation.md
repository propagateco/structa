# Phase 1.5: Testing & Validation

**Parent Phase:** 01 - Project Setup (Web & Auth)
**Status:** 📋 Ready for Implementation
**Estimated Duration:** 30-45 minutes
**Complexity:** Low (manual testing)

---

## Overview

Comprehensive testing checklist to verify all authentication flows, route protection, and UI interactions work correctly.

**This phase includes:**
- Pre-flight checks (typecheck, build, dev server)
- Testing authentication flows (Email OTP + Google OAuth)
- Testing route protection (redirects work correctly)
- Testing navigation and UI interactions
- Testing logout functionality
- Verifying theme and responsive layout
- Testing edge cases and error handling

---

## Step 5.1: Pre-Flight Checks

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

## Step 5.2: Authentication Flow Testing

### Test Case 5.2.1: Email OTP Sign-In (Happy Path)

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

### Test Case 5.2.2: Email OTP Sign-In (Error Cases)

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

### Test Case 5.2.3: Google OAuth Sign-In

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

## Step 5.3: Route Protection Testing

### Test Case 5.3.1: Protected Routes Redirect Unauthenticated Users

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

### Test Case 5.3.2: Login Pages Redirect Authenticated Users

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

## Step 5.4: Navigation & UI Testing

### Test Case 5.4.1: Tab Navigation

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

### Test Case 5.4.2: Settings Tabs

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

### Test Case 5.4.3: Account Dropdown

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

## Step 5.5: Logout Testing

### Test Case 5.5.1: Logout Flow

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

## Step 5.6: Theme & Styling Testing

### Test Case 5.6.1: Teal/Cyan Theme Verification

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

### Test Case 5.6.2: Responsive Layout

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

## Step 5.7: Edge Cases & Error Handling

### Test Case 5.7.1: Missing Email Parameter

**Steps:**

1. Navigate directly to: `http://localhost:3000/login/code`
   (No `?email=` parameter)

**Expected:**
- ✅ Redirected to `/login` (email param validation)
- ✅ No error screen shown

---

### Test Case 5.7.2: Invalid Email Parameter

**Steps:**

1. Navigate to: `http://localhost:3000/login/code?email=invalid`

**Expected:**
- ✅ Redirected to `/login` (email format validation)
- ✅ No error screen shown

---

### Test Case 5.7.3: Network Errors

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

## Step 5.8: Browser Compatibility Testing

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

## Phase 1.5 Checklist

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

## Related Files

- **Previous Phase:** `specs/plan/04-routes-protected-pages.md`
- **Parent Phase Spec:** `specs/plan/01-project-setup.md` (original combined plan)
- **Master Overview:** `specs/plan/00-overview.md`

---

## Notes

This is the **final sub-phase** of Phase 01 (Project Setup). After completing this phase:

1. All authentication flows should be working correctly
2. All routes should be properly protected
3. All UI components should be functional
4. Theme and styling should be verified
5. Application should be production-ready (for MVP scope)

**Completion Checklist:**

- [ ] Phase 1.1 (Foundation & Tailwind v4) ✅ Complete
- [ ] Phase 1.2 (Authentication Backend) ✅ Complete
- [ ] Phase 1.3 (UI Components) ✅ Complete
- [ ] Phase 1.4 (Routes & Protected Pages) ✅ Complete
- [ ] Phase 1.5 (Testing & Validation) ✅ Complete

**Next Steps After Phase 01:**

1. Commit all changes with meaningful message
2. Deploy to personal stage: `npx sst deploy`
3. Begin **Phase 02: Electric SQL Integration** (per `00-overview.md`)

**Important Reminders:**

- Never run `npx sst deploy --stage dev` or `--stage production` (CI only)
- Pre-commit hook is currently disabled (as per user request)
- All code should pass TypeScript typecheck
- All functionality should be tested manually before marking complete
- Document any issues or workarounds discovered during testing
