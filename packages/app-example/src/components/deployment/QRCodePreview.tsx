import { useQuery } from "@tanstack/react-query";
import { Download, ExternalLink, Eye, QrCode } from "lucide-react";
import { useState } from "react";
import { deploymentsQueryOptions } from "@/clients/deployment/deployment.query.client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QRCodePreviewProps {
	className?: string;
}

export function QRCodePreview({ className }: QRCodePreviewProps) {
	const [showQRDialog, setShowQRDialog] = useState(false);
	const [selectedDeployment, setSelectedDeployment] = useState<any>(null);

	const { data: deployments } = useQuery(deploymentsQueryOptions);

	const completedDeployments =
		deployments?.filter(
			(deployment: any) =>
				deployment.status === "completed" && deployment.buildUrl,
		) || [];

	// For development: allow preview if any deployment exists, even if not completed
	const previewableDeployments =
		deployments?.filter((deployment: any) => deployment.buildUrl) || [];

	const handleShowQR = (deployment: any) => {
		setSelectedDeployment(deployment);
		setShowQRDialog(true);
	};

	const generateQRCodeUrl = (buildUrl: string) => {
		// Generate QR code using a service like qr-server.com
		return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(buildUrl)}`;
	};

	if (previewableDeployments.length === 0) {
		return (
			<Button variant="outline" className={className} disabled>
				Preview
			</Button>
		);
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className={className}>
						Preview
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-80">
					<div className="px-2 py-1.5 text-sm font-semibold">
						Recent Deployments
					</div>
					<DropdownMenuSeparator />
					{previewableDeployments.slice(0, 5).map((deployment: any) => (
						<DropdownMenuItem
							key={deployment.id}
							className="flex-col items-start p-3"
						>
							<div className="w-full">
								<div className="flex items-center justify-between mb-1">
									<span className="font-medium truncate">
										{deployment.appName}
									</span>
									<span className="text-xs text-muted-foreground">
										{new Date(deployment.completedAt).toLocaleDateString()}
									</span>
								</div>
								<div className="flex items-center space-x-2 mt-2">
									<Button
										size="sm"
										variant="outline"
										onClick={() => handleShowQR(deployment)}
										className="flex-1"
									>
										<QrCode className="h-3 w-3 mr-1" />
										QR Code
									</Button>
									{deployment.downloadUrl && (
										<Button
											size="sm"
											variant="outline"
											onClick={() =>
												window.open(deployment.downloadUrl, "_blank")
											}
											className="flex-1"
										>
											<Download className="h-3 w-3 mr-1" />
											Download
										</Button>
									)}
									{deployment.buildUrl && (
										<Button
											size="sm"
											variant="outline"
											onClick={() => window.open(deployment.buildUrl, "_blank")}
											className="flex-1"
										>
											<ExternalLink className="h-3 w-3 mr-1" />
											View
										</Button>
									)}
								</div>
							</div>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
				<DialogContent className="sm:max-w-[400px]">
					<DialogHeader>
						<DialogTitle>Scan with Expo Go</DialogTitle>
						<DialogDescription>
							Scan this QR code with the Expo Go app to preview "
							{selectedDeployment?.appName}"
						</DialogDescription>
					</DialogHeader>
					{selectedDeployment && (
						<div className="flex flex-col items-center space-y-4">
							<div className="p-4 bg-white rounded-lg border">
								<img
									src={generateQRCodeUrl(selectedDeployment.buildUrl)}
									alt="QR Code"
									className="w-64 h-64"
								/>
							</div>
							<div className="text-center text-sm text-muted-foreground">
								<p>1. Install Expo Go from the App Store or Google Play</p>
								<p>2. Open Expo Go and tap "Scan QR Code"</p>
								<p>3. Point your camera at the QR code above</p>
							</div>
							<div className="flex space-x-2 w-full">
								{selectedDeployment.downloadUrl && (
									<Button
										variant="outline"
										onClick={() =>
											window.open(selectedDeployment.downloadUrl, "_blank")
										}
										className="flex-1"
									>
										<Download className="h-4 w-4 mr-2" />
										Download APK
									</Button>
								)}
								<Button
									variant="outline"
									onClick={() =>
										window.open(selectedDeployment.buildUrl, "_blank")
									}
									className="flex-1"
								>
									<ExternalLink className="h-4 w-4 mr-2" />
									View Build
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
