import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
	CheckCircle,
	Clock,
	Download,
	ExternalLink,
	GitBranch,
	Loader2,
	Smartphone,
	XCircle,
} from "lucide-react";
import React from "react";
import { useDeleteDeploymentMutation } from "@/clients/deployment/deployment.mutation.client";
import { deploymentsQueryOptions } from "@/clients/deployment/deployment.query.client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DeploymentStatusProps {
	className?: string;
}

const statusConfig = {
	pending: {
		label: "Pending",
		color: "bg-yellow-500",
		icon: Clock,
		progress: 0,
		description: "Deployment is queued and waiting to start",
	},
	building: {
		label: "Building",
		color: "bg-blue-500",
		icon: Loader2,
		progress: 50,
		description: "Your app is being built with EAS",
	},
	completed: {
		label: "Completed",
		color: "bg-green-500",
		icon: CheckCircle,
		progress: 100,
		description: "Your app has been built successfully",
	},
	failed: {
		label: "Failed",
		color: "bg-red-500",
		icon: XCircle,
		progress: 0,
		description: "Build failed - check error details below",
	},
} as const;

export function DeploymentStatus({ className }: DeploymentStatusProps) {
	const { data: deployments = [], isLoading } = useQuery(
		deploymentsQueryOptions,
	);
	const deleteDeploymentMutation = useDeleteDeploymentMutation();

	if (isLoading) {
		return (
			<div className={className}>
				<Card>
					<CardContent className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin" />
						<span className="ml-2">Loading deployments...</span>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (deployments.length === 0) {
		return (
			<div className={className}>
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12 text-center">
						<Smartphone className="h-12 w-12 text-gray-400 mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							No deployments yet
						</h3>
						<p className="text-gray-600 mb-4">
							Deploy your first mobile app to see it listed here.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className={className}>
			<div className="space-y-4">
				{deployments.map((deployment) => {
					const status = statusConfig[deployment.status];
					const StatusIcon = status.icon;

					return (
						<Card key={deployment.id}>
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="space-y-1">
										<CardTitle className="text-lg">
											{deployment.appName}
										</CardTitle>
										<CardDescription className="text-sm">
											{deployment.description}
										</CardDescription>
									</div>
									<div className="flex items-center gap-2">
										<Badge
											variant="secondary"
											className="flex items-center gap-1"
										>
											<div className={`w-2 h-2 rounded-full ${status.color}`} />
											{status.label}
										</Badge>
									</div>
								</div>
							</CardHeader>

							<CardContent className="space-y-4">
								{/* Progress Bar */}
								<div className="space-y-2">
									<div className="flex items-center justify-between text-sm">
										<span className="flex items-center gap-2">
											<StatusIcon
												className={`h-4 w-4 ${deployment.status === "building" ? "animate-spin" : ""}`}
											/>
											{status.description}
										</span>
										<span className="text-gray-500">
											{format(new Date(deployment.createdAt), "MMM d, HH:mm")}
										</span>
									</div>
									<Progress value={status.progress} className="h-2" />
								</div>

								{/* Brand Color Preview */}
								<div className="flex items-center gap-2 text-sm">
									<span className="text-gray-600">Brand Color:</span>
									<div
										className="w-4 h-4 rounded border border-gray-200"
										style={{ backgroundColor: deployment.brandColor }}
									/>
									<span className="font-mono text-xs">
										{deployment.brandColor}
									</span>
								</div>

								{/* Action Buttons */}
								<div className="flex items-center gap-2 pt-2">
									{deployment.githubRepoUrl && (
										<a
											href={deployment.githubRepoUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button
												variant="outline"
												size="sm"
												className="flex items-center gap-1"
											>
												<GitBranch className="h-3 w-3" />
												View Code
												<ExternalLink className="h-3 w-3" />
											</Button>
										</a>
									)}

									{deployment.buildUrl && (
										<a
											href={deployment.buildUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button
												variant="outline"
												size="sm"
												className="flex items-center gap-1"
											>
												<ExternalLink className="h-3 w-3" />
												Build Details
											</Button>
										</a>
									)}

									{deployment.downloadUrl && (
										<a
											href={deployment.downloadUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button
												variant="outline"
												size="sm"
												className="flex items-center gap-1"
											>
												<Download className="h-3 w-3" />
												Download
											</Button>
										</a>
									)}

									<div className="flex-1" />

									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											deleteDeploymentMutation.mutate(deployment.id)
										}
										isLoading={deleteDeploymentMutation.isPending}
										className="text-red-600 hover:text-red-700 hover:bg-red-50"
									>
										Delete
									</Button>
								</div>

								{/* Error Message */}
								{deployment.status === "failed" && deployment.errorMessage && (
									<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
										<p className="text-sm text-red-800 font-medium">
											Error Details:
										</p>
										<p className="text-sm text-red-700 mt-1">
											{deployment.errorMessage}
										</p>
									</div>
								)}

								{/* Completion Time */}
								{deployment.completedAt && (
									<div className="text-xs text-gray-500">
										Completed:{" "}
										{format(
											new Date(deployment.completedAt),
											"MMM d, yyyy HH:mm",
										)}
									</div>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
