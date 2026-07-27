import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const logoVariants = cva(
    "block shrink-0 transition-colors duration-300 hover:text-primary",
    {
        variants: {
            size: {
                default: "h-5 aspect-[614/184]",
                sm: "h-4 aspect-[614/184]",
                lg: "h-7 aspect-[614/184]",
            },
            variant: {
                default: "text-foreground",
                muted: "text-muted-foreground",
                accent: "text-accent",
            },
        },
        defaultVariants: {
            size: "default",
            variant: "default",
        },
    },
);

export interface LogoProps
    extends
        React.ComponentProps<"span">,
        VariantProps<typeof logoVariants> {
    "aria-label"?: string;
}

function Logo({ className, size, variant, ref, ...props }: LogoProps) {
        const lightMask = {
            WebkitMaskImage: "url(/letterhead-light.svg)",
            maskImage: "url(/letterhead-light.svg)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
        } as React.CSSProperties;

        const darkMask = {
            WebkitMaskImage: "url(/letterhead-dark.svg)",
            maskImage: "url(/letterhead-dark.svg)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
        } as React.CSSProperties;

        return (
            <span
                ref={ref}
                data-slot="logo"
                role="img"
                aria-label={props["aria-label"] ?? "Structa"}
                className={cn(logoVariants({ size, variant }), className)}
                {...props}
            >
                <span
                    className="block h-full w-full bg-current dark:hidden"
                    style={lightMask}
                />
                <span
                    className="hidden h-full w-full bg-current dark:block"
                    style={darkMask}
                />
            </span>
        );
}

export { Logo, logoVariants };
