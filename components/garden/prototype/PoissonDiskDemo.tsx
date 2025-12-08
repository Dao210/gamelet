/**
 * Poisson Disk Sampling 可视化演示组件
 * 用于技术预研：展示植物布局算法效果
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import {
  PoissonDiskSampling,
  drawPoissonDiskSamples,
  benchmarkPoissonDisk,
  generatePlantLayout,
  type Point
} from '@/lib/poisson-disk-sampling'

interface DemoConfig {
  width: number
  height: number
  minDistance: number
  maxAttempts: number
  showConnections: boolean
}

export default function PoissonDiskDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [config, setConfig] = useState<DemoConfig>({
    width: 800,
    height: 600,
    minDistance: 50,
    maxAttempts: 30,
    showConnections: false
  })
  const [points, setPoints] = useState<Point[]>([])
  const [stats, setStats] = useState({
    pointCount: 0,
    generationTime: 0,
    gridInfo: {
      width: 0,
      height: 0,
      cellSize: 0,
      totalCells: 0,
      occupiedCells: 0
    }
  })
  const [benchmarkResults, setBenchmarkResults] = useState<Array<{
    width: number
    height: number
    minDistance: number
    pointCount: number
    avgTime: number
    minTime: number
    maxTime: number
  }>>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // 生成样本点
  const generateSamples = () => {
    setIsGenerating(true)
    const start = performance.now()

    const sampler = new PoissonDiskSampling({
      width: config.width,
      height: config.height,
      minDistance: config.minDistance,
      maxAttempts: config.maxAttempts
    })

    const newPoints = sampler.generate()
    const end = performance.now()

    setPoints(newPoints)
    setStats({
      pointCount: newPoints.length,
      generationTime: end - start,
      gridInfo: sampler.getGridInfo()
    })
    setIsGenerating(false)
  }

  // 绘制到Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 清空画布
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制网格(可选)
    if (config.showConnections) {
      const cellSize = config.minDistance / Math.sqrt(2)
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 0.5

      for (let x = 0; x < canvas.width; x += cellSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += cellSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    // 绘制样本点
    drawPoissonDiskSamples(ctx, points, {
      pointColor: '#7CB342',
      pointRadius: 4,
      showConnections: config.showConnections,
      connectionColor: 'rgba(124, 179, 66, 0.15)'
    })

    // 绘制最小距离圆(仅显示前10个点)
    if (points.length > 0 && points.length <= 50) {
      ctx.strokeStyle = 'rgba(102, 126, 234, 0.2)'
      ctx.lineWidth = 1
      for (let i = 0; i < Math.min(points.length, 10); i++) {
        const point = points[i]
        ctx.beginPath()
        ctx.arc(point.x, point.y, config.minDistance, 0, 2 * Math.PI)
        ctx.stroke()
      }
    }
  }, [points, config.showConnections, config.minDistance])

  // 初始生成
  useEffect(() => {
    generateSamples()
  }, [config.width, config.height, config.minDistance, config.maxAttempts])

  // 运行性能测试
  const runBenchmark = () => {
    const results = benchmarkPoissonDisk({
      sizes: [
        { width: 800, height: 600 },
        { width: 1920, height: 1080 },
        { width: 1920, height: 5000 }
      ],
      minDistances: [30, 50, 80, 120],
      iterations: 5
    })
    setBenchmarkResults(results)
  }

  // 测试植物布局
  const testPlantLayout = () => {
    const mockPlants = Array.from({ length: 50 }, (_, i) => ({
      id: `plant-${i}`,
      level: (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4
    }))

    const start = performance.now()
    const layout = generatePlantLayout(mockPlants, {
      width: config.width,
      height: config.height
    })
    const end = performance.now()

    // 将PlantPosition转换为Point用于绘制
    const layoutPoints: Point[] = layout.map((p) => ({ x: p.x, y: p.y }))
    setPoints(layoutPoints)
    setStats({
      pointCount: layout.length,
      generationTime: end - start,
      gridInfo: stats.gridInfo
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Poisson Disk Sampling 技术预研
          </h1>
          <p className="text-gray-600">
            全球草原花园 - 植物布局算法原型演示
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas区域 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  可视化演示
                </h2>
                <button
                  onClick={generateSamples}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all"
                >
                  {isGenerating ? '生成中...' : '重新生成'}
                </button>
              </div>
              <canvas
                ref={canvasRef}
                width={config.width}
                height={config.height}
                className="border border-gray-200 rounded-lg w-full"
              />

              {/* 统计信息 */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">样本点数量</div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.pointCount}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">生成时间</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.generationTime.toFixed(2)}ms
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">网格大小</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.gridInfo.width}x{stats.gridInfo.height}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">占用率</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.gridInfo.totalCells > 0
                      ? (
                          (stats.gridInfo.occupiedCells /
                            stats.gridInfo.totalCells) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 控制面板 */}
          <div className="space-y-6">
            {/* 参数调整 */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                参数调整
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最小间距: {config.minDistance}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="150"
                    step="10"
                    value={config.minDistance}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        minDistance: Number(e.target.value)
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最大尝试次数: {config.maxAttempts}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={config.maxAttempts}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        maxAttempts: Number(e.target.value)
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showConnections"
                    checked={config.showConnections}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        showConnections: e.target.checked
                      })
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="showConnections"
                    className="text-sm font-medium text-gray-700"
                  >
                    显示网格/连接
                  </label>
                </div>
              </div>
            </div>

            {/* 测试功能 */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                测试功能
              </h2>

              <div className="space-y-3">
                <button
                  onClick={testPlantLayout}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
                >
                  测试植物布局
                </button>

                <button
                  onClick={runBenchmark}
                  className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  运行性能测试
                </button>
              </div>

              {/* 性能测试结果 */}
              {benchmarkResults.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    性能测试结果:
                  </h3>
                  <div className="text-xs space-y-1 max-h-64 overflow-y-auto">
                    {benchmarkResults.map((result, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded p-2 border border-gray-200"
                      >
                        <div className="font-semibold text-gray-700">
                          {result.width}x{result.height}, minDist:{' '}
                          {result.minDistance}
                        </div>
                        <div className="text-gray-600">
                          点数: {result.pointCount} | 平均:{' '}
                          {result.avgTime.toFixed(2)}ms | 最小:{' '}
                          {result.minTime.toFixed(2)}ms | 最大:{' '}
                          {result.maxTime.toFixed(2)}ms
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 算法说明 */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                算法说明
              </h2>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Bridson算法</strong>用于生成均匀分布的样本点:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>时间复杂度: O(n)</li>
                  <li>空间复杂度: O(n)</li>
                  <li>保证最小间距</li>
                  <li>分布均匀自然</li>
                </ul>
                <p className="mt-3">
                  <strong>应用场景:</strong>
                  草原花园中确保植物不重叠且分布美观。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
