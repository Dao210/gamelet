/**
 * JSON-LD Structured Data Components
 * For enhanced SEO and search engine rich results
 */

import { type Locale } from '@/i18n/config'
import { getBaseUrl, getLocalizedPath } from '@/lib/seo-utils'

interface JsonLdProps {
  locale: Locale
}

/**
 * WebSite Schema - Main website markup
 */
export function WebSiteSchema({ locale }: JsonLdProps) {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${getLocalizedPath('/', locale)}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: 'Gamelet Puzzle Arcade',
    url: url,
    description: 'A collection of quick browser puzzle games spanning math, words, logic, patterns, and spatial reasoning.',
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Game Schema - For game pages
 */
export function GameSchema({ locale }: JsonLdProps) {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${getLocalizedPath('/nerd', locale)}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['VideoGame', 'WebApplication'],
    '@id': `${url}#game`,
    name: 'Nerdle - Math Equation Puzzle',
    description: 'Daily mathematical equation guessing game. Guess the hidden equation in 6 tries!',
    url: url,
    gamePlatform: 'Web browser',
    operatingSystem: 'Any',
    genre: ['Puzzle', 'Educational', 'Math'],
    inLanguage: locale,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    applicationCategory: 'GameApplication',
    publisher: { '@id': `${baseUrl}/#organization` }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Organization Schema - Company/brand information
 */
export function OrganizationSchema() {
  const baseUrl = getBaseUrl()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Gamelet',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/gamelet.png`
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * BreadcrumbList Schema - For navigation breadcrumbs
 */
export function BreadcrumbSchema({
  locale,
  items
}: {
  locale: Locale
  items: Array<{ name: string; path: string }>
}) {
  const baseUrl = getBaseUrl()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${getLocalizedPath(item.path, locale)}`
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * FAQ Schema - For pages with frequently asked questions
 */
export function FAQSchema({
  questions
}: {
  questions: Array<{ question: string; answer: string }>
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
