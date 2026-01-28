import { useTheme } from '@/components/theme-provider'
import { DiagonalPattern } from '@/components/ui/DiagonalPattern'
import { ArrowLink } from '@/components/ui/link'

export interface Feature {
    title: string
    description: string
    cta?: string
    imageBaseName: string
}

export interface FeaturesSectionProps {
    title?: string
    description?: string
    features?: Feature[]
}

export function FeaturesSection({
    title = "Intelligent digital workspace",
    description = "Upload property listings, planning documents, architect drawings, and surveys—the AI transforms static PDFs into a ready-to-use workspace.",
    features = [
        {
            title: "PDF to floor plans in seconds",
            description: "Upload your property listing documents and have scaled floor plans ready for editing your dream layout.",
            cta: "Start with Layout",
            imageBaseName: "terrace-house"
        },
        {
            title: "Track your financial runway",
            description: "See your remaining budget in real-time and forecast what's left to spend. Catch cost overruns before they spiral.",
            cta: "Start with Tracker",
            imageBaseName: "runway"
        },
        {
            title: "Get quotes from matched specialists",
            description: "Using your project brief, AI gathers quotes from people who understand your requirements and timelines.",
            cta: "Start with Workspace",
            imageBaseName: "specialists"
        }
    ],
}: FeaturesSectionProps) {
    const { resolvedTheme } = useTheme()

    return (
        <div className="col-span-4 md:col-span-8 space-y-12 py-20">
            {/* Section Header */}
            <div className="text-center space-y-4">
                <h2 className="font-heading font-medium tracking-tight text-2xl lg:text-3xl text-text">
                    {title}
                </h2>
                <h3 className="text-text-secondary text-center mx-auto text-lg max-w-3xl">
                    {description}
                </h3>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                {features.map((feature) => (
                    <div key={feature.title} className="space-y-6">
                        <div className="aspect-square rounded-xl p-4 relative">
                            <DiagonalPattern
                                color={
                                    'text-ds-powder/50 dark:text-ds-powder/10'
                                }
                            />
                            <img
                                src={`/images/maquettes/${feature.imageBaseName}${resolvedTheme === 'dark' ? '-dark' : ''}.png`}
                                alt={feature.title}
                                className="w-full h-full object-cover relative z-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-heading text-xl font-medium tracking-tight lg:text-2xl">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground">
                                {feature.description}
                            </p>
                            <ArrowLink to="/login">
                                {feature.cta}
                            </ArrowLink>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
