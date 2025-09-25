import React, { useEffect } from 'react'
import { NextSeo } from 'next-seo'
import { motion } from 'framer-motion'
import { useGameStore } from '../lib/store'
import { gameSEO } from '../lib/seo'
import GameHeader from '../components/GameHeader'
import GameBoard from '../components/GameBoard'
import GameKeyboard from '../components/GameKeyboard'
import GameResult from '../components/GameResult'

export default function GamePage() {
  const { gameState, startNewGame } = useGameStore()
  
  // Start a classic game if no game is active
  useEffect(() => {
    if (!gameState) {
      startNewGame('classic')
    }
  }, [gameState, startNewGame])
  
  return (
    <>
      <NextSeo {...gameSEO} />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
        <div className="container mx-auto px-4 py-8">
          <GameHeader className="mb-8" />
          
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <GameBoard className="mb-8" />
              <GameKeyboard />
            </div>
          </motion.div>
          
          {/* Game Result Modal */}
          <GameResult className="mt-8" />
          
          {/* Game Instructions */}
          <motion.div 
            className="max-w-2xl mx-auto mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Quick Tips
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Start with simple equations like "1+2=3" or "5*2=10"</li>
                <li>• Pay attention to the color feedback to narrow down possibilities</li>
                <li>• Remember: equations must be mathematically correct</li>
                <li>• Use the keyboard or click the buttons to input your guesses</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
