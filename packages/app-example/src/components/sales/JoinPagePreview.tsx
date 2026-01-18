import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartLine, MessagesSquare, PackageOpen, Wallet } from "lucide-react";
import { BrandingQueryType } from "@structa/core/branding/branding.model";
import { Button } from "@/components/ui/button";
import { PricingCard } from "./PricingCard";
import { BenefitItem } from "./BenefitItem";

interface JoinPagePreviewProps {
  branding: BrandingQueryType;
  appPricing: any;
  currencySymbol: string;
}

export function JoinPagePreview({
  branding,
  appPricing,
  currencySymbol,
}: JoinPagePreviewProps) {
  if (!branding) {
    return null;
  }

  // Fallback pricing values when no pricing is set
  const pricing = {
    monthlyPrice: appPricing?.monthlyPrice || 0,
    quarterlyPrice: appPricing?.quarterlyPrice || 0,
    annualPrice: appPricing?.annualPrice || 0,
    currency: appPricing?.currency || "usd",
  };

  // Fallback currency symbol to USD if not provided
  const symbol = currencySymbol || "$";

  // Color mapping for better maintainability
  const colors = {
    // Backgrounds
    pageBackground: branding.colours.grey.lightBackground.formatHex(),
    cardBackground: branding.colours.grey.lightBackground.formatHex(),

    // Borders
    borderDefault: branding.colours.grey.lightGrey6.formatHex(), // lightGrey6 to lightBorder
    borderAccent: branding.colours.accent.lightAccent.formatHex(), // lightAccentLow to primary

    // Text
    primaryText: branding.colours.grey.lightForeground.formatHex(), // lightForeground to lightPrimaryText
    secondaryText: branding.colours.grey.lightGrey2.formatHex(),
    mutedText: branding.colours.grey.lightGrey3.formatHex(),

    // Accent colors
    accentPrimary: branding.colours.accent.lightAccent.formatHex(), // lightAccentLow to primary
    accentPrimaryText: branding.colours.accent.lightAccentHigh.formatHex(),
    accentHighlight: branding.colours.accent.lightAccentHigh.formatHex(),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Joining Page Preview</CardTitle>
        <CardDescription>
          This is how your subscription page will appear to users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="rounded-lg overflow-hidden border"
          style={{
            backgroundColor: colors.pageBackground,
          }}
        >
          <div className="max-w-xl mx-auto text-center">
            {/* Logo */}
            {branding.lightLargeLogo && (
              <div className="flex justify-center my-8">
                <img
                  src={branding.lightLargeLogo}
                  alt="Logo"
                  className="h-16 object-contain"
                />
              </div>
            )}

            <h2
              className="text-2xl font-semibold mb-10"
              style={{
                color: colors.primaryText,
              }}
            >
              Choose your subscription and get
              <br />
              access to all programs
            </h2>

            {/* Pricing options - Always show all three */}
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              {/* Monthly */}
              <PricingCard
                title="Monthly"
                price={`${symbol}${pricing.monthlyPrice.toFixed(2)}/mo`}
                colors={colors}
                isPopular={true}
              />

              {/* Quarterly */}
              <PricingCard
                title="Quarterly"
                price={`${symbol}${(pricing.quarterlyPrice / 3).toFixed(2)}/mo`}
                colors={colors}
                savingsPercent={
                  pricing.monthlyPrice > 0 && pricing.quarterlyPrice > 0
                    ? Math.round(
                        (1 -
                          pricing.quarterlyPrice / 3 / pricing.monthlyPrice) *
                          100,
                      )
                    : undefined
                }
              />

              {/* Annual */}
              <PricingCard
                title="Annually"
                price={`${symbol}${(pricing.annualPrice / 12).toFixed(2)}/mo`}
                colors={colors}
                savingsPercent={
                  pricing.monthlyPrice > 0 && pricing.annualPrice > 0
                    ? Math.round(
                        (1 - pricing.annualPrice / 12 / pricing.monthlyPrice) *
                          100,
                      )
                    : undefined
                }
              />
            </div>

            {/* Benefits list */}
            <div className="max-w-xl mx-auto space-y-1 text-left">
              <BenefitItem
                icon={Wallet}
                title="7 day free trial"
                description="No payment due now. Cancel anytime during your trial."
                colors={colors}
              />

              <BenefitItem
                icon={PackageOpen}
                title="Access all programs"
                description="Get all the programs to meet your goals. Switch anytime."
                colors={colors}
              />

              <BenefitItem
                icon={ChartLine}
                title="Track your performance"
                description="Monitor your progress over time in app."
                colors={colors}
              />

              <BenefitItem
                icon={MessagesSquare}
                title="Coach and community support"
                description="Get accountability and support in our private community."
                colors={colors}
                showBorder={false}
              />
            </div>

            <div className="py-8">
              <p className="text-xs text-text-muted">
                7 day free trial, then {symbol}
                {pricing.monthlyPrice.toFixed(2)} billed monthly. 3 month
                minimum.
              </p>
              {/* Start button */}
              <Button
                className="mt-2"
                style={{
                  backgroundColor: colors.accentPrimary,
                  color: colors.accentPrimaryText,
                }}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
