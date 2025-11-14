'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import SVGPlant from '../svg/SVGPlant'
import {
  SVGWaterDrop,
  SVGLevelBadge,
  SVGProgressBar,
  SVGComment,
  SVGShare,
  SVGNewTag
} from '../svg/SVGIcons'
import type { MockPlant } from '@/lib/garden-mock-data'
import { calculateProgress, getNextLevelThreshold } from '@/lib/garden-mock-data'

interface PlantCardProps {
  plant: MockPlant
  onWater?: (plantId: string) => void
  onComment?: (plantId: string) => void
  onShare?: (plantId: string) => void
}

export default function PlantCard({ plant, onWater, onComment, onShare }: PlantCardProps) {
  const [isWatered, setIsWatered] = useState(false)
  const [localLikeCount, setLocalLikeCount] = useState(plant.likeCount)
  const [isHovered, setIsHovered] = useState(false)

  const progress = calculateProgress(localLikeCount, plant.level)
  const nextThreshold = getNextLevelThreshold(plant.level)

  const handleWater = () => {
    if (isWatered) return

    setIsWatered(true)
    setLocalLikeCount(prev => prev + 1)

    if (onWater) {
      onWater(plant.id)
    }

    // Reset animation after 2 seconds
    setTimeout(() => {
      setIsWatered(false)
    }, 2000)
  }

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass morphism card */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden">
        {/* Header: User info */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* User avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
              {plant.user.username[0].toUpperCase()}
            </div>

            {/* Username */}
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {plant.user.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {plant.createdAt.toLocaleDateString('zh-CN', {
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Level Badge */}
          <motion.div
            animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <SVGLevelBadge level={plant.level} size={40} />
          </motion.div>
        </div>

        {/* Plant visualization */}
        <div className="relative px-6 py-8 bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
          {/* NEW tag */}
          {plant.isNew && (
            <motion.div
              className="absolute top-4 left-4 z-10"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            >
              <SVGNewTag size={50} />
            </motion.div>
          )}

          {/* Plant SVG */}
          <div className="flex justify-center">
            <SVGPlant level={plant.level} size={200} animated={true} />
          </div>

          {/* XP Progress Bar */}
          {plant.level < 3 && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-1 px-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  成长进度
                </span>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {localLikeCount} / {nextThreshold}
                </span>
              </div>
              <SVGProgressBar progress={progress} width={280} height={8} />
            </motion.div>
          )}

          {/* Level 3 Max Level Indicator */}
          {plant.level === 3 && (
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow-lg">
                ✨ 已达最高等级 ✨
              </span>
            </motion.div>
          )}
        </div>

        {/* Content: Name & Bio */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {plant.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {plant.bio}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {plant.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 hover:from-green-100 hover:to-blue-100 dark:hover:from-green-900/30 dark:hover:to-blue-900/30 transition-all cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            {/* Water Button */}
            <motion.button
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
                transition-all duration-300
                ${
                  isWatered
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gradient-to-r from-blue-400/20 to-cyan-400/20 text-blue-600 dark:text-cyan-400 hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/50'
                }
              `}
              onClick={handleWater}
              disabled={isWatered}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isWatered ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <SVGWaterDrop size={20} animated={isWatered} />
              </motion.div>
              <span className="text-sm">{localLikeCount}</span>
            </motion.button>

            {/* Comment Button */}
            <motion.button
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all"
              onClick={() => onComment?.(plant.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SVGComment size={18} />
              <span className="text-sm">{plant.commentCount}</span>
            </motion.button>

            {/* Share Button */}
            <motion.button
              className="flex items-center gap-2 p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all"
              onClick={() => onShare?.(plant.id)}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <SVGShare size={18} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/20 to-blue-500/20 -z-10 blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
