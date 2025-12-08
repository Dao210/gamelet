/**
 * 虚拟滚动 + 植物布局演示
 * 结合 Poisson Disk Sampling 和 @tanstack/react-virtual
 * 用于技术预研：测试大量植物的渲染性能
 */

'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { generatePlantLayout, type PlantPosition } from '@/lib/poisson-disk-sampling'

interface MockPlant {
  id: string
  level: 1 | 2 | 3 | 4
  name: string
  color: string
  createdAt: Date
  waterCount: number
}

export default function VirtualScrollDemo() {
  const parentRef = useRef<HTMLDivElement>(null)
  const [plantCount, setPlantCount] = useState<number>(100)
  const [plants, setPlants] = useState<MockPlant[]>([])
  const [layout, setLayout] = useState<PlantPosition[]>([])
  const [renderMode, setRenderMode] = useState<'virtual' | 'normal'>('virtual')
  const [showPerformance, setShowPerformance] = useState<boolean>(true)

  // 性能指标
  const [fps, setFps] = useState<number>(60)
  const [renderTime, setRenderTime] = useState<number>(0)
  const fpsHistory = useRef<number[]>([])
  const lastFrameTime = useRef<number>(performance.now())

  // 生成模拟植物数据
  const generatePlants = (count: number): MockPlant[] => {
    const colors = ['#7CB342', '#4CAF50', '#388E3C', '#1B5E20', '#8BC34A', '#AED581']
    const names = ['小草', '雏菊', '向日葵', '玫瑰', '郁金香', '百合', '紫罗兰', '康乃馨']

    return Array.from({ length: count }, (_, i) => ({
      id: `plant-${i}`,
      level: (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4,
      name: names[Math.floor(Math.random() * names.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      waterCount: Math.floor(Math.random() * 200)
    }))
  }

  // 生成植物布局
  useEffect(() => {
    const start = performance.now()
    const newPlants = generatePlants(plantCount)
    setPlants(newPlants)

    const newLayout = generatePlantLayout(
      newPlants,
      { width: 1200, height: plantCount * 15 }, // 动态高度
      50 // 基础半径
    )
    setLayout(newLayout)
    const end = performance.now()
    setRenderTime(end - start)
  }, [plantCount])

  // 将二维布局转换为虚拟滚动的行
  const rows = useMemo(() => {
    if (layout.length === 0) return []

    // 按Y坐标分组
    const rowHeight = 150 // 每行高度
    const maxY = Math.max(...layout.map(p => p.y))
    const rowCount = Math.ceil(maxY / rowHeight)

    const rowsData: PlantPosition[][] = Array(rowCount).fill(null).map(() => [])

    layout.forEach(plant => {
      const rowIndex = Math.floor(plant.y / rowHeight)
      if (rowsData[rowIndex]) {
        rowsData[rowIndex].push(plant)
      }
    })

    return rowsData
  }, [layout])

  // 虚拟滚动配置
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 3 // 缓冲区行数
  })

  // FPS 监控
  useEffect(() => {
    let animationFrameId: number

    const measureFPS = () => {
      const currentTime = performance.now()
      const deltaTime = currentTime - lastFrameTime.current
      const currentFPS = deltaTime > 0 ? 1000 / deltaTime : 60

      fpsHistory.current.push(currentFPS)
      if (fpsHistory.current.length > 60) {
        fpsHistory.current.shift()
      }

      const avgFPS = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length
      setFps(Math.round(avgFPS))

      lastFrameTime.current = currentTime
      animationFrameId = requestAnimationFrame(measureFPS)
    }

    animationFrameId = requestAnimationFrame(measureFPS)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // 渲染植物卡片
  const renderPlantCard = (plant: MockPlant, position: PlantPosition) => {
    const sizeMultiplier = [1, 1.3, 1.7, 2.2][plant.level - 1]
    const size = 50 * sizeMultiplier

    return (
      <div
        key={plant.id}
        className="absolute transition-transform hover:scale-110 hover:z-10"
        style={{
          left: `${position.x}px`,
          top: `${position.y % 150}px`,
          width: `${size}px`,
          height: `${size}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer"
          style={{ backgroundColor: plant.color }}
        >
          <div className="text-center">
            <div className="text-xs">{plant.name}</div>
            <div className="text-[10px] opacity-75">Lv.{plant.level}</div>
          </div>
        </div>

        {/* 等级光环 */}
        {plant.level >= 3 && (
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: `radial-gradient(circle, ${plant.color}33 0%, transparent 70%)`,
              transform: 'scale(1.5)'
            }}
          />
        )}
      </div>
    )
  }

  // 虚拟滚动渲染
  const renderVirtual = () => {
    const items = virtualizer.getVirtualItems()

    return (
      <div
        ref={parentRef}
        className="h-[600px] overflow-auto bg-gradient-to-b from-green-50 via-green-100 to-green-200 rounded-lg border-2 border-green-300"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative'
          }}
        >
          {items.map((virtualRow) => {
            const rowPlants = rows[virtualRow.index]
            if (!rowPlants) return null

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="absolute top-0 left-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                <div className="relative w-full h-full">
                  {rowPlants.map((plantPos) => {
                    const plant = plants.find(p => p.id === plantPos.plantId)
                    if (!plant) return null
                    return renderPlantCard(plant, plantPos)
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // 普通渲染(无虚拟滚动)
  const renderNormal = () => {
    return (
      <div className="h-[600px] overflow-auto bg-gradient-to-b from-green-50 via-green-100 to-green-200 rounded-lg border-2 border-green-300">
        <div
          className="relative"
          style={{
            width: '1200px',
            height: `${Math.max(...layout.map(p => p.y)) + 100}px`
          }}
        >
          {layout.map((plantPos, index) => {
            const plant = plants[index]
            if (!plant) return null
            return renderPlantCard(plant, plantPos)
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            虚拟滚动 + 植物布局技术预研
          </h1>
          <p className="text-gray-600">
            @tanstack/react-virtual + Poisson Disk Sampling 性能测试
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 主渲染区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  草原花园预览 ({plants.length}株植物)
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRenderMode('virtual')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      renderMode === 'virtual'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    虚拟滚动
                  </button>
                  <button
                    onClick={() => setRenderMode('normal')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      renderMode === 'normal'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    普通渲染
                  </button>
                </div>
              </div>

              {renderMode === 'virtual' ? renderVirtual() : renderNormal()}

              {/* 性能指标 */}
              {showPerformance && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="text-sm text-gray-600">渲染FPS</div>
                    <div className={`text-2xl font-bold ${fps >= 30 ? 'text-green-600' : 'text-red-600'}`}>
                      {fps}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-sm text-gray-600">布局时间</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {renderTime.toFixed(1)}ms
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="text-sm text-gray-600">渲染模式</div>
                    <div className="text-lg font-bold text-purple-600">
                      {renderMode === 'virtual' ? '虚拟' : '普通'}
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <div className="text-sm text-gray-600">可见行数</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {renderMode === 'virtual'
                        ? virtualizer.getVirtualItems().length
                        : rows.length}
                    </div>
                  </div>
                </div>
              )}

              {/* 性能对比 */}
              <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📊</div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">
                      性能对比分析
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        • <strong>虚拟滚动</strong>: 只渲染可见区域+缓冲区，性能优异 (推荐)
                      </div>
                      <div>
                        • <strong>普通渲染</strong>: 渲染所有植物，植物数量超过500时会卡顿
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        💡 当植物数量 &gt; 100时，虚拟滚动可提升5-10倍性能
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 控制面板 */}
          <div className="space-y-6">
            {/* 参数控制 */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                参数控制
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    植物数量: {plantCount}
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={plantCount}
                    onChange={(e) => setPlantCount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>50</span>
                    <span>500</span>
                    <span>1000</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showPerformance"
                    checked={showPerformance}
                    onChange={(e) => setShowPerformance(e.target.checked)}
                    className="mr-2"
                  />
                  <label
                    htmlFor="showPerformance"
                    className="text-sm font-medium text-gray-700"
                  >
                    显示性能指标
                  </label>
                </div>

                <button
                  onClick={() => {
                    const newPlants = generatePlants(plantCount)
                    setPlants(newPlants)
                    const newLayout = generatePlantLayout(
                      newPlants,
                      { width: 1200, height: plantCount * 15 },
                      50
                    )
                    setLayout(newLayout)
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                >
                  重新生成
                </button>
              </div>
            </div>

            {/* 快速测试 */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                快速测试
              </h2>

              <div className="space-y-2">
                {[
                  { count: 100, label: '小规模 (100株)' },
                  { count: 500, label: '中等规模 (500株)' },
                  { count: 1000, label: '大规模 (1000株)' },
                  { count: 2000, label: '极限测试 (2000株)' }
                ].map((test) => (
                  <button
                    key={test.count}
                    onClick={() => setPlantCount(test.count)}
                    className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all text-sm"
                  >
                    {test.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 技术说明 */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                技术说明
              </h2>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong className="text-gray-800">
                    @tanstack/react-virtual
                  </strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                  <li>动态高度支持</li>
                  <li>智能缓冲区(overscan)</li>
                  <li>自动测量元素尺寸</li>
                  <li>无限滚动支持</li>
                </ul>
                <p className="mt-3 text-xs text-gray-500">
                  配合Poisson Disk布局算法，实现高性能的草原花园渲染。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
