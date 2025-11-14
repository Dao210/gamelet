'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import AnimatedOrbs from './AnimatedOrbs'
import SVGPlant from '../svg/SVGPlant'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient orbs background */}
      <AnimatedOrbs />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Title with gradient animation */}
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient bg-300%"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              种下创意，浇灌成长
            </motion.h1>

            <style jsx>{`
              @keyframes gradient {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }
              .animate-gradient {
                background-size: 300% 300%;
                animation: gradient 5s ease infinite;
              }
            `}</style>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              在全球藤架上展示你的创作，用赞点亮植物生命
            </motion.p>

            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              每一次点赞，都是一滴滋养创意的甘露
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {/* Primary CTA: Create */}
              <Link href="/garden/create">
                <motion.button
                  className="group relative px-8 py-4 text-lg font-bold text-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 group-hover:from-green-600 group-hover:to-emerald-700 transition-all" />

                  {/* Pulsing glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-30 blur-xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  />

                  {/* Button content */}
                  <span className="relative flex items-center gap-2">
                    <span className="text-2xl">🎨</span>
                    开始创作
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </motion.button>
              </Link>

              {/* Secondary CTA: Explore */}
              <Link href="#feed">
                <motion.button
                  className="px-8 py-4 text-lg font-bold text-gray-900 dark:text-white rounded-2xl border-2 border-gray-900/20 dark:border-white/20 hover:border-green-500/50 dark:hover:border-green-400/50 backdrop-blur-sm bg-white/40 dark:bg-gray-900/40 transition-all shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">🌿</span>
                    探索花园
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Hero Plant Showcase */}
            <motion.div
              className="flex justify-center gap-8 items-end"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {/* Three example plants at different levels */}
              <motion.div
                className="backdrop-blur-md bg-white/40 dark:bg-gray-900/40 rounded-3xl p-4 border border-white/20 dark:border-gray-700/30 shadow-xl"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <SVGPlant level={1} size={120} />
                <div className="text-center mt-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    萌芽期
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="backdrop-blur-md bg-white/40 dark:bg-gray-900/40 rounded-3xl p-4 border border-white/20 dark:border-gray-700/30 shadow-xl"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <SVGPlant level={2} size={140} />
                <div className="text-center mt-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    生长期
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="backdrop-blur-md bg-white/40 dark:bg-gray-900/40 rounded-3xl p-6 border border-white/20 dark:border-gray-700/30 shadow-2xl"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <SVGPlant level={3} size={160} />
                <div className="text-center mt-2">
                  <span className="text-sm font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    绽放期
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="mt-16 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                探索更多
              </span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-gray-600 dark:text-gray-400"
                >
                  <path
                    d="M12 5v14M19 12l-7 7-7-7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
