import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getAuth } from "@/lib/auth-server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/app/")({
	beforeLoad: async () => {
		const context = await getAuth();
		return context;
	},
	component: DashboardComponent,
});

function DashboardComponent() {
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await authClient.signOut();
			toast.success("Logged out successfully");
			router.navigate({ to: ("/") as any });
		} catch (error) {
			toast.error("Failed to log out");
			console.error("Logout error:", error);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Dashboard
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Welcome to your renovation assistant
					</p>
				</div>
				<Button
					variant="outline"
					onClick={handleLogout}
				>
					Log Out
				</Button>
			</div>

			<div className="grid md:grid-cols-3 gap-6">
				<Card className="p-6">
					<div className="text-4xl mb-2">🏠</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						My Projects
					</h3>
					<p className="text-gray-600 dark:text-gray-400">
						View and manage your renovation projects
					</p>
				</Card>

				<Card className="p-6">
					<div className="text-4xl mb-2">📐</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						Floor Plans
					</h3>
					<p className="text-gray-600 dark:text-gray-400">
						Upload and edit floor plans
					</p>
				</Card>

				<Card className="p-6">
					<div className="text-4xl mb-2">💬</div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
						Ask The Clerk
					</h3>
					<p className="text-gray-600 dark:text-gray-400">
						Get AI-powered renovation advice
					</p>
				</Card>
			</div>

			<Card className="p-6">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					Getting Started
				</h2>
				<div className="space-y-4">
					<div className="flex items-start gap-4">
						<div className="flex-shrink-0 w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold">
							1
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 dark:text-gray-100">
								Upload your floor plan
							</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								Start by uploading your existing floor plan
							</p>
						</div>
					</div>

					<div className="flex items-start gap-4">
						<div className="flex-shrink-0 w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold">
							2
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 dark:text-gray-100">
								Describe your renovation
							</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								Tell us what changes you want to make
							</p>
						</div>
					</div>

					<div className="flex items-start gap-4">
						<div className="flex-shrink-0 w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold">
							3
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 dark:text-gray-100">
								Get AI recommendations
							</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								Receive expert guidance from The Clerk
							</p>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
