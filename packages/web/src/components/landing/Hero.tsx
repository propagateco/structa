import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { GridBackgroundSection } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { PageLink } from "@/components/ui/link";

type RoutePath = LinkProps["to"];

export interface HeroProps {
	title?: string;
	titleTop?: string;
	titleBottom?: string;
	description?: string;
	primaryCTA?: {
		text: string;
		to: RoutePath;
	};
	secondaryCTA?: {
		text: string;
		to: RoutePath;
		params?: Record<string, string>;
	};
}

export function Hero({
	title = "Confident renovation decisions\n in minutes, not months",
	titleTop = "Renovate with confidence.",
	// titleBottom = ' AI guidance for your property, the home for renovation planning.',
	// titleBottom = 'AI that understands your property and guides every decision.',
	titleBottom = "AI-powered workspace for UK homeowners.",
	description = "AI assistant that understands your property and guides your renovation. Budget tracking, floor planning, and tradesperson matching in one intelligent workspace.",

	// description = 'Eliminate the guesswork AI-powered workspace that brings context, clarity, and confidence to every home renovation.',
	primaryCTA = { text: "get started", to: "/login" },
	secondaryCTA = {
		text: "our latest renovation guide",
		to: "/guides/$slug",
		params: { slug: "renovation-checklist" },
	},
}: HeroProps) {
	return (
		<GridBackgroundSection
			variant="hero"
			showTopDivider={false}
			showBottomDivider={true}
			showDiamonds={false}
			showGridBackground={true}
		>
			<div className="max-w-xl md:max-w-2xl relative col-span-4 sm:col-span-6 lg:col-span-8 space-y-5 sm:space-y-6  md:pt-10 pb-5 md:pb-16">
				{/* Hero Title */}
				<h1 className="font-heading text-text font-normal tracking-tight text-4xl lg:text-5xl text-left whitespace-pre-line">
					{titleTop}
					<br />
					<span className="text-text-secondary">{titleBottom}</span>
				</h1>

				{/* CTA Buttons */}
				<div className="w-full flex flex-col sm:flex-row items-center justify-start gap-2 sm:gap-8 pt-2 md:pt-3">
					<Link to={primaryCTA.to} className="w-full sm:w-auto">
						<Button
							className="w-full inline-flex items-center justify-center"
							size="lg"
						>
							{primaryCTA.text}
						</Button>
					</Link>
					<PageLink
						to={secondaryCTA.to}
						params={secondaryCTA.params}
						variant={"default"}
						className="w-full justify-center px-6 py-2 sm:px-0 sm:w-auto"
						arrowForward
					>
						{secondaryCTA.text}
					</PageLink>
				</div>
			</div>
		</GridBackgroundSection>
	);
}
