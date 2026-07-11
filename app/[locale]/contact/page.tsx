import { generateLanguageAlternates, getCanonicalUrl } from '@/lib/seo-utils'
import { type Locale } from '@/i18n/config'
import { Link } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const pathname = '/contact'

  return {
    title: 'Contact',
    description: 'Contact Gamelet for product feedback, privacy requests, and creative content concerns.',
    alternates: {
      canonical: getCanonicalUrl(pathname, locale as Locale),
      languages: generateLanguageAlternates(pathname)
    }
  }
}

export default function ContactPage() {
  return (
    <main className="bg-[#f8faf6] text-[#171711]">
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#db3f5d]">
          Gamelet
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
          Contact
        </h1>
        <p className="mt-5 text-lg leading-8 text-[#424235]">
          Send product feedback, report creative content, or ask about privacy and data requests.
          We keep this simple while the arcade grows.
        </p>

        <div className="mt-10 border-l-4 border-[#171711] bg-white px-5 py-6 shadow-[4px_4px_0_#ffe66d]">
          <h2 className="text-xl font-black">Email</h2>
          <a
            href="mailto:hello@gamelet.app"
            className="mt-2 inline-flex text-lg font-bold text-[#00a676] underline underline-offset-4"
          >
            hello@gamelet.app
          </a>
          <p className="mt-4 text-sm leading-6 text-[#6c6b5b]">
            Include the page URL, game name, and any relevant plant or puzzle details so we can
            understand the request quickly.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/privacy"
            className="border border-[#171711] bg-white px-4 py-2 text-sm font-black text-[#171711] shadow-[3px_3px_0_#00a676]"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="border border-[#171711] bg-white px-4 py-2 text-sm font-black text-[#171711] shadow-[3px_3px_0_#f07c2f]"
          >
            Terms
          </Link>
        </div>
      </section>
    </main>
  )
}
