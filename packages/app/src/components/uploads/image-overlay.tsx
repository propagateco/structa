import { ImagePlus, Pen, X } from "lucide-react";
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
          "group z-15 absolute inset-0 flex hover:bg-black/40 transition-colors duration-300 ease-in-out",
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
              variant="opposite"
              className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out"
            >
              {showIcon && <ImagePlus className="size-4 mr-2" />}
              {buttonText || "Change image"}
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              variant="opposite"
              className="rounded-full group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out"
            >
              <ImagePlus className="size-5" />
            </Button>
          ))}
      </div>
    );
  },
);
ImageUploadOverlay.displayName = "ImageUploadOverlay";

interface ImageUploadOverlayWithRemoveProps extends ImageUploadOverlayProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  showRemove?: boolean;
  onRemove?: () => void;
  uploadButtonText?: string;
  removeButtonText?: string;
  showUploadIcon?: boolean;
  showRemoveIcon?: boolean;
}

const ImageUploadOverlayWithRemove = React.forwardRef<
  HTMLDivElement,
  ImageUploadOverlayWithRemoveProps
>(
  (
    {
      className,
      children,
      position = "center",
      showRemove = true,
      onRemove,
      uploadButtonText,
      removeButtonText,
      showUploadIcon = true,
      showRemoveIcon = true,
      showIcon,
      inputProps,
      ...props
    },
    ref,
  ) => {
    const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (onRemove) {
        onRemove();
      }
    };

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
          "group z-15 absolute inset-0 flex hover:bg-black/40 transition-colors duration-300 ease-in-out",
          positionClasses[position],
          className,
        )}
        {...props}
      >
        {children || (
          <div className="flex items-center gap-2">
            {/* Upload button */}
            {uploadButtonText || !showUploadIcon ? (
              <Button
                type="button"
                size="sm"
                variant="opposite"
                className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out"
              >
                {showUploadIcon && <ImagePlus className="size-4 mr-2" />}
                {uploadButtonText || "Change image"}
              </Button>
            ) : (
              <Button
                type="button"
                size="icon"
                variant="opposite"
                className="rounded-full group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out"
              >
                <ImagePlus className="size-5" />
              </Button>
            )}

            {/* Remove button */}
            {showRemove &&
              (removeButtonText || !showRemoveIcon ? (
                <Button
                  type="button"
                  size="sm"
                  variant="opposite"
                  onClick={handleRemove}
                  className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out"
                >
                  {showRemoveIcon && <X className="size-4 mr-2" />}
                  {removeButtonText || "Remove"}
                </Button>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  variant="opposite"
                  onClick={handleRemove}
                  className="rounded-full group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out"
                >
                  <X className="size-5" />
                </Button>
              ))}
          </div>
        )}
      </div>
    );
  },
);
ImageUploadOverlayWithRemove.displayName = "ImageUploadOverlayWithRemove";

export { ImageUploadOverlay, ImageUploadOverlayWithRemove };
