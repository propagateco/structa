import {
	QueryErrorResetBoundary,
	useSuspenseQuery,
} from "@tanstack/react-query";
import {
	createFileRoute,
	Outlet,
	redirect,
	useLocation,
} from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { userQueryOptions } from "@/clients/user/user.query.client";
import { ErrorScreen } from "@/components/ui/error-screen";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { getAuth } from "@/lib/auth-server";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ location }) => {
		const session = await getAuth();

		if (!session) {
			throw redirect({ to: "/login" });
		}

		return {
			session: session.session,
			user: session.user,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="bg-background text-foreground">
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary
						fallbackRender={({ resetErrorBoundary }) => (
							<ErrorScreen className="h-screen" onRetry={resetErrorBoundary} />
						)}
						onReset={reset}
					>
						<Suspense fallback={<LoadingScreen />}>
							<AuthenticatedContent />
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</div>
	);
}

function AuthenticatedContent() {
	const location = useLocation();
	const { data: user } = useSuspenseQuery(userQueryOptions);

	// Check onboarding status client-side with fresh query data
	const isOnboardingRoute = location.pathname.startsWith("/onboarding");
	if (user.plan === null && !isOnboardingRoute) {
		throw redirect({ to: "/onboarding/profile" });
	}

	return <Outlet />;
}
