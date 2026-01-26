import { UserModel } from "@core/user/user.model";
import { formatWorkspaceName } from "@core/utils/string";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronLeft, Command } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
	onboardingFormAtom,
	updateOnboardingFormAtom,
} from "@/state/onboarding/onboarding-atoms";

export const Route = createFileRoute(
	"/_authenticated/_onboarding/onboarding/workspace",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();
	const formData = useAtomValue(onboardingFormAtom);
	const updateFormData = useSetAtom(updateOnboardingFormAtom);
	const form = useForm({
		resolver: zodResolver(UserModel.Onboarding.pick({ workspaceName: true })),
		defaultValues: { workspaceName: formData.workspaceName },
	});

	const onBack = () => {
		router.navigate({ to: "/onboarding/profile" });
	};

	const onSubmit = (data: Partial<UserModel.OnboardingType>) => {
		updateFormData(data);
		router.navigate({ to: "/onboarding/product" });
	};

	return (
		<div className={cn("flex flex-col gap-6")}>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="absolute top-5 left-5 [&_svg]:size-6 [&_svg]:text-muted-foreground"
				onClick={onBack}
			>
				<ChevronLeft size={24} />
			</Button>
			<div className="flex flex-col gap-6 w-full max-w-sm">
				<div className="flex flex-col items-center">
					<Avatar className="h-20 w-20 rounded-lg">
						<AvatarFallback className="rounded-lg text-3xl font-semibold text-muted-foreground">
							{form.watch("workspaceName") ? (
								formatWorkspaceName(form.watch("workspaceName"))
							) : (
								<Command size={32} />
							)}
						</AvatarFallback>
					</Avatar>
				</div>
				<div className="flex flex-col items-start gap-2">
					<h1 className="text-2xl font-bold">Give your workspace a name</h1>
					<h2 className="text-lg font-semibold text-ds-mono-600">
						For example the name of your app, company, or coaching business.
					</h2>
				</div>

				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="workspaceName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Workspace name</FormLabel>
									<FormControl>
										<Input
											placeholder={`Acme Fitness, The Acme App, ...`}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-center">
							<Button type="submit" className="w-full">
								Continue
							</Button>
						</div>
					</form>
				</FormProvider>
			</div>
		</div>
	);
}
