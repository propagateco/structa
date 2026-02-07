# Markdown-Driven Content Migration

## Executive Summary
Migrate markdown rendering to TanStack Start's recommended `content-collections` approach with build-time processing, preserve existing preview/gating behavior, serve at `/guides/$slug` routes, and replace old `/resources/$slug` routes.

---

## Phase 1: Install Dependencies

### Task 1.1: Install Required Packages
```bash
npm install unified remark-parse remark-gfm remark-rehype rehype-raw rehype-slug rehype-autolink-headings rehype-stringify html-react-parser @content-collections/core @content-collections/vite
```

**Purpose**: Set up unified markdown processing pipeline and content-collections for build-time markdown handling.

**Verification**: Check `package.json` for new dependencies.

---

## Phase 2: Move Files & Create Structure

### Task 2.1: Create guides Directory
- **Create**: `packages/web/src/guides/`

### Task 2.2: Move Markdown Files
- **Move**: `packages/web/public/resources/renovation-checklist.md` → `packages/web/src/guides/renovation-checklist.md`

**Note**: If there are other markdown files in `/public/resources/`, move all of them to `/src/guides/`.

**Verification**: `ls -la /home/hking/dev/structa/packages/web/src/guides/` shows markdown files.

---

## Phase 3: Configure Build-Time Processing

### Task 3.1: Create content-collections Configuration
**Create**: `packages/web/content-collections.ts`

```typescript
import { defineCollection, defineConfig } from '@content-collections/core'
import matter from 'gray-matter'

function extractFrontMatter(content: string) {
  const { data, content: body } = matter(content)
  return { data, body }
}

const guidesPosts = defineCollection({
  name: 'posts',
  directory: './src/guides',
  include: '*.md',
  schema: (z) => ({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    author: z.string().optional(),
    publishedAt: z.string(),
    readTime: z.string().optional(),
    previewPercentage: z.number().default(30),
    coverImage: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
  transform: ({ content, ...post }) => {
    const frontMatter = extractFrontMatter(content)

    return {
      ...post,
      slug: post._meta.path.replace('.md', ''),
      content: frontMatter.body,
      ...frontMatter.data,
    }
  },
})

export default defineConfig({
  collections: [guidesPosts],
})
```

### Task 3.2: Update Vite Configuration
**Modify**: `packages/web/vite.config.ts`

**Action**: Add `contentCollections()` plugin to plugins array.

**Change**:
```typescript
plugins: [
  tailwindcss(),
  nitro(),
  tsConfigPaths({
    projects: ['./tsconfig.json'],
  }),
  viteReact(),
  tanstackStart(),
  // ADD THIS:
  contentCollections(),
]
```

---

## Phase 4: Create Markdown Processing Utilities

### Task 4.1: Create Markdown Processor
**Create**: `packages/web/src/utils/markdown.ts`

```typescript
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'

export type MarkdownHeading = {
  id: string
  text: string
  level: number
}

export type MarkdownResult = {
  markup: string
  headings: Array<MarkdownHeading>
}

export async function renderMarkdown(content: string): Promise<MarkdownResult> {
  const headings: Array<MarkdownHeading> = []

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: { className: ['anchor'] },
    })
    .use(() => (tree) => {
      const { visit } = require('unist-util-visit')
      const { toString } = require('hast-util-to-string')

      visit(tree, 'element', (node: any) => {
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
          headings.push({
            id: node.properties?.id || '',
            text: toString(node),
            level: parseInt(node.tagName.charAt(1), 10),
          })
        }
      })
    })
    .use(rehypeStringify)
    .process(content)

  return {
    markup: String(result),
    headings,
  }
}

export function getPreviewContent(content: string, percentage: number): string {
  const targetLength = Math.floor(content.length * (percentage / 100))
  let previewContent = content.slice(0, targetLength)

  const lastParagraph = Math.max(
    previewContent.lastIndexOf('\n\n'),
    previewContent.lastIndexOf('\n#'),
  )

  if (lastParagraph > targetLength * 0.5) {
    previewContent = previewContent.slice(0, lastParagraph)
  }

  return previewContent
}
```

