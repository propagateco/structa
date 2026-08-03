# Add View Transitions API with opt-in per-link transitions, full animation suite, and reduced motion support

**See:** [GitHub Issue #47](https://github.com/propagateco/structa/issues/47)

Status: needs-triage

## Description

Implement the View Transitions API using TanStack Router's built-in support. This will provide smooth, native-feeling page transitions with an **opt-in approach** per link, a **full suite of animation types** (slide, scale, warp/rotate), and **accessibility support** for users who prefer reduced motion.

**Reference:** [TanStack Router View Transitions Example](https://github.com/tanstack/router/tree/main/examples/react/view-transitions)

---

## Technical Approach

### 1. CSS Animations (`packages/web/src/styles/app.css`)

```css
/* ================================================
   VIEW TRANSITIONS
   ================================================ */

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
  
  /* Simple fade for reduced motion preference */
  ::view-transition-old(root) {
    animation: 150ms fade-out both;
  }
  ::view-transition-new(root) {
    animation: 150ms fade-in both;
  }
  
  @keyframes fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}

/* Default fade transition */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.25s;
}

/* Slide Left Transition */
html:active-view-transition-type(slide-left) {
  &::view-transition-old(main-content) {
    animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-out-left;
  }
  &::view-transition-new(main-content) {
    animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-in-left;
  }
}

@keyframes slide-out-left {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

@keyframes slide-in-left {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Slide Right Transition (for back navigation) */
html:active-view-transition-type(slide-right) {
  &::view-transition-old(main-content) {
    animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-out-right;
  }
  &::view-transition-new(main-content) {
    animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-in-right;
  }
}

@keyframes slide-out-right {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}

@keyframes slide-in-right {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* Scale Transition */
html:active-view-transition-type(scale) {
  &::view-transition-old(main-content) {
    animation: 350ms cubic-bezier(0.4, 0, 0.2, 1) both scale-out;
  }
  &::view-transition-new(main-content) {
    animation: 350ms cubic-bezier(0.4, 0, 0.2, 1) both scale-in;
  }
}

@keyframes scale-out {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(1.05); }
  to { opacity: 1; transform: scale(1); }
}

/* Warp/Rotate Transition */
html:active-view-transition-type(warp) {
  &::view-transition-old(main-content) {
    animation: 400ms ease-out both warp-out;
  }
  &::view-transition-new(main-content) {
    animation: 400ms ease-out both warp-in;
  }
}

@keyframes warp-out {
  from {
    opacity: 1;
    filter: blur(0) brightness(1);
    transform: scale(1) rotate(0deg);
  }
  to {
    opacity: 0;
    filter: blur(15px) brightness(1.8);
    transform: scale(1.1) rotate(90deg);
  }
}

@keyframes warp-in {
  from {
    opacity: 0;
    filter: blur(15px) brightness(1.8);
    transform: scale(0.9) rotate(-45deg);
  }
  to {
    opacity: 1;
    filter: blur(0) brightness(1);
    transform: scale(1) rotate(0deg);
  }
}

/* Shared Element: Blog Cover Image */
.blog-cover-image {
  view-transition-name: var(--vt-image-name);
  object-fit: cover;
}

::view-transition-old(blog-image-*),
::view-transition-new(blog-image-*) {
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Implementation Tasks

| # | Task | Priority | Description |
|---|------|----------|-------------|
| 1 | Add CSS transitions | **High** | Add slide, scale, warp keyframes + reduced motion support to `app.css` |
| 2 | Tracer bullet: Blog image transition | **High** | Implement shared element transition for blog cards → post header |
| 3 | Add `viewTransition` to BlogPostCard Link | **High** | Enable view transition on the card link with appropriate type |
| 4 | Add `view-transition-name` to page containers | Medium | Add `[view-transition-name:main-content]` to page wrapper elements |
| 5 | Update other navigation links (optional) | Low | Add `viewTransition` prop to other key navigation links |
| 6 | Documentation | Low | Add notes to `docs/design/UI.md` |

---

## Tracer Bullet: Blog Card Image → Post Header Transition

This demonstrates both shared element transitions (image morphing) and page transitions.

### Files to Modify:

**1. `packages/web/src/components/ui/blog-post-card.tsx`**

```tsx
export function BlogPostCard({
  title,
  description,
  author,
  publishedAt,
  readTime: _readTime,
  coverImage,
  slug,
}: BlogPostCardProps) {
  return (
    <Link
      to="/guides/$slug"
      params={{ slug }}
      className="block h-full"
      viewTransition={{ types: ['slide-left'] }}  // Enable slide transition
    >
      <DiagonalPatternCard className="flex flex-col border-0">
        <div className="flex flex-col h-full bg-background rounded-md">
          {coverImage && (
            <div
              className="relative shrink-0 h-52 overflow-hidden rounded-t-md"
              style={{ '--vt-image-name': `blog-image-${slug}` } as React.CSSProperties}
            >
              <img
                src={`${coverImage}-light.webp`}
                alt={title}
                className="object-cover w-full h-full dark:hidden blog-cover-image"
              />
              <img
                src={`${coverImage}-dark.webp`}
                alt={title}
                className="object-cover w-full h-full hidden dark:block blog-cover-image"
              />
            </div>
          )}
          {/* ... rest unchanged */}
        </div>
      </DiagonalPatternCard>
    </Link>
  );
}
```

**2. `packages/web/src/routes/_marketing/guides/$slug.tsx`**

```tsx
function BlogPost() {
  const { post } = Route.useLoaderData();
  // ... existing hooks

  return (
    <TexturedSection
      showTopDivider={false}
      showBottomDivider={false}
      showTopDiamonds={true}
      showGrid={false}
      className="[view-transition-name:main-content]"  // Add this
    >
      <div className="col-span-2 md:col-span-8">
        <header className="my-12 md:my-16 space-y-4">
          {post.coverImage && (
            <div
              className="relative w-full h-64 md:h-96"
              style={{ '--vt-image-name': `blog-image-${post.slug}` } as React.CSSProperties}
            >
              <img
                src={`${post.coverImage}${resolvedTheme === 'dark' ? '-dark' : '-light'}.webp`}
                alt={post.title}
                className="w-full h-full object-cover rounded-none blog-cover-image"
              />
              <Crosshair position="top-left" />
              <Crosshair position="bottom-right" />
            </div>
          )}
          {/* ... rest unchanged */}
        </header>
        {/* ... rest unchanged */}
      </div>
    </TexturedSection>
  );
}
```

**3. `packages/web/src/routes/_marketing/guides/index.tsx`**

```tsx
function BlogIndex() {
  // ... existing code

  return (
    <div className="grid grid-rows-[auto_auto_1fr] h-full [view-transition-name:main-content]">
      {/* ... rest unchanged */}
    </div>
  );
}
```

---

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 111+ | ✅ Full |
| Edge | 111+ | ✅ Full |
| Safari | 18+ | ✅ Full |
| Firefox | 125+ | ✅ Full |

> **Note:** Browsers without support will simply skip transitions gracefully (no visual effect, no error).

---

## Acceptance Criteria

- [ ] CSS includes slide-left, slide-right, scale, and warp/rotate transitions
- [ ] CSS includes `prefers-reduced-motion` support (simple fade fallback)
- [ ] Blog card images smoothly scale/morph into post header images (shared element transition)
- [ ] Page content slides when navigating from blog index to post
- [ ] Opt-in model: only links with `viewTransition` prop get transitions
- [ ] No visual glitches during transitions
- [ ] Graceful degradation in unsupported browsers
- [ ] Typecheck passes
- [ ] No console errors

---

## Future Enhancements (Out of Scope)

- Shared element transitions for other UI elements (cards, avatars, buttons)
- Modal slide-up transitions
- View transition debugging tools
- Per-route transition type configuration
