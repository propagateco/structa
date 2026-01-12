export * as StripeSalesController from './stripe-sales.controller';

import { Resource } from 'sst';
import Stripe from 'stripe';
import { z } from 'zod';
import { zod } from '../utils/zod';
import { StripeAccountService } from './stripe-account.service';
import { StripePaymentService } from './stripe-payment.service';
import { AppPricingService } from '../app/app-pricing.service';
import { AppPricingModel } from '../app/app-pricing.model';

// Initialize Stripe with the platform account's secret key
const stripe = new Stripe(Resource.StripeSecretKey.value, {
  apiVersion: '2025-07-30.basil',
});

/**
 * Sales Transactions
 * ------------------
 * 
 * Functions for fetching and displaying transaction data
 */

const PaginationSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  starting_after: z.string().optional(),
  ending_before: z.string().optional(),
});

export const listTransactionsByUserId = zod(
  z.object({
    userId: z.string(),
    pagination: PaginationSchema.optional(),
  }),
  async (input) => {
    // Get the user's Stripe account
    const stripeAccount = await StripeAccountService.fromUserId(input.userId);
    if (!stripeAccount) {
      return {
        data: [],
        has_more: false,
        total_count: 0,
      };
    }

    // Fetch transactions from Stripe
    const transactions = await stripe.balanceTransactions.list(
      {
        limit: input.pagination?.limit || 10,
        starting_after: input.pagination?.starting_after,
        ending_before: input.pagination?.ending_before,
      },
      {
        stripeAccount: stripeAccount.stripeAccountId,
      }
    );

    // Format the response
    return {
      data: transactions.data.map((transaction) => ({
        id: transaction.id,
        amount: transaction.amount / 100, // Convert from cents
        currency: transaction.currency,
        description: transaction.description,
        fee: transaction.fee / 100, // Convert from cents
        net: transaction.net / 100, // Convert from cents
        status: transaction.status,
        type: transaction.type,
        created: new Date(transaction.created * 1000),
        available_on: new Date(transaction.available_on * 1000),
        source: transaction.source,
      })),
      has_more: transactions.has_more,
      total_count: transactions.data.length, // Note: Stripe doesn't provide total count
    };
  }
);

/**
 * Subscription Product Management
 * ------------------------------
 * 
 * Functions for creating and managing subscription products in Stripe
 */

