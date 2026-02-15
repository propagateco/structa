import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { GridBackgroundSection } from '@/components/layout';
import { Button } from '@/components/ui/button';

export interface HeroProps {
    title?: string;
    titleTop?: string;
    titleBottom?: string;
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
    title = 'Confident renovation decisions\n in minutes, not months',
    titleTop = 'Renovate with confidence.',
    // titleBottom = ' AI guidance for your property, the home for renovation planning.',
    // titleBottom = 'AI that understands your property and guides every decision.',
    titleBottom = 'AI-powered workspace for UK homeowners.',
    description = 'AI assistant that understands your property and guides your renovation. Budget tracking, floor planning, and tradesperson matching in one intelligent workspace.',

    // description = 'Eliminate the guesswork AI-powered workspace that brings context, clarity, and confidence to every home renovation.',
    primaryCTA = { text: 'get started', to: '/login' },
    secondaryCTA = {
        text: 'our latest renovation guide',
        to: '/guides/renovation-checklist',
    },
}: HeroProps) {
    return (
        <GridBackgroundSection
            variant="hero"
            showTopDivider={false}
            showBottomDivider={true}
            showDiamonds={false}
            showGridBackground={true}
        >
            <div className="max-w-xl md:max-w-2xl relative col-span-4 sm:col-span-6 lg:col-span-8 space-y-5 sm:space-y-6 pt-10 pb-5 md:pb-16">
                {/* Hero Title */}
                <h1 className="font-heading text-text font-normal tracking-tight text-4xl lg:text-5xl text-left whitespace-pre-line">
                    {titleTop}
                    <br />
                    <span className="text-text-secondary">{titleBottom}</span>
                </h1>

                {/* CTA Buttons */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-start gap-2 sm:gap-4 pt-2 md:pt-3">
                    <Link to={primaryCTA.to} className="w-full sm:w-auto">
                        <Button
                            className="w-full inline-flex items-center justify-center"
                            size="lg"
                        >
                            {primaryCTA.text}
                        </Button>
                    </Link>
                    <Link to={secondaryCTA.to} className="w-full sm:w-auto">
                        <Button
                            variant="ghost"
                            className="w-full inline-flex items-center justify-center group"
                            size="lg"
                        >
                            {secondaryCTA.text}

                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </GridBackgroundSection>
    );
}
