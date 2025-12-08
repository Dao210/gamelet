/**
 * ParticleLayer Component
 * 文档来源: /docs/design/UI-UX设计文档.md - Section 2.1
 *
 * 渲染天气粒子效果层:
 * - 雨滴 (RainParticleSystem)
 * - 雪花 (SnowParticleSystem)
 * - 星星 (StarParticleSystem)
 *
 * 使用 Canvas 2D API + requestAnimationFrame 实现高性能粒子渲染
 */

'use client'

import { useEffect, useRef } from 'react'
import { RainParticleSystem, SnowParticleSystem, StarParticleSystem } from '@/lib/particle-system'

type WeatherEffect = 'none' | 'rain' | 'snow' | 'stars'

interface ParticleLayerProps {
  /** 天气效果类型 */
  weatherEffect?: WeatherEffect
  /** 是否自动根据时间段选择效果 */
  autoWeather?: boolean
  /** 自定义类名 */
  className?: string
}

/**
 * 根据时间段自动选择天气效果
 */
function getAutoWeatherEffect(hour: number): WeatherEffect {
  // 夜晚显示星星 (19:00-5:00)
  if (hour >= 19 || hour < 5) {
    return 'stars'
  }
  // 其他时间无天气效果（可以后续扩展随机天气）
  return 'none'
}

export default function ParticleLayer({
  weatherEffect = 'none',
  autoWeather = true,
  className = ''
}: ParticleLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particleSystemRef = useRef<RainParticleSystem | SnowParticleSystem | StarParticleSystem | null>(null)
  const animationFrameRef = useRef<number>(0)
  const lastFrameTimeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置 Canvas 尺寸为视口尺寸
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      // 更新粒子系统边界
      if (particleSystemRef.current) {
        particleSystemRef.current.setBounds(canvas.width, canvas.height)
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 确定要使用的天气效果
    let activeEffect = weatherEffect
    if (autoWeather && weatherEffect === 'none') {
      const hour = new Date().getHours()
      activeEffect = getAutoWeatherEffect(hour)
    }

    // 创建对应的粒子系统
    if (activeEffect !== 'none') {
      switch (activeEffect) {
        case 'rain':
          particleSystemRef.current = new RainParticleSystem({
            bounds: { width: canvas.width, height: canvas.height }
          })
          break
        case 'snow':
          particleSystemRef.current = new SnowParticleSystem({
            bounds: { width: canvas.width, height: canvas.height }
          })
          break
        case 'stars':
          particleSystemRef.current = new StarParticleSystem({
            bounds: { width: canvas.width, height: canvas.height }
          })
          break
      }
    }

    // 动画循环
    const animate = (currentTime: number) => {
      if (!particleSystemRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      // 计算时间增量（秒）
      const deltaTime = lastFrameTimeRef.current
        ? (currentTime - lastFrameTimeRef.current) / 1000
        : 1 / 60
      lastFrameTimeRef.current = currentTime

      // 限制最大 deltaTime（防止标签页切换后的大跳跃）
      const cappedDeltaTime = Math.min(deltaTime, 0.1)

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 更新并渲染粒子系统
      particleSystemRef.current.update(cappedDeltaTime)
      particleSystemRef.current.render(ctx)

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // 启动动画循环
    animationFrameRef.current = requestAnimationFrame(animate)

    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (particleSystemRef.current) {
        particleSystemRef.current.clear()
      }
    }
  }, [weatherEffect, autoWeather])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 5 }}
      data-weather={weatherEffect}
    />
  )
}
