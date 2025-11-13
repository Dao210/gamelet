import { NextResponse } from 'next/server'

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Allow all language paths
Allow: /es/
Allow: /fr/
Allow: /de/
Allow: /it/
Allow: /ru/
Allow: /ja/
Allow: /zh/

# Allow main sections
Allow: /nerd/
Allow: /garden/
Allow: /about/

# Block admin and internal routes
Disallow: /api/
Disallow: /_next/
Disallow: /static/
Disallow: /*.json$

# Sitemap
Sitemap: https://chimii.com/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Host (preferred domain)
Host: https://chimii.com`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
