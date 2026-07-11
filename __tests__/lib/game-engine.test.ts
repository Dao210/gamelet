import {
  evaluateExpression,
  generateFeedback,
  initializeGame,
  isValidEquation,
  makeAttempt,
  type GameState
} from '../../lib/game-engine'

describe('game-engine', () => {
  it('evaluates expressions with precedence and integer-only division', () => {
    expect(evaluateExpression('2+3*4')).toBe(14)
    expect(evaluateExpression('18/3+2')).toBe(8)
    expect(() => evaluateExpression('5/2')).toThrow('Non-integer division')
  })

  it('validates equations using the same rules as submission', () => {
    expect(isValidEquation('12+34=46')).toBe(true)
    expect(isValidEquation('10-10=0')).toBe(false)
    expect(isValidEquation('12+34=40+6')).toBe(false)
    expect(isValidEquation('02+3=5')).toBe(false)
  })

  it('keeps game state unchanged for invalid attempts', () => {
    const state: GameState = {
      ...initializeGame('classic'),
      target: '12+34=46'
    }

    const result = makeAttempt(state, '12+34=99')

    expect(result).toBe(state)
    expect(result.attempts).toHaveLength(0)
  })

  it('records valid attempts and ends the game on a correct answer', () => {
    const state: GameState = {
      ...initializeGame('classic'),
      target: '12+34=46'
    }

    const result = makeAttempt(state, '12+34=46')

    expect(result.status).toBe('won')
    expect(result.attempts).toEqual(['12+34=46'])
    expect(result.endTime).toBeInstanceOf(Date)
  })

  it('handles duplicate feedback counts correctly', () => {
    const feedback = generateFeedback('11+22=33', '12+12=24')

    expect(feedback.tiles.map(tile => tile.state)).toEqual([
      'correct',
      'present',
      'correct',
      'present',
      'correct',
      'correct',
      'absent',
      'absent'
    ])
  })
})
