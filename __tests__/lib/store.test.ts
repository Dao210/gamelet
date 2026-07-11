import { useGameStore } from '../../lib/store'
import type { GameState } from '../../lib/game-engine'

jest.mock('../../lib/analytics', () => ({
  trackGameStart: jest.fn(),
  trackGameCompletion: jest.fn(),
  trackModeSwitch: jest.fn()
}))

const stats = () => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  averageAttempts: 0,
  modeStats: {
    classic: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
    mini: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
    expert: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 }
  }
})

const settings = {
  theme: 'auto' as const,
  soundEnabled: true,
  animationsEnabled: true,
  colorBlindMode: false
}

const classicGame = (): GameState => ({
  mode: 'classic',
  target: '12+34=46',
  attempts: [],
  currentAttempt: '',
  status: 'playing',
  maxAttempts: 6,
  startTime: new Date('2026-01-01T00:00:00.000Z')
})

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.setState({
      gameState: null,
      currentAttempt: '',
      stats: stats(),
      settings
    })
  })

  it('does not clear input or update stats for invalid submissions', () => {
    const gameState = classicGame()
    useGameStore.setState({
      gameState,
      currentAttempt: '12+34=99'
    })

    useGameStore.getState().submitAttempt()

    expect(useGameStore.getState().gameState).toBe(gameState)
    expect(useGameStore.getState().currentAttempt).toBe('12+34=99')
    expect(useGameStore.getState().stats.gamesPlayed).toBe(0)
  })

  it('does not count an in-progress valid attempt as a played game', () => {
    useGameStore.setState({
      gameState: classicGame(),
      currentAttempt: '23+45=68'
    })

    useGameStore.getState().submitAttempt()

    expect(useGameStore.getState().gameState?.attempts).toEqual(['23+45=68'])
    expect(useGameStore.getState().gameState?.status).toBe('playing')
    expect(useGameStore.getState().currentAttempt).toBe('')
    expect(useGameStore.getState().stats.gamesPlayed).toBe(0)
    expect(useGameStore.getState().stats.averageAttempts).toBe(0)
  })

  it('updates stats once when the game finishes', () => {
    useGameStore.setState({
      gameState: {
        ...classicGame(),
        attempts: ['23+45=68']
      },
      currentAttempt: '12+34=46'
    })

    useGameStore.getState().submitAttempt()

    const { gameState, stats: currentStats } = useGameStore.getState()
    expect(gameState?.status).toBe('won')
    expect(currentStats.gamesPlayed).toBe(1)
    expect(currentStats.gamesWon).toBe(1)
    expect(currentStats.currentStreak).toBe(1)
    expect(currentStats.bestStreak).toBe(1)
    expect(currentStats.averageAttempts).toBe(2)
    expect(currentStats.modeStats.classic.gamesPlayed).toBe(1)
    expect(currentStats.modeStats.classic.gamesWon).toBe(1)
    expect(currentStats.modeStats.classic.averageAttempts).toBe(2)
  })
})
