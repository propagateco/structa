import {
	createFileRoute,
	Outlet,
	redirect,
	useLocation,
} from "@tanstack/react-router";
import { AppSidebar } from "@/components/nav/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getAuth } from "@/lib/auth-server";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async ({ location }) => {
		const session = await getAuth();

		if (!session) {
			throw redirect({ to: "/login" });
		}

		// Redirect to onboarding if no plan
		if (!session.user.plan && location.pathname !== "/onboarding") {
			throw redirect({ to: "/onboarding" });
		}

		// Redirect to app if has plan and trying to access onboarding
		if (session.user.plan && location.pathname === "/onboarding") {
			throw redirect({ to: "/app" });
		}

		return { user: session.user, session: session.session };
	},
	component: AuthLayout,
});

function AuthLayout() {
	const { user } = Route.useRouteContext();
	const pathname = useLocation({ select: (loc) => loc.pathname });

	// Onboarding is standalone (no sidebar)
	if (pathname === "/onboarding") {
		return <Outlet />;
	}

	const userModel = {
		id: user.id,
		name: user.name,
		email: user.email,
		image: user.image,
		workspaceName: user.workspaceName || "My Workspace",
		plan: user.plan,
	};

	return (
		<SidebarProvider>
			<AppSidebar user={userModel} currentPathname={pathname} />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
