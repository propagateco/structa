import React from "react";

interface PricingCardProps {
  title: string;
  price: string;
  colors: {
    cardBackground: string;
    borderDefault: string;
    borderAccent: string;
    primaryText: string;
    accentPrimary: string;
    accentPrimaryText: string;
    mutedText: string;
  };
  isPopular?: boolean;
  savingsPercent?: number;
}

export function PricingCard({
  title,
  price,
  colors,
  isPopular = false,
  savingsPercent,
}: PricingCardProps) {
  return (
    <div
      className="rounded-lg p-4 border-2 relative"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: isPopular ? colors.borderAccent : colors.borderDefault,
      }}
    >
      {isPopular && (
        <div
          className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 px-3 text-sm font-medium rounded-sm"
          style={{
            backgroundColor: colors.accentPrimary,
            color: colors.accentPrimaryText,
          }}
        >
          Popular
        </div>
      )}
      {savingsPercent && savingsPercent > 0 && (
        <div
          className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 px-3 text-sm font-medium rounded-sm"
          style={{
            backgroundColor: colors.borderDefault,
            color: colors.primaryText,
          }}
        >
          Save {savingsPercent}%
        </div>
      )}
      <h3
        className="font-semibold mb-2 text-xl"
        style={{
          color: colors.primaryText,
        }}
      >
        {title}
      </h3>
      <p
        className="font-medium text-md"
        style={{
          color: colors.primaryText,
        }}
      >
        {price}
      </p>
    </div>
  );
}
