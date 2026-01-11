import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DetailedDot } from "@/components/ui/dot";
import { AppleIcon } from "@/assets/icons/BrandIcons";
import { Skeleton } from "@/components/ui/skeleton";
import { appleAccountQueryOptions } from "@/clients/apple/apple.query.client";
import { useDisconnectAppleMutation } from "@/clients/apple/apple.mutation.client";
import { AppleModel } from "@core/apple/apple.model";
import { getAppleStatusInfo } from "@/utils/apple-status";
import { AppleWizard } from "./apple-wizard";
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
 * Apple Integration Card
 * ---------------------
 *
 * Component for managing Apple App Store Connect integration.
 * Displays connection status and provides connect/disconnect functionality.
 */

export function AppleIntegrationCard() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);

  // Get live query data for reactive updates
  const { data: account, isPending } = useQuery(appleAccountQueryOptions);

  const disconnectMutation = useDisconnectAppleMutation();

  // Helper function to check if account is connected
  const isConnected = (
    account: AppleModel.ClientResponseType,
  ): account is AppleModel.ConnectedResponseType => {
    return account?.connected === true;
  };

  // Memoize status info
  const statusInfo = useMemo(() => {
    if (account && isConnected(account)) {
      return getAppleStatusInfo(account);
    }
    return null;
  }, [account]);

  // Handle connect
  const handleConnect = () => {
    setIsWizardOpen(true);
  };

  // Handle disconnect
  const handleDisconnect = () => {
    disconnectMutation.mutate(undefined, {
      onSuccess: () => {
        setIsDisconnectDialogOpen(false);
      },
    });
  };

  const openAppleConsole = () => {
    window.open("https://appstoreconnect.apple.com", "_blank");
  };

  if (isPending) {
    return <AppleIntegrationSkeleton />;
  }

  if (!account) {
    return null;
  }

  return (
    <>
      <FormItem className="flex flex-row items-center justify-between rounded-lg">
        <div className="flex flex-row items-center space-x-4">
          <AppleIcon className="size-10 rounded-sm" />
          <div className="flex flex-col">
            <FormLabel className="text-base font-semibold">
              App Store Connect
            </FormLabel>
            <div className="text-sm text-muted-foreground flex flex-row items-center">
              {isConnected(account)
                ? `Connected${account.accountEmail ? ` to ${account.accountEmail}` : ""}`
                : "Connect to your App Store Connect account"}

              {isConnected(account) && statusInfo && (
                <>
                  <Separator className="h-4 w-px mx-3" />
                  <DetailedDot
                    type={statusInfo.type}
                    detail={statusInfo.detail}
                  >
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
                onClick={openAppleConsole}
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
                  <Button
                    type="button"
                    variant="destructive"
                    isLoading={disconnectMutation.isPending}
                  >
                    Disconnect
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Disconnect Apple App Store Connect?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove your Apple App Store Connect integration.
                      You'll need to reconnect and re-enter your API credentials
                      to use Apple features again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDisconnect} asChild>
                      <Button
                        className={buttonVariants({ variant: "destructive" })}
                        isLoading={disconnectMutation.isPending}
                      >
                        Disconnect
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <Button type="button" variant="default" onClick={handleConnect}>
              Connect
            </Button>
          )}
        </div>
      </FormItem>

      <AppleWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />
    </>
  );
}

function AppleIntegrationSkeleton() {
  return (
    <FormItem className="flex flex-row items-center justify-between rounded-lg">
      <div className="flex flex-row items-center space-x-4">
        <AppleIcon className="size-10 rounded-sm" />
        <div className="flex flex-col">
          <FormLabel className="text-base font-semibold">
            App Store Connect
          </FormLabel>
          <div className="text-sm text-muted-foreground flex flex-row items-center">
            <Skeleton className="h-4 w-56" />
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
