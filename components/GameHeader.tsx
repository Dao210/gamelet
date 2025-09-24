'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../lib/store'
import { GameMode } from '../lib/game-engine'

interface GameHeaderProps {
  className?: string
}

export default function GameHeader({ className = '' }: GameHeaderProps) {
  const { gameState, stats, startNewGame } = useGameStore()
  
  const getModeDisplayName = (mode: GameMode): string => {
    switch (mode) {
      case 'classic':
        return 'Classic Nerdle'
      case 'mini':
        return 'Mini Nerdle'
      case 'expert':
        return 'Expert Nerdle'
      default:
        return 'Nerdle'
    }
  }
  
  const getStatusMessage = (): string => {
    if (!gameState) return 'Start a new game!'
    
    switch (gameState.status) {
      case 'won':
        return `🎉 Congratulations! You solved it in ${gameState.attempts.length} attempts!`
      case 'lost':
        return `😔 Game over! The answer was: ${gameState.target}`
      case 'playing':
        return `Attempt ${gameState.attempts.length + 1} of ${gameState.maxAttempts}`
      default:
        return 'Start a new game!'
    }
  }
  
  return (
    <div className={`text-center ${className}`}>
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {gameState ? getModeDisplayName(gameState.mode) : 'Nerdle'}
      </motion.h1>
      
      <motion.p 
        className="text-lg text-gray-600 dark:text-gray-300 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {getStatusMessage()}
      </motion.p>
      
      {gameState && (
        <motion.div 
          className="flex justify-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current Streak
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.bestStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Best Streak
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(stats.averageAttempts * 10) / 10}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Attempts
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        className="flex justify-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {(['classic', 'mini', 'expert'] as GameMode[]).map((mode) => (
          <motion.button
            key={mode}
            className={`
              px-4 py-2 rounded-lg font-semibold transition-colors duration-200
              ${gameState?.mode === mode
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }
            `}
            onClick={() => startNewGame(mode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
