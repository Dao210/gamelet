/**
 * Database Connection
 * 文档来源: Action Plan - Module 3.1
 *
 * Provides a singleton database connection using Drizzle ORM
 * with Supabase PostgreSQL.
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create postgres connection
// Note: For serverless environments (Vercel), use prepared: false
const connectionString = process.env.DATABASE_URL
const client = postgres(connectionString, {
  prepare: false,
  max: 1 // Supabase recommends connection pooling
})

// Create Drizzle instance with schema
export const db = drizzle(client, { schema })

// Export schema for convenience
export { schema }

// Export types
export type DB = typeof db
