/**
 * Canvas 粒子系统基类
 * 用于全球草原花园的自然元素效果(雨、雪、水花等)
 *
 * @author Claude Code
 * @date 2025-11-14
 */

export interface Particle {
  x: number
  y: number
  vx: number // X方向速度
  vy: number // Y方向速度
  life: number // 生命值 (0-1)
  maxLife: number // 最大生命值
  opacity: number // 透明度 (0-1)
  size: number // 尺寸
  color?: string // 颜色
  rotation?: number // 旋转角度
  rotationSpeed?: number // 旋转速度
}

export interface ParticleSystemOptions {
  maxParticles: number // 最大粒子数量
  emissionRate: number // 发射速率(粒子/秒)
  particleLife: number // 粒子生命周期(秒)
  gravity?: number // 重力加速度
  wind?: number // 风力
  bounds?: { width: number; height: number } // 边界
}

export interface ParticleSystemStats {
  activeParticles: number
  totalParticles: number
  fps: number
  frameTime: number
  drawCalls: number
}

/**
 * 粒子系统基类
 * 提供粒子生命周期管理、物理更新、渲染等功能
 */
export abstract class ParticleSystem {
  protected particles: Particle[] = []
  protected maxParticles: number
  protected emissionRate: number
  protected particleLife: number
  protected gravity: number
  protected wind: number
  protected bounds: { width: number; height: number }

  // 性能统计
  protected lastFrameTime: number = 0
  protected frameCount: number = 0
  protected fps: number = 60
  protected drawCalls: number = 0

  // 发射累积器
  private emissionAccumulator: number = 0

  constructor(options: ParticleSystemOptions) {
    this.maxParticles = options.maxParticles
    this.emissionRate = options.emissionRate
    this.particleLife = options.particleLife
    this.gravity = options.gravity || 0
    this.wind = options.wind || 0
    this.bounds = options.bounds || { width: 800, height: 600 }
  }

  /**
   * 抽象方法: 创建新粒子
   * 子类必须实现
   */
  protected abstract createParticle(): Particle

  /**
   * 抽象方法: 绘制单个粒子
   * 子类必须实现
   */
  protected abstract drawParticle(
    ctx: CanvasRenderingContext2D,
    particle: Particle
  ): void

  /**
   * 发射粒子
   */
  protected emit(count: number = 1): void {
    for (let i = 0; i < count; i++) {
      if (this.particles.length < this.maxParticles) {
        this.particles.push(this.createParticle())
      }
    }
  }

  /**
   * 更新粒子系统
   * @param deltaTime 时间增量(秒)
   */
  update(deltaTime: number): void {
    // 根据发射速率发射粒子
    this.emissionAccumulator += deltaTime * this.emissionRate
    const particlesToEmit = Math.floor(this.emissionAccumulator)
    if (particlesToEmit > 0) {
      this.emit(particlesToEmit)
      this.emissionAccumulator -= particlesToEmit
    }

    // 更新所有粒子
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i]

      // 应用物理
      particle.vy += this.gravity * deltaTime
      particle.vx += this.wind * deltaTime

      // 更新位置
      particle.x += particle.vx * deltaTime
      particle.y += particle.vy * deltaTime

      // 更新旋转
      if (particle.rotation !== undefined && particle.rotationSpeed) {
        particle.rotation += particle.rotationSpeed * deltaTime
      }

      // 更新生命值
      particle.life -= deltaTime
      particle.opacity = Math.max(0, particle.life / particle.maxLife)

      // 移除死亡粒子
      if (particle.life <= 0 || this.isOutOfBounds(particle)) {
        this.particles.splice(i, 1)
      }
    }
  }

  /**
   * 渲染粒子系统
   */
  render(ctx: CanvasRenderingContext2D): void {
    const startTime = performance.now()
    this.drawCalls = 0

    for (const particle of this.particles) {
      this.drawParticle(ctx, particle)
      this.drawCalls++
    }

    // 更新性能统计
    const endTime = performance.now()
    const frameTime = endTime - startTime
    this.frameCount++

    if (endTime - this.lastFrameTime >= 1000) {
      this.fps = this.frameCount
      this.frameCount = 0
      this.lastFrameTime = endTime
    }
  }

  /**
   * 检查粒子是否超出边界
   */
  protected isOutOfBounds(particle: Particle): boolean {
    return (
      particle.x < -100 ||
      particle.x > this.bounds.width + 100 ||
      particle.y < -100 ||
      particle.y > this.bounds.height + 100
    )
  }

  /**
   * 获取性能统计
   */
  getStats(): ParticleSystemStats {
    return {
      activeParticles: this.particles.length,
      totalParticles: this.particles.length,
      fps: this.fps,
      frameTime: 0,
      drawCalls: this.drawCalls
    }
  }

  /**
   * 清空所有粒子
   */
  clear(): void {
    this.particles = []
  }

  /**
   * 设置边界
   */
  setBounds(width: number, height: number): void {
    this.bounds = { width, height }
  }

  /**
   * 设置物理参数
   */
  setPhysics(gravity?: number, wind?: number): void {
    if (gravity !== undefined) this.gravity = gravity
    if (wind !== undefined) this.wind = wind
  }
}

