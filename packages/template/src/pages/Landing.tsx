import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingIcons from "@/components/ui/floating-icons";
import FloatingNotifications from "@/components/ui/floating-notifications";
import { Header } from "@/components/landing/Header";
import CalendlyEmbed from "@/components/ui/CalendlyEmbed";
import LogoShowcase from "@/components/ui/logo-showcase";
import GridOverlay from "@/components/ui/grid-overlay";

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Grid Overlay - Payload-style vertical lines */}
            <GridOverlay />

            <Header />

            {/* Main content */}
            <main className="flex-1 pt-[72px]">
                {/* Hero Section */}
                <section className="relative min-h-screen">
                    {/* Floating Icons */}
                    <FloatingIcons />

                    {/* Content Container */}
                    <div className="mx-auto max-w-[1400px] px-8 pt-8 pb-24 md:pt-12 md:pb-32 relative z-10">
                        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-0">
                            <div className="col-span-4 sm:col-span-6 sm:col-start-2 lg:col-span-10 lg:col-start-4 space-y-8">
                                {/* New Badge */}
                                <div className="flex justify-center">
                                    <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1 text-sm text-muted-foreground">
                                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary animate-flicker"></span>
                                        <b>New</b>: customer acquisition systems
                                        from scratch
                                    </span>
                                </div>

                                {/* Hero Title */}
                                <h1 className="text-center text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                                    Get an MVP + your first
                                    <br />
                                    customers{" "}
                                    <span className="bg-gradient-to-r from-primary/60 to-primary bg-clip-text text-transparent">
                                        in just 14 days
                                    </span>
                                </h1>

                                {/* Hero Description */}
                                <p className="mx-auto max-w-2xl text-center text-lg text-muted-foreground font-light leading-relaxed">
                                    Acme builds your dream MVP in 14 days
                                    (stress-free). Then, we'll build systems to
                                    get your <b>first paying customers</b>.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                    <Button
                                        onClick={() =>
                                            window.open(
                                                "https://calendly.com/harrison-from-acme/30min",
                                                "_blank",
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
                                                "https://calendly.com/harrison-from-acme/30min",
                                                "_blank",
                                            )
                                        }
                                        className="inline-flex h-11 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 px-8 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        Get Started
                                    </Button>
                                </div>

                                {/* Trusted By Section */}
                                <div className="mt-24 space-y-6">
                                    <p className="text-center text-sm text-muted-foreground font-light">
                                        Trusted by founders & teams everywhere
                                    </p>
                                    <LogoShowcase
                                        logos={[
                                            "Response AI",
                                            "Saral Influencers",
                                            "GreatLab",
                                            "Quolum",
                                        ]}
                                        className="mx-auto"
                                    />
                                </div>

                                {/* Video Section */}
                                <div className="relative mt-8">
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

                                {/* Notifications Section */}
                                <section className="mx-auto max-w-[1400px] px-8 pb-0">
                                    <div className="relative h-[150px]">
                                        <FloatingNotifications />
                                    </div>
                                </section>

                                {/* Stats Section */}
                                <section className="mx-auto max-w-[1400px] px-8 pt-2">
                                    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-0">
                                        <div className="col-span-4 sm:col-span-6 sm:col-start-2 lg:col-span-12 lg:col-start-3">
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
                                                            <h4 className="font-medium">
                                                                Lines of code
                                                            </h4>
                                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                                In-house
                                                                developers
                                                                leveraging 100+
                                                                years of
                                                                experience & the
                                                                latest AI coding
                                                                agents = 14-day
                                                                MVP.
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
                                                                We'll build &
                                                                deploy your
                                                                outbound systems
                                                                to get your
                                                                first customers,
                                                                handling
                                                                infrastructure,
                                                                lead sourcing &
                                                                everything
                                                                in-between.
                                                            </p>
                                                        </div>

                                                        {/* Stat 3 */}
                                                        <div className="space-y-2">
                                                            <h3 className="text-4xl font-medium text-[#f97316]">
                                                                Infinite
                                                            </h3>
                                                            <h4 className="font-medium">
                                                                Revisions &
                                                                Updates
                                                            </h4>
                                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                                We're not a
                                                                one-and-done
                                                                agency. We'll
                                                                keep building
                                                                your MVP &
                                                                improving your
                                                                systems, and
                                                                there's a
                                                                refund-guarantee
                                                                to be
                                                                super-safe.
                                                            </p>
                                                        </div>

                                                        {/* Stat 4 */}
                                                        <div className="space-y-2">
                                                            <h3 className="text-4xl font-medium text-[#f97316]">
                                                                100%
                                                            </h3>
                                                            <h4 className="font-medium">
                                                                Ownership of the
                                                                code
                                                            </h4>
                                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                                Obviously. You
                                                                own every single
                                                                line of code &
                                                                the outbound
                                                                system we build
                                                                you from
                                                                scratch.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Data Quality Section */}
                                <section className="mx-auto max-w-[1400px] px-8 py-16">
                                    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-0">
                                        <div className="col-span-4 sm:col-span-6 sm:col-start-2 lg:col-span-12 lg:col-start-3 space-y-12">
                                            {/* Section Header */}
                                            <div className="text-center space-y-4">
                                                <h2 className="text-5xl font-medium tracking-tight">
                                                    An MVP agency responsible
                                                    for code <br />
                                                    <span className="font-light italic">
                                                        and
                                                    </span>{" "}
                                                    <span className="text-gray-500">
                                                        customer acquisition.
                                                    </span>
                                                </h2>
                                                <p className="text-xl text-muted-foreground">
                                                    From idea - to code - to
                                                    launch - to customers. In
                                                    that order.
                                                </p>
                                            </div>

                                            {/* Features Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                                                {/* Feature 1 */}
                                                <div className="space-y-6">
                                                    <div className="aspect-square bg-gray-50 rounded-xl p-8 relative">
                                                        <img
                                                            src="/lovable-uploads/1.png"
                                                            alt="Tools Integration"
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="text-2xl font-medium">
                                                            Modern,
                                                            hyper-reliable stack
                                                        </h3>
                                                        <p className="text-muted-foreground">
                                                            Acme builds insanely
                                                            fast with the help
                                                            of software
                                                            powerhouses. No
                                                            bugs, no fluff.
                                                        </p>
                                                        <div
                                                            className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer group"
                                                            onClick={() =>
                                                                window.open(
                                                                    "https://calendly.com/harrison-from-acme/30min",
                                                                    "_blank",
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
                                                    <div className="aspect-square bg-gray-50 rounded-xl p-8 relative">
                                                        <img
                                                            src="/lovable-uploads/2.png"
                                                            alt="Global Companies"
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="text-2xl font-medium">
                                                            Start to finish,
                                                            code-to-customer.
                                                        </h3>
                                                        <p className="text-muted-foreground">
                                                            We don't hand you
                                                            the code &
                                                            disappear. We code
                                                            it, deploy it, &
                                                            sell it. We source
                                                            the leads, build the
                                                            systems, everything.
                                                        </p>
                                                        <div
                                                            className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer group"
                                                            onClick={() =>
                                                                window.open(
                                                                    "https://calendly.com/harrison-from-acme/30min",
                                                                    "_blank",
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
                                                    <div className="flex-1">
                                                        <div className="aspect-square bg-gray-50 rounded-xl p-8 relative">
                                                            <img
                                                                src="/lovable-uploads/3.png"
                                                                alt="Social Data"
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="text-2xl font-medium">
                                                            Done-for-you
                                                            marketing systems.
                                                        </h3>
                                                        <p className="text-muted-foreground">
                                                            Not just outbound.
                                                            We'll build organic
                                                            content funnels
                                                            within popular
                                                            communities to get
                                                            your first
                                                            customers, too.
                                                        </p>
                                                        <div
                                                            className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer group"
                                                            onClick={() =>
                                                                window.open(
                                                                    "https://calendly.com/harrison-from-acme/30min",
                                                                    "_blank",
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
                                    </div>
                                </section>

                                <div className="relative w-full overflow-hidden py-12 bg-white">
                                    {/* Gradient Masks */}
                                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                                    {/* Scrolling Container */}
                                    <div className="flex gap-8 animate-scroll">
                                        {/* First Set of Videos */}
                                        <div className="flex gap-8 min-w-full">
                                            <div className="w-[400px] space-y-3">
                                                <img
                                                    src="/seerlonglogo.png"
                                                    alt="Seer Logo"
                                                    className="h-8 w-auto mx-auto"
                                                />
                                                <p className="text-sm text-muted-foreground text-center">
                                                    AI Social monitoring for
                                                    agencies & brands
                                                </p>
                                                <div className="rounded-lg overflow-hidden">
                                                    <video
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-full object-cover rounded-xl border border-gray-200"
                                                        src="/lovable-uploads/seerexample.mp4"
                                                    >
                                                        Your browser does not
                                                        support the video tag.
                                                    </video>
                                                </div>
                                            </div>
                                            <div className="w-[400px] space-y-3">
                                                <img
                                                    src="/lovable-uploads/testimonial2.png"
                                                    alt="Testimonial 1"
                                                    className="h-8 w-auto mx-auto"
                                                />
                                                <p className="text-sm text-muted-foreground text-center">
                                                    B2B Data platform for
                                                    startups
                                                </p>
                                                <div className="rounded-lg overflow-hidden">
                                                    <video
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-full object-cover rounded-xl border border-gray-200"
                                                        src="/lovable-uploads/scrape1.mp4"
                                                    >
                                                        Your browser does not
                                                        support the video tag.
                                                    </video>
                                                </div>
                                            </div>
                                            <div className="w-[400px] space-y-3">
                                                <img
                                                    src="/lovable-uploads/testimonial4.png"
                                                    alt="Testimonial 2"
                                                    className="h-8 w-auto mx-auto"
                                                />
                                                <p className="text-sm text-muted-foreground text-center">
                                                    AI-powered videos for sales
                                                    teams
                                                </p>
                                                <div className="rounded-lg overflow-hidden">
                                                    <video
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-full object-cover rounded-xl border border-gray-200"
                                                        src="/lovable-uploads/exampleresponse.mp4"
                                                    >
                                                        Your browser does not
                                                        support the video tag.
                                                    </video>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Duplicate Set - Exact copy of the first set */}
                                        <div className="flex gap-8 min-w-full">
                                            <div className="w-[400px] space-y-3">
                                                <img
                                                    src="/seerlonglogo.png"
                                                    alt="Seer Logo"
                                                    className="h-8 w-auto mx-auto"
                                                />
                                                <p className="text-sm text-muted-foreground text-center">
                                                    AI Social monitoring for
                                                    agencies & brands
                                                </p>
                                                <div className="rounded-lg overflow-hidden">
                                                    <video
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-full object-cover rounded-xl border border-gray-200"
                                                        src="/lovable-uploads/seerexample.mp4"
                                                    >
                                                        Your browser does not
                                                        support the video tag.
                                                    </video>
                                                </div>
                                            </div>
                                            <div className="w-[400px] space-y-3">
                                                <img
                                                    src="/lovable-uploads/testimonial2.png"
                                                    alt="Testimonial 1"
                                                    className="h-8 w-auto mx-auto"
                                                />
                                                <p className="text-sm text-muted-foreground text-center">
                                                    B2B Data platform for
                                                    startups
                                                </p>
                                                <div className="rounded-lg overflow-hidden">
                                                    <video
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-full object-cover rounded-xl border border-gray-200"
                                                        src="/lovable-uploads/scrape1.mp4"
                                                    >
                                                        Your browser does not
                                                        support the video tag.
                                                    </video>
                                                </div>
                                            </div>
                                            <div className="w-[400px] space-y-3">
                                                <img
                                                    src="/lovable-uploads/testimonial4.png"
                                                    alt="Testimonial 2"
                                                    className="h-8 w-auto mx-auto"
                                                />
                                                <p className="text-sm text-muted-foreground text-center">
                                                    AI-powered videos for sales
                                                    teams
                                                </p>
                                                <div className="rounded-lg overflow-hidden">
                                                    <video
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        className="w-full h-full object-cover rounded-xl border border-gray-200"
                                                        src="/lovable-uploads/exampleresponse.mp4"
                                                    >
                                                        Your browser does not
                                                        support the video tag.
                                                    </video>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Lists Section */}
                                <section className="mx-auto max-w-[1400px] px-8 py-16">
                                    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-0">
                                        <div className="col-span-4 sm:col-span-6 sm:col-start-2 lg:col-span-12 lg:col-start-3 space-y-12">
                                            {/* Header */}
                                            <div className="text-center space-y-4">
                                                <h2 className="text-4xl font-medium">
                                                    We find customers across
                                                    hundreds of communities
                                                </h2>
                                                <p className="text-xl text-muted-foreground">
                                                    Our in-house agents don't
                                                    miss a single opportunity to
                                                    sell to your ideal leads.
                                                </p>

                                                {/* Action Buttons */}
                                                <div className="flex justify-center gap-3 pt-4">
                                                    <Button
                                                        variant="outline"
                                                        className="rounded-full px-6"
                                                        onClick={() =>
                                                            window.open(
                                                                "https://calendly.com/harrison-from-acme/30min",
                                                                "_blank",
                                                            )
                                                        }
                                                    >
                                                        Free Consultation Call
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="rounded-full px-6"
                                                        onClick={() =>
                                                            document
                                                                .getElementById(
                                                                    "pricing",
                                                                )
                                                                ?.scrollIntoView(
                                                                    {
                                                                        behavior:
                                                                            "smooth",
                                                                    },
                                                                )
                                                        }
                                                    >
                                                        Packages
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Filter Cards Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Card 1 - Reddit */}
                                                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                                                    <div className="space-y-4">
                                                        <div className="h-10 w-10 rounded-full bg-[#FF4500] flex items-center justify-center">
                                                            <span className="text-white font-bold">
                                                                R
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-medium">
                                                            Reddit
                                                        </h3>
                                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                                            We'll monitor
                                                            subreddits and find
                                                            customers discussing
                                                            problems your
                                                            product solves.
                                                        </p>
                                                        <div
                                                            className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
                                                            onClick={() =>
                                                                window.open(
                                                                    "https://calendly.com/harrison-from-acme/30min",
                                                                    "_blank",
                                                                )
                                                            }
                                                        >
                                                            <span className="text-sm">
                                                                Find Reddit
                                                                customers
                                                            </span>
                                                            <ArrowUpRight className="ml-2 h-4 w-4" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card 2 - X */}
                                                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                                                    <div className="space-y-4">
                                                        <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
                                                            <span className="text-white font-bold">
                                                                X
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-medium">
                                                            X (formerly Twitter)
                                                        </h3>
                                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                                            We'll track
                                                            conversations and
                                                            engage with
                                                            potential customers
                                                            in real-time.
                                                        </p>
                                                        <div
                                                            className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
                                                            onClick={() =>
                                                                window.open(
                                                                    "https://calendly.com/harrison-from-acme/30min",
                                                                    "_blank",
                                                                )
                                                            }
                                                        >
                                                            <span className="text-sm">
                                                                Build your MVP
                                                            </span>
                                                            <ArrowUpRight className="ml-2 h-4 w-4" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card 3 - YouTube */}
                                                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                                                    <div className="space-y-4">
                                                        <div className="h-10 w-10 rounded-full bg-[#FF0000] flex items-center justify-center">
                                                            <span className="text-white font-bold">
                                                                Y
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-medium">
                                                            YouTube
                                                        </h3>
                                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                                            We'll find relevant
                                                            video content and
                                                            comments where your
                                                            audience hangs out.
                                                        </p>
                                                        <div
                                                            className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
                                                            onClick={() =>
                                                                window.open(
                                                                    "https://calendly.com/harrison-from-acme/30min",
                                                                    "_blank",
                                                                )
                                                            }
                                                        >
                                                            <span className="text-sm">
                                                                Build a YouTube
                                                                funnel
                                                            </span>
                                                            <ArrowUpRight className="ml-2 h-4 w-4" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card 4 - IndieHackers */}
                                                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                                                    <div className="space-y-4">
                                                        <div className="h-10 w-10 rounded-full bg-[#0E0E0E] flex items-center justify-center">
                                                            <span className="text-white font-bold">
                                                                IH
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-medium">
                                                            IndieHackers
                                                        </h3>
                                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                                            We'll connect with
                                                            indie founders and
                                                            discover
                                                            opportunities in the
                                                            maker community.
                                                        </p>
                                                        <div
                                                            className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
                                                            onClick={() =>
                                                                window.open(
                                                                    "https://calendly.com/harrison-from-acme/30min",
                                                                    "_blank",
                                                                )
                                                            }
                                                        >
                                                            <span className="text-sm">
                                                                Blow up on
                                                                IndieHackers
                                                            </span>
                                                            <ArrowUpRight className="ml-2 h-4 w-4" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card 5 - Quora */}
                                                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                                                    <div className="space-y-4">
                                                        <div className="h-10 w-10 rounded-full bg-[#B92B27] flex items-center justify-center">
                                                            <span className="text-white font-bold">
                                                                Q
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-medium">
                                                            Quora
                                                        </h3>
                                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                                            We'll find and
                                                            answer questions
                                                            related to your
                                                            product to build
                                                            authority.
                                                        </p>
                                                        <div
                                                            className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
                                                            onClick={() =>
                                                                window.open(
                                                                    "https://calendly.com/harrison-from-acme/30min",
                                                                    "_blank",
                                                                )
                                                            }
                                                        >
                                                            <span className="text-sm">
                                                                Get Quora
                                                                customers
                                                            </span>
                                                            <ArrowUpRight className="ml-2 h-4 w-4" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card 6 - G2 */}
                                                <div className="rounded-2xl border border-gray-200 bg-white p-8">
                                                    <div className="space-y-4">
                                                        <div className="h-10 w-10 rounded-full bg-[#FF492C] flex items-center justify-center">
                                                            <span className="text-white font-bold">
                                                                G
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-medium">
                                                            G2
                                                        </h3>
                                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                                            We'll track reviews
                                                            and ratings of your
                                                            product and
                                                            competitors on G2.
                                                        </p>
                                                        <div
                                                            className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
                                                            onClick={() =>
                                                                window.open(
                                                                    "https://calendly.com/harrison-from-acme/30min",
                                                                    "_blank",
                                                                )
                                                            }
                                                        >
                                                            <span className="text-sm">
                                                                Find product
                                                                gaps on G2
                                                            </span>
                                                            <ArrowUpRight className="ml-2 h-4 w-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Pricing Section */}
                                <section
                                    id="pricing"
                                    className="mx-auto max-w-[1400px] px-8"
                                >
                                    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-0">
                                        <div className="col-span-4 sm:col-span-6 sm:col-start-2 lg:col-span-12 lg:col-start-3 space-y-8 text-center">
                                            {/* Header */}
                                            <div className="space-y-4">
                                                <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 px-4 py-1.5">
                                                    <span className="text-sm font-medium">
                                                        Unlimited Plans
                                                    </span>
                                                </div>
                                                <h2 className="text-4xl font-medium">
                                                    Two simple plans to choose
                                                    from
                                                </h2>
                                                <p className="text-lg text-muted-foreground">
                                                    With both plans, you get
                                                    unlimited revisions & a
                                                    refund-guarantee. (Plus
                                                    1-to-1 support).
                                                </p>
                                            </div>

                                            {/* Pricing Cards */}
                                            <div className="grid md:grid-cols-2 gap-8 mt-12">
                                                {/* MVP Build Plan */}
                                                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-background p-8">
                                                    <div className="space-y-6">
                                                        {/* Logo */}
                                                        <div className="flex justify-center">
                                                            <img
                                                                src="/lovable-uploads/acme2.png"
                                                                alt="MVP Build"
                                                                className="h-16 w-auto mb-4"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-medium">
                                                                MVP Build
                                                            </h3>
                                                            <p className="text-muted-foreground mt-1">
                                                                Everything you
                                                                need to launch
                                                            </p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-5xl font-medium">
                                                                $1,997
                                                            </p>
                                                            <p className="text-muted-foreground">
                                                                one-time
                                                            </p>
                                                        </div>

                                                        <div className="mt-8">
                                                            <Button
                                                                onClick={() =>
                                                                    window.open(
                                                                        "https://calendly.com/harrison-from-acme/30min",
                                                                        "_blank",
                                                                    )
                                                                }
                                                                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                                            >
                                                                Get Started
                                                                <ArrowRight className="ml-2 h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        <ul className="space-y-4 pt-8">
                                                            {[
                                                                "Full MVP development in 14 days",
                                                                "Codebase Access & 100% Code Ownership",
                                                                "Payments, Emails, Authentication",
                                                                "Backend Database",
                                                                "Scalable Deployment",
                                                                "SEO Optimization",
                                                            ].map(
                                                                (
                                                                    feature,
                                                                    index,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="flex items-start gap-3"
                                                                    >
                                                                        <svg
                                                                            className="h-5 w-5 text-primary flex-shrink-0"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                        >
                                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                                        </svg>
                                                                        <span className="text-muted-foreground text-sm text-left">
                                                                            {
                                                                                feature
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* MVP & Acquisition System */}
                                                <div className="rounded-xl border-2 border-primary bg-background p-8 relative">
                                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                        <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                                                            MOST POPULAR
                                                        </span>
                                                    </div>
                                                    <div className="space-y-6">
                                                        {/* Logo */}
                                                        <div className="flex justify-center">
                                                            <img
                                                                src="/lovable-uploads/acme3.png"
                                                                alt="MVP & Acquisition"
                                                                className="h-16 w-auto mb-4"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-medium">
                                                                MVP &
                                                                Acquisition
                                                                System
                                                            </h3>
                                                            <p className="text-muted-foreground mt-1">
                                                                Complete
                                                                solution with
                                                                customer
                                                                acquisition
                                                            </p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-5xl font-medium">
                                                                $2,997
                                                            </p>
                                                            <p className="text-muted-foreground">
                                                                one-time
                                                            </p>
                                                        </div>

                                                        <div className="mt-8">
                                                            <Button
                                                                onClick={() =>
                                                                    window.open(
                                                                        "https://calendly.com/harrison-from-acme/30min",
                                                                        "_blank",
                                                                    )
                                                                }
                                                                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                                            >
                                                                Get Started
                                                                <ArrowRight className="ml-2 h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        <ul className="space-y-4 pt-8">
                                                            {[
                                                                "Full MVP development in 14 days",
                                                                "Daily Updates",
                                                                "Full codebase & ownership of the code",
                                                                "Payments, Emails, Authentication",
                                                                "Backend Database",
                                                                "Scalable Deployment",
                                                                "SEO Optimization",
                                                                "Cold Email System Setup",
                                                                "Up to 20,000 Ideal Prospects Found [B2B List]",
                                                                "LinkedIn Acquisition System",
                                                                "YouTube Content Funnel",
                                                            ].map(
                                                                (
                                                                    feature,
                                                                    index,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="flex items-start gap-3"
                                                                    >
                                                                        <svg
                                                                            className="h-5 w-5 text-primary flex-shrink-0"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                        >
                                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                                        </svg>
                                                                        <span className="text-muted-foreground text-sm text-left">
                                                                            {
                                                                                feature
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Secure Payment Note */}
                                            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                                <svg
                                                    className="h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <rect
                                                        x="3"
                                                        y="11"
                                                        width="18"
                                                        height="11"
                                                        rx="2"
                                                        ry="2"
                                                    ></rect>
                                                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                                                </svg>
                                                Payments are secure & encrypted
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Footer */}
                                <footer className="relative bg-white border-t border-gray-200">
                                    <div className="mx-auto max-w-[1400px] px-8 py-12">
                                        <div className="flex flex-col items-center gap-8">
                                            {/* Logo */}
                                            <img
                                                src="/lovable-uploads/acmelogo.png"
                                                alt="Acme Logo"
                                                className="h-12 w-auto"
                                            />

                                            {/* Links */}
                                            <ul className="flex flex-wrap justify-center gap-8">
                                                <li>
                                                    <button
                                                        onClick={() =>
                                                            navigate("/legal")
                                                        }
                                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        Legal & NDAs
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={() =>
                                                            window.open(
                                                                "https://calendly.com/harrison-from-acme/30min",
                                                                "_blank",
                                                            )
                                                        }
                                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        Book a Call
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={() =>
                                                            document
                                                                .getElementById(
                                                                    "pricing",
                                                                )
                                                                ?.scrollIntoView(
                                                                    {
                                                                        behavior:
                                                                            "smooth",
                                                                    },
                                                                )
                                                        }
                                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        Pricing
                                                    </button>
                                                </li>
                                                <li>
                                                    <a
                                                        href="mailto:harrison@acmemvp.com"
                                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                                                    >
                                                        <Mail className="h-4 w-4" />
                                                        harrison@acmemvp.com
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </footer>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Landing;
