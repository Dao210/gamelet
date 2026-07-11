/**
 * Server-side request configuration for next-intl
 */

import { getRequestConfig } from 'next-intl/server'
import { defaultLocale, isValidLocale } from './config'
import englishMessages from '../messages/en.json'

interface Messages {
  [key: string]: string | Messages
}

function mergeMessages(fallback: Messages, localized: Messages): Messages {
  const merged: Messages = { ...fallback }

  for (const [key, value] of Object.entries(localized)) {
    const fallbackValue = fallback[key]
    merged[key] = typeof value === 'object' && typeof fallbackValue === 'object'
      ? mergeMessages(fallbackValue, value)
      : value
  }

  return merged
}

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  const requestedLocale = await requestLocale
  const locale = requestedLocale && isValidLocale(requestedLocale)
    ? requestedLocale
    : defaultLocale

  const localizedMessages = (await import(`../messages/${locale}.json`)).default

  return {
    locale,
    messages: locale === defaultLocale
      ? englishMessages
      : mergeMessages(englishMessages, localizedMessages),
    timeZone: 'UTC'
  }
})
