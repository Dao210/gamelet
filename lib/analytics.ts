// Google Analytics configuration and utilities
export const GA_TRACKING_ID = 'G-PT1MK2SF3F'

// Define gtag function outside of initGA
const createGtag = () => {
  return (...args: unknown[]) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(args)
    }
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined') {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || []
    
    // Create and assign gtag function
    const gtag = createGtag()
    window.gtag = gtag
    
    // Initialize with current date
    gtag('js', new Date())
    
    // Configure GA4
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
      // Enhanced measurement settings
      send_page_view: true,
      // Privacy settings
      anonymize_ip: true,
      // Performance settings
      transport_type: 'beacon'
    })
  }
}

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      page_title: title || document.title,
      page_location: window.location.href
    })
  }
}

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'engagement',
      ...parameters
    })
  }
}

// Track game-specific events
export const trackGameEvent = (eventName: string, gameMode: string, parameters?: Record<string, unknown>) => {
  trackEvent(eventName, {
    event_category: 'game',
    game_mode: gameMode,
    ...parameters
  })
}

// Track game completion
export const trackGameCompletion = (gameMode: string, attempts: number, status: 'won' | 'lost', duration?: number) => {
  trackGameEvent('game_completion', gameMode, {
    attempts: attempts,
    status: status,
    duration: duration,
    value: status === 'won' ? 1 : 0
  })
}

// Track game start
export const trackGameStart = (gameMode: string) => {
  trackGameEvent('game_start', gameMode)
}

// Track share events
export const trackShare = (platform: string, gameMode: string, status: 'won' | 'lost') => {
  trackGameEvent('share', gameMode, {
    platform: platform,
    game_status: status
  })
}

// Track mode switch
export const trackModeSwitch = (fromMode: string, toMode: string) => {
  trackEvent('mode_switch', {
    event_category: 'game',
    from_mode: fromMode,
    to_mode: toMode
  })
}

// Declare global types for TypeScript
declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}
