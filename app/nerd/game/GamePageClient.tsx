'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../../lib/store';
import GameHeader from '../../../components/GameHeader';
import GameBoard from '../../../components/GameBoard';
import GameKeyboard from '../../../components/GameKeyboard';
import GameResult from '../../../components/GameResult';

export default function GamePageClient() {
  const { gameState, startNewGame } = useGameStore();

  // Start a classic game if no game is active
  useEffect(() => {
    if (!gameState) {
      startNewGame('classic');
    }
  }, [gameState, startNewGame]);

  return (
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              How to Play Nerdle
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-300">
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
                  <li>• <span className="text-green-600 font-semibold">Green</span>: Correct position</li>
                  <li>• <span className="text-yellow-600 font-semibold">Yellow</span>: Wrong position</li>
                  <li>• <span className="text-gray-600 font-semibold">Gray</span>: Not in equation</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}