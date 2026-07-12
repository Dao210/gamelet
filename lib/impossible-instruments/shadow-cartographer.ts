import { createSeededRandom, type Difficulty } from './core'

export type ShadowDirection = 0 | 1 | 2 | 3
export interface ShadowBlocker { row: number; col: number; wide: boolean }
export interface ShadowLevel { seed: string; size: number; blockers: ShadowBlocker[]; initialDirection: ShadowDirection; targetDirection: ShadowDirection; target: string[]; forbidden: string[] }

const VECTORS: Array<[number, number]> = [[1, 0], [0, -1], [-1, 0], [0, 1]]
const keyOf = (row: number, col: number) => `${row}:${col}`

export function traceShadows(size: number, blockers: ShadowBlocker[], direction: ShadowDirection) {
  const [dr, dc] = VECTORS[direction]
  const cells = new Set<string>()
  blockers.forEach((blocker) => {
    const origins = [{ row: blocker.row, col: blocker.col }]
    if (blocker.wide) origins.push({ row: blocker.row + (dc === 0 ? 0 : 1), col: blocker.col + (dr === 0 ? 0 : 1) })
    origins.forEach((origin) => {
      let row = origin.row
      let col = origin.col
      while (row >= 0 && row < size && col >= 0 && col < size) {
        cells.add(keyOf(row, col)); row += dr; col += dc
      }
    })
  })
  return [...cells].sort()
}

export function isShadowSolved(level: ShadowLevel, direction: ShadowDirection, blockers: ShadowBlocker[]) {
  const shadow = new Set(traceShadows(level.size, blockers, direction))
  return level.target.every((cell) => shadow.has(cell)) && level.forbidden.every((cell) => !shadow.has(cell))
}

export function generateShadowLevel(seed: string, difficulty: Difficulty = 'standard'): ShadowLevel {
  const random = createSeededRandom(seed)
  const size = difficulty === 'hard' ? 7 : difficulty === 'easy' ? 5 : 6
  const count = difficulty === 'hard' ? 3 : 2
  const blockers: ShadowBlocker[] = Array.from({ length: count }, (_, index) => ({ row: 1 + Math.floor(random() * (size - 2)), col: 1 + Math.floor(random() * (size - 2)), wide: index > 0 && random() > 0.5 }))
  const targetDirection = Math.floor(random() * 4) as ShadowDirection
  const target = traceShadows(size, blockers, targetDirection).filter((_, index) => index % 2 === 0)
  const fullShadow = new Set(traceShadows(size, blockers, targetDirection))
  const forbidden: string[] = []
  for (let row = 0; row < size && forbidden.length < 3; row += 1) for (let col = 0; col < size && forbidden.length < 3; col += 1) if (!fullShadow.has(keyOf(row, col)) && random() > 0.6) forbidden.push(keyOf(row, col))
  return { seed, size, blockers, targetDirection, initialDirection: ((targetDirection + 1 + Math.floor(random() * 3)) % 4) as ShadowDirection, target, forbidden }
}

export const SHADOW_FIXED_LEVELS = Array.from({ length: 6 }, (_, index) => generateShadowLevel(`shadow-fixed-${index + 1}`, index < 2 ? 'easy' : index > 4 ? 'hard' : 'standard'))

export function getShadowHint(level: ShadowLevel, direction: ShadowDirection) {
  const clockwise = (level.targetDirection - direction + 4) % 4
  return clockwise <= 2 ? 'clockwise' : 'counterclockwise'
}
