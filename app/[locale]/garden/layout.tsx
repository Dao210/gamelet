import { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { generateLanguageAlternates, getCanonicalUrl } from '@/lib/seo-utils'
import { type Locale } from '@/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gardenMetadata' })
  const pathname = '/garden'

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: getCanonicalUrl(pathname, locale as Locale),
      languages: generateLanguageAlternates(pathname)
    }
  }
}

export default async function GardenLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gardenPage' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-green-800 dark:text-green-400 mb-2">
            🌱 {t('welcome')}
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300">
            {t('welcomeDescription').split('.')[0]}
          </p>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}
