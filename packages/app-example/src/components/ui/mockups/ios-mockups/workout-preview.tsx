import { useQuery } from "@tanstack/react-query";
import { productsQueryOptions } from "@/clients/product/product.query.client";
import { ProductWorkoutCard } from "./product-workout-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Plus } from "lucide-react";

// Create a type that extends BrandingQueryType for our preview
import { BrandingModel } from "@core/branding/branding.model";
type BrandingPreviewType = BrandingModel.BrandingQueryType & {
  name: string; // App name from app model
  description: string | undefined | null; // App description from app model
};

interface WorkoutPreviewProps {
  branding: BrandingPreviewType;
  getFontFamily: (fontName: string) => string;
}

export function WorkoutPreview({ branding, getFontFamily }: WorkoutPreviewProps) {
  const { data: productsData, isPending } = useQuery(productsQueryOptions);
  
  // Show skeleton while loading
  if (isPending) {
    return <WorkoutPreviewSkeleton branding={branding} getFontFamily={getFontFamily} />;
  }

  // Find the latest updated product
  const products = productsData?.products ?? [];
  const latestProduct = products.length > 0 
    ? products
        .filter(product => product.active && !product.deletedAt)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
    : null;

  // If we have a product, show it
  if (latestProduct) {
    return (
      <ProductWorkoutCard 
        product={latestProduct}
        branding={branding}
        getFontFamily={getFontFamily}
      />
    );
  }

  // Fallback to static content when no products exist
  return <StaticWorkoutPreview branding={branding} getFontFamily={getFontFamily} />;
}

function WorkoutPreviewSkeleton({ 
  branding, 
  getFontFamily 
}: { 
  branding: BrandingPreviewType;
  getFontFamily: (fontName: string) => string;
}) {
  const fontFamily = getFontFamily(branding.font);
  
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-row gap-3 text-sm" style={{ fontFamily }}>
          <h3
            className="font-semibold"
            style={{ color: branding.colours.grey.lightForeground.formatHex() }}
          >
            Program
          </h3>
          <h3
            className="font-semibold"
            style={{ color: branding.colours.grey.lightGrey5.formatHex() }}
          >
            Another Program
          </h3>
        </div>
        <div
          className="rounded-sm p-0.5"
          style={{
            backgroundColor: branding.colours.grey.lightGrey7.formatHex(),
          }}
        >
          <Plus className="size-4" />
        </div>
      </div>
      <Skeleton className="animate-pulse w-full h-64 rounded-lg" />
    </div>
  );
}

function StaticWorkoutPreview({ 
  branding, 
  getFontFamily 
}: { 
  branding: BrandingPreviewType;
  getFontFamily: (fontName: string) => string;
}) {
  const fontFamily = getFontFamily(branding.font);

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-row gap-3 text-sm" style={{ fontFamily }}>
          <h3
            className="font-semibold"
            style={{ color: branding.colours.grey.lightForeground.formatHex() }}
          >
            Program
          </h3>
          <h3
            className="font-semibold"
            style={{ color: branding.colours.grey.lightGrey5.formatHex() }}
          >
            Another Program
          </h3>
        </div>
        <div
          className="rounded-sm p-0.5"
          style={{
            backgroundColor: branding.colours.grey.lightGrey7.formatHex(),
          }}
        >
          <Plus className="size-4" />
        </div>
      </div>
      
      <Skeleton className="animate-none w-full h-64 flex flex-col items-center justify-end relative bg-gradient-to-b from-muted via-ds-mono-500/60 to-ds-mono-700">
        <div className="absolute bottom-5">
          <div className="flex flex-col gap-2.5 items-center">
            <h2
              className="font-bold text-2xl"
              style={{
                color: branding.colours.grey.lightBackground.formatHex(),
                ...(fontFamily ? { fontFamily } : {}),
              }}
            >
              Today's Workout
            </h2>
            <div className="flex flex-col items-center gap-2">
              <h3
                className="text-xxs font-semibold"
                style={{
                  color: branding.colours.grey.lightBackground.formatHex(),
                }}
              >
                Program &#183; 30 mins
              </h3>
              <div className="flex flex-row gap-2">
                <Button
                  variant="opposite"
                  size="xs"
                  className="text-xxs font-medium pointer-events-none"
                  style={{
                    color: branding.colours.grey.lightForeground.formatHex(),
                  }}
                >
                  <Play
                    fill={branding.colours.grey.lightForeground.formatHex()}
                    style={{
                      color: branding.colours.grey.lightForeground.formatHex(),
                    }}
                  />
                  Start Workout
                </Button>
                <Button
                  variant="default"
                  size="xs"
                  className="text-xxs font-medium pointer-events-none"
                  style={{
                    color: branding.colours.grey.lightBackground.formatHex(),
                    backgroundColor:
                      branding.colours.grey.lightGrey3.formatHex(),
                  }}
                >
                  <Plus
                    fill={branding.colours.grey.lightBackground.formatHex()}
                    style={{
                      color: branding.colours.grey.lightBackground.formatHex(),
                    }}
                  />
                  Favourites
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Skeleton>
    </div>
  );
}