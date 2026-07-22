import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/tmp")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Replicates the Vercel trial banner from the reference GIF */}
        </div>
    );
}
