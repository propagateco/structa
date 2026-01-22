import {
	clampChroma,
	converter,
	formatCss,
	formatHex,
	modeLrgb,
	modeOklch,
	modeRgb,
	type Oklch,
	type Rgb,
	useMode,
	wcagContrast,
} from "culori/fn";

const rgb = useMode(modeRgb);
const oklch = useMode(modeOklch);
// We need to initialise LRGB support for culori’s `wcagContrast()` method.
useMode(modeLrgb);

export class Colour {
	public hex!: string;
	public _oklch!: Oklch;
	public h!: number;
	public c!: number;
	public l!: number;

	constructor(colour: string | Oklch) {
		if (typeof colour === "string") {
			this.setColourFromHex(colour);
		} else {
			this.setColourFromOklch(colour);
		}
	}

	static lchToOklch(l: number, c: number, h: number): Oklch {
		return oklch(`oklch(${l}% ${c} ${h})`)!;
	}

	private toRgb(alpha?: number): Rgb {
		const rgbColour = rgb(clampChroma(this._oklch, "oklch"));
		if (!rgbColour) {
			throw new Error(`Invalid RGB conversion for OKLCH: ${this._oklch}`);
		}
		rgbColour.alpha = alpha ?? 1;
		return rgbColour;
	}

	/**
	 * Convert a Culori OKLCH color object to a hex string
	 */
	oklchToHex(oklchColor: Oklch): string {
		const rgbColour = rgb(clampChroma(oklchColor, "oklch"));
		if (!rgbColour) {
			throw new Error(`Invalid RGB conversion for OKLCH: ${oklchColor}`);
		}
		return formatHex(rgbColour).toUpperCase();
	}

	/**
	 * Convert a hex string to a Culori OKLCH color object
	 */
	hexToOklch(hex: string): Oklch {
		const oklchConverter = converter("oklch");
		const oklch = oklchConverter(hex);
		if (!oklch) {
			throw new Error(`Invalid OKLCH conversion for hex: ${hex}`);
		}
		return oklch;
	}

	/**
	 * Convert this color to a CSS-compatible string
	 * @param alpha - Optional alpha value for transparency
	 */
	formatCss(alpha?: number): string {
		const colour = this.toRgb(alpha);
		return formatCss(colour);
	}

	/**
	 * Convert this color to a hex string
	 */
	formatHex(): string {
		const colour = this.toRgb();
		return formatHex(colour);
	}

	/**
	 * Update the colour values based on the provided hex string
	 */
	setColourFromHex(hex: string) {
		this._oklch = this.hexToOklch(hex);
		this.h = this._oklch.h || 0;
		this.c = this._oklch.c;
		this.l = this._oklch.l;
		this.hex = hex.toUpperCase();
	}

	/**
	 * Update the colour values based on the provided OKLCH object
	 */
	setColourFromOklch(oklchColor: Oklch): void {
		this._oklch = oklchColor;
		this.h = oklchColor.h || 0;
		this.c = oklchColor.c;
		this.l = oklchColor.l;
		this.hex = this.oklchToHex(oklchColor);
	}

	isLight(): boolean {
		return this.l > 0.55;
	}

	isCloseToWhite(): boolean {
		return this.l > 0.95 && this.c < 0.01 && this.h < 0.01;
	}

	/**
	 * Convert this color to a Culori OKLCH color object
	 */
	toOklch(): Oklch {
		const oklch = converter("oklch");

		const result = oklch(this.hex);
		if (!result) {
			throw new Error(`Invalid OKLCH conversion for hex: ${this.hex}`);
		}
		return result;
	}

	/**
	 * Ensure a text colour passes a contrast threshold against a specific background colour.
	 * If necessary, colours will be darkened/lightened to increase contrast until the threshold is passed.
	 */
	static contrastColor(text: Oklch, bg: Oklch, threshold = 4.5): Oklch {
		/** Clone of the input foreground colour to mutate. */
		const fgColor = { ...text };
		// Brighten text in dark mode, darken text in light mode.
		const increment = fgColor.l > bg.l ? 0.005 : -0.005;
		while (
			wcagContrast(fgColor, bg) < threshold &&
			fgColor.l < 100 &&
			fgColor.l > 0
		) {
			fgColor.l += increment;
		}
		return fgColor;
	}
}

export abstract class ColourComposition {
	// The base color
	public baseColour: Colour;
	public hex!: string;

	constructor(baseColour: Colour | string) {
		// Initialize with a Colour object or create one from the input
		if (typeof baseColour === "string") {
			this.baseColour = new Colour(baseColour);
		} else {
			this.baseColour = baseColour;
		}
	}

	// Method to update the base color and regenerate variants
	public abstract setColourFromHex(hex: string): this;

	// Method to generate all variant colors based on the base color
	protected abstract generatePalette(): void;

