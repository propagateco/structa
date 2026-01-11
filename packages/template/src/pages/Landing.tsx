import { useNavigate } from 'react-router-dom';
import { ArrowRight, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/landing/Header';
import { Header as TypographyHeader } from '@/components/ui/typography';
import LogoShowcase from '@/components/ui/logo-showcase';
import {
    GridBackgroundSection,
    TexturedSection,
    DiagonalDivider,
    Gutter,
} from '@/components/layout';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col relative bg-ds-paper dark:bg-[hsl(218,13%,7.5%)]">
            <Header />

            {/* Side gutters with noise texture */}
            <div className="fixed left-0 top-0 bottom-0 w-3 sm:w-4 md:w-8 z-0 pointer-events-none bg-ds-mono-100">
                <div
                    className="pointer-events-none [z-index:-1] absolute inset-0 bg-[size:180px] bg-repeat opacity-[0.05] dark:opacity-[0.04]"
                    style={{ backgroundImage: `url('/noise.png')` }}
                />
            </div>
            <div className="fixed right-0 top-0 bottom-0 w-3 sm:w-4 md:w-8 z-0 pointer-events-none bg-ds-mono-100">
                <div
                    className="pointer-events-none [z-index:-1] absolute inset-0 bg-[size:180px] bg-repeat opacity-[0.05] dark:opacity-[0.04]"
                    style={{ backgroundImage: `url('/noise.png')` }}
                />
            </div>

            {/* Main content - aligned with grid overlay */}
            <main className="flex-1 pt-14 mx-3 sm:mx-4 md:mx-8 border-x border-ds-powder/50 dark:border-ds-powder/[0.08] relative z-10">
                {/* Hero Section - Grid Background (hero variant) */}
                <GridBackgroundSection
                    variant="hero"
                    showTopDivider={false}
                    showBottomDivider={true}
                    showDiamonds={false}
                    showGridBackground={true}
                >
                    <div className="col-span-4 sm:col-span-6 lg:col-span-8 space-y-8 py-8">
                        {/* Hero Title */}
                        <TypographyHeader size="h1" className="text-center">
                            Tools for the modern renovator.
                        </TypographyHeader>

                        {/* Hero Description */}
                        <p className="mx-auto max-w-2xl text-center text-muted-foreground">
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
                                className="inline-flex h-11 items-center justify-center rounded-none bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 group"
                            >
                                Start for free
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
                                className="inline-flex h-11 items-center justify-center rounded-none border border-gray-200 dark:border-gray-800 px-8 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Book a demo
                            </Button>
                        </div>
                    </div>
                </GridBackgroundSection>

                <TexturedSection
                    showTopDivider={false}
                    showBottomDivider={false}
                    showTopDiamonds={true}
                    padding="none"
                >
                    <div className="col-span-4 md:col-span-8 space-y-8 py-8">
                        {/* Video Section */}
                        <div className="relative -mt-36">
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
                            <p className="text-center text-muted-foreground">
                                Built for renovators, trades and designers
                                alike.
                            </p>
                            <LogoShowcase
                                logos={[
                                    'TrustATrader',
                                    'MyBuilder',
                                    'Bark',
                                    'MyJobQuote',
                                    'Yelp',
                                    'Checkatrade',
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
                    padding="none"
                >
                    <div className="col-span-4 md:col-span-8">
                        <div className="p-12">
                            {/* Header */}
                            <div className="space-y-4">
                                <span className="text-base text-muted-foreground">
                                    From zero lines of code to your first
                                    customer
                                </span>
                                <TypographyHeader size="h2">
                                    A Full-Stack, modern MVP + actual revenue
                                </TypographyHeader>
                                <p className="text-xl text-muted-foreground max-w-3xl">
                                    Acme has built 20+ apps with React,
                                    Supabase, Vercel & Stripe, then won 1,000+
                                    customers for those apps.
                                </p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
                                    {/* Stat 1 */}
                                    <div className="space-y-2">
                                        <TypographyHeader size="h3">
                                            500K+
                                        </TypographyHeader>
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
                                        <TypographyHeader size="h3">
                                            4M+
                                        </TypographyHeader>
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
                                        <TypographyHeader size="h3">
                                            Infinite
                                        </TypographyHeader>
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
                                        <TypographyHeader size="h3">
                                            100%
                                        </TypographyHeader>
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

                {/* Features Section - Textured */}
                <TexturedSection
                    showTopDivider={false}
                    showBottomDivider={false}
                    padding="none"
                    className=""
                >
                    <div className="col-span-4 md:col-span-8 space-y-12 py-20">
                        {/* Section Header */}
                        <div className="text-center space-y-4">
                            <TypographyHeader size="h2">
                                An MVP agency responsible for code <br />
                                <span className="font-light italic">
                                    and
                                </span>{' '}
                                customer acquisition.
                            </TypographyHeader>
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
                                    <TypographyHeader size="h3">
                                        Modern, hyper-reliable stack
                                    </TypographyHeader>
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
                                    <TypographyHeader size="h3">
                                        Start to finish, code-to-customer.
                                    </TypographyHeader>
                                    <p className="text-muted-foreground">
                                        We don't hand you the code & disappear.
                                        We code it, deploy it, & sell it. We
                                        source the leads, build the systems,
                                        eveything.
                                    </p>
                                    <div
                                        className="flex items-center text-gray-600 hover:text-gray-900 eursor-pointer group"
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
                                    <TypographyHeader size="h3">
                                        Done-for-you marketing systems.
                                    </TypographyHeader>
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
                </TexturedSection>

                {/* Diagonal Slash Divider */}
                <DiagonalDivider />

                {/* ... more sections would go here ... */}
            </main>
        </div>
    );
};

export default Landing;
