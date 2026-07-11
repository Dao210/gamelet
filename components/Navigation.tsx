'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { motion } from 'framer-motion'
import LanguageSelector from './LanguageSelector'
import GameletLogo from './GameletLogo'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const t = useTranslations('navigation')

  // Main navigation with icons and descriptions (displayed prominently)
  const mainNavigation = [
    { name: 'Arcade', href: '/', icon: '◆', description: 'Puzzle mini-game collection' },
    { name: t('nerdle'), href: '/nerd', icon: '🧮', description: t('nerdleDescription') },
    { name: 'Fibonacci 2584', href: '/2584', icon: '🐚', description: 'Fibonacci sequence puzzle game' },

  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="grid h-16 grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
          {/* Logo */}
          <GameletLogo
            width={40}
            height={40}
            className="transition-opacity hover:opacity-80 w-8 h-8 md:w-10 md:h-10"
            linkClassName="flex items-center"
            showBrandName={true}
            brandNameClassName="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block"
          />

          {/* Desktop Navigation */}
          <div className="hidden items-center justify-center gap-3 md:flex lg:gap-6">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  relative whitespace-nowrap px-2 py-2 text-sm font-medium rounded-lg transition-colors lg:px-3
                  ${isActive(item.href)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                    initial={false}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Language Selector */}
          <div className="hidden justify-self-end md:block">
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 justify-self-end md:hidden">
            <LanguageSelector />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <div
                  className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <div
                  className={`w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <div
                  className={`w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
                    isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-700"
          >
            {/* Main navigation items */}
            <div className="py-4 space-y-2">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    block px-3 py-3 rounded-lg transition-colors
                    ${isActive(item.href)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
