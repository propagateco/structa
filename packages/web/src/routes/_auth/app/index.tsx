import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "@/components/layout/page-container";
import { NavigationHeader } from "@/components/nav/navigation-header";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export const Route = createFileRoute("/_auth/app/")({
	component: DashboardComponent,
});

function DashboardComponent() {
	return (
		<>
			<NavigationHeader>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbPage>Dashboard</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</NavigationHeader>
			<PageContainer>
				<div className="grid auto-rows-min gap-4 md:grid-cols-3">
					<div className="bg-muted/50 aspect-video rounded-xl" />
					<div className="bg-muted/50 aspect-video rounded-xl" />
					<div className="bg-muted/50 aspect-video rounded-xl" />
				</div>
				<div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
			</PageContainer>
		</>
	);
}
