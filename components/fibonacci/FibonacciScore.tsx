'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useFibonacciGameStore } from '@/lib/fibonacci-game-store'

function FibonacciScoreInner() {
  const { gameState, bestScore } = useFibonacciGameStore()

  return (
    <div className="flex justify-center gap-4 mb-6">
      {/* Current Score */}
      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-amber-200 dark:border-amber-700"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
          Score
        </div>
        <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
          {gameState?.score ?? 0}
        </div>
      </motion.div>

      {/* Best Score */}
      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-orange-200 dark:border-orange-700"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wider">
          Best
        </div>
        <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
          {gameState?.bestScore ?? bestScore}
        </div>
      </motion.div>
    </div>
  )
}

export default React.memo(FibonacciScoreInner)