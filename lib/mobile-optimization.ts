/**
 * Mobile optimization utilities for the Nerdle game
 * Handles mobile-specific keyboard issues and touch interactions
 */

export interface MobileDeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isTouch: boolean
  userAgent: string
}

/**
 * Detect if the device is mobile
 */
export function getMobileDeviceInfo(): MobileDeviceInfo {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window

  // Mobile detection regex
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobile = mobileRegex.test(userAgent) || isTouch

  // Tablet detection (iPads, Android tablets, etc.)
  const tabletRegex = /iPad|Android(?!.*Mobile)|Tablet/i
  const isTablet = tabletRegex.test(userAgent) || (isMobile && window.innerWidth >= 768)

  return {
    isMobile,
    isTablet,
    isTouch,
    userAgent
  }
}

/**
 * Check if mobile virtual keyboard should be disabled
 */
export function shouldDisableMobileKeyboard(): boolean {
  const deviceInfo = getMobileDeviceInfo()

  // On mobile devices, we might want to disable the native keyboard
  // to avoid conflicts with our virtual keyboard
  return deviceInfo.isMobile && !deviceInfo.isTablet
}

/**
 * Get mobile-specific input mode for better UX
 */
export function getMobileInputMode(): 'none' | 'text' | 'numeric' {
  const deviceInfo = getMobileDeviceInfo()

  if (deviceInfo.isMobile && !deviceInfo.isTablet) {
    return 'none' // Prevent mobile keyboard from appearing
  }

  return 'text'
}

/**
 * Handle mobile touch events for better interaction
 * Optimized for faster response and fewer conflicts
 */
export function createMobileTouchHandler(
  onKeyPress: (key: string) => void,
  onBackspace: () => void,
  onSubmit: () => void
) {
  let touchStartTime: number = 0
  let touchStartPos: { x: number; y: number } | null = null
  let isLongPress = false
  let longPressTimer: NodeJS.Timeout | null = null
  let lastTapTime: number = 0

  const handleTouchStart = (event: TouchEvent) => {
    touchStartTime = Date.now()
    const touch = event.touches[0]
    touchStartPos = { x: touch.clientX, y: touch.clientY }
    isLongPress = false

    // Prevent default to avoid scrolling and other browser behaviors
    event.preventDefault()

    // Reduced long press detection time for better responsiveness
    longPressTimer = setTimeout(() => {
      isLongPress = true
      handleLongPress(event)
    }, 300) // Reduced from 500ms to 300ms
  }

  const handleTouchMove = (event: TouchEvent) => {
    // Cancel long press if finger moves too much (more sensitive)
    if (touchStartPos) {
      const touch = event.touches[0]
      const deltaX = Math.abs(touch.clientX - touchStartPos.x)
      const deltaY = Math.abs(touch.clientY - touchStartPos.y)

      // Reduced movement threshold for better touch detection
      if (deltaX > 5 || deltaY > 5) {
        if (longPressTimer) {
          clearTimeout(longPressTimer)
          longPressTimer = null
        }
      }
    }
  }

  const handleTouchEnd = (event: TouchEvent) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }

    // Prevent default to avoid unwanted browser behaviors
    event.preventDefault()

    if (!isLongPress) {
      // Handle regular tap immediately
      handleTap(event)
    }
  }

  const handleTap = (event: TouchEvent) => {
    // Double-tap detection for better UX
    const now = Date.now()
    const isDoubleTap = now - lastTapTime < 300
    lastTapTime = now

    // Get the element that was touched
    const target = event.target as HTMLElement
    const key = target.getAttribute('data-key')

    if (key) {
      // Add haptic feedback for better user experience
      if (navigator.vibrate) {
        if (key === 'Backspace' || key === 'Enter') {
          navigator.vibrate(15) // Shorter vibration for actions
        } else {
          navigator.vibrate(5) // Minimal vibration for inputs
        }
      }

      // Execute action immediately
      switch (key) {
        case 'Backspace':
          onBackspace()
          break
        case 'Enter':
          onSubmit()
          break
        default:
          onKeyPress(key)
          break
      }

      // Visual feedback
      target.style.transform = 'scale(0.95)'
      setTimeout(() => {
        target.style.transform = ''
      }, 100)
    }
  }

  const handleLongPress = (event: TouchEvent) => {
    // Handle long press actions (like showing keyboard hints)
    const target = event.target as HTMLElement

    // Add visual feedback for long press
    target.style.backgroundColor = 'rgba(59, 130, 246, 0.2)' // Light blue
    setTimeout(() => {
      target.style.backgroundColor = ''
    }, 200)
  }

  const cleanup = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
    }
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    cleanup
  }
}

/**
 * Add haptic feedback for mobile devices
 */
