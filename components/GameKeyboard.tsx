'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../lib/store'
import { isValidChar } from '../lib/game-engine'

interface GameKeyboardProps {
  className?: string
}

export default function GameKeyboard({ className = '' }: GameKeyboardProps) {
  const { gameState, currentAttempt, addCharToAttempt, removeCharFromAttempt, submitAttempt } = useGameStore()
  
  if (!gameState) return null
  
  const equationLength = gameState.mode === 'classic' ? 8 : 
                        gameState.mode === 'mini' ? 6 : 10
  
  const canSubmit = currentAttempt.length === equationLength && gameState.status === 'playing'
  
  const handleKeyPress = (char: string) => {
    if (gameState.status !== 'playing') return
    if (currentAttempt.length >= equationLength) return
    if (!isValidChar(char)) return
    
    addCharToAttempt(char)
  }
  
  const handleBackspace = () => {
    if (currentAttempt.length > 0) {
      removeCharFromAttempt()
    }
  }
  
  const handleSubmit = () => {
    if (canSubmit) {
      submitAttempt()
    }
  }
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && canSubmit) {
      handleSubmit()
    } else if (event.key === 'Backspace') {
      event.preventDefault()
      handleBackspace()
    } else if (isValidChar(event.key)) {
      handleKeyPress(event.key)
    }
  }
  
  const keyboardRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['+', '-', '*', '/', '=']
  ]
  
  return (
    <div 
      className={`flex flex-col gap-2 ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 justify-center">
          {row.map((key) => (
            <motion.button
              key={key}
              className="
                px-3 py-2 md:px-4 md:py-3
                bg-gray-200 hover:bg-gray-300
                dark:bg-gray-700 dark:hover:bg-gray-600
                text-gray-900 dark:text-white
                font-semibold text-lg md:text-xl
                rounded-lg
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              onClick={() => handleKeyPress(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={gameState.status !== 'playing'}
            >
              {key}
            </motion.button>
          ))}
        </div>
      ))}
      
      <div className="flex gap-2 justify-center mt-2">
        <motion.button
          className="
            px-6 py-3 md:px-8 md:py-4
            bg-gray-500 hover:bg-gray-600
            text-white font-semibold text-lg
            rounded-lg
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
          onClick={handleBackspace}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={gameState.status !== 'playing' || currentAttempt.length === 0}
        >
          ⌫
        </motion.button>
        
        <motion.button
          className={`
            px-6 py-3 md:px-8 md:py-4
            font-semibold text-lg
            rounded-lg
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${canSubmit 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
          onClick={handleSubmit}
          whileHover={canSubmit ? { scale: 1.05 } : {}}
          whileTap={canSubmit ? { scale: 0.95 } : {}}
          disabled={!canSubmit}
        >
          Enter
        </motion.button>
      </div>
    </div>
  )
}