	// Get the hex string of the base color
	public formatHex(): string {
		return this.baseColour.formatHex();
	}

	public isLight(): boolean {
		return this.baseColour.isLight();
	}

	public isCloseToWhite(): boolean {
		return this.baseColour.isCloseToWhite();
	}
}

type AccentColourPalette = {
	light: {
		accent: Oklch;
		accentHigh: Oklch;
		accentLow: Oklch;
	};
	dark: {
		accent: Oklch;
		accentHigh: Oklch;
		accentLow: Oklch;
	};
};

// AccentColour implementation using ColourComposition
export class AccentColour extends ColourComposition {
	// All variant colors
	public lightAccent: Colour;
	public lightAccentHigh: Colour;
	public lightAccentLow: Colour;
	public darkAccent: Colour;
	public darkAccentHigh: Colour;
	public darkAccentLow: Colour;

	constructor(hex: string) {
		// Initialize the base composition with the light accent color
		super(hex);

		const palette = this.generatePalette();
		// Initialize all color instances with the palette values
		this.lightAccent = new Colour(palette.light.accent);
		this.lightAccentHigh = new Colour(palette.light.accentHigh);
		this.lightAccentLow = new Colour(palette.light.accentLow);
		this.darkAccent = new Colour(palette.dark.accent);
		this.darkAccentHigh = new Colour(palette.dark.accentHigh);
		this.darkAccentLow = new Colour(palette.dark.accentLow);
	}

	// Override setColour method to update base color and regenerate variants
	public setColourFromHex(hex: string): this {
		// Update the base color and lightAccent color
		this.baseColour.setColourFromHex(hex);
		this.lightAccent.setColourFromHex(hex);

		const palette = this.generatePalette();
		this.lightAccent.setColourFromOklch(palette.light.accent);
		this.lightAccentHigh.setColourFromOklch(palette.light.accentHigh);
		this.lightAccentLow.setColourFromOklch(palette.light.accentLow);
		this.darkAccent.setColourFromOklch(palette.dark.accent);
		this.darkAccentHigh.setColourFromOklch(palette.dark.accentHigh);
		this.darkAccentLow.setColourFromOklch(palette.dark.accentLow);

		return this;
	}

	// Generate all color variants based on the lightAccent color using OKLCH
	protected generatePalette(): AccentColourPalette {
		// Extract hue and chroma from base color
		const accentHue = this.baseColour._oklch.h ?? 0;
		const accentChroma = this.baseColour._oklch.c ?? 0.1;
		const minimumContrast = 4.5; // WCAG AA standard

		// Generate light mode accent colors
		const lightAccentLowOklch = Colour.lchToOklch(
			87.81,
			accentChroma / 4,
			accentHue,
		);
		const lightAccentOklch = this.baseColour._oklch; // Use the base color directly
		const lightAccentHighOklch = Colour.lchToOklch(
			31.77,
			accentChroma / 2,
			accentHue,
		);

		// Generate dark mode accent colors
		const darkAccentLowOklch = Colour.lchToOklch(
			25.94,
			accentChroma / 3,
			accentHue,
		);
		const darkAccentOklch = Colour.lchToOklch(52.28, accentChroma, accentHue);
		const darkAccentHighOklch = Colour.lchToOklch(
			83.38,
			accentChroma / 3,
			accentHue,
		);

		// Apply contrast adjustments if needed (example for light accent against dark background)
		const darkBgOklch = Colour.lchToOklch(20.94, 0.01, accentHue);
		const lightBgOklch = Colour.lchToOklch(94.77, 0.008, accentHue);

		// Ensure sufficient contrast
		const _adjustedLightAccentOklch = Colour.contrastColor(
			lightAccentOklch,
			lightBgOklch,
			minimumContrast,
		);
		const _adjustedDarkAccentOklch = Colour.contrastColor(
			darkAccentOklch,
			darkBgOklch,
			minimumContrast,
		);

		return {
			light: {
				accent: lightAccentOklch,
				accentHigh: lightAccentHighOklch,
				accentLow: lightAccentLowOklch,
			},
			dark: {
				accent: darkAccentOklch,
				accentHigh: darkAccentHighOklch,
				accentLow: darkAccentLowOklch,
			},
		};
	}

	// Get all the color hex values as an object matching BrandingType structure
	getHexValues(): Record<string, string> {
		return {
			lightAccent: this.lightAccent.formatHex(),
			lightAccentHigh: this.lightAccentHigh.formatHex(),
			lightAccentLow: this.lightAccentLow.formatHex(),
			darkAccent: this.darkAccent.formatHex(),
			darkAccentHigh: this.darkAccentHigh.formatHex(),
			darkAccentLow: this.darkAccentLow.formatHex(),
		};
	}
}

