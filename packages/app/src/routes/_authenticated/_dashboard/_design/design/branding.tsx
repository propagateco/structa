import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import {
  Header,
  HeaderButtons,
  HeaderMain,
  HeaderSubSection,
  HeaderTitle,
} from "@/components/layout/typography";
import { Grid, Cell } from "@/components/layout/grid";
import { BrandingOverviewCard } from "@/components/design/branding-overview-card";
import { IconCard } from "@/components/design/icon-card";
import { ColourCard } from "@/components/design/colour-card";
import { LogoFontCard } from "@/components/design/logo-font-card";
import { IPhoneMockup } from "@/components/ui/mockups/ios-mockups/iphone";
import { userQueryOptions } from "@/clients/user/user.query.client";
import { brandingQueryOptions } from "@/clients/branding/branding.query.client";
import { appQueryOptions } from "@/clients/app/app.query.client";
import {
  useUpdateBrandingMutation,
  usePublishBrandingMutation,
} from "@/clients/branding/branding.mutation.client";
import {
  brandingChangesAtom,
  brandingHasChangesAtom,
  setSavingSnapshotAtom,
  clearSavedChangesAtom,
  brandingIsSavingAtom,
} from "@/state/branding";
import { useAutoSave } from "@/hooks/use-auto-save";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute(
  "/_authenticated/_dashboard/_design/design/branding",
)({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Branding | Propagate" }],
  }),
});

