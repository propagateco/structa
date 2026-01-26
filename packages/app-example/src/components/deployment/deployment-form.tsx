import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateDeploymentMutation } from "@/clients/deployment/deployment.mutation.client";
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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Form validation schema
const deploymentFormSchema = z.object({
	appName: z
		.string()
		.min(1, "App name is required")
		.max(100, "App name must be less than 100 characters")
		.regex(
			/^[a-zA-Z0-9\s-_]+$/,
			"App name can only contain letters, numbers, spaces, hyphens, and underscores",
		),
	brandColor: z
		.string()
		.regex(
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			"Please enter a valid hex color (e.g., #FF0000)",
		),
	description: z
		.string()
		.min(1, "Description is required")
		.max(500, "Description must be less than 500 characters"),
});

type DeploymentFormValues = z.infer<typeof deploymentFormSchema>;

interface DeploymentFormProps {
	onSuccess?: () => void;
}

export function DeploymentForm({ onSuccess }: DeploymentFormProps) {
	const createDeploymentMutation = useCreateDeploymentMutation();

	const form = useForm<DeploymentFormValues>({
		resolver: zodResolver(deploymentFormSchema),
		defaultValues: {
			appName: "",
			brandColor: "#3b82f6",
			description: "",
		},
	});

	const onSubmit = async (values: DeploymentFormValues) => {
		try {
			await createDeploymentMutation.mutateAsync(values);
			form.reset();
			onSuccess?.();
		} catch (error) {
			// Error handling is done in the mutation
		}
	};

	const watchedBrandColor = form.watch("brandColor");

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>Deploy Your Mobile App</CardTitle>
				<CardDescription>
					Create a custom mobile app with your branding that will be built and
					deployed automatically.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="appName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>App Name</FormLabel>
									<FormControl>
										<Input placeholder="My Awesome App" {...field} />
									</FormControl>
									<FormDescription>
										This will be the name displayed to users and in app stores.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="brandColor"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Brand Color</FormLabel>
									<FormControl>
										<div className="flex gap-3 items-center">
											<Input
												type="color"
												className="w-16 h-10 p-1 border rounded"
												{...field}
											/>
											<Input
												placeholder="#3b82f6"
												value={field.value}
												onChange={field.onChange}
												className="flex-1"
											/>
											<div
												className="w-10 h-10 rounded border-2 border-gray-200"
												style={{ backgroundColor: watchedBrandColor }}
											/>
										</div>
									</FormControl>
									<FormDescription>
										Choose your brand's primary color. This will be used
										throughout the app.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>App Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe what your app does and what makes it special..."
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										A brief description of your app that will be shown to users.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="pt-4">
							<Button
								type="submit"
								size="lg"
								className="w-full"
								isLoading={createDeploymentMutation.isPending}
							>
								Deploy App
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
