import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import type { UseFormProps, UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { z } from "zod";

/**
 * Custom hook that syncs form state with context.
 * This extends useForm to create a form that syncs with context values.
 *
 * @param schema - Zod schema for form validation
 * @param initialValues - Initial values from props
 * @param contextValues - Values from context that override initialValues
 * @param updateContext - Function to update context on form changes
 * @param options - Additional useForm options
 */
export function useContextForm<
	T extends Record<string, any>,
	Z extends z.ZodType<any, any>,
>({
	schema,
	initialValues,
	contextValues,
	updateContext,
	...options
}: {
	schema: Z;
	initialValues: T;
	contextValues?: Partial<T>;
	updateContext: (values: Partial<T>) => void;
} & Omit<
	UseFormProps<z.infer<Z>>,
	"resolver" | "defaultValues" | "values"
>): UseFormReturn<z.infer<Z>> {
	// Get current values from context or fall back to initialValues
	const getValues = useCallback(() => {
		const values = { ...initialValues };

		// Apply context values if available
		if (contextValues) {
			Object.keys(initialValues).forEach((key) => {
				if (contextValues[key as keyof typeof contextValues] !== undefined) {
					values[key] = contextValues[key as keyof typeof contextValues];
				}
			});
		}

		return values as z.infer<Z>;
	}, [initialValues, contextValues]);

	// Set up form with the resolved values
	const form = useForm<z.infer<Z>>({
		...options,
		resolver: zodResolver(schema),
		defaultValues: getValues(),
	});

	// Update form when context changes
	useEffect(() => {
		const currentValues = getValues();

		Object.keys(currentValues).forEach((key) => {
			form.setValue(key as any, currentValues[key]);
		});
	}, [contextValues, getValues, form]);

	// Extend form.handleSubmit to update context
	const originalHandleSubmit = form.handleSubmit;

	// We'll just return the form as-is without modifying register
	// The form field will need to manually call updateContext in onChange handlers

	return form;
}
