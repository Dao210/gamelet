import { MetadataRoute } from 'next'
import { publicLocales } from '@/i18n/config'
import {
  getBaseUrl,
  getChangeFrequency,
  getPriority,
  generateLanguageAlternates,
  getLocalizedPath
} from '@/lib/seo-utils'

/**
 * Generate sitemap with all routes and languages
 * Next.js 15 sitemap API
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()

  // Define all static routes in the application
  const routes = [
    '/',
    '/2584',
    '/nerd',
    '/nerd/game',
    '/nerd/nerdle-answer-today',
    '/mirror-maze',
    '/glyph-garden',
    '/word-cipher-box',
    '/orbit-sum',
    '/sequence-forge',
    '/pattern-loom',
    '/equation-vault',
    '/word-bridge',
    '/logic-switch',
    '/shape-signal',
    '/impossible-instruments',
    '/shadow-cartographer',
    '/mobius-mailroom',
    '/echo-orchard',
    '/gravity-grammar',
    '/rule-fossil',
    '/clockwork-alibi',
    '/garden',
    '/garden/flowers',
    '/grassland',
    '/grassland/create',
    '/grassland/my-plants',
    '/about',
    '/privacy',
    '/terms',
    '/contact'
  ]

  // Generate sitemap entries for all combinations of routes and locales
  const entries: MetadataRoute.Sitemap = []

  routes.forEach(route => {
    publicLocales.forEach(locale => {
      // Generate language alternates for this route
      const languages = generateLanguageAlternates(route)

      entries.push({
        url: `${baseUrl}${getLocalizedPath(route, locale)}`,
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
