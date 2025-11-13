import '../styles/globals.css'
import { GoogleAnalytics } from '../components/GoogleAnalytics'
import MobileOptimization from '../components/MobileOptimization'
import { ReactNode } from 'react'

export const metadata = {
  title: {
    default: 'Nerdle - Daily Math Equation Puzzle Game',
    template: '%s | Nerdle Math Game'
  },
  description: 'Play Nerdle, the addictive daily math equation guessing game! Challenge your mathematical skills with our free online puzzle game.',
  keywords: 'nerdle, mathle, math game, equation puzzle, daily challenge, mathematical puzzle, number game',
  authors: [{ name: 'Chimii.com' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chimii.com',
    siteName: 'Nerdle Math Game',
    title: 'Nerdle - Daily Math Equation Puzzle Game',
    description: 'Play Nerdle, the addictive daily math equation guessing game!',
    images: [
      {
        url: 'https://chimii.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nerdle Math Game - Daily Equation Puzzle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nerdle - Daily Math Equation Puzzle Game',
    description: 'Play Nerdle, the addictive daily math equation guessing game!',
    site: '@nerdlemathgame',
    creator: '@nerdlemathgame',
    images: ['https://chimii.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

type Props = {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html className="h-full">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8886185433147735"
          crossOrigin="anonymous"
        />
      </head>
      <body className="h-full">
        <MobileOptimization />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}