export * as StripeAccountService from './stripe-account.service';

import { Resource } from 'sst';
import { stripeAccount } from './stripe-account.sql';
import { StripeAccountModel } from './stripe-account.model';
import { zod } from '../utils/zod';
import { db } from '../drizzle';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import Stripe from 'stripe';

// Initialize Stripe with the platform account's secret key
const stripe = new Stripe(Resource.StripeSecretKey.value, {
	apiVersion: '2025-07-30.basil',
});

/** Creators
 *
 * These are functions used to create or connect Stripe accounts.
 */

export const create = zod(
	StripeAccountModel.StripeAccount.pick({
		userId: true,
		stripeAccountId: true,
		stripePublishableKey: true,
		stripeAccessToken: true,
		stripeRefreshToken: true,
		chargesEnabled: true,
		payoutsEnabled: true,
		detailsSubmitted: true,
		businessType: true,
		accountType: true,
		country: true,
		currency: true,
		email: true,
		businessProfileName: true,
		businessProfileUrl: true,
		companyName: true,
		individualFirstName: true,
		individualLastName: true,
		accountMetadata: true,
	}).partial({
		stripePublishableKey: true,
		stripeAccessToken: true,
		stripeRefreshToken: true,
		chargesEnabled: true,
		payoutsEnabled: true,
		detailsSubmitted: true,
		businessType: true,
		accountType: true,
		country: true,
		currency: true,
		email: true,
		businessProfileName: true,
		businessProfileUrl: true,
		companyName: true,
		individualFirstName: true,
		individualLastName: true,
		accountMetadata: true,
	}),
	async (input) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.insert(stripeAccount)
				.values([
					{
						id: createId(),
						userId: input.userId,
						stripeAccountId: input.stripeAccountId,
						stripePublishableKey: input.stripePublishableKey ?? undefined,
						stripeAccessToken: input.stripeAccessToken ?? undefined,
						stripeRefreshToken: input.stripeRefreshToken ?? undefined,
						chargesEnabled: input.chargesEnabled ?? false,
						payoutsEnabled: input.payoutsEnabled ?? false,
						detailsSubmitted: input.detailsSubmitted ?? false,
						businessType: input.businessType ?? undefined,
						accountType: input.accountType ?? undefined,
						country: input.country ?? undefined,
						currency: input.currency ?? undefined,
						email: input.email ?? undefined,
						businessProfileName: input.businessProfileName ?? undefined,
						businessProfileUrl: input.businessProfileUrl ?? undefined,
						companyName: input.companyName ?? undefined,
						individualFirstName: input.individualFirstName ?? undefined,
						individualLastName: input.individualLastName ?? undefined,
						accountMetadata: input.accountMetadata ?? undefined,
						isActive: true,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				])
				.returning()
				.execute();
			return result[0];
		});
	}
);

// Connect a user's Stripe account via OAuth
export const connectOAuth = zod(
	StripeAccountModel.StripeConnectResponse.extend({
		userId: z.string(),
	}),
	async (input) => {
		try {
			// Exchange the authorization code for an access token
			const response = await stripe.oauth.token({
				grant_type: 'authorization_code',
				code: input.code,
			});

			// Get the connected account ID
			const connectedAccountId = response.stripe_user_id;
			if (!connectedAccountId) {
				throw new Error('Failed to retrieve connected account ID');
			}

			// Get account details from Stripe
			const account = await stripe.accounts.retrieve(connectedAccountId);

			// Extract business profile information
			const businessProfileName = account.business_profile?.name || undefined;
			const businessProfileUrl = account.business_profile?.url || undefined;
			const companyName = account.company?.name || undefined;
			const individualFirstName = account.individual?.first_name || undefined;
			const individualLastName = account.individual?.last_name || undefined;

			// Create a record in the database with extracted fields
			return create({
				userId: input.userId,
				stripeAccountId: connectedAccountId,
				stripePublishableKey: response.stripe_publishable_key,
				stripeAccessToken: response.access_token,
				stripeRefreshToken: response.refresh_token,
				chargesEnabled: account.charges_enabled,
				payoutsEnabled: account.payouts_enabled,
				detailsSubmitted: account.details_submitted,
				businessType: account.business_type ? String(account.business_type) : undefined,
				accountType: account.type,
				country: account.country,
				currency: account.default_currency,
				email: account.email || undefined,
				businessProfileName: businessProfileName,
				businessProfileUrl: businessProfileUrl,
				companyName: companyName,
				individualFirstName: individualFirstName,
				individualLastName: individualLastName,
				accountMetadata: account,
			});
		} catch (error) {
			console.error('Error connecting Stripe account:', error);
			throw error;
		}
	}
);

