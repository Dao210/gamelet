import GamePageClient from './GamePageClient';
import { getTranslations } from 'next-intl/server'
import { createPageMetadata } from '@/lib/seo-utils'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  return createPageMetadata({ locale, pathname: '/nerd/game', title: t('gameTitle'), description: t('gameDescription') })
}

export default function GamePage() {
  return <GamePageClient />;
}
