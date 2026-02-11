// Example usage of the new Google Fonts

// Fonts are loaded in packages/web/src/routes/__root.tsx
// Usage: apply utility classes like .font-newsreader, .font-eb-garamond, etc.

export function FontExample() {
	return (
		<div className="space-y-4 p-8">
			<h1 className="font-newsreader text-4xl">Newsreader Font</h1>
			<p className="font-newsreader text-lg">
				This text uses the Newsreader Google Font. A classic serif typeface
				designed for editorial use.
			</p>

			<h2 className="font-eb-garamond text-4xl">EB Garamond Font</h2>
			<p className="font-eb-garamond text-lg">
				This text uses the EB Garamond Google Font. A revival of Claude
				Garamond's typefaces.
			</p>

			<h3 className="font-cormorant-garamond text-4xl">
				Cormorant Garamond Font
			</h3>
			<p className="font-cormorant-garamond text-lg">
				This text uses the Cormorant Garamond Google Font. A contemporary serif
				with display qualities.
			</p>

			<h4 className="font-figtree text-4xl">Figtree Font</h4>
			<p className="font-figtree text-lg">
				This text uses the Figtree Google Font. A clean, geometric sans-serif
				font.
			</p>
		</div>
	);
}
