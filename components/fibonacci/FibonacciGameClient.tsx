'use client'

import { useEffect } from 'react'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { useFibonacciGameStore } from '@/lib/fibonacci-game-store'
import FibonacciGameBoard from '@/components/fibonacci/FibonacciGameBoard'
import FibonacciScore from '@/components/fibonacci/FibonacciScore'
import FibonacciControls from '@/components/fibonacci/FibonacciControls'
import FibonacciGameOver from '@/components/fibonacci/FibonacciGameOver'
import { fibonacciCopy } from '@/components/fibonacci/fibonacci-copy'

export default function FibonacciGameClient() {
  const { gameState, startNewGame } = useFibonacciGameStore()
  const locale = useLocale()
  const copy = locale === 'zh' ? fibonacciCopy.zh : fibonacciCopy.en
  
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
    <div className="relative min-h-screen overflow-hidden bg-[#f7f1e5] text-stone-900 dark:bg-[#17130f] dark:text-stone-100">
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
      
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <motion.div
          className="mx-auto mb-7 max-w-xl text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-amber-700 dark:text-amber-400">{copy.eyebrow}</p>
          <h1 className="mb-3 text-4xl font-black tracking-tight text-stone-900 dark:text-stone-50 md:text-6xl">
            {copy.title}
          </h1>
          <p className="text-sm leading-6 text-stone-600 dark:text-stone-300 sm:text-base">
            {copy.subtitle}
          </p>
        </motion.div>
        
        {/* Score Board */}
        <FibonacciScore copy={copy} />
        
        {/* Game Board */}
        <motion.div
          className="mx-auto w-full max-w-[420px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <FibonacciGameBoard copy={copy} />
          </div>
        </motion.div>
        
        {/* Controls */}
        <FibonacciControls copy={copy} />
        
        {/* Game Over Modal */}
        <FibonacciGameOver copy={copy} />
        
        {/* Instructions */}
        <motion.div
          className="mx-auto mt-10 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="rounded-[2rem] border border-stone-200/80 bg-white/65 p-6 shadow-[0_20px_70px_-45px_rgba(78,46,13,.55)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-8">
            <h2 className="mb-5 text-lg font-black text-stone-900 dark:text-stone-100">
              {copy.howToPlay}
            </h2>
            <div className="grid gap-4 text-sm text-stone-700 dark:text-stone-300 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔢</span>
                <div>
                  <strong>{copy.sequence}</strong><p className="mt-1 text-xs leading-5">{copy.sequenceDetail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⬆️</span>
                <div>
                  <strong>{copy.move}</strong><p className="mt-1 text-xs leading-5">{copy.moveDetail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔀</span>
                <div>
                  <strong>{copy.merge}</strong><p className="mt-1 text-xs leading-5">{copy.mergeDetail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <strong>{copy.goal}</strong><p className="mt-1 text-xs leading-5">{copy.goalDetail}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
