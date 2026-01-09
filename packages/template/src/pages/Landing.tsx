import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/landing/Header';
import LogoShowcase from '@/components/ui/logo-showcase';
import {
    GridBackgroundSection,
    TexturedSection,
    DiagonalDivider,
} from '@/components/layout';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col relative bg-cream-100/20 dark:bg-[hsl(218,13%,7.5%)]">
            <Header />

            {/* Main content - aligned with grid overlay */}
            <main className="flex-1 pt-14 mx-3 sm:mx-8 lg:mx-12 border-x border-blue-200/50 dark:border-blue-300/[0.08]">
                {/* Hero Section - Grid Background (hero variant) */}
                <GridBackgroundSection
                    variant="hero"
                    showTopDivider={false}
                    showBottomDivider={true}
                    showDiamonds={false}
                    padding="none"
                    showGridBackground={true}
                >
                    <div className="col-span-4 sm:col-span-6 lg:col-span-12 space-y-8 py-8">
                        {/* Hero Title */}
                        <h1 className="text-center text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                            Tools for the modern renovator.
                        </h1>

                        {/* Hero Description */}
                        <p className="mx-auto max-w-2xl text-center text-muted-foreground font-light leading-relaxed">
                            Structa eliminates the guesswork from home
                            renovation with an AI-powered Clerk that brings
                            context, clarity, and confidence to every project.
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
                    </div>
                </GridBackgroundSection>

                <TexturedSection
                    showTopDivider={false}
                    showBottomDivider={false}
                    showDiamonds={false}
                    grainIntensity="strong"
                    padding="none"
                    className=""
                >
                    <div className="col-span-4 sm:col-span-6 lg:col-span-12 space-y-8 py-8">
                        {/* Video Section */}
                        <div className="relative -mt-24">
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
                                        Your browser does not support the video
                                        tag.
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
                    </div>
                </TexturedSection>

                {/* Diagonal Slash Divider - matches zed.dev's #divider-slash */}
                <DiagonalDivider />

                {/* Stats Section - Textured background */}
                <TexturedSection
                    showTopDivider={false}
                    showBottomDivider={false}
                    showDiamonds={false}
                    grainIntensity="strong"
                    padding="none"
                    className=""
                >
                    <div className="col-span-4 sm:col-span-6 lg:col-span-12">
                        <div className="p-12">
                            {/* Header */}
                            <div className="space-y-4">
                                <span className="text-base text-muted-foreground">
                                    From zero lines of code to your first
                                    customer
                                </span>
                                <h2 className="text-4xl font-medium tracking-tight">
                                    A Full-Stack, modern MVP + actual revenue
                                </h2>
                                <p className="text-xl text-muted-foreground max-w-3xl">
                                    Acme has built 20+ apps with React,
                                    Supabase, Vercel & Stripe, then won 1,000+
                                    customers for those apps.
                                </p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
                                    {/* Stat 1 */}
                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-medium text-[#f97316]">
                                            500K+
                                        </h3>
                                        <h4 className="font-medium">
                                            Lines of code
                                        </h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            In-house developers leveraging 100+
                                            years of experience & the latest AI
                                            coding agents = 14-day MVP.
                                        </p>
                                    </div>

                                    {/* Stat 2 */}
                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-medium text-[#f97316]">
                                            4M+
                                        </h3>
                                        <h4 className="font-medium">
                                            Cold Emails
                                        </h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            We'll build & deploy your outbound
                                            systems to get your first customers,
                                            handling infrastructure, lead
                                            sourcing & everything in-between.
                                        </p>
                                    </div>

                                    {/* Stat 3 */}
                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-medium text-[#f97316]">
                                            Infinite
                                        </h3>
                                        <h4 className="font-medium">
                                            Revisions & Updates
                                        </h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            We're not a one-and-done agency.
                                            We'll keep building your MVP &
                                            improving your systems, and there's
                                            a refund-guarantee to be super-safe.
                                        </p>
                                    </div>

                                    {/* Stat 4 */}
                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-medium text-[#f97316]">
                                            100%
                                        </h3>
                                        <h4 className="font-medium">
                                            Ownership of the code
                                        </h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            Obviously. You own every single line
                                            of code & the outbound system we
                                            build you from scratch.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TexturedSection>

                {/* Diagonal Slash Divider */}
                <DiagonalDivider />

                {/* Features Section - Grid Background (content variant) */}
                <GridBackgroundSection
                    variant="content"
                    showTopDivider={false}
                    showBottomDivider={false}
                    showDiamonds={false}
                    padding="none"
                    showGridBackground={true}
                    className=""
                >
                    <div className="col-span-4 sm:col-span-6 lg:col-span-12 space-y-12">
                        {/* Section Header */}
                        <div className="text-center space-y-4">
                            <h2 className="text-5xl font-medium tracking-tight">
                                An MVP agency responsible for code <br />
                                <span className="font-light italic">
                                    and
                                </span>{' '}
                                <span className="text-gray-500">
                                    customer acquisition.
                                </span>
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                From idea - to code - to launch - to customers.
                                In that order.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                            {/* Feature 1 */}
                            <div className="space-y-6">
                                <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-xl p-8 relative">
                                    <img
                                        src="/lovable-uploads/1.png"
                                        alt="Tools Integration"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-medium">
                                        Modern, hyper-reliable stack
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Acme builds insanely fast with the help
                                        of software powerhouses. No bugs, no
                                        fluff.
                                    </p>
                                    <div
                                        className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer group"
                                        onClick={() =>
                                            window.open(
                                                'https://calendly.com/harrison-from-acme/30min',
                                                '_blank'
                                            )
                                        }
                                    >
                                        <span className="text-sm font-medium">
                                            Let's talk ideas
                                        </span>
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="space-y-6">
                                <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-xl p-8 relative">
                                    <img
                                        src="/lovable-uploads/2.png"
                                        alt="Global Companies"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-medium">
                                        Start to finish, code-to-customer.
                                    </h3>
                                    <p className="text-muted-foreground">
                                        We don't hand you the code & disappear.
                                        We code it, deploy it, & sell it. We
                                        source the leads, build the systems,
                                        everything.
                                    </p>
                                    <div
                                        className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer group"
                                        onClick={() =>
                                            window.open(
                                                'https://calendly.com/harrison-from-acme/30min',
                                                '_blank'
                                            )
                                        }
                                    >
                                        <span className="text-sm font-medium">
                                            Get started
                                        </span>
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="space-y-6">
                                <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-xl p-8 relative">
                                    <img
                                        src="/lovable-uploads/3.png"
                                        alt="Social Data"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-medium">
                                        Done-for-you marketing systems.
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Not just outbound. We'll build organic
                                        content funnels within popular
                                        communities to get your first customers,
                                        too.
                                    </p>
                                    <div
                                        className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer group"
                                        onClick={() =>
                                            window.open(
                                                'https://calendly.com/harrison-from-acme/30min',
                                                '_blank'
                                            )
                                        }
                                    >
                                        <span className="text-sm font-medium">
                                            Build your MVP
                                        </span>
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </GridBackgroundSection>

                {/* Diagonal Slash Divider */}
                <DiagonalDivider />

                {/* ... more sections would go here ... */}
            </main>
        </div>
    );
};

export default Landing;
