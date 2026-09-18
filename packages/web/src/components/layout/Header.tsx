import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageLink } from '@/components/ui/link';
import { DiamondCorner, Container } from '@/components/layout';
import { useTheme } from '@/components/theme-provider';
import { authClient } from '@/lib/auth-client';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

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
                                    ? '/letterhead-dark.svg'
                                    : '/letterhead-light.svg'
                            }
                            alt="Logo"
                            className="h-6 w-auto md:h-8"
                        />
                    </a>
                </div>

                <div className="flex flex-row items-center justify-center gap-6 md:gap-8">
                    <PageLink
                        to="/guides"
                        variant="default"
                        className="!text-md sm:!text-md hover:text-accent dark:hover:text-accent"
                    >
                        guides
                    </PageLink>
                    <PageLink
                        to="/app"
                        variant="primary"
                        arrowForward
                        className="!text-md sm:!text-md hover:text-accent dark:hover:text-accent"
                    >
                        start
                    </PageLink>
                    {user && (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Avatar className="size-7 cursor-pointer">
        <AvatarImage
          src={user?.image || undefined}
          alt={user?.name || 'User'}
        />
        <AvatarFallback className="text-xs">
          {fallbackText}
        </AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent 
      align="end"
      className="min-w-32 shadow-2xl fade-dropdown"
    >
      <DropdownMenuItem
        variant="destructive"
        onClick={async () => {
          await authClient.signOut();
          window.location.href = '/login';
        }}
        className="gap-2"
      >
        <LogOut className="size-4" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)}
                </div>
            </Container>
        </header>
    );
};
