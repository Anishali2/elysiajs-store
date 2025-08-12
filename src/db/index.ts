import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create postgres connection
const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);

// Create drizzle database instance
export const db = drizzle(sql, { schema });

// Export the schema for easy access
export { accounts } from './schema';
export type { Account, NewAccount } from './schema';