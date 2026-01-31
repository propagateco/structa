import LogoShowcase from '@/components/ui/LogoShowcase';
import { TexturedSection } from '@/components/layout';

export interface LogoShowcaseSectionProps {
    title?: string;
    description?: string;
    logos?: string[];
}

export function LogoShowcaseSection({
    title = 'Loved by renovators, designers, and trades',
    description = "Structa's AI searches trusted platforms to gather quotes from specialists matched to your unique property type and project specification.",
    logos = [
        'TrustATrader',
        'MyBuilder',
        'Bark',
        'MyJobQuote',
        'Yelp',
        'Checkatrade',
        'Rated People',
        'Houzz',
        'Thumbtack',
    ],
}: LogoShowcaseSectionProps) {
    return (
        <div className="py-16 md:py-24">
            <div className="w-full grid grid-cols-4 lg:grid-cols-8">
                <div className="space-y-4 pt-0 pb-8 sm:pb-0 sm:pt-0 sm:py-8 col-span-4 lg:col-start-2 lg:col-span-6">
                    <h2 className="text-left lg:text-left font-heading font-medium tracking-tight text-2xl lg:text-3xl text-text">
                        {title}
                    </h2>
                    <h3 className="text-lg text-text-secondary text-left lg:text-left">
                        {description}
                    </h3>
                </div>
            </div>
            <LogoShowcase logos={logos} className="mx-auto w-full" />
        </div>
    );
}
