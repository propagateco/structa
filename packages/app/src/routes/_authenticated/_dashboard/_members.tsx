import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NavigationHeader } from "@/components/nav/nav-header";
import { PageContainer } from "@/components/layout/container";

export const Route = createFileRoute("/_authenticated/_dashboard/_members")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Members | Structa" }],
  }),
});

function RouteComponent() {
  return (
    <>
      <NavigationHeader />
      <PageContainer>
        <Outlet />
      </PageContainer>
    </>
  );
}