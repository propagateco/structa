# Fonts Fix Plan

## Problem

The Lora font (and Inter Tight Variable) are not working in `packages/web/`, even though they are configured in CSS and used throughout the components.

### Root Cause

**Missing font loading links** - The fonts are never loaded from Google Fonts, so the font family names don't map to actual fonts. Browser falls back to system fonts.

| Package | Lora Loaded | Inter Tight Loaded | Space Grotesk Loaded |
|---------|-------------|-------------------|---------------------|
| `marketing-site-example` | ✅ In `index.html` | ❌ Missing | ❌ Missing (loads Geist instead) |
| `web` | ❌ Missing | ❌ Missing | ❌ Missing |

### Current State

- **CSS variables defined** in `src/styles/app.css` (lines 164-166):
  ```css
  --font-heading: 'Inter Tight Variable', 'Space Grotesk Variable', system-ui, sans-serif;
  --font-body: 'Inter Tight Variable', system-ui, sans-serif;
  --font-serif: 'Lora Variable', serif;
  ```

- **Font classes used** in components:
  - `font-heading` - for headings (`h1-h6`)
  - `font-body` - for body text
  - `font-serif` - for decorative text

- **Head content** in `src/routes/__root.tsx`:
  ```tsx
  head: () => ({
    links: [{ rel: 'stylesheet', href: appCss }],  // ❌ Missing font links
  }),
  ```

## Solution

Load the required fonts via Google Fonts in the TanStack Start `head` function.

### Fonts to Load

| Font | Source | Font Family Name | Usage |
|------|--------|------------------|-------|
| **Lora Variable** | Google Fonts | `Lora Variable` | Serif text (decorative/accents) |
| **Inter Tight Variable** | Google Fonts | `Inter Tight Variable` | Headings, body text |

### Implementation

#### Step 1: Update `src/routes/__root.tsx`

Add Google Fonts links to the `head` function:

```tsx
export const Route = createRootRoute({
  head: () => ({
    links: [
      // Preconnect for better performance
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: '' },

      // 1. Lora (Serif) - from Google Fonts
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap'
      },

      // 2. Inter Tight (Variable Sans-serif) - from Google Fonts
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
```

#### Step 2: Update CSS Variables (Optional but Recommended)

**File:** `src/styles/app.css`

**Current (lines 164-165):**
```css
--font-heading: 'Inter Tight Variable', 'Space Grotesk Variable', system-ui, sans-serif;
--font-body: 'Inter Tight Variable', system-ui, sans-serif;
```

**Updated:**
```css
--font-heading: 'Inter Tight Variable', system-ui, sans-serif;
--font-body: 'Inter Tight Variable', system-ui, sans-serif;
```

This removes dead reference to `Space Grotesk Variable` from CSS.

### Step 3: Test the Fix

Since `npx sst dev` is already running:

1. **Clear browser cache** (important for font updates):
   - Open DevTools → Application tab → Storage → Clear site data
   - Or hard refresh with `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

2. **Check Network tab** in DevTools:
   - Look for these requests:
     - `fonts.googleapis.com/css2?family=Lora...`
     - `fonts.googleapis.com/css2?family=Inter+Tight...`
     - Font file downloads (.woff2, .ttf, etc.)

3. **Verify fonts are applied**:
   - Open DevTools → Elements tab
   - Select a heading element (uses `font-heading` class)
   - Check Computed styles → `font-family`
   - Should show: `'Inter Tight Variable', system-ui, sans-serif`

4. **Test different elements**:
   - Headings (`h1-h6`) → Should use Inter Tight Variable
   - Body text → Should use Inter Tight Variable
   - Elements with `font-serif` class → Should use Lora Variable

## Font Loading Details

| Font | Source | URL Pattern | Font Family Name | Weights Loaded |
|------|--------|-------------|-----------------|----------------|
| **Lora** | Google Fonts | `family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600` | `Lora Variable` | 400, 500, 600, 700 (regular + italic) |
| **Inter Tight** | Google Fonts | `family=Inter+Tight:ital,wght@0,100..900;1,100..900` | `Inter Tight Variable` | 100-900 (variable, regular + italic) |

## Notes & Considerations

### Variable Fonts

Both **Inter Tight** and **Lora** are **variable fonts**, which means:
- A single font file contains multiple weights
- Better performance (smaller file sizes)
- More flexibility in styling

### Performance Optimization

The preconnect links (`rel="preconnect"`) improve performance by:
- Starting DNS/TCP connections early
- Reducing font loading latency
- Improving First Contentful Paint (FCP)

### Font Fallback Chain

The CSS defines a smart fallback chain:
```css
--font-heading: 'Inter Tight Variable', system-ui, sans-serif;
--font-body: 'Inter Tight Variable', system-ui, sans-serif;
--font-serif: 'Lora Variable', serif;
```

This means:
- **First attempt:** Use the variable font (if loaded)
- **Last resort:** Fall back to system fonts

## Expected Outcome

After applying this fix:
- ✅ Lora Variable will load and be available for serif text
- ✅ Inter Tight Variable will load and be used for headings and body text
- ✅ All `font-heading`, `font-body`, and `font-serif` classes will work correctly
- ✅ Font loading will be optimized with preconnect links
- ✅ Dead reference to Space Grotesk Variable will be removed from CSS

## Files Modified

1. `/home/hking/dev/structa/packages/web/src/routes/__root.tsx` - Add font links to head
2. `/home/hking/dev/structa/packages/web/src/styles/app.css` - Remove Space Grotesk from font variables (optional)
