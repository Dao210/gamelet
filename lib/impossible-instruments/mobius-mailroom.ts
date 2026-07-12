import { createSeededRandom, type Difficulty } from './core'

export interface MobiusState { position: number; side: 0 | 1; direction: -1 | 1 }
export interface MobiusLevel { seed: string; length: number; target: { position: number; side: 0 | 1 }; switches: boolean[]; initial: boolean[]; maxSteps: number }
export interface MobiusTrace { states: MobiusState[]; delivered: boolean; loop: boolean }

export function traceMobius(level: MobiusLevel, switches = level.initial): MobiusTrace {
  let state: MobiusState = { position: 0, side: 0, direction: 1 }
  const states = [state]
  const seen = new Set<string>()
  for (let step = 0; step < level.maxSteps; step += 1) {
    if (step > 0 && state.position === level.target.position && state.side === level.target.side) return { states, delivered: true, loop: false }
    const key = `${state.position}:${state.side}:${state.direction}:${switches[state.position] ? 1 : 0}`
    if (seen.has(key)) return { states, delivered: false, loop: true }
    seen.add(key)
    let direction = switches[state.position] ? (state.direction * -1) as -1 | 1 : state.direction
    let position = state.position + direction
    let side = state.side
    if (position >= level.length) { position = level.length - 1; side = (1 - side) as 0 | 1; direction = -1 }
    else if (position < 0) { position = 0; side = (1 - side) as 0 | 1; direction = 1 }
    state = { position, side, direction }; states.push(state)
  }
  return { states, delivered: false, loop: false }
}

export function toggleMobiusSwitch(switches: boolean[], index: number) {
  return switches.map((value, position) => position === index ? !value : value)
}

export function generateMobiusLevel(seed: string, difficulty: Difficulty = 'standard'): MobiusLevel {
  const random = createSeededRandom(seed)
  const length = difficulty === 'easy' ? 5 : difficulty === 'hard' ? 8 : 6
  const switches = Array.from({ length }, () => random() > 0.65)
  const provisional: MobiusLevel = { seed, length, switches, initial: Array(length).fill(false), target: { position: length - 2, side: 1 }, maxSteps: length * 8 }
  const trace = traceMobius(provisional, switches)
  const candidate = trace.states[Math.max(2, Math.min(trace.states.length - 1, Math.floor(trace.states.length * 0.7)))]
  provisional.target = { position: candidate.position, side: candidate.side }
  provisional.initial = switches.map((value, index) => index % 2 === 0 ? !value : value)
  if (traceMobius(provisional, provisional.initial).delivered) provisional.initial = switches.map((value) => !value)
  return provisional
}

export const MOBIUS_FIXED_LEVELS = Array.from({ length: 6 }, (_, index) => generateMobiusLevel(`mobius-fixed-${index + 1}`, index < 2 ? 'easy' : index > 4 ? 'hard' : 'standard'))

export function findMobiusSolution(level: MobiusLevel) {
  const combinations = 2 ** level.length
  for (let mask = 0; mask < combinations; mask += 1) {
    const switches = Array.from({ length: level.length }, (_, index) => Boolean(mask & (1 << index)))
    if (traceMobius(level, switches).delivered) return switches
  }
  return null
}
