/**
 * Validation Service
 * 文档来源: Action Plan - Module 3.4
 *
 * Handles validation for plant creation, watering, and other actions.
 * Centralized validation logic to ensure data integrity.
 */

import type { Plant, NewPlant } from '@/db/schema/plants'
import type { NewWatering } from '@/db/schema/waterings'

/**
 * Validation result type
 */
export interface ValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Image validation constraints
 */
export const IMAGE_CONSTRAINTS = {
  maxWidth: 800,
  maxHeight: 800,
  minWidth: 100,
  minHeight: 100,
  maxFileSizeMB: 5,
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'] as const
}

/**
 * Validate plant image data
 */
export function validatePlantImage(data: {
  width: number
  height: number
  fileSize?: number
  mimeType?: string
}): ValidationResult {
  const errors: string[] = []

  // Validate dimensions
  if (data.width > IMAGE_CONSTRAINTS.maxWidth) {
    errors.push(`Image width must be ≤ ${IMAGE_CONSTRAINTS.maxWidth}px (got ${data.width}px)`)
  }
  if (data.width < IMAGE_CONSTRAINTS.minWidth) {
    errors.push(`Image width must be ≥ ${IMAGE_CONSTRAINTS.minWidth}px (got ${data.width}px)`)
  }
  if (data.height > IMAGE_CONSTRAINTS.maxHeight) {
    errors.push(`Image height must be ≤ ${IMAGE_CONSTRAINTS.maxHeight}px (got ${data.height}px)`)
  }
  if (data.height < IMAGE_CONSTRAINTS.minHeight) {
    errors.push(`Image height must be ≥ ${IMAGE_CONSTRAINTS.minHeight}px (got ${data.height}px)`)
  }

  // Validate file size (if provided)
  if (data.fileSize) {
    const maxBytes = IMAGE_CONSTRAINTS.maxFileSizeMB * 1024 * 1024
    if (data.fileSize > maxBytes) {
      const sizeMB = (data.fileSize / 1024 / 1024).toFixed(2)
      errors.push(`Image size must be ≤ ${IMAGE_CONSTRAINTS.maxFileSizeMB}MB (got ${sizeMB}MB)`)
    }
  }

  // Validate MIME type (if provided)
  if (data.mimeType && !IMAGE_CONSTRAINTS.allowedMimeTypes.includes(data.mimeType as typeof IMAGE_CONSTRAINTS.allowedMimeTypes[number])) {
    errors.push(
      `Image type must be one of: ${IMAGE_CONSTRAINTS.allowedMimeTypes.join(', ')} (got ${data.mimeType})`
    )
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate new plant data before creation
 */
export function validateNewPlant(data: Partial<NewPlant>): ValidationResult {
  const errors: string[] = []

  // Required fields
  if (!data.imageUrl) {
    errors.push('imageUrl is required')
  } else if (!isValidUrl(data.imageUrl)) {
    errors.push('imageUrl must be a valid URL')
  }

  if (typeof data.width !== 'number' || data.width <= 0) {
    errors.push('width must be a positive number')
  }

  if (typeof data.height !== 'number' || data.height <= 0) {
    errors.push('height must be a positive number')
  }

  if (typeof data.positionX !== 'number') {
    errors.push('positionX is required')
  }

  if (typeof data.positionY !== 'number') {
    errors.push('positionY is required')
  }

  if (!data.authorId) {
    errors.push('authorId is required')
  }

  // Validate image dimensions
  if (typeof data.width === 'number' && typeof data.height === 'number') {
    const imageValidation = validatePlantImage({
      width: data.width,
      height: data.height
    })
    errors.push(...imageValidation.errors)
  }

  // Validate level (if provided)
  if (data.level !== undefined && ![1, 2, 3, 4].includes(data.level)) {
    errors.push('level must be 1, 2, 3, or 4')
  }

  // Validate XP (if provided)
  if (data.xp !== undefined && data.xp < 0) {
    errors.push('xp must be non-negative')
  }

  // Validate water count (if provided)
  if (data.waterCount !== undefined && data.waterCount < 0) {
    errors.push('waterCount must be non-negative')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate watering action
 */
export function validateWatering(data: {
  plantId: string
  userId: string
  authorId: string
}): ValidationResult {
  const errors: string[] = []

  if (!data.plantId) {
    errors.push('plantId is required')
  }

  if (!data.userId) {
    errors.push('userId is required')
  }

  // Users cannot water their own plants
  if (data.userId === data.authorId) {
    errors.push('You cannot water your own plants')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate pagination parameters
 */
export function validatePagination(data: {
  page?: number
  limit?: number
}): ValidationResult {
  const errors: string[] = []
  const MAX_LIMIT = 100

  if (data.page !== undefined) {
    if (!Number.isInteger(data.page) || data.page < 1) {
      errors.push('page must be a positive integer')
    }
  }

  if (data.limit !== undefined) {
    if (!Number.isInteger(data.limit) || data.limit < 1) {
      errors.push('limit must be a positive integer')
    } else if (data.limit > MAX_LIMIT) {
      errors.push(`limit must be ≤ ${MAX_LIMIT}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate filter parameters for plant queries
 */
export function validatePlantFilters(data: {
  level?: number
  authorId?: string
  minXP?: number
  maxXP?: number
}): ValidationResult {
  const errors: string[] = []

  if (data.level !== undefined && ![1, 2, 3, 4].includes(data.level)) {
    errors.push('level must be 1, 2, 3, or 4')
  }

  if (data.minXP !== undefined && data.minXP < 0) {
    errors.push('minXP must be non-negative')
  }

  if (data.maxXP !== undefined && data.maxXP < 0) {
    errors.push('maxXP must be non-negative')
  }

  if (
    data.minXP !== undefined &&
    data.maxXP !== undefined &&
    data.minXP > data.maxXP
  ) {
    errors.push('minXP must be ≤ maxXP')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Helper: Check if string is a valid URL
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Helper: Sanitize string input
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input.trim().slice(0, maxLength)
}

/**
 * Example usage:
 *
 * // Validate before creating plant:
 * const validation = validateNewPlant(plantData)
 * if (!validation.valid) {
 *   return { error: validation.errors.join(', ') }
 * }
 *
 * // Validate before watering:
 * const waterValidation = validateWatering({ plantId, userId, authorId })
 * if (!waterValidation.valid) {
 *   return { error: waterValidation.errors[0] }
 * }
 */
