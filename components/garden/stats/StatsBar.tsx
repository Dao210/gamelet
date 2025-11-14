'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { SVGPlantPot, SVGWaterDrop, SVGSparkle } from '../svg/SVGIcons'
import type { MockStats } from '@/lib/garden-mock-data'

interface StatsBarProps {
  stats: MockStats
}

// Count-up animation hook
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return count
}

// Format number with commas
function formatNumber(num: number): string {
  return num.toLocaleString()
}

export default function StatsBar({ stats }: StatsBarProps) {
  const totalPlants = useCountUp(stats.totalPlants, 2000)
  const totalWaterings = useCountUp(stats.totalWaterings, 2500)
  const todayNewPlants = useCountUp(stats.todayNewPlants, 1500)

  const statCards = [
    {
      icon: <SVGPlantPot size={32} color="#10b981" />,
      label: '创作总数',
      value: formatNumber(totalPlants),
      suffix: '+',
      gradient: 'from-green-500/20 to-emerald-500/20',
      glowColor: 'shadow-green-500/20'
    },
    {
      icon: <SVGWaterDrop size={32} animated={false} />,
      label: '浇水总数',
      value: formatNumber(totalWaterings),
      suffix: '+',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      glowColor: 'shadow-blue-500/20'
    },
    {
      icon: <SVGSparkle size={32} color="#f59e0b" />,
      label: '今日新增',
      value: `+${formatNumber(todayNewPlants)}`,
      suffix: '',
      gradient: 'from-amber-500/20 to-yellow-500/20',
      glowColor: 'shadow-amber-500/20'
    }
  ]

  return (
    <section className="py-12 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              className={`
                backdrop-blur-xl bg-gradient-to-br ${card.gradient}
                border border-white/20 dark:border-gray-700/30
                rounded-2xl p-6 shadow-xl ${card.glowColor}
                hover:shadow-2xl hover:scale-105
                transition-all duration-300
              `}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Icon */}
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1 + 0.3,
                  type: 'spring',
                  stiffness: 200
                }}
              >
                {card.icon}
              </motion.div>

              {/* Value */}
              <motion.div
                className="text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
              >
                <span className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {card.value}{card.suffix}
                </span>
              </motion.div>

              {/* Label */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.7 }}
              >
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {card.label}
                </span>
              </motion.div>

              {/* Decorative glow */}
              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-50 blur-xl -z-10`}
                animate={{
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Subtitle */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-gray-600 dark:text-gray-400">
            全球创作者的花园正在茁壮成长
          </p>
        </motion.div>
      </div>
    </section>
  )
}
