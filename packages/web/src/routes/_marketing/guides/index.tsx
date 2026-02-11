import { allPosts } from '.content-collections/generated';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
    DiagonalDivider,
    GridBackgroundSection,
    TexturedSection,
} from '@/components/layout';
import { BlogPostCard } from '@/components/ui/blog-post-card';

export const Route = createFileRoute('/_marketing/guides/')({
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
                        Renovation Guides
                    </h1>
                </div>
            </GridBackgroundSection>
            <DiagonalDivider />
            <TexturedSection
                showTopDivider={false}
                showBottomDivider={true}
                showTopDiamonds={true}
                showGrid={true}
            >
                {sortedPosts.length === 0 ? (
                    <p className="text-muted-foreground">No guides yet.</p>
                ) : (
                    <>
                        {sortedPosts.map((post: any) => (
                            <div
                                key={post.slug}
                                className="col-span-1 lg:col-span-2 py-8"
                            >
                                <BlogPostCard
                                    title={post.title}
                                    description={post.description}
                                    author={post.author}
                                    publishedAt={post.publishedAt}
                                    readTime={post.readTime}
                                    coverImage={post.coverImage}
                                    slug={post.slug}
                                />
                            </div>
                        ))}
                    </>
                )}
            </TexturedSection>
        </div>
    );
}
