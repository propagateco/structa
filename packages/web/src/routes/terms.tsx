import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/terms')({
    component: TermsPage,
});

function TermsPage() {
    return (
        <div className="text-center space-y-4">
            <h1 className="font-heading font-medium text-2xl text-text">
                Terms of Service
            </h1>
            <p className="text-muted-foreground">Coming soon...</p>
        </div>
    );
}
