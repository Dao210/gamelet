/**
 * JSON-LD Structured Data Components
 * For enhanced SEO and search engine rich results
 */

import { type Locale } from '@/i18n/config'
import { getBaseUrl } from '@/lib/seo-utils'

interface JsonLdProps {
  locale: Locale
}

/**
 * WebSite Schema - Main website markup
 */
export function WebSiteSchema({ locale }: JsonLdProps) {
  const baseUrl = getBaseUrl()
  const url = locale === 'en' ? baseUrl : `${baseUrl}/${locale}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Chimii - Nerdle Math Game',
    url: url,
    description: 'Daily math equation puzzle game for enthusiasts',
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: 'Chimii',
      url: baseUrl
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
  const url = locale === 'en' ? `${baseUrl}/nerd` : `${baseUrl}/${locale}/nerd`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: 'Nerdle - Math Equation Puzzle',
    description: 'Daily mathematical equation guessing game. Guess the hidden equation in 6 tries!',
    url: url,
    gamePlatform: ['Web Browser', 'Desktop', 'Mobile'],
    genre: ['Puzzle', 'Educational', 'Math'],
    inLanguage: locale,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    applicationCategory: 'GameApplication'
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
    name: 'Chimii',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/nerdlemathgame',
      // Add other social media URLs as needed
    ]
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
  const localePrefix = locale === 'en' ? '' : `/${locale}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${localePrefix}${item.path}`
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
