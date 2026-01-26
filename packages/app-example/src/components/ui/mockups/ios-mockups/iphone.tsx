import type { AppModel } from "@core/app";
import type { BrandingModel } from "@core/branding/branding.model";
import { useAtomValue } from "jotai";
import {
	Activity,
	Cast,
	CircleUserRound,
	GalleryVerticalEndIcon,
	Home,
	MessageSquare,
	Play,
	Plus,
	Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/mockups/app-icon";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
	brandingChangesAtom,
	getBrandingFontFamilyAtom,
} from "@/state/branding";
import { WorkoutPreview } from "./workout-preview";

// Create a type that extends BrandingQueryType for our preview
type BrandingPreviewType = BrandingModel.BrandingQueryType & {
	name: string; // App name from app model
	description: string | undefined | null; // App description from app model
};

export function IPhoneMockup({
	branding,
	app,
}: {
	branding: BrandingModel.BrandingQueryType;
	app: AppModel.AppType;
}) {
	// Use direct Jotai atoms for live preview data (no debouncing delays)
	const changes = useAtomValue(brandingChangesAtom);
	const getFontFamily = useAtomValue(getBrandingFontFamilyAtom);

	// Get name and description with fallbacks
	const appName = changes.name !== undefined ? changes.name : app.name;
	const appDescription =
		changes.description !== undefined ? changes.description : app.description;

	// Apply live changes to original branding for instant preview
	const preview: BrandingPreviewType = {
		...branding,
		name: appName,
		description: appDescription,
		// Use changes if available, otherwise use original values
		font:
			changes.font !== null && changes.font !== undefined
				? changes.font
				: branding.font,
		// For file objects, create URL objects for preview
		// Handle icon changes - File, null, or use existing
		icon: (() => {
			if (changes.icon instanceof File) {
				return URL.createObjectURL(changes.icon);
			} else if (changes.icon === null) {
				return null;
			} else {
				return branding.icon;
			}
		})(),
		// Handle lightLargeLogo changes - File, null, or use existing
		lightLargeLogo: (() => {
			if (changes.lightLargeLogo instanceof File) {
				return URL.createObjectURL(changes.lightLargeLogo);
			} else if (changes.lightLargeLogo === null) {
				return null;
			} else {
				return branding.lightLargeLogo;
			}
		})(),
		// Handle darkLargeLogo changes - File, null, or use existing
		darkLargeLogo: (() => {
			if (changes.darkLargeLogo instanceof File) {
				return URL.createObjectURL(changes.darkLargeLogo);
			} else if (changes.darkLargeLogo === null) {
				return null;
			} else {
				return branding.darkLargeLogo;
			}
		})(),
		colours: {
			accent: changes.colours?.accent || branding.colours.accent,
			grey: changes.colours?.grey || branding.colours.grey,
		},
	};

	const containerRef = useRef<HTMLDivElement>(null);
	const [borderRadius, setBorderRadius] = useState("45px");
	const [innerRadius, setInnerRadius] = useState("37px");
	const [borderWidth, setBorderWidth] = useState("8px");
	const [innerBorderWidth, setInnerBorderWidth] = useState("3px");

	useEffect(() => {
		if (!containerRef.current) return;

		const updateSizes = () => {
			if (!containerRef.current) return;
			const width = containerRef.current.offsetWidth;
			// Calculate sizes proportionally based on original width of 288px
			const ratio = width / 288;

			// Border radius
			const outerRadius = Math.round(ratio * 45);
			const innerRadius = Math.round(ratio * 37);
			setBorderRadius(`${outerRadius}px`);
			setInnerRadius(`${innerRadius}px`);

			// Border width
			const outerBorderWidth = Math.max(1, Math.round(ratio * 8));
			const innerBorderWidth = Math.max(1, Math.round(ratio * 3));
			setBorderWidth(`${outerBorderWidth}px`);
			setInnerBorderWidth(`${innerBorderWidth}px`);
		};

		// Initialize
		updateSizes();

		// Update on resize
		const observer = new ResizeObserver(updateSizes);
		observer.observe(containerRef.current);

		return () => {
			if (containerRef.current) {
				observer.unobserve(containerRef.current);
			}
		};
	}, []);

	return (
		<div className="relative w-full max-w-72 mx-auto" ref={containerRef}>
			{/* Maintain exact aspect ratio of original */}
			<div className="aspect-[72/150]">
				{/* Use scaling wrapper */}
				<div
					className="relative w-full h-full overflow-hidden shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3),inset_0_-2px_6px_0_rgba(10,37,64,0.35)]"
					style={{
						borderRadius,
						borderWidth,
						borderStyle: "none",
						backgroundColor: preview.colours.grey.lightBackground.formatHex(),
					}}
				>
					{/* <!-- Dynamic Island --> maintains exact proportions */}
					<div className="absolute top-2 inset-x-0 mx-auto w-[31.25%] h-[3.67%] bg-ds-mono-200 rounded-full z-20"></div>

					<div className="absolute -inset-[1px] pointer-events-none"></div>

					{/* <!-- Screen Content --> */}
					<div className="relative flex flex-col h-full overflow-hidden justify-between">
						<div className="flex flex-col w-full gap-5 px-3">
							<Header branding={preview} getFontFamily={getFontFamily} />
							<WorkoutPreview
								branding={preview}
								getFontFamily={getFontFamily}
							/>
							<ExampleProgramCard
								branding={preview}
								getFontFamily={getFontFamily}
							/>
						</div>
						<TabBar
							branding={preview}
							borderRadius={borderRadius}
							borderWidth={borderWidth}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function Header({
	branding,
	getFontFamily,
}: {
	branding: BrandingPreviewType;
	getFontFamily: (fontName: string) => string;
}) {
	const fontFamily = getFontFamily(branding.font);
	return (
		<div className="flex flex-col w-full gap-5">
			<div className="flex items-center justify-between w-full mt-12 h-[22px]">
				<div className="h-[22px] max-w-[175px]">
					{branding.lightLargeLogo !== null ? (
						<img
							src={branding.lightLargeLogo}
							alt="App Logo"
							className="h-full object-contain"
						/>
					) : (
						<div className="h-full w-full flex items-center justify-center gap-1">
							<AppIcon src={branding.icon} className="h-6 w-6" />
							<h3
								className="text-lg font-medium truncate"
								style={{
									color: branding.colours.grey.lightGrey1.formatHex(),
									fontFamily,
								}}
							>
								{branding.name}
							</h3>
						</div>
					)}
				</div>
				<div>
					<div
						className="flex items-center space-x-4"
						style={{ color: branding.colours.grey.lightForeground.formatHex() }}
					>
						<Cast className="h-4 w-4" />
						<Search className="h-4 w-4" />
					</div>
				</div>
			</div>
			<DayBar branding={branding} days={days} />
		</div>
	);
}

type DayStatus = "completed" | "incomplete" | "upcoming";
type Day = {
	day: string;
	status: DayStatus;
};

const days: Day[] = [
	{
		day: "Mon",
		status: "completed",
	},
	{
		day: "Tue",
		status: "incomplete",
	},
	{
		day: "Wed",
		status: "completed",
	},
	{
		day: "Thu",
		status: "completed",
	},
	{
		day: "Fri",
		status: "completed",
	},
	{
		day: "Sat",
		status: "upcoming",
	},
	{
		day: "Sun",
		status: "upcoming",
	},
];

function DayBar({
	branding,
	days,
}: {
	branding: BrandingPreviewType;
	days: Day[];
}) {
	return (
		<div className="flex items-center justify-between w-full h-8">
			{days.map((day, index) => (
				<DayItem
					branding={branding}
					day={day.day}
					index={index}
					status={day.status}
					key={day.day}
				/>
			))}
		</div>
	);
}

function DayItem({
	branding,
	day,
	index,
	status,
}: {
	branding: BrandingPreviewType;
	day: string;
	index: number;
	status: DayStatus;
}) {
	const dayBackgroundColour = (status: DayStatus) => {
		switch (status) {
			case "completed":
				return branding.colours.accent.lightAccentLow.formatHex();
			case "incomplete":
				return branding.colours.grey.lightGrey6.formatHex();
			case "upcoming":
				return "transparent";
			default:
				return "transparent";
		}
	};

	const textColor = (status: DayStatus) => {
		switch (status) {
			case "completed":
				return branding.colours.accent.lightAccentHigh;
			case "incomplete":
				return branding.colours.grey.lightGrey2;
			case "upcoming":
				return branding.colours.grey.lightGrey2;
			default:
				return branding.colours.grey.lightGrey5;
		}
	};

	return (
		<div key={day} className="flex items-center justify-center h-full">
			<div
				className="w-6 h-full rounded-sm font-medium text-[9px] flex flex-col items-center justify-center"
				style={{
					backgroundColor: dayBackgroundColour(status),
					color: textColor(status).formatHex(),
				}}
			>
				<p>{day}</p>
				<p>{index}</p>
			</div>
		</div>
	);
}

function TabBar({
	branding,
	borderRadius,
	borderWidth,
}: {
	branding: BrandingPreviewType;
	borderRadius: string;
	borderWidth: string;
}) {
	return (
		<div
			className="flex flex-row justify-between items-center w-full text-[8px] py-4 absolute bottom-0 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3),inset_0_-3px_6px_0_rgba(10,37,64,0.35)]"
			style={{
				backgroundColor: branding.colours.grey.lightGrey7.formatCss(0.4),
				backdropFilter: "blur(10px)",
				borderStyle: "none",
				borderBottomLeftRadius: borderRadius,
				borderBottomRightRadius: borderRadius,
				borderBottomWidth: borderWidth,
				borderTopStyle: "none",
			}}
		>
			<div className="flex flex-row justify-between items-center w-full px-5">
				<TabItem label="Home" branding={branding} active>
					<Home size={20} />
				</TabItem>
				<TabItem label="Community" branding={branding} bubble>
					<MessageSquare size={20} />
				</TabItem>
				<TabItem label="Tracking" branding={branding}>
					<Activity size={20} />
				</TabItem>
				<TabItem label="Programs" branding={branding}>
					<GalleryVerticalEndIcon size={20} />
				</TabItem>
				<TabItem label="Profile" branding={branding}>
					<CircleUserRound size={20} />
				</TabItem>
			</div>
		</div>
	);
}

function TabItem({
	label,
	active,
	bubble,
	branding,
	children,
}: {
	label: string;
	active?: boolean;
	bubble?: boolean;
	branding: BrandingPreviewType;
	children: React.ReactNode;
}) {
	return (
		<div
			className={"relative flex flex-col items-center justify-center gap-1"}
			style={{
				color: active
					? branding.colours.grey.lightForeground.formatHex()
					: branding.colours.grey.lightGrey4.formatHex(),
			}}
		>
			{children}
			{bubble && (
				<div
					className="absolute -top-1 right-0 w-4 h-4 rounded-full"
					style={{
						backgroundColor: branding.colours.accent.lightAccent.formatHex(),
					}}
				></div>
			)}
			<span className="text-xxs">{label}</span>
		</div>
	);
}

function ExampleProgramCard({
	branding,
	getFontFamily,
}: {
	branding: BrandingPreviewType;
	getFontFamily: (fontName: string) => string;
}) {
	const fontFamily = getFontFamily(branding.font);
	return (
		<div
			className="rounded-md p-2"
			style={{
				backgroundColor: branding.colours.grey.lightBackground.formatHex(),
				color: branding.colours.grey.lightForeground.formatHex(),
				borderStyle: "solid",
				borderColor: branding.colours.grey.lightGrey6.formatHex(),
				borderWidth: "1px",
				borderRadius: "0.375rem",
				fontFamily,
			}}
		>
			<div className="flex flex-row items-center gap-1.5 text-xs">
				<WorkoutPhaseText phase="W" branding={branding} />
				<h3 className="font-semibold">Warm Up</h3>
			</div>
			<Separator
				className="w-full border-none my-2"
				style={{
					borderTop: "solid",
					borderTopColor: branding.colours.grey.lightGrey6.formatHex(),
					borderTopWidth: "1px",
				}}
			/>
			<p className="text-xs">
				30s Walking lunges <br />
				30s Hip rotations <br />
				1min Bear walks
				<br />
				5-10 minutes easy running
			</p>
		</div>
	);
}

function WorkoutPhaseText({
	phase,
	branding,
}: {
	phase: string;
	branding: BrandingPreviewType;
}) {
	return (
		<div
			className="flex flex-col justify-center items-center text-xs h-4 w-4"
			style={{
				color: branding.colours.grey.lightForeground.formatHex(),
				borderStyle: "solid",
				borderColor: branding.colours.grey.lightGrey3.formatHex(),
				borderWidth: "1px",
				borderRadius: "0.25rem",
			}}
		>
			<p className="font-semibold uppercase text-xxs">{phase}</p>
		</div>
	);
}
