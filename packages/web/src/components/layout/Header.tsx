import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@tanstack/react-router';
import { DiamondCorner, Container } from '@/components/layout';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { authClient } from '@/lib/auth-client';

export const Header = () => {
    const { resolvedTheme } = useTheme();
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const fallbackText = user?.name
        ? user.name.charAt(0).toUpperCase()
        : user?.email?.charAt(0).toUpperCase() || 'U';

    return (
        <header className="fixed inset-x-0 top-0 h-14 w-full bg-background backdrop-blur-3xl border-b border-ds-powder/50 dark:border-ds-powder/[0.08] z-50">
            {/* Vertical grid lines at column positions - full viewport width */}
            <div className="absolute top-0 bottom-0 left-3 sm:left-4 md:left-8 w-px bg-ds-powder/50 dark:bg-ds-powder/[0.08] pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-3 sm:right-4 md:right-8 w-px bg-ds-powder/50 dark:bg-ds-powder/[0.08] pointer-events-none" />

            {/* Diamond corners - bottom corners of header aligned with border */}
            <div className="absolute -bottom-px left-[13px] sm:left-[17px] md:left-[33px]">
                <DiamondCorner position="bottom-left" />
            </div>
            <div className="absolute -bottom-px right-[13px] sm:right-[17px] md:right-[33px]">
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
                            src={
                                resolvedTheme === 'dark'
                                    ? '/wordmark-dark.svg'
                                    : '/wordmark-light.svg'
                            }
                            alt="Logo"
                            className="h-6 w-auto md:h-8"
                        />
                    </a>
                </div>

                <div className="flex flex-row items-center justify-center gap-2">
                    {user ? (
                        <>
                            <Link to="/app">
                                <Button
                                    variant="ghostPrimary"
                                    className="inline-flex items-center justify-center group"
                                    size={'default'}
                                >
                                    Open App
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>

                            <Avatar className="size-8 cursor-pointer">
                                <AvatarImage
                                    src={user?.image || undefined}
                                    alt={user?.name || 'User'}
                                />
                                <AvatarFallback className="text-sm">
                                    {fallbackText}
                                </AvatarFallback>
                            </Avatar>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button
                                    className="inline-flex items-center justify-center group"
                                    size={'sm'}
                                >
                                    Sign Up
                                </Button>
                            </Link>

                            <Link to="/login">
                                <Button
                                    className="inline-flex items-center justify-center group"
                                    variant="ghost"
                                    size={'sm'}
                                >
                                    Login
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </Container>
        </header>
    );
};
