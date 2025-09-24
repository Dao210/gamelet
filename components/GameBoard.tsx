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
        return 'bg-green-500 text-white'
      case 'present':
        return 'bg-yellow-500 text-white'
      case 'absent':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-white border-2 border-gray-300 text-gray-900'
    }
  }
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: maxAttempts }, (_, row) => (
        <div key={row} className="flex gap-2 justify-center">
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
                  rounded-lg
                  ${getTileColor(state)}
                  ${isActive ? 'ring-2 ring-blue-500' : ''}
                  transition-all duration-200
                `}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: col * 0.1 }}
                whileHover={{ scale: 1.05 }}
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
