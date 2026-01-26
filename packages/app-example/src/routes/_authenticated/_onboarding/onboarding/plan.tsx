import { UserModel } from "@core/user/user.model";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { Check, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useCompleteOnboardingMutation } from "@/clients/user/user.mutation.client";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
	clearOnboardingFormAtom,
	onboardingFormAtom,
} from "@/state/onboarding/onboarding-atoms";

export const Route = createFileRoute(
	"/_authenticated/_onboarding/onboarding/plan",
)({
	component: RouteComponent,
});

const ProCardContent = [
	"Unlimited access to all features",
	"No additional transaction fees",
	"Priority support",
	"Deploy to iOS and Android",
];

function RouteComponent() {
	const router = useRouter();
	const formData = useAtomValue(onboardingFormAtom);
	const clearFormData = useSetAtom(clearOnboardingFormAtom);
	const { mutateAsync: completeOnboardingMutation } =
		useCompleteOnboardingMutation();
	const [clickedButton, setClickedButton] = useState<"pro" | "trial" | null>(
		null,
	);

	const form = useForm({
		defaultValues: formData,
		validators: {
			onChange: UserModel.Onboarding,
			onSubmit: UserModel.Onboarding,
		},
		onSubmit: async ({ value }) => {
			const finalFormData = { ...formData, ...value };
			await completeOnboardingMutation(finalFormData);
			clearFormData();
			await router.invalidate(); // Invalidate router to refresh context with updated user data
			router.navigate({ to: "/" });
		},
	});

	const onBack = () => {
		router.navigate({ to: "/onboarding/product" });
	};

	return (
		<div className={cn("flex flex-col")}>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="absolute top-5 left-5 [&_svg]:size-6 [&_svg]:text-muted-foreground"
				onClick={onBack}
			>
				<ChevronLeft size={24} />
			</Button>
			<div className="flex flex-col w-full max-w-sm mb-6">
				<div className="flex flex-col items-start gap-2">
					<h1 className="text-2xl font-bold">Get unlimited access</h1>
					<h2 className="text-lg font-semibold text-text-muted">
						Unlock all features and get ready to deploy your app today.
					</h2>
				</div>
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				className="space-y-8 w-[400px]"
			>
				<form.Field
					name="plan"
					children={({ handleChange }) => (
						<Card className="flex flex-col items-center bg-ds-midnight rounded-xl text-paper">
							<div className="flex flex-col items-start w-full p-5">
								<CardTitle className="text-ds-paper">Pro</CardTitle>
								<CardDescription className="mt-4 text-background py-3">
									<ul className="list-none list-inside">
										{ProCardContent.map((content, index) => (
											<li key={index} className="flex items-center mb-3">
												<Check className="mr-2" size={16} />
												{content}
											</li>
										))}
									</ul>
								</CardDescription>
								<div className="flex flex-col w-full pt-4">
									<form.Subscribe
										selector={(state) => [state.canSubmit, state.isSubmitting]}
									>
										{([canSubmit, isSubmitting]) => (
											<div className="flex flex-col gap-1 w-full">
												<Button
													value="pro"
													className="w-full"
													variant="opposite"
													disabled={!canSubmit || isSubmitting}
													isLoading={isSubmitting && clickedButton === "pro"}
													onClick={() => {
														setClickedButton("pro");
														handleChange(
															"pro" as UserModel.OnboardingType["plan"],
														);
														form.handleSubmit();
													}}
												>
													Get Pro
												</Button>
												<Button
													value="trial"
													className="w-full text-background"
													variant="link"
													disabled={!canSubmit || isSubmitting}
													isLoading={isSubmitting && clickedButton === "trial"}
													onClick={() => {
														setClickedButton("trial");
														handleChange(
															"trial" as UserModel.OnboardingType["plan"],
														);
														form.handleSubmit();
													}}
												>
													Or continue for free
												</Button>
											</div>
										)}
									</form.Subscribe>
								</div>
							</div>
						</Card>
					)}
				/>
			</form>
			<p className="text-sm text-ds-mono-700 text-center mt-4">
				You can change your plan or cancel anytime.
			</p>
		</div>
	);
}
