import { formatTimeSince } from "@core/utils/date";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
	RelativeTime,
	RelativeTimeZone,
	RelativeTimeZoneDate,
	RelativeTimeZoneDisplay,
	RelativeTimeZoneLabel,
} from "@/components/ui/relative-time";
import { SlidingNumber } from "@/components/ui/sliding-number";

interface AuthorTimeProps {
	authorName: string;
	authorAvatar?: string | null;
	timestamp: Date | string;
	className?: string;
}

// Component to render time with sliding number animation
function AnimatedTimeSince({ date }: { date: Date }) {
	const [timeString, setTimeString] = React.useState(() =>
		formatTimeSince(date),
	);

	React.useEffect(() => {
		const updateTime = () => {
			setTimeString(formatTimeSince(date));
		};

		// Update immediately
		updateTime();

		// Then update every second
		const interval = setInterval(updateTime, 1000);

		return () => clearInterval(interval);
	}, [date]);

	// Parse the time string to extract number and unit
	const match = timeString.match(/^(\d+)\s+(second|minute|hour|day)s?\s+ago$/);

	if (!match) {
		// If format doesn't match (e.g., date format like "15 Jan"), return as is
		// without animation to prevent flickering
		return <span>{timeString}</span>;
	}

	const [, numberStr, unit] = match;
	const number = parseInt(numberStr, 10);
	const unitText = number === 1 ? `${unit} ago` : `${unit}s ago`;

	return (
		<span className="inline-flex items-center">
			<SlidingNumber value={number} />
			<span className="ml-1">{unitText}</span>
		</span>
	);
}

export function AuthorTime({
	authorName,
	authorAvatar,
	timestamp,
	className = "",
}: AuthorTimeProps) {
	const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

	return (
		<HoverCard openDelay={200}>
			<HoverCardTrigger asChild>
				<span
					className={`inline-flex items-center gap-2 cursor-pointer ${className}`}
				>
					<span className="inline-flex items-center">
						<AnimatedTimeSince date={date} />
						<span className="ml-1">by {authorName}</span>
					</span>
					<Avatar className="size-5">
						<AvatarImage
							src={
								authorAvatar
									? `${authorAvatar}?width=400&height=400&format=webp`
									: undefined
							}
						/>
						<AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
					</Avatar>
				</span>
			</HoverCardTrigger>
			<HoverCardContent className="w-auto" align="center" sideOffset={8}>
				<div className="flex items-center gap-3">
					<RelativeTime time={date}>
						<RelativeTimeZone zone="UTC">
							<RelativeTimeZoneLabel>UTC</RelativeTimeZoneLabel>
							<RelativeTimeZoneDate />
							<RelativeTimeZoneDisplay />
						</RelativeTimeZone>
						<RelativeTimeZone zone="Europe/London">
							<RelativeTimeZoneLabel>GMT</RelativeTimeZoneLabel>
							<RelativeTimeZoneDate />
							<RelativeTimeZoneDisplay />
						</RelativeTimeZone>
						<RelativeTimeZone zone="America/New_York">
							<RelativeTimeZoneLabel>EST</RelativeTimeZoneLabel>
							<RelativeTimeZoneDate />
							<RelativeTimeZoneDisplay />
						</RelativeTimeZone>
					</RelativeTime>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
