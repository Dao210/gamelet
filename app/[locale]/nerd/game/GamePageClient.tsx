'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/lib/store'
import GameHeader from '@/components/GameHeader'
import GameBoard from '@/components/GameBoard'
import GameKeyboard from '@/components/GameKeyboard'
import GameResult from '@/components/GameResult'
import ValidationFeedback from '@/components/ValidationFeedback'

export default function GamePageClient() {
  const { gameState, startNewGame, currentAttempt } = useGameStore();

  // Start a classic game if no game is active
  useEffect(() => {
    if (!gameState) {
      startNewGame('classic');
    }
  }, [gameState, startNewGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 relative overflow-hidden">
      {/* Animated gradient orbs background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <GameHeader className="mb-8" />

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Glass morphism card */}
          <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 dark:border-gray-700/30 p-8">
            <GameBoard className="mb-6" />

            {currentAttempt.length > 0 && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <ValidationFeedback
                  equation={currentAttempt}
                  maxLength={gameState?.mode === 'classic' ? 8 : gameState?.mode === 'mini' ? 6 : 10}
                />
              </motion.div>
            )}

            <GameKeyboard />
          </div>
        </motion.div>

        {/* Game Result Modal */}
        <GameResult className="mt-8" />

        {/* Game Instructions with glass effect */}
        <motion.div
          className="max-w-2xl mx-auto mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 dark:border-gray-700/30 p-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              How to Play Nerdle
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Rules:</h3>
                <ul className="space-y-1">
                  <li>• Guess the equation in 6 tries</li>
                  <li>• Each guess must be a valid equation</li>
                  <li>• Use numbers 0-9 and +,-,*,/</li>
                  <li>• Must contain exactly one =</li>
                  <li>• Result must be a positive integer</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Colors:</h3>
                <ul className="space-y-1">
                  <li>• <span className="text-green-600 dark:text-green-400 font-semibold">Green</span>: Correct position</li>
                  <li>• <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Yellow</span>: Wrong position</li>
                  <li>• <span className="text-gray-600 dark:text-gray-400 font-semibold">Gray</span>: Not in equation</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}