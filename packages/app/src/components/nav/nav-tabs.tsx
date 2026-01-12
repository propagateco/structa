import { TabNav, TabNavList, TabNavLink } from "@/components/ui/tabs";
import { Saving } from "@/components/ui/saving";
import { BrandingModel } from "@core/branding/branding.model";
import { AppModel } from "@core/app/app.model";

interface NavigationTabsProps {
  tabs: {
    label: string;
    link: string;
  }[];
  isSaving?: boolean;
  isPublishing?: boolean;
  hasError?: boolean;
  branding?: BrandingModel.BrandingQueryType;
  app?: AppModel.QueryType;
}

export function NavigationTabs({ tabs, isSaving, isPublishing, hasError, branding, app }: NavigationTabsProps) {
  const showSaving = isSaving !== undefined || isPublishing !== undefined || hasError !== undefined || (branding && app);
  
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
