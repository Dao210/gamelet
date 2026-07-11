'use client'

import { motion, type Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import GameletLogo from './GameletLogo'
import LanguageSelector from './LanguageSelector'

export default function Footer() {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  // Animation variants for staggered reveal
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0, 0, 0.2, 1] as const
      }
    }
  }

  // Footer link data structure
  const productLinks = [
    { name: 'Puzzle Arcade', href: '/' },
    { name: t('nerdle'), href: '/nerd' },
    { name: 'Fibonacci 2584', href: '/2584' },
    { name: t('playGame'), href: '/nerd/game' },
    { name: t('howToPlay'), href: '/nerd' },
    { name: t('garden'), href: '/grassland' }
  ]

  const resourceLinks = [
    { name: t('aboutUs'), href: '/about' },
    { name: t('tipsStrategies'), href: '/nerd/nerdle-answer-today' },
    { name: t('faq'), href: '/about' }
  ]

  const legalLinks = [
    { name: t('privacy'), href: '/privacy' },
    { name: t('terms'), href: '/terms' },
    { name: t('contact'), href: '/contact' }
  ]

  // Social media links with icons
  const socialLinks = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/nerdlemathgame',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      )
    },
    {
      name: 'GitHub',
      href: 'https://github.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/nerdle',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      )
    }
  ]

  return (
    <footer className="relative mt-auto border-t border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {/* Section 1: Brand & Social */}
          <motion.div variants={itemVariants} className="space-y-4">
            <GameletLogo
              width={48}
              height={48}
              className="transition-opacity hover:opacity-80 w-10 h-10 md:w-12 md:h-12"
              linkClassName="inline-block"
              showBrandName={true}
              brandNameClassName="text-xl font-semibold text-gray-900 dark:text-white"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('tagline')}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('followUs')}:
              </span>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Section 2: Products */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('products')}
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                  >
                    <motion.span
                      className="inline-block"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                    <motion.span
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -5 }}
                      whileHover={{ x: 0 }}
                    >
                      →
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Section 3: Resources */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('resources')}
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                  >
                    <motion.span
                      className="inline-block"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                    <motion.span
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -5 }}
                      whileHover={{ x: 0 }}
                    >
                      →
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Section 4: Legal & Language */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('legal')}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                  >
                    <motion.span
                      className="inline-block"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                    <motion.span
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -5 }}
                      whileHover={{ x: 0 }}
                    >
                      →
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Language Selector */}
            <div className="pt-4">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                {t('language')}
              </p>
              <LanguageSelector />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <motion.p
              className="text-gray-600 dark:text-gray-400 text-center md:text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {t('copyright', { year: currentYear })}
            </motion.p>

            <motion.a
              href="https://agentpage.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-xs">{t('poweredBy')}</span>
              <svg
                className="w-16 h-4 group-hover:opacity-80 transition-opacity"
                viewBox="0 0 207 124"
                fill="currentColor"
              >
                <path d="M48.942 32.632h38.96v3.082H52.512v23.193h33.278v3.082H52.513v25.464h35.794v3.081H48.942V32.632zm42.45 0h4.139l18.343 25.464 18.749-25.464L158.124.287l-41.896 60.485 21.59 29.762h-4.302l-19.642-27.086L94.15 90.534h-4.22l21.751-29.762-20.29-28.14zm47.967 3.082v-3.082h44.397v3.082h-20.453v54.82h-3.571v-54.82h-20.373zm-94.123 50.84c-11.698 0-21.176-9.478-21.176-21.176S33.538 44.202 45.236 44.202s21.176 9.478 21.176 21.176-9.478 21.176-21.176 21.176zm0-39.27c-9.99 0-18.094 8.104-18.094 18.094s8.104 18.095 18.094 18.095 18.095-8.105 18.095-18.095S55.226 47.284 45.236 47.284z"/>
              </svg>
            </motion.a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors z-50 md:hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </footer>
  )
}