/**
 * Canvas 粒子系统可视化演示组件
 * 用于技术预研：测试雨滴、水花、星光等粒子效果的性能
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import {
  RainParticleSystem,
  SplashParticleSystem,
  StarParticleSystem,
  SnowParticleSystem,
  type ParticleSystemStats
} from '@/lib/particle-system'

type ParticleSystemType = 'rain' | 'splash' | 'stars' | 'snow' | 'all'

export default function ParticleSystemDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number>(0)
  const fpsHistoryRef = useRef<number[]>([])

  const rainSystemRef = useRef<RainParticleSystem | null>(null)
  const splashSystemRef = useRef<SplashParticleSystem | null>(null)
  const starSystemRef = useRef<StarParticleSystem | null>(null)
  const snowSystemRef = useRef<SnowParticleSystem | null>(null)

  const [activeSystem, setActiveSystem] = useState<ParticleSystemType>('rain')
  const [stats, setStats] = useState<ParticleSystemStats>({
    activeParticles: 0,
    totalParticles: 0,
    fps: 60,
    frameTime: 0,
    drawCalls: 0
  })
  const [avgFPS, setAvgFPS] = useState<number>(60)
  const [isRunning, setIsRunning] = useState<boolean>(true)
  const [particleConfig, setParticleConfig] = useState({
    maxParticles: 200,
    emissionRate: 50,
    gravity: 400,
    wind: 20
  })

  // 初始化粒子系统
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const bounds = { width: canvas.width, height: canvas.height }

    rainSystemRef.current = new RainParticleSystem({
      maxParticles: particleConfig.maxParticles,
      emissionRate: particleConfig.emissionRate,
      gravity: particleConfig.gravity,
      wind: particleConfig.wind,
      bounds
    })

    splashSystemRef.current = new SplashParticleSystem({ bounds })
    starSystemRef.current = new StarParticleSystem({ bounds })
    snowSystemRef.current = new SnowParticleSystem({ bounds })

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // 更新配置
  useEffect(() => {
    if (rainSystemRef.current) {
      rainSystemRef.current.setPhysics(
        particleConfig.gravity,
        particleConfig.wind
      )
    }
  }, [particleConfig])

  // 动画循环
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      if (!isRunning) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      // 清空画布
      ctx.fillStyle = getBackgroundColor()
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 根据当前选择的系统进行更新和渲染
      let currentStats: ParticleSystemStats = {
        activeParticles: 0,
        totalParticles: 0,
        fps: 60,
        frameTime: 0,
        drawCalls: 0
      }

      switch (activeSystem) {
        case 'rain':
          if (rainSystemRef.current) {
            rainSystemRef.current.update(deltaTime)
            rainSystemRef.current.render(ctx)
            currentStats = rainSystemRef.current.getStats()
          }
          break

        case 'splash':
          if (splashSystemRef.current) {
            splashSystemRef.current.update(deltaTime)
            splashSystemRef.current.render(ctx)
            currentStats = splashSystemRef.current.getStats()
          }
          break

        case 'stars':
          if (starSystemRef.current) {
            starSystemRef.current.update(deltaTime)
            starSystemRef.current.render(ctx)
            currentStats = starSystemRef.current.getStats()
          }
          break

        case 'snow':
          if (snowSystemRef.current) {
            snowSystemRef.current.update(deltaTime)
            snowSystemRef.current.render(ctx)
            currentStats = snowSystemRef.current.getStats()
          }
          break

        case 'all':
          // 同时运行所有系统
          const systems = [
            rainSystemRef.current,
            starSystemRef.current,
            snowSystemRef.current
          ].filter(Boolean)

          for (const system of systems) {
            if (system) {
              system.update(deltaTime)
              system.render(ctx)
              const systemStats = system.getStats()
              currentStats.activeParticles += systemStats.activeParticles
              currentStats.drawCalls += systemStats.drawCalls
            }
          }
          currentStats.fps = calculateFPS(currentTime)
          break
      }

      setStats(currentStats)

      // 计算平均FPS
      fpsHistoryRef.current.push(currentStats.fps)
      if (fpsHistoryRef.current.length > 60) {
        fpsHistoryRef.current.shift()
      }
      const avgFps =
        fpsHistoryRef.current.reduce((a, b) => a + b, 0) /
        fpsHistoryRef.current.length
      setAvgFPS(avgFps)

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [activeSystem, isRunning])

  // FPS计算
  const calculateFPS = (currentTime: number): number => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = currentTime
      return 60
    }

    const deltaTime = currentTime - lastTimeRef.current
    const fps = deltaTime > 0 ? 1000 / deltaTime : 60
    lastTimeRef.current = currentTime
    return fps
  }

  // 获取背景颜色
  const getBackgroundColor = (): string => {
    switch (activeSystem) {
      case 'rain':
        return '#4A5568' // 灰色雨天
      case 'stars':
        return '#0F2027' // 深蓝夜空
      case 'snow':
        return '#E8F5E9' // 浅绿雪天
      case 'splash':
        return '#E0F6FF' // 浅蓝水面
      default:
        return '#87CEEB' // 天蓝
    }
  }

  // Canvas点击事件 (触发水花)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeSystem === 'splash' && splashSystemRef.current) {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      splashSystemRef.current.splash(x, y, 20)
    }
  }

  // 切换系统
  const switchSystem = (system: ParticleSystemType) => {
    // 清空所有系统
    rainSystemRef.current?.clear()
    splashSystemRef.current?.clear()
    starSystemRef.current?.clear()
    snowSystemRef.current?.clear()

    fpsHistoryRef.current = []
    setActiveSystem(system)
  }

  // 获取性能等级
  const getPerformanceLevel = (): {
    level: string
    color: string
    message: string
  } => {
    if (avgFPS >= 55) {
      return {
        level: '优秀',
        color: 'text-green-600',
        message: '性能表现优秀，可支持更多粒子'
      }
    } else if (avgFPS >= 30) {
      return {
        level: '良好',
        color: 'text-blue-600',
        message: '性能良好，当前粒子数合适'
      }
    } else if (avgFPS >= 20) {
      return {
        level: '一般',
        color: 'text-yellow-600',
        message: '性能一般，建议减少粒子数'
      }
    } else {
      return {
        level: '较差',
        color: 'text-red-600',
        message: '性能较差，必须降级处理'
      }
    }
  }

  const perfLevel = getPerformanceLevel()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Canvas 粒子系统技术预研
          </h1>
          <p className="text-gray-300">
            全球草原花园 - 自然元素粒子效果性能测试
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Canvas区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  实时渲染
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      isRunning
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white`}
                  >
                    {isRunning ? '暂停' : '继续'}
                  </button>
                </div>
              </div>

              <canvas
                ref={canvasRef}
                width={900}
                height={600}
                onClick={handleCanvasClick}
                className="border border-white/30 rounded-lg w-full cursor-pointer"
              />

              {activeSystem === 'splash' && (
                <p className="text-center text-white/70 mt-2 text-sm">
                  💧 点击Canvas任意位置触发水花效果
                </p>
              )}

              {/* 实时统计 */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <div className="text-sm text-gray-300">活跃粒子</div>
                  <div className="text-2xl font-bold text-white">
                    {stats.activeParticles}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <div className="text-sm text-gray-300">实时FPS</div>
                  <div className="text-2xl font-bold text-white">
                    {Math.round(stats.fps)}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <div className="text-sm text-gray-300">平均FPS</div>
                  <div className="text-2xl font-bold text-white">
                    {Math.round(avgFPS)}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <div className="text-sm text-gray-300">绘制调用</div>
                  <div className="text-2xl font-bold text-white">
                    {stats.drawCalls}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <div className="text-sm text-gray-300">性能等级</div>
                  <div className={`text-xl font-bold ${perfLevel.color}`}>
                    {perfLevel.level}
                  </div>
                </div>
              </div>

              {/* 性能建议 */}
              <div className="mt-4 bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <div className="text-white font-semibold mb-1">
                      性能分析
                    </div>
                    <div className="text-gray-300 text-sm">
                      {perfLevel.message}
                    </div>
                    <div className="text-gray-400 text-xs mt-2">
                      建议目标FPS: 60 | 可接受范围: 30-60 | 需要降级: &lt;30
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 控制面板 */}
          <div className="space-y-6">
            {/* 系统选择 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">
                粒子系统
              </h2>

              <div className="space-y-2">
                {[
                  { id: 'rain', name: '☔ 雨滴系统', desc: '倾斜雨滴效果' },
                  {
                    id: 'splash',
                    name: '💧 水花系统',
                    desc: '点击触发水花'
                  },
                  { id: 'stars', name: '⭐ 星光系统', desc: '闪烁星星效果' },
                  { id: 'snow', name: '❄️ 雪花系统', desc: '飘落雪花效果' },
                  {
                    id: 'all',
                    name: '🔥 压力测试',
                    desc: '同时运行多个系统'
                  }
                ].map((system) => (
                  <button
                    key={system.id}
                    onClick={() =>
                      switchSystem(system.id as ParticleSystemType)
                    }
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all border ${
                      activeSystem === system.id
                        ? 'bg-purple-500/30 border-purple-400 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium">{system.name}</div>
                    <div className="text-xs opacity-70">{system.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 参数调整 */}
            {activeSystem === 'rain' && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4">
                  参数调整
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      最大粒子数: {particleConfig.maxParticles}
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="50"
                      value={particleConfig.maxParticles}
                      onChange={(e) =>
                        setParticleConfig({
                          ...particleConfig,
                          maxParticles: Number(e.target.value)
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      发射速率: {particleConfig.emissionRate}/s
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="10"
                      value={particleConfig.emissionRate}
                      onChange={(e) =>
                        setParticleConfig({
                          ...particleConfig,
                          emissionRate: Number(e.target.value)
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      重力: {particleConfig.gravity}
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="800"
                      step="100"
                      value={particleConfig.gravity}
                      onChange={(e) =>
                        setParticleConfig({
                          ...particleConfig,
                          gravity: Number(e.target.value)
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      风力: {particleConfig.wind}
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="10"
                      value={particleConfig.wind}
                      onChange={(e) =>
                        setParticleConfig({
                          ...particleConfig,
                          wind: Number(e.target.value)
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 技术说明 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">
                技术说明
              </h2>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  <strong className="text-white">Canvas 2D渲染</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                  <li>面向对象粒子系统</li>
                  <li>基于物理的运动模拟</li>
                  <li>生命周期管理</li>
                  <li>实时性能监控</li>
                </ul>
                <p className="mt-3 text-xs text-gray-400">
                  性能目标: 60FPS @ 200粒子
                  <br />
                  降级策略: 当FPS&lt;30时自动减少粒子
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
