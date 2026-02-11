import { Link } from '@tanstack/react-router';
import { DiagonalPattern } from './DiagonalPattern';
import { useTheme } from '../theme-provider';

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
    readTime,
    coverImage,
    slug,
}: BlogPostCardProps) {
    const { resolvedTheme } = useTheme();

    return (
        <Link
            to="/guides/$slug"
            params={{ slug }}
            className="block h-full group"
        >
            <article className="border border-border rounded-lg overflow-hidden hover:border-accent transition-colors duration-300 h-[450px] flex flex-col bg-background">
                {/* Top Section: Image or DiagonalPattern fallback */}
                <div className="relative shrink-0 h-56 overflow-hidden">
                    {coverImage ? (
                        <img
                            src={`${coverImage}${resolvedTheme === 'dark' ? '-dark' : '-light'}.webp`}
                            alt={title}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <DiagonalPattern show={true} />
                    )}
                </div>

                {/* Bottom Section: Content */}
                <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                        {title}
                    </h2>

                    <p className="text-muted-foreground line-clamp-3 mb-4 flex-1">
                        {description}
                    </p>

                    <div className="flex items-center gap-2 font-space-grotesk text-sm text-muted-foreground pt-4 border-t border-border/50">
                        <span>
                            {new Date(publishedAt).toLocaleDateString()}
                        </span>
                        {author && <span>· {author}</span>}
                    </div>
                </div>
            </article>
        </Link>
    );
}
