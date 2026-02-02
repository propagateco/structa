import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/resources')({
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Resources</h1>
      <p className="text-muted-foreground">Free renovation guides and checklists.</p>
      <p className="text-muted-foreground mt-4">Coming soon...</p>
    </div>
  );
}
