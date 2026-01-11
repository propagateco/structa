import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DetailedDot } from "@/components/ui/dot";
import { StripeIcon } from "@/assets/icons/BrandIcons";
import { Skeleton } from "@/components/ui/skeleton";
import { stripeAccountQueryOptions } from "@/clients/stripe/stripe.query.client";
import { StripeAccountModel } from "@core/stripe/stripe-account.model";
import { getStripeStatusInfo } from "@/utils/stripe-status";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * Stripe Integration Card
 * ----------------------
 *
 * Component for managing Stripe integration.
 * Displays connection status and provides connect/disconnect functionality.
 */

export function StripeIntegrationCard() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Get live query data for reactive updates
  const { data: account, isPending } = useQuery(stripeAccountQueryOptions);

  // Helper function to check if account is connected
  const isConnected = (
    account: StripeAccountModel.StripeAccountClientResponseType,
  ): account is StripeAccountModel.StripeAccountConnectedResponseType => {
    return account?.connected === true;
  };

  // Memoize status info
  const statusInfo = useMemo(() => {
    if (account && isConnected(account)) {
      return getStripeStatusInfo(account);
    }
    return null;
  }, [account]);

  // Connect to Stripe mutation
  const connectStripeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.stripe.oauth.url.$get();
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      // Redirect to Stripe OAuth URL
      window.location.href = data.url;
    },
    onError: () => {
      setIsConnecting(false);
    },
  });

  // Disconnect Stripe mutation
  const disconnectStripeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.stripe.account.disconnect.$post();
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stripe"] });
      setIsDisconnectDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to disconnect from Stripe. Please try again.");
      console.error("Error disconnecting from Stripe:", error);
    },
  });

  // Handle connect
  const handleConnect = () => {
    setIsConnecting(true);
    connectStripeMutation.mutate();
  };

  // Handle disconnect
  const handleDisconnect = () => {
    disconnectStripeMutation.mutate();
  };

  const openStripeDashboard = () => {
    if (account && isConnected(account)) {
      window.open(
        `https://dashboard.stripe.com/connect/accounts/${account.stripeAccountId}`,
        "_blank",
      );
    }
  };

  if (isPending) {
    return <StripeIntegrationSkeleton />;
  }

  if (!account) {
    return null;
  }

  return (
    <FormItem className="flex flex-row items-center justify-between rounded-lg">
      <div className="flex flex-row items-center space-x-4">
        <StripeIcon className="size-10 rounded-sm" />
        <div className="flex flex-col">
          <FormLabel className="text-base font-semibold">Stripe</FormLabel>
          <div className="text-sm text-muted-foreground flex flex-row items-center">
            {isConnected(account)
              ? `Connected to ${account.businessName || account.email}`
              : "Connect to your Stripe account"}

            {isConnected(account) && statusInfo && (
              <>
                <Separator className="h-4 w-px mx-3" />
                <DetailedDot type={statusInfo.type} detail={statusInfo.detail}>
                  {statusInfo.label}
                </DetailedDot>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center space-x-3">
        {isConnected(account) ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={openStripeDashboard}
              className="gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Dashboard
            </Button>
            <AlertDialog
              open={isDisconnectDialogOpen}
              onOpenChange={setIsDisconnectDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  Disconnect
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Disconnect Stripe?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove your Stripe integration. You'll need to
                    reconnect through Stripe OAuth to accept payments again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDisconnect}
                    className={buttonVariants({ variant: "destructive" })}
                    asChild
                  >
                    <Button
                      variant="destructive"
                      isLoading={disconnectStripeMutation.isPending}
                    >
                      Disconnect
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <Button
            type="button"
            variant="default"
            onClick={handleConnect}
            isLoading={isConnecting}
          >
            Connect
          </Button>
        )}
      </div>
    </FormItem>
  );
}

function StripeIntegrationSkeleton() {
  return (
    <FormItem className="flex flex-row items-center justify-between rounded-lg">
      <div className="flex flex-row items-center space-x-4">
        <StripeIcon className="size-10 rounded-sm" />
        <div className="flex flex-col">
          <FormLabel className="text-base font-semibold">Stripe</FormLabel>
          <div className="text-sm text-muted-foreground flex flex-row items-center">
            <Skeleton className="h-4 w-48" />
            <Separator className="h-4 w-px mx-3" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center space-x-3">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-24" />
      </div>
    </FormItem>
  );
}
