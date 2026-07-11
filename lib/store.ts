import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameState, GameMode, initializeGame, makeAttempt } from './game-engine'
import { trackGameStart, trackGameCompletion, trackModeSwitch } from './analytics'

interface GameStore {
  // Game state
  gameState: GameState | null
  currentAttempt: string
  
  // Game actions
  startNewGame: (mode: GameMode) => void
  addCharToAttempt: (char: string) => void
  removeCharFromAttempt: () => void
  submitAttempt: () => void
  
  // Statistics
  stats: {
    gamesPlayed: number
    gamesWon: number
    currentStreak: number
    bestStreak: number
    averageAttempts: number
    modeStats: Record<GameMode, {
      gamesPlayed: number
      gamesWon: number
      averageAttempts: number
    }>
  }
  
  // Settings
  settings: {
    theme: 'light' | 'dark' | 'auto'
    soundEnabled: boolean
    animationsEnabled: boolean
    colorBlindMode: boolean
  }
  
  // Actions
  updateSettings: (settings: Partial<GameStore['settings']>) => void
  resetStats: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: null,
      currentAttempt: '',
      
      stats: {
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
      },
      
      settings: {
        theme: 'auto',
        soundEnabled: true,
        animationsEnabled: true,
        colorBlindMode: false
      },
      
      // Game actions
      startNewGame: (mode: GameMode) => {
        const { gameState: currentGameState } = get()
        
        // Track mode switch if changing modes
        if (currentGameState && currentGameState.mode !== mode) {
          trackModeSwitch(currentGameState.mode, mode)
        }
        
        const gameState = initializeGame(mode)
        set({ 
          gameState,
          currentAttempt: ''
        })
        
        // Track game start
        trackGameStart(mode)
      },
      
      addCharToAttempt: (char: string) => {
        const { gameState, currentAttempt } = get()
        if (!gameState || gameState.status !== 'playing') return
        
        const maxLength = gameState.mode === 'classic' ? 8 : 
                         gameState.mode === 'mini' ? 6 : 10
        
        if (currentAttempt.length < maxLength) {
          set({ currentAttempt: currentAttempt + char })
        }
      },
      
      removeCharFromAttempt: () => {
        const { currentAttempt } = get()
        set({ currentAttempt: currentAttempt.slice(0, -1) })
      },
      
      submitAttempt: () => {
        const { gameState, currentAttempt, stats } = get()
        if (!gameState || gameState.status !== 'playing') return
        
        const newGameState = makeAttempt(gameState, currentAttempt)
        const acceptedAttempt = newGameState.attempts.length > gameState.attempts.length
        if (!acceptedAttempt) return
        
        const finishedGame = newGameState.status !== 'playing'
        let newStats = stats
        
        if (finishedGame) {
          const previousGamesPlayed = stats.gamesPlayed
          const previousModeGamesPlayed = stats.modeStats[gameState.mode].gamesPlayed
          const modeStats = stats.modeStats[gameState.mode]
          const attempts = newGameState.attempts.length

          newStats = {
            ...stats,
            gamesPlayed: previousGamesPlayed + 1,
            modeStats: {
              ...stats.modeStats,
              [gameState.mode]: {
                ...modeStats,
                gamesPlayed: previousModeGamesPlayed + 1
              }
            }
          }

          if (newGameState.status === 'won') {
            const currentStreak = stats.currentStreak + 1
            newStats = {
              ...newStats,
              gamesWon: stats.gamesWon + 1,
              currentStreak,
              bestStreak: Math.max(stats.bestStreak, currentStreak),
              modeStats: {
                ...newStats.modeStats,
                [gameState.mode]: {
                  ...newStats.modeStats[gameState.mode],
                  gamesWon: modeStats.gamesWon + 1
                }
              }
            }
          } else {
            newStats = {
              ...newStats,
              currentStreak: 0
            }
          }

          newStats = {
            ...newStats,
            averageAttempts:
              (stats.averageAttempts * previousGamesPlayed + attempts) / newStats.gamesPlayed,
            modeStats: {
              ...newStats.modeStats,
              [gameState.mode]: {
                ...newStats.modeStats[gameState.mode],
                averageAttempts:
                  (modeStats.averageAttempts * previousModeGamesPlayed + attempts) /
                  newStats.modeStats[gameState.mode].gamesPlayed
              }
            }
          }

          const duration = newGameState.endTime 
            ? Math.floor((newGameState.endTime.getTime() - newGameState.startTime.getTime()) / 1000)
            : undefined
          
          if (newGameState.status === 'won' || newGameState.status === 'lost') {
            trackGameCompletion(
              gameState.mode,
              newGameState.attempts.length,
              newGameState.status,
              duration
            )
          }
        }
        
        set({ 
          gameState: newGameState,
          currentAttempt: '',
          stats: newStats
        })
      },
      
      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }))
      },
      
      resetStats: () => {
        set({
          stats: {
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
          }
        })
      }
    }),
    {
      name: 'nerdle-game-storage',
      partialize: (state) => ({
        stats: state.stats,
        settings: state.settings
      })
    }
  )
)
