import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Create the connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create postgres client
export const sql = postgres(connectionString, { max: 1 });

// Create drizzle instance
export const db = drizzle(sql, { schema });

export * from './schema';