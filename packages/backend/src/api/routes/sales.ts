import { Resource } from 'sst';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authenticatedMiddleware } from '../middleware';
import {
	StripeSalesController,
	StripeAccountService,
	StripeMembersController,
} from '@structa/core/stripe';

// TEMP
const stages = new Set(['dev']);

export const SalesRoute = new Hono()
	.use(authenticatedMiddleware)
	// Get transactions for the authenticated user
	.get(
		'/transactions',
		zValidator(
			'query',
			z.object({
				limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
				starting_after: z.string().optional(),
				ending_before: z.string().optional(),
			})
		),
		async (c) => {
			const userId = c.var.user.id;
			const query = c.req.valid('query');

			// TEMP Return mock data when not in production or development stage
			if (!stages.has(Resource.App.stage)) {
				const mockTransactions = Array.from({ length: 50 }, (_, i) => {
					const amount = (Math.floor(Math.random() * 10000) + 1000) / 100;
					const fee = (Math.floor(Math.random() * 300) + 50) / 100;
					return {
						id: `txn_mock_${i.toString().padStart(3, '0')}`,
						amount: amount,
						currency: 'usd',
						description: i % 3 === 0 ? null : `Payment for subscription #${i + 1000}`,
						fee: fee,
						net: amount - fee,
						status: i % 4 === 0 ? 'pending' : 'available',
						type: i % 2 === 0 ? 'charge' : 'payment',
						created: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
						available_on: new Date(
							Date.now() - (i - 2) * 24 * 60 * 60 * 1000
						).toISOString(),
						source: {},
					};
				});

				// Apply pagination
				const limit = query.limit || 10;
				const startIndex = query.starting_after
					? mockTransactions.findIndex((t) => t.id === query.starting_after) + 1
					: 0;
				const endIndex = query.ending_before
					? mockTransactions.findIndex((t) => t.id === query.ending_before)
					: startIndex + limit;

				const paginatedTransactions = mockTransactions.slice(startIndex, endIndex);

				return c.json({
					data: paginatedTransactions,
					has_more: endIndex < mockTransactions.length,
				});
			}

			try {
				const transactions = await StripeSalesController.listTransactionsByUserId({
					userId,
					pagination: {
						limit: query.limit || 10,
						starting_after: query.starting_after,
						ending_before: query.ending_before,
					},
				});

				return c.json(transactions);
			} catch (error) {
				console.error('Error fetching transactions:', error);
				return c.json({ error: 'Failed to fetch transactions' }, 500);
			}
		}
	)

	// Check Stripe account status
	.get('/stripe-status', async (c) => {
		const userId = c.var.user.id;

		try {
			const stripeAccount = await StripeAccountService.fromUserId(userId);

			return c.json({
				hasStripeAccount: !!stripeAccount,
				accountId: stripeAccount?.id || null,
				businessName:
					stripeAccount?.businessProfileName ||
					stripeAccount?.companyName ||
					(stripeAccount?.individualFirstName && stripeAccount?.individualLastName
						? `${stripeAccount.individualFirstName} ${stripeAccount.individualLastName}`
						: null),
				isActive: stripeAccount?.isActive || false,
			});
		} catch (error) {
			console.error('Error checking Stripe status:', error);
			return c.json({ error: 'Failed to check Stripe status' }, 500);
		}
	})

	// Get members/subscribers for the authenticated user
	.get(
		'/members',
		zValidator(
			'query',
			z.object({
				search: z.string().optional(),
				status: z.enum(['active', 'past_due', 'canceled', 'all']).optional(),
				sortBy: z.enum(['name', 'email', 'created', 'subscription_date']).optional(),
				sortOrder: z.enum(['asc', 'desc']).optional(),
				limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
				offset: z.string().transform(Number).pipe(z.number().min(0)).optional(),
			})
		),
		async (c) => {
			const userId = c.var.user.id;
			const query = c.req.valid('query');

			// TEMP Return mock data when not in production or development stage
			if (!stages.has(Resource.App.stage)) {
				const mockMembers = [
					{
						customerId: 'cus_mock_001',
						customerName: 'Sarah Johnson',
						customerEmail: 'sarah.johnson@example.com',
						customerPhone: '+1 (555) 123-4567',
						customerCreatedAt: '2024-01-15T10:30:00Z',
						isDelinquent: false,
						subscriptionId: 'sub_mock_001',
						subscriptionStatus: 'active',
						subscriptionAmount: 29.99,
						subscriptionCurrency: 'usd',
						subscriptionCurrentPeriodStart: '2024-06-01T00:00:00Z',
						subscriptionCurrentPeriodEnd: '2024-07-01T00:00:00Z',
						subscriptionProductName: 'Per Month',
						subscriptionCreatedAt: '2024-01-15T10:30:00Z',
					},
					{
						customerId: 'cus_mock_002',
						customerName: 'Michael Chen',
						customerEmail: 'michael.chen@company.com',
						customerPhone: '+1 (555) 234-5678',
						customerCreatedAt: '2024-02-20T14:15:00Z',
						isDelinquent: false,
						subscriptionId: 'sub_mock_002',
						subscriptionStatus: 'active',
						subscriptionAmount: 299.99,
						subscriptionCurrency: 'usd',
						subscriptionCurrentPeriodStart: '2024-06-01T00:00:00Z',
						subscriptionCurrentPeriodEnd: '2025-06-01T00:00:00Z',
						subscriptionProductName: 'Per Year',
						subscriptionCreatedAt: '2024-02-20T14:15:00Z',
					},
					{
						customerId: 'cus_mock_003',
						customerName: 'Emily Rodriguez',
						customerEmail: 'emily.rodriguez@startup.io',
						customerPhone: '+1 (555) 345-6789',
						customerCreatedAt: '2024-03-10T09:45:00Z',
						isDelinquent: true,
						subscriptionId: 'sub_mock_003',
						subscriptionStatus: 'past_due',
						subscriptionAmount: 89.99,
						subscriptionCurrency: 'usd',
						subscriptionCurrentPeriodStart: '2024-03-01T00:00:00Z',
						subscriptionCurrentPeriodEnd: '2024-06-01T00:00:00Z',
						subscriptionProductName: 'Every 3 Months',
						subscriptionCreatedAt: '2024-03-10T09:45:00Z',
					},
					{
						customerId: 'cus_mock_004',
						customerName: 'David Thompson',
						customerEmail: 'david.thompson@freelancer.com',
						customerPhone: '+1 (555) 456-7890',
						customerCreatedAt: '2024-04-05T16:20:00Z',
						isDelinquent: false,
						subscriptionId: 'sub_mock_004',
						subscriptionStatus: 'canceled',
						subscriptionAmount: 49.99,
						subscriptionCurrency: 'usd',
						subscriptionCurrentPeriodStart: '2024-04-01T00:00:00Z',
						subscriptionCurrentPeriodEnd: '2024-05-01T00:00:00Z',
						subscriptionProductName: 'Per Month',
						subscriptionCreatedAt: '2024-04-05T16:20:00Z',
					},
					{
						customerId: 'cus_mock_005',
						customerName: 'Alexandra Kim',
						customerEmail: 'alex.kim@techcorp.com',
						customerPhone: '+1 (555) 567-8901',
						customerCreatedAt: '2024-05-12T11:30:00Z',
						isDelinquent: false,
						subscriptionId: 'sub_mock_005',
						subscriptionStatus: 'trialing',
						subscriptionAmount: 799.99,
						subscriptionCurrency: 'usd',
						subscriptionCurrentPeriodStart: '2024-05-12T00:00:00Z',
						subscriptionCurrentPeriodEnd: '2025-05-12T00:00:00Z',
						subscriptionProductName: 'Per Year',
						subscriptionCreatedAt: '2024-05-12T11:30:00Z',
					},
					{
						customerId: 'cus_mock_006',
						customerName: 'Robert Wilson',
						customerEmail: 'robert.wilson@consulting.biz',
						customerPhone: '+1 (555) 678-9012',
						customerCreatedAt: '2024-06-18T08:15:00Z',
						isDelinquent: false,
						subscriptionId: 'sub_mock_006',
						subscriptionStatus: 'active',
						subscriptionAmount: 199.99,
						subscriptionCurrency: 'usd',
						subscriptionCurrentPeriodStart: '2024-06-01T00:00:00Z',
						subscriptionCurrentPeriodEnd: '2024-09-01T00:00:00Z',
						subscriptionProductName: 'Every 3 Months',
						subscriptionCreatedAt: '2024-06-18T08:15:00Z',
					},
					{
						customerId: 'cus_mock_007',
						customerName: 'Maria Santos',
						customerEmail: 'maria.santos@agency.com',
						customerPhone: '+1 (555) 789-0123',
						customerCreatedAt: '2024-01-30T13:45:00Z',
						isDelinquent: false,
						subscriptionId: 'sub_mock_007',
						subscriptionStatus: 'active',
						subscriptionAmount: 79.99,
						subscriptionCurrency: 'usd',
						subscriptionCurrentPeriodStart: '2024-06-01T00:00:00Z',
						subscriptionCurrentPeriodEnd: '2024-07-01T00:00:00Z',
						subscriptionProductName: 'Per Month',
						subscriptionCreatedAt: '2024-01-30T13:45:00Z',
					},
					{
						customerId: 'cus_mock_008',
						customerName: 'James Anderson',
						customerEmail: 'james.anderson@enterprise.org',
						customerPhone: '+1 (555) 890-1234',
						customerCreatedAt: '2024-03-25T15:10:00Z',
						isDelinquent: false,
						subscriptionId: null,
						subscriptionStatus: null,
						subscriptionAmount: null,
						subscriptionCurrency: null,
						subscriptionCurrentPeriodStart: null,
						subscriptionCurrentPeriodEnd: null,
						subscriptionProductName: null,
						subscriptionCreatedAt: null,
					},
				];

				// Apply search filter if provided
				let filteredMembers = mockMembers;
				if (query.search) {
					const searchTerm = query.search.toLowerCase();
					filteredMembers = mockMembers.filter(
						(member) =>
							member.customerName?.toLowerCase().includes(searchTerm) ||
							member.customerEmail?.toLowerCase().includes(searchTerm)
					);
				}

				// Apply status filter if provided
				if (query.status && query.status !== 'all') {
					filteredMembers = filteredMembers.filter(
						(member) => member.subscriptionStatus === query.status
					);
				}

				// Apply sorting
				if (query.sortBy === 'name') {
					filteredMembers.sort((a, b) => {
						const aName = a.customerName || '';
						const bName = b.customerName || '';
						return query.sortOrder === 'asc'
							? aName.localeCompare(bName)
							: bName.localeCompare(aName);
					});
				} else if (query.sortBy === 'email') {
					filteredMembers.sort((a, b) => {
						const aEmail = a.customerEmail || '';
						const bEmail = b.customerEmail || '';
						return query.sortOrder === 'asc'
							? aEmail.localeCompare(bEmail)
							: bEmail.localeCompare(aEmail);
					});
				} else if (query.sortBy === 'created') {
					filteredMembers.sort((a, b) => {
						const aDate = new Date(a.customerCreatedAt);
						const bDate = new Date(b.customerCreatedAt);
						return query.sortOrder === 'asc'
							? aDate.getTime() - bDate.getTime()
							: bDate.getTime() - aDate.getTime();
					});
				} else if (query.sortBy === 'subscription_date') {
					filteredMembers.sort((a, b) => {
						const aDate = a.subscriptionCreatedAt
							? new Date(a.subscriptionCreatedAt)
							: new Date(0);
						const bDate = b.subscriptionCreatedAt
							? new Date(b.subscriptionCreatedAt)
							: new Date(0);
						return query.sortOrder === 'asc'
							? aDate.getTime() - bDate.getTime()
							: bDate.getTime() - aDate.getTime();
					});
				}

				// Apply pagination
				const limit = query.limit || 50;
				const offset = query.offset || 0;
				const paginatedMembers = filteredMembers.slice(offset, offset + limit);

				return c.json({
					members: paginatedMembers,
					total: filteredMembers.length,
				});
			}

			try {
				const result = await StripeMembersController.listMembers({
					userId,
					search: query.search,
					status: query.status || 'all',
					sortBy: query.sortBy || 'created',
					sortOrder: query.sortOrder || 'desc',
					limit: query.limit || 50,
					offset: query.offset || 0,
				});

				return c.json(result);
			} catch (error) {
				console.error('Error fetching members:', error);
				return c.json({ error: 'Failed to fetch members' }, 500);
			}
		}
	)

	// Get member statistics
	.get('/members/stats', async (c) => {
		const userId = c.var.user.id;

		// Return mock stats when not in production or development stage
		if (!stages.has(Resource.App.stage)) {
			// Calculate stats based on the mock member data above
			// Active: Sarah ($29.99), Michael ($299.99), Robert ($199.99), Maria ($79.99) = 4
			// Trialing: Alexandra ($799.99) = 1
			// Past Due: Emily ($89.99) = 1
			// Canceled: David ($49.99) = 1
			// No subscription: James = 1
			// Total customers = 8

			console.log('Returning mock member stats');

			return c.json({
				totalCustomers: 8,
				activeSubscriptions: 4, // Sarah, Michael, Robert, Maria
				monthlyRevenue: 201.64, // Monthly equivalent: Sarah $29.99 + Michael $25.00 + Robert $66.66 + Maria $79.99
				trialSubscriptions: 1, // Alexandra
			});
		}

		try {
			const stats = await StripeMembersController.getMemberStats({
				userId,
			});

			return c.json(stats);
		} catch (error) {
			console.error('Error fetching member stats:', error);
			return c.json({ error: 'Failed to fetch member stats' }, 500);
		}
	})

	// Get member details by customer ID
	.get(
		'/members/:customerId',
		zValidator(
			'param',
			z.object({
				customerId: z.string(),
			})
		),
		async (c) => {
			const userId = c.var.user.id;
			const { customerId } = c.req.valid('param');

			try {
				const memberDetails = await StripeMembersController.getMemberDetails({
					userId,
					customerId,
				});

				if (!memberDetails) {
					return c.json({ error: 'Member not found' }, 404);
				}

				return c.json(memberDetails);
			} catch (error) {
				console.error('Error fetching member details:', error);
				return c.json({ error: 'Failed to fetch member details' }, 500);
			}
		}
	);
