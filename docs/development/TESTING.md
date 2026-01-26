# Testing Philosophy (TDD)

This document describes Test-Driven Development approach used in Structa monorepo.

## Contents

- [TDD Workflow](#tdd-workflow)
- [Test Organization](#test-organization)
- [Test Guidelines](#test-guidelines)
- [Related Documentation](#related-documentation)

---

## TDD Workflow

This project follows **Test-Driven Development (TDD)** principles.

When implementing new features or fixing bugs:

1. **Write the test first** – Before writing any implementation code, write a failing test that describes the expected behavior.
2. **Run the test** – Verify that it fails (red).
3. **Write minimal implementation** – Write just enough code to make the test pass.
4. **Run the test again** – Verify that it now passes (green).
5. **Refactor** – Clean up the code while keeping tests green.
6. **Repeat** – Add more tests as needed to cover edge cases and requirements.

---

## Test Organization

Tests are organized alongside source code:

```
packages/
├── core/
│   ├── src/
│   │   ├── image/
│   │   │   └── image.service.ts
│   │   └── test-setup.ts        # Global test setup
│   └── vitest.config.ts        # Vitest configuration
└── web/
    └── src/
        └── components/
            └── __tests__/       # Component tests
                └── Button.test.tsx
```

---

## Test Guidelines

- **Unit Tests**: Test pure functions, business logic, and data transformations (especially in `packages/core`).
- **Integration Tests**: Test interactions between components and modules.
- **Component Tests**: Test React components for UI behavior and user interactions.
- **Coverage**: Aim for high coverage on critical business logic and utility functions.
- **Test Isolation**: Each test should be independent and not rely on other tests.

---

## Related Documentation

| Topic | Document |
|-------|----------|
| Quality tools (test commands) | [QUALITY_TOOLS.md](./QUALITY_TOOLS.md) |
| Coding style for tests | [CODING_STYLE.md](./CODING_STYLE.md) |
| Tech stack (Vitest) | [../stack/TECH_STACK.md](../stack/TECH_STACK.md) |
