/**
 * GrassLayer Component
 * 文档来源: /docs/design/UI-UX设计文档.md - Section 2.3
 *
 * 渲染草地纹理层，使用SVG + Perlin Noise滤镜创建自然草地效果
 * 包含摆动动画的草叶点缀
 */

'use client'

import { useMemo } from 'react'

interface GrassLayerProps {
  /** 草叶数量 (默认 200-300) */
  bladeCount?: number
  /** 风力强度: 'gentle' | 'moderate' | 'strong' */
  windStrength?: 'gentle' | 'moderate' | 'strong'
  /** 自定义类名 */
  className?: string
}

/**
 * 生成随机草叶路径数据
 */
function generateGrassBlade(index: number): {
  path: string
  x: number
  y: number
  color: string
  delay: number
  rotation: number
} {
  // 随机位置
  const x = Math.random() * 100 // 百分比
  const y = 80 + Math.random() * 20 // 底部20%区域

  // 随机高度和曲线
  const height = 15 + Math.random() * 15 // 15-30px
  const curve = (Math.random() - 0.5) * 8 // -4 to 4

  // 贝塞尔曲线路径 (模拟草叶形状)
  const path = `M0,0 Q${curve},-${height * 0.5} 0,-${height}`

  // 颜色变化
  const colors = ['#AED581', '#9CCC65', '#8BC34A', '#7CB342']
  const color = colors[Math.floor(Math.random() * colors.length)]

  // 动画延迟（错开草叶摆动）
  const delay = Math.random() * 2

  // 初始旋转角度
  const rotation = (Math.random() - 0.5) * 10 // -5deg to 5deg

  return { path, x, y, color, delay, rotation }
}

/**
 * 获取风力参数
 */
function getWindParams(strength: 'gentle' | 'moderate' | 'strong') {
  const params = {
    gentle: { duration: 3, maxRotation: 2 },
    moderate: { duration: 2, maxRotation: 4 },
    strong: { duration: 1, maxRotation: 8 }
  }
  return params[strength]
}

export default function GrassLayer({
  bladeCount = 250,
  windStrength = 'gentle',
  className = ''
}: GrassLayerProps) {
  // 生成草叶数据（仅在组件挂载时生成一次）
  const grassBlades = useMemo(
    () => Array.from({ length: bladeCount }, (_, i) => generateGrassBlade(i)),
    [bladeCount]
  )

  const windParams = useMemo(() => getWindParams(windStrength), [windStrength])

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{ zIndex: 2 }}
      data-wind={windStrength}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Perlin Noise 滤镜 - 创建自然草地纹理 */}
          <filter id="perlin-noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05"
              numOctaves={4}
              seed={5}
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.48
                      0 0 0 0 0.70
                      0 0 0 0 0.26
                      0 0 0 0.3 0"
            />
          </filter>
        </defs>

        {/* 基础草地背景 */}
        <rect
          width="100%"
          height="100%"
          fill="#7CB342"
          filter="url(#perlin-noise)"
        />

        {/* 草叶点缀层 */}
        <g className="grass-blades">
          {grassBlades.map((blade, bladeIndex) => (
            <g
              key={bladeIndex}
              transform={`translate(${blade.x}%, ${blade.y}%)`}
              style={{
                transformOrigin: 'bottom center'
              }}
            >
              <path
                d={blade.path}
                stroke={blade.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                className="grass-blade"
                style={{
                  transformOrigin: 'bottom center',
                  animation: `sway ${windParams.duration}s ease-in-out infinite`,
                  animationDelay: `${blade.delay}s`,
                  transform: `rotate(${blade.rotation}deg)`
                }}
              />
            </g>
          ))}
        </g>
      </svg>

      <style jsx>{`
        @keyframes sway {
          0%,
          100% {
            transform: rotate(-${windParams.maxRotation}deg) translateX(-1px);
          }
          50% {
            transform: rotate(${windParams.maxRotation}deg) translateX(1px);
          }
        }

        .grass-blade {
          will-change: transform;
        }
      `}</style>
    </div>
  )
}
