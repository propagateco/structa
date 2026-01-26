import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
	Clock,
	DollarSign,
	ExternalLink,
	Info,
	Search,
	UserCheck,
	Users,
} from "lucide-react";
import { useState } from "react";
import {
	type Member,
	type MembersQueryParams,
	memberStatsQueryOptions,
	membersQueryOptions,
} from "@/clients/members/members.query.client";
import { stripeAccountQueryOptions } from "@/clients/stripe/stripe.query.client";
import {
	Header,
	HeaderButtons,
	HeaderMain,
	HeaderSubSection,
	HeaderTitle,
} from "@/components/layout/typography";
import { MemberDetailModal } from "@/components/members/member-detail-modal";
import { SalesEmptyState } from "@/components/sales/SalesEmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export const Route = createFileRoute(
	"/_authenticated/_dashboard/_members/members/",
)({
	component: RouteComponent,
});

const statusOptions = [
	{ value: "all", label: "All Statuses" },
	{ value: "active", label: "Active" },
	{ value: "past_due", label: "Past Due" },
	{ value: "canceled", label: "Canceled" },
];

const sortOptions = [
	{ value: "created", label: "Date Joined" },
	{ value: "subscription_date", label: "Subscription Date" },
	{ value: "name", label: "Name" },
	{ value: "email", label: "Email" },
];

const columns: ColumnDef<Member>[] = [
	{
		accessorKey: "customerName",
		header: "Name",
		cell: ({ row }) => {
			const name = row.getValue<string | null>("customerName");
			return <div className="font-medium truncate">{name || "—"}</div>;
		},
	},
	{
		accessorKey: "subscriptionStatus",
		header: "Status",
		cell: ({ row }) => {
			const status = row.getValue<string | null>("subscriptionStatus");
			const isDelinquent = row.original.isDelinquent;
			const customerName = row.original.customerName;
			const subscriptionAmount = row.original.subscriptionAmount;
			const currency = row.original.subscriptionCurrency;

			// Handle no subscription case
			if (!status) {
				const tooltipContent = `${customerName || "This customer"} had a trial that has ended. They need to be converted to a paid subscription.`;

				return (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="inline-flex items-center gap-1 cursor-default">
									<Badge variant="warning">Trial Ended</Badge>
									<Info className="h-3 w-3 text-muted-foreground" />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>{tooltipContent}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				);
			}

			const getMainStatusInfo = (status: string) => {
				switch (status) {
					case "active":
						return { text: "Active", variant: "success" as const };
					case "past_due":
						return { text: "Past Due", variant: "warning" as const };
					case "unpaid":
						return { text: "Unpaid", variant: "destructive" as const };
					case "canceled":
						return { text: "Canceled", variant: "destructive" as const };
					case "trialing":
						return { text: "Free Trial", variant: "info" as const };
					case "incomplete":
						return { text: "Setup Incomplete", variant: "warning" as const };
					default:
						return {
							text: status.replace(/_/g, " "),
							variant: "secondary" as const,
						};
				}
			};

			const mainStatus = getMainStatusInfo(status);

			const getTooltipContent = () => {
				let content = "";

				if (status === "canceled") {
					content = "This subscription was canceled and needs attention.";
				} else if (status === "past_due") {
					content = "Payment is overdue but subscription is still active.";
				} else if (status === "unpaid") {
					content = "Subscription is unpaid and requires immediate action.";
				} else if (status === "trialing") {
					content = "Customer is currently in their free trial period.";
				} else if (status === "incomplete") {
					content = "Subscription setup is not yet complete.";
				} else if (status === "active") {
					content = "Subscription is active and functioning normally.";
				}

				if (isDelinquent) {
					if (content) content += "\n\n";
					content +=
						"Payment Issues: Recent payment attempts have failed. Update payment method or contact customer.";
				}

				return content;
			};

			return (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="inline-flex items-center gap-1 cursor-default">
								<div className="flex items-center gap-1">
									<Badge variant={mainStatus.variant} className="capitalize">
										{mainStatus.text}
									</Badge>
									{isDelinquent && (
										<Badge variant="warning">Payment Failed</Badge>
									)}
								</div>
								<Info className="h-3 w-3 text-muted-foreground" />
							</div>
						</TooltipTrigger>
						<TooltipContent className="max-w-xs">
							<div className="space-y-1">
								{getTooltipContent()
									.split("\n")
									.map((line, index) => (
										<p key={index} className="text-sm">
											{line}
										</p>
									))}
							</div>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		},
	},
	{
		accessorKey: "customerEmail",
		header: "Email",
		cell: ({ row }) => {
			const email = row.getValue<string | null>("customerEmail");
			return <div className="text-sm truncate">{email || "—"}</div>;
		},
	},
	{
		accessorKey: "subscriptionProductName",
		header: "Product",
		cell: ({ row }) => {
			const productName = row.getValue<string | null>(
				"subscriptionProductName",
			);
			return productName || "—";
		},
	},
	{
		accessorKey: "subscriptionAmount",
		header: "Amount",
		cell: ({ row }) => {
			const amount = row.getValue<number | null>("subscriptionAmount");
			const currency = row.original.subscriptionCurrency;

			if (!amount || !currency) {
				return "—";
			}

			return (
				<span className="font-medium">
					{new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: currency.toUpperCase(),
					}).format(amount)}
				</span>
			);
		},
	},
	{
		accessorKey: "customerCreatedAt",
		header: "Joined",
		cell: ({ row }) => {
			const dateString = row.getValue<string>("customerCreatedAt");
			const date = new Date(dateString);
			return format(date, "MMM d, yyyy");
		},
	},
	{
		accessorKey: "subscriptionCreatedAt",
		header: "Subscription Date",
		cell: ({ row }) => {
			const dateString = row.getValue<string | null>("subscriptionCreatedAt");
			if (!dateString) return "—";
			const date = new Date(dateString);
			return format(date, "MMM d, yyyy");
		},
	},
];

