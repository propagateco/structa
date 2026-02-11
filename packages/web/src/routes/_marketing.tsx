import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout';
import { getPublicAuth } from '@/lib/auth-server';

export const Route = createFileRoute('/_marketing')({
    beforeLoad: async () => {
        await getPublicAuth();
    },
    component: LayoutComponent,
});

function LayoutComponent() {
    return (
        <div className="text-text min-h-screen flex flex-col relative bg-background">
            <Header />

            {/* Main content wrapper */}
            <div className="flex-1 relative z-10">
                {/* Side gutters with noise texture */}
                <div className="absolute left-0 top-0 bottom-0 w-3 sm:w-4 md:w-8 pointer-events-none bg-ds-mono-100 dark:bg-background border-b border-ds-powder/50 dark:border-ds-powder/[0.08]">
                    <div
                        className="pointer-events-none absolute inset-0 bg-[size:180px] bg-repeat opacity-[0.05] dark:opacity-[0.02]"
                        style={{ backgroundImage: `url('/noise.png')` }}
                    />
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-3 sm:w-4 md:w-8 pointer-events-none bg-ds-mono-100 dark:bg-background border-b border-ds-powder/50 dark:border-ds-powder/[0.08]">
                    <div
                        className="pointer-events-none absolute inset-0 bg-[size:180px] bg-repeat opacity-[0.05] dark:opacity-[0.02]"
                        style={{ backgroundImage: `url('/noise.png')` }}
                    />
                </div>
                <main className="pt-14 mx-3 sm:mx-4 md:mx-8 border-x border-ds-powder/50 dark:border-ds-powder/[0.08] relative">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
}
