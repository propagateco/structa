import {
    createFileRoute,
    useLocation,
} from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/nav/app-sidebar";
import { userQueryOptions } from "@/clients/user/user.query.client";
import { brandingQueryOptions } from "@/clients/branding/branding.query.client";
import { useQuery } from "@tanstack/react-query";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_authenticated/_dashboard")({
    component: RouteComponent,
    head: () => ({
        meta: [{ title: "Dashboard | Propagate" }],
    }),
});

function RouteComponent() {
    const userQuery = useQuery(userQueryOptions);
    const brandingQuery = useQuery(brandingQueryOptions);
    const user = userQuery.data;
    const branding = brandingQuery.data;
    const pathname = useLocation({
        select: (location) => location.pathname,
    });

    // User and branding data should already be available from the parent route
    if (!user || !branding) return null;

    return (
        <SidebarProvider>
            <AppSidebar
                user={user}
                branding={branding}
                currentPathname={pathname}
            />
            <SidebarInset>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}
