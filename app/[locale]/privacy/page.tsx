import { generateLanguageAlternates, getCanonicalUrl } from '@/lib/seo-utils'
import { type Locale } from '@/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const pathname = '/privacy'

  return {
    title: 'Privacy Policy',
    description: 'Learn how Gamelet handles analytics, local game progress, and creative content data.',
    alternates: {
      canonical: getCanonicalUrl(pathname, locale as Locale),
      languages: generateLanguageAlternates(pathname)
    }
  }
}

export default function PrivacyPage() {
  return (
    <main className="bg-[#f8faf6] text-[#171711]">
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#00a676]">
          Gamelet
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-5 text-lg leading-8 text-[#424235]">
          Gamelet is built for lightweight play. We keep data collection narrow and use it to
          operate games, remember local progress, understand aggregate usage, and protect creative
          community features.
        </p>

        <div className="mt-10 space-y-8 text-base leading-7 text-[#424235]">
          <section>
            <h2 className="text-xl font-black text-[#171711]">What We Store</h2>
            <p className="mt-2">
              Puzzle progress, settings, streaks, and best scores may be stored in your browser.
              Grassland artwork and watering activity may be stored on our servers when you choose
              to publish a plant.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#171711]">Analytics And Ads</h2>
            <p className="mt-2">
              We use analytics to understand aggregate product performance. Pages may load Google
              services for analytics or advertising, which can process device and usage signals
              under their own policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#171711]">User Content</h2>
            <p className="mt-2">
              Published plant artwork is public by design. Do not upload private, sensitive, or
              copyrighted material unless you have the right to share it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#171711]">Contact</h2>
            <p className="mt-2">
              For privacy questions or content removal requests, contact us through the contact
              page.
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}
