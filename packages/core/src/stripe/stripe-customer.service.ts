export * as StripeCustomerService from './stripe-customer.service';

import { Resource } from 'sst';
import { stripeCustomer } from './stripe-customer.sql';
import { StripeCustomerModel } from './stripe-customer.model';
import { zod } from '../utils/zod';
import { db } from '../drizzle';
import { eq, and } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import Stripe from 'stripe';
import { z } from 'zod';

// Initialize Stripe with the platform account's secret key
const stripe = new Stripe(Resource.StripeSecretKey.value, {
	apiVersion: '2025-07-30.basil',
});

/**
 * Creators
 * -----------
 * 
 * These are functions used to create customer records.
 */

export const create = zod(StripeCustomerModel.CreateStripeCustomer, async (input) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.insert(stripeCustomer)
			.values([
				{
					id: createId(),
					userId: input.userId,
					stripeAccountId: input.stripeAccountId,
					stripeCustomerId: input.stripeCustomerId,
					email: input.email || null,
					name: input.name || null,
					phone: input.phone || null,
					addressLine1: input.addressLine1 || null,
					addressLine2: input.addressLine2 || null,
					addressCity: input.addressCity || null,
					addressState: input.addressState || null,
					addressPostalCode: input.addressPostalCode || null,
					addressCountry: input.addressCountry || null,
					currency: input.currency || null,
					defaultPaymentMethod: input.defaultPaymentMethod || null,
					description: input.description || null,
					metadata: input.metadata || null,
					customerObject: input.customerObject,
					isDeleted: input.isDeleted || false,
					isDelinquent: input.isDelinquent || false,
					stripeCreatedAt: input.stripeCreatedAt,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			])
			.returning()
			.execute();
		return result[0];
	});
});

/**
 * Getters
 * -----------
 * 
 * These are functions used to get customer information from the database.
 */

export const fromId = zod(StripeCustomerModel.Schema.shape.id, async (id) => {
	return db.transaction(async (tx) => {
		const result = await tx
			.select()
			.from(stripeCustomer)
			.where(eq(stripeCustomer.id, id))
			.execute();
		return result[0];
	});
});

export const fromStripeCustomerId = zod(
	StripeCustomerModel.Schema.shape.stripeCustomerId,
	async (stripeCustomerId) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.select()
				.from(stripeCustomer)
				.where(eq(stripeCustomer.stripeCustomerId, stripeCustomerId))
				.execute();
			return result[0];
		});
	}
);

export const listByUserId = zod(StripeCustomerModel.Schema.shape.userId, async (userId) => {
	return db.transaction(async (tx) => {
		return tx
			.select()
			.from(stripeCustomer)
			.where(and(eq(stripeCustomer.userId, userId), eq(stripeCustomer.isDeleted, false)))
			.execute();
	});
});

export const listByStripeAccountId = zod(
	StripeCustomerModel.Schema.shape.stripeAccountId,
	async (stripeAccountId) => {
		return db.transaction(async (tx) => {
			return tx
				.select()
				.from(stripeCustomer)
				.where(and(eq(stripeCustomer.stripeAccountId, stripeAccountId), eq(stripeCustomer.isDeleted, false)))
				.execute();
		});
	}
);

/**
 * Updaters
 * -----------
 * 
 * These are functions used to update customer information.
 */

export const update = zod(StripeCustomerModel.UpdateStripeCustomer, async (input) => {
	return db.transaction(async (tx) => {
		const updateData: any = {
			updatedAt: new Date(),
		};

		// Only update fields that are provided
		if (input.email !== undefined) updateData.email = input.email;
		if (input.name !== undefined) updateData.name = input.name;
		if (input.phone !== undefined) updateData.phone = input.phone;
		if (input.addressLine1 !== undefined) updateData.addressLine1 = input.addressLine1;
		if (input.addressLine2 !== undefined) updateData.addressLine2 = input.addressLine2;
		if (input.addressCity !== undefined) updateData.addressCity = input.addressCity;
		if (input.addressState !== undefined) updateData.addressState = input.addressState;
		if (input.addressPostalCode !== undefined) updateData.addressPostalCode = input.addressPostalCode;
		if (input.addressCountry !== undefined) updateData.addressCountry = input.addressCountry;
		if (input.currency !== undefined) updateData.currency = input.currency;
		if (input.defaultPaymentMethod !== undefined) updateData.defaultPaymentMethod = input.defaultPaymentMethod;
		if (input.description !== undefined) updateData.description = input.description;
		if (input.metadata !== undefined) updateData.metadata = input.metadata;
		if (input.customerObject !== undefined) updateData.customerObject = input.customerObject;
		if (input.isDeleted !== undefined) updateData.isDeleted = input.isDeleted;
		if (input.isDelinquent !== undefined) updateData.isDelinquent = input.isDelinquent;

		const result = await tx
			.update(stripeCustomer)
			.set(updateData)
			.where(eq(stripeCustomer.id, input.id))
			.returning()
			.execute();
		return result[0];
	});
});

