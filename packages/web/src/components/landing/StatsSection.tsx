import { TexturedSection } from '@/components/layout';

export interface Stat {
    value: string;
    label: string;
    description: string;
}

export interface StatsSectionProps {
    title?: string;
    description?: string;
    stats?: Stat[];
}

export function StatsSection({
    title = 'Your AI renovation partner',
    description = 'Never feel lost again. Ask questions about your specific property, get instant answers from your surveys and documents, and catch expensive problems before they happen.',
    stats = [
        {
            value: '500K+',
            label: 'Lines of code',
            description:
                'In-house developers leveraging 100+ years of experience & the latest AI coding agents = 14-day MVP.',
        },
        {
            value: '4M+',
            label: 'Cold emails',
            description:
                "We'll build & deploy your outbound systems to get your first customers, handling infrastructure, lead sourcing & everything in-between.",
        },
        {
            value: 'Infinite',
            label: 'Revisions',
            description:
                "We're not a one-and-done agency. We'll keep building your MVP & improving your systems, and there's a refund-guarantee to be super-safe.",
        },
        {
            value: '100%',
            label: 'Code ownership',
            description:
                'Obviously. You own every single line of code & the outbound system we build you from scratch.',
        },
    ],
}: StatsSectionProps) {
    return (
        <div className="col-span-4 md:col-span-8">
            <div className="py-16">
                {/* Header */}
                <div className="space-y-4">
                    <h2 className="font-heading font-medium tracking-tight text-2xl lg:text-3xl text-text">
                        {title}
                    </h2>
                    <h3 className="text-text-secondary text-lg max-w-3xl">
                        {description}
                    </h3>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
                        {stats.map(stat => (
                            <div key={stat.label} className="space-y-2">
                                <h3 className="font-subheading text-xl font-medium tracking-tight lg:text-2xl">
                                    {stat.value}
                                </h3>
                                <h4 className="font-subheading font-heading tracking-tight">
                                    {stat.label}
                                </h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {stat.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
