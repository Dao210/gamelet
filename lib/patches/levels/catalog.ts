import type { Difficulty } from '../types'
export const PRACTICE_COUNT = 310
export const CURATED_COUNT = 20
export const TUTORIAL_COUNT = 12
export const PACK_SIZE = 50
export const TOTAL_PER_DIFFICULTY = 400
export const difficulties: readonly Difficulty[] = ['easy', 'medium', 'hard']
export function puzzleId(difficulty: Difficulty, number: number) { return `patches-${difficulty}-${String(number).padStart(4, '0')}` }
