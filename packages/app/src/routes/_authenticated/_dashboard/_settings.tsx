import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageContainer } from "@/components/layout/container";
import { NavigationHeader } from "@/components/nav/nav-header";
import { NavigationTabs } from "@/components/nav/nav-tabs";
import { useMutationState } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/_dashboard/_settings")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Settings | Propagate" }],
  }),
});

const tabs = [
  {
    label: "Account",
    link: "/settings/account",
  },
  {
    label: "Integrations",
    link: "/settings/integrations",
  },
  {
    label: "Notifications",
    link: "/settings/notifications",
  },
  {
    label: "Billing",
    link: "/settings/billing",
  },
];

function RouteComponent() {
  const mutations = useMutationState({
    filters: { mutationKey: ["updateUserSettings"] },
  });

  const isPending = mutations.some((mutation) => mutation.status === "pending");

  return (
    <>
      <NavigationHeader>
        <NavigationTabs tabs={tabs} isSaving={isPending} />
      </NavigationHeader>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </>
  );
}
