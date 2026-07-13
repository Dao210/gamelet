import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import PolicyPage from '@/components/content/PolicyPage'
import { isValidLocale } from '@/i18n/config'
import { createPageMetadata } from '@/lib/seo-utils'

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params
  const locale = isValidLocale(requestedLocale) ? requestedLocale : 'en'
  const t = await getTranslations({ locale, namespace: 'legalPages.terms' })
  return createPageMetadata({ locale, pathname: '/terms', title: t('title'), description: t('description') })
}

export default async function TermsPage() {
  const t = await getTranslations('legalPages.terms')
  return <PolicyPage title={t('title')} intro={t('intro')} accentClassName="text-[#f07c2f]" sections={[
    { title: t('fairPlayTitle'), text: t('fairPlayText') },
    { title: t('contentTitle'), text: t('contentText') },
    { title: t('availabilityTitle'), text: t('availabilityText') },
    { title: t('moderationTitle'), text: t('moderationText') }
  ]} />
}
