import { dataURLtoFile } from "@core/storage/storage.utils";
import { SettingsForm, type SettingsFormType } from "@core/user/user.model";
import { convertMegabytesToBytes } from "@core/utils/conversion";
import { formatToInitials } from "@core/utils/string";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Header,
    HeaderMain,
    HeaderSubSection,
    HeaderTitle,
} from "@/components/layout/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { getImageUrl } from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageCropper } from "@/components/uploads/image-cropper";
import { ImageUploadOverlay } from "@/components/uploads/image-overlay";
import { useUpdateUser } from "@/hooks/use-update-user";
import { useUser } from "@/hooks/use-user";

export const Route = createFileRoute("/_auth/_settings/settings/account")({
    component: AccountSettings,
});

function AccountSettings() {
    const { user, isLoading: isUserLoading } = useUser();

    // Get user from route context as fallback
    const { authUser } = Route.useRouteContext();

    // Use Electric user if synced, fallback to auth context
    const currentUser = user ?? authUser;

    // Initialize the mutation hook with the current user's ID
    const { mutate, isPending } = useUpdateUser(currentUser.id);

    // Derive primitive values from current user
    const name = currentUser.name;
    const email = currentUser.email;
    const image = currentUser.image;
    // Default an unset/empty workspace name to "{name}'s Workspace" so the
    // required field never starts blank — otherwise users without a
    // workspaceName hit a validation error when saving unrelated fields.
    const workspaceName = currentUser.workspaceName || `${name}'s Workspace`;

    const [preview, setPreview] = useState<string | null>(() => {
        if (image) {
            return (
                getImageUrl(image, "?width=400&height=400&format=webp") ?? null
            );
        }
        return null;
    });
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Initialize form with user data
    const form = useForm<SettingsFormType>({
        resolver: zodResolver(SettingsForm),
        defaultValues: {
            name,
            workspaceName,
        },
    });

    // Update form when user data changes from Electric sync
    // Use primitive values as dependencies to avoid object reference issues
    useEffect(() => {
        const currentName = form.getValues("name");
        const currentWorkspaceName = form.getValues("workspaceName");

        if (currentName !== name || currentWorkspaceName !== workspaceName) {
            form.reset({
                name,
                workspaceName,
            });
        }
    }, [name, workspaceName, form]);

    // Handle form submission
    const onSubmit = (values: SettingsFormType) => {
        mutate(
            {
                ...values,
                userId: authUser.id,
            },
            {
                onSuccess: () => {
                    form.reset(values);
                },
            },
        );
    };

    // Handle image crop completion
    const handleCropComplete = (croppedImageUrl: string) => {
        setPreview(croppedImageUrl);

        if (selectedFile) {
            const croppedFile = dataURLtoFile(
                croppedImageUrl,
                selectedFile.name,
            );
            form.setValue("image", croppedFile, {
                shouldDirty: true,
            });
        }
    };

    // Handle image upload with react-dropzone
    const onDrop = React.useCallback((acceptedFiles: File[]) => {
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
    }, []);

    const { getRootProps, getInputProps, fileRejections } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize: convertMegabytesToBytes(1),
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

    // Show loading state while Electric syncs.
    // NOTE: must come after ALL hooks (Rules of Hooks).
    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Skeleton className="h-8 w-48" />
            </div>
        );
    }

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
                                                (image
                                                    ? getImageUrl(
                                                          image,
                                                          "?width=400&height=400&format=webp",
                                                      )
                                                    : undefined)
                                            }
                                            alt={name}
                                        />
                                        <AvatarFallback className="text-lg">
                                            {formatToInitials(
                                                form.getValues("name"),
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
                                <Input value={email} disabled />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
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
