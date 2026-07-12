import { createSeededRandom, shuffled, type Difficulty } from './core'

export type FossilColor = 'amber' | 'blue' | 'red'
export type FossilShape = 'circle' | 'triangle' | 'square'
export interface FossilSpecimen { color: FossilColor; shape: FossilShape; count: number }
export type FossilRuleId = 'blue-only' | 'even-count' | 'triangle-pair' | 'amber-odd' | 'not-square' | 'red-single'
export interface FossilRule { id: FossilRuleId; label: string; test: (sample: FossilSpecimen) => boolean }
export interface FossilLevel { seed: string; ruleId: FossilRuleId; examples: Array<FossilSpecimen & { accepted: boolean }>; candidates: FossilRuleId[] }

export const FOSSIL_RULES: Record<FossilRuleId, FossilRule> = {
  'blue-only': { id: 'blue-only', label: 'The specimen is blue.', test: (s) => s.color === 'blue' },
  'even-count': { id: 'even-count', label: 'The specimen count is even.', test: (s) => s.count % 2 === 0 },
  'triangle-pair': { id: 'triangle-pair', label: 'There are exactly two triangles.', test: (s) => s.shape === 'triangle' && s.count === 2 },
  'amber-odd': { id: 'amber-odd', label: 'Amber specimens need an odd count.', test: (s) => s.color === 'amber' && s.count % 2 === 1 },
  'not-square': { id: 'not-square', label: 'Squares are rejected.', test: (s) => s.shape !== 'square' },
  'red-single': { id: 'red-single', label: 'A single red specimen is accepted.', test: (s) => s.color === 'red' && s.count === 1 }
}

const ALL_RULE_IDS = Object.keys(FOSSIL_RULES) as FossilRuleId[]
const COLORS: FossilColor[] = ['amber', 'blue', 'red']
const SHAPES: FossilShape[] = ['circle', 'triangle', 'square']

export function evaluateFossil(ruleId: FossilRuleId, sample: FossilSpecimen) {
  return FOSSIL_RULES[ruleId].test(sample)
}

export function generateRuleFossilLevel(seed: string, difficulty: Difficulty = 'standard'): FossilLevel {
  const random = createSeededRandom(seed)
  const pool = difficulty === 'easy' ? ALL_RULE_IDS.slice(0, 3) : ALL_RULE_IDS
  const ruleId = pool[Math.floor(random() * pool.length)]
  const examples: FossilLevel['examples'] = []
  let attempts = 0
  while (examples.length < (difficulty === 'hard' ? 4 : 6) && attempts < 100) {
    attempts += 1
    const sample: FossilSpecimen = { color: COLORS[Math.floor(random() * 3)], shape: SHAPES[Math.floor(random() * 3)], count: 1 + Math.floor(random() * 4) }
    const accepted = evaluateFossil(ruleId, sample)
    if (!examples.some((item) => item.color === sample.color && item.shape === sample.shape && item.count === sample.count)) examples.push({ ...sample, accepted })
  }
  const alternatives = shuffled(ALL_RULE_IDS.filter((id) => id !== ruleId), random).slice(0, 3)
  return { seed, ruleId, examples, candidates: shuffled([ruleId, ...alternatives], random) }
}

export const RULE_FOSSIL_FIXED_LEVELS = Array.from({ length: 6 }, (_, index) => generateRuleFossilLevel(`fossil-fixed-${index + 1}`, index < 2 ? 'easy' : index > 4 ? 'hard' : 'standard'))

export function discriminateFossilRules(samples: FossilLevel['examples'], candidates: FossilRuleId[]) {
  return candidates.filter((id) => samples.every((sample) => evaluateFossil(id, sample) === sample.accepted))
}
