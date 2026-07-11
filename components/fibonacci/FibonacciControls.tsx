'use client'

import React from 'react'
import { useFibonacciGameStore } from '@/lib/fibonacci-game-store'
import type { FibonacciCopy } from './fibonacci-copy'

function FibonacciControlsInner({ copy }: { copy: FibonacciCopy }) {
  const { startNewGame, resetGame, gameState } = useFibonacciGameStore()

  return (
    <div className="flex justify-center gap-3 mt-6">
      <button
        onClick={resetGame}
        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 active:scale-95"
      >
        ↻ {copy.newGame}
      </button>

      {(gameState?.over || gameState?.won) && !gameState?.canContinue && (
        <button
          onClick={startNewGame}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 active:scale-95"
        >
          ✨ {copy.playAgain}
        </button>
      )}
    </div>
  )
}

export default React.memo(FibonacciControlsInner)
