export * as StripeMembersController from './stripe-members.controller';

import { StripeCustomerService } from './stripe-customer.service';
import { StripeSubscriptionService } from './stripe-subscription.service';
import { StripeAccountService } from './stripe-account.service';
import { zod } from '../utils/zod';
import { db } from '../drizzle';
import { stripeCustomer } from './stripe-customer.sql';
import { stripeSubscription } from './stripe-subscription.sql';
import { eq, and, desc, asc, like, or, ilike } from 'drizzle-orm';
import { z } from 'zod';

/**
 * Member Data Types
 * -----------
 * 
 * Combined customer and subscription data for member management.
 */

export const MemberWithSubscription = z.object({
	// Customer information
	customerId: z.string(),
	customerName: z.string().nullable(),
	customerEmail: z.string().nullable(),
	customerPhone: z.string().nullable(),
	customerCreatedAt: z.date(),
	isDelinquent: z.boolean(),

	// Subscription information
	subscriptionId: z.string().nullable(),
	subscriptionStatus: z.string().nullable(),
	subscriptionAmount: z.number().nullable(),
	subscriptionCurrency: z.string().nullable(),
	subscriptionCurrentPeriodStart: z.date().nullable(),
	subscriptionCurrentPeriodEnd: z.date().nullable(),
	subscriptionProductName: z.string().nullable(),
	subscriptionCreatedAt: z.date().nullable(),
});
export type MemberWithSubscriptionType = z.infer<typeof MemberWithSubscription>;

export const MembersListQuery = z.object({
	userId: z.string(),
	search: z.string().optional(),
	status: z.enum(['active', 'past_due', 'canceled', 'all']).optional().default('all'),
	sortBy: z.enum(['name', 'email', 'created', 'subscription_date']).optional().default('created'),
	sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
	limit: z.number().min(1).max(100).optional().default(50),
	offset: z.number().min(0).optional().default(0),
});
export type MembersListQueryType = z.infer<typeof MembersListQuery>;

/**
 * Member Queries
 * -----------
 * 
 * Functions to retrieve and manage member data combining customers and subscriptions.
 */

export const listMembers = zod(MembersListQuery, async (input) => {
	return db.transaction(async (tx) => {
		// First, get the user's Stripe account
		const stripeAccount = await StripeAccountService.fromUserId(input.userId);
		if (!stripeAccount) {
			return { members: [], total: 0 };
		}

		// Build the base query
		// Build WHERE conditions
		const whereConditions = [];
		whereConditions.push(eq(stripeCustomer.stripeAccountId, stripeAccount.id));
		whereConditions.push(eq(stripeCustomer.isDeleted, false));
		
		// Add search filter
		if (input.search) {
			const searchTerm = `%${input.search}%`;
			whereConditions.push(
				or(
					ilike(stripeCustomer.name, searchTerm),
					ilike(stripeCustomer.email, searchTerm)
				)
			);
		}
		
		// Add status filter
		if (input.status !== 'all') {
			whereConditions.push(eq(stripeSubscription.status, input.status));
		}

		// Determine ORDER BY
		let orderByClause;
		if (input.sortBy === 'name') {
			orderByClause = input.sortOrder === 'asc' ? asc(stripeCustomer.name) : desc(stripeCustomer.name);
		} else if (input.sortBy === 'email') {
			orderByClause = input.sortOrder === 'asc' ? asc(stripeCustomer.email) : desc(stripeCustomer.email);
		} else if (input.sortBy === 'created') {
			orderByClause = input.sortOrder === 'asc' ? asc(stripeCustomer.stripeCreatedAt) : desc(stripeCustomer.stripeCreatedAt);
		} else if (input.sortBy === 'subscription_date') {
			orderByClause = input.sortOrder === 'asc' ? asc(stripeSubscription.stripeCreatedAt) : desc(stripeSubscription.stripeCreatedAt);
		} else {
			orderByClause = desc(stripeCustomer.stripeCreatedAt);
		}

		// Build query
		const query = tx
			.select({
				// Customer data
				customerId: stripeCustomer.id,
				customerStripeId: stripeCustomer.stripeCustomerId,
				customerName: stripeCustomer.name,
				customerEmail: stripeCustomer.email,
				customerPhone: stripeCustomer.phone,
				customerCreatedAt: stripeCustomer.stripeCreatedAt,
				isDelinquent: stripeCustomer.isDelinquent,
				
				// Subscription data (nullable for customers without subscriptions)
				subscriptionId: stripeSubscription.id,
				subscriptionStripeId: stripeSubscription.stripeSubscriptionId,
				subscriptionStatus: stripeSubscription.status,
				subscriptionCurrency: stripeSubscription.currency,
				subscriptionCurrentPeriodStart: stripeSubscription.currentPeriodStart,
				subscriptionCurrentPeriodEnd: stripeSubscription.currentPeriodEnd,
				subscriptionItems: stripeSubscription.subscriptionItems,
				subscriptionCreatedAt: stripeSubscription.stripeCreatedAt,
			})
			.from(stripeCustomer)
			.leftJoin(
				stripeSubscription,
				eq(stripeCustomer.id, stripeSubscription.stripeCustomerId)
			)
			.where(and(...whereConditions))
			.orderBy(orderByClause)
			.limit(input.limit)
			.offset(input.offset);

		const results = await query.execute();

		// Transform results to include calculated fields
		const members: MemberWithSubscriptionType[] = results.map(result => {
			// Calculate subscription amount from subscription items
			let subscriptionAmount: number | null = null;
			let subscriptionProductName: string | null = null;

			if (result.subscriptionItems && Array.isArray(result.subscriptionItems)) {
				subscriptionAmount = result.subscriptionItems.reduce((total: number, item: any) => {
					const itemAmount = item.price?.unit_amount || 0;
					const quantity = item.quantity || 1;
					return total + (itemAmount * quantity);
				}, 0) / 100; // Convert from cents to dollars

				// Get the first product name
				if (result.subscriptionItems.length > 0) {
					const firstItem = result.subscriptionItems[0];
					subscriptionProductName = firstItem.price?.product?.name || firstItem.price?.nickname || 'Unknown Product';
				}
			}

			return {
				customerId: result.customerId,
				customerName: result.customerName,
				customerEmail: result.customerEmail,
				customerPhone: result.customerPhone,
				customerCreatedAt: result.customerCreatedAt,
				isDelinquent: result.isDelinquent,
				subscriptionId: result.subscriptionId,
				subscriptionStatus: result.subscriptionStatus,
				subscriptionAmount,
				subscriptionCurrency: result.subscriptionCurrency,
				subscriptionCurrentPeriodStart: result.subscriptionCurrentPeriodStart,
				subscriptionCurrentPeriodEnd: result.subscriptionCurrentPeriodEnd,
				subscriptionProductName,
				subscriptionCreatedAt: result.subscriptionCreatedAt,
			};
		});

		// Get total count for pagination
		const countQuery = tx
			.select({ count: stripeCustomer.id })
			.from(stripeCustomer)
			.leftJoin(
				stripeSubscription,
				eq(stripeCustomer.id, stripeSubscription.stripeCustomerId)
			)
			.where(
				and(
					eq(stripeCustomer.stripeAccountId, stripeAccount.id),
					eq(stripeCustomer.isDeleted, false),
					input.search ? or(
						ilike(stripeCustomer.name, `%${input.search}%`),
						ilike(stripeCustomer.email, `%${input.search}%`)
					) : undefined,
					input.status !== 'all' ? eq(stripeSubscription.status, input.status) : undefined
				)
			);

		const totalResults = await countQuery.execute();
		const total = totalResults.length;

		return {
			members,
			total,
		};
	});
});

