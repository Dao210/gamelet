/**
 * WaterButton Component
 * 文档来源: /docs/design/UI-UX设计文档.md - Section 3.3
 *
 * 浇水按钮组件，包含5步动画序列:
 * 1. 按钮点击反馈
 * 2. 水滴飞向植物
 * 3. 水花爆发 (Canvas粒子)
 * 4. 植物发光反应
 * 5. XP提示飘出
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WaterButtonProps {
  /** 植物ID */
  plantId: string
  /** 是否已浇水（今天） */
  hasWateredToday?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 浇水回调 */
  onWater?: (plantId: string) => Promise<{ xpGained?: number; leveledUp?: boolean }>
  /** 按钮位置（相对于父元素） */
  position?: { top?: string; bottom?: string; left?: string; right?: string }
  /** 自定义类名 */
  className?: string
}

export default function WaterButton({
  plantId,
  hasWateredToday = false,
  disabled = false,
  onWater,
  position = { top: '-15px', right: '-15px' },
  className = ''
}: WaterButtonProps) {
  const [isWatering, setIsWatering] = useState(false)
  const [showXP, setShowXP] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  const [showGlow, setShowGlow] = useState(false)

  const isDisabled = disabled || hasWateredToday || isWatering

  const handleWaterClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (isDisabled || !onWater) return

    setIsWatering(true)

    try {
      // 步骤 1: 按钮点击反馈 (已通过 whileTap 处理)

      // 步骤 2 & 3: 水滴飞行 + 水花爆发
      await animateWaterDrop(e.currentTarget)

      // 步骤 4: 调用 API 浇水
      const result = await onWater(plantId)

      if (result.xpGained) {
        setXpGained(result.xpGained)

        // 步骤 4: 植物发光反应
        setShowGlow(true)
        setTimeout(() => setShowGlow(false), 800)

        // 步骤 5: XP提示飘出
        setShowXP(true)
        setTimeout(() => setShowXP(false), 1000)
      }
    } catch (error) {
      console.error('Watering failed:', error)
    } finally {
      setIsWatering(false)
    }
  }

  /**
   * 水滴飞行和水花爆发动画
   */
  const animateWaterDrop = async (button: HTMLButtonElement) => {
    return new Promise<void>((resolve) => {
      // 创建水滴元素
      const drop = document.createElement('div')
      drop.className = 'water-drop'
      drop.style.cssText = `
        position: absolute;
        width: 12px;
        height: 12px;
        background: linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
      `

      const buttonRect = button.getBoundingClientRect()
      drop.style.left = `${buttonRect.left + buttonRect.width / 2}px`
      drop.style.top = `${buttonRect.top + buttonRect.height / 2}px`

      document.body.appendChild(drop)

      // 计算目标位置（植物中心）
      const parent = button.closest('.plant-card')
      if (parent) {
        const parentRect = parent.getBoundingClientRect()
        const targetX = parentRect.left + parentRect.width / 2 - buttonRect.left - buttonRect.width / 2
        const targetY = parentRect.top + parentRect.height / 2 - buttonRect.top - buttonRect.height / 2

        // 水滴飞行动画
        drop.style.transition = 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)'
        drop.style.transform = `translate(${targetX}px, ${targetY}px) scale(0)`
        drop.style.opacity = '0'

        // 动画结束后触发水花爆发
        setTimeout(() => {
          // 触发水花粒子效果 (TODO: 集成 SplashParticleSystem)
          drop.remove()
          resolve()
        }, 500)
      } else {
        drop.remove()
        resolve()
      }
    })
  }

  return (
    <>
      <motion.button
        className={`water-button absolute flex items-center justify-center rounded-full border-3 border-white shadow-lg ${className}`}
        style={{
          ...position,
          width: '40px',
          height: '40px',
          background: isDisabled
            ? 'linear-gradient(135deg, #B0BEC5 0%, #90A4AE 100%)'
            : 'linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%)',
          boxShadow: isDisabled
            ? '0 4px 12px rgba(176, 190, 197, 0.4)'
            : '0 4px 12px rgba(100, 181, 246, 0.4)',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.6 : 1
        }}
        disabled={isDisabled}
        onClick={handleWaterClick}
        whileHover={!isDisabled ? { scale: 1.1, boxShadow: '0 6px 16px rgba(100, 181, 246, 0.6)' } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* 水滴图标 */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path
            d="M12 2.69L17.66 8.35C18.69 9.38 19.34 10.73 19.5 12.17C19.66 13.61 19.33 15.07 18.56 16.32C17.79 17.57 16.62 18.54 15.23 19.08C13.84 19.62 12.31 19.7 10.88 19.32C9.44 18.94 8.17 18.12 7.25 16.99C6.33 15.86 5.81 14.47 5.76 13.03C5.71 11.59 6.14 10.17 6.98 8.98L12 2.69Z"
            fill="currentColor"
          />
        </svg>
      </motion.button>

      {/* XP 提示飘出 */}
      <AnimatePresence>
        {showXP && (
          <motion.div
            className="xp-popup absolute text-lg font-bold text-yellow-400 pointer-events-none z-50"
            style={{
              top: '-30px',
              left: '50%',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
            initial={{ opacity: 1, y: 0, x: '-50%' }}
            animate={{ opacity: 0, y: -50, x: '-50%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            +{xpGained} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* 植物发光效果（通过父元素） */}
      {showGlow && (
        <div
          className="plant-glow-effect absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(100, 181, 246, 0.4) 0%, transparent 70%)',
            animation: 'glow-pulse 0.8s ease-out'
          }}
        />
      )}

      <style jsx>{`
        @keyframes glow-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}
