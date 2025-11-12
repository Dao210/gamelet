import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /
Allow: /nerd/
Allow: /garden/
Allow: /api/share-image

# Block admin and internal routes
Disallow: /api/
Disallow: /_next/
Disallow: /static/
Disallow: /*.json$

# Sitemap
Sitemap: https://chimii.com/sitemap.xml

# Crawl-delay
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}