export const getMemberDetails = zod(
	z.object({
		userId: z.string(),
		customerId: z.string(),
	}),
	async (input) => {
		return db.transaction(async (tx) => {
			// Get the user's Stripe account
			const stripeAccount = await StripeAccountService.fromUserId(input.userId);
			if (!stripeAccount) {
				return null;
			}

			// Get customer details
			const customer = await StripeCustomerService.fromId(input.customerId);
			if (!customer || customer.stripeAccountId !== stripeAccount.id) {
				return null;
			}

			// Get all subscriptions for this customer
			const subscriptions = await StripeSubscriptionService.listByStripeCustomerId(customer.id);

			return {
				customer,
				subscriptions,
			};
		});
	}
);

/**
 * Statistics Functions
 * -----------
 * 
 * Functions to get member statistics and analytics.
 */

export const getMemberStats = zod(
	z.object({
		userId: z.string(),
	}),
	async (input) => {
		return db.transaction(async (tx) => {
			// Get the user's Stripe account
			const stripeAccount = await StripeAccountService.fromUserId(input.userId);
			if (!stripeAccount) {
				return {
					totalCustomers: 0,
					activeSubscriptions: 0,
					monthlyRevenue: 0,
					trialSubscriptions: 0,
				};
			}

			// Get total customers
			const totalCustomersResult = await tx
				.select()
				.from(stripeCustomer)
				.where(
					and(
						eq(stripeCustomer.stripeAccountId, stripeAccount.id),
						eq(stripeCustomer.isDeleted, false)
					)
				)
				.execute();

			// Get subscription statistics
			const subscriptionsResult = await tx
				.select()
				.from(stripeSubscription)
				.where(eq(stripeSubscription.stripeAccountId, stripeAccount.id))
				.execute();

			const activeSubscriptions = subscriptionsResult.filter(sub => sub.status === 'active').length;
			const trialSubscriptions = subscriptionsResult.filter(sub => sub.status === 'trialing').length;

			// Calculate monthly revenue (approximate)
			const monthlyRevenue = subscriptionsResult
				.filter(sub => sub.status === 'active')
				.reduce((total, sub) => {
					if (sub.subscriptionItems && Array.isArray(sub.subscriptionItems)) {
						const subscriptionAmount = sub.subscriptionItems.reduce((subTotal: number, item: any) => {
							const itemAmount = item.price?.unit_amount || 0;
							const quantity = item.quantity || 1;
							return subTotal + (itemAmount * quantity);
						}, 0);
						return total + subscriptionAmount;
					}
					return total;
				}, 0) / 100; // Convert from cents to dollars

			return {
				totalCustomers: totalCustomersResult.length,
				activeSubscriptions,
				monthlyRevenue,
				trialSubscriptions,
			};
		});
	}
);