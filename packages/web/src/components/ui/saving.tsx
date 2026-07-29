// TODO: STUB - Replace with actual Saving component from app-example when @core models are available
// Currently using stub types until app, branding, and product models are implemented

// TODO: Replace with actual AppModel from @core when available
type AppModelStub = {
    publishedAt?: string | null;
    updatedAt: string;
};

// TODO: Replace with actual BrandingModel from @core when available
type BrandingModelStub = {
    icon?: string | null;
    publishedAt?: string | null;
    updatedAt: string;
};

// TODO: Replace with actual ProductModel from @core when available
type ProductModelStub = {
    id: string;
    name: string;
    publishedAt?: string | null;
    updatedAt: string;
};

import { cn } from "@/lib/utils";
import { MutationDot, type MutationState } from "./dot";

export interface SavingProps {
    isLoading?: boolean;
    isPublishing?: boolean;
    error?: boolean;
    product?: ProductModelStub;
    branding?: BrandingModelStub;
    app?: AppModelStub;
    wasRecentlyPublished?: boolean;
    className?: string;
}

export function Saving({
    isLoading = false,
    isPublishing = false,
    error = false,
    product,
    branding,
    app,
    wasRecentlyPublished = false,
    className,
}: SavingProps) {
    // Determine state to display
    const getMutationState = (): MutationState => {
        if (error) {
            return "error";
        }
        if (isPublishing) {
            return "publishing";
        }
        if (isLoading) {
            return "saving";
        }

        // If recently published, show published state
        if (wasRecentlyPublished) {
            return "published";
        }

        // If we have product data, check its status
        if (product) {
            // Published and up to date
            if (product.publishedAt) {
                return "published";
            }
        }

        // If we have branding and app data, check their status
        if (branding && app) {
            // Published and up to date
            if (branding.publishedAt) {
                return "published";
            }
        }

        // Default to saved state
        return "saved";
    };

    const mutationState = getMutationState();

    return (
        <div className="flex items-center">
            <MutationDot
                state={mutationState}
                textSize="text-xs"
                className="text-foreground"
            />
        </div>
    );
}
