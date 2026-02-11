## Summary

This PR implements changes for issue #25: Implement Slide-Out Auth Drawer for Blog Posts

**Branch**: 25-implement-slide-out-auth-drawer-for-blog-posts

## Changes Made

### Phase 1: Create AuthDrawer Component
- Created `components/auth/auth-drawer.tsx` with state management for view transitions
- Implemented `AuthDrawerInitialView` sub-component for social login + email form
- Implemented `AuthDrawerVerifyView` sub-component for code verification with email display
- Added fade+slide animations using Tailwind classes (300ms duration)
- Added state reset logic when drawer closes

### Phase 2: Modify Existing Auth Components
- Updated `LoginCodeForm` to add optional `onEmailSent` callback prop
- Modified `LoginCodeForm` to use callback instead of navigation when provided
- Created `VerifyCodeFormDrawer` component with back button functionality
- Implemented email context and success callback in VerifyCodeFormDrawer

### Phase 3: Refactor Guides Route
- Replaced inline drawer in `routes/_marketing/guides/$slug.tsx` with AuthDrawer usage
- Reduced complexity by 67 lines (exceeded 40-line target)
- Removed ~60 lines of inline drawer code

### Phase 4: Documentation & Examples
- Added comprehensive JSDoc comments to AuthDrawer component
- Created usage examples for other marketing pages (included in JSDoc)

### Key Features Implemented:
- Reusable `AuthDrawer` component for use across marketing pages
- Fade+slide animation between initial and verify views (300ms duration)
- Content updates automatically via auth session state (no page reload)
- Inline error handling within drawer forms (no toast notifications)
- Blog post route complexity reduced by ~67 lines

## Testing

- All existing tests pass
- Manual testing completed (animations, auth flow, state transitions verified)
- `npx sst deploy` tested on personal stage

Note: Unit tests are BLOCKED due to testing infrastructure not being set up (no @testing-library/react, no jsdom config). All core functionality is implemented and typecheck passes.

## Checklist

- [x] Code follows project coding standards
- [ ] Tests have been added/updated (BLOCKED: Testing infrastructure not set up)
- [x] Documentation updated (JSDoc comments added)
- [ ] All CI checks passing (awaiting CI)

## Related Issue

Closes #25

## Progress Log

See `specs/progress.txt` for detailed progress log.
