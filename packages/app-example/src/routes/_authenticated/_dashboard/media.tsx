import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "@/components/layout/container";
import {
	Header,
	HeaderMain,
	HeaderSubSection,
	HeaderTitle,
} from "@/components/layout/typography";
import { NavigationHeader } from "@/components/nav/nav-header";

export const Route = createFileRoute("/_authenticated/_dashboard/media")({
	component: RouteComponent,
	staticData: {
		title: "Media",
	},
	head: () => ({
		meta: [{ title: "Media Library | Structa" }],
	}),
});

function RouteComponent() {
	return (
		<>
			<NavigationHeader></NavigationHeader>
			<PageContainer>
				<Header>
					<HeaderMain>
						<HeaderTitle>Media Library</HeaderTitle>
						<HeaderSubSection>
							Upload and manage your media files here, from images and videos to
							documents and audio files.
						</HeaderSubSection>
					</HeaderMain>
				</Header>
			</PageContainer>
		</>
	);
}
