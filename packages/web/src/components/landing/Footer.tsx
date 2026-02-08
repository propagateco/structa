import { Link } from '@tanstack/react-router';
import { StructaIcon } from '@/components/ui/icons';
import { Divider } from '@/components/layout/divider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { GridPattern } from '@/components/layout/GridPattern';

export function Footer() {
    return (
        <footer className="-z-1 w-full h-dvh bg-background flex flex-col justify-between relative">
            <GridPattern className="fixed inset-0 text-ds-powder dark:text-ds-mono-700" />
            <div className="px-4 py-8 sm:px-6 md:px-8 flex-1 relative overflow-y-auto">
                <div className="max-w-[1100px] mx-auto h-full flex flex-col justify-center">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Column 1: Brand & Company Info */}
                        <div className="flex flex-col items-start">
                            <StructaIcon size="default" variant="default" />
                            <p className="text-sm text-muted-foreground mt-4">
                                Structa &copy; 2026
                            </p>
                            <Divider className="my-4" />
                            <p className="text-sm text-muted-foreground">
                                Structa is a Propagate Digital Limited product.
                            </p>
                        </div>

                        {/* Column 2: Use Cases */}
                        <div>
                            <h3 className="font-heading font-medium text-text mb-4">
                                Use Cases
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        to="/use-cases/kitchen"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Kitchen Renovation
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/use-cases/loft"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Loft Conversion
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/use-cases/extension"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Extension Planning
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Company */}
                        <div>
                            <h3 className="font-heading font-medium text-text mb-4">
                                Company
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        to="/about"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/blog"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/privacy"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/terms"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Social & Theme */}
                        <div>
                            <h3 className="font-heading font-medium text-text mb-4">
                                Social
                            </h3>
                            <ul className="space-y-2 mb-4">
                                <li>
                                    <a
                                        href="https://twitter.com/placeholder"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Twitter
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://instagram.com/placeholder"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://linkedin.com/placeholder"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        LinkedIn
                                    </a>
                                </li>
                            </ul>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Wordmark Image */}
            <div className="fixed bottom-0 left-0 right-0 w-full -z-1">
                <div className="flex justify-center">
                    <img
                        src="/wordmark-footer-light.png"
                        alt="Structa"
                        className="w-full max-w-[1920px] dark:hidden"
                    />
                    <img
                        src="/wordmark-footer-dark.png"
                        alt="Structa"
                        className="w-full max-w-[1920px] hidden dark:block"
                    />
                </div>
            </div>
        </footer>
    );
}
