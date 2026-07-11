'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../lib/store'
import { isValidChar } from '../lib/game-engine'
import { useTranslations } from 'next-intl'

interface GameKeyboardProps {
  className?: string
}

export default function GameKeyboard({ className = '' }: GameKeyboardProps) {
  const t = useTranslations('gameKeyboard')
  const { gameState, currentAttempt, addCharToAttempt, removeCharFromAttempt, submitAttempt } = useGameStore()
  const keyboardRef = useRef<HTMLDivElement>(null)
  const [pressedKey, setPressedKey] = useState<string | null>(null)

  const equationLength = gameState?.mode === 'classic' ? 8 :
                        gameState?.mode === 'mini' ? 6 : 10
  const canSubmit = gameState?.status === 'playing' && currentAttempt.length === equationLength

  const handleKeyPress = React.useCallback((char: string) => {
    if (gameState?.status !== 'playing') return
    if (currentAttempt.length >= equationLength) return
    if (!isValidChar(char)) return

    // Show visual feedback with RAF for better performance
    setPressedKey(char)
    requestAnimationFrame(() => {
      setTimeout(() => setPressedKey(null), 50)
    })

    addCharToAttempt(char)
  }, [gameState?.status, currentAttempt.length, equationLength, addCharToAttempt])

  const handleBackspace = React.useCallback(() => {
    if (currentAttempt.length > 0) {
      // Show visual feedback with RAF for better performance
      setPressedKey('Backspace')
      requestAnimationFrame(() => {
        setTimeout(() => setPressedKey(null), 50)
      })

      removeCharFromAttempt()
    }
  }, [currentAttempt.length, removeCharFromAttempt])

  const handleSubmit = React.useCallback(() => {
    if (canSubmit) {
      // Show visual feedback with RAF for better performance
      setPressedKey('Enter')
      requestAnimationFrame(() => {
        setTimeout(() => setPressedKey(null), 50)
      })

      submitAttempt()
    }
  }, [canSubmit, submitAttempt])

  // Simple keyboard event handler
  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    const key = event.key

    if (key === 'Enter' && canSubmit) {
      event.preventDefault()
      handleSubmit()
    } else if (key === 'Backspace') {
      event.preventDefault()
      handleBackspace()
    } else if (isValidChar(key)) {
      handleKeyPress(key)
    }
  }, [canSubmit, handleKeyPress, handleBackspace, handleSubmit])

  // Auto-focus on mount
  useEffect(() => {
    if (keyboardRef.current && gameState?.status === 'playing') {
      keyboardRef.current.focus()
    }
  }, [gameState?.status])

  // Early return if no game state - but AFTER all hooks are called
  if (!gameState) return null
  
  const keyboardRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['+', '-', '*', '/', '=']
  ]
  
  return (
    <div
      ref={keyboardRef}
      data-keyboard-container
      data-game-area
      role="application"
      aria-label={t('ariaKeyboard')}
      className={`
        flex flex-col gap-2 select-none
        outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg
        ${className}
      `}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 justify-center">
          {row.map((key) => (
            <motion.button
              key={key}
              data-key={key}
              type="button"
              className={`
                px-3 py-2 md:px-4 md:py-3
                font-bold text-lg md:text-xl
                rounded-xl
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                ${pressedKey === key
                  ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white scale-95 shadow-lg'
                  : gameState?.status !== 'playing'
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-900 dark:text-white shadow-md hover:shadow-lg hover:scale-105'
                }
              `}
              style={{
                WebkitTapHighlightColor: 'transparent'
              }}
              onClick={() => handleKeyPress(key)}
              disabled={gameState?.status !== 'playing'}
              whileHover={{ scale: gameState?.status === 'playing' ? 1.05 : 1 }}
              whileTap={{ scale: gameState?.status === 'playing' ? 0.95 : 1 }}
              aria-label={t('+-*/='.includes(key) ? 'ariaEnterOperator' : 'ariaEnterNumber', { key })}
              aria-disabled={gameState?.status !== 'playing'}
            >
              {key}
            </motion.button>
          ))}
        </div>
      ))}

      <div className="flex gap-2 justify-center mt-2">
        <motion.button
          data-key="Backspace"
          type="button"
          className={`
            px-6 py-3 md:px-8 md:py-4
            font-bold text-lg
            rounded-xl
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1
            ${pressedKey === 'Backspace'
              ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white scale-95 shadow-lg'
              : gameState?.status !== 'playing' || currentAttempt.length === 0
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-600 dark:to-gray-800 hover:from-orange-500 hover:to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
            }
          `}
          style={{
            WebkitTapHighlightColor: 'transparent'
          }}
          onClick={handleBackspace}
          disabled={gameState?.status !== 'playing' || currentAttempt.length === 0}
          whileHover={{ scale: (gameState?.status === 'playing' && currentAttempt.length > 0) ? 1.05 : 1 }}
          whileTap={{ scale: (gameState?.status === 'playing' && currentAttempt.length > 0) ? 0.95 : 1 }}
          aria-label={t('ariaBackspace')}
          aria-disabled={gameState?.status !== 'playing' || currentAttempt.length === 0}
        >
          ⌫
        </motion.button>

        <motion.button
          data-key="Enter"
          type="button"
          className={`
            px-6 py-3 md:px-8 md:py-4
            font-bold text-lg
            rounded-xl
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
            ${pressedKey === 'Enter'
              ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white scale-95 shadow-lg'
              : canSubmit
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600 cursor-not-allowed opacity-50'
            }
          `}
          style={{
            WebkitTapHighlightColor: 'transparent'
          }}
          onClick={handleSubmit}
          disabled={!canSubmit}
          whileHover={{ scale: canSubmit ? 1.05 : 1 }}
          whileTap={{ scale: canSubmit ? 0.95 : 1 }}
          aria-label={t(canSubmit ? 'ariaSubmitEnabled' : 'ariaSubmitDisabled')}
          aria-disabled={!canSubmit}
        >
          {t('enter')}
        </motion.button>
      </div>
    </div>
  )
}
