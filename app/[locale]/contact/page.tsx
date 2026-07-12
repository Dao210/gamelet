import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { isValidLocale } from '@/i18n/config'
import { generateLanguageAlternates, getCanonicalUrl } from '@/lib/seo-utils'

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params
  const locale = isValidLocale(requestedLocale) ? requestedLocale : 'en'
  const t = await getTranslations({ locale, namespace: 'legalPages.contact' })
  return { title: t('title'), description: t('description'), alternates: { canonical: getCanonicalUrl('/contact', locale), languages: generateLanguageAlternates('/contact') } }
}

export default async function ContactPage() {
  const t = await getTranslations('legalPages.contact')
  return (
    <main className="bg-[#f8faf6] text-[#171711]">
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#db3f5d]">Gamelet</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">{t('title')}</h1>
        <p className="mt-5 text-lg leading-8 text-[#424235]">{t('intro')}</p>
        <div className="mt-10 border-l-4 border-[#171711] bg-white px-5 py-6 shadow-[4px_4px_0_#ffe66d]">
          <h2 className="text-xl font-black">{t('email')}</h2>
          <a href="mailto:hello@gamelet.app" className="mt-2 inline-flex text-lg font-bold text-[#00a676] underline underline-offset-4">hello@gamelet.app</a>
          <p className="mt-4 text-sm leading-6 text-[#6c6b5b]">{t('emailHint')}</p>
        </div>
        <nav className="mt-10 flex flex-wrap gap-3" aria-label={t('title')}>
          <Link href="/privacy" className="border border-[#171711] bg-white px-4 py-2 text-sm font-black text-[#171711] shadow-[3px_3px_0_#00a676]">{t('privacy')}</Link>
          <Link href="/terms" className="border border-[#171711] bg-white px-4 py-2 text-sm font-black text-[#171711] shadow-[3px_3px_0_#f07c2f]">{t('terms')}</Link>
        </nav>
      </section>
    </main>
  )
}
