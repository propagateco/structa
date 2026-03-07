/**
 * Development utility to bypass onboarding by setting user's plan.
 * Used for testing the /app route without completing full onboarding flow.
 *
 * Usage: npx sst shell npx tsx scripts/bypass-onboarding.ts <email>
 *
 * Prerequisites:
 * - SST dev mode must be running (npx sst dev)
 * - User account must exist (created via /login)
 *
 * Example:
 *   npx sst shell npx tsx scripts/bypass-onboarding.ts test@example.com
 */

import { neon } from '@neondatabase/serverless';
import { Resource } from 'sst';

const email = process.argv[2];

if (!email) {
	console.error('Usage: npx sst shell npx tsx scripts/bypass-onboarding.ts <email>');
	console.error(
		'Example: npx sst shell npx tsx scripts/bypass-onboarding.ts test@example.com',
	);
	process.exit(1);
}

async function main() {
	try {
		const sql = neon(Resource.Database.url);

		// Update user's plan to bypass onboarding (quote "user" as it's a reserved keyword)
		const result = await sql`
			UPDATE "user"
			SET plan = 'pro',
			    product = 'floor-plan',
			    workspace_name = 'Test Workspace',
			    updated_at = NOW()
			WHERE email = ${email}
			RETURNING id, name, email, plan, product, workspace_name
		`;

		if (result.length > 0) {
			console.log(`✅ User ${email} onboarding bypassed. Plan set to: ${result[0].plan}`);
			console.log(`   Workspace: ${result[0].workspace_name}`);
			console.log(`   Product: ${result[0].product}`);
		} else {
			console.error(`❌ User ${email} not found`);
			process.exit(1);
		}
	} catch (error) {
		console.error('Database query failed:', error);
		process.exit(1);
	}
}

main();
