import { createContactInLoops, MAILING_LISTS } from '@structa/core/marketing';
import { UserService } from '@structa/core/user';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HomeIconLink } from '@/components/ui/link';

interface WaitlistInput {
    email: string;
    userId: string;
    name?: string;
    updateName: boolean; // Whether to update name in database
}

// Server function to join waitlist - calls Loops directly from core package
// Also updates user's name and plan in database
export const joinWaitlistFn = createServerFn({ method: 'POST' })
    .inputValidator((input: WaitlistInput) => input)
    .handler(async ({ data }) => {
        // Update user's name in database if they provided one
        if (data.updateName && data.name) {
            await UserService.updateNameFromId({
                id: data.userId,
                name: data.name,
            });
        }

        // Add to Loops waitlist
        const nameParts = (data.name || '').trim().split(' ');
        const firstName = nameParts[0] || undefined;
        const lastName = nameParts.slice(1).join(' ') || undefined;

        const result = await createContactInLoops({
            email: data.email,
            userId: data.email, // Use email as userId for waitlist signups
            firstName,
            lastName,
            properties: {
                source: 'waitlist',
                createdAt: new Date().toISOString(),
            },
            mailingLists: {
                [MAILING_LISTS.WAITLIST]: true,
                [MAILING_LISTS.PRODUCT]: true,
                [MAILING_LISTS.MARKETING]: true,
            },
        });

        if (!result.success) {
            throw new Error(result.error);
        }

        // Update user's plan to "waitlist" after successful Loops signup
        await UserService.updatePlanFromId({
            id: data.userId,
            plan: 'waitlist',
        });

        return { success: true };
    });

export const Route = createFileRoute('/_auth/_onboarding/onboarding/')({
    component: OnboardingPage,
});

function OnboardingPage() {
    // Get user from route context (populated by _auth.tsx beforeLoad)
    const { user } = Route.useRouteContext();
    const navigate = useNavigate();

    // Check if user is already on the waitlist
    const isOnWaitlist = user.plan === 'waitlist';

    // Only show name field if user doesn't have a name (i.e., signed up with email OTP, not OAuth)
    const userHasName = user.name != null && user.name.trim().length > 0;
    const [name, setName] = useState('');

    const joinWaitlistMutation = useMutation({
        mutationFn: useServerFn(joinWaitlistFn),
        onSuccess: () => {
            navigate({ to: '/onboarding/thank-you' });
        },
        onError: error => {
            console.error('Waitlist mutation error:', error);
        },
    });

    const hasError = joinWaitlistMutation.isError;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user.email || !user.id) {
            return;
        }

        // Only send name if we're collecting it (user doesn't have one already)
        joinWaitlistMutation.mutate({
            data: {
                email: user.email,
                userId: user.id,
                name: !userHasName ? name || undefined : user.name || undefined,
                updateName: !userHasName && !!name, // Only update if user entered a new name
            },
        });
    };

    return (
        <div className="flex h-full flex-col items-center justify-center">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-start gap-2">
                        <div className="mb-10">
                            <HomeIconLink variant="muted" />
                        </div>
                        <h1 className="font-heading text-3xl lg:text-3xl tracking-tight">
                            Request early access.
                        </h1>
                        <h2 className="font-heading text-3xl lg:text-3xl tracking-tight text-text-secondary">
                            AI-powered workspace to renovate with confidence.
                        </h2>
                    </div>

                    <p className="text-text-muted">
                        We're building an AI assistant that understands your
                        property and guides your renovation.{' '}
                    </p>

                    {/* Name Input Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        {/* Only show name field if user signed up with email (no OAuth name) */}
                        {!userHasName && !isOnWaitlist && (
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                disabled={joinWaitlistMutation.isPending}
                            />
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            isError={hasError}
                            disabled={
                                isOnWaitlist ||
                                joinWaitlistMutation.isPending ||
                                !user.email
                            }
                        >
                            {isOnWaitlist
                                ? "You're on the list"
                                : joinWaitlistMutation.isPending
                                  ? 'Submitting...'
                                  : hasError
                                    ? 'Try again'
                                    : 'Request an invite'}
                        </Button>

                        {hasError && (
                            <p className="text-sm text-error text-center">
                                Failed to join waitlist. Please try again.
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
