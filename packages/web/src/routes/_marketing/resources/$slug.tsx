import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { useEffect, useState, useRef } from 'react';
import { authClient } from '@/lib/auth-client';
import { getPublicAuth } from '@/lib/auth-server';
import { parseMarkdown, getPreviewContent } from '@/lib/blog-parser';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    GatedDrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { Lock } from 'lucide-react';
import { TexturedSection, DiagonalDivider } from '@/components/layout';
import { LoginAppleForm } from '@/components/auth/login-apple-form';
import { LoginCodeForm } from '@/components/auth/login-code-form';
import { LoginGoogleForm } from '@/components/auth/login-google-form';
import { Divider } from '@/components/layout/divider';

export const Route = createFileRoute('/_marketing/resources/$slug')({
    beforeLoad: async () => {
        // Fetch session on server side for SEO and initial render
        return await getPublicAuth();
    },
    loader: async ({ params }) => {
        // For tracer bullet, return hardcoded data
        // In production, this would read from /public/resources/{slug}.md
        const post = parseMarkdown(`
---
title: "12-Week Renovation Checklist"
slug: "renovation-checklist"
description: "A comprehensive week-by-week guide to planning your home renovation project, from initial budgeting to final walkthrough."
author: "Structa Team"
publishedAt: "2026-01-31"
readTime: "8 min read"
previewPercentage: 60
coverImage: "/resources/images/renovation-checklist-cover.jpg"
seoTitle: "12-Week Home Renovation Checklist | Structa"
seoDescription: "Free downloadable checklist to guide you through every stage of your renovation project. Week-by-week timeline included."
tags: ["planning", "checklist", "beginner"]
---

# 12-Week Renovation Checklist: Your Complete Guide

Renovating a home is exciting, but without a plan, it can quickly become overwhelming. This week-by-week checklist breaks down the entire process into manageable steps...

## Week 1-2: Planning & Budgeting

The most critical phase of any renovation happens before a single sledgehammer swings. Here's what you need to do...

### 1. Define Your Scope

Determine exactly what you want to renovate. Is it a kitchen extension, loft conversion, or full house refurbishment? Be specific about your goals...

### 2. Research Planning Permission

Before you can apply for planning permission, check with your local council if your project requires it...

## Week 3-4: Design & Planning

Now that you have a clear scope, it's time to start the design process. This is where your vision starts to take shape...

### 3. Hire an Architect or Designer

For major renovations, hiring a professional can save you time and money in the long run...

### 4. Create Detailed Drawings

Work with your architect to create detailed drawings that meet building regulations...

## Week 5-6: Finding Contractors

With your designs in hand, it's time to find the right team to bring your vision to life...

### 5. Get Multiple Quotes

Don't settle for the first contractor you find. Get at least three detailed quotes...

### 6. Check References

Always check references from previous clients before making a final decision...

## Week 7-8: Permits and Approvals

Before any work can begin, you need all the necessary permits and approvals...

### 7. Submit Planning Application

If your project requires planning permission, submit your application to your local council...

### 8. Obtain Building Regulations Approval

Most renovations require building regulations approval to ensure safety and compliance...

## Week 9-10: Preparation

With all approvals in place, it's time to prepare for the construction phase...

### 9. Order Materials

Order your materials in advance to avoid delays once work begins...

### 10. Arrange Temporary Accommodation

If you're staying in the property during renovation, plan for temporary arrangements...

## Week 11-12: Construction Begins

Finally, the construction phase begins. Here's what to expect...

### 11. Site Setup

Ensure your contractor has proper site setup, including scaffolding, waste management, and safety measures...

### 12. Weekly Progress Meetings

Schedule weekly meetings with your contractor to review progress and address any issues...

## Final Steps

Once construction is complete, there are a few final steps to wrap up your renovation...

### 13. Final Inspection

Conduct a final walkthrough with your contractor to identify any defects or incomplete work...

### 14. Snagging List

Create a comprehensive snagging list of all minor issues that need fixing...

### 15. Handover

Receive all necessary documentation, certificates, and warranties from your contractor...

## Aftercare

Your renovation journey doesn't end with construction. Proper aftercare ensures your investment lasts...

### 16. Maintenance Schedule

Create a maintenance schedule for all new systems and materials...

### 17. Warranty Registration

Register any warranties for appliances, windows, and other installations...

---

Congratulations! You've completed your 12-week renovation journey. With proper planning and execution, your home renovation can be a rewarding experience that adds value to your property and enhances your quality of life.

Remember, every renovation is unique, so adapt this checklist to your specific needs and circumstances. Good luck with your project!
    `);

        return { post };
    },
    component: ResourcePost,
});

