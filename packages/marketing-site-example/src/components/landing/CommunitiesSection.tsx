import { ArrowUpRight } from 'lucide-react';
import { PayloadButton } from '@/components/ui/PayloadButton';

const CommunitiesSection = () => {
  const platforms = [
    {
      name: 'Reddit',
      icon: 'R',
      bgColor: '#FF4500',
      description: "We'll monitor subreddits and find customers discussing problems your product solves.",
      cta: 'Find Reddit customers',
    },
    {
      name: 'X (formerly Twitter)',
      icon: 'X',
      bgColor: '#000000',
      description: "We'll track conversations and engage with potential customers in real-time.",
      cta: 'Build your MVP',
    },
    {
      name: 'YouTube',
      icon: 'Y',
      bgColor: '#FF0000',
      description: "We'll find relevant video content and comments where your audience hangs out.",
      cta: 'Build a YouTube funnel',
    },
    {
      name: 'IndieHackers',
      icon: 'IH',
      bgColor: '#0E0E0E',
      description: "We'll connect with indie founders and discover opportunities in the maker community.",
      cta: 'Blow up on IndieHackers',
    },
    {
      name: 'Quora',
      icon: 'Q',
      bgColor: '#B92B27',
      description: "We'll find and answer questions related to your product to build authority.",
      cta: 'Get Quora customers',
    },
    {
      name: 'G2',
      icon: 'G',
      bgColor: '#FF492C',
      description: "We'll track reviews and ratings of your product and competitors on G2.",
      cta: 'Find product gaps on G2',
    },
  ];

  return (
    <>
      {/* Section Header - Full Width */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}>
        <div className="cols-16 cols-m-8 text-center mb-12">
          <h2 className="text-4xl font-medium mb-4">We find customers across hundreds of communities</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Our in-house agents don't miss a single opportunity to sell to your ideal leads.
          </p>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <PayloadButton
              label="Free Consultation Call"
              appearance="secondary"
              onClick={() => window.open('https://calendly.com/harrison-from-acme/30min', '_blank')}
            />
            <PayloadButton
              label="Packages"
              appearance="secondary"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            />
          </div>
        </div>
      </div>

      {/* Platform Cards Grid - 3 columns (5 cols each) on desktop, full width on mobile */}
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}>
        {platforms.map((platform, index) => (
          <div
            key={index}
            className="cols-5 cols-m-8"
          >
            <div className="rounded-2xl border border-gray-200 bg-white p-8 h-full">
              <div className="space-y-4">
                {/* Icon */}
                <div 
                  className="h-10 w-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: platform.bgColor }}
                >
                  <span className="text-white font-bold text-sm">{platform.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-medium">{platform.name}</h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {platform.description}
                </p>

                {/* CTA */}
                <div 
                  className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer group" 
                  onClick={() => window.open('https://calendly.com/harrison-from-acme/30min', '_blank')}
                >
                  <span className="text-sm">{platform.cta}</span>
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CommunitiesSection;
