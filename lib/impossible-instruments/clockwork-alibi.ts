import { createSeededRandom, shuffled, type Difficulty } from './core'

export interface AlibiEvent { id: string; label: string }
export interface AlibiConstraint { before: string; after: string; label: string }
export interface AlibiLevel { seed: string; events: AlibiEvent[]; initial: string[]; solution: string[]; constraints: AlibiConstraint[] }

const EVENT_LABELS = ['The bell rang', 'The key vanished', 'The lamp failed', 'The curator arrived', 'The door opened', 'The camera stopped', 'The parcel moved']

export function isAlibiSolved(order: string[], level: AlibiLevel) {
  const index = new Map(order.map((id, position) => [id, position]))
  return level.constraints.every((constraint) => (index.get(constraint.before) ?? Infinity) < (index.get(constraint.after) ?? -1))
}

export function violatedAlibis(order: string[], level: AlibiLevel) {
  const index = new Map(order.map((id, position) => [id, position]))
  return level.constraints.filter((constraint) => (index.get(constraint.before) ?? Infinity) >= (index.get(constraint.after) ?? -1))
}

export function moveAlibiEvent(order: string[], from: number, to: number) {
  const next = [...order]
  const [event] = next.splice(from, 1)
  next.splice(to, 0, event)
  return next
}

export function generateAlibiLevel(seed: string, difficulty: Difficulty = 'standard'): AlibiLevel {
  const random = createSeededRandom(seed)
  const count = difficulty === 'easy' ? 4 : difficulty === 'hard' ? 7 : 5
  const events = EVENT_LABELS.slice(0, count).map((label, index) => ({ id: `e${index}`, label }))
  const solution = shuffled(events.map((event) => event.id), random)
  const constraints: AlibiConstraint[] = []
  for (let index = 0; index < solution.length - 1; index += 1) {
    const before = solution[index]
    const after = solution[index + 1]
    constraints.push({ before, after, label: `${events.find((event) => event.id === before)!.label} happened before ${events.find((event) => event.id === after)!.label}.` })
  }
  if (difficulty === 'hard') constraints.push({ before: solution[0], after: solution[solution.length - 2], label: `${events.find((event) => event.id === solution[0])!.label} preceded the penultimate event.` })
  let initial = shuffled(solution, random)
  if (initial.every((id, index) => id === solution[index])) initial = [...solution].reverse()
  return { seed, events, initial, solution, constraints }
}

export const ALIBI_FIXED_LEVELS = Array.from({ length: 6 }, (_, index) => generateAlibiLevel(`alibi-fixed-${index + 1}`, index < 2 ? 'easy' : index > 4 ? 'hard' : 'standard'))

export function getAlibiHint(order: string[], level: AlibiLevel) {
  const violation = violatedAlibis(order, level)[0]
  if (!violation) return null
  return { eventId: violation.before, beforeId: violation.after }
}
