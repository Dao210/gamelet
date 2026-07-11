/**
 * Routing configuration for next-intl
 */

import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  // All supported locales
  locales: locales,

  // Default locale (used when no locale prefix is present)
  defaultLocale: defaultLocale,

  // Locale prefix strategy: every public page uses an explicit locale prefix.
  localePrefix: 'always'
})

// Type-safe navigation utilities
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
