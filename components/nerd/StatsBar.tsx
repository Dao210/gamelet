'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

function CountUpAnimation({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = (currentTime - startTime) / (duration * 1000)

      if (progress < 1) {
        setCount(Math.floor(end * progress))
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export default function StatsBar() {
  const t = useTranslations('nerdLanding')

  const stats = [
    {
      icon: '👥',
      value: 1000000,
      suffix: '+',
      label: t('statsPlayers'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🎮',
      value: 5000000,
      suffix: '+',
      label: t('statsGamesDaily'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '⭐',
      value: 4.8,
      suffix: '',
      label: t('statsRating'),
      subtext: '(2,000+ reviews)',
      color: 'from-amber-500 to-orange-500'
    }
  ]

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 rounded-3xl p-8 md:p-12 border border-white/30 dark:border-gray-700/30 shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Icon with gradient background */}
                <motion.div
                  className={`inline-block mb-4 p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-4xl">{stat.icon}</span>
                </motion.div>

                {/* Number with count-up animation */}
                <div className="mb-2">
                  <span className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    <CountUpAnimation end={stat.value} suffix={stat.suffix} />
                  </span>
                </div>

                {/* Label */}
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  {stat.label}
                </p>

                {/* Subtext (optional) */}
                {stat.subtext && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.subtext}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
