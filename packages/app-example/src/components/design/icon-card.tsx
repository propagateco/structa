import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useAtomValue, useSetAtom } from "jotai";

import { BrandingModel } from "@core/branding/branding.model";
import { dataURLtoFile } from "@core/storage/storage.utils";
import { brandingChangesAtom, updateBrandingChangeAtom } from "@/state/branding";
import { convertMegabytesToBytes } from "@core/utils/conversion";
import { cn } from "@/lib/utils";
import { ImageCropper } from "@/components/uploads/image-cropper";
import AppPlaceholderIcon from "@/assets/icons/AppPlaceholderIcon";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImageUploadOverlayWithRemove } from "@/components/uploads/image-overlay";
import { Card } from "@/components/ui/card";
import { getImageUrl } from "../ui/image";

export function IconCard({
  branding,
}: {
  branding: BrandingModel.BrandingQueryType;
}) {
  // Use Jotai atoms for state management
  const changes = useAtomValue(brandingChangesAtom);
  const updateChange = useSetAtom(updateBrandingChangeAtom);
  
  
  const handleImageUpdate = (file: File) => {
    const changes: Partial<BrandingModel.BrandingContextType> = { icon: file };
    updateChange(changes);
  };

  // State for the Image Cropper
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialise form with image data
  const form = useForm<BrandingModel.IconFileType>({
    resolver: zodResolver(BrandingModel.IconFile),
    mode: "onBlur",
    defaultValues: {
      image: changes.icon || undefined,
    },
  });

  // Handle image crop completion
  const handleCropComplete = (croppedImageUrl: string) => {
    // Convert the cropped image URL to a File object
    if (selectedFile) {
      const croppedFile = dataURLtoFile(croppedImageUrl, selectedFile.name);
      form.setValue("image", croppedFile, {
        shouldDirty: true,
      });
      handleImageUpdate(croppedFile);
    }
  };

  // Handle image upload with react-dropzone
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setOriginalImage(reader.result);
            setIsCropperOpen(true);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [form],
  );

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: convertMegabytesToBytes(BrandingModel.MAX_BRANDING_ASSET_SIZE),
    accept: BrandingModel.BRANDING_IMAGE_FILE_TYPES,
  });

  // Handle file rejections
  useEffect(() => {
    if (fileRejections.length > 0) {
      const errorType = fileRejections[0].errors[0].code;
      if (errorType === "file-invalid-type") {
        toast.error("Image must be a PNG, JPG or JPEG");
      } else if (errorType === "file-too-large") {
        toast.error(
          `File too large. Image must be less than ${BrandingModel.MAX_BRANDING_ASSET_SIZE} MB`,
        );
      } else {
        toast.error("Uh oh! Something went wrong. Please try again.");
      }
    }
  }, [fileRejections]);

  // Handle image removal
  const handleRemove = () => {
    const changes: Partial<BrandingModel.BrandingContextType> = { icon: null };
    updateChange(changes);
    console.log("Changes: ", changes);
  };

  return (
    <Card
      variant={"ghost"}
      className="p-4 lg:p-6 overflow-hidden w-full h-full flex flex-col items-center justify-center"
    >
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>App Icon</FormLabel>
                <FormControl>
                  <div
                    {...getRootProps()}
                    className={cn(
                      changes.icon instanceof File ||
                        (changes.icon !== null && branding.icon)
                        ? "border-none shadow-md md:shadow-lg lg:shadow-xl"
                        : "border border-dashed border-input",
                      "group overflow-hidden relative flex cursor-pointer flex-col items-center justify-center rounded-lg  bg-transparent  size-60",
                    )}
                    style={{
                      borderRadius: "calc(23% + 1px)",
                    }}
                  >
                    <input {...getInputProps()} />
                    {/* Current preview icon or fallback */}
                    {(() => {
                      switch (true) {
                        case changes.icon instanceof File:
                          return (
                            <>
                              <ImageUploadOverlayWithRemove
                                showRemove
                                onRemove={handleRemove}
                              />
                              <img
                                src={URL.createObjectURL(changes.icon)}
                                alt="Preview icon"
                              />
                            </>
                          );
                        case changes.icon === null:
                          // User explicitly removed the icon, show default state
                          return (
                            <div className="w-full h-full flex flex-col gap-2 items-center justify-center text-center">
                              <div className="flex items-center justify-center  mb-3">
                                <AppPlaceholderIcon className="size-14 p-1" />
                              </div>
                              <h3 className="text-sm font-medium">
                                Upload your app icon
                              </h3>
                              <h2 className="text-sm font-base text-muted-foreground max-w-52">
                                Choose a 1024x1024px square image for the best
                                results.
                              </h2>
                              <Button
                                size={"sm"}
                                variant={"outline"}
                                type="button"
                              >
                                Upload File
                              </Button>
                            </div>
                          );
                        case branding.icon !== null:
                          return (
                            <>
                              <ImageUploadOverlayWithRemove
                                showRemove
                                onRemove={handleRemove}
                              />
                              <img
                                src={getImageUrl(
                                  branding.icon,
                                  "?width=400&height=400&format=webp",
                                )}
                                alt="App icon"
                              />
                            </>
                          );
                        default:
                          // No icon at all
                          return (
                            <div className="w-full h-full flex flex-col gap-2 items-center justify-center text-center">
                              <div className="flex items-center justify-center  mb-3">
                                <AppPlaceholderIcon className="size-14 p-1" />
                              </div>
                              <h3 className="text-sm font-medium">
                                Upload your app icon
                              </h3>
                              <h2 className="text-sm font-base text-muted-foreground max-w-52">
                                Choose a 1024x1024px square image for the best
                                results.
                              </h2>
                              <Button
                                size={"sm"}
                                variant={"outline"}
                                type="button"
                              >
                                Upload File
                              </Button>
                            </div>
                          );
                      }
                    })()}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <ImageCropper
            description="For best results, upload a square PNG with a 1:1 aspect ratio (2000x2000 px)."
            isOpen={isCropperOpen}
            onClose={() => setIsCropperOpen(false)}
            imageUrl={originalImage}
            onCropComplete={handleCropComplete}
            stencilType="rectangle"
            aspectRatio={1}
          />
        </form>
      </Form>
    </Card>
  );
}
