// TODO: STUB - Replace with actual AppModel and BrandingModel from @core when available
// Currently using stub types until models are implemented

export interface AppModelStub {
	publishedAt?: string | null;
	updatedAt: string;
}

export interface BrandingModelStub {
	icon?: string | null;
	publishedAt?: string | null;
	updatedAt: string;
}

import { Saving } from "@/components/ui/saving";
import { TabNav, TabNavLink, TabNavList } from "@/components/ui/tabs";

interface NavigationTabsProps {
	tabs: {
		label: string;
		link: string;
	}[];
	isSaving?: boolean;
	isPublishing?: boolean;
	hasError?: boolean;
	branding?: BrandingModelStub;
	app?: AppModelStub;
}

export function NavigationTabs({
	tabs,
	isSaving,
	isPublishing,
	hasError,
	branding,
	app,
}: NavigationTabsProps) {
	const showSaving =
		isSaving !== undefined ||
		isPublishing !== undefined ||
		hasError !== undefined ||
		(branding && app);

	return (
		<TabNav className="w-full h-full">
			<TabNavList className="flex w-full justify-between items-center h-full">
				<div className="flex gap-2 h-10">
					{tabs.map((tab) => (
						<TabNavLink key={tab.link} href={tab.link}>
							{tab.label}
						</TabNavLink>
					))}
				</div>
				{showSaving && (
					<Saving
						isLoading={isSaving}
						isPublishing={isPublishing}
						error={hasError}
						branding={branding}
						app={app}
					/>
				)}
			</TabNavList>
		</TabNav>
	);
}
