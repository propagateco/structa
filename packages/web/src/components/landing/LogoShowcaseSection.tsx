import LogoShowcase from '@/components/ui/LogoShowcase';

export interface LogoShowcaseSectionProps {
    title?: string;
    description?: string;
    logos?: Array<{ name: string; image: string }>;
}

export function LogoShowcaseSection({
    title = 'Powered by trusted UK sources',
    description = 'We gather quotes from specialists matched to your unique property type and project specification.',

    logos = [
        {
            name: 'TrustATrader',
            image: '/images/logo-showcase/trust-a-trader.webp',
        },
        { name: 'MyBuilder', image: '/images/logo-showcase/mybuilder.webp' },
        { name: 'Bark', image: '/images/logo-showcase/bark.webp' },
        { name: 'MyJobQuote', image: '/images/logo-showcase/myjobquote.webp' },
        {
            name: 'Checkatrade',
            image: '/images/logo-showcase/checkatrade.webp',
        },
        {
            name: 'Rated People',
            image: '/images/logo-showcase/rated-people.webp',
        },
        { name: 'Which?', image: '/images/logo-showcase/which.webp' },
        {
            name: 'Buy With Confidence',
            image: '/images/logo-showcase/bywithconfidence.webp',
        },
    ],
}: LogoShowcaseSectionProps) {
    return (
        <div className="py-16 md:py-24">
            <div className="w-full grid grid-cols-4 lg:grid-cols-8">
                <div className="space-y-4 pt-0 pb-8 py-8 col-span-4 lg:col-start-2 lg:col-span-6">
                    <h2 className="text-left lg:text-left font-heading font-medium tracking-tight text-2xl lg:text-3xl text-text">
                        {title}
                    </h2>
                    <p className="text-lg text-text-secondary text-left lg:text-left">
                        {description}
                    </p>
                </div>
            </div>
            <LogoShowcase logos={logos} className="mx-auto w-full" />
        </div>
    );
}
