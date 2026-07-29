import { createFileRoute } from "@tanstack/react-router";
import { TexturedSection } from "@/components/layout";

export const Route = createFileRoute("/_marketing/help")({
	component: HelpPage,
});

function HelpPage() {
	return (
		<TexturedSection
			showTopDivider={false}
			showBottomDivider={false}
			showTopDiamonds={false}
			showGrid={false}
		>
			<div className="col-span-2 md:col-span-8">
				<header className="my-12 md:my-16 space-y-4">
					<h1 className="font-heading text-4xl md:text-5xl">Help Center</h1>
					<p className="text-muted-foreground text-lg">
						Get help with Structa — guides, FAQs, and support.
					</p>
				</header>
			</div>
		</TexturedSection>
	);
}
