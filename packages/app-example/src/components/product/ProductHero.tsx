import type * as ProductModel from "@core/product/product.model";
import { dataURLtoFile } from "@core/storage/storage.utils";
import { convertMegabytesToBytes } from "@core/utils/conversion";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Activity,
	Calendar,
	Clock,
	ImageIcon,
	Shapes,
	Target,
	Trophy,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/components/ui/image";
import { ImageCropper } from "@/components/uploads/image-cropper";
import { ImageUploadOverlay } from "@/components/uploads/image-overlay";
import { InlineEditableField } from "./InlineEditableField";
import { InlineEditableSelect } from "./InlineEditableSelect";
import { InlineEditableTextArea } from "./InlineEditableTextarea";

// Constants for image upload
const MAX_IMAGE_SIZE = 5; // 5MB
const IMAGE_FILE_TYPES = {
	"image/png": [".png"],
	"image/jpeg": [".jpg", ".jpeg"],
	"image/webp": [".webp"],
};

// Form schema
const ProductHeroFormSchema = z.object({
	name: z.string().min(1),
	durationWeeks: z.number().min(4).max(16),
	difficultyLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
	daysPerWeek: z.number().min(3).max(7),
	trainingStyle: z.enum([
		"strength",
		"cardio",
		"hiit",
		"yoga",
		"pilates",
		"mixed",
	]),
	prerequisites: z.string().optional().nullable(),
	goals: z.string().optional().nullable(),
	image: z.instanceof(File).optional(),
});

type ProductHeroFormType = z.infer<typeof ProductHeroFormSchema>;

interface ProductHeroProps {
	product: ProductModel.QueryType;
	onUpdate: (updates: ProductModel.MutateClientType) => void;
}

