import { createSeededRandom, type Difficulty } from './core'

export type GravityColor = 'RED' | 'BLUE' | 'GOLD'
export type GravityDirection = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'
export type GravityWord = GravityColor | 'PULLS' | GravityDirection
export interface GravityObject { color: GravityColor; row: number; col: number }
export interface GravityLevel { seed: string; size: number; object: GravityObject; exit: { row: number; col: number }; words: GravityWord[]; maxRuns: number }

const VECTORS: Record<GravityDirection, [number, number]> = { UP: [-1, 0], RIGHT: [0, 1], DOWN: [1, 0], LEFT: [0, -1] }

export function parseGravityRule(words: GravityWord[]) {
  if (words.length !== 3 || !['RED', 'BLUE', 'GOLD'].includes(words[0]) || words[1] !== 'PULLS' || !['UP', 'RIGHT', 'DOWN', 'LEFT'].includes(words[2])) return null
  return { color: words[0] as GravityColor, direction: words[2] as GravityDirection }
}

export function applyGravityRule(level: GravityLevel, object: GravityObject, words: GravityWord[]) {
  const rule = parseGravityRule(words)
  if (!rule || rule.color !== object.color) return object
  const [dr, dc] = VECTORS[rule.direction]
  return { ...object, row: Math.max(0, Math.min(level.size - 1, object.row + dr)), col: Math.max(0, Math.min(level.size - 1, object.col + dc)) }
}

export function isGravitySolved(level: GravityLevel, object: GravityObject) {
  return object.row === level.exit.row && object.col === level.exit.col
}

export function generateGravityLevel(seed: string, difficulty: Difficulty = 'standard'): GravityLevel {
  const random = createSeededRandom(seed)
  const size = difficulty === 'easy' ? 4 : difficulty === 'hard' ? 6 : 5
  const colors: GravityColor[] = ['RED', 'BLUE', 'GOLD']
  const color = colors[Math.floor(random() * colors.length)]
  const object = { color, row: Math.floor(random() * size), col: Math.floor(random() * size) }
  let exit = { row: Math.floor(random() * size), col: Math.floor(random() * size) }
  if (exit.row === object.row && exit.col === object.col) exit = { row: (object.row + 2) % size, col: (object.col + 1) % size }
  const words: GravityWord[] = [color, 'PULLS', 'UP', 'RIGHT', 'DOWN', 'LEFT']
  return { seed, size, object, exit, words, maxRuns: Math.abs(exit.row - object.row) + Math.abs(exit.col - object.col) + 3 }
}

export const GRAVITY_FIXED_LEVELS = Array.from({ length: 6 }, (_, index) => generateGravityLevel(`gravity-fixed-${index + 1}`, index < 2 ? 'easy' : index > 4 ? 'hard' : 'standard'))

export function getGravityHint(level: GravityLevel, object: GravityObject): GravityDirection {
  if (object.row > level.exit.row) return 'UP'
  if (object.row < level.exit.row) return 'DOWN'
  return object.col > level.exit.col ? 'LEFT' : 'RIGHT'
}
