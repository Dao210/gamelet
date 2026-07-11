'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useFibonacciGameStore } from '@/lib/fibonacci-game-store'
import type { FibonacciCopy } from './fibonacci-copy'

function FibonacciScoreInner({ copy }: { copy: FibonacciCopy }) {
  const { gameState, bestScore } = useFibonacciGameStore()

  return (
    <div className="mx-auto mb-6 grid w-full max-w-[420px] grid-cols-2 gap-3">
      {/* Current Score */}
      <motion.div
        className="rounded-2xl border border-amber-200 bg-white/80 px-5 py-3 text-center shadow-lg backdrop-blur-sm dark:border-amber-700 dark:bg-gray-800/80"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
          {copy.score}
        </div>
        <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
          {gameState?.score ?? 0}
        </div>
      </motion.div>

      {/* Best Score */}
      <motion.div
        className="rounded-2xl border border-orange-200 bg-white/80 px-5 py-3 text-center shadow-lg backdrop-blur-sm dark:border-orange-700 dark:bg-gray-800/80"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wider">
          {copy.best}
        </div>
        <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
          {gameState?.bestScore ?? bestScore}
        </div>
      </motion.div>
    </div>
  )
}

export default React.memo(FibonacciScoreInner)
