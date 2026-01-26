import { UserModel } from "@core/user/user.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronLeft } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import {
	RadioGroup,
	RadioGroupCard,
	RadioGroupCardText,
	RadioGroupCardTitle,
} from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
	onboardingFormAtom,
	updateOnboardingFormAtom,
} from "@/state/onboarding/onboarding-atoms";

export const Route = createFileRoute(
	"/_authenticated/_onboarding/onboarding/product",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();
	const formData = useAtomValue(onboardingFormAtom);
	const updateFormData = useSetAtom(updateOnboardingFormAtom);
	const form = useForm({
		resolver: zodResolver(UserModel.Onboarding.pick({ product: true })),
		defaultValues: { product: formData.product },
	});

	const onBack = () => {
		router.navigate({ to: "/onboarding/workspace" });
	};

	const onSubmit = (data: Partial<UserModel.OnboardingType>) => {
		updateFormData(data);
		router.navigate({ to: "/onboarding/plan" });
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
				<div className="flex flex-col items-start gap-2">
					<h1 className="text-2xl font-bold">
						What type of app are you building?
					</h1>
					<h2 className="text-lg font-semibold text-text-muted">
						Don&apos;t worry, you can change this later and even offer multiple
						products.
					</h2>
				</div>

				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="product"
							render={({ field }) => (
								<FormItem className="space-y-3">
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className="flex flex-col gap-4"
										>
											<RadioGroupCard
												value="course"
												className="flex flex-row items-center"
											>
												<div className="flex flex-col items-start m-6">
													<RadioGroupCardTitle>Course</RadioGroupCardTitle>
													<RadioGroupCardText>
														A self-paced programme clients can start anytime.
														Best for higher volume productised offers.
													</RadioGroupCardText>
												</div>
											</RadioGroupCard>
											<RadioGroupCard
												value="group"
												className="flex flex-row items-center"
											>
												<div className="flex flex-col items-start m-6">
													<RadioGroupCardTitle>
														Cohort Coaching
													</RadioGroupCardTitle>
													<RadioGroupCardText>
														A cohort of clients complete a programme together.
														Best for accountability and scaling your time.
													</RadioGroupCardText>
												</div>
											</RadioGroupCard>
											<RadioGroupCard
												value="personal"
												className="flex flex-row items-center"
											>
												<div className="flex flex-col items-start m-6">
													<RadioGroupCardTitle>
														Personal Training
													</RadioGroupCardTitle>
													<RadioGroupCardText>
														Clients get their own personalised programme. Best
														for high-ticket offers offering deep support.
													</RadioGroupCardText>
												</div>
											</RadioGroupCard>
										</RadioGroup>
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
