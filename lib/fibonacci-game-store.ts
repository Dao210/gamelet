import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  GameState,
  Direction,
  initializeGame,
  move as engineMove,
  getTileAt
} from './fibonacci-game-engine'
import type { Tile } from './fibonacci-game-engine'

interface FibonacciGameStore {
  // Game state
  gameState: GameState | null
  
  // Actions
  startNewGame: () => void
  move: (direction: Direction) => void
  continueAfterWin: () => void
  resetGame: () => void
  
  // Best score
  bestScore: number
}

export const useFibonacciGameStore = create<FibonacciGameStore>()(
  persist(
    (set, get) => ({
      gameState: null,
      bestScore: 0,
      
      startNewGame: () => {
        const { bestScore } = get()
        const gameState = initializeGame(bestScore)
        set({ gameState })
      },
      
      move: (direction: Direction) => {
        const { gameState } = get()
        if (!gameState) return
        
        const newState = engineMove(gameState, direction)
        set({ 
          gameState: newState,
          bestScore: Math.max(get().bestScore, newState.bestScore)
        })
      },
      
      continueAfterWin: () => {
        const { gameState } = get()
        if (!gameState || !gameState.won) return
        
        set({
          gameState: {
            ...gameState,
            won: false,
            canContinue: true,
            over: false
          }
        })
      },
      
      resetGame: () => {
        const { bestScore } = get()
        const gameState = initializeGame(bestScore)
        set({ gameState })
      }
    }),
    {
      name: 'fibonacci-2584-storage',
      partialize: (state) => ({
        bestScore: state.bestScore
      })
    }
  )
)