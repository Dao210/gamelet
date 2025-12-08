/**
 * Users Table Schema
 * 文档来源: Action Plan - Module 3.2
 *
 * User accounts managed by NextAuth.js.
 * This schema follows NextAuth's standard database adapter pattern.
 *
 * Note: This is a simplified version. Full NextAuth tables include:
 * - users
 * - accounts (OAuth providers)
 * - sessions
 * - verification_tokens
 *
 * For now, we're defining the users table that our plants and waterings reference.
 * Full NextAuth integration will be added in a future module.
 */

import { pgTable, uuid, timestamp, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { plants } from './plants'
import { waterings } from './waterings'

export const users = pgTable('users', {
  // Primary key
  id: uuid('id').primaryKey().defaultRandom(),

  // Basic profile (from NextAuth)
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  image: text('image'),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  plants: many(plants),
  waterings: many(waterings)
}))

// TypeScript types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
