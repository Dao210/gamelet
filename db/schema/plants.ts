/**
 * Plants Table Schema
 * 文档来源: Action Plan - Module 3.2, /docs/plans/全球草原花园.md
 *
 * Stores user-created plants with their properties and growth data.
 *
 * Core features:
 * - XP-based level system (Level 1-4)
 * - Poisson Disk Sampling position data
 * - Supabase Storage image URLs
 * - Social growth tracking (water_count)
 */

import { pgTable, uuid, timestamp, text, integer, real, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { waterings } from './waterings'

export const plants = pgTable(
  'plants',
  {
    // Primary key
    id: uuid('id').primaryKey().defaultRandom(),

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

    // Image data (Supabase Storage URL)
    imageUrl: text('image_url').notNull(), // e.g., https://xxx.supabase.co/storage/v1/object/public/plants/xxx.png
    width: integer('width').notNull(), // Canvas width
    height: integer('height').notNull(), // Canvas height

    // Growth system
    xp: integer('xp').default(0).notNull(), // Total experience points
    level: integer('level').default(1).notNull(), // 1-4
    waterCount: integer('water_count').default(0).notNull(), // Times watered by others

    // Layout positioning (Poisson Disk Sampling)
    positionX: real('position_x').notNull(), // X coordinate in prairie
    positionY: real('position_y').notNull(), // Y coordinate in prairie
    radius: real('radius').default(50).notNull(), // Plant radius for collision detection

    // Foreign key
    authorId: uuid('author_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull()
  },
  (table) => ({
    // Indexes for performance
    authorIdIdx: index('plants_author_id_idx').on(table.authorId),
    levelIdx: index('plants_level_idx').on(table.level),
    createdAtIdx: index('plants_created_at_idx').on(table.createdAt),
    positionIdx: index('plants_position_idx').on(table.positionX, table.positionY)
  })
)

// Relations
export const plantsRelations = relations(plants, ({ one, many }) => ({
  author: one(users, {
    fields: [plants.authorId],
    references: [users.id]
  }),
  waterings: many(waterings)
}))

// TypeScript types
export type Plant = typeof plants.$inferSelect
export type NewPlant = typeof plants.$inferInsert