/** Getters
 *
 * These are functions used to get stripe account information from the database.
 */

export const fromId = zod(StripeAccountModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.select()
			.from(stripeAccount)
			.where(eq(stripeAccount.id, id))
			.execute();
		return result[0];
	});
});

export const fromUserId = zod(StripeAccountModel.Schema.shape.userId, async (userId) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.select()
			.from(stripeAccount)
			.where(eq(stripeAccount.userId, userId))
			.execute();
		return result[0];
	});
});

export const fromStripeAccountId = zod(
	StripeAccountModel.Schema.shape.stripeAccountId,
	async (stripeAccountId) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.select()
				.from(stripeAccount)
				.where(eq(stripeAccount.stripeAccountId, stripeAccountId))
				.execute();
			return result[0];
		});
	}
);

/** Updaters
 *
 * These are functions used to update stripe account information in the database.
 */

export const updateFromStripeEvent = zod(
	z.object({
		stripeAccountId: z.string(),
		updates: StripeAccountModel.StripeAccountUpdate,
	}),
	async (input) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.update(stripeAccount)
				.set({
					...input.updates,
					updatedAt: new Date(),
				})
				.where(eq(stripeAccount.stripeAccountId, input.stripeAccountId))
				.returning()
				.execute();
			return result[0];
		});
	}
);

/** Deleters
 *
 * These are functions used to delete stripe account information from the database.
 */

export const softDelete = zod(StripeAccountModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.update(stripeAccount)
			.set({
				isActive: false,
				deletedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(stripeAccount.id, id))
			.returning()
			.execute();
		return result[0];
	});
});

export const hardDelete = zod(StripeAccountModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.delete(stripeAccount)
			.where(eq(stripeAccount.id, id))
			.returning()
			.execute();
		return result[0];
	});
});

/**
 * Disconnect a Stripe Connect account from our platform
 * This removes the OAuth connection on Stripe's side
 */
export const disconnectFromStripe = zod(
	StripeAccountModel.Schema.shape.stripeAccountId,
	async (stripeAccountId) => {
		try {
			// Deauthorize the connected account
			// This removes the account's connection to our platform
			await stripe.oauth.deauthorize({
				client_id: Resource.StripeClientId.value,
				stripe_user_id: stripeAccountId,
			});
			
			console.log('Successfully disconnected account from Stripe:', stripeAccountId);
			return true;
		} catch (error) {
			console.error('Error disconnecting account from Stripe:', error);
			// Don't throw - we still want to delete local records even if Stripe disconnect fails
			return false;
		}
	}
);

/** Utility Functions
 *
 * These are helper functions for working with Stripe Connect accounts.
 */

// Generate a Stripe Connect OAuth URL
export function generateConnectOAuthUrl(userId: string, redirectUri: string): string {
	const clientId = Resource.StripeClientId.value;
	const state = Buffer.from(JSON.stringify({ userId })).toString('base64');

	return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
}

// Refresh a Stripe Connect access token
export const refreshAccessToken = zod(
	StripeAccountModel.Schema.shape.stripeRefreshToken,
	async (refreshToken) => {
		try {
			if (!refreshToken) {
				throw new Error('No refresh token provided');
			}

			const response = await stripe.oauth.token({
				grant_type: 'refresh_token',
				refresh_token: refreshToken,
			});

			return {
				stripeAccessToken: response.access_token,
				stripeRefreshToken: response.refresh_token,
			};
		} catch (error) {
			console.error('Error refreshing Stripe access token:', error);
			throw error;
		}
	}
);
