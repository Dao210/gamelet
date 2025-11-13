'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../lib/store'
import { generateFeedback, TileState } from '../lib/game-engine'

interface GameBoardProps {
  className?: string
}

export default function GameBoard({ className = '' }: GameBoardProps) {
  const { gameState, currentAttempt } = useGameStore()
  
  if (!gameState) return null
  
  const maxAttempts = gameState.mode === 'classic' ? 6 : 
                     gameState.mode === 'mini' ? 6 : 6
  const equationLength = gameState.mode === 'classic' ? 8 : 
                        gameState.mode === 'mini' ? 6 : 10
  
  const getTileState = (row: number, col: number): TileState => {
    if (row < gameState.attempts.length) {
      const feedback = generateFeedback(gameState.attempts[row], gameState.target)
      return feedback.tiles[col]?.state || 'empty'
    }
    
    if (row === gameState.attempts.length && col < currentAttempt.length) {
      return 'empty'
    }
    
    return 'empty'
  }
  
  const getTileContent = (row: number, col: number): string => {
    if (row < gameState.attempts.length) {
      return gameState.attempts[row][col] || ''
    }
    
    if (row === gameState.attempts.length && col < currentAttempt.length) {
      return currentAttempt[col]
    }
    
    return ''
  }
  
  const getTileColor = (state: TileState): string => {
    switch (state) {
      case 'correct':
        return 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50'
      case 'present':
        return 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/50'
      case 'absent':
        return 'bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-md'
      default:
        return 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white shadow-md hover:border-blue-400/50 dark:hover:border-purple-400/50'
    }
  }

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {Array.from({ length: maxAttempts }, (_, row) => (
        <div key={row} className="flex gap-2.5 justify-center">
          {Array.from({ length: equationLength }, (_, col) => {
            const state = getTileState(row, col)
            const content = getTileContent(row, col)
            const isActive = row === gameState.attempts.length && col === currentAttempt.length

            return (
              <motion.div
                key={`${row}-${col}`}
                className={`
                  w-12 h-12 md:w-14 md:h-14
                  flex items-center justify-center
                  text-xl md:text-2xl font-bold
                  rounded-xl
                  ${getTileColor(state)}
                  ${isActive ? 'ring-2 ring-blue-500 dark:ring-purple-500 ring-offset-2' : ''}
                  transition-all duration-300
                `}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: col * 0.05,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {content}
              </motion.div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
