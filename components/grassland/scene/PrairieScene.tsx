/**
 * PrairieScene Component
 * 文档来源: /docs/design/UI-UX设计文档.md - Section 2.1
 *
 * 草原场景主容器，组合所有视觉层:
 * 1. SkyLayer (z-index: 1) - 天空渐变、太阳/月亮
 * 2. GrassLayer (z-index: 2) - 草地纹理
 * 3. ParticleLayer (z-index: 5) - 天气粒子效果
 * 4. PlantLayer (z-index: 10-40) - 植物层 [未来实现]
 * 5. UILayer (z-index: 100) - 交互界面 [未来实现]
 */

'use client'

import { useState, useEffect } from 'react'
import SkyLayer from './SkyLayer'
import GrassLayer from './GrassLayer'
import ParticleLayer from './ParticleLayer'

type TimePeriod = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night'
type WeatherEffect = 'none' | 'rain' | 'snow' | 'stars'
type WindStrength = 'gentle' | 'moderate' | 'strong'

interface PrairieSceneProps {
  /** 是否启用自动时间系统 (根据真实时间改变场景) */
  autoTimeSystem?: boolean
  /** 手动指定时间段 (覆盖自动系统) */
  timePeriod?: TimePeriod
  /** 手动指定天气效果 */
  weatherEffect?: WeatherEffect
  /** 风力强度 */
  windStrength?: WindStrength
  /** 草叶数量 */
  grassBladeCount?: number
  /** 是否显示性能统计 (开发模式) */
  showStats?: boolean
  /** 子元素 (植物层等) */
  children?: React.ReactNode
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

export default function PrairieScene({
  autoTimeSystem = true,
  timePeriod,
  weatherEffect = 'none',
  windStrength = 'gentle',
  grassBladeCount = 250,
  showStats = false,
  children,
  className = ''
}: PrairieSceneProps) {
  // 当前时间段状态
  const [currentTimePeriod, setCurrentTimePeriod] = useState<TimePeriod>(() => {
    if (timePeriod) return timePeriod
    if (autoTimeSystem) {
      const hour = new Date().getHours()
      return getTimePeriod(hour)
    }
    return 'noon' // 默认正午
  })

  // 性能统计
  const [stats, setStats] = useState({
    fps: 60,
    renderTime: 0,
    particles: 0
  })

  // 自动时间系统：每分钟检查一次时间
  useEffect(() => {
    if (!autoTimeSystem || timePeriod) return

    const updateTime = () => {
      const hour = new Date().getHours()
      const newPeriod = getTimePeriod(hour)
      setCurrentTimePeriod(newPeriod)
    }

    // 每60秒检查一次
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [autoTimeSystem, timePeriod])

  // 性能监控 (仅开发模式)
  useEffect(() => {
    if (!showStats) return

    let frameCount = 0
    let lastTime = performance.now()

    const measurePerformance = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime - lastTime >= 1000) {
        setStats({
          fps: frameCount,
          renderTime: (currentTime - lastTime) / frameCount,
          particles: 0 // TODO: 从粒子系统获取
        })
        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(measurePerformance)
    }

    const rafId = requestAnimationFrame(measurePerformance)
    return () => cancelAnimationFrame(rafId)
  }, [showStats])

  return (
    <div
      className={`viewport-screen relative w-full overflow-hidden bg-gradient-to-b from-sky-400 to-green-100 ${className}`}
      data-time-period={currentTimePeriod}
      data-weather={weatherEffect}
    >
      {/* 天空层 - z-index: 1 */}
      <SkyLayer
        timePeriod={timePeriod || currentTimePeriod}
        enableTransition={autoTimeSystem}
      />

      {/* 草地层 - z-index: 2 */}
      <GrassLayer
        bladeCount={grassBladeCount}
        windStrength={windStrength}
      />

      {/* 粒子层 (天气效果) - z-index: 5 */}
      <ParticleLayer
        weatherEffect={weatherEffect}
        autoWeather={weatherEffect === 'none' && autoTimeSystem}
      />

      {/* 植物层容器 - z-index: 10-40 */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 10 }}
      >
        {children}
      </div>

      {/* 性能统计 (仅开发模式) */}
      {showStats && (
        <div
          className="absolute top-4 right-4 bg-black/70 text-white text-xs font-mono p-3 rounded-lg"
          style={{ zIndex: 1000 }}
        >
          <div>FPS: {stats.fps}</div>
          <div>Render: {stats.renderTime.toFixed(2)}ms</div>
          <div>Particles: {stats.particles}</div>
          <div>Time: {currentTimePeriod}</div>
          <div>Weather: {weatherEffect}</div>
        </div>
      )}
    </div>
  )
}
