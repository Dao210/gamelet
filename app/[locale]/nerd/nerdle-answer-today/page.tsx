import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { isValidLocale } from '@/i18n/config'
import { createPageMetadata } from '@/lib/seo-utils'

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params
  const locale = isValidLocale(requestedLocale) ? requestedLocale : 'en'
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return createPageMetadata({ locale, pathname: '/nerd/nerdle-answer-today', title: t('tipsTitle'), description: t('tipsDescription') })
}

export default async function NerdleAnswerTodayPage() {
  const common = await getTranslations('common')
  const tips = await getTranslations('tips')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="mx-auto max-w-4xl">
        <Link href="/nerd" className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-700">
          <span className="mr-2" aria-hidden="true">←</span>
          {common('backToNerdle')}
        </Link>

        <article className="rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 sm:p-8">
          <header className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">{tips('title')}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">{tips('subtitle')}</p>
          </header>

          <section className="mb-8 border-l-4 border-blue-500 bg-blue-50 p-6 dark:bg-blue-900/20">
            <h2 className="mb-4 text-2xl font-bold text-blue-900 dark:text-blue-100">{tips('whyNoAnswers')}</h2>
            <p className="leading-relaxed text-blue-800 dark:text-blue-200">{tips('whyNoAnswersText')}</p>
          </section>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <section className="h-full rounded-xl bg-green-50 p-6 dark:bg-green-900/20">
              <h2 className="mb-4 text-2xl font-bold text-green-900 dark:text-green-100">{tips('expertStrategies')}</h2>
              <ul className="space-y-4 text-green-800 dark:text-green-200">
                {([1, 2, 3, 4, 5] as const).map(number => (
                  <li key={number}>
                    <strong className="block">{tips(`strategy${number}`)}</strong>
                    <span className="mt-1 block text-sm opacity-85">{tips(`strategy${number}Desc`)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="h-full rounded-xl bg-purple-50 p-6 dark:bg-purple-900/20">
              <h2 className="mb-4 text-2xl font-bold text-purple-900 dark:text-purple-100">{tips('proTips')}</h2>
              <ul className="space-y-3 text-purple-800 dark:text-purple-200">
                {([1, 2, 3, 4, 5] as const).map(number => (
                  <li key={number} className="flex items-start">
                    <span className="mr-2 text-purple-600">•</span>{tips(`tip${number}`)}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{tips('readyToApply')}</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">{tips('useTheseStrategies')}</p>
            <Link href="/nerd/game" className="inline-block rounded-xl bg-gradient-to-r from-green-500 to-blue-600 px-8 py-3 text-lg font-bold text-white">
              {tips('playToday')}
            </Link>
          </section>
        </article>
      </div>
    </div>
  )
}
