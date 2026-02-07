import { allPosts } from '.content-collections/generated';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
    DiagonalDivider,
    GridBackgroundSection,
    TexturedSection,
} from '@/components/layout';

export const Route = createFileRoute('/_marketing/blog/')({
    component: BlogIndex,
});

function BlogIndex() {
    const sortedPosts = allPosts.sort(
        (a: any, b: any) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
    );

    return (
        <div className="grid grid-rows-[auto_auto_1fr] h-full">
            <GridBackgroundSection
                variant="content"
                showTopDivider={false}
                showBottomDivider={false}
                showDiamonds={false}
                showGridBackground={true}
            >
                <div className="col-span-2 md:col-span-8">
                    <h1 className="font-heading text-4xl md:text-5xl mb-8">
                        Blog
                    </h1>
                </div>
            </GridBackgroundSection>
            <DiagonalDivider />
            <TexturedSection
                showTopDivider={false}
                showBottomDivider={true}
                showTopDiamonds={true}
                showGrid={true}
                className="h-full"
            >
                {sortedPosts.length === 0 ? (
                    <p className="text-muted-foreground">No posts yet.</p>
                ) : (
                    sortedPosts.map((post: any) => (
                        <article
                            key={post.slug}
                            className="col-span-1 lg:col-span-2 mb-8 py-8"
                        >
                            <Link to="/blog/$slug" params={{ slug: post.slug }}>
                                <h2 className="text-2xl font-semibold hover:underline">
                                    {post.title}
                                </h2>
                                <p className="text-muted-foreground mt-2">
                                    {post.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                                    <span>
                                        {new Date(
                                            post.publishedAt
                                        ).toLocaleDateString()}
                                    </span>
                                    {post.readTime && (
                                        <span>· {post.readTime}</span>
                                    )}
                                </div>
                            </Link>
                        </article>
                    ))
                )}
            </TexturedSection>
        </div>
    );
}
