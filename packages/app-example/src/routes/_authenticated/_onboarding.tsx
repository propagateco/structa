import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_onboarding")({
    component: LayoutComponent,
    head: () => ({
        meta: [{ title: "Welcome | Structa" }],
    }),
});

function LayoutComponent() {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await authClient.signOut();
        navigate({ to: "/login" });
    };

    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <Button
                type="button"
                size="sm"
                variant="outline"
                className="absolute top-5 right-5"
                onClick={handleSignOut}
            >
                Sign Out
            </Button>
            <Outlet />
        </main>
    );
}
