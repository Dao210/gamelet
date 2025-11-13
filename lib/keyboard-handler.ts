/**
 * Keyboard input handling utilities for the Nerdle game
 * Provides centralized keyboard event handling with proper validation and focus management
 */

export const VALID_KEYS = '0123456789+-*/='
export type KeyCategory = 'number' | 'operator' | 'backspace' | 'enter' | 'unknown'

export interface KeyboardHandlerOptions {
  onKeyPress: (key: string) => void
  onBackspace: () => void
  onSubmit: () => void
  canSubmit: boolean
  maxLength: number
  currentLength: number
  isGamePlaying: boolean
}

/**
 * Check if a key is valid for the game
 */
export function isValidKey(key: string): boolean {
  return VALID_KEYS.includes(key)
}

/**
 * Check if default should be prevented for a key
 */
export function shouldPreventDefault(key: string, canSubmit: boolean = false): boolean {
  return key === 'Backspace' || (key === 'Enter' && canSubmit)
}

/**
 * Get the category of a key
 */
export function getKeyCategory(key: string): KeyCategory {
  if (isValidKey(key)) {
    return '0123456789'.includes(key) ? 'number' : 'operator'
  }

  switch (key) {
    case 'Backspace':
      return 'backspace'
    case 'Enter':
      return 'enter'
    default:
      return 'unknown'
  }
}

/**
 * Normalize key input (handles special cases, numpad, etc.)
 */
export function normalizeKey(key: string): string {
  // Handle numpad keys if needed in the future
  switch (key) {
    case 'NumpadEnter':
      return 'Enter'
    case 'Delete':
      return 'Backspace'
    default:
      return key
  }
}

/**
 * Handle keyboard input with comprehensive validation and state management
 */
export function handleKeyDown(
  event: KeyboardEvent,
  options: KeyboardHandlerOptions
): void {
  const {
    onKeyPress,
    onBackspace,
    onSubmit,
    canSubmit,
    maxLength,
    currentLength,
    isGamePlaying
  } = options

  // Don't handle input if game is not playing
  if (!isGamePlaying) {
    return
  }

  const key = normalizeKey(event.key)
  const keyCategory = getKeyCategory(key)

  // Enhanced validation with better error handling
  try {
    switch (keyCategory) {
      case 'number':
      case 'operator':
        // Only accept input if we haven't reached max length
        if (currentLength < maxLength) {
          // Additional validation to prevent invalid combinations
          if (isValidInputSequence(key, options)) {
            onKeyPress(key)
          }
        }
        break

      case 'backspace':
        event.preventDefault()
        onBackspace()
        break

      case 'enter':
        if (canSubmit) {
          event.preventDefault()
          onSubmit()
        }
        break

      case 'unknown':
      default:
        // Ignore invalid keys
        break
    }
  } catch (error) {
    console.error('Error handling keyboard input:', error)
    // Fallback: try to process the input anyway
    if (keyCategory === 'number' || keyCategory === 'operator') {
      if (currentLength < maxLength) {
        onKeyPress(key)
      }
    }
  }
}

/**
 * Validate if the key can be added to current input sequence
 */
function isValidInputSequence(
  key: string,
  options: KeyboardHandlerOptions
): boolean {
  const { currentLength } = options

  // Basic validation
  if (currentLength === 0 && '+-*/='.includes(key)) {
    return false // Cannot start with operators or equals
  }

  // Additional validation can be added here
  return true
}

/**
 * Check if an element is focusable and visible
 */
export function isElementFocusable(element: HTMLElement): boolean {
  if (!element) return false

  // Check if element is visible
  const style = window.getComputedStyle(element)
  if (style.display === 'none' || style.visibility === 'hidden') return false

  // Check if element is disabled
  if (element.hasAttribute('disabled')) return false

  // Check if element has valid tabindex
  const tabindex = element.getAttribute('tabindex')
  if (tabindex && parseInt(tabindex, 10) < 0) return false

  return true
}

/**
 * Find the best element to focus for keyboard input
 */
export function findKeyboardFocusElement(): HTMLElement | null {
  // Priority order for focus elements
  const selectors = [
    '[data-keyboard-container]',
    '[tabindex="0"]:not([disabled])',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])'
  ]

  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement
    if (element && isElementFocusable(element)) {
      return element
    }
  }

  return null
}

/**
 * Auto-focus the keyboard container for immediate input
 * Simplified to prevent focus conflicts
 */
export function autoFocusKeyboard(): void {
  const focusElement = findKeyboardFocusElement()
  if (focusElement && document.activeElement !== focusElement) {
    // Only focus if the current active element is not within the game area
    const currentActive = document.activeElement as HTMLElement
    const isInGameArea = currentActive?.closest('[data-game-area]')

    if (!isInGameArea) {
      focusElement.focus()
    }
  }
}

/**
 * Set up global keyboard event listeners for better focus management
 * Simplified to reduce focus conflicts
 */
export function setupGlobalKeyboardListeners(
  handler: (event: KeyboardEvent) => void
): () => void {
  // Listen for keyboard events on the document
  document.addEventListener('keydown', handler, { capture: true })

  // Only auto-focus when user clicks on non-game elements
  const clickHandler = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const isInGameArea = target.closest('[data-game-area]')

    // Only auto-focus if clicking outside the game area
    if (!isInGameArea) {
      setTimeout(autoFocusKeyboard, 50) // Increased delay for stability
    }
  }

  document.addEventListener('click', clickHandler)

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handler, { capture: true })
    document.removeEventListener('click', clickHandler)
  }
}

/**
 * Create a keyboard input manager that combines all keyboard functionality
 */
export function createKeyboardManager(options: KeyboardHandlerOptions) {
  let cleanup: (() => void) | null = null

  const handleGlobalKeyDown = (event: KeyboardEvent) => {
    // Check if the event target is an input field that should handle its own keyboard input
    const target = event.target as HTMLElement
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'

    // Let input fields handle their own keyboard input
    if (isInput) {
      return
    }

    // Handle the key event for our game
    handleKeyDown(event, options)
  }

  const start = () => {
    cleanup = setupGlobalKeyboardListeners(handleGlobalKeyDown)
    autoFocusKeyboard()
  }

  const stop = () => {
    if (cleanup) {
      cleanup()
      cleanup = null
    }
  }

  const updateOptions = (newOptions: Partial<KeyboardHandlerOptions>) => {
    Object.assign(options, newOptions)
  }

  return {
    start,
    stop,
    updateOptions,
    autoFocus: autoFocusKeyboard
  }
}