type GreyColourPalette = {
	light: {
		"grey-1": Oklch;
		"grey-2": Oklch;
		"grey-3": Oklch;
		"grey-4": Oklch;
		"grey-5": Oklch;
		"grey-6": Oklch;
		"grey-7": Oklch;
		background: Oklch;
		foreground: Oklch;
	};
	dark: {
		"grey-1": Oklch;
		"grey-2": Oklch;
		"grey-3": Oklch;
		"grey-4": Oklch;
		"grey-5": Oklch;
		"grey-6": Oklch;
		"grey-7": Oklch;
		background: Oklch;
		foreground: Oklch;
	};
};

export class GreyColour extends ColourComposition {
	// Grey color variants
	public lightGrey1: Colour;
	public lightGrey2: Colour;
	public lightGrey3: Colour;
	public lightGrey4: Colour;
	public lightGrey5: Colour;
	public lightGrey6: Colour;
	public lightGrey7: Colour;
	public lightBackground: Colour;
	public lightForeground: Colour;
	public darkGrey1: Colour;
	public darkGrey2: Colour;
	public darkGrey3: Colour;
	public darkGrey4: Colour;
	public darkGrey5: Colour;
	public darkGrey6: Colour;
	public darkGrey7: Colour;
	public darkBackground: Colour;
	public darkForeground: Colour;

	constructor(hex: string) {
		// Initialize with the base color (mid tone grey-3 colour)
		super(hex);

		const palette = this.generatePalette();

		// Initialize all grey variants from the generated palette
		this.lightGrey1 = new Colour(palette.light["grey-1"]!);
		this.lightGrey2 = new Colour(palette.light["grey-2"]!);
		this.lightGrey3 = new Colour(palette.light["grey-3"]!);
		this.lightGrey4 = new Colour(palette.light["grey-4"]!);
		this.lightGrey5 = new Colour(palette.light["grey-5"]!);
		this.lightGrey6 = new Colour(palette.light["grey-6"]!);
		this.lightGrey7 = new Colour(palette.light["grey-7"]!);
		this.lightBackground = new Colour(palette.light.background);
		this.lightForeground = new Colour(palette.light.foreground);

		// Dark mode versions
		this.darkGrey1 = new Colour(palette.dark["grey-1"]);
		this.darkGrey2 = new Colour(palette.dark["grey-2"]);
		this.darkGrey3 = new Colour(palette.dark["grey-3"]);
		this.darkGrey4 = new Colour(palette.dark["grey-4"]);
		this.darkGrey5 = new Colour(palette.dark["grey-5"]);
		this.darkGrey6 = new Colour(palette.dark["grey-6"]);
		this.darkGrey7 = new Colour(palette.dark["grey-7"]);
		this.darkBackground = new Colour(palette.dark.background);
		this.darkForeground = new Colour(palette.dark.foreground);
	}

	// Update the base grey color and regenerate all variants
	public setColourFromHex(hex: string): this {
		// Update the base color (grey3)
		this.baseColour.setColourFromHex(hex);
		this.lightGrey3.setColourFromHex(hex);

		// Generate all grey variants
		const palette = this.generatePalette();
		this.lightGrey1.setColourFromOklch(palette.light["grey-1"]);
		this.lightGrey2.setColourFromOklch(palette.light["grey-2"]);
		this.lightGrey3.setColourFromOklch(palette.light["grey-3"]);
		this.lightGrey4.setColourFromOklch(palette.light["grey-4"]);
		this.lightGrey5.setColourFromOklch(palette.light["grey-5"]);
		this.lightGrey6.setColourFromOklch(palette.light["grey-6"]);
		this.lightGrey7.setColourFromOklch(palette.light["grey-7"]);
		this.lightBackground.setColourFromOklch(palette.light.background);
		this.lightForeground.setColourFromOklch(palette.light.foreground);

		this.darkGrey1.setColourFromOklch(palette.dark["grey-1"]);
		this.darkGrey2.setColourFromOklch(palette.dark["grey-2"]);
		this.darkGrey3.setColourFromOklch(palette.dark["grey-3"]);
		this.darkGrey4.setColourFromOklch(palette.dark["grey-4"]);
		this.darkGrey5.setColourFromOklch(palette.dark["grey-5"]);
		this.darkGrey6.setColourFromOklch(palette.dark["grey-6"]);
		this.darkGrey7.setColourFromOklch(palette.dark["grey-7"]);
		this.darkBackground.setColourFromOklch(palette.dark.background);
		this.darkForeground.setColourFromOklch(palette.dark.foreground);

		return this;
	}

