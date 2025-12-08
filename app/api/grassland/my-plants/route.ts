/**
 * API Route: /api/grassland/my-plants
 * 文档来源: Action Plan - Module 3.3
 *
 * GET: Fetch current user's plants
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { plants } from '@/db/schema/plants'
import { waterings } from '@/db/schema/waterings'
import { eq, desc, sql } from 'drizzle-orm'
import { validatePagination } from '@/lib/services/validationService'

/**
 * GET /api/grassland/my-plants
 * Fetch user's own plants with statistics
 *
 * Query params:
 * - userId: string (required)
 * - page: number (default: 1)
 * - limit: number (default: 50, max: 100)
 * - sort: 'latest' | 'oldest' | 'level' | 'waterings' (default: 'latest')
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const sort = searchParams.get('sort') || 'latest'

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Validate pagination
    const paginationValidation = validatePagination({ page, limit })
    if (!paginationValidation.valid) {
      return NextResponse.json(
        { error: paginationValidation.errors.join(', ') },
        { status: 400 }
      )
    }

    // Build order by
    let orderBy
    switch (sort) {
      case 'oldest':
        orderBy = plants.createdAt
        break
      case 'level':
        orderBy = desc(plants.level)
        break
      case 'waterings':
        orderBy = desc(plants.waterCount)
        break
      case 'latest':
      default:
        orderBy = desc(plants.createdAt)
    }

    // Execute query with pagination
    const offset = (page - 1) * limit
    const userPlants = await db
      .select({
        id: plants.id,
        createdAt: plants.createdAt,
        updatedAt: plants.updatedAt,
        imageUrl: plants.imageUrl,
        width: plants.width,
        height: plants.height,
        xp: plants.xp,
        level: plants.level,
        waterCount: plants.waterCount,
        positionX: plants.positionX,
        positionY: plants.positionY,
        radius: plants.radius
      })
      .from(plants)
      .where(eq(plants.authorId, userId))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(plants)
      .where(eq(plants.authorId, userId))

    // Get statistics
    const stats = await db
      .select({
        totalPlants: sql<number>`count(*)`,
        totalWaterings: sql<number>`sum(${plants.waterCount})`,
        totalXP: sql<number>`sum(${plants.xp})`,
        avgLevel: sql<number>`avg(${plants.level})`,
        level1Count: sql<number>`count(*) filter (where ${plants.level} = 1)`,
        level2Count: sql<number>`count(*) filter (where ${plants.level} = 2)`,
        level3Count: sql<number>`count(*) filter (where ${plants.level} = 3)`,
        level4Count: sql<number>`count(*) filter (where ${plants.level} = 4)`
      })
      .from(plants)
      .where(eq(plants.authorId, userId))

    // Get watering activity (plants watered by this user)
    const wateringActivity = await db
      .select({
        totalWatered: sql<number>`count(*)`,
        uniquePlants: sql<number>`count(distinct ${waterings.plantId})`
      })
      .from(waterings)
      .where(eq(waterings.userId, userId))

    return NextResponse.json({
      data: userPlants,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
        hasNext: page < Math.ceil(Number(count) / limit),
        hasPrev: page > 1
      },
      stats: {
        myPlants: {
          total: Number(stats[0].totalPlants || 0),
          totalWaterings: Number(stats[0].totalWaterings || 0),
          totalXP: Number(stats[0].totalXP || 0),
          avgLevel: Number(stats[0].avgLevel || 0).toFixed(1),
          byLevel: {
            level1: Number(stats[0].level1Count || 0),
            level2: Number(stats[0].level2Count || 0),
            level3: Number(stats[0].level3Count || 0),
            level4: Number(stats[0].level4Count || 0)
          }
        },
        myActivity: {
          totalWatered: Number(wateringActivity[0]?.totalWatered || 0),
          uniquePlants: Number(wateringActivity[0]?.uniquePlants || 0)
        }
      }
    })
  } catch (error) {
    console.error('[GET /api/grassland/my-plants] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch user plants' }, { status: 500 })
  }
}
