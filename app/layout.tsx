import '../styles/globals.css'
import { GoogleAnalytics } from '../components/GoogleAnalytics'
import { ReactNode } from 'react'
import { getLocale } from 'next-intl/server'
import { defaultLocale, isValidLocale } from '@/i18n/config'

export const metadata = {
  title: {
    default: 'Gamelet Puzzle Arcade - Brainy Mini Games',
    template: '%s | Gamelet'
  },
  description: 'Play clever, quick, and fun puzzle mini games on Gamelet, including math games, pattern challenges, logic games, and new brain teasers.',
  keywords: 'gamelet, mini games, puzzle games, math games, logic games, brain teasers, nerdle, fibonacci 2584',
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
        url: 'https://gamelet.app/og.png',
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
    site: '@gameletapp',
    creator: '@gameletapp',
    images: ['https://gamelet.app/og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/gamelet-logo.svg',
    apple: '/favicon.ico',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export const viewport = {
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
    <html lang={locale} className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          async
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
