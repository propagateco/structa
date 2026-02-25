import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Resource } from "sst";

// Use HTTP connection for AWS Lambda compatibility
// This avoids the bufferUtil native dependency issues with WebSocket connections
const sql = neon(Resource.Database.url);

export const db = drizzle(sql);
