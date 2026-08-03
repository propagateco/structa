# packages/web

Main application package - TanStack Start frontend with shadcn/ui components.

## Adding UI Components

### From shadcn Official Registry

```bash
npx shadcn@latest add [COMPONENT]
```

Examples:
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

### From Community Registry

Check the [shadcn Registry Directory](https://ui.shadcn.com/docs/directory) first.

```bash
npx shadcn@latest add @[registry]/[component]
```

Examples:
```bash
npx shadcn@latest add @magicui/blur-fade
npx shadcn@latest add @assistant-ui/chat
```

## Best Practices

See [docs/core/design/ui.md](../../docs/core/design/ui.md) for:
- Typography guidelines
- Component patterns (cva, forwardRef, cn())
- Layout components (TexturedSection)
- Marketing vs dashboard layouts

## Component Locations

| Type | Path |
|------|------|
| shadcn components | `src/components/ui/` |
| Custom components | `src/components/` |
| Layout components | `src/components/layout/` |
