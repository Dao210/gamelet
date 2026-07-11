import { generateLanguageAlternates, getCanonicalUrl } from '@/lib/seo-utils'
import { type Locale } from '@/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const pathname = '/terms'

  return {
    title: 'Terms of Service',
    description: 'The basic rules for playing Gamelet puzzle games and publishing creative content.',
    alternates: {
      canonical: getCanonicalUrl(pathname, locale as Locale),
      languages: generateLanguageAlternates(pathname)
    }
  }
}

export default function TermsPage() {
  return (
    <main className="bg-[#f8faf6] text-[#171711]">
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#f07c2f]">
          Gamelet
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-5 text-lg leading-8 text-[#424235]">
          By using Gamelet, you agree to play fairly, respect other people&apos;s creative work, and
          avoid using the service in ways that damage the games or community.
        </p>

        <div className="mt-10 space-y-8 text-base leading-7 text-[#424235]">
          <section>
            <h2 className="text-xl font-black text-[#171711]">Fair Play</h2>
            <p className="mt-2">
              Do not automate gameplay, abuse sharing features, attack APIs, or manipulate scoring
              and growth systems.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#171711]">Creative Content</h2>
            <p className="mt-2">
              You are responsible for artwork you publish. Keep uploads lawful, respectful, and
              appropriate for a broad audience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#171711]">Availability</h2>
            <p className="mt-2">
              Gamelet is provided as an evolving game platform. Features may change as we improve
              gameplay, safety, performance, and community tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#171711]">Moderation</h2>
            <p className="mt-2">
              We may remove content or restrict access when needed to protect users, comply with
              law, or keep the games reliable.
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}
