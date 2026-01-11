import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Legal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Header - same as Landing */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <img 
                  src="/wordmark-light.svg" 
                  alt="Acme Logo" 
                  className="h-8 w-auto" 
                />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>

            {/* Banner Image */}
            <div className="w-full rounded-xl overflow-hidden mb-8 border border-gray-200/60">
              <img 
                src="/lovable-uploads/legal.png"
                alt="Legal Banner"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-medium tracking-tight">Legal & NDAs</h1>

            {/* Content */}
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Acme, we take your intellectual property seriously. When you work with us, you receive 100% ownership of all code, assets, and systems we develop for you. We sign comprehensive NDAs before beginning any project, ensuring your ideas and business details remain completely confidential.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                Our commitment to you includes:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                <li>Full transfer of all intellectual property rights</li>
                <li>Signed non-disclosure agreements protecting your business ideas</li>
                <li>Zero code reuse or refactoring for other clients</li>
                <li>Complete ownership of source code and development assets</li>
                <li>Secure handling of all business-sensitive information</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer - same as Landing */}
        <footer className="relative bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col items-center gap-8">
              <img 
                src="/logo-light.svg"
                alt="Acme Logo" 
                className="h-12 w-auto"
              />
              <ul className="flex flex-wrap justify-center gap-8">
                <li>
                  <button 
                    onClick={() => navigate('/legal')} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Legal & NDAs
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.open('https://calendly.com/harrison-from-acme/30min', '_blank')} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Book a Call
                  </button>
                </li>
                <li>
                  <a 
                    href="mailto:harrison@acmemvp.com" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact: harrison@acmemvp.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Legal; 