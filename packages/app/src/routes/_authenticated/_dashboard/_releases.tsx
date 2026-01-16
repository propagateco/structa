import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageContainer } from "@/components/layout/container";
import { NavigationHeader } from "@/components/nav/nav-header";
import { NavigationTabs } from "@/components/nav/nav-tabs";

export const Route = createFileRoute("/_authenticated/_dashboard/_releases")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Releases | Structa" }],
  }),
});

const tabs = [
  {
    label: "Overview",
    link: "/releases/overview",
  },
  {
    label: "iOS",
    link: "/releases/ios",
  },
  {
    label: "Android",
    link: "/releases/android",
  },
  {
    label: "Web",
    link: "/releases/web",
  },
];

function RouteComponent() {
  return (
    <>
      <NavigationHeader>
        <NavigationTabs tabs={tabs} />
      </NavigationHeader>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </>
  );
}
