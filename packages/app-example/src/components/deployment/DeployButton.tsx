import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateDeploymentMutation } from "@/clients/deployment/deployment.mutation.client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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

const deploymentFormSchema = z.object({
	appName: z
		.string()
		.min(1, "App name is required")
		.max(100, "App name too long"),
	brandColor: z
		.string()
		.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
	description: z
		.string()
		.min(1, "Description is required")
		.max(500, "Description too long"),
});

type DeploymentFormData = z.infer<typeof deploymentFormSchema>;

interface DeployButtonProps {
	appName?: string;
	className?: string;
}

export function DeployButton({ appName, className }: DeployButtonProps) {
	const [open, setOpen] = useState(false);
	const createDeploymentMutation = useCreateDeploymentMutation();

	const form = useForm<DeploymentFormData>({
		resolver: zodResolver(deploymentFormSchema),
		defaultValues: {
			appName: appName || "",
			brandColor: "#3B82F6",
			description: "",
		},
	});

	const onSubmit = async (data: DeploymentFormData) => {
		try {
			await createDeploymentMutation.mutateAsync(data);
			setOpen(false);
			form.reset();
		} catch (error) {
			// Error handling is done in the mutation
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className={className}>Deploy</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Deploy Mobile App</DialogTitle>
					<DialogDescription>
						Configure your mobile app deployment. This will create a custom
						build with your branding.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
										This will appear as the app title in your mobile app.
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
										<div className="flex items-center space-x-2">
											<Input
												placeholder="#3B82F6"
												{...field}
												className="flex-1"
											/>
											<div
												className="w-10 h-10 rounded border border-border"
												style={{ backgroundColor: field.value }}
											/>
										</div>
									</FormControl>
									<FormDescription>
										Primary color for your app theme (hex format).
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
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe this deployment..."
											{...field}
											rows={3}
										/>
									</FormControl>
									<FormDescription>
										Optional description for this deployment.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								disabled={createDeploymentMutation.isPending}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={createDeploymentMutation.isPending}
							>
								{createDeploymentMutation.isPending && (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								)}
								Deploy App
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