export const createOrUpdateSubscriptionProducts = zod(
  z.object({
    appId: z.string(),
    userId: z.string(),
    pricing: AppPricingModel.MutationClient,
    appName: z.string(),
  }),
  async (input) => {
    // Get the user's Stripe account
    const stripeAccount = await StripeAccountService.fromUserId(input.userId);
    if (!stripeAccount) {
      throw new Error('No Stripe account connected');
    }

    // Get or create app pricing record
    let appPricing = await AppPricingService.fromAppId(input.appId);
    
    // Create or update the Stripe product
    let stripeProduct: Stripe.Product;
    
    if (appPricing?.stripeProductId) {
      // Update existing product
      stripeProduct = await stripe.products.update(
        appPricing.stripeProductId,
        {
          name: `${input.appName} Subscription`,
          description: `Subscription access to ${input.appName}`,
        },
        {
          stripeAccount: stripeAccount.stripeAccountId,
        }
      );
    } else {
      // Create new product
      stripeProduct = await stripe.products.create(
        {
          name: `${input.appName} Subscription`,
          description: `Subscription access to ${input.appName}`,
          type: 'service',
        },
        {
          stripeAccount: stripeAccount.stripeAccountId,
        }
      );
    }

    // Create/update price objects for each billing period
    const pricePromises = [];
    let stripeMonthlyPriceId = appPricing?.stripeMonthlyPriceId;
    let stripeQuarterlyPriceId = appPricing?.stripeQuarterlyPriceId;
    let stripeAnnualPriceId = appPricing?.stripeAnnualPriceId;

    // Monthly price
    if (input.pricing.monthlyPrice && input.pricing.monthlyPrice > 0) {
      if (stripeMonthlyPriceId) {
        // Update existing price (by creating new one and deactivating old)
        const newPrice = await stripe.prices.create(
          {
            product: stripeProduct.id,
            unit_amount: Math.round(input.pricing.monthlyPrice * 100), // Convert to cents
            currency: input.pricing.currency,
            recurring: { interval: 'month' },
          },
          {
            stripeAccount: stripeAccount.stripeAccountId,
          }
        );
        stripeMonthlyPriceId = newPrice.id;
      } else {
        // Create new price
        const newPrice = await stripe.prices.create(
          {
            product: stripeProduct.id,
            unit_amount: Math.round(input.pricing.monthlyPrice * 100),
            currency: input.pricing.currency,
            recurring: { interval: 'month' },
          },
          {
            stripeAccount: stripeAccount.stripeAccountId,
          }
        );
        stripeMonthlyPriceId = newPrice.id;
      }
    }

    // Quarterly price
    if (input.pricing.quarterlyPrice && input.pricing.quarterlyPrice > 0) {
      if (stripeQuarterlyPriceId) {
        // Update existing price
        const newPrice = await stripe.prices.create(
          {
            product: stripeProduct.id,
            unit_amount: Math.round(input.pricing.quarterlyPrice * 100),
            currency: input.pricing.currency,
            recurring: { interval: 'month', interval_count: 3 },
          },
          {
            stripeAccount: stripeAccount.stripeAccountId,
          }
        );
        stripeQuarterlyPriceId = newPrice.id;
      } else {
        // Create new price
        const newPrice = await stripe.prices.create(
          {
            product: stripeProduct.id,
            unit_amount: Math.round(input.pricing.quarterlyPrice * 100),
            currency: input.pricing.currency,
            recurring: { interval: 'month', interval_count: 3 },
          },
          {
            stripeAccount: stripeAccount.stripeAccountId,
          }
        );
        stripeQuarterlyPriceId = newPrice.id;
      }
    }

    // Annual price
    if (input.pricing.annualPrice && input.pricing.annualPrice > 0) {
      if (stripeAnnualPriceId) {
        // Update existing price
        const newPrice = await stripe.prices.create(
          {
            product: stripeProduct.id,
            unit_amount: Math.round(input.pricing.annualPrice * 100),
            currency: input.pricing.currency,
            recurring: { interval: 'year' },
          },
          {
            stripeAccount: stripeAccount.stripeAccountId,
          }
        );
        stripeAnnualPriceId = newPrice.id;
      } else {
        // Create new price
        const newPrice = await stripe.prices.create(
          {
            product: stripeProduct.id,
            unit_amount: Math.round(input.pricing.annualPrice * 100),
            currency: input.pricing.currency,
            recurring: { interval: 'year' },
          },
          {
            stripeAccount: stripeAccount.stripeAccountId,
          }
        );
        stripeAnnualPriceId = newPrice.id;
      }
    }

    // Update the app pricing record
    const updatedAppPricing = await AppPricingService.updateFromAppId({
      appId: input.appId,
      userId: input.userId,
      monthlyPrice: input.pricing.monthlyPrice?.toString(),
      quarterlyPrice: input.pricing.quarterlyPrice?.toString(),
      annualPrice: input.pricing.annualPrice?.toString(),
      currency: input.pricing.currency,
      stripeProductId: stripeProduct.id,
      stripeMonthlyPriceId,
      stripeQuarterlyPriceId,
      stripeAnnualPriceId,
    });

    return {
      appPricing: updatedAppPricing,
      stripeProduct,
      priceIds: {
        monthly: stripeMonthlyPriceId,
        quarterly: stripeQuarterlyPriceId,
        annual: stripeAnnualPriceId,
      },
    };
  }
);