import type { Metadata } from 'next'
import {
  publicLocales,
  defaultLocale,
  isPublicLocale,
  isValidLocale,
  type Locale,
  openGraphLocaleMap
} from '@/i18n/config'

export const siteName = 'Gamelet'
export const baseUrl = 'https://gamelet.app'
export const defaultSocialImage = '/og.png'

export function getLocalizedPath(pathname: string, locale: Locale): string {
  const normalizedPath = pathname === '/'
    ? ''
    : pathname.startsWith('/')
      ? pathname
      : `/${pathname}`

  return `/${locale}${normalizedPath}`
}

/**
 * Generate language alternates for all supported locales
 * @param pathname - The pathname without locale prefix (e.g., '/nerd' or '/nerd/game')
 * @returns Record of locale codes to full URLs
 */
export function generateLanguageAlternates(pathname: string): Record<string, string> {
  const languages: Record<string, string> = {}

  publicLocales.forEach(locale => {
    languages[locale] = `${baseUrl}${getLocalizedPath(pathname, locale)}`
  })

  // Add x-default (defaults to English)
  languages['x-default'] = `${baseUrl}${getLocalizedPath(pathname, defaultLocale)}`

  return languages
}

/**
 * Get canonical URL for a given pathname and locale
 * @param pathname - The pathname without locale prefix
 * @param locale - The locale code
 * @returns Full canonical URL
 */
export function getCanonicalUrl(pathname: string, locale: Locale): string {
  return `${baseUrl}${getLocalizedPath(pathname, locale)}`
}

/**
 * Get change frequency based on route type
 * @param route - The route path
 * @returns Sitemap change frequency
 */
export function getChangeFrequency(
  route: string
): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
  // Daily puzzle game page
  if (route === '/nerd/game' || route === '/2584' || route.includes('nerdle-answer-today')) {
    return 'daily'
  }

  // Homepage and main landing pages update weekly
  if (route === '/' || route === '/nerd') {
    return 'weekly'
  }

  // Garden pages (plants, flowers) update weekly
  if (route.startsWith('/garden/')) {
    return 'weekly'
  }

  // Other pages update monthly
  return 'monthly'
}

/**
 * Get priority based on route importance
 * @param route - The route path
 * @returns Priority value between 0.0 and 1.0
 */
export function getPriority(route: string): number {
  if (route === '/' || route === '/nerd') return 1.0
  if (route === '/2584') return 0.9
  if (route === '/nerd/game') return 0.9
  if (route.includes('nerdle-answer-today')) return 0.8
  if (route === '/garden') return 0.7
  if (route === '/garden/create' || route === '/garden/flowers') return 0.6
  if (route === '/about') return 0.5
  // Dynamic plant pages: /garden/[plantId]
  if (route.match(/^\/garden\/[^/]+$/)) return 0.5
  return 0.4
}

/**
 * Get base URL for the application
 */
export function getBaseUrl(): string {
  return baseUrl
}

/**
 * Generate Open Graph locale code from our locale
 * @param locale - Our locale code (e.g., 'en', 'es')
 * @returns OpenGraph locale code (e.g., 'en_US', 'es_ES')
 */
export function getOpenGraphLocale(locale: Locale): string {
  return openGraphLocaleMap[locale] || 'en_US'
}

type PageMetadataOptions = {
  locale: string
  pathname: string
  title: string
  description: string
  image?: string
  index?: boolean
}

/**
 * Build consistent, self-referencing metadata for a localized public page.
 * Keeping this in one place prevents child routes from inheriting the homepage
 * canonical URL through Next.js metadata merging.
 */
export function createPageMetadata({
  locale: requestedLocale,
  pathname,
  title,
  description,
  image = defaultSocialImage,
  index = true
}: PageMetadataOptions): Metadata {
  const locale = isValidLocale(requestedLocale) ? requestedLocale : defaultLocale
  const canonical = getCanonicalUrl(pathname, locale)
  const shouldIndex = index && isPublicLocale(locale)
  const otherLocales = publicLocales
    .filter(candidate => candidate !== locale)
    .map(getOpenGraphLocale)

  return {
    title,
    description,
    alternates: {
      canonical,
      ...(shouldIndex ? { languages: generateLanguageAlternates(pathname) } : {})
    },
    robots: shouldIndex
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1
          }
        }
      : { index: false, follow: true },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName,
      locale: getOpenGraphLocale(locale),
      alternateLocale: otherLocales,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `${title} — ${siteName}` }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  }
}
