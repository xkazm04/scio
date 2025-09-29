import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { createClient } from '@supabase/supabase-js'

// Get database URL from Supabase
const getDatabaseUrl = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  // Use direct PostgreSQL connection URL if available
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  
  // Construct from Supabase config
  if (supabaseUrl) {
    const url = new URL(supabaseUrl)
    const host = url.hostname
    const project = host.split('.')[0]
    
    // Supabase PostgreSQL connection string format
    // Format: postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]
    return `postgresql://postgres:[YOUR_DB_PASSWORD]@db.${project}.supabase.co:5432/postgres`
  }
  
  throw new Error('No database configuration found. Please set DATABASE_URL or Supabase environment variables.')
}

// Create PostgreSQL connection
const connectionString = getDatabaseUrl()
const sql = postgres(connectionString, { max: 1 })

// Create Drizzle instance with schema
export const db = drizzle(sql, { schema })

// Also export Supabase client for auth operations
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Export schema for type inference
export * from './schema'

// Helper to get database URL for connections
export { connectionString }