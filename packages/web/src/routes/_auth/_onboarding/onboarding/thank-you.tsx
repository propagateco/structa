import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { MoveLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HomeIconLink } from '@/components/ui/link';
import { useSession } from '@/lib/auth-client';

export const Route = createFileRoute('/_auth/_onboarding/onboarding/thank-you')(
    {
        component: RouteComponent,
    }
);

function RouteComponent() {
    const { data: session } = useSession();
    const navigate = useNavigate();
    const name = session?.user?.name;

    return (
        <div className="flex h-full flex-col items-center justify-center">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-start gap-2">
                        <div className="mb-10">
                            <HomeIconLink variant="muted" />
                        </div>
                        <h1 className="font-heading text-2xl lg:text-3xl tracking-tight">
                            You're on the list!
                        </h1>
                        <h2 className="text-lg text-text-muted">
                            Thanks for signing up{' '}
                            <span className="font-semibold">{name}</span> —
                            can't wait to show you what we've been working on.
                        </h2>
                    </div>

                    <Button
                        type="button"
                        variant="link"
                        className="text-text-muted w-fit p-0"
                        onClick={() => navigate({ to: '/' })}
                        icon={<MoveLeft className="h-4 w-4" />}
                    >
                        go home
                    </Button>
                </div>
            </div>
        </div>
    );
}
