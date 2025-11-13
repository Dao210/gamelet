'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function BentoFeatures() {
  const t = useTranslations('nerdLanding')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('featuresTitle')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('featuresSubtitle')}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Large Feature - How It Works */}
          <motion.div
            className="md:col-span-2 md:row-span-2 backdrop-blur-md bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 hover:border-blue-500/50 transition-colors"
            variants={itemVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('featureHowItWorksTitle')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('featureHowItWorksDesc')}
            </p>

            {/* Steps */}
            <div className="space-y-3">
              {[
                { num: '1', text: t('featureStep1') },
                { num: '2', text: t('featureStep2') },
                { num: '3', text: t('featureStep3') }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm">
                    {step.num}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 pt-1 text-sm">
                    {step.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Daily Challenge */}
          <motion.div
            className="backdrop-blur-md bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 rounded-3xl p-6 border border-white/20 dark:border-gray-700/20 hover:border-emerald-500/50 transition-colors"
            variants={itemVariants}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('featureDailyTitle')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('featureDailyDesc')}
            </p>
          </motion.div>

          {/* Multiple Modes */}
          <motion.div
            className="backdrop-blur-md bg-gradient-to-br from-violet-500/10 to-purple-500/10 dark:from-violet-500/5 dark:to-purple-500/5 rounded-3xl p-6 border border-white/20 dark:border-gray-700/20 hover:border-violet-500/50 transition-colors"
            variants={itemVariants}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('featureModesTitle')}
            </h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <div>• Classic (8 chars)</div>
              <div>• Mini (6 chars)</div>
              <div>• Expert (10 chars)</div>
            </div>
          </motion.div>

          {/* Track Progress */}
          <motion.div
            className="backdrop-blur-md bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5 rounded-3xl p-6 border border-white/20 dark:border-gray-700/20 hover:border-amber-500/50 transition-colors"
            variants={itemVariants}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('featureProgressTitle')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('featureProgressDesc')}
            </p>
          </motion.div>

          {/* Share Results */}
          <motion.div
            className="backdrop-blur-md bg-gradient-to-br from-pink-500/10 to-rose-500/10 dark:from-pink-500/5 dark:to-rose-500/5 rounded-3xl p-6 border border-white/20 dark:border-gray-700/20 hover:border-pink-500/50 transition-colors"
            variants={itemVariants}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('featureShareTitle')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('featureShareDesc')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
