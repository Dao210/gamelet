'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function RulesVisual() {
  const t = useTranslations('nerdLanding')

  const rules = [
    {
      color: 'green',
      emoji: '🟢',
      title: t('ruleGreenTitle'),
      description: t('ruleGreenDesc'),
      example: ['1', '2', '+'],
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-green-500'
    },
    {
      color: 'yellow',
      emoji: '🟡',
      title: t('ruleYellowTitle'),
      description: t('ruleYellowDesc'),
      example: ['='],
      gradient: 'from-yellow-500 to-amber-500',
      bg: 'bg-yellow-500'
    },
    {
      color: 'gray',
      emoji: '⚪',
      title: t('ruleGrayTitle'),
      description: t('ruleGrayDesc'),
      example: ['9'],
      gradient: 'from-gray-500 to-slate-500',
      bg: 'bg-gray-500'
    }
  ]

  return (
    <section id="how-to-play" className="py-16 md:py-24 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('rulesTitle')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('rulesSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 rounded-3xl p-8 border border-white/30 dark:border-gray-700/30 shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              {/* Icon */}
              <div className={`inline-block mb-4 p-4 rounded-2xl bg-gradient-to-br ${rule.gradient} shadow-lg`}>
                <span className="text-5xl">{rule.emoji}</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {rule.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {rule.description}
              </p>

              {/* Example tiles */}
              <div className="flex gap-2 justify-center">
                {rule.example.map((char, idx) => (
                  <motion.div
                    key={idx}
                    className={`w-14 h-14 flex items-center justify-center text-xl font-bold rounded-lg ${rule.bg} text-white shadow-lg`}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 + idx * 0.05, type: 'spring', stiffness: 200 }}
                  >
                    {char}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Rules */}
        <motion.div
          className="mt-12 max-w-3xl mx-auto backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-2xl p-8 border border-white/20 dark:border-gray-700/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            {t('rulesMustKnow')}
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>✓ {t('ruleMustKnow1')}</li>
            <li>✓ {t('ruleMustKnow2')}</li>
            <li>✓ {t('ruleMustKnow3')}</li>
            <li>✓ {t('ruleMustKnow4')}</li>
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
