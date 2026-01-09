import { Button } from '@/components/ui/button';
import { DiamondCorner, Container } from '@/components/layout';

export const Header = () => {
    return (
        <header className="fixed inset-x-0 top-0 h-14 w-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-50">
            {/* Vertical grid lines at column positions - full viewport width */}
            <div className="absolute top-0 bottom-0 left-3 sm:left-4 md:left-8 w-px bg-blue-200/50 dark:bg-blue-300/[0.08] pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-3 sm:right-4 md:right-8 w-px bg-blue-200/50 dark:bg-blue-300/[0.08] pointer-events-none" />

            {/* Diamond corners - bottom corners of header aligned with border */}
            <div className="absolute -bottom-[3px] left-3 sm:left-4 md:left-8 -translate-x-1/2">
                <DiamondCorner position="bottom-left" />
            </div>
            <div className="absolute -bottom-[3px] right-3 sm:right-4 md:right-8 -translate-x-1/2">
                <DiamondCorner position="bottom-right" />
            </div>

            {/* Content - centered with max-width */}
            <Container size="default" className="h-full flex items-center justify-between">
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
            </Container>
        </header>
    );
};
