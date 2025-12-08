/**
 * PlantCard Component
 * 文档来源: /docs/design/UI-UX设计文档.md - Section 3.1, 3.2
 *
 * 植物卡片组件，支持4个等级的视觉效果:
 * - Level 1 (幼苗期): 50px, 嫩绿色, 微弱摆动
 * - Level 2 (成长期): 80px, 翠绿色, 轻柔摆动 + 星光闪烁
 * - Level 3 (繁茂期): 120px, 深绿色, 动态摆动 + 持续光环
 * - Level 4 (传奇期): 160px, 金色光环, 威严摆动 + 粒子环绕 + 呼吸缩放
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import WaterButton from './WaterButton'
import LevelUpAnimation from './LevelUpAnimation'

type PlantLevel = 1 | 2 | 3 | 4

export interface PlantData {
  id: string
  imageUrl: string
  level: PlantLevel
  xp: number
  waterCount: number
  authorName?: string
  authorImage?: string
  positionX: number
  positionY: number
}

interface PlantCardProps {
  plant: PlantData
  /** 是否已经浇过水（今天） */
  hasWateredToday?: boolean
  /** 是否显示升级动画 */
  isLevelingUp?: boolean
  /** 是否显示信息气泡 */
  showInfo?: boolean
  /** 浇水回调 */
  onWater?: (plantId: string) => Promise<{
    xpGained?: number
    leveledUp?: boolean
    newLevel?: number
  }>
  /** 点击卡片回调 */
  onClick?: (plantId: string) => void
  /** 自定义类名 */
  className?: string
}

/**
 * 获取等级配置
 */
function getLevelConfig(level: PlantLevel) {
  const configs = {
    1: {
      size: 50,
      opacity: 0.7,
      color: '#8BC34A',
      shadow: '0 2px 4px rgba(139, 195, 74, 0.3)',
      animation: 'gentle-sway'
    },
    2: {
      size: 80,
      opacity: 0.85,
      color: '#4CAF50',
      shadow: '0 4px 8px rgba(76, 175, 80, 0.4)',
      animation: 'moderate-sway'
    },
    3: {
      size: 120,
      opacity: 1,
      color: '#388E3C',
      shadow: '0 8px 16px rgba(56, 142, 60, 0.5)',
      animation: 'dynamic-sway'
    },
    4: {
      size: 160,
      opacity: 1,
      color: '#1B5E20',
      shadow: '0 12px 24px rgba(255, 215, 0, 0.6)',
      animation: 'majestic-sway'
    }
  }
  return configs[level]
}

export default function PlantCard({
  plant,
  hasWateredToday = false,
  isLevelingUp = false,
  showInfo = false,
  onWater,
  onClick,
  className = ''
}: PlantCardProps) {
  const [hovered, setHovered] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [newLevel, setNewLevel] = useState(plant.level)
  const config = getLevelConfig(plant.level)

  const handleWaterClick = async (plantId: string) => {
    if (onWater) {
      const result = await onWater(plantId)

      // 如果升级了，显示升级动画
      if (result.leveledUp && result.newLevel && (result.newLevel >= 1 && result.newLevel <= 4)) {
        setNewLevel(result.newLevel as PlantLevel)
        setShowLevelUp(true)
      }

      return result
    }
    return {}
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(plant.id)
    }
  }

  return (
    <motion.div
      className={`plant-card relative cursor-pointer ${className}`}
      data-level={plant.level}
      style={{
        width: `${config.size}px`,
        height: `${config.size}px`
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Level 3+ 光环层 */}
      {plant.level >= 3 && (
        <div
          className="plant-aura absolute rounded-full pointer-events-none"
          style={{
            inset: plant.level === 4 ? '-40px' : '-20px',
            background:
              plant.level === 4
                ? 'radial-gradient(circle, rgba(255, 215, 0, 0.5) 0%, rgba(255, 215, 0, 0.2) 40%, transparent 70%)'
                : 'radial-gradient(circle, rgba(76, 175, 80, 0.3) 0%, transparent 60%)',
            animation: `pulse-glow ${plant.level === 4 ? '2s' : '3s'} ease-in-out infinite`
          }}
        />
      )}

      {/* Level 4 光波扩散 */}
      {plant.level === 4 && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: '-50%',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 50%)',
            animation: 'wave-pulse 5s ease-out infinite'
          }}
        />
      )}

      {/* 植物主体 */}
      <motion.div
        className="plant-body relative w-full h-full"
        animate={
          isLevelingUp
            ? {
                scale: [1, 1.2, 1],
                transition: { duration: 0.8, ease: 'easeInOut' }
              }
            : {}
        }
      >
        <Image
          src={plant.imageUrl}
          alt={`Plant by ${plant.authorName || 'Unknown'}`}
          fill
          className="object-contain"
          style={{
            opacity: config.opacity,
            filter: `drop-shadow(${config.shadow})`,
            animation: `${config.animation} ${
              plant.level === 1 ? '3s' : plant.level === 2 ? '2.5s' : plant.level === 3 ? '2s' : '1.8s'
            } ease-in-out infinite${plant.level === 4 ? ', breathe 3s ease-in-out infinite' : ''}`
          }}
        />
      </motion.div>

      {/* Level 2+ 星光闪烁 */}
      {plant.level >= 2 && (
        <div
          className="absolute w-3 h-3 rounded-full pointer-events-none"
          style={{
            top: '-10px',
            right: '-10px',
            background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
            animation: 'sparkle 2s infinite'
          }}
        />
      )}

      {/* 信息气泡 (hover显示) */}
      <AnimatePresence>
        {(hovered || showInfo) && (
          <motion.div
            className="plant-info-popup absolute z-50 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-3 min-w-[150px]"
            style={{
              bottom: '120%',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center space-y-1">
              <h3 className="font-semibold text-sm text-gray-900">
                {plant.authorName || 'Anonymous'}
              </h3>
              <p className="text-xs text-gray-600">Level {plant.level}</p>
              <p className="text-xs text-gray-500">{plant.xp} XP</p>
              <p className="text-xs text-gray-500">
                {plant.waterCount} {plant.waterCount === 1 ? 'watering' : 'waterings'}
              </p>
            </div>
            {/* 三角形箭头 */}
            <div
              className="absolute w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white/95"
              style={{
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 已浇水标记 */}
      {hasWateredToday && (
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md z-10">
          ✓
        </div>
      )}

      {/* 浇水按钮 */}
      {onWater && (
        <WaterButton
          plantId={plant.id}
          hasWateredToday={hasWateredToday}
          onWater={handleWaterClick}
        />
      )}

      {/* 升级动画 */}
      <LevelUpAnimation
        show={showLevelUp || isLevelingUp}
        newLevel={newLevel}
        onComplete={() => setShowLevelUp(false)}
      />

      <style jsx>{`
        @keyframes gentle-sway {
          0%,
          100% {
            transform: rotate(-1deg);
          }
          50% {
            transform: rotate(1deg);
          }
        }

        @keyframes moderate-sway {
          0%,
          100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }

        @keyframes dynamic-sway {
          0%,
          100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        @keyframes majestic-sway {
          0%,
          100% {
            transform: rotate(-8deg);
          }
          50% {
            transform: rotate(8deg);
          }
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes wave-pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </motion.div>
  )
}
