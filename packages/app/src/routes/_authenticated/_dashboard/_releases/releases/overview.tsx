import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
    Header,
    HeaderButtons,
    HeaderMain,
    HeaderSubSection,
    HeaderTitle,
} from "@/components/layout/typography";
import { appQueryOptions } from "@/clients/app/app.query.client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateProjectButton } from "@/components/deployment/CreateProjectButton";
import { BuildButton } from "@/components/deployment/BuildButton";

export const Route = createFileRoute(
    "/_authenticated/_dashboard/_releases/releases/overview"
)({
    component: RouteComponent,
});

function RouteComponent() {
    const {
        data: app,
        isPending: appPending,
        error: appError,
    } = useQuery(appQueryOptions);

    if (appPending) {
        return <ReleasesOverviewSkeleton />;
    }

    if (appError || !app) {
        return (
            <div className="flex items-center justify-center h-full py-16">
                <div className="text-center">
                    <p className="text-muted-foreground">No app found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Please create an app before managing releases
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header>
                <HeaderMain>
                    <HeaderTitle>{app.name}</HeaderTitle>
                    <HeaderSubSection>
                        Publish your app to the App Store, Google Play and the
                        web.
                    </HeaderSubSection>
                </HeaderMain>
                <HeaderButtons>
                    <BuildButton />
                    <Button variant="outline">Visit</Button>
                    <CreateProjectButton />
                </HeaderButtons>
            </Header>

            <div className="flex items-center justify-center h-full py-16">
                <div className="text-center">
                    <p className="text-muted-foreground">
                        Ready to release your app
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Use the Create Project button to set up your deployment
                        configuration
                    </p>
                </div>
            </div>
        </>
    );
}

function ReleasesOverviewSkeleton() {
    return (
        <>
            <Header>
                <HeaderMain>
                    <HeaderTitle>
                        <Skeleton className="h-8 w-48" />
                    </HeaderTitle>
                    <HeaderSubSection>
                        <Skeleton className="h-4 w-96" />
                    </HeaderSubSection>
                </HeaderMain>
                <HeaderButtons>
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                </HeaderButtons>
            </Header>

            <div className="flex items-center justify-center h-full py-16">
                <div className="text-center">
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-64" />
                </div>
            </div>
        </>
    );
}
