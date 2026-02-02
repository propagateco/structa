import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '@/components/landing/Hero';
import { VideoSection } from '@/components/landing/VideoSection';
import { LogoShowcaseSection } from '@/components/landing/LogoShowcaseSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TexturedSection, DiagonalDivider } from '@/components/layout';

export const Route = createFileRoute('/_marketing/')({
    component: LandingPage,
});

function LandingPage() {
    return (
        <>
            {/* Main content - aligned with grid overlay */}
            <main className="flex-1 pt-14 mx-3 sm:mx-4 md:mx-8 border-x border-ds-powder/50 dark:border-ds-powder/[0.08] relative z-10">
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
        </>
    );
}
