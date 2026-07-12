import { createSeededRandom, dailySeed, parseInstrumentProgress, shuffled, updateInstrumentProgress } from '@/lib/impossible-instruments/core'
import { applyEchoTransform, generateEchoLevel, isEchoSolved } from '@/lib/impossible-instruments/echo-orchard'
import { discriminateFossilRules, evaluateFossil, generateRuleFossilLevel } from '@/lib/impossible-instruments/rule-fossil'
import { generateAlibiLevel, isAlibiSolved, violatedAlibis } from '@/lib/impossible-instruments/clockwork-alibi'
import { generateShadowLevel, isShadowSolved } from '@/lib/impossible-instruments/shadow-cartographer'
import { findMobiusSolution, generateMobiusLevel, traceMobius } from '@/lib/impossible-instruments/mobius-mailroom'
import { applyGravityRule, generateGravityLevel, getGravityHint, isGravitySolved } from '@/lib/impossible-instruments/gravity-grammar'

describe('impossible instruments shared core', () => {
  it('produces deterministic random streams and shuffles', () => {
    const first = createSeededRandom('cabinet')
    const second = createSeededRandom('cabinet')
    expect(Array.from({ length: 5 }, first)).toEqual(Array.from({ length: 5 }, second))
    expect(shuffled([1, 2, 3, 4], createSeededRandom('x'))).toEqual(shuffled([1, 2, 3, 4], createSeededRandom('x')))
  })

  it('validates and updates versioned progress safely', () => {
    expect(parseInstrumentProgress('{broken')).toEqual({ version: 1, completed: {}, bestScores: {} })
    const next = updateInstrumentProgress(parseInstrumentProgress(null), 'echo-orchard', 2, 450)
    expect(next.completed['echo-orchard']).toBe(2)
    expect(next.bestScores['echo-orchard']).toBe(450)
  })

  it('creates stable daily seeds', () => {
    expect(dailySeed('rule-fossil', new Date('2026-07-12T12:00:00Z'))).toBe('rule-fossil:2026-7-12')
  })
})

describe('instrument generators', () => {
  it('generates 100 valid echo transformations', () => {
    for (let index = 0; index < 100; index += 1) {
      const level = generateEchoLevel(`echo-${index}`, 'hard')
      expect(level.answer).toEqual(applyEchoTransform(level.source, level.transform))
      expect(isEchoSolved(level.answer, level)).toBe(true)
    }
  })

  it('generates 100 internally consistent fossil experiments', () => {
    for (let index = 0; index < 100; index += 1) {
      const level = generateRuleFossilLevel(`fossil-${index}`, 'hard')
      expect(level.candidates).toContain(level.ruleId)
      expect(level.examples.every((sample) => evaluateFossil(level.ruleId, sample) === sample.accepted)).toBe(true)
      expect(discriminateFossilRules(level.examples, level.candidates)).toContain(level.ruleId)
    }
  })

  it('generates 100 alibis whose reference timelines satisfy every witness', () => {
    for (let index = 0; index < 100; index += 1) {
      const level = generateAlibiLevel(`alibi-${index}`, 'hard')
      expect(isAlibiSolved(level.solution, level)).toBe(true)
      expect(violatedAlibis(level.solution, level)).toHaveLength(0)
    }
  })

  it('generates 100 shadow maps solved by their reference bearing', () => {
    for (let index = 0; index < 100; index += 1) {
      const level = generateShadowLevel(`shadow-${index}`, 'hard')
      expect(isShadowSolved(level, level.targetDirection, level.blockers)).toBe(true)
    }
  })

  it('generates 100 Möbius routes with a verified switch solution', () => {
    for (let index = 0; index < 100; index += 1) {
      const level = generateMobiusLevel(`mobius-${index}`, 'hard')
      const solution = findMobiusSolution(level)
      expect(solution).not.toBeNull()
      expect(traceMobius(level, solution!).delivered).toBe(true)
    }
  })

  it('generates 100 gravity boards reachable by contextual hints', () => {
    for (let index = 0; index < 100; index += 1) {
      const level = generateGravityLevel(`gravity-${index}`, 'hard')
      let object = level.object
      for (let step = 0; step < level.size * 2 && !isGravitySolved(level, object); step += 1) {
        object = applyGravityRule(level, object, [object.color, 'PULLS', getGravityHint(level, object)])
      }
      expect(isGravitySolved(level, object)).toBe(true)
    }
  })
})
