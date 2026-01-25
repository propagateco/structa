import type * as ProductInterface from "@core/product/product.interface";
import type * as ProductContentModel from "@core/product/product-content.model";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// API response type (dates as strings)
type ContentAPIResponse = Omit<
	ProductContentModel.SchemaType,
	"createdAt" | "updatedAt" | "deletedAt"
> & {
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
};

interface ProductCalendarProps {
	productId: string;
	durationWeeks: number;
	content: Record<
		number,
		Record<number, (ProductContentModel.SchemaType | ContentAPIResponse)[]>
	>;
	onAddContent: (
		weekNumber: number,
		dayNumber: number,
		type: ProductInterface.ContentType,
	) => void;
	onUpdateContent: (
		contentId: string,
		updates: ProductContentModel.UpdateProductContentType,
	) => void;
	onDeleteContent: (contentId: string) => void;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["June 2025"];

export function ProductCalendar({
	productId,
	durationWeeks,
	content,
	onAddContent,
	onUpdateContent,
	onDeleteContent,
}: ProductCalendarProps) {
	const [viewMode, setViewMode] = useState<"month" | "week">("month");
	const [currentMonth, setCurrentMonth] = useState(0);

	// For demo purposes, we'll show a June 2025 calendar
	const getDaysInMonth = () => {
		// June 2025 starts on a Sunday and has 30 days
		const firstDay = 0; // Sunday
		const daysInMonth = 30;
		const weeks = [];
		let currentWeek = new Array(7).fill(null);

		// Fill in the days before the month starts
		for (let i = 0; i < firstDay; i++) {
			currentWeek[i] = { day: 31 - (firstDay - i - 1), isOtherMonth: true };
		}

		// Fill in the days of the month
		let dayOfWeek = firstDay;
		for (let day = 1; day <= daysInMonth; day++) {
			currentWeek[dayOfWeek] = { day, isOtherMonth: false };
			dayOfWeek++;

			if (dayOfWeek === 7) {
				weeks.push(currentWeek);
				currentWeek = new Array(7).fill(null);
				dayOfWeek = 0;
			}
		}

		// Fill in the remaining days
		if (dayOfWeek > 0) {
			let nextMonthDay = 1;
			for (let i = dayOfWeek; i < 7; i++) {
				currentWeek[i] = { day: nextMonthDay++, isOtherMonth: true };
			}
			weeks.push(currentWeek);
		}

		return weeks;
	};

	const weeks = getDaysInMonth();

	return (
		<div className="max-w-[900px] mx-auto">
			{/* Calendar Header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<h2 className="text-2xl font-bold">Calendar view</h2>
					<span className="text-muted-foreground">{MONTHS[currentMonth]}</span>
				</div>
				<div className="flex items-center gap-2">
					<button className="p-1 hover:bg-muted rounded">
						<ChevronLeft className="w-4 h-4" />
					</button>
					<button className="px-3 py-1 text-sm font-medium hover:bg-muted rounded">
						Today
					</button>
					<button className="p-1 hover:bg-muted rounded">
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Calendar Grid */}
			<div className="border rounded-lg overflow-hidden">
				{/* Day headers */}
				<div className="grid grid-cols-7 bg-muted/30">
					{DAYS.map((day) => (
						<div
							key={day}
							className="px-3 py-2 text-xs font-medium text-muted-foreground text-center border-r last:border-r-0"
						>
							{day}
						</div>
					))}
				</div>

				{/* Calendar weeks */}
				{weeks.map((week, weekIndex) => (
					<div key={weekIndex} className="grid grid-cols-7">
						{week.map((dayInfo, dayIndex) => {
							const isToday =
								dayInfo && !dayInfo.isOtherMonth && dayInfo.day === 27;
							const hasContent =
								dayInfo && !dayInfo.isOtherMonth && dayInfo.day === 27;

							return (
								<div
									key={dayIndex}
									className={cn(
										"min-h-[100px] p-2 border-r border-b last:border-r-0",
										dayInfo?.isOtherMonth && "bg-muted/10",
									)}
								>
									{dayInfo && (
										<>
											<div
												className={cn(
													"text-sm mb-1",
													dayInfo.isOtherMonth && "text-muted-foreground",
													isToday && "font-bold",
												)}
											>
												{dayInfo.day}
											</div>
											{hasContent && (
												<div className="w-full h-6 bg-red-500 rounded-sm flex items-center justify-center">
													<span className="text-white text-xs font-medium">
														27
													</span>
												</div>
											)}
										</>
									)}
								</div>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}
