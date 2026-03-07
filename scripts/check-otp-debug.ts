import { neon } from '@neondatabase/serverless';
import { Resource } from 'sst';

async function main() {
  const sql = neon(Resource.Database.url);
  const result = await sql`SELECT identifier, value, created_at FROM verification ORDER BY created_at DESC LIMIT 5`;
  console.log(JSON.stringify(result, null, 2));
}
main();
