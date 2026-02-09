import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/privacy')({
    component: PrivacyPage,
});

function PrivacyPage() {
    return (
        <div className="text-center space-y-4">
            <h1 className="font-heading font-medium text-2xl text-text">
                Privacy Policy
            </h1>
            <p className="text-muted-foreground">Coming soon...</p>
        </div>
    );
}
