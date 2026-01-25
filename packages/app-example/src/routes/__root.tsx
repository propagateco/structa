import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import appCss from "../styles.css?url";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/space-grotesk";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Structa",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png",
			},
			{ rel: "icon", href: "/favicon.ico" },
		],
	}),
	notFoundComponent: NotFoundComponent,
	shellComponent: RootDocument,
});

function NotFoundComponent() {
	return (
		<div className="bg-background text-foreground min-h-screen flex items-center justify-center">
			<div className="container mx-auto px-4 py-8 text-center">
				<div className="max-w-md mx-auto">
					<h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
					<h2 className="text-2xl font-semibold text-gray-600 mb-4">
						Page Not Found
					</h2>
					<p className="text-gray-500 mb-8">
						The page you're looking for doesn't exist or has been moved.
					</p>
					<div className="space-x-4">
						<Link
							to="/"
							className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
						>
							Go Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
