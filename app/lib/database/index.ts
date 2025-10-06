/**
 * Database Module - Schema, Types, and Database Instance
 * 
 * This module exports schema, types, and the main database instance
 * for use in API routes and components.
 */

// Export the raw Drizzle instance for direct queries
export { db as rawDb, client, connectionString } from './drizzle'

// Export the helper database object
export { database, database as db, database as drizzleDb } from './drizzle'

// Export schema and types
export * from './schema'
export * from './types'