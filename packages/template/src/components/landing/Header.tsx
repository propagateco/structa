import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-[1400px] mx-auto px-8 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img 
              src="/lovable-uploads/f026816a-a5ff-4186-b6a5-2c651d3699ce.png"
              alt="Logo" 
              className="h-14 w-auto md:h-22"
            />
          </a>
        </div>

        {/* Contact button */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => window.open('https://calendly.com/harrison-from-acme/30min', '_blank')}
            className="bg-[#18181B] hover:bg-[#18181B]/90 text-white rounded-lg px-4 py-2 text-[15px] font-medium"
          >
            Build your idea
          </Button>
        </div>
      </div>
    </header>
  );
};