import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingIcons from '@/components/ui/floating-icons';
import FloatingNotifications from '@/components/ui/floating-notifications';
import { Header } from '@/components/landing/Header';
import CalendlyEmbed from '@/components/ui/CalendlyEmbed';
import LogoShowcase from '@/components/ui/logo-showcase';
import GridOverlay from '@/components/ui/grid-overlay';
import { GridBackgroundSection, DiagonalDivider } from '@/components/layout';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col relative bg-cream-100/20 dark:bg-[hsl(218,13%,7.5%)]">
            {/* Grid Overlay - Payload-style vertical lines */}
            <GridOverlay />

            <Header />

            {/* Main content - matches zed.dev's mx-3 md:mx-8 lg:mx-12 pattern */}
            <main className="flex-1 pt-[72px] mx-3 md:mx-8 lg:mx-12 border-x border-blue-200/50 dark:border-blue-300/[0.08]">

                {/* Hero Section - With Grid Background (hero variant) */}
                <GridBackgroundSection
                    variant="hero"
                    showTopDivider={false}
                    className="min-h-[80vh]"
                >
                    <div className="col-span-4 sm:col-span-6 sm:col-start-2 lg:col-span-12 lg:col-start-3 space-y-8 py-8">
                        {/* New Badge */}
                        <div className="flex justify-center">
                            <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1 text-sm text-muted-foreground">
                                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                                <b>New</b>: customer acquisition systems
                                from scratch
                            </span>
                        </div>

                        {/* Hero Title */}
                        <h1 className="text-center text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Tools for the modern renovator.
                        </h1>

                        {/* Hero Description */}
                        <p className="mx-auto max-w-2xl text-center text-lg text-muted-foreground font-light leading-relaxed">
                            Structa eliminates the guesswork from home
                            renovation with an AI-powered Clerk that
                            brings context, clarity, and confidence to
                            every project.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button
                                onClick={() =>
                                    window.open(
                                        'https://calendly.com/harrison-from-acme/30min',
                                        '_blank'
                                    )
                                }
                                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 group"
                            >
                                Book a Call
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    window.open(
                                        'https://calendly.com/harrison-from-acme/30min',
                                        '_blank'
                                    )
                                }
                                className="inline-flex h-11 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 px-8 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Get Started
                            </Button>
                        </div>

                        {/* Video Section */}
                        <div className="relative mt-24">
                            <div className="relative w-full rounded-xl overflow-hidden">
                                <div className="aspect-[1.91/1]">
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover rounded-xl border border-gray-200"
                                        src="/lovable-uploads/seerexample.mp4"
                                    >
                                        Your browser does not support
                                        the video tag.
                                    </video>
                                </div>
                            </div>
                        </div>

                        {/* Logo Showcase Section */}
                        <div className="mt-16 space-y-6">
                            <p className="text-center text-sm text-muted-foreground font-light">
                                Trusted by founders & teams everywhere
                            </p>
                            <LogoShowcase
                                logos={[
                                    'Response AI',
                                    'Saral Influencers',
                                    'GreatLab',
                                    'Quolum',
                                    'DataFlow Pro',
                                ]}
                                className="mx-auto w-full"
                            />
                        </div>

                        {/* Notifications Section */}
                        <section className="mx-auto max-w-[1400px] px-8 pb-0">
                            <div className="relative h-[150px]">
                                <FloatingNotifications />
                            </div>
                        </section>
                    </div>
                </GridBackgroundSection>

                {/* Diagonal Slash Divider - matches zed.dev's #divider-slash */}
                <DiagonalDivider />

                {/* Stats Section - Plain section (keeping original structure) */}
                <section className="mx-auto max-w-[1400px] px-8 pt-2">
                    <div className="flex justify-center">
                        <div className="w-full max-w-4xl">
                            <div className="rounded-2xl bg-white p-12 shadow-[0_1px_3px_0_rgb(0,0,0,0.1)]">
                                {/* Header */}
                                <div className="space-y-4">
                                    <span className="text-base text-muted-foreground">
                                        From zero lines of code
                                        to your first customer
                                    </span>
                                    <h2 className="text-4xl font-medium tracking-tight">
                                        A Full-Stack, modern MVP
                                        + actual revenue
                                    </h2>
                                    <p className="text-xl text-muted-foreground max-w-3xl">
                                        Acme has built 20+ apps
                                        with React, Supabase,
                                        Vercel & Stripe, then
                                        won 1,000+ customers for
                                        those apps.
                                    </p>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
                                        {/* Stat 1 */}
                                        <div className="space-y-2">
                                            <h3 className="text-4xl font-medium text-[#f97316]">
                                                500K+
                                            </h3>
                                            <h4 className="font-medium">Lines of code</h4>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                In-house developers leveraging 100+ years of experience & the latest AI coding agents = 14-day MVP.
                                            </p>
                                        </div>

                                        {/* Stat 2 */}
                                        <div className="space-y-2">
                                            <h3 className="text-4xl font-medium text-[#f97316]">
                                                4M+
                                            </h3>
                                            <h4 className="font-medium">Cold Emails</h4>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                We'll build & deploy your outbound systems to get your first customers, handling infrastructure, lead sourcing & everything in-between.
                                            </p>
                                        </div>

                                        {/* Stat 3 */}
                                        <div className="space-y-2">
                                            <h3 className="text-4xl font-medium text-[#f97316]">
                                                Infinite
                                            </h3>
                                            <h4 className="font-medium">Revisions & Updates</h4>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                We're not a one-and-done agency. We'll keep building your MVP & improving your systems, and there's a refund-guarantee to be super-safe.
                                            </p>
                                        </div>

                                        {/* Stat 4 */}
                                        <div className="space-y-2">
                                            <h3 className="text-4xl font-medium text-[#f97316]">
                                                100%
                                            </h3>
                                            <h4 className="font-medium">Ownership of the code</h4>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                Obviously. You own every single line of code & the outbound system we build you from scratch.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ... rest of the landing page continues ... */}

            </main>
        </div>
    );
};

export default Landing;
