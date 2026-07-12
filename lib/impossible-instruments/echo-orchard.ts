import { createSeededRandom, type Difficulty } from './core'

export type EchoTransform = 'reverse' | 'rotate' | 'mirror' | 'invert' | 'duplicate-last' | 'skip-first'
export interface EchoLevel { seed: string; source: number[]; answer: number[]; transform: EchoTransform; label: string }

export const ECHO_FIXED_LEVELS: EchoLevel[] = [
  { seed: 'echo-1', source: [0, 1, 2], answer: [2, 1, 0], transform: 'reverse', label: 'The echo returns backward.' },
  { seed: 'echo-2', source: [0, 2, 1, 3], answer: [2, 1, 3, 0], transform: 'rotate', label: 'The first fruit moves to the end.' },
  { seed: 'echo-3', source: [0, 1, 2], answer: [0, 1, 2, 2, 1, 0], transform: 'mirror', label: 'The branch reflects itself.' },
  { seed: 'echo-4', source: [0, 1, 3, 2], answer: [3, 2, 0, 1], transform: 'invert', label: 'Every color becomes its opposite.' },
  { seed: 'echo-5', source: [1, 3, 0], answer: [1, 3, 0, 0], transform: 'duplicate-last', label: 'The final note lingers twice.' },
  { seed: 'echo-6', source: [2, 0, 3, 1], answer: [0, 3, 1], transform: 'skip-first', label: 'The earliest memory disappears.' }
]

export function applyEchoTransform(source: number[], transform: EchoTransform) {
  if (transform === 'reverse') return [...source].reverse()
  if (transform === 'rotate') return [...source.slice(1), source[0]]
  if (transform === 'mirror') return [...source, ...source.slice().reverse()]
  if (transform === 'invert') return source.map((value) => 3 - value)
  if (transform === 'duplicate-last') return [...source, source.at(-1) ?? 0]
  return source.slice(1)
}

export function generateEchoLevel(seed: string, difficulty: Difficulty = 'standard'): EchoLevel {
  const random = createSeededRandom(seed)
  const transforms: EchoTransform[] = difficulty === 'easy' ? ['reverse', 'rotate'] : difficulty === 'hard' ? ['mirror', 'invert', 'duplicate-last', 'skip-first'] : ['reverse', 'rotate', 'invert', 'duplicate-last']
  const transform = transforms[Math.floor(random() * transforms.length)]
  const length = difficulty === 'hard' ? 5 : difficulty === 'easy' ? 3 : 4
  const source = Array.from({ length }, () => Math.floor(random() * 4))
  return { seed, source, transform, answer: applyEchoTransform(source, transform), label: 'A generated transformation is active.' }
}

export function isEchoSolved(input: number[], level: EchoLevel) {
  return input.length === level.answer.length && input.every((value, index) => value === level.answer[index])
}

export function getEchoHint(input: number[], level: EchoLevel) {
  const index = input.findIndex((value, position) => value !== level.answer[position])
  const nextIndex = index === -1 ? input.length : index
  return nextIndex < level.answer.length ? { index: nextIndex, value: level.answer[nextIndex] } : null
}
