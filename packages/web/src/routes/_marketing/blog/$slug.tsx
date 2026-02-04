import { allPosts } from ".content-collections/generated";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoginAppleForm } from "@/components/auth/login-apple-form";
import { LoginCodeForm } from "@/components/auth/login-code-form";
import { LoginGoogleForm } from "@/components/auth/login-google-form";
import { TexturedSection } from "@/components/layout";
import { Divider } from "@/components/layout/divider";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	GatedDrawerContent,
} from "@/components/ui/drawer";
import { authClient } from "@/lib/auth-client";
import { getPublicAuth } from "@/lib/auth-server";
import { getPreviewContent } from "@/utils/markdown";

export const Route = createFileRoute("/_marketing/blog/$slug")({
	beforeLoad: async () => {
		return await getPublicAuth();
	},
	loader: ({ params }) => {
		const post = allPosts.find((p: any) => p.slug === params.slug);
		if (!post) {
			throw notFound();
		}
		return { post };
	},
	component: BlogPost,
});

function BlogPost() {
	const { post } = Route.useLoaderData();
	const routeContext = Route.useRouteContext();
	const serverSession = routeContext?.session || null;

	const { data: clientSession } = authClient.useSession();
	const session = clientSession?.session || serverSession;

	const [drawerOpen, setDrawerOpen] = useState(false);
	const ctaSectionRef = useRef<HTMLDivElement>(null);
	const justClosedRef = useRef(false);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const hasTriggeredRef = useRef(false);
	const drawerOpenRef = useRef(false);
	const hasScrolledToTopRef = useRef(false);

	// Keep drawerOpenRef in sync with state
	useEffect(() => {
		drawerOpenRef.current = drawerOpen;
	}, [drawerOpen]);

	useEffect(() => {
		if (!drawerOpen) {
			justClosedRef.current = true;
			// Reset hasTriggeredRef when drawer closes
			setTimeout(() => {
				justClosedRef.current = false;
			}, 1000);
		}
	}, [drawerOpen]);

	const canReadFullContent = !!session;
	const isPreview = !canReadFullContent && post;
	const contentToShow =
		isPreview && post
			? getPreviewContent(post.content, post.previewPercentage || 30)
			: post?.content || "";

	// Reset trigger when scrolling back to top of page
	useEffect(() => {
		if (!isPreview) return;

		const handleScroll = () => {
			const scrollY = window.scrollY;
			const isAtTop = scrollY < 100;

			if (isAtTop && hasTriggeredRef.current && !hasScrolledToTopRef.current) {
				console.log("Scrolled to top - resetting drawer trigger");
				hasTriggeredRef.current = false;
				hasScrolledToTopRef.current = true;
			}

			if (!isAtTop) {
				hasScrolledToTopRef.current = false;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [isPreview]);

	const handleDrawerOpen = useCallback(() => {
		if (!justClosedRef.current && !hasTriggeredRef.current) {
			console.log("Opening drawer");
			setDrawerOpen(true);
			hasTriggeredRef.current = true;
		}
	}, []);

	// Setup IntersectionObserver
	useEffect(() => {
		if (!isPreview) {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
			return;
		}

		console.log("Setting up IntersectionObserver");

		// Use IntersectionObserver for reliable detection
		observerRef.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					console.log("Intersection callback:", {
						isIntersecting: entry.isIntersecting,
						justClosed: justClosedRef.current,
						hasTriggered: hasTriggeredRef.current,
					});

					if (entry.isIntersecting) {
						handleDrawerOpen();
					}
				});
			},
			{
				threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], // Multiple thresholds
				rootMargin: "0px 0px -50px 0px", // Less aggressive margin
			},
		);

		// Small delay to ensure element is in DOM
		const timeoutId = setTimeout(() => {
			if (ctaSectionRef.current && observerRef.current) {
				console.log("Observing CTA section");
				observerRef.current.observe(ctaSectionRef.current);

				// Also check immediately
				const rect = ctaSectionRef.current.getBoundingClientRect();
				const viewportHeight = window.innerHeight;
				const isVisible = rect.top < viewportHeight && rect.bottom > 0;
				console.log("Immediate check:", {
					rectTop: rect.top,
					rectBottom: rect.bottom,
					viewportHeight,
					isVisible,
				});

				if (isVisible) {
					handleDrawerOpen();
				}
			} else {
				console.log("CTA section ref not available");
			}
		}, 100);

		// Fallback timeout in case IntersectionObserver doesn't fire
		const fallbackTimeout = setTimeout(() => {
			if (
				!hasTriggeredRef.current &&
				!justClosedRef.current &&
				!drawerOpenRef.current
			) {
				console.log("Fallback timeout triggered - opening drawer");
				setDrawerOpen(true);
				hasTriggeredRef.current = true;
			}
		}, 30000); // 30 seconds

		return () => {
			clearTimeout(timeoutId);
			clearTimeout(fallbackTimeout);
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [isPreview, handleDrawerOpen]);

	if (!post) {
		return <div>Post not found</div>;
	}

	return (
		<TexturedSection
			showTopDivider={false}
			showBottomDivider={false}
			showTopDiamonds={true}
			showGrid={false}
		>
			<div className="col-span-2 md:col-span-8">
				<header className="my-12 space-y-6">
					{post.coverImage && (
						<img
							src={post.coverImage}
							alt={post.title}
							className="w-full h-64 md:h-96 object-cover rounded-lg"
						/>
					)}

					<h1 className="text-4xl md:text-5xl font-bold">{post.title}</h1>

					<div className="flex items-center gap-4 text-muted-foreground">
						<span>{new Date(post.publishedAt).toLocaleDateString()}</span>
						{post.readTime && <span>· {post.readTime}</span>}
						{isPreview && <Lock className="h-4 w-4" />}
						<span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
							Members only
						</span>
					</div>

					<p className="text-xl text-muted-foreground">{post.description}</p>
				</header>

				<div className="prose prose-lg max-w-none">
					{isPreview ? (
						<>
							<Markdown content={contentToShow} />

							<div
								ref={ctaSectionRef}
								className="my-12 p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-2 border-primary/20"
							>
								<div className="text-center space-y-4">
									<div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full">
										<Lock className="h-4 w-4" />
										<span className="text-sm font-medium">Members only</span>
									</div>
									<h3 className="text-2xl font-bold">Continue reading</h3>
									<p className="text-muted-foreground max-w-md mx-auto">
										Sign up to read the full article and access exclusive
										content
									</p>
									<Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
										<DrawerTrigger asChild>
											<Button size="lg" className="mt-2">
												Continue reading
											</Button>
										</DrawerTrigger>
										<GatedDrawerContent>
											<div className="px-lg mx-auto max-w-md md:max-w-xl">
												<DrawerHeader className="space-y-3">
													<DrawerTitle className="font-heading font-light text-4xl text-center">
														Sign up below to continue reading for free
													</DrawerTitle>
													<DrawerDescription className="text-sm text-balance text-center">
														By clicking continue, you agree to our{" "}
														<Link
															to="/terms-of-service"
															className="font-medium underline underline-offset-4 transition-colors duration-200 hover:text-accent"
														>
															Terms of Service
														</Link>{" "}
														and{" "}
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
							</div>
						</>
					) : (
						<Markdown content={contentToShow} />
					)}
				</div>
			</div>
		</TexturedSection>
	);
}
