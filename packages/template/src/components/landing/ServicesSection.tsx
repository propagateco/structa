import { ArrowRight } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      image: '/lovable-uploads/1.png',
      title: 'Modern, hyper-reliable stack',
      description: 'Acme builds insanely fast with the help of software powerhouses. No bugs, no fluff.',
      cta: "Let's talk ideas",
    },
    {
      image: '/lovable-uploads/2.png',
      title: 'Start to finish, code-to-customer.',
      description: "We don't hand you the code & disappear. We code it, deploy it, & sell it. We source the leads, build the systems, everything.",
      cta: 'Get started',
    },
    {
      image: '/lovable-uploads/3.png',
      title: 'Done-for-you marketing systems.',
      description: "Not just outbound. We'll build organic content funnels within popular communities to get your first customers, too.",
      cta: 'Build your MVP',
    },
  ];

  return (
    <>
      {/* Section Header - Full Width */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}>
        <div className="cols-16 cols-m-8 text-center mb-16">
          <h2 className="text-5xl font-medium tracking-tight mb-4">
            An MVP agency responsible for code{' '}<br />
            <span className="font-light italic">and</span>{' '}
            <span className="text-gray-500">customer acquisition.</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From idea - to code - to launch - to customers. In that order.
          </p>
        </div>
      </div>

      {/* Services Grid - 3 columns on desktop, full width on mobile */}
      <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}>
        {services.map((service, index) => (
          <div
            key={index}
            className="cols-5 cols-m-8"
          >
            <div className="space-y-6">
              {/* Image */}
              <div className="aspect-square bg-gray-50 rounded-xl p-8 relative">
                <img 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-2xl font-medium">{service.title}</h3>
                <p className="text-muted-foreground">
                  {service.description}
                </p>
                <div 
                  className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer group" 
                  onClick={() => window.open('https://calendly.com/harrison-from-acme/30min', '_blank')}
                >
                  <span className="text-sm font-medium">{service.cta}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ServicesSection;
