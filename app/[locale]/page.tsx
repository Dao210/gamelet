import { createPageMetadata } from '@/lib/seo-utils'
import GameCollectionHome from '@/components/home/GameCollectionHome'
import { WebSiteSchema } from '@/components/JsonLd'
import type { Locale } from '@/i18n/config'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return createPageMetadata({ locale, pathname: '/', title: 'Gamelet Puzzle Arcade - Brainy Mini Games', description: 'Discover clever, quick, and playful puzzle games on Gamelet: math games, pattern games, logic challenges, and new mini-game concepts.' })
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <><WebSiteSchema locale={locale as Locale} /><GameCollectionHome /></>
}
