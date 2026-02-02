import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import { getPublicAuth } from '@/lib/auth-server';

export const Route = createFileRoute('/_marketing')({
    beforeLoad: async () => {
        await getPublicAuth();
    },
    component: LayoutComponent,
});

function LayoutComponent() {
    return (
        <>
            <div className="text-text min-h-screen flex flex-col relative bg-background">
                <Header />

                {/* Side gutters with noise texture */}
                <div className="fixed left-0 top-0 bottom-0 w-3 sm:w-4 md:w-8 z-0 pointer-events-none bg-ds-mono-100 dark:bg-background">
                    <div
                        className="pointer-events-none [z-index:-1] absolute inset-0 bg-[size:180px] bg-repeat opacity-[0.05] dark:opacity-[0.02]"
                        style={{ backgroundImage: `url('/noise.png')` }}
                    />
                </div>
                <div className="fixed right-0 top-0 bottom-0 w-3 sm:w-4 md:w-8 z-0 pointer-events-none bg-ds-mono-100 dark:bg-background">
                    <div
                        className="pointer-events-none [z-index:-1] absolute inset-0 bg-[size:180px] bg-repeat opacity-[0.05] dark:opacity-[0.02]"
                        style={{ backgroundImage: `url('/noise.png')` }}
                    />
                </div>

                <Outlet />
            </div>
        </>
    );
}
