import { allPosts } from ".content-collections/generated";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, Lock, Sparkle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AuthDrawer } from "@/components/auth/auth-drawer";
import {
	Crosshair,
	TexturedDiv,
	TexturedFadingDiv,
	TexturedSection,
} from "@/components/layout";
import { Markdown } from "@/components/Markdown";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getPublicAuth } from "@/lib/auth-server";
import { getPreviewContent } from "@/utils/markdown";

export const Route = createFileRoute("/_marketing/guides/$slug")({
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
	const { resolvedTheme } = useTheme();

	const [drawerOpen, setDrawerOpen] = useState(false);
	const sentinelRef = useRef<HTMLDivElement>(null);
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
				threshold: 0, // Trigger when sentinel first enters viewport
				rootMargin: "0px",
			},
		);

		// Small delay to ensure element is in DOM
		const timeoutId = setTimeout(() => {
			if (sentinelRef.current && observerRef.current) {
				observerRef.current.observe(sentinelRef.current);
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
				<header className="my-12 md:my-16 space-y-4">
					{post.coverImage && (
						<div className="relative w-full h-64 md:h-96">
							<img
								src={`${post.coverImage}${resolvedTheme === "dark" ? "-dark" : "-light"}.webp`}
								alt={post.title}
								className="w-full h-full object-cover rounded-none"
							/>
							<Crosshair position="top-left" />
							<Crosshair position="bottom-right" />
						</div>
					)}

					<h1 className="font-heading text-4xl md:text-5xl mt-8">
						{post.title}
					</h1>

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

				<div className="prose prose-lg max-w-none mb-12 md:mb-16 dark:prose-invert">
					{isPreview ? (
						<>
							<Markdown content={contentToShow} />

							<div className="absolute w-full bottom-0 left-0">
								<TexturedFadingDiv className="h-54 bg-gradient-to-t from-background via-background/80 to-transparent"></TexturedFadingDiv>
								<TexturedDiv className="text-center bg-background py-12">
									<div className="px-lg mx-auto max-w-md md:max-w-xl mb-6 space-y-6">
										<h3 className="font-heading font-light text-3xl md:text-4xl text-center">
											Sign up below to continue reading for free
										</h3>
										<p className="text-sm text-balance text-center">
											The rest of this article is available with a free
											membership, which come with a host of benefits:
										</p>
										<ul className="flex flex-col md:mx-20 text-sm gap-4">
											<li className="flex flex-row items-center gap-2">
												<Sparkle className="size-4 text-ds-apricot fill-ds-apricot " />
												Read all member-only articles on Structa
											</li>
											<li className="flex flex-row items-center gap-2">
												<Sparkle className="size-4 text-ds-apricot fill-ds-apricot" />
												Early access to digital tools to plan your renovation
											</li>

											<li className="flex flex-row items-center gap-2">
												<Sparkle className="size-4 text-ds-apricot fill-ds-apricot" />
												Improve you DIY and home improvement skills
											</li>

											<li className="flex flex-row items-center gap-2">
												<Sparkle className="size-4 text-ds-apricot fill-ds-apricot" />
												Access to our community of home renovators
											</li>
										</ul>
									</div>
									<Button
										size="lg"
										className="mt-2 group"
										onClick={() => setDrawerOpen(true)}
									>
										Continue reading
										<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
									</Button>
									<AuthDrawer
										open={drawerOpen}
										onOpenChange={setDrawerOpen}
										onSuccess={() => {
											console.log(
												"User successfully authenticated from guide post",
											);
										}}
										title="Sign up below to continue reading for free"
									/>
								</TexturedDiv>
							</div>
							{/* Sentinel element - triggers drawer when scrolled into view */}
							<div ref={sentinelRef} className="h-1 w-full" />
						</>
					) : (
						<Markdown content={contentToShow} />
					)}
				</div>
			</div>
		</TexturedSection>
	);
}
