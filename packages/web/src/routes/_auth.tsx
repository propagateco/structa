import {
	createFileRoute,
	Outlet,
	redirect,
	useLocation,
} from "@tanstack/react-router";
import { AppSidebar, type SidebarUser } from "@/components/app-sidebar";
import { NavigationHeader } from "@/components/nav/navigation-header";
import { ProjectSwitcher } from "@/components/nav/project-switcher";
import ResponsiveBreadcrumbs from "@/components/nav/responsive-breadcrumbs";
import { getImageUrl } from "@/components/ui/image";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProjectSwitcherProvider } from "@/hooks/use-project-switcher";
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
	const segments = pathname.split("/").filter(Boolean);
	const crumbs = segments.map((segment, index) => {
		const path = `/${segments.slice(0, index + 1).join("/")}`;
		const title =
			segment === "app"
				? "Dashboard"
				: segment
						.replace(/-/g, " ")
						.replace(/\b\w/g, (letter) => letter.toUpperCase());
		return { title, path };
	});

	// Onboarding routes are standalone (no sidebar)
	if (pathname.startsWith("/onboarding")) {
		return <Outlet />;
	}

	const userModel: SidebarUser = {
		name: user.name,
		email: user.email,
		avatar: user.image
			? getImageUrl(user.image, "?width=400&height=400&format=webp")
			: undefined,
	};

	return (
		<ProjectSwitcherProvider>
			<SidebarProvider>
				<AppSidebar user={userModel} variant="sidebar" />
				<SidebarInset>
					<NavigationHeader>
						<ProjectSwitcher />
						<ResponsiveBreadcrumbs crumbs={crumbs} />
					</NavigationHeader>
					<Outlet />
				</SidebarInset>
			</SidebarProvider>
		</ProjectSwitcherProvider>
	);
}
