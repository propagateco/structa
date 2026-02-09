import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/blog')({
    component: BlogPage,
});

function BlogPage() {
    return (
        <div className="text-center space-y-4">
            <h1 className="font-heading font-medium text-2xl text-text">
                Blog
            </h1>
            <p className="text-muted-foreground">Coming soon...</p>
        </div>
    );
}
