import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Member {
	customerId: string;
	customerName: string | null;
	customerEmail: string | null;
	customerPhone: string | null;
	customerCreatedAt: string; // Date serialized as string from API
	isDelinquent: boolean;
	subscriptionId: string | null;
	subscriptionStatus: string | null;
	subscriptionAmount: number | null;
	subscriptionCurrency: string | null;
	subscriptionCurrentPeriodStart: string | null; // Date serialized as string from API
	subscriptionCurrentPeriodEnd: string | null; // Date serialized as string from API
	subscriptionProductName: string | null;
	subscriptionCreatedAt: string | null; // Date serialized as string from API
}

export interface MembersResponse {
	members: Member[];
	total: number;
}

export interface MemberStats {
	totalCustomers: number;
	activeSubscriptions: number;
	monthlyRevenue: number;
	trialSubscriptions: number;
}

export interface MemberDetails {
	customer: {
		id: string;
		stripeCustomerId: string;
		name: string | null;
		email: string | null;
		phone: string | null;
		addressLine1: string | null;
		addressLine2: string | null;
		addressCity: string | null;
		addressState: string | null;
		addressPostalCode: string | null;
		addressCountry: string | null;
		currency: string | null;
		defaultPaymentMethod: string | null;
		description: string | null;
		metadata: Record<string, any> | null;
		isDeleted: boolean;
		isDelinquent: boolean;
		stripeCreatedAt: string;
	};
	subscriptions: Array<{
		id: string;
		stripeSubscriptionId: string;
		status: string;
		collectionMethod: string;
		currency: string;
		currentPeriodStart: string;
		currentPeriodEnd: string;
		trialStart: string | null;
		trialEnd: string | null;
		cancelAt: string | null;
		cancelAtPeriodEnd: boolean;
		canceledAt: string | null;
		subscriptionItems: Array<any>;
		metadata: Record<string, any> | null;
		description: string | null;
		stripeCreatedAt: string;
	}>;
}

export interface MembersQueryParams {
	search?: string;
	status?: "active" | "past_due" | "canceled" | "all";
	sortBy?: "name" | "email" | "created" | "subscription_date";
	sortOrder?: "asc" | "desc";
	limit?: number;
	offset?: number;
}

export const membersQueryOptions = (params: MembersQueryParams = {}) =>
	queryOptions({
		queryKey: ["sales", "members", params],
		queryFn: async (): Promise<MembersResponse> => {
			try {
				const response = await api.sales.members.$get({
					query: {
						search: params.search,
						status: params.status,
						sortBy: params.sortBy,
						sortOrder: params.sortOrder,
						limit: params.limit?.toString(),
						offset: params.offset?.toString(),
					},
				});

				if (!response.ok) {
					throw new Error("Failed to fetch members");
				}

				return await response.json();
			} catch (error) {
				console.error("Error fetching members:", error);
				return { members: [], total: 0 };
			}
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
	});

export const memberDetailsQueryOptions = (customerId: string) =>
	queryOptions({
		queryKey: ["sales", "members", "details", customerId],
		queryFn: async (): Promise<MemberDetails | null> => {
			try {
				const response = await api.sales.members[":customerId"].$get({
					param: { customerId },
				});

				if (!response.ok) {
					if (response.status === 404) {
						return null;
					}
					throw new Error("Failed to fetch member details");
				}

				return await response.json();
			} catch (error) {
				console.error("Error fetching member details:", error);
				return null;
			}
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
	});

export const memberStatsQueryOptions = () =>
	queryOptions({
		queryKey: ["sales", "members", "stats"],
		queryFn: async (): Promise<MemberStats> => {
			try {
				const response = await api.sales.members.stats.$get();

				if (!response.ok) {
					throw new Error("Failed to fetch member stats");
				}

				return await response.json();
			} catch (error) {
				console.error("Error fetching member stats:", error);
				throw error;
			}
		},
		staleTime: 10 * 60 * 1000, // 10 minutes
		retry: 2,
	});
