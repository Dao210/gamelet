'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useFibonacciGameStore } from '@/lib/fibonacci-game-store'
import { getTileColor, getTextColor, getFontSize } from '@/lib/fibonacci-game-engine'
import type { FibonacciCopy } from './fibonacci-copy'

function FibonacciGameBoardInner({ copy }: { copy: FibonacciCopy }) {
  const { gameState, move } = useFibonacciGameStore()
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  
  if (!gameState) return null
  
  return (
    <div
      aria-label={copy.boardLabel}
      className="relative grid aspect-square w-full touch-none grid-cols-4 grid-rows-4 gap-2.5 rounded-[1.75rem] border border-amber-950/10 bg-[#a87645] p-3 shadow-[0_30px_80px_-35px_rgba(87,48,14,.75),inset_0_1px_0_rgba(255,255,255,.35)] sm:gap-3 sm:p-4"
      onPointerDown={(event) => { touchStart.current = { x: event.clientX, y: event.clientY } }}
      onPointerUp={(event) => {
        if (!touchStart.current) return
        const dx = event.clientX - touchStart.current.x
        const dy = event.clientY - touchStart.current.y
        touchStart.current = null
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return
        move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'))
      }}
    >
      {/* Background cells */}
      {Array(16).fill(null).map((_, i) => (
        <div 
          key={`bg-${i}`}
          className="aspect-square min-w-0 rounded-2xl bg-amber-950/15 shadow-inner"
        />
      ))}
      
      {/* Tiles */}
      {gameState.tiles.map((tile) => (
          <motion.div
            key={tile.id}
            className={`
              z-10 flex min-w-0 items-center justify-center rounded-2xl
              font-black tabular-nums shadow-[0_6px_16px_rgba(65,35,9,.22)]
              ${getTileColor(tile.value)}
              ${getTextColor(tile.value)}
              ${getFontSize(tile.value)}
            `}
            style={{
              gridColumn: tile.col + 1,
              gridRow: tile.row + 1
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
      ))}
    </div>
  )
}

export default React.memo(FibonacciGameBoardInner)
