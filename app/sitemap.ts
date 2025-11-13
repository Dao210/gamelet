import { MetadataRoute } from 'next'
import { locales, defaultLocale } from '@/i18n/config'
import {
  getBaseUrl,
  getChangeFrequency,
  getPriority,
  generateLanguageAlternates
} from '@/lib/seo-utils'

/**
 * Generate sitemap with all routes and languages
 * Next.js 15 sitemap API
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()

  // Define all routes in the application
  const routes = [
    '/',
    '/nerd',
    '/nerd/game',
    '/nerd/nerdle-answer-today',
    '/garden',
    '/garden/create',
    '/about'
  ]

  // Generate sitemap entries for all combinations of routes and locales
  const entries: MetadataRoute.Sitemap = []

  routes.forEach(route => {
    locales.forEach(locale => {
      // Construct the full path with locale prefix (except for default locale on root)
      const path = locale === defaultLocale
        ? route
        : `/${locale}${route}`

      // Generate language alternates for this route
      const languages = generateLanguageAlternates(route)

      entries.push({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: getChangeFrequency(route),
        priority: getPriority(route),
        alternates: {
          languages
        }
      })
    })
  })

  return entries
}
