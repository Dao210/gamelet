'use client'

import Script from 'next/script'
import { GA_TRACKING_ID } from '../lib/analytics'

interface GoogleAnalyticsProps {
  trackingId?: string
}

export function GoogleAnalytics({ trackingId = GA_TRACKING_ID }: GoogleAnalyticsProps) {

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
      />
      
      {/* Google Analytics Configuration */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true,
              anonymize_ip: true,
              transport_type: 'beacon'
            });
          `,
        }}
      />
    </>
  )
}
