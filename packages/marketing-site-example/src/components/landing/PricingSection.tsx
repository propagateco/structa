import { ArrowRight } from 'lucide-react';
import { PayloadButton } from '@/components/ui/PayloadButton';

const PricingSection = () => {
  const plans = [
    {
      logo: '/lovable-uploads/acme2.png',
      name: 'MVP Build',
      description: 'Everything you need to launch',
      price: '$1,997',
      period: 'one-time',
      features: [
        'Full MVP development in 14 days',
        'Codebase Access & 100% Code Ownership',
        'Payments, Emails, Authentication',
        'Backend Database',
        'Scalable Deployment',
        'SEO Optimization',
      ],
      highlighted: false,
    },
    {
      logo: '/lovable-uploads/acme3.png',
      name: 'MVP & Acquisition System',
      description: 'Complete solution with customer acquisition',
      price: '$2,997',
      period: 'one-time',
      badge: 'MOST POPULAR',
      features: [
        'Full MVP development in 14 days',
        'Daily Updates',
        'Full codebase & ownership of the code',
        'Payments, Emails, Authentication',
        'Backend Database',
        'Scalable Deployment',
        'SEO Optimization',
        'Cold Email System Setup',
        'Up to 20,000 Ideal Prospects Found [B2B List]',
        'LinkedIn Acquisition System',
        'YouTube Content Funnel',
      ],
      highlighted: true,
    },
  ];

  return (
    <div id="pricing">
      {/* Section Header - Full Width */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}>
        <div className="cols-16 cols-m-8 text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 px-4 py-1.5 mb-4">
            <span className="text-sm font-medium">Unlimited Plans</span>
          </div>
          <h2 className="text-4xl font-medium mb-4">Two simple plans to choose from</h2>
          <p className="text-lg text-muted-foreground">
            With both plans, you get unlimited revisions & a refund-guarantee. (Plus 1-to-1 support).
          </p>
        </div>
      </div>

      {/* Pricing Cards - 8 cols each on desktop, full width on mobile */}
      <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}>
        {plans.map((plan, index) => (
          <div
            key={index}
            className="cols-8 cols-m-8"
          >
            <div className={`rounded-xl ${plan.highlighted ? 'border-2 border-primary' : 'border border-gray-200 dark:border-gray-800'} bg-background p-8 relative h-full`}>
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="space-y-6">
                {/* Logo */}
                <div className="flex justify-center">
                  <img 
                    src={plan.logo}
                    alt={plan.name}
                    className="h-16 w-auto mb-4"
                  />
                </div>

                {/* Plan Name */}
                <div>
                  <h3 className="text-2xl font-medium">{plan.name}</h3>
                  <p className="text-muted-foreground mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <p className="text-5xl font-medium">{plan.price}</p>
                  <p className="text-muted-foreground">{plan.period}</p>
                </div>

                {/* CTA Button */}
                <div className="mt-8">
                  <PayloadButton
                    label="Get Started"
                    icon="arrow"
                    appearance="primary"
                    fullWidth
                    onClick={() => window.open('https://calendly.com/harrison-from-acme/30min', '_blank')}
                  />
                </div>

                {/* Features List */}
                <ul className="space-y-4 pt-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="text-muted-foreground text-sm text-left">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secure Payment Note - Full Width */}
      <div className="grid mt-8" style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}>
        <div className="cols-16 cols-m-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0110 0v4"></path>
          </svg>
          Payments are secure & encrypted
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
