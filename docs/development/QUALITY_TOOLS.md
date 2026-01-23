# Quality Tools

This document describes quality assurance tools used in Structa monorepo.

## Contents

- [TypeScript Type Checking](#typescript-type-checking)
- [Biome (Linter & Formatter)](#biome-linter--formatter)
- [Vitest (Unit Testing)](#vitest-unit-testing)
- [Related Documentation](#related-documentation)

---

## TypeScript Type Checking

TypeScript is used with strict mode for type safety.

### Running Type Checks

```bash
# Typecheck all packages
npm run typecheck

# Typecheck specific packages
npm run typecheck:core    # packages/core
npm run typecheck:backend # packages/backend
npm run typecheck:app     # packages/app-example
npm run typecheck:web     # packages/web

# Typecheck individual package directly
cd packages/web && npm run typecheck
```

**Note**: Packages `core` and `backend` use SST shell for environment variables during typechecking.

---

## Biome (Linter & Formatter)

Biome is used for linting, formatting, and import organization. It's a fast, modern alternative to ESLint + Prettier.

### Configuration

Each package has its own `biome.json` configuration:
- `packages/web/biome.json`
- `packages/core/biome.json`
- `packages/backend/biome.json`

### Running Linting

```bash
# Lint all packages (check only, no changes)
npm run lint

# Lint and auto-fix issues across all packages
npm run lint:fix

# Lint specific packages
cd packages/web && npm run lint
cd packages/core && npm run lint
cd packages/backend && npm run lint
```

### Running Formatting

```bash
# Format all packages
npm run format

# Format specific packages
cd packages/web && npm run format
cd packages/core && npm run format

# Format single file (from package directory)
cd packages/web && npx biome format --write src/components/Button.tsx
```

### Running Checks (Lint + Format)

```bash
# Check all packages (lint + format check)
npm run check

# Check and auto-fix all packages
npm run check:fix

# Check single file
cd packages/web && npx biome check src/components/Button.tsx
```

### Individual File Operations

```bash
# Check a single file
cd packages/web && npx biome check src/components/Button.tsx

# Format a single file
cd packages/web && npx biome format --write src/components/Button.tsx

# Check with specific diagnostic level
npx biome check --diagnostic-level=error src/components/Header.tsx
```

---

## Vitest (Unit Testing)

Vitest is used for unit testing. It's fast and integrated with the project's TypeScript setup.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests for specific package
npm run test:core
npm run test:app
npm run test:web

# Run tests with coverage
npm run test:coverage
```

**Note**: `packages/core` uses `sst shell vitest` to provide SST environment variables during test runs.

---

## Related Documentation

| Topic | Document |
|-------|----------|
| Testing philosophy & TDD workflow | [TESTING.md](./TESTING.md) |
| Coding style (enforced by Biome) | [CODING_STYLE.md](./CODING_STYLE.md) |
| Debugging & log locations | [DEBUGGING.md](./DEBUGGING.md) |
| Git workflow (quality checks in CI) | [../workflow/GIT_WORKFLOW.md](../workflow/GIT_WORKFLOW.md) |
| Tech stack (Vitest, Biome, TypeScript) | [../stack/TECH_STACK.md](../stack/TECH_STACK.md) |
