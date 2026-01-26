import { AppPricingModel } from "@core/app/app-pricing.model";
import { CURRENCY_OPTIONS } from "@core/utils/price";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface PricingFormProps {
	appPricing: any;
	isEditing: boolean;
	isPending: boolean;
	onSubmit: (values: AppPricingModel.MutationClientType) => void;
	onEdit: () => void;
	onCancel: () => void;
	onFormChange?: (values: AppPricingModel.MutationClientType) => void;
}

export function PricingForm({
	appPricing,
	isEditing,
	isPending,
	onSubmit,
	onEdit,
	onCancel,
	onFormChange,
}: PricingFormProps) {
	const form = useForm<AppPricingModel.MutationClientType>({
		resolver: zodResolver(AppPricingModel.MutationClient),
		defaultValues: {
			monthlyPrice: appPricing?.monthlyPrice || 0.0,
			quarterlyPrice: appPricing?.quarterlyPrice || 0.0,
			annualPrice: appPricing?.annualPrice || 0.0,
			currency: (appPricing?.currency as "usd" | "eur" | "gbp") || "usd",
		},
	});

	// Update form values when pricing data loads
	React.useEffect(() => {
		if (appPricing) {
			form.reset({
				monthlyPrice: appPricing.monthlyPrice || undefined,
				quarterlyPrice: appPricing.quarterlyPrice || undefined,
				annualPrice: appPricing.annualPrice || undefined,
				currency: (appPricing.currency as "usd" | "eur" | "gbp") || "usd",
			});
		}
	}, [appPricing, form]);

	// Reset form when editing mode changes to false (cancel)
	React.useEffect(() => {
		if (!isEditing && appPricing) {
			form.reset({
				monthlyPrice: appPricing.monthlyPrice || undefined,
				quarterlyPrice: appPricing.quarterlyPrice || undefined,
				annualPrice: appPricing.annualPrice || undefined,
				currency: (appPricing.currency as "usd" | "eur" | "gbp") || "usd",
			});
		}
	}, [isEditing, appPricing, form]);

	const selectedCurrency = form.watch("currency");
	const monthlyPrice = form.watch("monthlyPrice");
	const currencySymbol =
		CURRENCY_OPTIONS.find((c) => c.value === selectedCurrency)?.symbol || "$";

	// Watch all form values and call onFormChange when they change
	React.useEffect(() => {
		if (onFormChange && isEditing) {
			const subscription = form.watch((values) => {
				onFormChange(values);
			});
			return () => subscription.unsubscribe();
		}
	}, [form, onFormChange, isEditing]);

	// Quick percentage discount functions with proper money precision
	const applyDiscount = (
		basePrice: number | undefined,
		discountPercent: number,
	) => {
		if (!basePrice || basePrice <= 0) return 0;
		const discountedPrice = basePrice * (1 - discountPercent / 100);
		return Math.round(discountedPrice * 100) / 100; // Round to 2 decimal places
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Subscription Pricing</CardTitle>
				<CardDescription>
					Configure your app's subscription pricing. Changes will create new
					products in Stripe and notify existing subscribers.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						id="pricing-form"
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="currency"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Currency</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={!isEditing}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select currency" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{CURRENCY_OPTIONS.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<FormField
								control={form.control}
								name="monthlyPrice"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Monthly Price</FormLabel>
										<FormControl>
											<div className="relative flex items-center">
												<Input
													type="number"
													step="0.01"
													min="0"
													placeholder="0.00"
													className="peer pl-6"
													disabled={!isEditing}
													{...field}
													value={field.value ? field.value.toString() : ""}
													onChange={(e) => {
														const value = e.target.value;
														field.onChange(
															value === "" ? undefined : parseFloat(value),
														);
													}}
													onBlur={(e) => {
														const value = parseFloat(e.target.value);
														if (!isNaN(value)) {
															const rounded = Math.round(value * 100) / 100;
															field.onChange(rounded);
															// Force the input to show the rounded value
															e.target.value = rounded.toFixed(2);
														}
													}}
												/>
												<span className="absolute left-3 text-muted-foreground pointer-events-none transition-all duration-100 text-md peer-disabled:opacity-50 ">
													{currencySymbol}
												</span>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="quarterlyPrice"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Quarterly Price</FormLabel>
										<FormControl>
											<div className="relative flex items-center">
												<Input
													type="number"
													step="0.01"
													min="0"
													placeholder="0.00"
													className="peer pl-6"
													disabled={!isEditing}
													{...field}
													value={field.value ? field.value.toString() : ""}
													onChange={(e) => {
														const value = e.target.value;
														field.onChange(
															value === "" ? undefined : parseFloat(value),
														);
													}}
													onBlur={(e) => {
														const value = parseFloat(e.target.value);
														if (!isNaN(value)) {
															const rounded = Math.round(value * 100) / 100;
															field.onChange(rounded);
															// Force the input to show the rounded value
															e.target.value = rounded.toFixed(2);
														}
													}}
												/>
												<span className="absolute left-3 text-muted-foreground pointer-events-none transition-all duration-100 text-md peer-disabled:opacity-50">
													{currencySymbol}
												</span>
											</div>
										</FormControl>
										<FormMessage />
										{isEditing && (
											<div className="mt-2 space-y-1">
												<p className="text-xs text-muted-foreground">
													Discount on Monthly Price:
												</p>
												<div className="flex gap-2 flex-wrap">
													{[15, 25, 33, 50].map((percent) => (
														<Button
															key={percent}
															type="button"
															variant="outline"
															size="xs"
															onClick={() => {
																const currentMonthlyPrice =
																	form.getValues("monthlyPrice");
																const discountedMonthly = applyDiscount(
																	currentMonthlyPrice,
																	percent,
																);
																const quarterlyPrice =
																	Math.round(discountedMonthly * 3 * 100) / 100;
																field.onChange(quarterlyPrice);
															}}
															disabled={!monthlyPrice || monthlyPrice <= 0}
														>
															-{percent}%
														</Button>
													))}
												</div>
											</div>
										)}
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="annualPrice"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Annual Price</FormLabel>
										<FormControl>
											<div className="relative flex items-center">
												<Input
													type="number"
													step="0.01"
													min="0"
													placeholder="0.00"
													className="peer pl-6"
													disabled={!isEditing}
													{...field}
													value={field.value ? field.value.toString() : ""}
													onChange={(e) => {
														const value = e.target.value;
														field.onChange(
															value === "" ? undefined : parseFloat(value),
														);
													}}
													onBlur={(e) => {
														const value = parseFloat(e.target.value);
														if (!isNaN(value)) {
															const rounded = Math.round(value * 100) / 100;
															field.onChange(rounded);
															// Force the input to show the rounded value
															e.target.value = rounded.toFixed(2);
														}
													}}
												/>
												<span className="absolute left-3 text-muted-foreground pointer-events-none transition-colors duration-200 text-md peer-disabled:opacity-50">
													{currencySymbol}
												</span>
											</div>
										</FormControl>
										<FormMessage />
										{isEditing && (
											<div className="mt-2 space-y-1">
												<p className="text-xs text-muted-foreground">
													Discount on Monthly Price
												</p>
												<div className="flex gap-2 flex-wrap">
													{[15, 25, 33, 50].map((percent) => (
														<Button
															key={percent}
															type="button"
															variant="outline"
															size="xs"
															onClick={() => {
																const currentMonthlyPrice =
																	form.getValues("monthlyPrice");
																const discountedMonthly = applyDiscount(
																	currentMonthlyPrice,
																	percent,
																);
																const annualPrice =
																	Math.round(discountedMonthly * 12 * 100) /
																	100;
																field.onChange(annualPrice);
															}}
															disabled={!monthlyPrice || monthlyPrice <= 0}
														>
															-{percent}%
														</Button>
													))}
												</div>
											</div>
										)}
									</FormItem>
								)}
							/>
						</div>

						{/* Form action buttons - only visible in header */}
						{isEditing && (
							<div className="flex gap-3 justify-end md:hidden">
								<Button
									type="button"
									variant="outline"
									onClick={onCancel}
									disabled={isPending}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									isLoading={isPending}
									disabled={!form.formState.isDirty}
								>
									Save Changes
								</Button>
							</div>
						)}
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
