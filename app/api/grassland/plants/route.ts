/**
 * API Route: /api/grassland/plants
 * 文档来源: Action Plan - Module 3.3
 *
 * GET: Fetch plants with pagination and filtering
 * POST: Create a new plant
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { plants } from '@/db/schema/plants'
import { users } from '@/db/schema/users'
import { eq, desc, and, sql } from 'drizzle-orm'
import {
  validateNewPlant,
  validatePagination,
  validatePlantFilters
} from '@/lib/services/validationService'
import { getLevelRadius } from '@/lib/services/levelService'
import {
  generateSinglePlantPosition,
  calculatePrairieBounds
} from '@/lib/services/layoutService'

/**
 * GET /api/grassland/plants
 * Fetch plants with pagination and optional filters
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 50, max: 100)
 * - level: 1 | 2 | 3 | 4 (optional)
 * - authorId: string (optional)
 * - sort: 'latest' | 'oldest' | 'level' (default: 'latest')
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const levelFilter = searchParams.get('level')
      ? parseInt(searchParams.get('level')!)
      : undefined
    const authorId = searchParams.get('authorId') || undefined
    const sort = searchParams.get('sort') || 'latest'

    // Validate pagination
    const paginationValidation = validatePagination({ page, limit })
    if (!paginationValidation.valid) {
      return NextResponse.json(
        { error: paginationValidation.errors.join(', ') },
        { status: 400 }
      )
    }

    // Validate filters
    if (levelFilter) {
      const filterValidation = validatePlantFilters({ level: levelFilter })
      if (!filterValidation.valid) {
        return NextResponse.json(
          { error: filterValidation.errors.join(', ') },
          { status: 400 }
        )
      }
    }

    // Build query conditions
    const conditions = []
    if (levelFilter) {
      conditions.push(eq(plants.level, levelFilter))
    }
    if (authorId) {
      conditions.push(eq(plants.authorId, authorId))
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
      case 'latest':
      default:
        orderBy = desc(plants.createdAt)
    }

    // Execute query with pagination
    const offset = (page - 1) * limit
    const plantsData = await db
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
        radius: plants.radius,
        authorId: plants.authorId,
        authorName: users.name,
        authorImage: users.image
      })
      .from(plants)
      .leftJoin(users, eq(plants.authorId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(plants)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    // Return response
    return NextResponse.json({
      data: plantsData,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
        hasNext: page < Math.ceil(Number(count) / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('[GET /api/grassland/plants] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch plants' }, { status: 500 })
  }
}

/**
 * POST /api/grassland/plants
 * Create a new plant
 *
 * Body:
 * - imageUrl: string (Supabase Storage URL)
 * - width: number (canvas width)
 * - height: number (canvas height)
 * - authorId: string (user ID)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { imageUrl, width, height, authorId } = body

    // Get all existing plants for layout calculation
    const existingPlants = await db.select().from(plants)

    // Calculate prairie bounds
    const bounds = calculatePrairieBounds(existingPlants.length)

    // Generate position for new plant (Level 1 by default)
    const position = generateSinglePlantPosition(
      crypto.randomUUID(), // Temporary ID
      1, // Level 1
      existingPlants,
      bounds
    )

    if (!position) {
      return NextResponse.json(
        { error: 'Failed to find valid position for plant' },
        { status: 500 }
      )
    }

    // Prepare new plant data
    const newPlantData = {
      imageUrl,
      width,
      height,
      positionX: position.x,
      positionY: position.y,
      radius: getLevelRadius(1), // Level 1 radius
      authorId,
      xp: 0,
      level: 1,
      waterCount: 0
    }

    // Validate plant data
    const validation = validateNewPlant(newPlantData)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 })
    }

    // Insert plant into database
    const [createdPlant] = await db.insert(plants).values(newPlantData).returning()

    // Fetch plant with author data
    const plantWithAuthor = await db
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
        radius: plants.radius,
        authorId: plants.authorId,
        authorName: users.name,
        authorImage: users.image
      })
      .from(plants)
      .leftJoin(users, eq(plants.authorId, users.id))
      .where(eq(plants.id, createdPlant.id))
      .limit(1)

    return NextResponse.json(
      {
        data: plantWithAuthor[0],
        message: 'Plant created successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/grassland/plants] Error:', error)
    return NextResponse.json({ error: 'Failed to create plant' }, { status: 500 })
  }
}
