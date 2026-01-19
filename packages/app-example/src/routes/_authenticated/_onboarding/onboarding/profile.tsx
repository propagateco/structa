import {
    createFileRoute,
    useRouter,
    useRouteContext,
} from "@tanstack/react-router";
import { UserModel } from "@core/user/user.model";
import { useAtomValue, useSetAtom } from "jotai";
import {
    onboardingFormAtom,
    updateOnboardingFormAtom,
} from "@/state/onboarding/onboarding-atoms";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { FormControl, FormMessage } from "@/components/ui/form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

export const Route = createFileRoute(
    "/_authenticated/_onboarding/onboarding/profile"
)({
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = useRouteContext({ from: "/_authenticated" });
    const router = useRouter();
    const formData = useAtomValue(onboardingFormAtom);
    const updateFormData = useSetAtom(updateOnboardingFormAtom);
    const form = useForm({
        resolver: zodResolver(UserModel.Onboarding.pick({ name: true })),
        defaultValues: { name: formData.name || user.name },
    });

    const onSubmit = (data: Partial<UserModel.OnboardingType>) => {
        updateFormData(data);
        router.navigate({ to: "/onboarding/workspace" });
    };

    return (
        <div className={cn("flex flex-col gap-6")}>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-5 left-5 [&_svg]:size-6 [&_svg]:text-muted-foreground"
                disabled
            >
                <ChevronLeft size={24} />
            </Button>
            <div className="flex flex-col gap-6 w-full max-w-sm">
                <div className="flex flex-col items-start gap-2">
                    <h1 className="text-2xl font-bold">Create a profile</h1>
                    <h2 className="text-lg font-semibold text-text-muted">
                        This is how you&apos;ll appear in Structa.
                    </h2>
                </div>

                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter your name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
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
