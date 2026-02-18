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
                <div className="col-span-4 md:col-span-8">
                    <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl">
                        Renovation Guides
                    </h1>
                </div>
            </GridBackgroundSection>
            <DiagonalDivider />
            <TexturedSection
                showTopDivider={false}
                showBottomDivider={false}
                showTopDiamonds={false}
                showBottomDiamonds={false}
                showGrid={true}
                className="min-h-dvh"
            >
                {sortedPosts.length === 0 ? (
                    <p className="text-muted-foreground col-span-full">
                        No guides yet.
                    </p>
                ) : (
                    sortedPosts.map((post: any) => (
                        <div
                            key={post.slug}
                            className="py-8 col-span-2 lg:col-span-2"
                            id={post.slug}
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
                    ))
                )}
            </TexturedSection>
        </div>
    );
}
