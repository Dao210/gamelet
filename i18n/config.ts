/**
 * i18n Configuration
 * Central configuration for internationalization settings
 */

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'it' | 'ru' | 'ja' | 'zh'

export const locales: Locale[] = ['en', 'es', 'fr', 'de', 'it', 'ru', 'ja', 'zh']

export const defaultLocale: Locale = 'en'

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

/**
 * Check if a given string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
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
  if (locale === defaultLocale) return pathname

  const localePrefix = `/${locale}`
  if (pathname.startsWith(localePrefix)) {
    return pathname.slice(localePrefix.length) || '/'
  }

  return pathname
}

/**
 * Add locale prefix to pathname
 */
export function addLocalePrefix(pathname: string, locale: Locale): string {
  if (locale === defaultLocale) return pathname
  return `/${locale}${pathname === '/' ? '' : pathname}`
}
