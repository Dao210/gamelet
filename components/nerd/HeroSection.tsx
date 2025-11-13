'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function HeroSection() {
  const t = useTranslations('nerdLanding')

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 -z-10">
        {/* Large gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-72 h-72 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 rounded-3xl p-8 md:p-12 border border-white/20 dark:border-gray-700/20 max-w-5xl mx-auto"
        >
          {/* Title with gradient text */}
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-300%"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('heroTitle')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-2xl md:text-3xl text-gray-700 dark:text-gray-200 mb-4 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {t('heroDescription')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {/* Primary CTA with glow effect */}
            <Link href="/nerd/game">
              <motion.button
                className="relative px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />

                {/* Button content */}
                <span className="relative flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  {t('heroCta')}
                </span>
              </motion.button>
            </Link>

            {/* Secondary CTA - Ghost button */}
            <Link href="#how-to-play">
              <motion.button
                className="px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  <span className="text-2xl">📖</span>
                  {t('heroLearnMore')}
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Interactive Game Preview */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 inline-block">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                {t('heroPreviewLabel')}
              </p>

              {/* Animated equation tiles */}
              <div className="flex gap-2 justify-center">
                {['1', '2', '+', '3', '4', '=', '4', '6'].map((char, index) => (
                  <motion.div
                    key={index}
                    className={`
                      w-12 h-12 md:w-14 md:h-14
                      flex items-center justify-center
                      text-xl md:text-2xl font-bold rounded-lg
                      ${index < 2 ? 'bg-green-500 text-white' :
                        index === 4 ? 'bg-yellow-500 text-white' :
                        index === 6 ? 'bg-gray-400 text-white' :
                        'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600'}
                    `}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 1.2 + (index * 0.1),
                      type: 'spring',
                      stiffness: 200
                    }}
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.3 }
                    }}
                  >
                    {char}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-sm font-medium">{t('heroScrollHint')}</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Add custom animation for gradient text */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
