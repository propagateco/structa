import { Button } from '@/components/ui/button';
import { DiamondCorner, Container } from '@/components/layout';
import { useTheme } from '@/components/theme-provider';

export const Header = () => {
    const { resolvedTheme } = useTheme();

    return (
        <header className="fixed inset-x-0 top-0 h-14 w-full bg-background backdrop-blur-3xl border-b border-ds-powder/50 dark:border-ds-powder/[0.08] z-50">
            {/* Vertical grid lines at column positions - full viewport width */}
            <div className="absolute top-0 bottom-0 left-3 sm:left-4 md:left-8 w-px bg-ds-powder/50 dark:bg-ds-powder/[0.08] pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-3 sm:right-4 md:right-8 w-px bg-ds-powder/50 dark:bg-ds-powder/[0.08] pointer-events-none" />

            {/* Diamond corners - bottom corners of header aligned with border */}
            <div className="absolute -bottom-[1px] left-[13px] sm:left-[17px] md:left-[33px]">
                <DiamondCorner position="bottom-left" />
            </div>
            <div className="absolute -bottom-[1px] right-[13px] sm:right-[17px] md:right-[33px]">
                <DiamondCorner position="bottom-right" />
            </div>

            {/* Content - centered with max-width */}
            <Container
                size="default"
                className="h-full flex items-center justify-between mx-3 sm:mx-4 md:mx-8 lg:mx-12 xl:mx-auto"
            >
                {/* Logo */}
                <div className="flex items-center">
                    <a href="/" className="flex items-center">
                        <img
                            src={resolvedTheme === 'dark' ? '/wordmark-dark.svg' : '/wordmark-light.svg'}
                            alt="Logo"
                            className="h-6 w-auto md:h-8"
                        />
                    </a>
                </div>

                {/* Contact button */}
                <div className="flex items-center space-x-4">
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-none px-4 py-1 text-[12px] font-semibold">
                        Sign Up
                    </Button>
                </div>
            </Container>
        </header>
    );
};
