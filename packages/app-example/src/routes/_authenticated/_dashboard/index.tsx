import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { userQueryOptions } from "@/clients/user/user.query.client";
import { PageContainer } from "@/components/layout/container";
import {
	Header,
	HeaderMain,
	HeaderSubSection,
	HeaderTitle,
} from "@/components/layout/typography";
import { NavigationHeader } from "@/components/nav/nav-header";

export const Route = createFileRoute("/_authenticated/_dashboard/")({
	component: RouteComponent,
	staticData: {
		title: "Dashboard",
	},
	head: () => ({
		meta: [{ title: "Dashboard | Structa" }],
	}),
});

function RouteComponent() {
	const userQuery = useSuspenseQuery(userQueryOptions);
	const user = userQuery.data;
	return (
		<>
			<NavigationHeader></NavigationHeader>
			<PageContainer>
				<Header>
					<HeaderMain>
						<HeaderTitle>Welcome back {user.name}!</HeaderTitle>
						<HeaderSubSection>
							Follow the getting started guides below or watch a tutorial video
							to start using Structa.
						</HeaderSubSection>
					</HeaderMain>
				</Header>
			</PageContainer>
		</>
	);
}
