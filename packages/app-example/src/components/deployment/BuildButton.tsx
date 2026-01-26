import { useCreateBuildMutation } from "@/clients/expo/expo.mutation.client";
import { Button } from "@/components/ui/button";

interface BuildButtonProps {
	className?: string;
}

export function BuildButton({ className }: BuildButtonProps) {
	const createBuildMutation = useCreateBuildMutation();

	const handleTestBuild = async () => {
		try {
			await createBuildMutation.mutateAsync();
		} catch (error) {
			// Error handling is done in the mutation
		}
	};

	return (
		<Button
			variant="outline"
			onClick={handleTestBuild}
			isLoading={createBuildMutation.isPending}
			className={className}
		>
			Create Build
		</Button>
	);
}
