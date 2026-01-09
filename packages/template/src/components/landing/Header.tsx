import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DiamondCorner } from '@/components/layout';

export const Header = () => {
    return (
        <header className="fixed inset-x-0 top-0 h-14 w-screen bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-50">
            {/* Vertical grid lines at column positions - full viewport width */}
            <div className="absolute top-0 bottom-0 left-3 md:left-8 lg:left-12 w-px bg-blue-200/50 dark:bg-blue-300/[0.08] pointer-events-none hidden sm:block" />
            <div className="absolute top-0 bottom-0 right-3 md:right-8 lg:right-12 w-px bg-blue-200/50 dark:bg-blue-300/[0.08] pointer-events-none hidden sm:block" />
            
            {/* Diamond corners - bottom corners of header aligned with border */}
            <div className="absolute -bottom-[3px] left-3 md:left-8 lg:left-12 -translate-x-1/2">
                <DiamondCorner position="bottom-left" />
            </div>
            <div className="absolute -bottom-[3px] right-3 md:right-8 lg:right-12 -translate-x-1/2">
                <DiamondCorner position="bottom-right" />
            </div>
            
            {/* Content - centered with max-width */}
            <div className="h-full flex items-center justify-between px-3 md:px-8 lg:px-12 mx-auto max-w-[1100px]">
                {/* Logo */}
                <div className="flex items-center">
                    <a href="/" className="flex items-center">
                        <img
                            src="/wordmark-light.svg"
                            alt="Logo"
                            className="h-6 w-auto md:h-8"
                        />
                    </a>
                </div>

                {/* Contact button */}
                <div className="flex items-center space-x-4">
                    <Button className="bg-[#18181B] hover:bg-[#18181B]/90 text-white rounded-lg px-4 py-1 text-[12px] font-semibold">
                        Sign Up
                    </Button>
                </div>
            </div>
        </header>
    );
};
