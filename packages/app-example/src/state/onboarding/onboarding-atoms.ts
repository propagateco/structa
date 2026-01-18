import { atom } from "jotai";
import { atomWithStorage, RESET } from "jotai/utils";
import { UserModel } from "@core/user/user.model";

/**
 * Onboarding Form State Atoms
 * ---------------------------
 * Jotai atoms for managing multi-step onboarding form state with localStorage persistence.
 * Replaces React Context with SSR-safe atom-based state management.
 */

export const ONBOARDING_STORAGE_KEY = "onboarding-form-data";

// Initial form data constant
const initialFormData: UserModel.OnboardingType = {
    name: "",
    workspaceName: "",
    product: "course",
    plan: "onboarding",
};

/**
 * Base atom: Form data with localStorage persistence
 * SSR-safe: Uses getOnInit: false to defer localStorage access to client mount
 */
export const onboardingFormAtom = atomWithStorage<UserModel.OnboardingType>(
    ONBOARDING_STORAGE_KEY,
    initialFormData,
    undefined,
    { getOnInit: false }
);

/**
 * Write-only atom: Update form data with partial updates
 * Replicates Context's updateFormData() behavior
 */
export const updateOnboardingFormAtom = atom(
    null,
    (get, set, updates: Partial<UserModel.OnboardingType>) => {
        const currentData = get(onboardingFormAtom);
        const updatedData = { ...currentData, ...updates };
        set(onboardingFormAtom, updatedData);
    }
);

/**
 * Write-only atom: Clear form data and remove from storage
 * Replicates Context's clearFormData() behavior
 */
export const clearOnboardingFormAtom = atom(null, (_get, set) => {
    set(onboardingFormAtom, RESET); // atomWithStorage handles localStorage.removeItem
});
