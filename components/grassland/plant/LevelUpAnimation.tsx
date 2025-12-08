/**
 * LevelUpAnimation Component
 * 文档来源: /docs/design/UI-UX设计文档.md - Section 3.4
 *
 * 升级动画组件，包含5步序列:
 * 1. 发光脉冲 (0.5s)
 * 2. 光波扩散 (1s)
 * 3. 尺寸渐变 (0.8s)
 * 4. 庆祝粒子 (1.5s) - Canvas 30个金色粒子
 * 5. 提示文字 "Level Up!" (2s)
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LevelUpAnimationProps {
  /** 是否显示动画 */
  show: boolean
  /** 新等级 */
  newLevel: number
  /** 动画完成回调 */
  onComplete?: () => void
  /** 自定义类名 */
  className?: string
}

export default function LevelUpAnimation({
  show,
  newLevel,
  onComplete,
  className = ''
}: LevelUpAnimationProps) {
  const [showWave, setShowWave] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!show) return

    // 步骤 1: 发光脉冲 (立即开始, 0.5s)
    // 通过CSS animation处理

    // 步骤 2: 光波扩散 (0.5s后开始, 持续1s)
    const waveTimer = setTimeout(() => setShowWave(true), 500)

    // 步骤 3: 尺寸渐变 (与光波同时, 0.8s)
    // 由父组件 PlantCard 处理

    // 步骤 4: 庆祝粒子 (0.8s后开始, 持续1.5s)
    const particlesTimer = setTimeout(() => {
      setShowParticles(true)
      animateParticles()
    }, 800)

    // 步骤 5: 提示文字 (1s后显示, 持续2s)
    const textTimer = setTimeout(() => setShowText(true), 1000)

    // 总动画时长 3.5s 后完成
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 3500)

    return () => {
      clearTimeout(waveTimer)
      clearTimeout(particlesTimer)
      clearTimeout(textTimer)
      clearTimeout(completeTimer)
      setShowWave(false)
      setShowText(false)
      setShowParticles(false)
    }
  }, [show, onComplete])

  /**
   * Canvas 粒子动画 - 30个金色粒子从中心爆发
   */
  const animateParticles = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      size: number
    }> = []

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // 创建30个粒子
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30
      const speed = 100 + Math.random() * 100
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.5, // 1.5秒生命
        size: 3 + Math.random() * 4
      })
    }

    const startTime = performance.now()
    let lastTime = startTime

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 更新和绘制粒子
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        // 更新位置
        p.x += p.vx * deltaTime
        p.y += p.vy * deltaTime

        // 重力
        p.vy += 200 * deltaTime

        // 更新生命
        p.life -= deltaTime

        // 绘制粒子
        if (p.life > 0) {
          const opacity = Math.max(0, p.life / 1.5)
          ctx.save()
          ctx.globalAlpha = opacity
          ctx.fillStyle = '#FFD700'
          ctx.shadowBlur = 10
          ctx.shadowColor = '#FFD700'
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        } else {
          particles.splice(i, 1)
        }
      }

      // 继续动画直到所有粒子消失
      if (particles.length > 0 && currentTime - startTime < 1500) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  if (!show) return null

  return (
    <div
      className={`level-up-animation absolute inset-0 pointer-events-none z-50 ${className}`}
    >
      {/* 步骤 1: 发光脉冲 */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={{ boxShadow: '0 0 0 rgba(255, 215, 0, 0)' }}
        animate={{
          boxShadow: [
            '0 0 0 rgba(255, 215, 0, 0)',
            '0 0 60px rgba(255, 215, 0, 0.8)',
            '0 0 0 rgba(255, 215, 0, 0)'
          ]
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* 步骤 2: 光波扩散 */}
      <AnimatePresence>
        {showWave && (
          <motion.div
            className="level-up-wave absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%)'
            }}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* 步骤 4: 庆祝粒子 Canvas */}
      {showParticles && (
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}

      {/* 步骤 5: 提示文字 "Level Up!" */}
      <AnimatePresence>
        {showText && (
          <motion.div
            className="level-up-text absolute font-bold text-yellow-400 whitespace-nowrap"
            style={{
              top: '50%',
              left: '50%',
              fontSize: '2rem',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
            }}
            initial={{ opacity: 0, scale: 0.5, x: '-50%', y: '-50%' }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.1, 1, 1.1],
              x: '-50%',
              y: '-50%'
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              times: [0, 0.1, 0.9, 1],
              ease: 'easeOut'
            }}
          >
            Level {newLevel}!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
