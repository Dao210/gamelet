import { db } from '@/db'
import { plants } from '@/db/schema/plants'
import { desc, sql } from 'drizzle-orm'

/**
 * Get all active plant IDs for sitemap generation
 * @returns Array of plant IDs
 */
export async function getPlantIds(): Promise<string[]> {
  try {
    const plantRows = await db
      .select({ id: plants.id })
      .from(plants)
      .orderBy(desc(plants.updatedAt))

    return plantRows.map((plant) => plant.id)
  } catch (error) {
    console.error('Failed to fetch plant IDs for sitemap:', error)
    return []
  }
}

/**
 * Get plant count for statistics
 * @returns Total count of active plants
 */
export async function getPlantCount(): Promise<number> {
  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(plants)

    return Number(count)
  } catch (error) {
    console.error('Failed to fetch plant count:', error)
    return 0
  }
}
