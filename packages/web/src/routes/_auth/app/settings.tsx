import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_auth/app/settings")({
	component: SettingsComponent,
});

function SettingsComponent() {
	const [activeTab, setActiveTab] = React.useState("profile");
	const [isLoading, setIsLoading] = React.useState(false);

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			toast.success("Settings saved successfully!");
		}, 1000);
	};

	return (
		<>
			<PageContainer>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="profile">Profile</TabsTrigger>
						<TabsTrigger value="account">Account</TabsTrigger>
						<TabsTrigger value="preferences">Preferences</TabsTrigger>
					</TabsList>

					<TabsContent value="profile" className="mt-6">
						<Card className="p-6">
							<h2 className="text-xl font-bold mb-6">Profile Information</h2>
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
									<Input
										id="email"
										type="email"
										disabled
										value="user@example.com"
									/>
								</div>
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? "Saving..." : "Save Changes"}
								</Button>
							</form>
						</Card>
					</TabsContent>

					<TabsContent value="account" className="mt-6">
						<Card className="p-6 space-y-6">
							<div>
								<h2 className="text-xl font-bold mb-2">Account Settings</h2>
								<p className="text-muted-foreground text-sm">
									Manage your account security and preferences
								</p>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div>
										<div className="font-medium">Email Notifications</div>
										<div className="text-sm text-muted-foreground">
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
							</div>
						</Card>
					</TabsContent>

					<TabsContent value="preferences" className="mt-6">
						<Card className="p-6">
							<h2 className="text-xl font-bold mb-6">Preferences</h2>
							<div className="space-y-4">
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div>
										<div className="font-medium">Dark Mode</div>
										<div className="text-sm text-muted-foreground">
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
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div>
										<div className="font-medium">Language</div>
										<div className="text-sm text-muted-foreground">
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
			</PageContainer>
		</>
	);
}
