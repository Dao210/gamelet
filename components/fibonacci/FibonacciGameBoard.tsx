'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useFibonacciGameStore } from '@/lib/fibonacci-game-store'
import { getTileColor, getTextColor, getFontSize, getTileAt, GRID_SIZE } from '@/lib/fibonacci-game-engine'

function FibonacciGameBoardInner() {
  const { gameState } = useFibonacciGameStore()

  // Create GRID_SIZE x GRID_SIZE grid with memoization
  const cells = useMemo(() => {
    const tiles = gameState?.tiles ?? []
    return Array(GRID_SIZE).fill(null).map((_, row) =>
      Array(GRID_SIZE).fill(null).map((_, col) => getTileAt(tiles, row, col))
    )
  }, [gameState?.tiles])
  
  if (!gameState) return null
  
  return (
    <div className="grid grid-cols-4 gap-2 p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 rounded-2xl shadow-lg">
      {/* Background cells */}
      {Array(16).fill(null).map((_, i) => (
        <div 
          key={`bg-${i}`}
          className="w-16 h-16 md:w-20 md:h-20 bg-amber-200 dark:bg-amber-800 rounded-lg opacity-50"
        />
      ))}
      
      {/* Tiles */}
      {cells.flat().map((tile) => {
        if (!tile) return null
        
        return (
          <motion.div
            key={tile.id}
            className={`
              absolute w-16 h-16 md:w-20 md:h-20
              rounded-lg flex items-center justify-center
              font-bold shadow-md
              ${getTileColor(tile.value)}
              ${getTextColor(tile.value)}
              ${getFontSize(tile.value)}
            `}
            style={{
              left: `calc(${tile.col * 25}% + ${tile.col * 0.5}rem + 1rem)`,
              top: `calc(${tile.row * 25}% + ${tile.row * 0.5}rem + 1rem)`,
              width: '4rem',
              height: '4rem',
              marginLeft: '0.25rem',
              marginTop: '0.25rem'
            }}
            initial={tile.isNew ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            transition={{ 
              type: 'spring', 
              stiffness: 500, 
              damping: 30 
            }}
          >
            {tile.value}
          </motion.div>
        )
      })}
    </div>
  )
}

export default React.memo(FibonacciGameBoardInner)
