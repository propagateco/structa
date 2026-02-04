import { createFileRoute } from '@tanstack/react-router'
import { allPosts } from '.content-collections/generated'
import { Link } from '@tanstack/react-router'
import { TexturedSection } from '@/components/layout'

export const Route = createFileRoute('/_marketing/blog/')({
  component: BlogIndex,
})

function BlogIndex() {
  const sortedPosts = allPosts.sort(
    (a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  return (
    <TexturedSection
      showTopDivider={false}
      showBottomDivider={false}
      showTopDiamonds={true}
      showGrid={false}
    >
      <div className="col-span-2 md:col-span-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Blog</h1>

        {sortedPosts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          sortedPosts.map((post: any) => (
            <article key={post.slug} className="mb-8 pb-8 border-b">
              <Link to="/blog/$slug" params={{ slug: post.slug }}>
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
          ))
        )}
      </div>
    </TexturedSection>
  )
}
