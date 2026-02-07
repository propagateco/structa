import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_marketing/onboarding')({
  component: OnboardingPage,
});

function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 text-center space-y-6">
        <h1 className="text-4xl font-bold">Full App Coming Soon</h1>

        <p className="text-xl text-muted-foreground">
          You've signed up and can access our free renovation guides, but the full Structa app is still in development.
        </p>

        <div className="p-8 bg-muted/50 border border-border rounded-lg space-y-4">
          <p className="text-muted-foreground">
            In the meantime, check out our resources:
          </p>

          <Link
            to="/guides"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Browse Resources
          </Link>
        </div>
      </div>
    </div>
  );
}
