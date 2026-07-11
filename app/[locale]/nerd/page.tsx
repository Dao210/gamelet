import { generateLanguageAlternates, getCanonicalUrl } from '@/lib/seo-utils'
import { type Locale } from '@/i18n/config'
import HeroSection from '@/components/nerd/HeroSection'
import StatsBar from '@/components/nerd/StatsBar'
import BentoFeatures from '@/components/nerd/BentoFeatures'
import RulesVisual from '@/components/nerd/RulesVisual'
import FinalCTA from '@/components/nerd/FinalCTA'
import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const pathname = '/nerd'

  return {
    title: 'Nerdle - Daily Math Equation Puzzle Game',
    description: 'Challenge your mathematical skills with our addictive daily puzzle game. Guess the hidden equation in 6 tries or less. Perfect for math enthusiasts and puzzle lovers!',
    alternates: {
      canonical: getCanonicalUrl(pathname, locale as Locale),
      languages: generateLanguageAlternates(pathname)
    },
    openGraph: {
      title: 'Nerdle - Daily Math Equation Puzzle Game',
      description: 'Challenge your mathematical skills with our addictive daily puzzle game. Guess the hidden equation in 6 tries or less.',
      type: 'website',
    },
  }
}

export default async function NerdleHomePage() {
  const about = await getTranslations('about')
  const tips = await getTranslations('tips')

  return (
    <div className="relative">
      <HeroSection />
      <StatsBar />
      <BentoFeatures />
      <RulesVisual />
      <section className="bg-white px-4 py-16 dark:bg-gray-950 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          <Link
            href="/about"
            className="group rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              {about('subtitle')}
            </p>
            <h2 className="mt-3 text-2xl font-black text-gray-950 dark:text-white">
              {about('title')}
            </h2>
            <p className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
              {about('whatIsNerdleText')}
            </p>
            <span className="mt-5 inline-flex items-center font-bold text-blue-600 dark:text-blue-400">
              {about('whatIsNerdle')} <span className="ml-2" aria-hidden="true">→</span>
            </span>
          </Link>

          <Link
            href="/nerd/nerdle-answer-today"
            className="group rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              {tips('subtitle')}
            </p>
            <h2 className="mt-3 text-2xl font-black text-gray-950 dark:text-white">
              {tips('title')}
            </h2>
            <p className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
              {tips('whyNoAnswersText')}
            </p>
            <span className="mt-5 inline-flex items-center font-bold text-emerald-600 dark:text-emerald-400">
              {tips('expertStrategies')} <span className="ml-2" aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      </section>
      <FinalCTA />
    </div>
  )
}
