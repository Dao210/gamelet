'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useFibonacciGameStore } from '@/lib/fibonacci-game-store'
import FibonacciGameBoard from '@/components/fibonacci/FibonacciGameBoard'
import FibonacciScore from '@/components/fibonacci/FibonacciScore'
import FibonacciControls from '@/components/fibonacci/FibonacciControls'
import FibonacciGameOver from '@/components/fibonacci/FibonacciGameOver'

export default function FibonacciGameClient() {
  const { gameState, startNewGame } = useFibonacciGameStore()
  
  // Initialize game on mount
  useEffect(() => {
    if (!gameState) {
      startNewGame()
    }
  }, [gameState, startNewGame])
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState || gameState.over) return

      const { move } = useFibonacciGameStore.getState()

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          move('up')
          break
        case 'ArrowDown':
          e.preventDefault()
          move('down')
          break
        case 'ArrowLeft':
          e.preventDefault()
          move('left')
          break
        case 'ArrowRight':
          e.preventDefault()
          move('right')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, gameState?.over])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/20 dark:bg-amber-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
            Fibonacci 2584
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Join Fibonacci numbers to reach 2584!
          </p>
        </motion.div>
        
        {/* Score Board */}
        <FibonacciScore />
        
        {/* Game Board */}
        <motion.div
          className="max-w-sm mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <FibonacciGameBoard />
          </div>
        </motion.div>
        
        {/* Controls */}
        <FibonacciControls />
        
        {/* Game Over Modal */}
        <FibonacciGameOver />
        
        {/* Instructions */}
        <motion.div
          className="max-w-sm mx-auto mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
            <h2 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-4">
              How to Play
            </h2>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔢</span>
                <div>
                  <strong>Fibonacci Sequence:</strong>
                  <p className="text-xs mt-1">1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⬆️</span>
                <div>
                  <strong>Swipe or Arrow Keys:</strong>
                  <p className="text-xs mt-1">Use arrow keys or swipe to move tiles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔀</span>
                <div>
                  <strong>Merge Rule:</strong>
                  <p className="text-xs mt-1">Adjacent same Fibonacci numbers merge (1+1=2, 2+3=5, etc.)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <strong>Goal:</strong>
                  <p className="text-xs mt-1">Reach 2584 to win!</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}