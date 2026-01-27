import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/landing/Header'
import LogoShowcase from '@/components/ui/LogoShowcase'
import { useTheme } from '@/components/theme-provider'
import { DiagonalPattern } from '@/components/ui/DiagonalPattern'
import {
    GridBackgroundSection,
    TexturedSection,
    DiagonalDivider,
} from '@/components/layout'

export const Route = createFileRoute('/')({
    component: LandingPage,
})

function LandingPage() {
    const { resolvedTheme } = useTheme()

    return (
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
                    <div className="col-span-4 sm:col-span-6 lg:col-span-8 space-y-6 py-8">
                        {/* Hero Title */}
                        <h1 className="text-text font-heading font-medium tracking-tight text-4xl lg:text-5xl text-center">
                            Tools for the modern renovator.
                        </h1>

                        {/* Hero Description */}
                        <p className="text-lg mx-auto max-w-2xl text-center text-text-secondary">
                            Eliminate the guesswork from home renovation with an
                            AI-powered Clerk that brings context, clarity, and
                            confidence to every project.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-row items-center justify-center gap-4 pt-2 md:pt-3">
                            <Link to="/login">
                                <Button className="inline-flex items-center justify-center group" size="lg">
                                    Start for free
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" className="inline-flex h-11 items-center justify-center rounded-none border border-border dark:border-gray-800 px-8 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                                    Download for mobile
                                </Button>
                            </Link>
                        </div>
                    </div>
                </GridBackgroundSection>

                <TexturedSection
                    showTopDivider={false}
                    showBottomDivider={false}
                    showTopDiamonds={true}
                    showGrid={true}
                    padding="none"
                >
                    <div className="col-span-4 md:col-span-8 space-y-8 py-8">
                        {/* Logo Showcase Section */}
                        <div className="py-16 md:py-24">
                            <div className="w-full grid grid-cols-4 lg:grid-cols-8">
                                <div className="space-y-4 py-8 col-span-4 lg:col-start-2 lg:col-span-6">
                                    <h2 className="text-left lg:text-left font-heading font-medium tracking-tight text-2xl lg:text-3xl text-text">
                                        Loved by renovators, designers, and
                                        trades
                                    </h2>
                                    <h3 className="text-lg text-text-secondary text-left lg:text-left">
                                        Structa&apos;s AI searches trusted
                                        platforms to gather quotes from
                                        specialists matched to your unique
                                        property type and project specification.
                                    </h3>
                                </div>
                            </div>
                            <LogoShowcase
                                logos={[
                                    'TrustATrader',
                                    'MyBuilder',
                                    'Bark',
                                    'MyJobQuote',
                                    'Yelp',
                                    'Checkatrade',
                                    'Rated People',
                                    'Houzz',
                                    'Thumbtack',
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
                    showGrid={true}
                    padding="none"
                >
                    <div className="col-span-4 md:col-span-8">
                        <div className="py-16">
                            {/* Header */}
                            <div className="space-y-4">
                                <h2 className="font-heading font-medium tracking-tight text-2xl lg:text-3xl text-text">
                                    Your AI renovation partner
                                </h2>
                                <h3 className="text-text-secondary text-lg max-w-3xl">
                                    Never feel lost again. Ask questions about
                                    your specific property, get instant answers
                                    from your surveys and documents, and catch
                                    expensive problems before they happen.
                                </h3>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
                                    {/* Stat 1 */}
                                    <div className="space-y-2">
                                        <h3 className="font-heading text-xl font-medium tracking-tight lg:text-2xl">
                                            500K+
                                        </h3>
                                        <h4 className="font-medium font-heading tracking-tight">
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
                                        <h3 className="font-heading text-xl font-medium tracking-tight lg:text-2xl">
                                            4M+
                                        </h3>
                                        <h4 className="font-medium font-heading tracking-tight">
                                            Cold emails
                                        </h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            We&apos;ll build & deploy your outbound
                                            systems to get your first customers,
                                            handling infrastructure, lead
                                            sourcing & everything in-between.
                                        </p>
                                    </div>

                                    {/* Stat 3 */}
                                    <div className="space-y-2">
                                        <h3 className="font-heading text-xl font-medium tracking-tight lg:text-2xl">
                                            Infinite
                                        </h3>
                                        <h4 className="font-medium font-heading tracking-tight">
                                            Revisions
                                        </h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            We&apos;re not a one-and-done agency.
                                            We&apos;ll keep building your MVP &
                                            improving your systems, and there&apos;s
                                            a refund-guarantee to be super-safe.
                                        </p>
                                    </div>

                                    {/* Stat 4 */}
                                    <div className="space-y-2">
                                        <h3 className="font-heading text-xl font-medium tracking-tight lg:text-2xl">
                                            100%
                                        </h3>
                                        <h4 className="font-medium font-heading tracking-tight">
                                            Code ownership
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

                <DiagonalDivider />

                {/* Features Section - Textured */}
                <TexturedSection
                    showTopDivider={false}
                    showBottomDivider={false}
                    showGrid={true}
                    padding="none"
                >
                    <div className="col-span-4 md:col-span-8 space-y-12 py-20">
                        {/* Section Header */}
                        <div className="text-center space-y-4">
                            <h2 className="font-heading font-medium tracking-tight text-2xl lg:text-3xl text-text">
                                Intelligent digital workspace
                            </h2>
                            <h3 className="text-text-secondary text-center mx-auto text-lg max-w-3xl">
                                Upload property listings, planning documents,
                                architect drawings, and surveys—the AI
                                transforms static PDFs into a ready-to-use
                                workspace.
                            </h3>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                            {/* Feature 1 */}
                            <div className="space-y-6">
                                <div className="aspect-square rounded-xl p-4 relative">
                                    <DiagonalPattern
                                        color={
                                            'text-ds-powder/50 dark:text-ds-powder/10'
                                        }
                                    />
                                    <img
                                        src={`/images/maquettes/terrace-house${resolvedTheme === 'dark' ? '-dark' : ''}.png`}
                                        alt="PDF to floor plans"
                                        className="w-full h-full object-cover relative z-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-heading text-xl font-medium tracking-tight lg:text-2xl">
                                        PDF to floor plans in seconds
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Upload your property listing documents
                                        and have scaled floor plans ready for
                                        editing your dream layout.
                                    </p>
                                    <Link
                                        to="/login"
                                        className="flex items-center text-text dark:text-ds-powder hover:text-text-link cursor-pointer group"
                                    >
                                        <span className="text-sm font-medium">
                                            Start with Layout
                                        </span>
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="space-y-6">
                                <div className="aspect-square p-4 relative">
                                    <DiagonalPattern
                                        color={
                                            'text-ds-powder/50 dark:text-ds-powder/10'
                                        }
                                    />
                                    <img
                                        src={`/images/maquettes/runway${resolvedTheme === 'dark' ? '-dark' : ''}.png`}
                                        alt="Track your financial runway"
                                        className="w-full h-full object-cover relative z-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-heading text-xl font-medium tracking-tight lg:text-2xl">
                                        Track your financial runway
                                    </h3>
                                    <p className="text-muted-foreground">
                                        See your remaining budget in real-time
                                        and forecast what&apos;s left to spend. Catch
                                        cost overruns before they spiral.
                                    </p>
                                    <Link
                                        to="/login"
                                        className="flex items-center text-text dark:text-ds-powder hover:text-text-link cursor-pointer group"
                                    >
                                        <span className="text-sm font-medium">
                                            Start with Tracker
                                        </span>
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="space-y-6">
                                <div className="aspect-square p-4 relative">
                                    <DiagonalPattern
                                        color={
                                            'text-ds-powder/50 dark:text-ds-powder/10'
                                        }
                                    />
                                    <img
                                        src={`/images/maquettes/specialists${resolvedTheme === 'dark' ? '-dark' : ''}.png`}
                                        alt="Get quotes from matched specialists"
                                        className="w-full h-full object-cover relative z-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-heading text-xl font-medium tracking-tight lg:text-2xl">
                                        Get quotes from matched specialists
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Using your project brief, AI gathers
                                        quotes from people who understand your
                                        requirements and timelines.
                                    </p>
                                    <Link
                                        to="/login"
                                        className="flex items-center text-text dark:text-ds-powder hover:text-text-link cursor-pointer group"
                                    >
                                        <span className="text-sm font-medium">
                                            Start with Workspace
                                        </span>
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </TexturedSection>

                {/* Diagonal Slash Divider */}
                <DiagonalDivider />
            </main>
        </div>
    )
}
