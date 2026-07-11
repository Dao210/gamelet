import { PUZZLE_ARCADES, answerArcadeQuestion, createArcadeSession, getHintedOptions } from '@/lib/puzzle-arcade-engine'

describe('puzzle arcade engine', () => {
  it('provides six complete games with valid questions', () => {
    const games = Object.values(PUZZLE_ARCADES)
    expect(games).toHaveLength(6)
    games.forEach((game) => {
      expect(game.questions).toHaveLength(5)
      game.questions.forEach((question) => {
        expect(question.options[question.answer]).toBeDefined()
        expect(question.options).toHaveLength(4)
      })
    })
  })

  it('rewards correct streaks and applies the hint cost', () => {
    const question = PUZZLE_ARCADES['sequence-forge'].questions[0]
    const first = answerArcadeQuestion(createArcadeSession(), question, question.answer)
    const second = answerArcadeQuestion(first.session, question, question.answer)
    const hinted = answerArcadeQuestion(first.session, question, question.answer, true)
    expect(second.points).toBeGreaterThan(first.points)
    expect(hinted.points).toBe(second.points - 50)
  })

  it('consumes a life and breaks the streak after an incorrect answer', () => {
    const question = PUZZLE_ARCADES['pattern-loom'].questions[0]
    const result = answerArcadeQuestion({ ...createArcadeSession(), streak: 3 }, question, (question.answer + 1) % 4)
    expect(result.correct).toBe(false)
    expect(result.session.lives).toBe(2)
    expect(result.session.streak).toBe(0)
  })

  it('removes decoys without hiding the answer', () => {
    const question = PUZZLE_ARCADES['logic-switch'].questions[0]
    const hidden = getHintedOptions(question)
    expect(hidden).toHaveLength(2)
    expect(hidden).not.toContain(question.answer)
  })
})
