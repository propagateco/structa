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
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProjectSwitcherProvider } from "@/hooks/use-project-switcher";
import { useUser } from "@/hooks/use-user";
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
				? "Overview"
				: segment
						.replace(/-/g, " ")
						.replace(/\b\w/g, (letter) => letter.toUpperCase());
		return { title, path };
	});
	const currentTitle = crumbs.at(-1)?.title;

	// Onboarding routes are standalone (no sidebar)
	if (pathname.startsWith("/onboarding")) {
		return <Outlet />;
	}

	// Get user from Electric collection for real-time sync
	const electricUser = useUser();

	// Derive SidebarUser from electric user or fall back to auth context
	const userModel: SidebarUser = {
		name: electricUser?.name ?? user.name,
		email: electricUser?.email ?? user.email,
		avatar: electricUser?.image
			? getImageUrl(electricUser.image, "?width=400&height=400&format=webp")
			: user.image
				? getImageUrl(user.image, "?width=400&height=400&format=webp")
				: undefined,
	};

	return (
		<TooltipProvider>
			<ProjectSwitcherProvider>
				<SidebarProvider>
					<AppSidebar user={userModel} variant="sidebar" />
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
