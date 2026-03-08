import { forwardRef } from "react";
import {
	FixedCropper,
	type FixedCropperProps,
	type FixedCropperRef,
	ImageRestriction,
} from "react-advanced-cropper";

export type CropperProps = Omit<FixedCropperProps, "wrapperComponent">;
export type CropperRef = FixedCropperRef;

export const Cropper = forwardRef<CropperRef, CropperProps>(
	({ stencilProps, ...props }: CropperProps, ref) => {
		return (
			<FixedCropper
				ref={ref}
				stencilProps={{
					handlers: false,
					lines: false,
					movable: false,
					resizable: false,
					...stencilProps,
				}}
				imageRestriction={ImageRestriction.stencil}
				backgroundClassName="bg-white"
				backgroundWrapperClassName="bg-white"
				{...props}
			/>
		);
	},
);

Cropper.displayName = "Cropper";
