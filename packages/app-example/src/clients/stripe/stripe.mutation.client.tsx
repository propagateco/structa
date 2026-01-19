import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AppPricingModel } from "@core/app/app-pricing.model";
import { appPricingQueryOptions } from "@/clients/app/app.query.client";
import { toast } from "sonner";

async function updateAppPricing(params: AppPricingModel.MutationClientType) {
  const res = await api.app.pricing.$put({
    json: {
      monthlyPrice: params.monthlyPrice,
      quarterlyPrice: params.quarterlyPrice,
      annualPrice: params.annualPrice,
      currency: params.currency,
    },
  });

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as any;
    throw new Error(
      errorData.error ||
        `Failed to update pricing: ${res.status} ${res.statusText}`,
    );
  }

  return await res.json();
}

export function useUpdateAppPricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updatePricing"],
    mutationFn: updateAppPricing,
    onMutate: async (newValues: AppPricingModel.MutationClientType) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({
        queryKey: appPricingQueryOptions().queryKey,
      });

      // Snapshot the previous value
      const previousPricing = queryClient.getQueryData(
        appPricingQueryOptions().queryKey,
      );

      // Optimistically update to the new value
      if (previousPricing) {
        const updated = {
          ...previousPricing,
          monthlyPrice: newValues.monthlyPrice || null,
          quarterlyPrice: newValues.quarterlyPrice || null,
          annualPrice: newValues.annualPrice || null,
          currency: newValues.currency,
          isActive: true,
          updatedAt: new Date().toISOString(),
        };

        queryClient.setQueryData(appPricingQueryOptions().queryKey, updated);
      }

      // Return a context with the previous value
      return { previousPricing };
    },
    onError: (error, context) => {
      // If the mutation fails, use the context to roll back
      if (context) {
        queryClient.setQueryData(
          appPricingQueryOptions().queryKey,
          context.previousPricing,
        );
      }
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update pricing";
      console.log(errorMessage);
      toast.error("Failed to update pricing");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({
        queryKey: appPricingQueryOptions().queryKey,
        refetchType: "all",
      });
    },
  });
}