/**
 * 雨滴粒子系统
 */
export class RainParticleSystem extends ParticleSystem {
  private rainColor: string = 'rgba(174, 213, 129, 0.6)'
  private rainLength: number = 20
  private rainAngle: number = 75 // 倾斜角度

  constructor(options?: Partial<ParticleSystemOptions>) {
    super({
      maxParticles: 200,
      emissionRate: 50,
      particleLife: 3,
      gravity: 400,
      wind: 20,
      bounds: { width: 800, height: 600 },
      ...options
    })
  }

  protected createParticle(): Particle {
    return {
      x: Math.random() * (this.bounds.width + 200) - 100,
      y: -20,
      vx: Math.cos((this.rainAngle * Math.PI) / 180) * 300,
      vy: Math.sin((this.rainAngle * Math.PI) / 180) * 300,
      life: this.particleLife,
      maxLife: this.particleLife,
      opacity: 0.6,
      size: 2 + Math.random() * 1,
      color: this.rainColor
    }
  }

  protected drawParticle(
    ctx: CanvasRenderingContext2D,
    particle: Particle
  ): void {
    ctx.save()
    ctx.globalAlpha = particle.opacity
    ctx.strokeStyle = particle.color || this.rainColor
    ctx.lineWidth = particle.size

    const endX = particle.x - Math.cos((this.rainAngle * Math.PI) / 180) * this.rainLength
    const endY = particle.y - Math.sin((this.rainAngle * Math.PI) / 180) * this.rainLength

    ctx.beginPath()
    ctx.moveTo(particle.x, particle.y)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    ctx.restore()
  }

  setRainAngle(angle: number): void {
    this.rainAngle = angle
  }

  setRainColor(color: string): void {
    this.rainColor = color
  }
}

/**
 * 水花粒子系统
 * 用于浇水动画效果
 */
export class SplashParticleSystem extends ParticleSystem {
  private splashColor: string = '#64B5F6'
  private centerX: number = 0
  private centerY: number = 0

  constructor(options?: Partial<ParticleSystemOptions>) {
    super({
      maxParticles: 30,
      emissionRate: 0, // 手动触发
      particleLife: 0.8,
      gravity: 800,
      wind: 0,
      bounds: { width: 800, height: 600 },
      ...options
    })
  }

  protected createParticle(): Particle {
    // 从中心点向四周爆发
    const angle = Math.random() * 2 * Math.PI
    const speed = 100 + Math.random() * 150

    return {
      x: this.centerX,
      y: this.centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 100, // 向上喷发
      life: this.particleLife,
      maxLife: this.particleLife,
      opacity: 0.8,
      size: 3 + Math.random() * 4,
      color: this.splashColor
    }
  }

  protected drawParticle(
    ctx: CanvasRenderingContext2D,
    particle: Particle
  ): void {
    ctx.save()
    ctx.globalAlpha = particle.opacity
    ctx.fillStyle = particle.color || this.splashColor

    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI)
    ctx.fill()
    ctx.restore()
  }

  /**
   * 触发水花效果
   */
  splash(x: number, y: number, count: number = 15): void {
    this.centerX = x
    this.centerY = y
    this.emit(count)
  }

  setSplashColor(color: string): void {
    this.splashColor = color
  }
}

/**
 * 星光粒子系统
 * 用于夜晚场景
 */
export class StarParticleSystem extends ParticleSystem {
  private starColor: string = '#FFD700'

  constructor(options?: Partial<ParticleSystemOptions>) {
    super({
      maxParticles: 150,
      emissionRate: 5,
      particleLife: 10,
      gravity: 0,
      wind: 0,
      bounds: { width: 800, height: 600 },
      ...options
    })
  }

  protected createParticle(): Particle {
    return {
      x: Math.random() * this.bounds.width,
      y: Math.random() * (this.bounds.height * 0.6), // 只在上半部分
      vx: 0,
      vy: 0,
      life: this.particleLife,
      maxLife: this.particleLife,
      opacity: 0.3 + Math.random() * 0.7,
      size: 1 + Math.random() * 2,
      color: this.starColor,
      rotation: 0,
      rotationSpeed: 0
    }
  }

