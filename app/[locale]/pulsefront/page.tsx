import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import PulsefrontGame from '@/components/pulsefront/PulsefrontGame'
import { createPageMetadata } from '@/lib/seo-utils'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pulsefront' })
  return createPageMetadata({ locale, pathname: '/pulsefront', title: t('metaTitle'), description: t('metaDescription') })
}

export default function PulsefrontPage() {
  return <PulsefrontGame />
}