function RouteComponent() {
  // Use query data for all entities
  const { data: user } = useQuery(userQueryOptions);
  const { data: branding } = useQuery(brandingQueryOptions);
  const { data: app } = useQuery(appQueryOptions);

  // Use Jotai atoms for state management
  const changes = useAtomValue(brandingChangesAtom);
  const hasChanges = useAtomValue(brandingHasChangesAtom);
  const setSavingSnapshot = useSetAtom(setSavingSnapshotAtom);
  const clearSavedChanges = useSetAtom(clearSavedChangesAtom);
  const [isSavingState, setIsSavingState] = useAtom(brandingIsSavingAtom);

  const updateBrandingMutation = useUpdateBrandingMutation();
  const publishBrandingMutation = usePublishBrandingMutation();
  const { mutate, isPending } = updateBrandingMutation;

  // Auto-save functionality with snapshot-based reset to prevent race conditions
  const { isSaving } = useAutoSave({
    data: changes,
    hasChanges,
    onSave: (data) => {
      // 1. Mark save as in progress
      setIsSavingState(true);
      
      // 2. Capture snapshot of what we're saving
      setSavingSnapshot(data);

      // 3. Perform the save mutation
      mutate(data, {
        onSuccess: () => {
          // 4. Smart reset: only clear changes that were actually saved
          clearSavedChanges(data);
          setIsSavingState(false);
        },
        onError: () => {
          // 5. Clear snapshot on error to reset state
          setSavingSnapshot(null);
          setIsSavingState(false);
        },
      });
    },
    isPending: isPending || isSavingState,
    debounceMs: 3000, // Save after 3 seconds of inactivity
    enabled: true,
  });

  // Show skeleton loading state if data is not loaded yet
  if (!branding || !app || !user) {
    return (
      <>
        <Header>
          <HeaderMain>
            <HeaderTitle>Branding</HeaderTitle>
            <HeaderSubSection>
              Here is where you can edit your app name, icon and brand colours
            </HeaderSubSection>
          </HeaderMain>
          <HeaderButtons>
            <Button className="md:hidden" disabled variant="default">
              Publish
            </Button>
            <Button className="hidden md:flex" disabled variant="default">
              Publish
            </Button>
          </HeaderButtons>
        </Header>
        <Grid cols={4} size="medium">
          <Cell cols={4} colsXL={2}>
            <Skeleton className="h-full w-full" />
          </Cell>
          <Cell
            cols={2}
            colsXL={1}
            className="md:flex justify-center items-center"
          >
            <Skeleton className="h-full w-full" />
          </Cell>
          <Cell
            cols={"none"}
            colsS={2}
            colsXL={"none"}
            className="overflow-hidden"
          >
            <Skeleton className="h-full w-full" />
          </Cell>
          <Cell
            cols={"none"}
            colsXL={1}
            rows={2}
            className="hidden xl:flex overflow-hidden md:overflow-visible bg-transparent border-none items-start md:items-center"
          >
            <Skeleton className="h-[600px] w-[300px] rounded-[3rem]" />
          </Cell>
          <Cell cols={4} colsXL={2}>
            <Skeleton className="h-full w-full" />
          </Cell>
          <Cell cols={2} colsS={"none"} colsXL={1} className="overflow-hidden">
            <Skeleton className="h-full w-full" />
          </Cell>
        </Grid>
      </>
    );
  }

  const handlePublish = () => {
    // First save any pending changes if they exist
    if (hasChanges) {
      // Capture snapshot of what we're saving before publish
      const dataToSave = { ...changes };
      setSavingSnapshot(dataToSave);

      mutate(dataToSave, {
        onSuccess: () => {
          // Smart reset: only clear changes that were actually saved
          clearSavedChanges(dataToSave);
          // After saving changes, publish them
          publishBrandingMutation.mutate();
        },
        onError: () => {
          // Clear snapshot on error
          setSavingSnapshot(null);
        },
      });
    } else {
      // If no pending changes, just publish
      publishBrandingMutation.mutate();
    }
  };

  const isPublishing = publishBrandingMutation.isPending;
  
  // Determine if there are unpublished changes (following productId pattern)
  const hasUnpublishedChanges = (() => {
    if (!branding || !app) return false;
    
    // Check if branding has unpublished changes
    const brandingHasChanges = !branding.publishedAt || branding.updatedAt > branding.publishedAt;
    
    // Check if app has unpublished changes
    const appHasChanges = !app.publishedAt || app.updatedAt > app.publishedAt;
    
    return brandingHasChanges || appHasChanges;
  })();
  
  // Determine if publish is allowed (following productId pattern)
  const canPublish = 
    !isSaving &&
    !isPublishing &&
    (hasUnpublishedChanges || hasChanges);

  return (
    <>
      <Header>
        <HeaderMain>
          <HeaderTitle>Branding</HeaderTitle>
          <HeaderSubSection>
            Here is where you can edit your app name, icon and brand colours
          </HeaderSubSection>
        </HeaderMain>
        <HeaderButtons>
          <Button
            className="md:hidden"
            disabled={!canPublish}
            isLoading={isPublishing}
            variant="default"
            onClick={handlePublish}
          >
            Publish
          </Button>
          <Button
            className="hidden md:flex"
            disabled={!canPublish}
            isLoading={isPublishing}
            variant="default"
            onClick={handlePublish}
          >
            Publish
          </Button>
        </HeaderButtons>
      </Header>
      <Grid cols={4} size="medium">
        <Cell cols={4} colsXL={2}>
          <BrandingOverviewCard app={app} user={user} branding={branding} />
        </Cell>
        <Cell
          cols={2}
          colsXL={1}
          className="md:flex justify-center items-center"
        >
          <IconCard branding={branding} />
        </Cell>
        <Cell
          cols={"none"}
          colsS={2}
          colsXL={"none"}
          className="overflow-hidden"
        >
          <LogoFontCard branding={branding} />
        </Cell>
        <Cell
          cols={"none"}
          colsXL={1}
          rows={2}
          className="hidden xl:flex overflow-hidden md:overflow-visible bg-transparent border-none items-start md:items-center"
        >
          <IPhoneMockup branding={branding} app={app} />
        </Cell>
        <Cell cols={4} colsXL={2}>
          <ColourCard colours={branding.colours} />
        </Cell>
        <Cell cols={2} colsS={"none"} colsXL={1} className="overflow-hidden">
          <LogoFontCard branding={branding} />
        </Cell>
      </Grid>
    </>
  );
}
