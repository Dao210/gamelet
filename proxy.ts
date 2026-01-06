/**
 * Middleware for locale detection and routing
 * Handles automatic locale detection and URL routing for internationalization
 */

import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all pathnames except for:
  // - /api routes
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - Static files (images, icons, etc.)
  matcher: [
    // Match all pathnames except for API routes and static files
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Match root path
    '/',
    // Match locale-prefixed paths
    '/(en|es|fr|de|it|ru|ja|zh)/:path*'
  ]
}
