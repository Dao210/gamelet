import { generateLanguageAlternates, getCanonicalUrl } from '@/lib/seo-utils'
import { type Locale } from '@/i18n/config'
import GameCollectionHome from '@/components/home/GameCollectionHome'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const pathname = '/'

  return {
    title: 'Gamelet Puzzle Arcade - Brainy Mini Games',
    description: 'Discover clever, quick, and playful puzzle games on Gamelet: math games, pattern games, logic challenges, and new mini-game concepts.',
    alternates: {
      canonical: getCanonicalUrl(pathname, locale as Locale),
      languages: generateLanguageAlternates(pathname)
    },
    openGraph: {
      title: 'Gamelet Puzzle Arcade - Brainy Mini Games',
      description: 'A playful collection of clever mini puzzle games for curious minds.',
      type: 'website'
    }
  }
}

export default function LocaleHomePage() {
  return <GameCollectionHome />
}
