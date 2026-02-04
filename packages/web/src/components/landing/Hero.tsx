import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { GridBackgroundSection } from '@/components/layout';

export interface HeroProps {
    title?: string;
    description?: string;
    primaryCTA?: {
        text: string;
        to: string;
    };
    secondaryCTA?: {
        text: string;
        to: string;
    };
}

export function Hero({
    title = 'Confident renovation decisions in minutes, not months',
    description = 'An AI assistant that understands your property and guides your renovation. Live budget tracking, visual floor plans, and tradesperson matching in one intelligent workspace.',

    // description = 'Eliminate the guesswork AI-powered workspace that brings context, clarity, and confidence to every home renovation.',
    primaryCTA = { text: 'Start for free', to: '/login' },
    secondaryCTA = { text: 'Login', to: '/login' },
}: HeroProps) {
    return (
        <GridBackgroundSection
            variant="hero"
            showTopDivider={false}
            showBottomDivider={true}
            showDiamonds={false}
            showGridBackground={true}
        >
            <div className="mx-auto max-w-xl md:max-w-2xl relative col-span-4 sm:col-span-6 lg:col-span-8 space-y-5 sm:space-y-6 py-8">
                {/* Hero Title */}
                <h1 className="text-text font-heading font-medium tracking-tight text-4xl lg:text-5xl text-center">
                    {title}
                </h1>

                {/* Hero Description */}
                <p className="text-lg mx-auto max-w-2xl text-center text-text-secondary">
                    {description}
                </p>

                {/* CTA Buttons */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 pt-2 md:pt-3">
                    <Link to={primaryCTA.to} className="w-full sm:w-auto">
                        <Button
                            className="w-full inline-flex items-center justify-center group"
                            size="lg"
                        >
                            {primaryCTA.text}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                    {/* 
                    <Link to={secondaryCTA.to} className="w-full sm:w-auto">
                        <Button
                            variant="outline"
                            className="w-full inline-flex items-center justify-center"
                            size="lg"
                        >
                            {secondaryCTA.text}
                        </Button>
                 </Link>
                    */}
                </div>
            </div>
        </GridBackgroundSection>
    );
}
