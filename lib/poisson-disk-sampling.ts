/**
 * Poisson Disk Sampling Algorithm
 * 基于 Bridson's Algorithm 实现
 * 用于全球草原花园的植物布局，确保植物均匀分布且不重叠
 *
 * 参考: https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf
 *
 * @author Claude Code
 * @date 2025-11-14
 */

export interface Point {
  x: number
  y: number
}

export interface PoissonDiskOptions {
  width: number // 区域宽度
  height: number // 区域高度
  minDistance: number // 最小间距
  maxAttempts?: number // 每个点的最大尝试次数(默认30)
  seed?: number // 随机种子(可选)
}

export interface PlantPosition extends Point {
  radius: number // 植物占用半径
  plantId?: string // 植物ID(可选)
  growthLevel?: 1 | 2 | 3 | 4 // 生长等级(可选)
}

/**
 * Poisson Disk Sampling 主类
 *
 * 算法原理:
 * 1. 将空间划分为网格(cell size = minDistance / sqrt(2))
 * 2. 选择初始样本点并加入active列表
 * 3. 从active列表随机选点，尝试在其周围生成新点(环形区域: r~2r)
 * 4. 验证新点与所有已有点的距离 > minDistance
 * 5. 如果找到有效点，加入active列表；否则从active移除当前点
 * 6. 重复直到active列表为空
 *
 * 时间复杂度: O(n)
 * 空间复杂度: O(n)
 */
export class PoissonDiskSampling {
  private readonly width: number
  private readonly height: number
  private readonly minDistance: number
  private readonly maxAttempts: number
  private readonly cellSize: number
  private readonly gridWidth: number
  private readonly gridHeight: number
  private readonly grid: (Point | null)[][]
  private rng: () => number // Random Number Generator

  constructor(options: PoissonDiskOptions) {
    this.width = options.width
    this.height = options.height
    this.minDistance = options.minDistance
    this.maxAttempts = options.maxAttempts || 30

    // Grid cell size = minDistance / sqrt(2)
    // 这确保了每个cell最多包含一个点
    this.cellSize = this.minDistance / Math.sqrt(2)
    this.gridWidth = Math.ceil(this.width / this.cellSize)
    this.gridHeight = Math.ceil(this.height / this.cellSize)

    // 初始化网格
    this.grid = Array(this.gridHeight)
      .fill(null)
      .map(() => Array(this.gridWidth).fill(null))

    // 设置随机数生成器
    if (options.seed !== undefined) {
      this.rng = this.seededRandom(options.seed)
    } else {
      this.rng = Math.random
    }
  }

  /**
   * 生成样本点
   * @returns 均匀分布的点数组
   */
  generate(): Point[] {
    const points: Point[] = []
    const activeList: Point[] = []

    // Step 1: 选择初始样本点
    const initial: Point = {
      x: this.rng() * this.width,
      y: this.rng() * this.height
    }
    points.push(initial)
    activeList.push(initial)
    this.insertIntoGrid(initial)

    // Step 2: 处理active列表
    while (activeList.length > 0) {
      // 随机选择一个active点
      const randomIndex = Math.floor(this.rng() * activeList.length)
      const point = activeList[randomIndex]
      let found = false

      // 尝试在该点周围生成新点
      for (let i = 0; i < this.maxAttempts; i++) {
        const newPoint = this.generateRandomPointAround(point)

        // 验证新点
        if (this.isValid(newPoint) && this.isDistanceValid(newPoint)) {
          points.push(newPoint)
          activeList.push(newPoint)
          this.insertIntoGrid(newPoint)
          found = true
          break
        }
      }

      // 如果没有找到有效点，从active列表移除
      if (!found) {
        activeList.splice(randomIndex, 1)
      }
    }

    return points
  }

  /**
   * 在给定点周围生成随机点
   * 点位于环形区域: [minDistance, 2*minDistance]
   */
  private generateRandomPointAround(point: Point): Point {
    // 随机角度
    const angle = this.rng() * 2 * Math.PI
    // 随机半径 (minDistance ~ 2*minDistance)
    const radius = this.minDistance * (1 + this.rng())

    return {
      x: point.x + radius * Math.cos(angle),
      y: point.y + radius * Math.sin(angle)
    }
  }

  /**
   * 检查点是否在边界内
   */
  private isValid(point: Point): boolean {
    return (
      point.x >= 0 &&
      point.x < this.width &&
      point.y >= 0 &&
      point.y < this.height
    )
  }

