import '../styles/globals.css'
import { GoogleAnalytics } from '../components/GoogleAnalytics'
import { ReactNode } from 'react'
import { getLocale } from 'next-intl/server'
import { defaultLocale, isValidLocale } from '@/i18n/config'
import type { Metadata, Viewport } from 'next'
import { baseUrl, defaultSocialImage, siteName } from '@/lib/seo-utils'
import Script from 'next/script'
import { Fraunces, IBM_Plex_Sans } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-fraunces',
  display: 'swap'
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap'
})

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  applicationName: siteName,
  category: 'games',
  manifest: '/site.webmanifest',
  title: {
    default: 'Gamelet Puzzle Arcade - Brainy Mini Games',
    template: '%s | Gamelet'
  },
  description: 'Play clever, quick, and fun puzzle mini games on Gamelet, including math games, pattern challenges, logic games, and new brain teasers.',
  keywords: ['Gamelet', 'mini games', 'puzzle games', 'math games', 'logic games', 'brain teasers'],
  authors: [{ name: 'Gamelet.app' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gamelet.app',
    siteName: 'Gamelet',
    title: 'Gamelet Puzzle Arcade - Brainy Mini Games',
    description: 'Play clever, quick, and fun puzzle mini games for curious minds.',
    images: [
      {
        url: defaultSocialImage,
        width: 1200,
        height: 630,
        alt: 'Gamelet Puzzle Arcade',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gamelet Puzzle Arcade - Brainy Mini Games',
    description: 'Play clever, quick, and fun puzzle mini games for curious minds.',
    images: [defaultSocialImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/gamelet-logo.svg',
    apple: '/favicon.ico',
  },
  referrer: 'strict-origin-when-cross-origin',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f8faf6',
}

type Props = {
  children: ReactNode
}

export default async function RootLayout({ children }: Props) {
  const requestedLocale = await getLocale()
  const locale = isValidLocale(requestedLocale) ? requestedLocale : defaultLocale

  return (
    <html lang={locale} className={`${fraunces.variable} ${ibmPlexSans.variable} h-full`}>
      <head>
        <Script
          id="google-adsense"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8886185433147735"
          crossOrigin="anonymous"
        />
      </head>
      <body className="h-full">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
