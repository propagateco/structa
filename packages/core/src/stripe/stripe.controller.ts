export * as StripeController from './stripe.controller';

import { z } from 'zod';
import { zod } from '../utils/zod';
import { StripeAccountModel } from './stripe-account.model';
import { StripeAccountService } from './stripe-account.service';
import { StripeProductService } from './stripe-product.service';
import { StripePriceService } from './stripe-price.service';
import { StripeWebhookService } from './stripe-webhook.service';
import { StripePaymentService } from './stripe-payment.service';
import { StripeCheckoutService } from './stripe-checkout.service';

/**
 * Stripe Controller
 * ----------------
 *
 * Coordinates high-level Stripe operations across multiple services
 */

/**
 * Hard delete all Stripe data for a user
 *
 * This will completely remove:
 * - Stripe account connection
 * - All products
 * - All prices
 * - All webhooks
 * - All payments
 * - All checkout sessions
 */
export const hardDelete = zod(StripeAccountModel.Schema.shape.userId, async (userId) => {
	// Get the user's Stripe account
	const stripeAccount = await StripeAccountService.fromUserId(userId);
	console.log('Found Stripe account:', stripeAccount.id);

	if (!stripeAccount) {
		throw new Error('No Stripe account found for user');
	}

	// First, disconnect the account from Stripe Connect
	const disconnectedFromStripe = await StripeAccountService.disconnectFromStripe(
		stripeAccount.stripeAccountId
	);
	console.log('Disconnected from Stripe Connect:', disconnectedFromStripe);

	// Delete all related data in parallel where possible
	await Promise.all([
		// Delete all products for this account
		StripeProductService.hardDeleteByAccountId(stripeAccount.id),

		// Delete all prices for this account
		StripePriceService.hardDeleteByAccountId(stripeAccount.id),

		// Delete all webhooks for this account
		StripeWebhookService.hardDeleteByAccountId(stripeAccount.id),

		// Delete all payments for this account
		StripePaymentService.hardDeleteByAccountId(stripeAccount.id),

		// Delete all checkout sessions for this account
		StripeCheckoutService.hardDeleteByAccountId(stripeAccount.id),
	]);

	// Finally, delete the Stripe account itself
	const deletedAccount = await StripeAccountService.hardDelete(stripeAccount.id);
	console.log('Deleted Stripe account:', deletedAccount.id);

	return {
		success: true,
		deletedAccount,
		disconnectedFromStripe,
	};
});
