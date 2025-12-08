/**
 * Level Service
 * 文档来源: Action Plan - Module 3.4, /docs/plans/全球草原花园.md
 *
 * Handles plant level calculations based on XP (experience points).
 *
 * Dual-engine growth system:
 * - Social XP: waterCount * 10
 * - Time XP: daysSinceCreation * 5
 * - Total XP = Social XP + Time XP
 *
 * Level thresholds:
 * - Level 1: 0 XP (default)
 * - Level 2: 100 XP
 * - Level 3: 500 XP
 * - Level 4: 2000 XP
 */

export const LEVEL_THRESHOLDS = {
  1: 0,
  2: 100,
  3: 500,
  4: 2000
} as const

export const XP_PER_WATERING = 10
export const XP_PER_DAY = 5

/**
 * Calculate level from total XP
 */
export function calculateLevel(xp: number): 1 | 2 | 3 | 4 {
  if (xp >= LEVEL_THRESHOLDS[4]) return 4
  if (xp >= LEVEL_THRESHOLDS[3]) return 3
  if (xp >= LEVEL_THRESHOLDS[2]) return 2
  return 1
}

/**
 * Calculate total XP from social and time factors
 */
export function calculateTotalXP(waterCount: number, createdAt: Date): number {
  const socialXP = waterCount * XP_PER_WATERING
  const daysSinceCreation = Math.floor(
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  )
  const timeXP = daysSinceCreation * XP_PER_DAY

  return socialXP + timeXP
}

/**
 * Calculate XP needed for next level
 */
export function getXPForNextLevel(currentLevel: 1 | 2 | 3 | 4): number | null {
  if (currentLevel === 4) return null // Max level
  return LEVEL_THRESHOLDS[(currentLevel + 1) as 2 | 3 | 4]
}

/**
 * Calculate progress to next level (0-100%)
 */
export function getLevelProgress(xp: number, currentLevel: 1 | 2 | 3 | 4): number {
  if (currentLevel === 4) return 100 // Max level

  const currentThreshold = LEVEL_THRESHOLDS[currentLevel]
  const nextThreshold = LEVEL_THRESHOLDS[(currentLevel + 1) as 2 | 3 | 4]
  const xpInCurrentLevel = xp - currentThreshold
  const xpNeededForNextLevel = nextThreshold - currentThreshold

  return Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100))
}

/**
 * Get level size multiplier for rendering
 */
export function getLevelSize(level: 1 | 2 | 3 | 4): number {
  const sizes = {
    1: 1.0, // 50px (base)
    2: 1.3, // 65px
    3: 1.7, // 85px
    4: 2.2 // 110px
  }
  return sizes[level]
}

/**
 * Get level radius for Poisson Disk Sampling
 */
export function getLevelRadius(level: 1 | 2 | 3 | 4, baseRadius: number = 50): number {
  return baseRadius * getLevelSize(level)
}

/**
 * Check if watering will cause level up
 */
export function willLevelUp(
  currentXP: number,
  wateringXP: number = XP_PER_WATERING
): { willLevelUp: boolean; newLevel: 1 | 2 | 3 | 4 } {
  const currentLevel = calculateLevel(currentXP)
  const newLevel = calculateLevel(currentXP + wateringXP)

  return {
    willLevelUp: newLevel > currentLevel,
    newLevel
  }
}

/**
 * Example usage:
 *
 * const plant = { waterCount: 15, createdAt: new Date('2024-01-01') }
 * const totalXP = calculateTotalXP(plant.waterCount, plant.createdAt)
 * const level = calculateLevel(totalXP)
 * const progress = getLevelProgress(totalXP, level)
 * const radius = getLevelRadius(level)
 */
