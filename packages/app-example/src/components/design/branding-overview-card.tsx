import type { AppModel } from "@core/app/app.model";
import type { BrandingModel } from "@core/branding/branding.model";
import type { UserModel } from "@core/user/user.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthorTime } from "@/components/ui/author-time";
import { Card } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	brandingChangesAtom,
	brandingHasChangesAtom,
	updateBrandingChangeAtom,
} from "@/state/branding";
import { Label } from "../ui/label";

type BrandingCardProps = {
	app: AppModel.SchemaType;
	user: UserModel.UserType;
	branding: BrandingModel.BrandingQueryType;
};

const formSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(30, "App name must be less than 30 characters"),
	description: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function BrandingOverviewCard({
	app,
	user,
	branding,
}: BrandingCardProps) {
	// Use Jotai atoms for state management
	const changes = useAtomValue(brandingChangesAtom);
	const hasChanges = useAtomValue(brandingHasChangesAtom);
	const updateChange = useSetAtom(updateBrandingChangeAtom);

	// Debounce timer refs for each field
	const nameDebounceRef = useRef<NodeJS.Timeout | null>(null);
	const descriptionDebounceRef = useRef<NodeJS.Timeout | null>(null);

	// Debounced update functions
	const debouncedUpdateName = useCallback(
		(value: string) => {
			if (nameDebounceRef.current) {
				clearTimeout(nameDebounceRef.current);
			}
			nameDebounceRef.current = setTimeout(() => {
				updateChange({ name: value });
			}, 500); // 500ms debounce
		},
		[updateChange],
	);

	const debouncedUpdateDescription = useCallback(
		(value: string) => {
			if (descriptionDebounceRef.current) {
				clearTimeout(descriptionDebounceRef.current);
			}
			descriptionDebounceRef.current = setTimeout(() => {
				updateChange({ description: value });
			}, 500); // 500ms debounce
		},
		[updateChange],
	);

	// Initialize with values from context or props
	const defaultValues = {
		name: changes.name !== undefined ? changes.name : app.name,
		description:
			changes.description !== undefined ? changes.description : app.description,
	};

	// Use standard react-hook-form hook
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
		mode: "onChange",
	});

	// Don't sync form with backend data during auto-saves
	// The form maintains its own state through react-hook-form
	React.useEffect(() => {
		// Only update form if the user hasn't made any changes
		// This prevents form data loss during auto-saves
		const formValues = form.getValues();
		if (
			Object.keys(changes).length === 0 &&
			formValues.name === app.name &&
			formValues.description === app.description
		) {
			// Form is already in sync, no need to update
			return;
		}
	}, [changes, app.name, app.description, form]);

	// Clean up debounce timers on unmount
	React.useEffect(() => {
		return () => {
			if (nameDebounceRef.current) {
				clearTimeout(nameDebounceRef.current);
			}
			if (descriptionDebounceRef.current) {
				clearTimeout(descriptionDebounceRef.current);
			}
		};
	}, []);

	// Get the most recent update date between app and branding
	const lastUpdated = new Date(
		Math.max(
			new Date(app.updatedAt).getTime(),
			new Date(branding.updatedAt).getTime(),
		),
	);

	return (
		<Card variant="ghost" className="p-4 lg:p-6 overflow-hidden w-full h-full">
			<div className="flex items-start w-full text-sm">
				<div className="flex flex-col gap-3 lg:gap-4 w-full max-w-full">
					<Form {...form}>
						<div className="w-full">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>App Name</FormLabel>
										<FormControl>
											<Input
												{...field}
												onChange={(e) => {
													field.onChange(e);
													// Validate synchronously using form state
													const value = e.target.value;
													const errors = form.getFieldState("name").error;

													// Only update atom if no validation errors
													if (
														!errors &&
														value.length >= 1 &&
														value.length <= 30
													) {
														debouncedUpdateName(value);
													}
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="w-full">
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>App Description</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												className="resize-none min-h-16"
												onChange={(e) => {
													field.onChange(e);
													// Validate synchronously using form state
													const value = e.target.value;
													const errors =
														form.getFieldState("description").error;

													// Only update atom if no validation errors
													if (!errors && value.length >= 1) {
														debouncedUpdateDescription(value);
													}
												}}
												placeholder={
													"A great app description highlights the features and functionality of your app. The ideal description is a concise, informative paragraph followed by a short list of main features."
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</Form>
					<div className="w-full">
						<Label className="font-medium">Last Updated</Label>
						<div className="mt-1">
							<AuthorTime
								authorName={user.name}
								authorAvatar={user.image}
								timestamp={lastUpdated}
							/>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
