# UI Components Guide

## Component Library: shadcn/ui

This project uses [shadcn/ui](https://ui.shadcn.com/) - a collection of reusable components built with Radix UI and Tailwind CSS.

## Adding Components

### From Official Registry

```bash
cd packages/web
npx shadcn@latest add [COMPONENT]
```

Example:
```bash
cd packages/web
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

### From Community Registry

Before creating custom components, check the [shadcn Registry Directory](https://ui.shadcn.com/docs/directory) for existing solutions.

**Process:**
1. Search the directory for your component type
2. If found, add from that registry: `npx shadcn@latest add @[registry]/[component]`
3. Only build custom if no suitable component exists

Example - Adding from community registry:
```bash
cd packages/web
npx shadcn@latest add @magicui/blur-fade
npx shadcn@latest add @aceternity/background-beams
```

### Configuration

Component config: `packages/web/components.json`
- Style: `new-york`
- Base color: `zinc`
- CSS variables enabled
- Components: `@/components/ui`

## Typography

### Font Classes

| Class | Font | Use Case |
|-------|------|----------|
| `font-heading` | Lora (serif) | Headlines, page titles |
| `font-body` | Inter Tight | Body text (default) |

### Responsive Sizing Pattern

Scale text up at larger breakpoints:

```tsx
// Headlines
<h1 className="font-heading text-4xl md:text-5xl">

// Body text
<p className="text-base sm:text-lg">

// Small text
<span className="text-sm sm:text-base">
```

### Common Utilities

| Utility | Purpose |
|---------|---------|
| `text-balance` | Balance line breaks across lines |
| `text-muted-foreground` | Secondary/gray text |
| `tracking-tight` | Tighter letter-spacing for headlines |

## Component Patterns

### Variant Pattern (cva + VariantProps)

Use `class-variance-authority` for component variants:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center", // base styles
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input bg-background",
        ghost: "hover:bg-muted",
      },
      size: {
        default: "h-9 px-4 text-sm",
        sm: "h-7 px-3 text-sm",
        lg: "h-10 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Props interface extends VariantProps
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // custom props
}
```

### forwardRef Pattern

Always forward refs for DOM access:

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
```

### cn() Class Merging

Merge variant classes with custom className:

```tsx
className={cn(buttonVariants({ variant, size, className }))}
```

### asChild Pattern (Radix Slot)

Render component as different element:

```tsx
import { Slot } from "@radix-ui/react-slot";

const Button = ({ asChild, ...props }) => {
  const Comp = asChild ? Slot : "button";
  return <Comp {...props} />;
};

// Usage: renders as Link instead of button
<Button asChild>
  <Link to="/path">Navigate</Link>
</Button>
```

### Loading State Pattern

Replace content with loader when loading:

```tsx
interface ButtonProps {
  isLoading?: boolean;
}

const Button = ({ isLoading, children, ...props }) => (
  <button disabled={isLoading} {...props}>
    {isLoading ? <LoaderIcon /> : children}
  </button>
);
```

### Group Hover Animations

Animate children on parent hover:

```tsx
// Parent has 'group' class
<div className="group hover:cursor-pointer">
  <span>Text</span>
  {/* Child animates on parent hover */}
  <ArrowRight className="transition-transform group-hover:translate-x-1" />
</div>
```

## Layout Components

### TexturedSection

Section with noise texture overlay, grid, and decorative corners.

**When to use:**
- ✅ Marketing pages (`_marketing/` routes)
- ✅ Landing pages, blog posts, guides
- ❌ Auth/dashboard pages (`_auth/` routes) - use `Card` and simple containers instead

```tsx
<TexturedSection
  showTopDivider={false}
  showBottomDivider={false}
  showTopDiamonds={true}
  showGrid={true}
  cols={2}
  mdCols={4}
  lgCols={8}
>
  {children}
</TexturedSection>
```

### Grid Column Props

| Prop | Breakpoint | Default |
|------|------------|---------|
| `cols` | Base | 2 |
| `smCols` | ≥640px | 2 |
| `mdCols` | ≥768px | 2 |
| `lgCols` | ≥1024px | 4 |
| `xlCols` | ≥1280px | (falls back to lgCols) |

### Marketing vs Auth Layout

| Page Type | Container | Typography | Background |
|-----------|-----------|------------|------------|
| Marketing | `TexturedSection` | `font-heading` | Noise texture + grid |
| Dashboard | `Card`, `div` | Default | Plain background |

## Best Practices

### Component Location
- shadcn components: `packages/web/src/components/ui/`
- Custom components: `packages/web/src/components/`

### When to Use Community Registries

| Need | Recommended Registry |
|------|---------------------|
| Animations | `@magicui`, `@motion-primitives`, `@animate-ui` |
| AI/Chat UI | `@assistant-ui`, `@prompt-kit`, `@gaia` |
| Data Grids | `@lytenyte`, `@plate` (rich text) |
| Maps | `@mapcn` |
| Charts | Built-in `chart` component |
| File Upload | `@better-upload` |
| Authentication | `@clerk` |

### Creating Custom Components

1. **Check community registries first** - avoid reinventing
2. Use existing shadcn components as building blocks
3. Follow patterns above: `cva`, `forwardRef`, `cn()`

### Common Pitfalls

- Don't install components outside `packages/web`
- Don't modify shadcn components in place - wrap them
- Don't use `TexturedSection` in dashboard/auth pages
- Don't skip the community registry check

## Useful Commands

```bash
# List available components
npx shadcn@latest

# Add multiple components
npx shadcn@latest add button dialog input

# Overwrite existing component
npx shadcn@latest add button --overwrite

# View component source before adding
npx shadcn@latest add button --dry-run
```

## Resources

- [shadcn/ui Docs](https://ui.shadcn.com/docs)
- [Registry Directory](https://ui.shadcn.com/docs/directory) - 130+ community registries
- [Radix UI Primitives](https://www.radix-ui.com/primitives) - underlying primitives
