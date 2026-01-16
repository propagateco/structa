import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { NavigationHeader } from '@/components/nav/nav-header';
import { PageContainer } from '@/components/layout/container';
import { Header, HeaderMain, HeaderTitle, HeaderSubSection } from '@/components/layout/typography';
import { userQueryOptions } from '@/clients/user/user.query.client';

export const Route = createFileRoute('/_authenticated/_dashboard/')({
	component: RouteComponent,
	staticData: {
		title: 'Dashboard',
	},
	head: () => ({
		meta: [{ title: 'Dashboard | Structa' }],
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
							Follow the getting started guides below or watch a tutorial video to
							start using Structa.
						</HeaderSubSection>
					</HeaderMain>
				</Header>
			</PageContainer>
		</>
	);
}
