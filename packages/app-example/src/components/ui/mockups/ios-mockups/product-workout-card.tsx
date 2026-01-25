// Create a type that extends BrandingQueryType for our preview
import type { BrandingModel } from "@core/branding/branding.model";
import type * as ProductModel from "@core/product/product.model";
import { Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "../../image";

type BrandingPreviewType = BrandingModel.BrandingQueryType & {
	name: string; // App name from app model
	description: string | undefined | null; // App description from app model
};

interface ProductWorkoutCardProps {
	product: ProductModel.QueryType;
	branding: BrandingPreviewType;
	getFontFamily: (fontName: string) => string;
}

export function ProductWorkoutCard({
	product,
	branding,
	getFontFamily,
}: ProductWorkoutCardProps) {
	const fontFamily = getFontFamily(branding.font);

	return (
		<div className="flex flex-col items-start gap-2">
			<div className="flex flex-row justify-between items-center w-full">
				<div className="flex flex-row gap-3 text-sm" style={{ fontFamily }}>
					<h3
						className="font-semibold"
						style={{ color: branding.colours.grey.lightForeground.formatHex() }}
					>
						Program
					</h3>
					<h3
						className="font-semibold"
						style={{ color: branding.colours.grey.lightGrey5.formatHex() }}
					>
						Another Program
					</h3>
				</div>
				<div
					className="rounded-sm p-0.5"
					style={{
						backgroundColor: branding.colours.grey.lightGrey7.formatHex(),
					}}
				>
					<Plus className="size-4" />
				</div>
			</div>

			<div
				className="w-full h-64 flex flex-col items-center justify-end relative rounded-lg overflow-hidden"
				style={{
					backgroundImage: product.coverImage
						? `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(${getImageUrl(product.coverImage, "?height=600&format=webp")})`
						: "linear-gradient(to bottom, #a1a1aa, #52525b)",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div className="absolute bottom-5">
					<div className="flex flex-col gap-2.5 items-center">
						<h2
							className="font-bold text-2xl text-center px-4"
							style={{
								color: branding.colours.grey.lightBackground.formatHex(),
								...(fontFamily ? { fontFamily } : {}),
							}}
						>
							{product.name}
						</h2>
						<div className="flex flex-col items-center gap-2">
							<h3
								className="text-xxs font-semibold"
								style={{
									color: branding.colours.grey.lightBackground.formatHex(),
								}}
							>
								{product.durationWeeks} weeks • {product.daysPerWeek} days/week
								• {product.difficultyLevel}
							</h3>
							<div className="flex flex-row gap-2">
								<Button
									variant="opposite"
									size="xs"
									className="text-xxs font-medium pointer-events-none"
									style={{
										color: branding.colours.grey.lightForeground.formatHex(),
									}}
								>
									<Play
										fill={branding.colours.grey.lightForeground.formatHex()}
										style={{
											color: branding.colours.grey.lightForeground.formatHex(),
										}}
									/>
									Start Workout
								</Button>
								<Button
									variant="default"
									size="xs"
									className="text-xxs font-medium pointer-events-none"
									style={{
										color: branding.colours.grey.lightBackground.formatHex(),
										backgroundColor:
											branding.colours.grey.lightGrey3.formatHex(),
									}}
								>
									<Plus
										fill={branding.colours.grey.lightBackground.formatHex()}
										style={{
											color: branding.colours.grey.lightBackground.formatHex(),
										}}
									/>
									Favourites
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
