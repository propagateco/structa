import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	CircleStencil,
	type DefaultSize,
	RectangleStencil,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { getFileMimeContentType } from "@core/storage/storage.utils";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Cropper, type CropperRef } from "./cropper";

interface ImageCropperProps {
	description: string;
	isOpen: boolean;
	onClose: () => void;
	imageUrl: string | null;
	onCropComplete: (croppedImage: string) => void;
	aspectRatio?: number;
	stencilType?: "circle" | "rectangle";
}

export function ImageCropper({
	description,
	isOpen,
	onClose,
	imageUrl,
	onCropComplete,
	aspectRatio = 1,
	stencilType = "circle",
}: ImageCropperProps) {
	const cropperRef = useRef<CropperRef>(null);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [contentType, setContentType] = useState("");

	// Reset when dialog opens or image changes
	useEffect(() => {
		if (isOpen && imageUrl) {
			setImageLoaded(false);
			setContentType(getFileMimeContentType(imageUrl));
		}
	}, [isOpen, imageUrl]);

	// Handler for the cropper ready event
	const handleReady = useCallback(() => {
		setImageLoaded(true);
	}, []);

	// Handle applying the crop
	const handleApply = useCallback(() => {
		if (cropperRef.current) {
			const canvas = cropperRef.current.getCanvas();
			if (canvas) {
				// Create a new canvas with white background for transparent images
				const ctx = canvas.getContext("2d");
				if (ctx && contentType === "image/png") {
					// Save the current canvas content
					const tempCanvas = document.createElement("canvas");
					tempCanvas.width = canvas.width;
					tempCanvas.height = canvas.height;
					const tempCtx = tempCanvas.getContext("2d");
					if (tempCtx) {
						tempCtx.drawImage(canvas, 0, 0);

						// Fill the original canvas with white
						ctx.fillStyle = "#ffffff";
						ctx.fillRect(0, 0, canvas.width, canvas.height);

						// Draw the image back on top of the white background
						ctx.drawImage(tempCanvas, 0, 0);
					}
				}

				const croppedImageUrl = canvas.toDataURL(contentType);
				onCropComplete(croppedImageUrl);
				onClose();
			}
		}
	}, [onCropComplete, onClose, contentType]);

	const defaultSize: DefaultSize = ({ imageSize }) => {
		return {
			width: Math.min(imageSize.height, imageSize.width),
			height: Math.min(imageSize.height, imageSize.width),
		};
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit image</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				{imageUrl && (
					<Cropper
						ref={cropperRef}
						src={imageUrl}
						className="h-[500px] w-[500px]"
						defaultSize={defaultSize}
						stencilProps={{
							aspectRatio,
							previewClassName: "border-2 border-white/50",
						}}
						stencilSize={{
							width: 500,
							height: 500,
						}}
						stencilComponent={
							stencilType === "circle" ? CircleStencil : RectangleStencil
						}
						onReady={handleReady}
					/>
				)}
				<DialogFooter>
					<div className="flex flex-row items-center gap-2">
						<Button size="sm" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button size="sm" onClick={handleApply} disabled={!imageLoaded}>
							Apply
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
