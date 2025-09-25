import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { trackPageView } from './analytics'

export const usePageTracking = () => {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      trackPageView(url)
    }

    // Track initial page load
    trackPageView(router.asPath)

    // Track route changes
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])
}
