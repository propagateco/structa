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

		// Check if this is an onboarding route
		const isOnboardingRoute = location.pathname.startsWith("/onboarding");

		// Users without a plan OR on waitlist should be on onboarding
		const needsOnboarding =
			!session.user.plan || session.user.plan === "waitlist";

		// Redirect to onboarding if needs onboarding
		if (needsOnboarding && !isOnboardingRoute) {
			throw redirect({ to: "/onboarding" });
		}

		// Redirect to app if has real plan and trying to access onboarding
		if (!needsOnboarding && isOnboardingRoute) {
			throw redirect({ to: "/app" });
		}

		return { user: session.user, session: session.session };
	},
	component: AuthLayout,
});

function AuthLayout() {
	const { user } = Route.useRouteContext();
	const pathname = useLocation({ select: (loc) => loc.pathname });

	// Onboarding routes are standalone (no sidebar)
	if (pathname.startsWith("/onboarding")) {
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
