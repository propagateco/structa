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
import { ErrorScreen } from "@/components/ui/error-screen";
import { getImageUrl } from "@/components/ui/image";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProjectSwitcherProvider } from "@/hooks/use-project-switcher";
import { useUser } from "@/hooks/use-user";
import { getAuth } from "@/lib/auth-server";

export const Route = createFileRoute("/_auth")({
	ssr: false, // Required for Electric collections
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

		return { authUser: session.user, session: session.session };
	},
	component: AuthLayout,
});

function AuthLayout() {
	const { authUser } = Route.useRouteContext();
	const pathname = useLocation({ select: (loc) => loc.pathname });

	// Call ALL hooks before any early returns to satisfy React's Rules of Hooks
	const { user, isLoading } = useUser();

	// Onboarding routes are standalone (no sidebar, no Electric)
	if (pathname.startsWith("/onboarding")) {
		return <Outlet />;
	}

	const segments = pathname.split("/").filter(Boolean);
	const crumbs = segments.map((segment, index) => {
		const path = `/${segments.slice(0, index + 1).join("/")}`;
		const title =
			segment === "app"
				? "Overview"
				: segment
						.replace(/-/g, " ")
						.replace(/\b\w/g, (letter) => letter.toUpperCase());
		return { title, path };
	});
	const currentTitle = crumbs.at(-1)?.title;

	// Show loading screen while Electric syncs
	if (isLoading) {
		return <LoadingScreen />;
	}

	// Helper to convert user to SidebarUser shape
	const toSidebarUser = (
		userData: NonNullable<typeof user> | typeof authUser,
	): SidebarUser => ({
		name: userData.name,
		email: userData.email,
		avatar: userData.image
			? getImageUrl(userData.image, "?width=400&height=400&format=webp")
			: undefined,
	});

	// Use Electric user if synced, fallback to auth user
	const displayUser = toSidebarUser(user ?? authUser);

	return (
		<TooltipProvider>
			<ProjectSwitcherProvider>
				<SidebarProvider>
					<AppSidebar user={displayUser} variant="sidebar" />
					<SidebarInset>
						<NavigationHeader title={currentTitle}>
							<ProjectSwitcher />
						</NavigationHeader>
						<Outlet />
					</SidebarInset>
				</SidebarProvider>
			</ProjectSwitcherProvider>
		</TooltipProvider>
	);
}