export function ProductHero({ product, onUpdate }: ProductHeroProps) {
	const [originalImage, setOriginalImage] = useState<string | null>(null);
	const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(
		product.coverImage
			? getImageUrl(product.coverImage, "?height=600&format=webp")
			: null,
	);

	// Initialize form with product data
	const form = useForm<ProductHeroFormType>({
		resolver: zodResolver(ProductHeroFormSchema),
		defaultValues: {
			name: product.name,
			durationWeeks: product.durationWeeks,
			difficultyLevel: product.difficultyLevel,
			daysPerWeek: product.daysPerWeek,
			trainingStyle: product.trainingStyle,
			prerequisites: product.prerequisites || "",
			goals: product.goals || "",
		},
	});

	// Update form values when product prop changes (e.g., after successful mutation)
	useEffect(() => {
		form.reset({
			name: product.name,
			durationWeeks: product.durationWeeks,
			difficultyLevel: product.difficultyLevel,
			daysPerWeek: product.daysPerWeek,
			trainingStyle: product.trainingStyle,
			prerequisites: product.prerequisites || "",
			goals: product.goals || "",
		});

		// Update preview
		if (product.coverImage) {
			setPreview(getImageUrl(product.coverImage, "?height=600&format=webp"));
		}
	}, [product, form]);

	// Handle field updates
	const handleFieldUpdate = useCallback(
		(field: keyof ProductHeroFormType, value: any) => {
			form.setValue(field, value, { shouldDirty: true });
			const updates: ProductModel.MutateClientType = { [field]: value };

			// Don't include image in regular field updates - it's handled separately
			onUpdate(updates);
		},
		[form, onUpdate],
	);

	// Handle image crop completion
	const handleCropComplete = (croppedImageUrl: string) => {
		setPreview(croppedImageUrl);

		// Convert the cropped image URL to a File object
		if (selectedFile) {
			const croppedFile = dataURLtoFile(croppedImageUrl, selectedFile.name);
			// Pass the image file to the parent component's update handler
			onUpdate({ coverImage: croppedFile });
		}
	};

	// Handle image upload
	const onDrop = useCallback((acceptedFiles: File[]) => {
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
		maxSize: convertMegabytesToBytes(MAX_IMAGE_SIZE),
		accept: IMAGE_FILE_TYPES,
	});

	// Handle file rejections
	useEffect(() => {
		if (fileRejections.length > 0) {
			const errorType = fileRejections[0].errors[0].code;
			if (errorType === "file-invalid-type") {
				toast.error("Image must be a PNG, JPG, JPEG, or WebP");
			} else if (errorType === "file-too-large") {
				toast.error(
					`File too large. Image must be less than ${MAX_IMAGE_SIZE} MB`,
				);
			} else {
				toast.error("Uh oh! Something went wrong. Please try again.");
			}
		}
	}, [fileRejections]);

	// Options for select fields
	const difficultyOptions = [
		{ value: "beginner", label: "Beginner" },
		{ value: "intermediate", label: "Intermediate" },
		{ value: "advanced", label: "Advanced" },
		{ value: "expert", label: "Expert" },
	];

	const trainingStyleOptions = [
		{ value: "strength", label: "Strength" },
		{ value: "cardio", label: "Cardio" },
		{ value: "hiit", label: "HIIT" },
		{ value: "yoga", label: "Yoga" },
		{ value: "pilates", label: "Pilates" },
		{ value: "mixed", label: "Mixed" },
	];

	return (
		<div className="w-full">
			{/* Hero Image */}
			{preview && (
				<div
					{...getRootProps()}
					className="group relative w-full h-[280px] mt-6 mb-10 rounded-lg overflow-hidden cursor-pointer"
				>
					<input {...getInputProps()} />
					<ImageUploadOverlay
						position="top-right"
						buttonText="Change cover"
						showIcon={false}
					/>
					<img
						src={preview}
						alt="Product hero"
						className="object-cover w-full h-full"
					/>
				</div>
			)}

			{/* Add cover button (shown on hover when no image) */}
			{!preview && (
				<div className="relative h-28  flex items-center justify-start cursor-pointer">
					<div
						className={`absolute inset-0 flex items-end justify-start transition-opacity duration-200`}
					>
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							<Button size="sm" variant="outline">
								<ImageIcon className="h-4 w-4" />
								Add cover
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Title */}
			<div className="my-4">
				<InlineEditableField
					value={form.watch("name")}
					onUpdate={(value) => handleFieldUpdate("name", value)}
					placeholder="Untitled"
					className="text-[40px] font-bold leading-[1.2]"
				/>
			</div>

			{/* Add property section */}
			<div className="flex flex-col gap-4 text-md text-muted-foreground mb-6">
				{/* Duration */}
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2 w-40">
						<Calendar className="w-4 h-4" />
						<span>Duration</span>
					</div>
					<InlineEditableSelect
						value={form.watch("durationWeeks").toString()}
						onUpdate={(value) =>
							handleFieldUpdate("durationWeeks", parseInt(value))
						}
						options={Array.from({ length: 13 }, (_, i) => i + 4).map(
							(weeks) => ({
								value: weeks.toString(),
								label: `${weeks} weeks`,
							}),
						)}
						className="font-medium text-foreground"
					/>
				</div>

				{/* Difficulty */}
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2 w-40">
						<Activity className="w-4 h-4" />
						<span>Difficulty</span>
					</div>
					<InlineEditableSelect
						value={form.watch("difficultyLevel")}
						onUpdate={(value: any) =>
							handleFieldUpdate("difficultyLevel", value)
						}
						options={difficultyOptions}
						className="font-medium text-foreground capitalize"
					/>
				</div>

				{/* Days/Week */}
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2 w-40">
						<Clock className="w-4 h-4" />
						<span>Days/Week</span>
					</div>
					<InlineEditableSelect
						value={form.watch("daysPerWeek").toString()}
						onUpdate={(value) =>
							handleFieldUpdate("daysPerWeek", parseInt(value))
						}
						options={Array.from({ length: 5 }, (_, i) => i + 3).map((days) => ({
							value: days.toString(),
							label: `${days}`,
						}))}
						className="font-medium text-foreground"
					/>
				</div>

				{/* Training Style */}
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2 w-40">
						<Shapes className="w-4 h-4" />
						<span>Training Style</span>
					</div>
					<InlineEditableSelect
						value={form.watch("trainingStyle")}
						onUpdate={(value: any) => handleFieldUpdate("trainingStyle", value)}
						options={trainingStyleOptions}
						className="font-medium text-foreground capitalize"
					/>
				</div>

				{/* Prerequisites */}
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2 w-40">
						<Target className="w-4 h-4" />
						<span>Prerequisites</span>
					</div>
					<InlineEditableTextArea
						value={form.watch("prerequisites") || ""}
						onUpdate={(value) => handleFieldUpdate("prerequisites", value)}
						placeholder="None"
						className="font-medium text-foreground"
						minRows={1}
						maxRows={8}
					/>
				</div>

				{/* Goals */}
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2 w-40">
						<Trophy className="w-4 h-4" />
						<span>Goal</span>
					</div>
					<InlineEditableTextArea
						value={form.watch("goals") || ""}
						onUpdate={(value) => handleFieldUpdate("goals", value)}
						placeholder="None"
						className="font-medium text-foreground"
						minRows={1}
						maxRows={8}
					/>
				</div>
			</div>

			{/* Image Cropper Dialog */}
			<ImageCropper
				description="For best results, upload a wide image with a 21:9 aspect ratio (2100x900 px)."
				isOpen={isCropperOpen}
				onClose={() => setIsCropperOpen(false)}
				imageUrl={originalImage}
				onCropComplete={handleCropComplete}
				stencilType="rectangle"
				aspectRatio={21 / 9}
			/>
		</div>
	);
}
