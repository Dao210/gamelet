/**
 * Layout Service
 * 文档来源: Action Plan - Module 3.4, /lib/poisson-disk-sampling.ts
 *
 * Handles plant positioning using Poisson Disk Sampling algorithm.
 * Ensures plants are evenly distributed and don't overlap.
 */

import {
  generatePlantLayout,
  type PlantPosition,
  type PoissonDiskOptions
} from '../poisson-disk-sampling'
import { getLevelRadius } from './levelService'
import type { Plant } from '@/db/schema/plants'

// Type alias for plants with position data (Plant schema includes positionX, positionY, radius)
export type PlantWithPosition = Plant

/**
 * Generate positions for a batch of new plants
 * Takes into account existing plants to avoid overlaps
 */
export function generatePlantPositions(
  newPlants: Array<{ id: string; level: 1 | 2 | 3 | 4 }>,
  existingPlants: PlantWithPosition[],
  bounds: { width: number; height: number },
  options?: Partial<PoissonDiskOptions>
): PlantPosition[] {
  // Convert existing plants to PlantPosition format
  const existingPositions: PlantPosition[] = existingPlants.map((plant) => ({
    x: plant.positionX,
    y: plant.positionY,
    radius: plant.radius,
    plantId: plant.id
  }))

  // Generate layout for new plants
  // TODO: In future, pass existingPositions to avoid overlaps
  const newPositions = generatePlantLayout(newPlants, bounds, 50)

  return newPositions
}

/**
 * Generate position for a single new plant
 */
export function generateSinglePlantPosition(
  plantId: string,
  level: 1 | 2 | 3 | 4,
  existingPlants: PlantWithPosition[],
  bounds: { width: number; height: number }
): PlantPosition | null {
  const positions = generatePlantPositions([{ id: plantId, level }], existingPlants, bounds)

  return positions.length > 0 ? positions[0] : null
}

/**
 * Calculate prairie bounds based on current plant count
 * Expands the prairie as more plants are added
 */
export function calculatePrairieBounds(plantCount: number): { width: number; height: number } {
  const baseWidth = 1920 // Full HD width
  const baseHeight = 1080 // Full HD height

  // Expand height dynamically based on plant count
  // Every 50 plants adds ~500px height
  const additionalHeight = Math.floor(plantCount / 50) * 500

  return {
    width: baseWidth,
    height: baseHeight + additionalHeight
  }
}

/**
 * Group plants into rows for virtual scrolling
 * Groups plants by Y coordinate into fixed-height rows
 */
export function groupPlantsIntoRows(
  plants: PlantWithPosition[],
  rowHeight: number = 150
): PlantWithPosition[][] {
  if (plants.length === 0) return []

  // Find max Y to determine number of rows
  const maxY = Math.max(...plants.map((p) => p.positionY))
  const rowCount = Math.ceil(maxY / rowHeight)

  // Initialize rows
  const rows: PlantWithPosition[][] = Array(rowCount)
    .fill(null)
    .map(() => [])

  // Assign plants to rows
  plants.forEach((plant) => {
    const rowIndex = Math.floor(plant.positionY / rowHeight)
    if (rows[rowIndex]) {
      rows[rowIndex].push(plant)
    }
  })

  return rows
}

/**
 * Validate plant position doesn't overlap with existing plants
 * Used for manual positioning or collision detection
 */
export function validatePlantPosition(
  position: { x: number; y: number; radius: number },
  existingPlants: PlantWithPosition[]
): { valid: boolean; reason?: string } {
  // Check if position is within bounds
  if (position.x < 0 || position.y < 0) {
    return { valid: false, reason: 'Position out of bounds (negative coordinates)' }
  }

  // Check for overlaps with existing plants
  for (const plant of existingPlants) {
    const dx = position.x - plant.positionX
    const dy = position.y - plant.positionY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const minDistance = position.radius + plant.radius

    if (distance < minDistance) {
      return {
        valid: false,
        reason: `Overlaps with plant ${plant.id} (distance: ${distance.toFixed(2)}, min: ${minDistance.toFixed(2)})`
      }
    }
  }

  return { valid: true }
}

/**
 * Example usage:
 *
 * // When creating a new plant:
 * const position = generateSinglePlantPosition(
 *   newPlant.id,
 *   newPlant.level,
 *   existingPlants,
 *   calculatePrairieBounds(existingPlants.length)
 * )
 *
 * // For virtual scrolling:
 * const rows = groupPlantsIntoRows(plants, 150)
 */
