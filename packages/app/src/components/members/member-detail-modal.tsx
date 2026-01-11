import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  memberDetailsQueryOptions,
  Member,
} from "@/clients/members/members.query.client";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  DollarSign,
  ExternalLink,
  AlertCircle,
  X,
  Info,
} from "lucide-react";

interface MemberDetailModalProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemberDetailModal({
  member,
  open,
  onOpenChange,
}: MemberDetailModalProps) {
  const { data: memberDetails, isLoading } = useQuery({
    ...memberDetailsQueryOptions(member.customerId),
    enabled: open && !!member.customerId,
  });

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const getStatusBadgeProps = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, className: "bg-green-500" },
      past_due: { variant: "destructive" as const, className: "" },
      canceled: { variant: "secondary" as const, className: "" },
      trialing: { variant: "outline" as const, className: "" },
      incomplete: { variant: "outline" as const, className: "border-yellow-500 text-yellow-700" },
      unpaid: { variant: "destructive" as const, className: "" },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.canceled;
  };

  const openInStripe = () => {
    if (memberDetails?.customer.stripeCustomerId) {
      // This would need the Stripe account ID to construct the proper URL
      // For now, open general customers page
      window.open(
        `https://dashboard.stripe.com/customers/${memberDetails.customer.stripeCustomerId}`,
        "_blank"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[900px] h-[600px] max-w-none p-6">
        <DialogHeader className="relative">
          <DialogTitle className="flex items-center gap-2 pr-8">
            <User className="h-5 w-5" />
            {member.customerName || "Unnamed Customer"}
          </DialogTitle>
          <DialogClose className="absolute right-0 top-0 rounded-sm opacity-50 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-32 bg-muted animate-pulse rounded" />
            <div className="h-48 bg-muted animate-pulse rounded" />
          </div>
        ) : (
          <ScrollArea className="h-[520px]">
            <div className="space-y-3">
              {/* Customer Information */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">Customer Information</CardTitle>
                    <CardDescription className="text-xs">
                      Joined {format(new Date(member.customerCreatedAt), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openInStripe}
                    className="gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View in Stripe
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2 pt-0 px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Basic Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {memberDetails?.customer.email || "No email"}
                        </span>
                      </div>
                      
                      {memberDetails?.customer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{memberDetails.customer.phone}</span>
                        </div>
                      )}

                      {memberDetails?.customer.description && (
                        <div>
                          <p className="text-sm font-medium">Description</p>
                          <p className="text-sm text-muted-foreground">
                            {memberDetails.customer.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    {(memberDetails?.customer.addressLine1 || 
                      memberDetails?.customer.addressCity || 
                      memberDetails?.customer.addressCountry) && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Address</span>
                        </div>
                        <div className="text-sm text-muted-foreground pl-6">
                          {memberDetails?.customer.addressLine1 && (
                            <div>{memberDetails.customer.addressLine1}</div>
                          )}
                          {memberDetails?.customer.addressLine2 && (
                            <div>{memberDetails.customer.addressLine2}</div>
                          )}
                          <div>
                            {[
                              memberDetails?.customer.addressCity,
                              memberDetails?.customer.addressState,
                              memberDetails?.customer.addressPostalCode,
                            ].filter(Boolean).join(", ")}
                          </div>
                          {memberDetails?.customer.addressCountry && (
                            <div>{memberDetails.customer.addressCountry}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Indicators */}
                  <div className="flex gap-2 pt-2">
                    {member.isDelinquent && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Delinquent
                      </Badge>
                    )}
                    {memberDetails?.customer.currency && (
                      <Badge variant="outline">
                        {memberDetails.customer.currency.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Status Details */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Info className="h-3 w-3" />
                    Status Details
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Detailed subscription and payment status information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pt-0 px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Subscription Status */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Subscription Status:</span>
                        {member.subscriptionStatus ? (
                          <Badge 
                            variant={
                              member.subscriptionStatus === "active" ? "success" :
                              member.subscriptionStatus === "past_due" ? "warning" :
                              member.subscriptionStatus === "unpaid" ? "destructive" :
                              member.subscriptionStatus === "canceled" ? "destructive" :
                              member.subscriptionStatus === "trialing" ? "info" :
                              member.subscriptionStatus === "incomplete" ? "warning" : "secondary"
                            } 
                            className="capitalize"
                          >
                            {member.subscriptionStatus.replace(/_/g, " ")}
                          </Badge>
                        ) : (
                          <Badge variant="warning">Trial Ended</Badge>
                        )}
                      </div>
                      
                      {member.subscriptionAmount && member.subscriptionCurrency && (
                        <p className="text-sm text-muted-foreground">
                          Amount: {formatCurrency(member.subscriptionAmount, member.subscriptionCurrency)}
                        </p>
                      )}
                      
                      <div className="text-sm text-muted-foreground">
                        {!member.subscriptionStatus && "This customer had a trial that has ended. They need to be converted to a paid subscription."}
                        {member.subscriptionStatus === "canceled" && "This subscription was canceled and needs attention."}
                        {member.subscriptionStatus === "past_due" && "Payment is overdue but subscription is still active."}
                        {member.subscriptionStatus === "unpaid" && "Subscription is unpaid and requires immediate action."}
                        {member.subscriptionStatus === "trialing" && "Customer is currently in their free trial period."}
                        {member.subscriptionStatus === "incomplete" && "Subscription setup is not yet complete."}
                        {member.subscriptionStatus === "active" && "Subscription is active and functioning normally."}
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Payment Status:</span>
                        {member.isDelinquent ? (
                          <Badge variant="warning">Payment Failed</Badge>
                        ) : (
                          <Badge variant="success">Current</Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {member.isDelinquent ? (
                          "Recent payment attempts have failed. Update payment method or contact customer."
                        ) : (
                          "No payment issues detected."
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subscriptions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                  <CardDescription className="text-xs">
                    {memberDetails?.subscriptions.length || 0} subscription(s)
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 px-4">
                  {!memberDetails?.subscriptions.length ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <CreditCard className="mx-auto h-5 w-5 mb-1" />
                      <p className="text-xs">No subscriptions found</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {memberDetails.subscriptions.map((subscription, index) => {
                        const statusProps = getStatusBadgeProps(subscription.status);
                        
                        // Calculate total amount from subscription items
                        const totalAmount = subscription.subscriptionItems.reduce(
                          (total: number, item: any) => {
                            const itemAmount = item.price?.unit_amount || 0;
                            const quantity = item.quantity || 1;
                            return total + (itemAmount * quantity);
                          },
                          0
                        ) / 100; // Convert from cents

                        return (
                          <div key={subscription.id} className="border rounded-lg p-2">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge {...statusProps} className="capitalize">
                                    {subscription.status.replace(/_/g, " ")}
                                  </Badge>
                                  {subscription.cancelAtPeriodEnd && (
                                    <Badge variant="outline" className="text-orange-600">
                                      Canceling
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Created {format(new Date(subscription.stripeCreatedAt), "MMM d, yyyy")}
                                </p>
                              </div>
                              
                              <div className="text-right">
                                <div className="font-semibold">
                                  {formatCurrency(totalAmount, subscription.currency)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  per {subscription.subscriptionItems[0]?.price?.recurring?.interval || "month"}
                                </p>
                              </div>
                            </div>

                            {/* Subscription Items */}
                            <div className="space-y-1 mb-2">
                              {subscription.subscriptionItems.map((item: any, itemIndex: number) => (
                                <div key={itemIndex} className="flex justify-between text-sm">
                                  <span>
                                    {item.price?.product?.name || item.price?.nickname || "Unknown Product"}
                                    {item.quantity > 1 && ` × ${item.quantity}`}
                                  </span>
                                  <span>
                                    {formatCurrency((item.price?.unit_amount || 0) / 100, subscription.currency)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Billing Period */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Current period: {format(new Date(subscription.currentPeriodStart), "MMM d")} - {format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}
                              </div>
                            </div>

                            {/* Trial Info */}
                            {subscription.trialEnd && new Date(subscription.trialEnd) > new Date() && (
                              <div className="mt-2 text-sm text-blue-600">
                                Trial ends {format(new Date(subscription.trialEnd), "MMM d, yyyy")}
                              </div>
                            )}

                            {/* Cancellation Info */}
                            {subscription.canceledAt && (
                              <div className="mt-2 text-sm text-red-600">
                                Canceled {format(new Date(subscription.canceledAt), "MMM d, yyyy")}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Metadata */}
              {memberDetails?.customer.metadata && 
                Object.keys(memberDetails.customer.metadata).length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-4">
                    <div className="space-y-2">
                      {Object.entries(memberDetails.customer.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="font-medium">{key}:</span>
                          <span className="text-muted-foreground">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}