import React from 'react';
import '../styles/globals.css';
import { DefaultSeo } from 'next-seo';
import { defaultSEO } from '../lib/seo';
import GoogleAnalytics from '../components/GoogleAnalytics';

export const metadata = {
  title: defaultSEO.title,
  description: defaultSEO.description,
  openGraph: defaultSEO.openGraph,
  twitter: defaultSEO.twitter,
  additionalMetaTags: defaultSEO.additionalMetaTags,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8886185433147735"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}