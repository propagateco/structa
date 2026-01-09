import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DiamondCorner } from '@/components/layout/DiamondCorner';

export const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-50">
            {/* Vertical grid line that extends up through header - aligns with section diamond corners */}
            <div className="absolute top-0 bottom-0 left-8 w-px bg-blue-200/50 dark:bg-blue-300/[0.08] pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-8 w-px bg-blue-200/50 dark:bg-blue-300/[0.08] pointer-events-none" />
            
            {/* Diamond corners that align with section divider below */}
            <div className="absolute -bottom-[2px] left-[4px]">
                <DiamondCorner position="bottom-left" />
            </div>
            <div className="absolute -bottom-[2px] right-[4px]">
                <DiamondCorner position="bottom-right" />
            </div>
            
            <div className="max-w-[1400px] mx-auto px-8 h-14 flex items-center justify-between">
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
