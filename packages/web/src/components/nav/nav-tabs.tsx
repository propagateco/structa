import { Saving } from '@/components/ui/saving';
import { TabNav, TabNavLink, TabNavList } from '@/components/ui/tabs';

interface NavigationTabsProps {
    tabs: {
        label: string;
        link: string;
    }[];
    isSaving?: boolean;
}

export function NavigationTabs({ tabs, isSaving }: NavigationTabsProps) {
    return (
        <TabNav className="w-full h-full px-6">
            <TabNavList className="flex w-full justify-between items-center h-full">
                <div className="flex gap-2 h-10">
                    {tabs.map(tab => (
                        <TabNavLink key={tab.link} href={tab.link}>
                            {tab.label}
                        </TabNavLink>
                    ))}
                </div>
                {isSaving !== undefined && <Saving isLoading={isSaving} />}
            </TabNavList>
        </TabNav>
    );
}