**Note**: This replaces existing `guides-parser.ts` functionality with enhanced processing.

---

## Phase 5: Create Markdown Component

### Task 5.1: Create Markdown Renderer Component
**Create**: `packages/web/src/components/Markdown.tsx`

```typescript
import parse, { type HTMLReactParserOptions, Element, domToReact } from 'html-react-parser'
import { renderMarkdown, type MarkdownResult } from '@/utils/markdown'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

type MarkdownProps = {
  content: string
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  const [result, setResult] = useState<MarkdownResult | null>(null)

  useEffect(() => {
    renderMarkdown(content).then(setResult)
  }, [content])

  if (!result) {
    return <div className={className}>Loading...</div>
  }

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        if (domNode.name === 'a') {
          const href = domNode.attribs.href
          if (href?.startsWith('/')) {
            return (
              <Link to={href}>
                {domToReact(domNode.children, options)}
              </Link>
            )
          }
        }

        if (domNode.name === 'img') {
          return (
            <img
              {...domNode.attribs}
              loading="lazy"
              className="rounded-lg shadow-md"
            />
          )
        }
      }
    },
  }

  return <div className={className}>{parse(result.markup, options)}</div>
}
```

---

## Phase 6: Create guides Routes

### Task 6.1: Create guides Index Route
**Create**: `packages/web/src/routes/_marketing/guides/index.tsx`

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { allPosts } from 'content-collections'
import { Link } from '@tanstack/react-router'
import { TexturedSection } from '@/components/layout'

export const Route = createFileRoute('/_marketing/guides/')({
  component: guidesIndex,
})

