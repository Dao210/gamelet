/**
 * API Route: /api/grassland/water
 * 文档来源: Action Plan - Module 3.3, /docs/plans/全球草原花园.md
 *
 * POST: Water a plant (adds XP, may trigger level up)
 *
 * Business rules:
 * - Users can only water OTHER users' plants (not their own)
 * - Each user can water a specific plant only ONCE per 24 hours
 * - Watering grants +10 XP to the plant
 * - May trigger level up (1→2: 100XP, 2→3: 500XP, 3→4: 2000XP)
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { plants } from '@/db/schema/plants'
import { waterings } from '@/db/schema/waterings'
import { eq, and, sql } from 'drizzle-orm'
import { validateWatering } from '@/lib/services/validationService'
import { calculateLevel, willLevelUp, XP_PER_WATERING } from '@/lib/services/levelService'
import { ensureAnonymousUser } from '@/lib/services/anonymousUserService'

/**
 * POST /api/grassland/water
 * Water a plant
 *
 * Body:
 * - plantId: string (plant UUID)
 * - userId: string (user UUID)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { plantId, userId } = body

    if (!plantId || !userId) {
      return NextResponse.json(
        { error: 'plantId and userId are required' },
        { status: 400 }
      )
    }

    try {
      await ensureAnonymousUser(userId)
    } catch {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 })
    }

    // Fetch plant with author info
    const [plant] = await db
      .select()
      .from(plants)
      .where(eq(plants.id, plantId))
      .limit(1)

    if (!plant) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 })
    }

    // Validate watering (user cannot water their own plants)
    const wateringValidation = validateWatering({
      plantId,
      userId,
      authorId: plant.authorId
    })

    if (!wateringValidation.valid) {
      return NextResponse.json(
        { error: wateringValidation.errors[0] },
        { status: 400 }
      )
    }

    // Check if user already watered this plant today
    // The unique constraint in the database will prevent duplicates,
    // but we check here to provide a better error message
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingWatering = await db
      .select()
      .from(waterings)
      .where(
        and(
          eq(waterings.plantId, plantId),
          eq(waterings.userId, userId),
          sql`DATE(${waterings.createdAt}) = CURRENT_DATE`
        )
      )
      .limit(1)

    if (existingWatering.length > 0) {
      return NextResponse.json(
        {
          error: 'You have already watered this plant today. Please try again tomorrow!',
          canWaterAgainAt: existingWatering[0].createdAt
        },
        { status: 429 } // Too Many Requests
      )
    }

    // Calculate new XP and level
    const currentXP = plant.xp
    const newXP = currentXP + XP_PER_WATERING
    const levelUpInfo = willLevelUp(currentXP, XP_PER_WATERING)
    const newLevel = calculateLevel(newXP)
    const newWaterCount = plant.waterCount + 1

    // Start transaction: Insert watering record + Update plant
    await db.transaction(async (tx) => {
      // Insert watering record
      await tx.insert(waterings).values({
        plantId,
        userId,
        xpGained: XP_PER_WATERING
      })

      // Update plant (XP, level, waterCount)
      await tx
        .update(plants)
        .set({
          xp: newXP,
          level: newLevel,
          waterCount: newWaterCount,
          updatedAt: new Date()
        })
        .where(eq(plants.id, plantId))
    })

    // Return success response
    return NextResponse.json({
      success: true,
      message: levelUpInfo.willLevelUp
        ? `Congratulations! Your plant leveled up to Level ${newLevel}!`
        : 'Plant watered successfully!',
      data: {
        plantId,
        xpGained: XP_PER_WATERING,
        newXP,
        newLevel,
        newWaterCount,
        leveledUp: levelUpInfo.willLevelUp,
        previousLevel: plant.level
      }
    })
  } catch (error: unknown) {
    console.error('[POST /api/grassland/water] Error:', error)

    // Handle unique constraint violation (24-hour limit)
    const dbError = error as { code?: string; constraint?: string }
    if (dbError?.code === '23505' || dbError?.constraint === 'unique_user_plant_per_day') {
      return NextResponse.json(
        {
          error: 'You have already watered this plant today. Please try again tomorrow!'
        },
        { status: 429 }
      )
    }

    return NextResponse.json({ error: 'Failed to water plant' }, { status: 500 })
  }
}

/**
 * GET /api/grassland/water
 * Check if user can water a specific plant
 *
 * Query params:
 * - plantId: string
 * - userId: string
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const plantId = searchParams.get('plantId')
    const userId = searchParams.get('userId')

    if (!plantId || !userId) {
      return NextResponse.json(
        { error: 'plantId and userId are required' },
        { status: 400 }
      )
    }

    // Check if watering exists today
    const existingWatering = await db
      .select()
      .from(waterings)
      .where(
        and(
          eq(waterings.plantId, plantId),
          eq(waterings.userId, userId),
          sql`DATE(${waterings.createdAt}) = CURRENT_DATE`
        )
      )
      .limit(1)

    const hasWateredToday = existingWatering.length > 0

    return NextResponse.json({
      canWater: !hasWateredToday,
      hasWateredToday,
      lastWateredAt: hasWateredToday ? existingWatering[0].createdAt : null
    })
  } catch (error) {
    console.error('[GET /api/grassland/water] Error:', error)
    return NextResponse.json({ error: 'Failed to check watering status' }, { status: 500 })
  }
}