  /**
   * 检查点与所有已有点的距离是否满足最小距离要求
   * 使用网格加速查找，只检查周围的cell
   */
  private isDistanceValid(point: Point): boolean {
    const gridX = Math.floor(point.x / this.cellSize)
    const gridY = Math.floor(point.y / this.cellSize)

    // 检查周围5x5网格的cell
    // 由于 cellSize = minDistance / sqrt(2)，
    // 检查5x5范围足以覆盖所有可能小于minDistance的点
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = gridX + dx
        const ny = gridY + dy

        // 边界检查
        if (
          nx >= 0 &&
          nx < this.gridWidth &&
          ny >= 0 &&
          ny < this.gridHeight
        ) {
          const neighbor = this.grid[ny][nx]
          if (neighbor) {
            const dist = this.distance(point, neighbor)
            if (dist < this.minDistance) {
              return false
            }
          }
        }
      }
    }

    return true
  }

  /**
   * 将点插入网格
   */
  private insertIntoGrid(point: Point): void {
    const gridX = Math.floor(point.x / this.cellSize)
    const gridY = Math.floor(point.y / this.cellSize)
    this.grid[gridY][gridX] = point
  }

  /**
   * 计算两点之间的欧几里得距离
   */
  private distance(a: Point, b: Point): number {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * 生成可复现的伪随机数
   * 使用简单的线性同余生成器(LCG)
   */
  private seededRandom(seed: number): () => number {
    let state = seed
    return () => {
      // Park-Miller PRNG
      state = (state * 48271) % 2147483647
      return state / 2147483647
    }
  }

  /**
   * 获取网格信息(用于调试)
   */
  getGridInfo() {
    return {
      width: this.gridWidth,
      height: this.gridHeight,
      cellSize: this.cellSize,
      totalCells: this.gridWidth * this.gridHeight,
      occupiedCells: this.grid.flat().filter((cell) => cell !== null).length
    }
  }
}

/**
 * 便捷函数: 生成Poisson Disk样本点
 */
export function generatePoissonDiskSamples(
  options: PoissonDiskOptions
): Point[] {
  const sampler = new PoissonDiskSampling(options)
  return sampler.generate()
}

/**
 * 便捷函数: 为植物生成布局位置
 * 根据植物等级自动计算半径
 */
export function generatePlantLayout(
  plants: Array<{ id: string; level: 1 | 2 | 3 | 4 }>,
  bounds: { width: number; height: number },
  baseRadius: number = 50
): PlantPosition[] {
  // 计算每个植物的半径
  const plantRadii = plants.map((plant) => {
    const radiusMultiplier = [1, 1.6, 2.4, 3.2] // level 1~4
    return baseRadius * radiusMultiplier[plant.level - 1]
  })

  // 使用最大半径计算最小间距
  const maxRadius = Math.max(...plantRadii)
  const minDistance = maxRadius * 2.2 // 留出20%间隙

  // 生成位置
  const sampler = new PoissonDiskSampling({
    width: bounds.width,
    height: bounds.height,
    minDistance,
    maxAttempts: 30
  })
  const positions = sampler.generate()

  // 将位置和植物信息结合
  return positions.slice(0, plants.length).map((pos, index) => ({
    x: pos.x,
    y: pos.y,
    radius: plantRadii[index],
    plantId: plants[index].id,
    growthLevel: plants[index].level
  }))
}

/**
 * 性能测试函数
 */
export function benchmarkPoissonDisk(options: {
  sizes: Array<{ width: number; height: number }>
  minDistances: number[]
  iterations?: number
}): Array<{
  width: number
  height: number
  minDistance: number
  pointCount: number
  avgTime: number
  minTime: number
  maxTime: number
}> {
  const results: Array<{
    width: number
    height: number
    minDistance: number
    pointCount: number
    avgTime: number
    minTime: number
    maxTime: number
  }> = []

  const iterations = options.iterations || 10

  for (const size of options.sizes) {
    for (const minDistance of options.minDistances) {
      const times: number[] = []
      let avgPointCount = 0

      for (let i = 0; i < iterations; i++) {
        const start = performance.now()
        const sampler = new PoissonDiskSampling({
          width: size.width,
          height: size.height,
          minDistance
        })
        const points = sampler.generate()
        const end = performance.now()

        times.push(end - start)
        avgPointCount += points.length
      }

      avgPointCount = Math.round(avgPointCount / iterations)

      results.push({
        width: size.width,
        height: size.height,
        minDistance,
        pointCount: avgPointCount,
        avgTime: times.reduce((a, b) => a + b, 0) / times.length,
        minTime: Math.min(...times),
        maxTime: Math.max(...times)
      })
    }
  }

  return results
}

/**
 * 可视化工具: 生成Canvas绘制代码
 */
export function drawPoissonDiskSamples(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  options?: {
    pointColor?: string
    pointRadius?: number
    showConnections?: boolean
    connectionColor?: string
  }
): void {
  const {
    pointColor = '#7CB342',
    pointRadius = 3,
    showConnections = false,
    connectionColor = 'rgba(124, 179, 66, 0.1)'
  } = options || {}

  // 绘制点
  ctx.fillStyle = pointColor
  for (const point of points) {
    ctx.beginPath()
    ctx.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI)
    ctx.fill()
  }

  // 可选: 绘制连接线(Delaunay三角化)
  if (showConnections && points.length > 3) {
    ctx.strokeStyle = connectionColor
    ctx.lineWidth = 1

    // 简单的最近邻连接(实际项目中应使用Delaunay库)
    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      let nearestDist = Infinity
      let nearestPoint: Point | null = null

      for (let j = 0; j < points.length; j++) {
        if (i === j) continue
        const other = points[j]
        const dx = point.x - other.x
        const dy = point.y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < nearestDist) {
          nearestDist = dist
          nearestPoint = other
        }
      }

      if (nearestPoint) {
        ctx.beginPath()
        ctx.moveTo(point.x, point.y)
        ctx.lineTo(nearestPoint.x, nearestPoint.y)
        ctx.stroke()
      }
    }
  }
}