function guidesIndex() {
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  return (
    <TexturedSection
      showTopDivider={false}
      showBottomDivider={false}
      showTopDiamonds={true}
      showGrid={false}
    >
      <div className="col-span-2 md:col-span-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">guides</h1>

        {sortedPosts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          sortedPosts.map((post) => (
            <article key={post.slug} className="mb-8 pb-8 border-b">
              <Link to="/guides/$slug" params={{ slug: post.slug }}>
                <h2 className="text-2xl font-semibold hover:underline">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {post.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  {post.readTime && <span>· {post.readTime}</span>}
                </div>
              </Link>
            </article>
          ))}
        )}
      </div>
    </TexturedSection>
  )
}
```

### Task 6.2: Create guides Post Route
**Create**: `packages/web/src/routes/_marketing/guides/$slug.tsx`

**Import all existing components**:
```typescript
import { createFileRoute, notFound } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { authClient } from '@/lib/auth-client'
import { getPublicAuth } from '@/lib/auth-server'
import { allPosts } from 'content-collections'
import { Markdown, getPreviewContent } from '@/utils/markdown'
import { Button } from '@/components/ui/button'
import {
    Drawer,
    DrawerClose,
    GatedDrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer'
import { Lock } from 'lucide-react'
import { TexturedSection } from '@/components/layout'
import { LoginAppleForm } from '@/components/auth/login-apple-form'
import { LoginCodeForm } from '@/components/auth/login-code-form'
import { LoginGoogleForm } from '@/components/auth/login-google-form'
import { Divider } from '@/components/layout/divider'
```

**Route definition**:
```typescript
export const Route = createFileRoute('/_marketing/guides/$slug')({
    beforeLoad: async () => {
        return await getPublicAuth();
    },
    loader: ({ params }) => {
        const post = allPosts.find((p) => p.slug === params.slug)
        if (!post) {
            throw notFound()
        }
        return { post };
    },
    component: guidesPost,
});
```

**Component** (preserving exact gating behavior):
```typescript
function guidesPost() {
    const { post } = Route.useLoaderData();
    const routeContext = Route.useRouteContext();
    const serverSession = routeContext?.session || null;
    const navigate = Route.useNavigate();

    const { data: clientSession } = authClient.useSession();
    const session = clientSession?.session || serverSession;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const previewEndRef = useRef<HTMLDivElement>(null);
    const justClosedRef = useRef(false);

    useEffect(() => {
        if (!drawerOpen) {
            justClosedRef.current = true;
        }
    }, [drawerOpen]);

    const canReadFullContent = !!session;
    const isPreview = !canReadFullContent && post;
    const contentToShow =
        isPreview && post
            ? getPreviewContent(post.content, post.previewPercentage || 30)
            : post?.content || '';

    useEffect(() => {
        if (!isPreview) return;

        const handleScroll = () => {
            const element = previewEndRef.current;
            if (!element || drawerOpen) return;

            const rect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const isInViewport = rect.top < viewportHeight && rect.bottom > 0;

            if (isInViewport) {
                if (justClosedRef.current) {
                    const isAboveViewport = rect.bottom < 0;
                    const isBelowViewport = rect.top > viewportHeight;

                    if (isAboveViewport || isBelowViewport) {
                        justClosedRef.current = false;
                    }
                    return;
                }

                console.log('Triggering drawer - preview end is visible');
                setDrawerOpen(true);
            }
        };

        handleScroll();

        const fallbackTimeout = setTimeout(() => {
            if (!drawerOpen) {
                console.log('Fallback timeout triggered after 30s');
                setDrawerOpen(true);
            }
        }, 30000);

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(fallbackTimeout);
        };
    }, [isPreview, drawerOpen]);

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <TexturedSection
            showTopDivider={false}
            showBottomDivider={false}
            showTopDiamonds={true}
            showGrid={false}
        >
            <div className="col-span-2 md:col-span-8">
                <header className="my-12 space-y-6">
                    {post.coverImage && (
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-64 md:h-96 object-cover rounded-lg"
                        />
                    )}

                    <h1 className="text-4xl md:text-5xl font-bold">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 text-muted-foreground">
                        <span>
                            {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                        {post.readTime && <span>· {post.readTime}</span>}
                        {isPreview && <Lock className="h-4 w-4" />}
                        <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                            Members only
                        </span>
                    </div>

                    <p className="text-xl text-muted-foreground">
                        {post.description}
                    </p>
                </header>

                <div className="prose prose-lg max-w-none">
                    {isPreview ? (
                        <div className="space-y-6">
                            <Markdown content={contentToShow} />

                            <div
                                ref={previewEndRef}
                                className="h-4 border-t-2 border-dashed border-primary/20"
                            />

                            <Drawer
                                open={drawerOpen}
                                onOpenChange={setDrawerOpen}
                            >
                                <GatedDrawerContent>
                                    <div className="px-lg mx-auto max-w-md md:max-w-xl">
                                        <DrawerHeader className="space-y-3">
                                            <DrawerTitle className="font-heading font-light text-4xl text-center">
                                                Sign up below to continue
                                                reading for free
                                            </DrawerTitle>
                                            <DrawerDescription className="text-sm text-balance text-center">
                                                By clicking continue, you agree
                                                to our{' '}
                                                <Link
                                                    to="/terms-of-service"
                                                    className="font-medium underline underline-offset-4 transition-colors duration-200 hover:text-accent"
                                                >
                                                    Terms of Service
                                                </Link>{' '}
                                                and{' '}
                                                <Link
                                                    to="/privacy-policy"
                                                    className="font-medium underline underline-offset-4 transition-colors duration-200 hover:text-accent"
                                                >
                                                    Privacy Policy
                                                </Link>
                                                .
                                            </DrawerDescription>
                                        </DrawerHeader>
                                        <DrawerFooter className="mx-auto max-w-sm md:max-w-md">
                                            <div className="flex flex-col gap-4 md:gap-5">
                                                <div className="flex flex-col gap-3">
                                                    <LoginGoogleForm />
                                                    <LoginAppleForm />
                                                </div>
                                                <Divider text="Or" />
                                                <LoginCodeForm />
                                            </div>
                                            <DrawerClose asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="text-text-muted my-3"
                                                >
                                                    Close
                                                </Button>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </div>
                                </GatedDrawerContent>
                            </Drawer>
                        </div>
                    ) : (
                        <Markdown content={contentToShow} />
                    )}
                </div>
            </div>
        </TexturedSection>
    );
}
```

---

## Phase 7: Cleanup & Migration

### Task 7.1: Remove Old Resources Routes
**Delete**: `packages/web/src/routes/_marketing/resources/$slug.tsx`

### Task 7.2: Clean Up Old Parser (Optional)
**Delete**: `packages/web/src/lib/guides-parser.ts` (or keep as reference)

### Task 7.3: Uninstall Old Package (Optional)
```bash
npm uninstall react-markdown
```

**Note**: Only do this after confirming new implementation works perfectly.

### Task 7.4: Remove Empty Public Directory
**Delete**: `packages/web/public/resources/` (if empty after moving files)

---

## Phase 8: Testing & Validation

### Task 8.1: Type Safety Check
- Verify `allPosts` is typed correctly from `content-collections`
- Ensure no TypeScript errors in new routes

### Task 8.2: Build Process Test
```bash
npm run build
```
- Verify `content-collections` processes markdown at build time
- Check for build errors

### Task 8.3: Development Mode Test
```bash
npm run dev
```
- Access `/guides` - verify index page loads
- Access `/guides/renovation-checklist` - verify post loads
- Test all markdown features: headings, links, images, lists, code blocks

### Task 8.4: Gating Behavior Test
- **Unauthenticated state**:
  - Verify preview shows correct percentage
  - Scroll to preview end - drawer should open
  - Fallback timeout (30s) should trigger if scroll doesn't work
- **Authenticated state**:
  - Login and verify full content is visible
  - Drawer should not appear

### Task 8.5: Navigation Test
- Internal links in markdown should use `Link` component
- External links should work normally
- Images should have lazy loading

### Task 8.6: SEO Verification
- Check frontmatter is accessible in route loader
- Verify meta tags can be set from post data (if implementing)

---

## Summary of Changes

### New Files Created:
1. `packages/web/content-collections.ts`
2. `packages/web/src/utils/markdown.ts`
3. `packages/web/src/components/Markdown.tsx`
4. `packages/web/src/routes/_marketing/guides/index.tsx`
5. `packages/web/src/routes/_marketing/guides/$slug.tsx`

### Files Modified:
1. `packages/web/vite.config.ts` - added `contentCollections()` plugin
2. `packages/web/package.json` - added dependencies

### Files Moved:
1. `packages/web/public/resources/*.md` → `packages/web/src/guides/*.md`

### Files Deleted:
1. `packages/web/src/routes/_marketing/resources/$slug.tsx`
2. Optionally: `packages/web/src/lib/guides-parser.ts`

---

## Verification Checklist

- [ ] Dependencies installed successfully
- [ ] Markdown files moved to `src/guides/`
- [ ] `content-collections.ts` created
- [ ] Vite config updated
- [ ] Markdown processor utility created
- [ ] Markdown component created
- [ ] guides index route created and functional
- [ ] guides post route created and functional
- [ ] Gating behavior preserved and working
- [ ] Old routes removed
- [ ] Build completes without errors
- [ ] Development mode works correctly
- [ ] All tests pass

---

## Rollback Plan

If issues arise, revert by:
1. Delete `packages/web/content-collections.ts`
2. Delete `packages/web/src/utils/markdown.ts`
3. Delete `packages/web/src/components/Markdown.tsx`
4. Delete `packages/web/src/routes/_marketing/guides/` directory
5. Restore `packages/web/src/routes/_marketing/resources/$slug.tsx` from git
6. Remove `contentCollections()` from `vite.config.ts`
7. Move markdown files back to `public/resources/`
