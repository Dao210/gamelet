/**
 * PlantLayer Component
 * 文档来源: Action Plan - Module 4.4
 *
 * 植物层组件，使用虚拟滚动渲染500+植物
 * - @tanstack/react-virtual 实现高性能滚动
 * - 按 Y 坐标分组成行
 * - 集成 PlantCard 组件
 * - 处理浇水交互和API调用
 */

'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import PlantCard, { PlantData } from '../plant/PlantCard'
import { getGrasslandAnonymousUserId } from '@/lib/grassland-anonymous-user'

interface PlantLayerProps {
  /** 初始植物数据 (可选，用于SSR) */
  initialPlants?: PlantData[]
  /** 行高 (px) */
  rowHeight?: number
  /** 是否启用无限滚动 */
  enableInfiniteScroll?: boolean
  /** 自定义类名 */
  className?: string
}

interface PlantRow {
  y: number
  plants: PlantData[]
}

/**
 * 将植物按 Y 坐标分组成行
 */
function groupPlantsIntoRows(plants: PlantData[], rowHeight: number = 200): PlantRow[] {
  const rowMap = new Map<number, PlantData[]>()

  plants.forEach((plant) => {
    const rowIndex = Math.floor(plant.positionY / rowHeight)
    if (!rowMap.has(rowIndex)) {
      rowMap.set(rowIndex, [])
    }
    rowMap.get(rowIndex)!.push(plant)
  })

  // 转换为数组并排序
  return Array.from(rowMap.entries())
    .map(([rowIndex, plants]) => ({
      y: rowIndex * rowHeight,
      plants
    }))
    .sort((a, b) => a.y - b.y)
}

export default function PlantLayer({
  initialPlants = [],
  rowHeight = 200,
  enableInfiniteScroll = true,
  className = ''
}: PlantLayerProps) {
  const [plants, setPlants] = useState<PlantData[]>(initialPlants)
  const [rows, setRows] = useState<PlantRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [wateredToday, setWateredToday] = useState<Set<string>>(new Set())

  const parentRef = useRef<HTMLDivElement>(null)

  // 分组植物成行
  useEffect(() => {
    const grouped = groupPlantsIntoRows(plants, rowHeight)
    setRows(grouped)
  }, [plants, rowHeight])

  // 虚拟滚动配置
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 3 // 预渲染前后3行
  })

  /**
   * 获取植物数据
   */
  const fetchPlants = useCallback(
    async (pageNum: number = 1) => {
      if (isLoading) return

      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/grassland/plants?page=${pageNum}&limit=50&sort=latest`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch plants')
        }

        const data = await response.json()

        if (pageNum === 1) {
          setPlants(data.data || [])
        } else {
          setPlants((prev) => [...prev, ...(data.data || [])])
        }

        // 检查是否还有更多数据
        if (!data.data || data.data.length < 50) {
          setHasMore(false)
        }
      } catch (error) {
        console.error('Error fetching plants:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading]
  )

  // 初始加载
  useEffect(() => {
    if (initialPlants.length === 0) {
      fetchPlants(1)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 无限滚动
  useEffect(() => {
    if (!enableInfiniteScroll || !hasMore) return

    const lastItem = rowVirtualizer.getVirtualItems().slice(-1)[0]
    if (!lastItem) return

    // 当滚动到最后3行时加载更多
    if (lastItem.index >= rows.length - 3 && !isLoading && hasMore) {
      setPage((prev) => prev + 1)
      fetchPlants(page + 1)
    }
  }, [rowVirtualizer, rows.length, isLoading, hasMore, enableInfiniteScroll, fetchPlants, page])

  /**
   * 处理浇水
   */
  const handleWater = useCallback(async (plantId: string) => {
    try {
      const userId = getGrasslandAnonymousUserId()

      const response = await fetch('/api/grassland/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantId,
          userId
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to water plant')
      }

      // 标记今天已浇水
      setWateredToday((prev) => new Set(prev).add(plantId))

      // 更新植物XP和等级
      if (result.data) {
        setPlants((prev) =>
          prev.map((p) =>
            p.id === plantId
              ? {
                  ...p,
                  xp: result.data.newXP || p.xp,
                  level: result.data.newLevel || p.level,
                  waterCount: p.waterCount + 1
                }
              : p
          )
        )
      }

      return {
        xpGained: result.data?.xpGained,
        leveledUp: result.data?.leveledUp,
        newLevel: result.data?.newLevel
      }
    } catch (error: unknown) {
      const err = error as Error
      console.error('Watering error:', err)
      alert(err.message || 'Failed to water plant')
      return {}
    }
  }, [])

  /**
   * 处理植物点击
   */
  const handlePlantClick = useCallback((plantId: string) => {
    // TODO: 导航到植物详情页
    console.log('Plant clicked:', plantId)
  }, [])

  return (
    <div
      ref={parentRef}
      className={`plant-layer absolute inset-0 overflow-auto ${className}`}
      style={{ zIndex: 10 }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index]
          if (!row) return null

          return (
            <div
              key={virtualRow.index}
              className="plant-row absolute top-0 left-0 w-full"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              {/* 渲染该行的所有植物 */}
              {row.plants.map((plant) => (
                <div
                  key={plant.id}
                  className="absolute"
                  style={{
                    left: `${plant.positionX}px`,
                    top: `${plant.positionY - row.y}px`
                  }}
                >
                  <PlantCard
                    plant={plant}
                    hasWateredToday={wateredToday.has(plant.id)}
                    onWater={handleWater}
                    onClick={handlePlantClick}
                  />
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* 加载指示器 */}
      {isLoading && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-700">Loading plants...</span>
          </div>
        </div>
      )}
    </div>
  )
}
