/**
 * Favicon Management Utility
 *
 * Handles dynamic favicon switching based on theme (light/dark mode).
 * Prevents FOUC (flash of incorrect favicon) by being called before React hydrates.
 */

export type Theme = 'light' | 'dark' | 'system';

/**
 * Update the favicon based on the theme
 * @param theme - The theme to use for the favicon ('light', 'dark', or 'system')
 */
export function updateFavicon(theme: Theme): void {
	// Find the favicon link element in the DOM
	let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');

	// If no favicon link exists, create one
	if (!link) {
		link = document.createElement('link');
		link.rel = 'icon';
		document.head.appendChild(link);
	}

	// Determine the actual theme
	let actualTheme: 'light' | 'dark';
	if (theme === 'system') {
		actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	} else {
		actualTheme = theme;
	}

	// Update the favicon href
	link.href = `/logo-${actualTheme}.svg`;
}
