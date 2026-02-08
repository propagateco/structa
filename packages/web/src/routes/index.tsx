import { createFileRoute } from '@tanstack/react-router';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { VideoSection } from '@/components/landing/VideoSection';
import { LogoShowcaseSection } from '@/components/landing/LogoShowcaseSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TexturedSection, DiagonalDivider, Footer } from '@/components/layout';

export const Route = createFileRoute('/')({
    component: LandingPage,
});

function LandingPage() {
    return (
        <>
            <div className="text-text min-h-screen flex flex-col relative bg-background">
                <Header />

                {/* Wrapper for gutters and main content */}
                <div className="flex-1 relative ">
                    {/* Side gutters with noise texture */}
                    <div className="absolute left-0 top-0 bottom-0 w-3 sm:w-4 md:w-8 pointer-events-none bg-ds-mono-100 dark:bg-background border-b border-ds-powder/50 dark:border-ds-powder/[0.08]">
                        <div
                            className="pointer-events-none [z-index:-1] absolute inset-0 bg-[size:180px] bg-repeat opacity-[0.05] dark:opacity-[0.02]"
                            style={{ backgroundImage: `url('/noise.png')` }}
                        />
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-3 sm:w-4 md:w-8 pointer-events-none bg-ds-mono-100 dark:bg-background border-b border-ds-powder/50 dark:border-ds-powder/[0.08]">
                        <div
                            className="pointer-events-none [z-index:-1] absolute inset-0 bg-[size:180px] bg-repeat opacity-[0.05] dark:opacity-[0.02]"
                            style={{ backgroundImage: `url('/noise.png')` }}
                        />
                    </div>

                    {/* Main content - aligned with grid overlay */}
                    <main className="pt-14 mx-3 sm:mx-4 md:mx-8 border-x border-ds-powder/50 dark:border-ds-powder/[0.08] relative z-10">
                        {/* Hero Section */}
                        <Hero />

                        {/* Video & Logo Showcase Section */}
                        <TexturedSection
                            showTopDivider={false}
                            showBottomDivider={false}
                            showTopDiamonds={true}
                            showGrid={true}
                        >
                            <div className="col-span-4 md:col-span-8">
                                {/* Video Section */}
                                <VideoSection />

                                {/* Logo Showcase Section */}
                                <LogoShowcaseSection />
                            </div>
                        </TexturedSection>

                        {/* Diagonal Slash Divider - matches zed.dev's #divider-slash */}
                        <DiagonalDivider />

                        {/* Stats Section - Textured background */}
                        <TexturedSection
                            showTopDivider={false}
                            showBottomDivider={false}
                            showGrid={true}
                        >
                            <StatsSection />
                        </TexturedSection>

                        <DiagonalDivider />

                        {/* Features Section - Textured */}
                        <TexturedSection
                            showTopDivider={false}
                            showBottomDivider={false}
                            showGrid={true}
                            cols={1}
                            smCols={1}
                            mdCols={3}
                            lgCols={3}
                        >
                            <FeaturesSection />
                        </TexturedSection>

                        {/* Diagonal Slash Divider */}
                        <DiagonalDivider />
                    </main>
                </div>
            </div>
            {/* Footer */}
            <Footer />
        </>
    );
}
