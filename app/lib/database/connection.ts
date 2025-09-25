import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Get Supabase connection string from environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
}

// Extract project reference from Supabase URL
// Convert https://avklvzpbztnnhdhqskzu.supabase.co to avklvzpbztnnhdhqskzu
const urlParts = supabaseUrl.split('//');
const hostPart = urlParts[1];

if (!hostPart) {
  throw new Error('Invalid SUPABASE_URL format');
}

const hostParts = hostPart.split('.');
const projectRef = hostParts[0];

if (!projectRef) {
  throw new Error('Cannot extract project reference from SUPABASE_URL');
}

// Construct PostgreSQL connection string
const connectionString = `postgres://postgres:${supabaseServiceKey}@db.${projectRef}.supabase.co:5432/postgres`;

// Create the connection
const queryClient = postgres(connectionString);

// Create the drizzle database instance
export const db = drizzle(queryClient, { schema });

// Export the client for direct SQL queries if needed
export const sql = queryClient;