import { BrandingModel } from "@core/branding/branding.model";
import { dataURLtoFile } from "@core/storage/storage.utils";
import { convertMegabytesToBytes } from "@core/utils/conversion";
import { FONTS } from "@core/utils/font";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue, useSetAtom } from "jotai";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ImageCropper } from "@/components/uploads/image-cropper";
import {
	ImageUploadOverlay,
	ImageUploadOverlayWithRemove,
} from "@/components/uploads/image-overlay";
import { cn } from "@/lib/utils";
import {
	brandingChangesAtom,
	updateBrandingChangeAtom,
} from "@/state/branding";
import { getImageUrl } from "../ui/image";

export function LogoFontCard({
	branding,
}: {
	branding: BrandingModel.BrandingQueryType;
}) {
	return (
		<Card variant="ghost" className="p-4 lg:p-6 overflow-hidden w-full h-full">
			<div className="flex flex-col gap-4">
				<LargeLogoForm branding={branding} />
				<FontForm branding={branding} />
			</div>
		</Card>
	);
}

export function LargeLogoForm({
	branding,
}: {
	branding: BrandingModel.BrandingQueryType;
}) {
	// Use Jotai atoms for state management
	const changes = useAtomValue(brandingChangesAtom);
	const updateChange = useSetAtom(updateBrandingChangeAtom);

	const handleImageUpdate = (file: File | null) => {
		const changes: Partial<BrandingModel.BrandingContextType> = {
			lightLargeLogo: file,
		};
		updateChange(changes);
	};

	// State for the Image Cropper
	const [originalImage, setOriginalImage] = useState<string | null>(null);
	const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const form = useForm<BrandingModel.LargeLogoFileType>({
		resolver: zodResolver(BrandingModel.LargeLogoFile),
		mode: "onBlur",
		defaultValues: {
			image: changes.lightLargeLogo || undefined,
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
		handleImageUpdate(null);
		form.setValue("image", undefined);
	};

	return (
		<Form {...form}>
			<form>
				<FormField
					control={form.control}
					name="image"
					render={() => (
						<FormItem className="flex flex-col">
							<FormLabel
								className={cn(
									fileRejections.length !== 0 && "text-destructive",
								)}
							>
								Header Logo
								<span
									className={cn(
										form.formState.errors.image ||
											(fileRejections.length !== 0 && "text-destructive"),
									)}
								></span>
							</FormLabel>
							<FormControl>
								<div
									{...getRootProps()}
									// className="group overflow-hidden relative flex cursor-pointer flex-col items-center justify-center bg-transparent p-3 rounded-md w-60 h-24 border-2 border-dashed border-muted aspect-5/2;
									className="group overflow-hidden relative flex cursor-pointer flex-col items-center justify-center bg-transparent p-3 rounded-md border border-dashed border-input w-full max-h-32 aspect-large-logo"
								>
									{changes.lightLargeLogo ? (
										<>
											<ImageUploadOverlayWithRemove
												showRemove
												onRemove={handleRemove}
											/>
											<img
												src={URL.createObjectURL(changes.lightLargeLogo)}
												alt="Uploaded image"
												className="object-contain w-full h-full"
											/>
										</>
									) : branding.lightLargeLogo ? (
										<>
											<ImageUploadOverlayWithRemove
												showRemove
												onRemove={handleRemove}
											/>
											<img
												src={getImageUrl(
													branding.lightLargeLogo,
													"?height=300&format=webp",
												)}
												alt="Uploaded image"
												className="object-contain w-full h-full"
											/>
										</>
									) : (
										<Button size={"sm"} variant={"outline"} type="button">
											Upload File
										</Button>
									)}
									<Input {...getInputProps()} type="file" />
								</div>
							</FormControl>
							<FormMessage>
								{fileRejections.length !== 0 && (
									<p>
										Image must be less than 1MB and of type png, jpg, or jpeg
									</p>
								)}
							</FormMessage>
						</FormItem>
					)}
				/>
				<ImageCropper
					description="For best results, upload a wide PNG with a 7:2 aspect ratio (1400x400 px)."
					isOpen={isCropperOpen}
					onClose={() => setIsCropperOpen(false)}
					imageUrl={originalImage}
					onCropComplete={handleCropComplete}
					stencilType="rectangle"
					aspectRatio={3.5}
				/>
			</form>
		</Form>
	);
}

type FontFormValues = {
	font: string;
};

type FontFormProps = {
	branding: BrandingModel.BrandingQueryType;
};

export const FontForm: React.FC<FontFormProps> = ({ branding }) => {
	const [open, setOpen] = useState(false);

	// Use Jotai atoms for state management
	const changes = useAtomValue(brandingChangesAtom);
	const updateChange = useSetAtom(updateBrandingChangeAtom);

	// Get current font directly from atoms or fallback to default
	const getCurrentFont = () => {
		const fontValue = changes.font ?? branding.font;
		const matchedFont = FONTS.find((f) => f.value === fontValue);
		return matchedFont || FONTS[0];
	};

	// No local state, always derive from context
	const selectedFont = getCurrentFont();

	const formSchema = z.object({
		font: z.string(),
	});

	const form = useForm<FontFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			font: selectedFont.value,
		},
	});

	// Update form value when context changes
	useEffect(() => {
		form.setValue("font", selectedFont.value);
	}, [changes, selectedFont.value, form]);

	const handleFontSelect = (value: string) => {
		const font = FONTS.find((f) => f.value === value);
		if (font) {
			form.setValue("font", value);

			// Update the branding context with changes only
			updateChange({ font: value });
		}
	};

	const handleSubmit = (values: FontFormValues) => {
		console.log(values);
		const font = FONTS.find((f) => f.value === values.font);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name="font"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Font</FormLabel>
							<FormControl>
								<Popover open={open} onOpenChange={setOpen}>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											role="combobox"
											aria-expanded={open}
											className="w-full justify-between"
											style={{
												fontFamily: selectedFont?.family,
												fontStyle: "normal",
												fontWeight: "400",
											}}
										>
											{selectedFont ? selectedFont.name : "Select font..."}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-full p-0">
										<Command>
											<CommandInput placeholder="Search fonts..." />
											<CommandList>
												<CommandEmpty>No font found.</CommandEmpty>
												<CommandGroup>
													{FONTS.map((font) => (
														<CommandItem
															key={font.value}
															value={font.value}
															onSelect={(currentValue) => {
																handleFontSelect(currentValue);
																setOpen(false);
															}}
															style={{
																fontFamily: font.family,
															}}
														>
															{font.name}
															<Check
																className={cn(
																	"ml-auto",
																	field.value === font.value
																		? "opacity-100"
																		: "opacity-0",
																)}
															/>
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};
