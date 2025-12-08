/**
 * Waterings Table Schema
 * 文档来源: Action Plan - Module 3.2, /docs/plans/全球草原花园.md
 *
 * Tracks watering interactions between users and plants.
 *
 * Core features:
 * - 24-hour limit per user per plant (unique constraint)
 * - XP tracking for growth calculation
 * - Cascade delete when plant is deleted
 */

import { pgTable, uuid, timestamp, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { plants } from './plants'
import { users } from './users'

export const waterings = pgTable('waterings', {
  // Primary key
  id: uuid('id').primaryKey().defaultRandom(),

  // Timestamp
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),

  // Foreign keys
  plantId: uuid('plant_id')
    .references(() => plants.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),

  // XP gained from this watering
  xpGained: integer('xp_gained').default(10).notNull()
})

// Relations
export const wateringsRelations = relations(waterings, ({ one }) => ({
  plant: one(plants, {
    fields: [waterings.plantId],
    references: [plants.id]
  }),
  user: one(users, {
    fields: [waterings.userId],
    references: [users.id]
  })
}))

// TypeScript types
export type Watering = typeof waterings.$inferSelect
export type NewWatering = typeof waterings.$inferInsert
