import { Container } from '@/components/layout/Container';
import { GridPattern } from '@/components/layout/GridPattern';
import { HomeIconLink, ScrollToTopLink } from '@/components/ui/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Footer() {
    return (
        <footer className="relative z-0 w-full min-h-[80dvh] bg-background flex flex-col justify-between">
            <GridPattern className="fixed inset-0 z-0 text-ds-mono-100 dark:text-ds-mono-700" />
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
                        <ScrollToTopLink
                            to="/"
                            className="text-md text-muted-foreground hover:text-accent transition-colors"
                        >
                            home
                        </ScrollToTopLink>
                        <ScrollToTopLink
                            to="/privacy"
                            className="text-md text-muted-foreground hover:text-accent transition-colors"
                        >
                            privacy policy
                        </ScrollToTopLink>
                        <ScrollToTopLink
                            to="/terms"
                            className="text-md text-muted-foreground hover:text-accent transition-colors"
                        >
                            terms of service
                        </ScrollToTopLink>
                    </ul>

                    {/* Column 3: Resources/Tools */}
                    <ul className="flex flex-col gap-y-4 items-center lg:items-start">
                        <h3 className="font-heading font-medium text-text">
                            Resources
                        </h3>

                        <ScrollToTopLink
                            to="/guides"
                            className="text-md text-muted-foreground hover:text-accent transition-colors"
                        >
                            guides
                        </ScrollToTopLink>
                    </ul>

                    {/* Column 4: Social & Theme */}
                    <ul className="flex flex-col gap-y-4 items-center lg:items-start">
                        <h3 className="font-heading font-medium text-text">
                            Socials
                        </h3>
                        <a
                            href="https://x.com/getstructa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-md text-muted-foreground hover:text-accent transition-colors"
                        >
                            @getstructa
                        </a>
                        <a
                            href="https://www.instagram.com/lifewithcharacter"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-md text-muted-foreground hover:text-accent transition-colors"
                        >
                            @lifewithcharacter
                        </a>
                        <li>
                            <ThemeToggle />
                        </li>
                    </ul>
                </div>
            </Container>

            {/* Bottom Section: Wordmark Image */}
            <div className="fixed bottom-0 left-0 right-0 w-full z-0">
                <div className="flex justify-center">
                    <img
                        src="/wordmark-footer-light.webp"
                        alt="Structa"
                        className="w-full max-w-[1920px] dark:hidden"
                    />
                    <img
                        src="/wordmark-footer-light.webp"
                        alt="Structa"
                        className="w-full max-w-[1920px] hidden dark:block opacity-30"
                    />
                </div>
            </div>
        </footer>
    );
}