/**
 * Webhook Handlers
 * -----------
 * 
 * These are functions used to handle customer-related webhook events.
 */

// Handle customer.created webhook event
export const handleCustomerCreated = zod(
	z.object({
		event: z.any(),
		stripeAccountId: z.string(),
		userId: z.string(),
	}),
	async (input) => {
		const customer = input.event.data.object as Stripe.Customer;

		// Check if we already have this customer recorded
		const existingCustomer = await fromStripeCustomerId(customer.id);
		if (existingCustomer) {
			return existingCustomer;
		}

		// Create a new customer record
		return create({
			userId: input.userId,
			stripeAccountId: input.stripeAccountId,
			stripeCustomerId: customer.id,
			email: customer.email || undefined,
			name: customer.name || undefined,
			phone: customer.phone || undefined,
			addressLine1: customer.address?.line1 || undefined,
			addressLine2: customer.address?.line2 || undefined,
			addressCity: customer.address?.city || undefined,
			addressState: customer.address?.state || undefined,
			addressPostalCode: customer.address?.postal_code || undefined,
			addressCountry: customer.address?.country || undefined,
			currency: customer.currency || undefined,
			defaultPaymentMethod: customer.default_source?.toString() || customer.invoice_settings?.default_payment_method?.toString() || undefined,
			description: customer.description || undefined,
			metadata: customer.metadata,
			customerObject: customer,
			isDeleted: customer.deleted || false,
			isDelinquent: customer.delinquent || false,
			stripeCreatedAt: new Date(customer.created * 1000),
		});
	}
);

// Handle customer.updated webhook event
export const handleCustomerUpdated = zod(
	z.object({
		event: z.any(),
		stripeAccountId: z.string(),
	}),
	async (input) => {
		const customer = input.event.data.object as Stripe.Customer;

		// Find the existing customer
		const existingCustomer = await fromStripeCustomerId(customer.id);
		if (!existingCustomer) {
			console.error('No matching customer record found for update');
			return null;
		}

		// Update the customer record
		return update({
			id: existingCustomer.id,
			email: customer.email || undefined,
			name: customer.name || undefined,
			phone: customer.phone || undefined,
			addressLine1: customer.address?.line1 || undefined,
			addressLine2: customer.address?.line2 || undefined,
			addressCity: customer.address?.city || undefined,
			addressState: customer.address?.state || undefined,
			addressPostalCode: customer.address?.postal_code || undefined,
			addressCountry: customer.address?.country || undefined,
			currency: customer.currency || undefined,
			defaultPaymentMethod: customer.default_source?.toString() || customer.invoice_settings?.default_payment_method?.toString() || undefined,
			description: customer.description || undefined,
			metadata: customer.metadata,
			customerObject: customer,
			isDeleted: customer.deleted || false,
			isDelinquent: customer.delinquent || false,
		});
	}
);

// Handle customer.deleted webhook event
export const handleCustomerDeleted = zod(
	z.object({
		event: z.any(),
		stripeAccountId: z.string(),
	}),
	async (input) => {
		const customer = input.event.data.object as Stripe.Customer;

		// Find the existing customer
		const existingCustomer = await fromStripeCustomerId(customer.id);
		if (!existingCustomer) {
			console.error('No matching customer record found for deletion');
			return null;
		}

		// Mark the customer as deleted
		return update({
			id: existingCustomer.id,
			isDeleted: true,
		});
	}
);

/**
 * Cleanup Functions
 * -----------
 * 
 * These are functions used to clean up customer data.
 */

export const hardDeleteByAccountId = zod(
	StripeCustomerModel.Schema.shape.stripeAccountId,
	async (stripeAccountId) => {
		return db.transaction(async (tx) => {
			const result = await tx
				.delete(stripeCustomer)
				.where(eq(stripeCustomer.stripeAccountId, stripeAccountId))
				.returning()
				.execute();
			return result;
		});
	}
);