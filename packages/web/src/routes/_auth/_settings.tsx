import { useMutationState } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageContainer } from "@/components/layout/page-container";
import { NavigationTabs } from "@/components/nav/nav-tabs";

export const Route = createFileRoute("/_auth/_settings")({
	component: SettingsLayout,
	head: () => ({
		meta: [{ title: "Settings | Structa" }],
	}),
});

const tabs = [
	{
		label: "Account",
		link: "/settings/account",
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

function SettingsLayout() {
	const mutations = useMutationState({
		filters: { mutationKey: ["updateUserSettings"] },
	});

	const isPending = mutations.some((mutation) => mutation.status === "pending");

	return (
		<>
			<div className="border-b border-border">
				<NavigationTabs tabs={tabs} isSaving={isPending} />
			</div>
			<PageContainer size="narrow">
				<Outlet />
			</PageContainer>
		</>
	);
}
