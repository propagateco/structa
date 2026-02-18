import { Link } from '@tanstack/react-router';
import { DiagonalPatternCard } from '../layout/DiagonalPatternCard';

interface BlogPostCardProps {
    title: string;
    description: string;
    author?: string;
    publishedAt: string;
    readTime?: string;
    coverImage?: string;
    slug: string;
}

export function BlogPostCard({
    title,
    description,
    author,
    publishedAt,
    readTime: _readTime,
    coverImage,
    slug,
}: BlogPostCardProps) {
    return (
        <Link to="/guides/$slug" params={{ slug }} className="block h-full">
            <DiagonalPatternCard className="flex flex-col border-0">
                {/* Inner content with solid background */}
                <div className="flex flex-col h-full bg-background rounded-md">
                    {coverImage && (
                        <div className="relative shrink-0 h-52 overflow-hidden rounded-t-md">
                            <img
                                src={`${coverImage}-light.webp`}
                                alt={title}
                                className="object-cover w-full h-full dark:hidden"
                            />
                            <img
                                src={`${coverImage}-dark.webp`}
                                alt={title}
                                className="object-cover w-full h-full hidden dark:block"
                            />
                        </div>
                    )}

                    {/* Bottom Section: Content */}
                    <div className="flex flex-col flex-1 p-4">
                        <h2 className="font-serif text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-500">
                            {title}
                        </h2>

                        <p className="lg:min-h-[84px] text-muted-foreground line-clamp-3 mb-4 flex-1">
                            {description}
                        </p>

                        <div className="flex items-center gap-2 font-space-grotesk text-xs md:text-sm text-muted-foreground pt-4 border-t border-border/50">
                            <span>
                                {new Date(publishedAt).toLocaleDateString()}
                            </span>
                            {author && <span>· {author}</span>}
                        </div>
                    </div>
                </div>
            </DiagonalPatternCard>
        </Link>
    );
}
