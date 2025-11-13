'use client'

import { useEffect } from 'react'
import { initializeMobileOptimizations } from '../lib/mobile-optimization'

export default function MobileOptimization() {
  useEffect(() => {
    // Initialize mobile optimizations when the component mounts
    initializeMobileOptimizations()

    // Add mobile-specific meta tags if needed
    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
    if (viewport && window.innerWidth <= 768) {
      viewport.setAttribute('content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      )
    }
  }, [])

  return null
}