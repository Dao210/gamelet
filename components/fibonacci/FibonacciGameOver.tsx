'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFibonacciGameStore } from '@/lib/fibonacci-game-store'
import type { FibonacciCopy } from './fibonacci-copy'

function FibonacciGameOverInner({ copy }: { copy: FibonacciCopy }) {
  const { gameState, startNewGame, continueAfterWin } = useFibonacciGameStore()
  
  const isVisible = gameState?.over || (gameState?.won && gameState?.canContinue)
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 max-w-sm w-full text-center"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {gameState?.won && !gameState?.over ? (
              <>
                {/* Win Modal */}
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  🏆
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  {copy.win}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {copy.winDetail}
                </p>
                
                <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-4 mb-6">
                  <div className="text-sm text-amber-700 dark:text-amber-400 mb-1">{copy.finalScore}</div>
                  <div className="text-4xl font-bold text-amber-600 dark:text-amber-300">
                    {gameState?.score}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button
                    onClick={continueAfterWin}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 active:scale-95"
                  >
                    {copy.continue}
                  </button>
                  <button
                    onClick={startNewGame}
                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 active:scale-95"
                  >
                    {copy.newGame}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Game Over Modal */}
                <motion.div
                  className="text-6xl mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  😢
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {copy.gameOver}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {copy.gameOverDetail}
                </p>
                
                <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-4 mb-6">
                  <div className="text-sm text-orange-700 dark:text-orange-400 mb-1">{copy.finalScore}</div>
                  <div className="text-4xl font-bold text-orange-600 dark:text-orange-300">
                    {gameState?.score}
                  </div>
                </div>
                
                <button
                  onClick={startNewGame}
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 active:scale-95"
                >
                  {copy.playAgain}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default React.memo(FibonacciGameOverInner)
