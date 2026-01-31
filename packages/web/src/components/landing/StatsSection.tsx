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
    title = 'Your property intelligence, secured in the EU',
    description = 'AI that answers based on YOUR specific property—from surveys and floor plans to building regulations. Citations included, data protected, never trained on your personal data.',
    stats = [
        {
            value: 'EU Hosted & GDPR Compliant',
            label: '',
            description:
                'Your property documents never leave the EU. Full data protection compliance for your renovation plans.',
        },
        {
            value: 'Property-Specific RAG',
            label: '',
            description:
                'AI answers based on your surveys and floor plans, with source citations from your own documents.',
        },
        {
            value: 'Zero Training on Your Data',
            label: '',
            description:
                'Your surveys and floor plans are isolated to your workspace. We use them to answer your questions, but never to train our AI models.',
        },
        {
            value: 'UK Standards Knowledge',
            label: '',
            description:
                'Knowledge of building regulations & property age hazards tailored to your specific home.',
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
                    <p className="text-lg text-text-secondary max-w-3xl">
                        {description}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
                        {stats.map(stat => (
                            <div key={stat.label} className="space-y-2">
                                <h3 className="font-serif text-primary text-xl font-medium tracking-tight lg:text-2xl">
                                    {stat.value}
                                </h3>
                                <h4 className="font-serif text-primary tracking-tight">
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
