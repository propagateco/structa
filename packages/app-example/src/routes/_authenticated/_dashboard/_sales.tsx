import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NavigationHeader } from "@/components/nav/nav-header";
import { NavigationTabs } from "@/components/nav/nav-tabs";
import { PageContainer } from "@/components/layout/container";
import { useMutationState } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/_dashboard/_sales")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Sales | Structa" }],
  }),
});

const tabs = [
  {
    label: "Transactions",
    link: "/sales/transactions",
  },
  {
    label: "Pricing",
    link: "/sales/pricing",
  },
  {
    label: "Discount Codes",
    link: "/sales/discount-codes",
  },
];

function RouteComponent() {
  // Track mutation states for saving indicators
  const mutations = useMutationState({
    filters: { mutationKey: ["updatePricing"] },
  });

  // Check if any tracked mutation is pending
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
