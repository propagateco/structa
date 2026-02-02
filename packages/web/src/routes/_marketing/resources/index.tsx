import { createFileRoute } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_marketing/resources/')({
    component: ResourcesPage,
});

function ResourcesPage() {
    return (
        <Outlet />
    );
}
