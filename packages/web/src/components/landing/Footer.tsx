import { Link } from '@tanstack/react-router';
import { StructaIcon } from '@/components/ui/icons';
import { HomeIconLink } from '@/components/ui/link';
import { Container } from '@/components/layout/Container';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { GridPattern } from '@/components/layout/GridPattern';

export function Footer() {
    return (
        <footer className="relative w-full min-h-[80dvh] bg-background flex flex-col justify-between">
            <GridPattern className="absolute inset-0 z-0 text-ds-mono-100 dark:text-ds-mono-700" />
            <Container
                size="full"
                className="relative z-10 overflow-y-auto py-15 lg:py-32 flex flex-col justify-center"
            >
                <div className="w-full flex flex-col gap-14 items-center lg:items-start lg:flex-row lg:justify-between">
                    {/* Column 1: Brand & Company Info */}
                    <div className="flex flex-col items-center lg:items-start w-60">
                        <HomeIconLink variant="default" />
                        <p className="text-base text-muted-foreground mt-4">
                            &copy; 2026 Propagate
                        </p>
                    </div>

                    {/* Column 2: Company */}
                    <ul className="flex flex-col gap-y-4 items-center lg:items-start text-base">
                        <h3 className="font-heading font-medium text-text">
                            Company
                        </h3>
                        <Link
                            to="/about"
                            className="text-muted-foreground hover:text-accent transition-colors"
                        >
                            home
                        </Link>
                        <Link
                            to="/blog"
                            className="text-muted-foreground hover:text-accent transition-colors"
                        >
                            guides
                        </Link>
                        <Link
                            to="/privacy"
                            className="text-muted-foreground hover:text-accent transition-colors"
                        >
                            privacy policy
                        </Link>
                        <Link
                            to="/terms"
                            className="text-muted-foreground hover:text-accent transition-colors"
                        >
                            terms of service
                        </Link>
                    </ul>

                    {/* Column 3: Resources/Tools */}
                    <ul className="flex flex-col gap-y-4 items-center lg:items-start">
                        <h3 className="font-heading font-medium text-text">
                            Resources
                        </h3>
                        <Link
                            to="/use-cases/kitchen"
                            className="text-muted-foreground hover:text-accent transition-colors"
                        >
                            floor restoration guide
                        </Link>
                        <Link
                            to="/use-cases/extension"
                            className="text-muted-foreground hover:text-accent transition-colors"
                        >
                            all guides
                        </Link>
                    </ul>

                    {/* Column 4: Social & Theme */}
                    <ul className="flex flex-col gap-y-4 items-center lg:items-start">
                        <h3 className="font-heading font-medium text-text">
                            Socials
                        </h3>
                        <a
                            href="https://twitter.com/placeholder"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-accent transition-colors"
                        >
                            @getstructa
                        </a>
                        <a
                            href="https://instagram.com/placeholder"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-accent transition-colors"
                        >
                            @lifewithchracter
                        </a>
                        <a
                            href="https://linkedin.com/placeholder"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-accent transition-colors"
                        >
                            discord
                        </a>
                        <li>
                            <ThemeToggle />
                        </li>
                    </ul>
                </div>
            </Container>

            {/* Bottom Section: Wordmark Image */}
            <div className="absolute bottom-0 left-0 right-0 w-full z-0">
                <div className="flex justify-center">
                    <img
                        src="/wordmark-footer-light.webp"
                        alt="Structa"
                        className="w-full max-w-[1920px] dark:hidden"
                    />
                    <img
                        src="/wordmark-footer-dark.webp"
                        alt="Structa"
                        className="w-full max-w-[1920px] hidden dark:block"
                    />
                </div>
            </div>
        </footer>
    );
}
