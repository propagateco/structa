import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/landing/Header';
import LogoShowcase from '@/components/ui/logo-showcase';
import GridOverlay from '@/components/ui/grid-overlay';
import { BlockWrapper } from '@/components/layout/BlockWrapper';
import { Gutter } from '@/components/layout/Gutter';
import { AnnouncementBadge } from '@/components/ui/AnnouncementBadge';
import { RichText } from '@/components/ui/RichText';
import { PayloadButton } from '@/components/ui/PayloadButton';
import { BackgroundGradient } from '@/components/ui/BackgroundGradient';
import ServicesSection from '@/components/landing/ServicesSection';
import CommunitiesSection from '@/components/landing/CommunitiesSection';
import PricingSection from '@/components/landing/PricingSection';

const LandingPayloadStyle = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      
      {/* Main content */}
      <main className="flex-1 pt-[72px]">
        {/* Hero Section with Payload-style Grid */}
        <BlockWrapper 
          theme="dark" 
          hero
          padding={{ top: 'small', bottom: 'small' }}
          className="relative"
        >
          {/* Grid Overlay */}
          <GridOverlay />
          
          {/* Hero Content Grid */}
          <Gutter className="grid">
            {/* Left Column: Text Content - 6 columns on desktop, full width on mobile */}
            <div className="cols-6 cols-m-8 cols-s-8 space-y-6 relative z-10 py-12">
              {/* Announcement Badge */}
              <AnnouncementBadge 
                label="New"
                text="customer acquisition systems from scratch"
                href="#"
              />
              
              {/* Hero Title */}
              <RichText>
                <h1>
                  Get an MVP + your first customers{' '}
                  <span className="bg-gradient-to-r from-primary/60 to-primary bg-clip-text text-transparent">
                    in just 14 days
                  </span>
                </h1>
              </RichText>
              
              {/* Subtitle */}
              <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                Acme builds your dream MVP in 14 days (stress-free). Then, we'll build systems to get your <strong className="text-white">first paying customers</strong>.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row max-w-md">
                <PayloadButton 
                  label="Book a Call"
                  icon="arrow"
                  appearance="default"
                  hideHorizontalBorders
                  fullWidth
                  onClick={() => window.open('https://calendly.com/harrison-from-acme/30min', '_blank')}
                />
                <PayloadButton 
                  label="Get Started"
                  appearance="secondary"
                  fullWidth
                  onClick={() => window.open('https://calendly.com/harrison-from-acme/30min', '_blank')}
                />
              </div>
            </div>
            
            {/* Right Column: Video Demo - 10 columns starting at column 7, full width on mobile */}
            <div className="cols-10 start-7 cols-m-8 start-m-1 cols-s-8 start-s-1 relative z-10 py-12">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <div className="aspect-[1.91/1]">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                    src="/lovable-uploads/seerexample.mp4"
                    poster="/lovable-uploads/video-poster.jpg"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </Gutter>
          
          {/* Logo Showcase - Full Width Below Video */}
          <Gutter className="grid mt-24 pb-12">
            <div className="cols-16 cols-m-8 cols-s-8 text-center mb-8">
              <p className="text-sm text-gray-400 font-light">
                Trusted by founders & teams everywhere
              </p>
            </div>
            
            <div className="cols-16 cols-m-8 cols-s-8">
              <LogoShowcase 
                logos={[
                  'Response AI', 'Saral Influencers', 'GreatLab', 
                  'Quolum', 'Linq', 'Bionic Talent', 'Acme Inc', 
                  'BuildCo', 'TechStart', 'InnovateLab', 'DataSync', 
                  'CloudFlow', 'NexGen', 'Velocity', 'Apex Systems', 
                  'CoreTech', 'PrimeSoft', 'Quantum Labs'
                ]}
              />
            </div>
          </Gutter>
          
          <BackgroundGradient />
        </BlockWrapper>

        {/* Stats Section - Full width light background */}
        <BlockWrapper theme="light" padding={{ top: 'large', bottom: 'large' }}>
          <GridOverlay />
          <Gutter className="grid">
            {/* Section Header */}
            <div className="cols-16 cols-m-8 cols-s-8 text-center mb-12">
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                From zero lines of code to your first customer
              </p>
              <RichText>
                <h2>A Full-Stack, modern MVP + actual revenue</h2>
              </RichText>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Acme has built 20+ apps with React, Supabase, Vercel & Stripe, then won 1,000+ customers for those apps.
              </p>
            </div>
            
            {/* Stats Grid - 4 columns each */}
            <div className="cols-4 cols-m-8 cols-s-8 space-y-3 p-8 border border-border rounded-lg">
              <h3 className="text-5xl font-bold text-orange-500">500K+</h3>
              <h4 className="text-xl font-semibold">Lines of code</h4>
              <p className="text-muted-foreground text-sm">
                In-house developers leveraging 100+ years of experience & the latest AI coding agents = 14-day MVP.
              </p>
            </div>
            
            <div className="cols-4 cols-m-8 cols-s-8 space-y-3 p-8 border border-border rounded-lg">
              <h3 className="text-5xl font-bold text-blue-500">4M+</h3>
              <h4 className="text-xl font-semibold">Cold Emails</h4>
              <p className="text-muted-foreground text-sm">
                We'll build & deploy your outbound systems to get your first customers, handling infrastructure, lead sourcing & everything in-between.
              </p>
            </div>
            
            <div className="cols-4 cols-m-8 cols-s-8 space-y-3 p-8 border border-border rounded-lg">
              <h3 className="text-5xl font-bold text-green-500">Infinite</h3>
              <h4 className="text-xl font-semibold">Revisions & Updates</h4>
              <p className="text-muted-foreground text-sm">
                We're not a one-and-done agency. We'll keep building your MVP & improving your systems, and there's a refund-guarantee to be super-safe.
              </p>
            </div>
            
            <div className="cols-4 cols-m-8 cols-s-8 space-y-3 p-8 border border-border rounded-lg">
              <h3 className="text-5xl font-bold text-purple-500">100%</h3>
              <h4 className="text-xl font-semibold">Ownership of the code</h4>
              <p className="text-muted-foreground text-sm">
                Obviously. You own every single line of code & the outbound system we build you from scratch.
              </p>
            </div>
          </Gutter>
        </BlockWrapper>

        {/* Services Section */}
        <BlockWrapper theme="light" padding={{ top: 'large', bottom: 'large' }}>
          <GridOverlay />
          <Gutter>
            <ServicesSection />
          </Gutter>
        </BlockWrapper>

        {/* Communities Section */}
        <BlockWrapper theme="light" padding={{ top: 'large', bottom: 'large' }}>
          <GridOverlay />
          <Gutter>
            <CommunitiesSection />
          </Gutter>
        </BlockWrapper>

        {/* Pricing Section */}
        <BlockWrapper theme="light" padding={{ top: 'large', bottom: 'large' }}>
          <GridOverlay />
          <Gutter>
            <PricingSection />
          </Gutter>
        </BlockWrapper>

        {/* CTA Section */}
        <BlockWrapper theme="dark" padding={{ top: 'large', bottom: 'large' }}>
          <Gutter className="grid">
            <div className="cols-8 cols-m-8 cols-s-8 mx-auto text-center space-y-6">
              <RichText>
                <h2>Ready to build your MVP?</h2>
              </RichText>
              <p className="text-lg text-gray-300">
                Join the founders who chose Acme to launch their products in record time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PayloadButton 
                  label="Schedule a Demo"
                  icon="arrow"
                  appearance="default"
                  onClick={() => window.open('https://calendly.com/harrison-from-acme/30min', '_blank')}
                />
                <PayloadButton 
                  label="View Pricing"
                  appearance="secondary"
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                />
              </div>
            </div>
          </Gutter>
          <BackgroundGradient />
        </BlockWrapper>
      </main>
    </div>
  );
};

export default LandingPayloadStyle;
