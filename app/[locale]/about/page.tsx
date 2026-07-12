import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { isValidLocale } from '@/i18n/config'
import { generateLanguageAlternates, getCanonicalUrl } from '@/lib/seo-utils'

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params
  const locale = isValidLocale(requestedLocale) ? requestedLocale : 'en'
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('aboutTitle'),
    description: t('aboutDescription'),
    alternates: {
      canonical: getCanonicalUrl('/about', locale),
      languages: generateLanguageAlternates('/about')
    }
  }
}

export default async function AboutPage() {
  const common = await getTranslations('common')
  const about = await getTranslations('about')
  const rules = await getTranslations('gameInstructions')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="mx-auto max-w-4xl">
        <Link href="/nerd" className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-700">
          <span className="mr-2" aria-hidden="true">←</span>
          {common('backToNerdle')}
        </Link>

        <article className="rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 sm:p-8">
          <header className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              {about('title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">{about('subtitle')}</p>
          </header>

          <div className="space-y-12">
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{about('whatIsNerdle')}</h2>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">{about('whatIsNerdleText')}</p>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{about('howToPlay')}</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">{about('basicRules')}</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    {(['rule1', 'rule2', 'rule3', 'rule4', 'rule5'] as const).map(key => (
                      <li key={key} className="flex items-start"><span className="mr-2 text-blue-500">•</span>{rules(key)}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">{about('colorFeedback')}</h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    {([
                      ['bg-green-500', 'colorGreen'],
                      ['bg-yellow-500', 'colorYellow'],
                      ['bg-gray-400', 'colorGray']
                    ] as const).map(([color, key]) => (
                      <li key={key} className="flex items-center">
                        <span className={`mr-3 inline-block h-4 w-4 shrink-0 rounded ${color}`} aria-hidden="true" />
                        {rules(key)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{about('readyToPlay')}</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">{about('testSkills')}</p>
              <Link href="/nerd/game" className="inline-block rounded-xl bg-blue-500 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-600">
                {about('playNow')}
              </Link>
            </section>
          </div>
        </article>
      </div>
    </div>
  )
}
