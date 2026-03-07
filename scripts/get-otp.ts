/**
 * Development utility to retrieve OTP codes from the database.
 * Used by automated testing agents to complete the login flow.
 *
 * Usage: npx sst shell npx tsx scripts/get-otp.ts <email>
 *
 * Prerequisites:
 * - SST dev mode must be running (npx sst dev)
 * - User must have requested an OTP via /login first
 *
 * Example:
 *   npx sst shell npx tsx scripts/get-otp.ts test@example.com
 */

import { neon } from '@neondatabase/serverless';
import { Resource } from 'sst';

const email = process.argv[2];

if (!email) {
	console.error('Usage: npx sst shell npx tsx scripts/get-otp.ts <email>');
	console.error(
		'Example: npx sst shell npx tsx scripts/get-otp.ts test@example.com',
	);
	process.exit(1);
}

async function main() {
	try {
		const sql = neon(Resource.Database.url);

		// Better Auth prefixes the identifier with the OTP type
		const identifier = `sign-in-otp-${email}`;

		const result = await sql`
			SELECT value FROM verification
			WHERE identifier = ${identifier}
			ORDER BY created_at DESC
			LIMIT 1
		`;

		if (result.length > 0 && result[0].value) {
			// Output just the OTP code (easy to parse in scripts)
			console.log(result[0].value);
		} else {
			console.error(`No OTP found for email: ${email}`);
			process.exit(1);
		}
	} catch (error) {
		console.error('Database query failed:', error);
		process.exit(1);
	}
}

main();
