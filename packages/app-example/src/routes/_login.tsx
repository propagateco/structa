import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getLoginAuth } from "@/lib/auth-server";

export const Route = createFileRoute("/_login")({
    beforeLoad: async () => {
        await getLoginAuth();
    },
    component: LayoutComponent,
    head: () => ({
        meta: [{ title: "Login | Structa" }],
    }),
});

function LayoutComponent() {
    return (
        <div className="bg-background text-foreground">
            <Outlet />
        </div>
    );
}
