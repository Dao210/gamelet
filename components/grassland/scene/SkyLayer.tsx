/**
 * SkyLayer Component
 * 文档来源: /docs/design/UI-UX设计文档.md - Section 2.2
 *
 * 渲染天空渐变层，支持6个时间段:
 * - 黎明 (5:00-7:00): 暖橙 → 金橙 → 天蓝
 * - 上午 (7:00-12:00): 天蓝 → 粉蓝
 * - 正午 (12:00-15:00): 天蓝 → 浅蓝
 * - 下午 (15:00-17:00): 金黄 → 橙黄
 * - 黄昏 (17:00-19:00): 橙红 → 玫红 → 紫色
 * - 夜晚 (19:00-5:00): 深蓝黑 → 墨蓝 → 浅夜蓝
 */

'use client'

import { useMemo } from 'react'

type TimePeriod = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night'

interface SkyLayerProps {
  /** 时间段 (可选，默认根据当前时间自动计算) */
  timePeriod?: TimePeriod
  /** 是否启用平滑过渡动画 */
  enableTransition?: boolean
  /** 自定义类名 */
  className?: string
}

/**
 * 根据小时数确定时间段
 */
function getTimePeriod(hour: number): TimePeriod {
  if (hour >= 5 && hour < 7) return 'dawn'
  if (hour >= 7 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 15) return 'noon'
  if (hour >= 15 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 19) return 'dusk'
  return 'night'
}

/**
 * 获取天空渐变样式
 */
function getSkyGradient(period: TimePeriod): string {
  const gradients: Record<TimePeriod, string> = {
    dawn: 'linear-gradient(180deg, #FFE5B4 0%, #FFB347 40%, #87CEEB 100%)',
    morning: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%)',
    noon: 'linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%)',
    afternoon: 'linear-gradient(180deg, #FFD93D 0%, #FFA500 100%)',
    dusk: 'linear-gradient(180deg, #FF6B6B 0%, #C44569 50%, #5F27CD 100%)',
    night: 'linear-gradient(180deg, #0F2027 0%, #203A43 50%, #2C5364 100%)'
  }
  return gradients[period]
}

/**
 * 获取太阳/月亮配置
 */
function getCelestialBody(period: TimePeriod) {
  const config: Record<TimePeriod, { type: 'sun' | 'moon'; position: { top?: string; bottom?: string; left?: string; right?: string }; size: number; opacity: number }> = {
    dawn: {
      type: 'sun',
      position: { bottom: '10%', right: '20%' },
      size: 80,
      opacity: 0.9
    },
    morning: {
      type: 'sun',
      position: { top: '20%', right: '30%' },
      size: 90,
      opacity: 1
    },
    noon: {
      type: 'sun',
      position: { top: '10%', left: '50%' },
      size: 100,
      opacity: 1
    },
    afternoon: {
      type: 'sun',
      position: { top: '25%', left: '30%' },
      size: 90,
      opacity: 0.95
    },
    dusk: {
      type: 'sun',
      position: { bottom: '5%', left: '15%' },
      size: 80,
      opacity: 0.8
    },
    night: {
      type: 'moon',
      position: { top: '15%', right: '25%' },
      size: 60,
      opacity: 0.95
    }
  }
  return config[period]
}

export default function SkyLayer({
  timePeriod,
  enableTransition = true,
  className = ''
}: SkyLayerProps) {
  // 自动检测当前时间段
  const currentPeriod = useMemo(() => {
    if (timePeriod) return timePeriod
    const hour = new Date().getHours()
    return getTimePeriod(hour)
  }, [timePeriod])

  const gradient = useMemo(() => getSkyGradient(currentPeriod), [currentPeriod])
  const celestial = useMemo(() => getCelestialBody(currentPeriod), [currentPeriod])

  return (
    <div
      className={`absolute inset-0 w-full h-full ${enableTransition ? 'transition-all duration-[2000ms] ease-in-out' : ''} ${className}`}
      style={{
        background: gradient,
        zIndex: 1
      }}
      data-time-period={currentPeriod}
    >
      {/* 太阳/月亮 */}
      <div
        className={`absolute ${celestial.type === 'sun' ? 'animate-pulse-slow' : ''}`}
        style={{
          ...celestial.position,
          width: `${celestial.size}px`,
          height: `${celestial.size}px`,
          opacity: celestial.opacity,
          transform: celestial.position.left === '50%' ? 'translateX(-50%)' : undefined,
          pointerEvents: 'none'
        }}
      >
        {celestial.type === 'sun' ? (
          // 太阳
          <div
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle, #FFD93D 0%, #FFA726 100%)',
              boxShadow: '0 0 60px rgba(255, 217, 61, 0.8)'
            }}
          />
        ) : (
          // 月亮
          <div
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #FFF 0%, #E0E0E0 100%)',
              boxShadow: '0 0 40px rgba(255, 255, 255, 0.6)'
            }}
          />
        )}
      </div>

      {/* 云朵层（可选，未来扩展） */}
      {/* TODO: Add cloud parallax layers */}
    </div>
  )
}
