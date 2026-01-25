import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { appQueryOptions } from "@/clients/app/app.query.client";
import { useCreateProjectMutation } from "@/clients/expo/expo.mutation.client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface CreateProjectButtonProps {
	className?: string;
}

export function CreateProjectButton({ className }: CreateProjectButtonProps) {
	const [open, setOpen] = useState(false);
	const createProjectMutation = useCreateProjectMutation();
	const { data: app } = useQuery(appQueryOptions);

	const handleCreateProject = async () => {
		if (!app) return;

		try {
			await createProjectMutation.mutateAsync({
				appId: app.id,
				appName: app.name,
			});
			setOpen(false);
		} catch (error) {
			// Error handling is done in the mutation
		}
	};

	if (!app) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className={className}>
					Create Project
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Expo Project</DialogTitle>
					<DialogDescription>
						This will create a new Expo project for "{app.name}" that can be
						used for mobile app deployments. This is a one-time setup required
						before you can deploy your app.
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<div className="space-y-3">
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								App Name
							</label>
							<p className="text-sm">{app.name}</p>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Project Type
							</label>
							<p className="text-sm">Expo managed workflow</p>
						</div>
					</div>
				</div>

				<div className="flex justify-end space-x-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={createProjectMutation.isPending}
					>
						Cancel
					</Button>
					<Button
						onClick={handleCreateProject}
						isLoading={createProjectMutation.isPending}
					>
						Create Project
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
