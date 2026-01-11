import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Header,
  HeaderMain,
  HeaderTitle,
  HeaderSubSection,
  HeaderButtons,
} from "@/components/layout/typography";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SalesEmptyState } from "@/components/sales/SalesEmptyState";
import { PricingForm } from "@/components/sales/PricingForm";
import { JoinPagePreview } from "@/components/sales/JoinPagePreview";
import { stripeAccountQueryOptions } from "@/clients/stripe/stripe.query.client";
import { appPricingQueryOptions } from "@/clients/app/app.query.client";
import { useUpdateAppPricing } from "@/clients/stripe/stripe.mutation.client";
import { userQueryOptions } from "@/clients/user/user.query.client";
import { brandingQueryOptions } from "@/clients/branding/branding.query.client";
import { AppPricingModel } from "@core/app/app-pricing.model";
import { CURRENCY_OPTIONS } from "@core/utils/price";

export const Route = createFileRoute(
  "/_authenticated/_dashboard/_sales/sales/pricing",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<AppPricingModel.MutationClientType | null>(null);
  const [currentFormValues, setCurrentFormValues] =
    useState<AppPricingModel.MutationClientType | null>(null);

  // Use queries for data that was prefetched in loader
  const { data: userData, isLoading: isLoadingUser } = useQuery(userQueryOptions);
  const workspaceId = userData?.workspaceId;

  const { data: stripeAccount, isLoading: isLoadingStripe } = useQuery(stripeAccountQueryOptions);

  const { data: appPricing, isLoading: isLoadingAppPricing } = useQuery(appPricingQueryOptions());

  const { data: branding, isLoading: isLoadingBranding } = useQuery(brandingQueryOptions);

  const updateAppPricingMutation = useUpdateAppPricing();

  // Show loading state while data is being fetched
  if (isLoadingUser || isLoadingStripe) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  // Show empty state if Stripe is not connected
  if (!stripeAccount || !stripeAccount.connected) {
    return <SalesEmptyState />;
  }

  // Get current currency for the preview
  const currentCurrency = appPricing?.currency || "usd";
  const currencySymbol =
    CURRENCY_OPTIONS.find((c) => c.value === currentCurrency)?.symbol || "$";

  const onSubmit = (values: AppPricingModel.MutationClientType) => {
    setPendingValues(values);
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingValues || !workspaceId) return;

    updateAppPricingMutation.mutate(
      {
        ...pendingValues,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setShowConfirmDialog(false);
          setPendingValues(null);
        },
      },
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentFormValues(null); // Reset preview to saved values
  };

  const handleFormChange = (values: AppPricingModel.MutationClientType) => {
    setCurrentFormValues(values);
  };

  return (
    <>
      <Header>
        <HeaderMain>
          <HeaderTitle>Pricing</HeaderTitle>
          <HeaderSubSection>
            Set your subscription pricing for monthly, quarterly, and annual
            plans
          </HeaderSubSection>
        </HeaderMain>
        <HeaderButtons key={isEditing ? "editing" : "viewing"}>
          {!isEditing ? (
            <Button type="button" onClick={handleEdit} className="w-28">
              Edit Pricing
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateAppPricingMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                form="pricing-form"
                type="submit"
                isLoading={updateAppPricingMutation.isPending}
              >
                Save Changes
              </Button>
            </>
          )}
        </HeaderButtons>
      </Header>

      <div className="flex flex-col space-y-10">
        <PricingForm
          appPricing={appPricing}
          isEditing={isEditing}
          isPending={updateAppPricingMutation.isPending}
          onSubmit={onSubmit}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onFormChange={handleFormChange}
        />

        <JoinPagePreview
          branding={branding}
          appPricing={
            isEditing && currentFormValues ? currentFormValues : appPricing
          }
          currencySymbol={currencySymbol}
        />
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Pricing Changes</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Are you sure you want to update your pricing? This will:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Create new products and prices in your Stripe account</li>
                <li>Notify existing subscribers about the price change</li>
                <li>Apply to their next billing cycle</li>
              </ul>
              <p className="font-medium">
                This action cannot be easily undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateAppPricingMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSave}
              disabled={updateAppPricingMutation.isPending}
            >
              {updateAppPricingMutation.isPending
                ? "Updating..."
                : "Update Pricing"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