	// Generate all grey variants based on the base grey color using OKLCH
	protected generatePalette(): GreyColourPalette {
		// Extract hue and chroma from base color
		const greyHue = this.baseColour._oklch.h ?? 0;
		const greyChroma = this.baseColour._oklch.c ?? 0.02; // Greys have low chroma
		const minimumContrast = 4.5; // WCAG AA standard

		// Generate the dark mode grey palette
		const darkPalette = {
			foreground: Colour.lchToOklch(100, 0, 0),
			"grey-1": Colour.lchToOklch(94.77, greyChroma / 2.5, greyHue),
			"grey-2": Colour.lchToOklch(81.34, greyChroma / 2, greyHue),
			"grey-3": Colour.lchToOklch(63.78, greyChroma, greyHue),
			"grey-4": Colour.lchToOklch(46.01, greyChroma, greyHue),
			"grey-5": Colour.lchToOklch(34.09, greyChroma, greyHue),
			"grey-6": Colour.lchToOklch(27.14, greyChroma, greyHue),
			"grey-7": Colour.lchToOklch(20.94, greyChroma / 2, greyHue), // Use 'black' for grey-7
			background: Colour.lchToOklch(20.94, greyChroma / 2, greyHue),
		};

		// Generate the light mode grey palette (note the flipped order)
		const lightPalette = {
			foreground: Colour.lchToOklch(20.94, greyChroma / 2, greyHue),
			"grey-1": Colour.lchToOklch(27.14, greyChroma, greyHue),
			"grey-2": Colour.lchToOklch(34.09, greyChroma, greyHue),
			"grey-3": Colour.lchToOklch(46.01, greyChroma, greyHue),
			"grey-4": Colour.lchToOklch(63.78, greyChroma, greyHue),
			"grey-5": Colour.lchToOklch(81.34, greyChroma / 2, greyHue),
			"grey-6": Colour.lchToOklch(94.77, greyChroma / 2.5, greyHue),
			"grey-7": Colour.lchToOklch(97.35, greyChroma / 5, greyHue),
			background: Colour.lchToOklch(100, 0, 0),
		};

		// Apply contrast corrections
		// Dark mode adjustments
		// `grey-2` is used against `grey-5` in inline code snippets.
		darkPalette["grey-2"] = Colour.contrastColor(
			darkPalette["grey-2"]!,
			darkPalette["grey-5"]!,
			minimumContrast,
		);

		// `grey-3` is used in the table of contents
		darkPalette["grey-3"] = Colour.contrastColor(
			darkPalette["grey-3"]!,
			darkPalette.background!,
			minimumContrast,
		);

		// Light mode adjustments
		// `grey-2` is used against `grey-6` in inline code snippets.
		lightPalette["grey-2"] = Colour.contrastColor(
			lightPalette["grey-2"]!,
			lightPalette["grey-6"]!,
			minimumContrast,
		);
		// `grey-3` is used in the table of contents.
		lightPalette["grey-3"] = Colour.contrastColor(
			lightPalette["grey-3"]!,
			lightPalette.background!,
			minimumContrast,
		);

		return {
			light: {
				"grey-1": lightPalette["grey-1"],
				"grey-2": lightPalette["grey-2"],
				"grey-3": lightPalette["grey-3"],
				"grey-4": lightPalette["grey-4"],
				"grey-5": lightPalette["grey-5"],
				"grey-6": lightPalette["grey-6"],
				"grey-7": lightPalette["grey-7"],
				background: lightPalette.background,
				foreground: lightPalette.foreground,
			},
			dark: {
				"grey-1": darkPalette["grey-1"],
				"grey-2": darkPalette["grey-2"],
				"grey-3": darkPalette["grey-3"],
				"grey-4": darkPalette["grey-4"],
				"grey-5": darkPalette["grey-5"],
				"grey-6": darkPalette["grey-6"],
				"grey-7": darkPalette["grey-7"],
				background: darkPalette.background,
				foreground: darkPalette.foreground,
			},
		};
	}

	// Get all the color hex values as an object matching BrandingType structure
	getHexValues(): Record<string, string> {
		return {
			lightGrey1: this.lightGrey1.formatHex(),
			lightGrey2: this.lightGrey2.formatHex(),
			lightGrey3: this.lightGrey3.formatHex(),
			lightGrey4: this.lightGrey4.formatHex(),
			lightGrey5: this.lightGrey5.formatHex(),
			lightGrey6: this.lightGrey6.formatHex(),
			lightGrey7: this.lightGrey7.formatHex(),
			lightBackground: this.lightBackground.formatHex(),
			lightForeground: this.lightForeground.formatHex(),
			darkGrey1: this.darkGrey1.formatHex(),
			darkGrey2: this.darkGrey2.formatHex(),
			darkGrey3: this.darkGrey3.formatHex(),
			darkGrey4: this.darkGrey4.formatHex(),
			darkGrey5: this.darkGrey5.formatHex(),
			darkGrey6: this.darkGrey6.formatHex(),
			darkGrey7: this.darkGrey7.formatHex(),
			darkBackground: this.darkBackground.formatHex(),
			darkForeground: this.darkForeground.formatHex(),
		};
	}
}