function ResourcePost() {
    const { post } = Route.useLoaderData();
    const routeContext = Route.useRouteContext();
    const serverSession = routeContext?.session || null;
    const navigate = Route.useNavigate();

    // Use client-side session for reactive auth state
    const { data: clientSession } = authClient.useSession();
    const session = clientSession?.session || serverSession;

    // Drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const previewEndRef = useRef<HTMLDivElement>(null);
    const justClosedRef = useRef(false);
    const hasOpenedRef = useRef(false); // Track if drawer has been opened at least once

    // Track when drawer is manually closed (only after it has been opened once)
    useEffect(() => {
        if (drawerOpen) {
            hasOpenedRef.current = true;
        } else if (hasOpenedRef.current) {
            // Only mark as "just closed" if it was opened before
            justClosedRef.current = true;
        }
    }, [drawerOpen]);

    // Determine if user can see full content
    const canReadFullContent = !!session;
    const isPreview = !canReadFullContent && post;
    const contentToShow =
        isPreview && post
            ? getPreviewContent(post.content, post.previewPercentage)
            : post?.content || '';

    // Scroll to trigger drawer when reaching the preview end
    useEffect(() => {
        if (!isPreview) return;

        const handleScroll = () => {
            const element = previewEndRef.current;
            if (!element || drawerOpen) return;

            const rect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Simple trigger: element is in the viewport
            const isInViewport = rect.top < viewportHeight && rect.bottom > 0;

            if (isInViewport) {
                // Check if user just closed it - don't re-open immediately
                if (justClosedRef.current) {
                    // Reset if user has scrolled away from the trigger point
                    const isAboveViewport = rect.bottom < 0;
                    const isBelowViewport = rect.top > viewportHeight;

                    if (isAboveViewport || isBelowViewport) {
                        justClosedRef.current = false;
                    }
                    return; // Don't re-open yet
                }

                console.log('Triggering drawer - preview end is visible');
                setDrawerOpen(true);
            }
        };

        // Check immediately on mount in case user is already scrolled
        handleScroll();

        // Set up a timeout to trigger after 30 seconds if scroll doesn't work
        const fallbackTimeout = setTimeout(() => {
            if (!drawerOpen) {
                console.log('Fallback timeout triggered after 30s');
                setDrawerOpen(true);
            }
        }, 30000); // 30 seconds fallback

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(fallbackTimeout);
        };
    }, [isPreview, drawerOpen]);

    if (!post) {
        return <div>Resource not found</div>;
    }

    return (
        <TexturedSection
            showTopDivider={false}
            showBottomDivider={false}
            showTopDiamonds={true}
            showGrid={false}
        >
            <div className="col-span-2 md:col-span-8">
                {/* Header */}
                <header className="my-12 space-y-6">
                    {post.coverImage && (
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-64 md:h-96 object-cover rounded-lg"
                        />
                    )}

                    <h1 className="text-4xl md:text-5xl font-bold">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 text-muted-foreground">
                        <span>
                            {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                        {post.readTime && <span>· {post.readTime}</span>}
                        {isPreview && <Lock className="h-4 w-4" />}
                        <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                            Members only
                        </span>
                    </div>

                    <p className="text-xl text-muted-foreground">
                        {post.description}
                    </p>
                </header>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    {isPreview ? (
                        <div className="space-y-6">
                            <ReactMarkdown>{contentToShow}</ReactMarkdown>

                            {/* Invisible ref element to mark the end of preview */}
                            <div
                                ref={previewEndRef}
                                className="h-4 border-t-2 border-dashed border-primary/20"
                            />

                            {/* Drawer that triggers on scroll */}
                            <Drawer
                                open={drawerOpen}
                                onOpenChange={setDrawerOpen}
                            >
                                <GatedDrawerContent>
                                    <div className="px-lg mx-auto max-w-md md:max-w-xl">
                                        <DrawerHeader className="space-y-3">
                                            <DrawerTitle className="font-heading font-light text-4xl text-center">
                                                Sign up below to continue
                                                reading for free
                                            </DrawerTitle>
                                            <DrawerDescription className="text-sm text-balance text-center">
                                                By clicking continue, you agree
                                                to our{' '}
                                                <Link
                                                    to="/terms-of-service"
                                                    className="font-medium underline underline-offset-4 transition-colors duration-200 hover:text-accent"
                                                >
                                                    Terms of Service
                                                </Link>{' '}
                                                and{' '}
                                                <Link
                                                    to="/privacy-policy"
                                                    className="font-medium underline underline-offset-4 transition-colors duration-200 hover:text-accent"
                                                >
                                                    Privacy Policy
                                                </Link>
                                                .
                                            </DrawerDescription>
                                        </DrawerHeader>
                                        <DrawerFooter className="mx-auto max-w-sm md:max-w-md">
                                            <div className="flex flex-col gap-4 md:gap-5">
                                                <div className="flex flex-col gap-3">
                                                    <LoginGoogleForm />
                                                    <LoginAppleForm />
                                                </div>
                                                <Divider text="Or" />
                                                <LoginCodeForm />
                                            </div>
                                            <DrawerClose asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="text-text-muted my-3"
                                                >
                                                    Close
                                                </Button>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </div>
                                </GatedDrawerContent>
                            </Drawer>
                        </div>
                    ) : (
                        <ReactMarkdown>{contentToShow}</ReactMarkdown>
                    )}
                </div>
            </div>
        </TexturedSection>
    );
}
