import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { GridBackgroundSection } from '@/components/layout'

export interface HeroProps {
    title?: string
    description?: string
    primaryCTA?: {
        text: string
        to: string
    }
    secondaryCTA?: {
        text: string
        to: string
    }
}

export function Hero({
    title = "Tools for the modern renovator.",
    description = "Eliminate the guesswork from home renovation with an AI-powered Clerk that brings context, clarity, and confidence to every project.",
    primaryCTA = { text: "Start for free", to: "/login" },
    secondaryCTA = { text: "Download for mobile", to: "/login" },
}: HeroProps) {
    return (
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
                    {title}
                </h1>

                {/* Hero Description */}
                <p className="text-lg mx-auto max-w-2xl text-center text-text-secondary">
                    {description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-row items-center justify-center gap-4 pt-2 md:pt-3">
                    <Link to={primaryCTA.to}>
                        <Button className="inline-flex items-center justify-center group" size="lg">
                            {primaryCTA.text}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                    <Link to={secondaryCTA.to}>
                        <Button variant="outline" className="inline-flex h-11 items-center justify-center rounded-none border border-border dark:border-gray-800 px-8 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                            {secondaryCTA.text}
                        </Button>
                    </Link>
                </div>
            </div>
        </GridBackgroundSection>
    )
}