export function addHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  if (typeof window === 'undefined' || !window.navigator) return

  const navigator = window.navigator as Navigator & { vibrate?: (pattern: number | number[]) => boolean }

  if (navigator.vibrate) {
    switch (type) {
      case 'light':
        navigator.vibrate(10)
        break
      case 'medium':
        navigator.vibrate(20)
        break
      case 'heavy':
        navigator.vibrate([30, 10, 30])
        break
    }
  }
}

/**
 * Prevent zoom on double tap for mobile devices
 */
export function preventMobileZoom() {
  if (typeof window === 'undefined') return

  let lastTouchEnd = 0
  document.addEventListener('touchend', (event) => {
    const now = Date.now()
    if (now - lastTouchEnd <= 300) {
      event.preventDefault()
    }
    lastTouchEnd = now
  }, false)

  // Prevent pinch zoom
  document.addEventListener('gesturestart', (event) => {
    event.preventDefault()
  })

  // Prevent zoom when focusing on inputs
  document.addEventListener('touchstart', (event) => {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  })
}

/**
 * Optimize viewport for mobile devices
 */
export function optimizeMobileViewport() {
  if (typeof document === 'undefined') return

  const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
  if (viewport) {
    // Prevent automatic zoom on input focus
    viewport.setAttribute('content',
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
    )
  }
}

/**
 * Add mobile-specific CSS classes
 */
export function addMobileClasses() {
  if (typeof document === 'undefined') return

  const deviceInfo = getMobileDeviceInfo()
  const body = document.body

  if (deviceInfo.isMobile) {
    body.classList.add('mobile-device')
  }

  if (deviceInfo.isTablet) {
    body.classList.add('tablet-device')
  }

  if (deviceInfo.isTouch) {
    body.classList.add('touch-device')
  }

  // Add platform-specific classes
  if (deviceInfo.userAgent.includes('iPhone')) {
    body.classList.add('ios-device')
  }

  if (deviceInfo.userAgent.includes('Android')) {
    body.classList.add('android-device')
  }
}

/**
 * Initialize all mobile optimizations
 */
export function initializeMobileOptimizations() {
  if (typeof window === 'undefined') return

  const deviceInfo = getMobileDeviceInfo()

  if (deviceInfo.isMobile) {
    // Add mobile CSS classes
    addMobileClasses()

    // Prevent unwanted zoom
    preventMobileZoom()

    // Optimize viewport
    optimizeMobileViewport()

    // Add mobile-specific event listeners
    document.addEventListener('DOMContentLoaded', () => {
      // Prevent scrolling when keyboard is focused
      document.addEventListener('touchmove', (event) => {
        if (document.activeElement?.getAttribute('data-keyboard-container')) {
          event.preventDefault()
        }
      }, { passive: false })
    })
  }
}

/**
 * Get mobile-specific styles for keyboard
 */
export function getMobileKeyboardStyles() {
  const deviceInfo = getMobileDeviceInfo()

  if (deviceInfo.isMobile && !deviceInfo.isTablet) {
    return {
      buttonSize: 'min(50px, 8vw)',
      fontSize: 'min(24px, 4vw)',
      gap: 'min(8px, 2vw)',
      padding: 'min(12px, 2vw)'
    }
  }

  if (deviceInfo.isTablet) {
    return {
      buttonSize: 'min(60px, 6vw)',
      fontSize: 'min(28px, 3vw)',
      gap: 'min(10px, 1.5vw)',
      padding: 'min(16px, 2.5vw)'
    }
  }

  // Desktop styles
  return {
    buttonSize: 'auto',
    fontSize: 'auto',
    gap: 'auto',
    padding: 'auto'
  }
}

/**
 * Create a mobile-optimized keyboard event handler
 */
export function createMobileKeyboardHandler() {
  const deviceInfo = getMobileDeviceInfo()

  if (!deviceInfo.isTouch) {
    return null // No mobile optimizations needed for desktop
  }

  let activeElement: HTMLElement | null = null

  const handleFocus = (element: HTMLElement) => {
    activeElement = element

    // Prevent mobile keyboard from appearing
    if (shouldDisableMobileKeyboard()) {
      element.setAttribute('inputmode', 'none')
      element.setAttribute('readonly', 'true')
    }
  }

  const handleBlur = () => {
    activeElement = null
  }

  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement

    // Focus the keyboard container when clicking on game elements
    const keyboardContainer = document.querySelector('[data-keyboard-container]') as HTMLElement
    if (keyboardContainer && target.closest('[data-game-area]')) {
      event.preventDefault()
      keyboardContainer.focus()
    }
  }

  return {
    handleFocus,
    handleBlur,
    handleClick
  }
}