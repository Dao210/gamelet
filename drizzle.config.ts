/**
 * Drizzle ORM Configuration
 * 文档来源: Action Plan - Module 3.1
 *
 * Configuration for Drizzle Kit CLI commands:
 * - pnpm drizzle-kit generate  # Generate migrations
 * - pnpm drizzle-kit push      # Push schema to database
 * - pnpm drizzle-kit studio    # Open Drizzle Studio
 */

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './db/schema/*.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  verbose: true,
  strict: true
})
