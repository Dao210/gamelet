import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import PolicyPage from '@/components/content/PolicyPage'
import { isValidLocale } from '@/i18n/config'
import { createPageMetadata } from '@/lib/seo-utils'

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params
  const locale = isValidLocale(requestedLocale) ? requestedLocale : 'en'
  const t = await getTranslations({ locale, namespace: 'legalPages.privacy' })
  return createPageMetadata({ locale, pathname: '/privacy', title: t('title'), description: t('description') })
}

export default async function PrivacyPage() {
  const t = await getTranslations('legalPages.privacy')
  return <PolicyPage title={t('title')} intro={t('intro')} accentClassName="text-[#00a676]" sections={[
    { title: t('storageTitle'), text: t('storageText') },
    { title: t('analyticsTitle'), text: t('analyticsText') },
    { title: t('contentTitle'), text: t('contentText') },
    { title: t('contactTitle'), text: t('contactText') }
  ]} />
}
