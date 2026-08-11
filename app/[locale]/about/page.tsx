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

  return createPageMetadata({ locale, pathname: '/about', title: t('aboutTitle'), description: t('aboutDescription') })
}

export default async function AboutPage() {
  const common = await getTranslations('common')
  const about = await getTranslations('about')
  const principles = ['principle1', 'principle2', 'principle3', 'principle4', 'principle5'] as const
  const experiences = ['experience1', 'experience2', 'experience3', 'experience4'] as const

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f8ff] px-4 py-10 text-[#141821] dark:bg-[#070b15] dark:text-[#edf2ff]">
      <div className="pointer-events-none absolute left-[-5rem] top-[-6rem] h-80 w-80 rounded-full bg-cyan-300/35 blur-[120px] dark:bg-cyan-900/30" />
      <div className="pointer-events-none absolute right-[-4rem] bottom-[-5rem] h-80 w-80 rounded-full bg-amber-200/35 blur-[120px] dark:bg-amber-900/30" />

      <div className="relative mx-auto max-w-6xl">
        <Link href="/nerd" className="inline-flex items-center text-sm font-bold text-[#1d4ed8] transition hover:text-[#1e40af] dark:text-[#8ab8ff] dark:hover:text-[#d6e7ff]">
          <span aria-hidden="true" className="mr-2">←</span>
          {common('backToNerdle')}
        </Link>

        <article className="mt-6 rounded-[30px] border border-black/5 bg-white/90 p-8 shadow-[0_24px_75px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:border-white/10 dark:bg-[#111827]/90 sm:p-12">
          <p className="mb-3 inline-flex rounded-full bg-[#e0f2fe] px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#0c4a6e] dark:bg-[#0f2a49] dark:text-[#9dc0f5]">
            AI-native mini-games
          </p>
          <header>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-[#0f172a] md:text-5xl dark:text-[#f8fafc]">
              {about('title')}
            </h1>
            <p className="mt-4 max-w-3xl text-xl leading-relaxed text-[#475569] dark:text-[#a8b4d5]">{about('subtitle')}</p>
          </header>

          <div className="mt-10 grid gap-6 lg:grid-cols-5">
            <section className="lg:col-span-3">
              <h2 className="text-2xl font-black text-[#0f172a] dark:text-[#f8fafc]">{about('whatIsNerdle')}</h2>
              <p className="mt-4 text-lg leading-relaxed text-[#475569] dark:text-[#a8b4d5]">{about('whatIsNerdleText')}</p>
            </section>
            <aside className="lg:col-span-2 rounded-2xl border border-[#cbd5e1] bg-[#f8fbff] p-6 dark:border-[#334155] dark:bg-[#0f1729]">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0369a1] dark:text-[#8ab8ff]">{about('readyToPlay')}</p>
              <p className="mt-3 text-base leading-relaxed text-[#334155] dark:text-[#bdc8e2]">{about('testSkills')}</p>
              <Link href="/nerd/game" className="mt-6 inline-flex items-center rounded-xl bg-[#1d4ed8] px-5 py-3 font-bold text-white transition-all duration-200 hover:bg-[#1e40af] hover:shadow-lg">
                {about('playNow')}
              </Link>
            </aside>
          </div>

          <section className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-[#0f172a] p-6 text-[#e2e8f0] dark:bg-[#020617]">
              <h2 className="text-2xl font-black">{about('howToPlay')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#94a3b8]">{about('basicRulesText')}</p>
              <ol className="mt-6 space-y-3">
                {principles.map((key, index) => (
                  <li key={key} className="flex items-start gap-3 rounded-xl bg-[#111827] p-3 text-sm leading-6 text-[#e2e8f0]">
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-xs font-black text-white">{index + 1}</span>
                    {about(key)}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl bg-[#f8fafc] p-6 dark:bg-[#101c35]">
              <h2 className="text-2xl font-black text-[#0f172a] dark:text-[#f8fafc]">{about('colorFeedback')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-[#9aa7c2]">{about('colorFeedbackText')}</p>
              <ul className="mt-6 space-y-3">
                {experiences.map(key => (
                  <li key={key} className="flex items-start gap-3 rounded-xl border border-transparent bg-[#ffffff] p-3 text-sm leading-6 text-[#334155] transition-colors hover:border-[#bae6fd] hover:bg-[#f0f9ff] dark:bg-[#0b1733] dark:text-[#c8d3ec] dark:hover:border-[#1d4ed8]">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gradient-to-r from-[#2563eb] to-[#0891b2]" aria-hidden="true" />
                    {about(key)}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </article>
      </div>
    </main>
  )
}
