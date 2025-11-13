'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function FinalCTA() {
  const t = useTranslations('nerdLanding')

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 -z-10" />

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Title with text shadow for better readability */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 [text-shadow:_0_2px_10px_rgb(0_0_0_/_80%),_0_4px_20px_rgb(0_0_0_/_60%)]">
            {t('finalCtaTitle')}
          </h2>

          {/* Description with text shadow */}
          <p className="text-xl md:text-2xl text-white mb-4 max-w-3xl mx-auto [text-shadow:_0_2px_8px_rgb(0_0_0_/_70%),_0_4px_15px_rgb(0_0_0_/_50%)]">
            {t('finalCtaDescription')}
          </p>

          {/* Subtext with text shadow */}
          <p className="text-lg text-white mb-12 [text-shadow:_0_2px_8px_rgb(0_0_0_/_70%),_0_4px_15px_rgb(0_0_0_/_50%)]">
            {t('finalCtaSubtext')}
          </p>

          {/* CTA Button with pulsing effect */}
          <Link href="/nerd/game">
            <motion.button
              className="relative inline-block px-12 py-5 text-xl font-bold text-blue-600 bg-white rounded-2xl overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulsing glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />

              <span className="relative flex items-center gap-3">
                <span className="text-3xl">🎮</span>
                {t('finalCtaButton')}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </Link>

          {/* Trust signals */}
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-6 text-white/80 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span>✓ {t('finalCtaTrust1')}</span>
            <span>•</span>
            <span>✓ {t('finalCtaTrust2')}</span>
            <span>•</span>
            <span>✓ {t('finalCtaTrust3')}</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
