import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import {
	stripeAccountQueryOptions,
	transactionsQueryOptions,
} from "@/clients/stripe/stripe.query.client";
import {
	Header,
	HeaderButtons,
	HeaderMain,
	HeaderSubSection,
	HeaderTitle,
} from "@/components/layout/typography";
import { SalesEmptyState } from "@/components/sales/SalesEmptyState";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

export const Route = createFileRoute(
	"/_authenticated/_dashboard/_sales/sales/transactions",
)({
	component: RouteComponent,
});

interface Transaction {
	id: string;
	amount: number;
	currency: string;
	description: string | null;
	fee: number;
	net: number;
	status: string;
	type: string;
	created: string; // Date serialized as string from API
	available_on: string; // Date serialized as string from API
	source: any;
}

const columns: ColumnDef<Transaction>[] = [
	{
		accessorKey: "created",
		header: "Date",
		cell: ({ row }) => {
			const dateString = row.getValue<string>("created");
			const date = new Date(dateString);
			return format(date, "MMM d, yyyy 'at' h:mm a");
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.getValue<string>("status");
			return (
				<span
					className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${
						status === "available"
							? "bg-green-50 text-green-700"
							: status === "pending"
								? "bg-yellow-50 text-yellow-700"
								: "bg-gray-50 text-gray-700"
					}`}
				>
					{status}
				</span>
			);
		},
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => {
			const description = row.getValue<string | null>("description");
			return description || "—";
		},
	},
	{
		accessorKey: "type",
		header: "Type",
		cell: ({ row }) => {
			const type = row.getValue<string>("type");
			return <span className="capitalize">{type.replace(/_/g, " ")}</span>;
		},
	},
	{
		accessorKey: "amount",
		header: "Amount",
		cell: ({ row }) => {
			const amount = row.getValue<number>("amount");
			const currency = row.original.currency;
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
		accessorKey: "fee",
		header: "Fee",
		cell: ({ row }) => {
			const fee = row.getValue<number>("fee");
			const currency = row.original.currency;
			return (
				<span className="text-muted-foreground">
					-
					{new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: currency.toUpperCase(),
					}).format(fee)}
				</span>
			);
		},
	},
	{
		accessorKey: "net",
		header: "Net",
		cell: ({ row }) => {
			const net = row.getValue<number>("net");
			const currency = row.original.currency;
			return (
				<span className="font-medium">
					{new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: currency.toUpperCase(),
					}).format(net)}
				</span>
			);
		},
	},
];

function RouteComponent() {
	// Use live query data for reactive updates
	const { data: stripeStatus, isLoading: isLoadingStatus } = useQuery(
		stripeAccountQueryOptions,
	);
	const { data: transactions, isLoading: isLoadingTransactions } = useQuery(
		transactionsQueryOptions(),
	);

	if (isLoadingStatus) {
		return (
			<div className="space-y-6">
				<div className="h-8 w-48 bg-muted animate-pulse rounded" />
				<div className="h-64 bg-muted animate-pulse rounded" />
			</div>
		);
	}

	if (!stripeStatus || !stripeStatus.connected) {
		return <SalesEmptyState />;
	}

	const openStripeDashboard = () => {
		if (stripeStatus && stripeStatus.connected) {
			window.open("https://dashboard.stripe.com/payments", "_blank");
		}
	};

	// Stripe is connected, always show header and table
	return (
		<>
			<Header>
				<HeaderMain>
					<HeaderTitle>Transactions</HeaderTitle>
					<HeaderSubSection>
						View your sales and payment history
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

			<DataTable
				columns={columns}
				data={transactions?.data || []}
				isLoading={isLoadingTransactions}
				emptyState={
					<div className="flex items-center justify-center h-full py-16">
						<div className="text-center">
							<p className="text-muted-foreground">No transactions found</p>
							<p className="text-sm text-muted-foreground mt-1">
								Transactions will appear here once you start receiving payments
							</p>
						</div>
					</div>
				}
				pagination={{
					pageSize: 10,
					showPagination: true,
				}}
			/>
		</>
	);
}
