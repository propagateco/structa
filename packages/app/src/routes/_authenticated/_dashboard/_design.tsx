import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NavigationHeader } from "@/components/nav/nav-header";
import { NavigationTabs } from "@/components/nav/nav-tabs";
import { PageContainer } from "@/components/layout/container";
import { useMutationState, useQuery } from "@tanstack/react-query";
import { brandingQueryOptions } from "@/clients/branding/branding.query.client";
import { appQueryOptions } from "@/clients/app/app.query.client";

export const Route = createFileRoute("/_authenticated/_dashboard/_design")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Design | Propagate" }],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap",
      },
    ],
  }),
});

const tabs = [
  {
    label: "Branding",
    link: "/design/branding",
  },
  {
    label: "Pages",
    link: "/design/pages",
  },
  {
    label: "Layout",
    link: "/design/layout",
  },
  {
    label: "Notfications",
    link: "/design/notifications",
  },
];

function RouteComponent() {
  // Get branding and app data to check publish status
  const brandingQuery = useQuery(brandingQueryOptions);
  const appQuery = useQuery(appQueryOptions);
  
  // Track the branding update mutations
  const updateMutations = useMutationState({
    filters: { mutationKey: ['updateBranding'] },
  });
  
  // Track the branding publish mutations  
  const publishMutations = useMutationState({
    filters: { mutationKey: ['publishBranding'] },
  });
  
  // Check if any update mutation is pending
  const isSaving = updateMutations.some(mutation => mutation.status === 'pending');
  
  // Check if any publish mutation is pending
  const isPublishing = publishMutations.some(mutation => mutation.status === 'pending');
  
  // Check for any errors
  const hasError = [...updateMutations, ...publishMutations].some(
    mutation => mutation.status === 'error'
  );


  return (
    <>
      <NavigationHeader>
        <NavigationTabs 
          tabs={tabs} 
          isSaving={isSaving}
          isPublishing={isPublishing}
          hasError={hasError}
          branding={brandingQuery.data}
          app={appQuery.data}
        />
      </NavigationHeader>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </>
  );
}
