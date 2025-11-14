'use client'

import { motion } from 'framer-motion'

// Animated gradient orbs background for immersive visual effect
export default function AnimatedOrbs() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Orb 1: Green - top left */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/20 dark:bg-green-500/10 rounded-full blur-3xl"
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

      {/* Orb 2: Blue - top right */}
      <motion.div
        className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl"
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

      {/* Orb 3: Cyan - bottom center */}
      <motion.div
        className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-300/20 dark:bg-cyan-600/10 rounded-full blur-3xl"
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
  )
}
