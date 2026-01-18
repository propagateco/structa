import { BrandingModel } from '@core/branding';
import { AccentColour, GreyColour } from '@core/utils/colour';
import { ColourBlock } from './colour-block';
import { useAtomValue } from 'jotai';
import { brandingChangesAtom } from '@/state/branding';
import { useState } from 'react';

export function ColourCard({ colours }: { colours: BrandingModel.BrandingQueryType['colours'] }) {
	const [hoveredElement, setHoveredElement] = useState<'accent' | 'grey' | null>(null);
	
	// Use Jotai atoms for state management
	const changes = useAtomValue(brandingChangesAtom);
	

	const preview = {
		accent: changes.colours?.accent || new AccentColour(colours.accent.formatHex()),
		grey: changes.colours?.grey || new GreyColour(colours.grey.formatHex()),
	};

	return (
		// <div className="grid grid-cols-6 auto-rows-[4.5rem] lg:auto-rows-[5.5rem] xl:auto-rows-[7.5rem] 2xl:auto-rows-[8rem] gap-4 p-4">
		<div className="grid grid-cols-6 auto-rows-[8rem] gap-4 p-4">
			<div className="col-span-3 sm:col-span-2 row-span-2 relative">
				<ColourBlock
					colour={preview.accent}
					name="Accent"
					hoveredElement={hoveredElement}
					isDefault={true}
					visibleFor="accent"
					className="z-10"
					onMouseEnter={() => setHoveredElement('accent')}
					onMouseLeave={() => setHoveredElement(null)}
				/>
				<ColourBlock
					colour={preview.grey.lightGrey1}
					name="Light Grey 1"
					hoveredElement={hoveredElement}
					visibleFor="grey"
					className="z-0"
				/>
			</div>
			<div className="col-span-3 sm:col-span-2 row-span-2 relative">
				<ColourBlock
					colour={preview.grey}
					name="Grey"
					hoveredElement={hoveredElement}
					isDefault={true}
					visibleFor="grey"
					className="z-10"
					onMouseEnter={() => setHoveredElement('grey')}
					onMouseLeave={() => setHoveredElement(null)}
				/>
				<ColourBlock
					colour={preview.accent.darkAccent}
					name="Dark Accent"
					hoveredElement={hoveredElement}
					visibleFor="accent"
					className="z-0"
				/>
			</div>
			<div className="hidden sm:block col-span-1 row-span-1 relative">
				<ColourBlock
					colour={preview.grey.lightGrey7}
					name="Light Grey 7"
					hoveredElement={hoveredElement}
					visibleFor="grey"
					isDefault={true}
				/>
				<ColourBlock
					colour={preview.accent.lightAccentLow}
					name="Light Accent Low"
					hoveredElement={hoveredElement}
					visibleFor="accent"
				/>
			</div>
			<div className="hidden sm:block col-span-1 row-span-1 relative">
				<ColourBlock
					colour={preview.accent.lightAccentHigh}
					name="Light Accent High"
					hoveredElement={hoveredElement}
					isDefault={true}
					visibleFor="accent"
				/>
				<ColourBlock
					colour={preview.grey.lightForeground}
					name="Light Foreground"
					hoveredElement={hoveredElement}
					visibleFor="grey"
				/>
			</div>
			<div className="hidden sm:block col-span-1 row-span-1 relative">
				<ColourBlock
					colour={preview.accent.darkAccentHigh}
					name="Dark Accent High"
					hoveredElement={hoveredElement}
					visibleFor="accent"
				/>
				<ColourBlock
					colour={preview.accent.darkAccent}
					name="Dark Accent"
					hoveredElement={hoveredElement}
					isDefault={true}
					visibleFor="default"
				/>
				<ColourBlock
					colour={preview.grey.lightGrey5}
					name="Light Grey 5"
					hoveredElement={hoveredElement}
					visibleFor="grey"
				/>
			</div>
			<div className="hidden sm:block col-span-1 row-span-1 relative">
				<ColourBlock
					colour={preview.accent.darkAccentLow}
					name="Dark Accent Low"
					hoveredElement={hoveredElement}
					visibleFor="accent"
				/>
				<ColourBlock
					colour={preview.grey.lightGrey2}
					name="Light Grey 2"
					hoveredElement={hoveredElement}
					isDefault={true}
					visibleFor="grey"
				/>
			</div>
		</div>
	);
}
