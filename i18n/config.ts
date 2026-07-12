/**
 * i18n Configuration
 * Central configuration for internationalization settings
 */

export const locales = ['en', 'es', 'fr', 'de', 'it', 'ru', 'ja', 'zh'] as const

export type Locale = (typeof locales)[number]

export type LocaleStatus = 'complete' | 'beta' | 'hidden'

export const defaultLocale: Locale = 'en'

export const localeConfig: Record<Locale, { status: LocaleStatus; fallback: Locale | null }> = {
  en: { status: 'complete', fallback: null },
  zh: { status: 'complete', fallback: 'en' },
  es: { status: 'complete', fallback: 'en' },
  ja: { status: 'hidden', fallback: 'en' },
  de: { status: 'hidden', fallback: 'en' },
  fr: { status: 'hidden', fallback: 'en' },
  it: { status: 'hidden', fallback: 'en' },
  ru: { status: 'hidden', fallback: 'en' }
}

/** Locales that meet the quality bar for navigation, indexing and hreflang. */
export const publicLocales = locales.filter(
  locale => localeConfig[locale].status !== 'hidden'
)

export type PublicLocale = (typeof publicLocales)[number]

export function isPublicLocale(locale: Locale): boolean {
  return localeConfig[locale].status !== 'hidden'
}

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  ru: 'Русский',
  ja: '日本語',
  zh: '简体中文'
}

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  ru: '🇷🇺',
  ja: '🇯🇵',
  zh: '🇨🇳'
}

// OpenGraph locale mapping for SEO
export const openGraphLocaleMap: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  it: 'it_IT',
  ru: 'ru_RU',
  ja: 'ja_JP',
  zh: 'zh_CN'
}

/**
 * Check if a given string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale)
}

/**
 * Get locale from pathname
 * Returns the locale if it's the first segment, otherwise default
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/')
  const firstSegment = segments[1]

  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment
  }

  return defaultLocale
}

/**
 * Remove locale prefix from pathname
 */
export function removeLocalePrefix(pathname: string, locale: Locale): string {
  const localePrefix = `/${locale}`
  if (pathname === localePrefix || pathname.startsWith(`${localePrefix}/`)) {
    return pathname.slice(localePrefix.length) || '/'
  }

  return pathname
}

/**
 * Add locale prefix to pathname
 */
export function addLocalePrefix(pathname: string, locale: Locale): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `/${locale}${normalizedPath === '/' ? '' : normalizedPath}`
}
