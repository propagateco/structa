import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_marketing/about')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <main>
            <h1>About</h1>
        </main>
    );
}
