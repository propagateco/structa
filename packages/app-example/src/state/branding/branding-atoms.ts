import type { BrandingModel } from "@core/branding/branding.model";
import { FONT_MAP } from "@core/utils/font";
import { atom } from "jotai";

/**
 * Branding State Atoms
 * -------------------
 *
 * Jotai atoms for managing branding form state, replacing React Context.
 * Provides change tracking, reset functionality, and font family helpers.
 * Includes snapshot-based reset logic to prevent auto-save race conditions.
 */

// Base atom for tracking branding changes
export const brandingChangesAtom = atom<BrandingModel.BrandingContextType>({});

// Atom to track what data is currently being saved (snapshot)
export const brandingSavingSnapshotAtom =
	atom<BrandingModel.BrandingContextType | null>(null);

// Atom to track if a save is currently in progress
export const brandingIsSavingAtom = atom(false);

// Derived atom to check if there are any changes
export const brandingHasChangesAtom = atom((get) => {
	const changes = get(brandingChangesAtom);
	return Object.keys(changes).length > 0;
});

// Write-only atom for updating changes
export const updateBrandingChangeAtom = atom(
	null,
	(get, set, updates: Partial<BrandingModel.BrandingContextType>) => {
		const currentChanges = get(brandingChangesAtom);
		set(brandingChangesAtom, { ...currentChanges, ...updates });
	},
);

// Write-only atom for capturing save snapshot
export const setSavingSnapshotAtom = atom(
	null,
	(get, set, snapshot: BrandingModel.BrandingContextType | null) => {
		set(brandingSavingSnapshotAtom, snapshot);
	},
);

// Write-only atom for smart reset - only clears changes that were actually saved
export const clearSavedChangesAtom = atom(
	null,
	(get, set, savedData: BrandingModel.BrandingContextType) => {
		const currentChanges = get(brandingChangesAtom);

		// Only keep changes that weren't part of the save
		const remainingChanges: BrandingModel.BrandingContextType = {};

		for (const [key, currentValue] of Object.entries(currentChanges)) {
			const savedValue =
				savedData[key as keyof BrandingModel.BrandingContextType];

			// Keep the change if it differs from what was saved
			if (savedValue !== currentValue) {
				(remainingChanges as any)[key] = currentValue;
			}
		}

		set(brandingChangesAtom, remainingChanges);
		set(brandingSavingSnapshotAtom, null); // Clear the snapshot
	},
);

// Write-only atom for resetting changes (fallback)
export const resetBrandingChangesAtom = atom(null, (get, set) => {
	set(brandingChangesAtom, {});
	set(brandingSavingSnapshotAtom, null);
});

// Derived atom for getting font family
export const getBrandingFontFamilyAtom = atom((get) => {
	const changes = get(brandingChangesAtom);
	return (fontName: string): string => {
		const font = changes.font || fontName;
		return FONT_MAP[font];
	};
});

// Convenience hook-like atoms for easier migration
export const brandingStateAtom = atom((get) => {
	const changes = get(brandingChangesAtom);
	const hasChanges = get(brandingHasChangesAtom);
	const getFontFamily = get(getBrandingFontFamilyAtom);

	return {
		changes,
		hasChanges,
		getFontFamily,
	};
});
