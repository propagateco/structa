import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/settings")({
	beforeLoad: async ({ context }) => {
		const session = await auth.api.getSession({
			headers: context.request?.headers,
		});

		if (!session) {
			throw redirect({ to: ("/login") as any });
		}

		return {
			session: session.session,
			user: session.user,
		};
	},
	component: SettingsComponent,
});

function SettingsComponent() {
	const router = useRouter();
	const [activeTab, setActiveTab] = React.useState("profile");
	const [isLoading, setIsLoading] = React.useState(false);

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		// Simulate save
		setTimeout(() => {
			setIsLoading(false);
			toast.success("Settings saved successfully!");
		}, 1000);
	};

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
		<div className="max-w-4xl mx-auto space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
					Settings
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Manage your account settings and preferences
				</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="account">Account</TabsTrigger>
					<TabsTrigger value="preferences">Preferences</TabsTrigger>
				</TabsList>

				<TabsContent value="profile" className="mt-6">
					<Card className="p-6">
						<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
							Profile Information
						</h2>
						<form onSubmit={handleSave} className="space-y-4">
							<div className="grid md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="firstName">First Name</Label>
									<Input id="firstName" placeholder="John" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name</Label>
									<Input id="lastName" placeholder="Doe" />
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" disabled value="user@example.com" />
							</div>
							<Button
								type="submit"
								className="w-full bg-teal-600 hover:bg-teal-700"
								disabled={isLoading}
							>
								{isLoading ? "Saving..." : "Save Changes"}
							</Button>
						</form>
					</Card>
				</TabsContent>

				<TabsContent value="account" className="mt-6">
					<Card className="p-6 space-y-6">
						<div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
								Account Settings
							</h2>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								Manage your account security and preferences
							</p>
						</div>

						<div className="space-y-4">
							<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
								<div>
									<div className="font-medium text-gray-900 dark:text-gray-100">
										Email Notifications
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										Receive updates about your projects
									</div>
								</div>
								<Button
									type="button"
									variant="outline"
									onClick={() => toast.info("Feature coming soon!")}
								>
									Disable
								</Button>
							</div>

							<Button
								type="button"
								variant="destructive"
								className="w-full"
								onClick={handleLogout}
							>
								Log Out
							</Button>
						</div>
					</Card>
				</TabsContent>

				<TabsContent value="preferences" className="mt-6">
					<Card className="p-6">
						<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
							Preferences
						</h2>
						<div className="space-y-4">
							<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
								<div>
									<div className="font-medium text-gray-900 dark:text-gray-100">
										Dark Mode
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										Switch between light and dark themes
									</div>
								</div>
								<Button
									type="button"
									variant="outline"
									onClick={() => toast.info("Feature coming soon!")}
								>
									Toggle
								</Button>
							</div>
							<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
								<div>
									<div className="font-medium text-gray-900 dark:text-gray-100">
										Language
									</div>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										Select your preferred language
									</div>
								</div>
								<Button
									type="button"
									variant="outline"
									onClick={() => toast.info("Feature coming soon!")}
								>
									Change
								</Button>
							</div>
						</div>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
