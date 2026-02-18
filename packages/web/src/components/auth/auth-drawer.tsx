import { Link } from '@tanstack/react-router';
import type * as React from 'react';
import { useEffect, useState } from 'react';
import { LoginAppleForm } from '@/components/auth/login-apple-form';
import { LoginCodeForm } from '@/components/auth/login-code-form';
import { LoginGoogleForm } from '@/components/auth/login-google-form';
import { VerifyCodeFormDrawer } from '@/components/auth/verify-code-form-drawer';
import { Divider } from '@/components/layout/divider';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    GatedDrawerContent,
} from '@/components/ui/drawer';

/**
 * AuthDrawer Component
 *
 * A reusable authentication drawer with fade+slide animations between initial and verification views.
 * Designed for use across marketing pages to provide a seamless authentication experience without
 * navigating away from the current page.
 *
 * @example
 * ```tsx
 * <AuthDrawer
 *   open={drawerOpen}
 *   onOpenChange={setDrawerOpen}
 *   onSuccess={() => console.log('User authenticated')}
 *   title="Sign up to continue reading"
 *   description="By clicking continue, you agree to our Terms and Privacy Policy."
 *   showLegalLinks={true}
 * />
 * ```
 */
export interface AuthDrawerProps {
    /** Whether the drawer is open */
    open: boolean;
    /** Callback when drawer open state changes */
    onOpenChange: (open: boolean) => void;
    /** Callback when authentication succeeds */
    onSuccess?: () => void;
    /** Optional title to display */
    title?: string;
}

type ViewType = 'initial' | 'verify';

export function AuthDrawer({
    open,
    onOpenChange,
    onSuccess,
    title = 'Sign up to continue reading for free',
}: AuthDrawerProps) {
    // View state: 'initial' shows social login + email form, 'verify' shows code verification
    const [view, setView] = useState<ViewType>('initial');
    // Email state to pass between views
    const [email, setEmail] = useState<string | null>(null);
    // Loading state for verification
    const [_isLoading, setIsLoading] = useState(false);

    // Current URL to use as callback for social login
    const currentURL =
        typeof window !== 'undefined' ? window.location.href : '/';

    /**
     * Reset state when drawer closes
     */
    useEffect(() => {
        if (!open) {
            // Small delay to allow animations to complete before resetting
            const timeoutId = setTimeout(() => {
                setView('initial');
                setEmail(null);
                setIsLoading(false);
            }, 300);
            return () => clearTimeout(timeoutId);
        }
    }, [open]);

    /**
     * Handle email submission from LoginCodeForm
     * Transitions to verify view with the submitted email
     */
    const handleEmailSent = (submittedEmail: string) => {
        setEmail(submittedEmail);
        setView('verify');
    };

    /**
     * Handle successful code verification
     * Closes drawer and calls onSuccess callback
     */
    const handleVerificationSuccess = () => {
        setIsLoading(true);
        // Small delay to ensure session is updated
        setTimeout(() => {
            onOpenChange(false);
            onSuccess?.();
        }, 300);
    };

    /**
     * Handle back button in verify view
     * Returns to initial view
     */
    const handleBack = () => {
        setView('initial');
        setEmail(null);
    };

    /**
     * Default description with Terms/Privacy links
     */
    const defaultDescription = (
        <p className="text-sm text-balance text-center">
            By clicking continue, you agree to our{' '}
            <Link
                to="/terms"
                className="font-medium underline underline-offset-4 transition-colors duration-200 hover:text-accent"
            >
                Terms of Service
            </Link>{' '}
            and{' '}
            <Link
                to="/privacy"
                className="font-medium underline underline-offset-4 transition-colors duration-200 hover:text-accent"
            >
                Privacy Policy
            </Link>
            .{' '}
        </p>
    );

    /**
     * Code verification description
     */
    const verifyDescription = (
        <p className="text-lg text-text-muted text-balance text-center">
            To continue signing in, enter the code sent to{' '}
            <span className="font-semibold">{email}</span> below.
        </p>
    );

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <GatedDrawerContent>
                <div className="px-lg mx-auto max-w-md md:max-w-xl">
                    <DrawerHeader className="space-y-3">
                        <DrawerTitle className="font-heading font-light text-3xl md:text-4xl text-center">
                            {view === 'initial'
                                ? title
                                : "Let's verify your email"}
                        </DrawerTitle>
                        <DrawerDescription>
                            {view === 'initial'
                                ? defaultDescription
                                : verifyDescription}
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className="mx-auto max-w-sm md:max-w-md">
                        <div className="flex flex-col">
                            {/* Initial View: Social login + email form */}
                            <ViewContainer
                                isActive={view === 'initial'}
                                direction="left"
                            >
                                <div className="flex w-full flex-col gap-4 md:gap-5">
                                    <div className="flex flex-col gap-3">
                                        <LoginGoogleForm
                                            callbackURL={currentURL}
                                            onSuccess={onSuccess}
                                        />
                                        <LoginAppleForm
                                            _callbackURL={currentURL}
                                            _onSuccess={onSuccess}
                                        />
                                    </div>
                                    <Divider text="Or" />
                                    <LoginCodeForm
                                        onEmailSent={handleEmailSent}
                                    />
                                </div>
                            </ViewContainer>

                            {/* Verify View: Code entry with email context */}
                            <ViewContainer
                                isActive={view === 'verify'}
                                direction="right"
                            >
                                {email && (
                                    <div className="flex w-full flex-col gap-4 md:gap-5">
                                        <VerifyCodeFormDrawer
                                            email={email}
                                            onBack={handleBack}
                                            onSuccess={
                                                handleVerificationSuccess
                                            }
                                        />
                                    </div>
                                )}
                            </ViewContainer>

                            <DrawerClose asChild>
                                <Button
                                    variant="ghost"
                                    className="text-text-muted w-full mb-6 mt-2 md:mt-4"
                                >
                                    Close
                                </Button>
                            </DrawerClose>
                        </div>
                    </DrawerFooter>
                </div>
            </GatedDrawerContent>
        </Drawer>
    );
}

/**
 * ViewContainer - Handles fade+slide animations between views
 *
 * @param isActive - Whether this view is currently visible
 * @param direction - 'left' for initial view (slides left on exit), 'right' for verify view (slides from right on enter)
 */
interface ViewContainerProps {
    isActive: boolean;
    direction: 'left' | 'right';
    children: React.ReactNode;
}

function ViewContainer({ isActive, direction, children }: ViewContainerProps) {
    return (
        <div
            className={`
				transition-all duration-300 ease-in-out
				${
                    isActive
                        ? 'translate-x-0 opacity-100 max-h-[2000px]'
                        : direction === 'left'
                          ? '-translate-x-full opacity-0 max-h-0 overflow-hidden'
                          : 'translate-x-full opacity-0 max-h-0 overflow-hidden'
                }
			`}
        >
            {children}
        </div>
    );
}
