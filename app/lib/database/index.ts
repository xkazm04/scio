// Temporary compatibility layer - re-export Supabase client as db
// This allows existing files to import { db } from '~/lib/database/index'
// while we gradually migrate all files to use the new Supabase client

export { db, sql } from './connection';
export * from './schema';
export * from './types';