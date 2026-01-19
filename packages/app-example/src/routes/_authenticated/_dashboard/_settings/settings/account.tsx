import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { userQueryOptions } from "@/clients/user/user.query.client";
import { stripeAccountQueryOptions } from "@/clients/stripe/stripe.query.client";
import { appleAccountQueryOptions } from "@/clients/apple/apple.query.client";
import { useQuery } from "@tanstack/react-query";
import {
    Header,
    HeaderMain,
    HeaderSubSection,
    HeaderTitle,
} from "@/components/layout/typography";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUploadOverlay } from "@/components/uploads/image-overlay";
import { ImageCropper } from "@/components/uploads/image-cropper";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SettingsForm, SettingsFormType } from "@core/user/user.model";
import { dataURLtoFile } from "@core/storage/storage.utils";
import { convertMegabytesToBytes } from "@core/utils/conversion";
import { formatToInitials } from "@core/utils/string";
import { useUpdateUserSettingsMutation } from "@/clients/user/user.mutation.client";
import { getImageUrl } from "@/components/ui/image";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute(
    "/_authenticated/_dashboard/_settings/settings/account"
)({
    component: RouteComponent,
});

function RouteComponent() {
    const { data: user, isPending: isUserLoading } = useQuery(userQueryOptions);
    const { mutate, isPending } = useUpdateUserSettingsMutation();

    if (isUserLoading || !user) {
        return <AccountPageSkeleton />;
    }

    const [preview, setPreview] = useState<string | null>(
        user.image
            ? getImageUrl(user.image, "?width=400&height=400&format=webp")
            : null
    );
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Initialise form with user data
    const form = useForm<SettingsFormType>({
        resolver: zodResolver(SettingsForm),
        defaultValues: {
            name: user.name,
            workspaceName: user.workspaceName,
        },
    });

    // Handle form submission
    const onSubmit = (values: SettingsFormType) => {
        mutate(values, {
            onSuccess: () => {
                // Reset the form with the same values to clear the dirty state
                form.reset(values);
            },
        });
    };

    // Handle image crop completion
    const handleCropComplete = (croppedImageUrl: string) => {
        setPreview(croppedImageUrl);

        // Convert the cropped image URL to a File object
        if (selectedFile) {
            const croppedFile = dataURLtoFile(
                croppedImageUrl,
                selectedFile.name
            );
            form.setValue("image", croppedFile, {
                shouldDirty: true,
            });
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
        [form]
    );

    const { getRootProps, getInputProps, fileRejections } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize: convertMegabytesToBytes(1), // 1MB
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/jpg": [],
        },
    });

    // Handle file rejections
    useEffect(() => {
        if (fileRejections.length > 0) {
            const errorType = fileRejections[0].errors[0].code;
            if (errorType === "file-invalid-type") {
                toast.error("Image must be a PNG, JPG or JPEG");
            } else if (errorType === "file-too-large") {
                toast.error("File too large. Image must be less than 1MB");
            } else {
                toast.error("Uh oh! Something went wrong. Please try again.");
            }
        }
    }, [fileRejections]);

    return (
        <>
            <Header>
                <HeaderMain>
                    <HeaderTitle>Account</HeaderTitle>
                    <HeaderSubSection>
                        Manage your account settings, billing, and set e-mail
                        preferences.
                    </HeaderSubSection>
                </HeaderMain>
            </Header>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <Card className="border">
                        <CardContent className="space-y-6">
                            {/* Profile Picture */}
                            <FormItem>
                                <div>
                                    <FormLabel>Photo</FormLabel>
                                    <FormDescription>
                                        Upload a profile picture. Max size: 1MB.
                                    </FormDescription>
                                </div>
                                <div
                                    {...getRootProps()}
                                    className="group relative flex cursor-pointer items-center justify-center rounded-full size-20 overflow-hidden bg-transparent"
                                >
                                    <ImageUploadOverlay />
                                    <Avatar className="size-20">
                                        <AvatarImage
                                            src={
                                                preview ||
                                                (user.image
                                                    ? getImageUrl(
                                                          user.image,
                                                          "?width=400&height=400&format=webp"
                                                      )
                                                    : undefined)
                                            }
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="text-lg">
                                            {formatToInitials(
                                                form.getValues("name")
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <input
                                        {...getInputProps()}
                                        type="file"
                                        className="hidden"
                                    />
                                </div>
                                <FormMessage />
                            </FormItem>

                            {/* Image Cropper */}
                            <ImageCropper
                                description="Zoom and drag to edit your profile picture."
                                isOpen={isCropperOpen}
                                onClose={() => setIsCropperOpen(false)}
                                imageUrl={originalImage}
                                onCropComplete={handleCropComplete}
                                stencilType="circle"
                                aspectRatio={1}
                            />

                            {/* Name Field */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div>
                                            <FormLabel>Name</FormLabel>
                                            <FormDescription>
                                                How you will appear both in the
                                                platform and on your app.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Input
                                                placeholder="Your name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Workspace Name Field */}
                            <FormField
                                control={form.control}
                                name="workspaceName"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div>
                                            <FormLabel>
                                                Workspace Name
                                            </FormLabel>
                                            <FormDescription>
                                                Used to identify your workspace
                                                in the platform.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Input
                                                placeholder="Your workspace name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email Field - Read Only */}
                            <div className="space-y-2">
                                <div>
                                    <FormLabel>Email</FormLabel>
                                    <FormDescription>
                                        Your account email address.
                                    </FormDescription>
                                </div>
                                <Input value={user.email} disabled />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end p-0 pt-6">
                            <Button
                                type="submit"
                                disabled={isPending || !form.formState.isDirty}
                                isLoading={isPending}
                            >
                                Save changes
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </>
    );
}

function AccountPageSkeleton() {
    return (
        <>
            <Header>
                <HeaderMain>
                    <HeaderTitle>Account</HeaderTitle>
                    <HeaderSubSection>
                        Manage your account settings, billing, and set e-mail
                        preferences.
                    </HeaderSubSection>
                </HeaderMain>
            </Header>
            <Card className="border">
                <CardContent className="space-y-6">
                    {/* Profile Picture Skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-3 w-48" />
                        <Skeleton className="size-20 rounded-full" />
                    </div>

                    {/* Name Field Skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-3 w-64" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Workspace Name Field Skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-56" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Email Field Skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-3 w-40" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end p-0 pt-6">
                    <Skeleton className="h-10 w-32" />
                </CardFooter>
            </Card>
        </>
    );
}
