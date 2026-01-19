import { Card, CardSection, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from '@/components/ui/dialog';
import { AppInfoType, BrandingForm } from '@/components/forms/branding-form';
import AppPlaceholderIcon from '@/assets/icons/AppPlaceholderIcon';
import { useState } from 'react';
import { AppType } from '@core/app/app.model';

export function PublishOverviewCard({ app }: { app: AppType }) {
	const [appInfo, setAppInfo] = useState<AppInfoType>(app);
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleFormSubmit = (data: AppInfoType) => {
		console.log(data);
		setAppInfo(data);
		setDialogOpen(false);
	};
	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<Card>
				<CardSection>
					<CardDescription>Deployments</CardDescription>
				</CardSection>
				<CardContent>
					<div className="flex items-start justify-between">
						<div className="flex items-center space-x-4">
							<div className="flex-shrink-0">
								{appInfo.icon ? (
									<img
										src={appInfo.icon}
										alt="App icon"
										className="h-16 w-16 rounded-lg object-cover"
									/>
								) : (
									<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
										<AppPlaceholderIcon className="size-20" />
									</div>
								)}
							</div>
							<div>
								<h3 className="text-lg font-medium">{appInfo.name}</h3>
								<p className="text-sm text-muted-foreground">Ready to publish</p>
							</div>
						</div>
						<DialogTrigger asChild>
							<Button variant="outline" onClick={() => setDialogOpen(true)}>
								Edit App Info
							</Button>
						</DialogTrigger>
					</div>
				</CardContent>
			</Card>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit App Information</DialogTitle>
					<DialogDescription>
						Update your app name and icon here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<BrandingForm
					initialData={appInfo}
					onSubmit={handleFormSubmit}
					onCancel={() => setDialogOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}