  protected drawParticle(
    ctx: CanvasRenderingContext2D,
    particle: Particle
  ): void {
    ctx.save()
    // 闪烁效果
    const twinkle = 0.5 + Math.sin(Date.now() * 0.003 + particle.x) * 0.5
    ctx.globalAlpha = particle.opacity * twinkle

    ctx.fillStyle = particle.color || this.starColor
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI)
    ctx.fill()

    // 绘制光芒
    if (particle.size > 1.5) {
      ctx.strokeStyle = particle.color || this.starColor
      ctx.lineWidth = 0.5
      const glowSize = particle.size * 3

      ctx.beginPath()
      ctx.moveTo(particle.x - glowSize, particle.y)
      ctx.lineTo(particle.x + glowSize, particle.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(particle.x, particle.y - glowSize)
      ctx.lineTo(particle.x, particle.y + glowSize)
      ctx.stroke()
    }

    ctx.restore()
  }
}

/**
 * 雪花粒子系统 (v2.0 feature)
 */
export class SnowParticleSystem extends ParticleSystem {
  private snowColor: string = '#FFFFFF'

  constructor(options?: Partial<ParticleSystemOptions>) {
    super({
      maxParticles: 100,
      emissionRate: 20,
      particleLife: 8,
      gravity: 50,
      wind: 10,
      bounds: { width: 800, height: 600 },
      ...options
    })
  }

  protected createParticle(): Particle {
    return {
      x: Math.random() * this.bounds.width,
      y: -20,
      vx: (Math.random() - 0.5) * 20,
      vy: 30 + Math.random() * 30,
      life: this.particleLife,
      maxLife: this.particleLife,
      opacity: 0.6 + Math.random() * 0.4,
      size: 2 + Math.random() * 4,
      color: this.snowColor,
      rotation: Math.random() * 2 * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 2
    }
  }

  protected drawParticle(
    ctx: CanvasRenderingContext2D,
    particle: Particle
  ): void {
    ctx.save()
    ctx.globalAlpha = particle.opacity
    ctx.fillStyle = particle.color || this.snowColor

    ctx.translate(particle.x, particle.y)
    if (particle.rotation !== undefined) {
      ctx.rotate(particle.rotation)
    }

    // 绘制雪花形状
    const size = particle.size
    for (let i = 0; i < 6; i++) {
      ctx.rotate(Math.PI / 3)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(0, -size)
      ctx.stroke()

      // 分支
      ctx.beginPath()
      ctx.moveTo(0, -size * 0.6)
      ctx.lineTo(-size * 0.3, -size * 0.8)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, -size * 0.6)
      ctx.lineTo(size * 0.3, -size * 0.8)
      ctx.stroke()
    }

    ctx.restore()
  }
}

/**
 * 粒子系统性能测试
 */
export function benchmarkParticleSystem(options: {
  systems: Array<{ name: string; system: ParticleSystem }>
  duration: number // 测试时长(秒)
  canvasSize: { width: number; height: number }
}): Array<{
  name: string
  avgFPS: number
  avgParticles: number
  avgDrawCalls: number
  minFPS: number
  maxFPS: number
}> {
  const results: Array<{
    name: string
    avgFPS: number
    avgParticles: number
    avgDrawCalls: number
    minFPS: number
    maxFPS: number
  }> = []

  const canvas = document.createElement('canvas')
  canvas.width = options.canvasSize.width
  canvas.height = options.canvasSize.height
  const ctx = canvas.getContext('2d')!

  for (const { name, system } of options.systems) {
    const fpsHistory: number[] = []
    const particleHistory: number[] = []
    const drawCallHistory: number[] = []

    system.setBounds(canvas.width, canvas.height)

    let lastTime = performance.now()
    const startTime = lastTime
    let frameCount = 0

    const testLoop = () => {
      const currentTime = performance.now()
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      // 更新和渲染
      system.update(deltaTime)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      system.render(ctx)

      // 收集统计
      const stats = system.getStats()
      fpsHistory.push(stats.fps)
      particleHistory.push(stats.activeParticles)
      drawCallHistory.push(stats.drawCalls)

      frameCount++

      // 继续测试
      if (currentTime - startTime < options.duration * 1000) {
        requestAnimationFrame(testLoop)
      } else {
        // 计算平均值
        results.push({
          name,
          avgFPS:
            fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length || 0,
          avgParticles:
            particleHistory.reduce((a, b) => a + b, 0) /
              particleHistory.length || 0,
          avgDrawCalls:
            drawCallHistory.reduce((a, b) => a + b, 0) /
              drawCallHistory.length || 0,
          minFPS: Math.min(...fpsHistory) || 0,
          maxFPS: Math.max(...fpsHistory) || 0
        })

        system.clear()
      }
    }

    testLoop()
  }

  return results
}
