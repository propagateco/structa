import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-teal-600 dark:text-teal-400 mb-6">
          Renovate Smarter
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Your AI-powered renovation assistant. Plan, visualize, and execute your home
          projects with expert guidance.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to={("/login") as any}>
            <Button size="lg" className="gap-2 bg-teal-600 hover:bg-teal-700">
              Get Started →
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-gray-800">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12">
          Everything You Need
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="🏠"
            title="Smart Planning"
            description="AI-powered floor plan analysis and renovation suggestions"
          />
          <FeatureCard
            icon="📐"
            title="Precise Estimates"
            description="Get accurate cost and timeline estimates for your projects"
          />
          <FeatureCard
            icon="🤝"
            title="Expert Guidance"
            description="Consult with The Clerk for step-by-step renovation advice"
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}
