import { StripeAccountModel } from "@core/stripe/stripe-account.model";

export interface StatusInfo {
  type: "success" | "warning" | "error";
  label: string;
  detail: string;
}

/**
 * Get status info based on Stripe account state
 * This function can be reused across different components that need to display Stripe account status
 */
export const getStripeStatusInfo = (
  account: StripeAccountModel.StripeAccountConnectedResponseType,
): StatusInfo => {
  if (
    account.chargesEnabled === true &&
    account.payoutsEnabled === true &&
    account.detailsSubmitted === true
  ) {
    return {
      type: "success",
      label: "Active",
      detail: "Your Stripe account is active and ready to process payments.",
    };
  }

  if (account.detailsSubmitted === false) {
    return {
      type: "warning",
      label: "Action needed",
      detail:
        "Account details have not been submitted.\nGo to the Stripe dashboard to complete onboarding.",
    };
  }

  if (account.chargesEnabled === false || account.payoutsEnabled === false) {
    const issues = [];
    if (account.chargesEnabled === false) {
      issues.push("• Charges are disabled");
    }
    if (account.payoutsEnabled === false) {
      issues.push("• Payouts are disabled");
    }
    return {
      type: "error",
      label: "Issues detected",
      detail: `Your Stripe account has the following restrictions:\n${issues.join("\n")}\n\nPlease check your Stripe dashboard.`,
    };
  }

  return {
    type: "success",
    label: "Active",
    detail:
      "Your Stripe account is fully active and ready to process payments.",
  };
};
