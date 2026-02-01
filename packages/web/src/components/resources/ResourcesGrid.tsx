import { Link } from '@tanstack/react-router';
import { Calendar, Clock, Lock } from 'lucide-react';

interface ResourcePostPreview {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readTime?: string;
  coverImage?: string;
  isGated: boolean;
}

interface ResourcesGridProps {
  posts: ResourcePostPreview[];
}

export function ResourcesGrid({ posts }: ResourcesGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          key={post.slug}
          to={`/resources/${post.slug}` as any}
          className="group"
        >
          <article className="border rounded-lg overflow-hidden hover:border-primary transition-colors">
            {post.coverImage && (
              <div className="aspect-video bg-muted relative">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div className="p-6 space-y-3">
              {post.isGated && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                  Members only
                </span>
              )}

              <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              <p className="text-muted-foreground line-clamp-3">
                {post.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
                {post.readTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </div>
                )}
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