function RouteComponent() {
	const [selectedMember, setSelectedMember] = useState<Member | null>(null);
	const [queryParams, setQueryParams] = useState<MembersQueryParams>({
		status: "all",
		sortBy: "created",
		sortOrder: "desc",
		limit: 50,
		offset: 0,
	});

	// Use live query data for reactive updates
	const { data: stripeStatus, isLoading: isLoadingStatus } = useQuery(
		stripeAccountQueryOptions,
	);
	const { data: membersData, isLoading: isLoadingMembers } = useQuery(
		membersQueryOptions(queryParams),
	);
	const { data: stats, isLoading: isLoadingStats } = useQuery(
		memberStatsQueryOptions(),
	);

	const updateQueryParams = (updates: Partial<MembersQueryParams>) => {
		setQueryParams((prev) => ({
			...prev,
			...updates,
			// Reset offset when changing filters
			offset:
				updates.search !== undefined || updates.status !== undefined
					? 0
					: prev.offset,
		}));
	};

	if (isLoadingStatus) {
		return (
			<div className="space-y-6">
				<div className="h-8 w-48 bg-muted animate-pulse rounded" />
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="h-24 bg-muted animate-pulse rounded" />
					))}
				</div>
				<div className="h-64 bg-muted animate-pulse rounded" />
			</div>
		);
	}

	if (!stripeStatus || !stripeStatus.connected) {
		return <SalesEmptyState />;
	}

	const openStripeDashboard = () => {
		if (stripeStatus && stripeStatus.connected) {
			window.open(
				`https://dashboard.stripe.com/connect/accounts/${stripeStatus.stripeAccountId}/customers`,
				"_blank",
			);
		}
	};

	const handleRowClick = (member: Member) => {
		setSelectedMember(member);
	};

	// Stripe is connected, always show header and content
	return (
		<>
			<Header>
				<HeaderMain>
					<HeaderTitle>Members</HeaderTitle>
					<HeaderSubSection>
						Manage your customers and subscribers
					</HeaderSubSection>
				</HeaderMain>
				<HeaderButtons>
					<Button
						type="button"
						variant="outline"
						onClick={openStripeDashboard}
						className="gap-1"
					>
						<ExternalLink className="h-3 w-3" />
						Stripe
					</Button>
				</HeaderButtons>
			</Header>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Customers
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isLoadingStats ? "—" : stats?.totalCustomers || 0}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Subscriptions
						</CardTitle>
						<UserCheck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isLoadingStats ? "—" : stats?.activeSubscriptions || 0}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Monthly Revenue
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isLoadingStats
								? "—"
								: `$${stats?.monthlyRevenue?.toLocaleString() || "0"}`}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Trial Subscriptions
						</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isLoadingStats ? "—" : stats?.trialSubscriptions || 0}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4 mb-6">
				<div className="relative flex-1">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search by name or email..."
						value={queryParams.search || ""}
						onChange={(e) =>
							updateQueryParams({ search: e.target.value || undefined })
						}
						className="pl-8"
					/>
				</div>

				<Select
					value={queryParams.status}
					onValueChange={(value) => updateQueryParams({ status: value as any })}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{statusOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={queryParams.sortBy}
					onValueChange={(value) => updateQueryParams({ sortBy: value as any })}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{sortOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<DataTable
				columns={columns}
				data={membersData?.members || []}
				isLoading={isLoadingMembers}
				onRowClick={handleRowClick}
				emptyState={
					<div className="flex items-center justify-center h-full py-16">
						<div className="text-center">
							<Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
							<p className="text-muted-foreground">No members found</p>
							<p className="text-sm text-muted-foreground mt-1">
								Members will appear here once customers subscribe to your
								products
							</p>
						</div>
					</div>
				}
				pagination={{
					pageSize: 10,
					showPagination: true,
				}}
			/>

			{/* Member Detail Modal */}
			{selectedMember && (
				<MemberDetailModal
					member={selectedMember}
					open={!!selectedMember}
					onOpenChange={(open) => !open && setSelectedMember(null)}
				/>
			)}
		</>
	);
}
