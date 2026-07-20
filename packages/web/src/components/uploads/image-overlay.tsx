import { ImagePlus } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface ImageUploadOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    position?:
        | "center"
        | "top-right"
        | "top-left"
        | "bottom-right"
        | "bottom-left";
    buttonText?: string;
    showIcon?: boolean;
}

const ImageUploadOverlay = React.forwardRef<
    HTMLDivElement,
    ImageUploadOverlayProps
>(
    (
        {
            className,
            children,
            position = "center",
            buttonText,
            showIcon = true,
            ...props
        },
        ref,
    ) => {
        const positionClasses = {
            center: "items-center justify-center",
            "top-right": "items-start justify-end p-4",
            "top-left": "items-start justify-start p-4",
            "bottom-right": "items-end justify-end p-4",
            "bottom-left": "items-end justify-start p-4",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "group z-15 absolute inset-0 flex hover:bg-black/40 transition-colors duration-300 ease-in-out rounded-full",
                    positionClasses[position],
                    className,
                )}
                {...props}
            >
                {children ||
                    (buttonText || !showIcon ? (
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out bg-background/80 hover:bg-background hover:text-foreground"
                        >
                            {showIcon && <ImagePlus className="size-4 mr-2" />}
                            {buttonText || "Change image"}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="rounded-full group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out bg-background/80 hover:bg-background hover:text-foreground"
                        >
                            <ImagePlus className="size-5" />
                        </Button>
                    ))}
            </div>
        );
    },
);
ImageUploadOverlay.displayName = "ImageUploadOverlay";

export { ImageUploadOverlay };
