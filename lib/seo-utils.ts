import { locales, defaultLocale, type Locale } from '@/i18n/config'

const baseUrl = 'https://chimii.com'

/**
 * Generate language alternates for all supported locales
 * @param pathname - The pathname without locale prefix (e.g., '/nerd' or '/nerd/game')
 * @returns Record of locale codes to full URLs
 */
export function generateLanguageAlternates(pathname: string): Record<string, string> {
  const languages: Record<string, string> = {}

  locales.forEach(locale => {
    const path = locale === defaultLocale
      ? pathname
      : `/${locale}${pathname}`
    languages[locale] = `${baseUrl}${path}`
  })

  // Add x-default (defaults to English)
  languages['x-default'] = `${baseUrl}${pathname}`

  return languages
}

/**
 * Get canonical URL for a given pathname and locale
 * @param pathname - The pathname without locale prefix
 * @param locale - The locale code
 * @returns Full canonical URL
 */
export function getCanonicalUrl(pathname: string, locale: Locale): string {
  const path = locale === defaultLocale
    ? pathname
    : `/${locale}${pathname}`
  return `${baseUrl}${path}`
}

/**
 * Get change frequency based on route type
 * @param route - The route path
 * @returns Sitemap change frequency
 */
export function getChangeFrequency(
  route: string
): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
  // Homepage and main game pages change daily
  if (route === '/' || route === '/nerd' || route === '/nerd/game') {
    return 'daily'
  }

  // Tips and strategies page updates weekly
  if (route.includes('nerdle-answer-today')) {
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
  if (route === '/nerd/game') return 0.9
  if (route.includes('nerdle-answer-today')) return 0.8
  if (route.includes('/garden')) return 0.7
  if (route === '/about') return 0.6
  return 0.5
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
  const localeMap: Record<Locale, string> = {
    en: 'en_US',
    es: 'es_ES',
    fr: 'fr_FR',
    de: 'de_DE',
    it: 'it_IT',
    ru: 'ru_RU',
    ja: 'ja_JP',
    zh: 'zh_CN'
  }

  return localeMap[locale] || 'en_US'
}
