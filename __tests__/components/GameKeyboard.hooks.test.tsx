import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { useGameStore } from '../../lib/store'
import GameKeyboard from '../../components/GameKeyboard'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: { key?: string }) => {
    const messages: Record<string, string> = {
      enter: 'Enter',
      ariaKeyboard: 'Virtual keyboard for math equation input',
      ariaEnterNumber: `Enter ${values?.key} number`,
      ariaEnterOperator: `Enter ${values?.key} operator`,
      ariaBackspace: 'Backspace delete last character',
      ariaSubmitEnabled: 'Submit equation',
      ariaSubmitDisabled: 'Submit equation (disabled - equation incomplete)'
    }
    return messages[key]
  }
}))

// Mock the game store with controlled states
jest.mock('../../lib/store')
const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>

// Mock dependencies that might affect hook order
jest.mock('../../lib/game-engine', () => ({
  isValidChar: jest.fn((char: string) => '0123456789+-*/='.includes(char))
}))

jest.mock('../../lib/keyboard-handler', () => ({
  createKeyboardManager: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    updateOptions: jest.fn(),
    autoFocus: jest.fn()
  }))
}))

jest.mock('../../lib/mobile-optimization', () => ({
  getMobileDeviceInfo: jest.fn(() => ({
    isMobile: false,
    isTablet: false,
    isTouch: false,
    userAgent: 'test'
  })),
  getMobileKeyboardStyles: jest.fn(() => ({
    buttonSize: 'auto',
    fontSize: 'auto',
    gap: 'auto',
    padding: 'auto'
  })),
  shouldDisableMobileKeyboard: jest.fn(() => false),
  addHapticFeedback: jest.fn(),
  createMobileTouchHandler: jest.fn(() => ({
    handleTouchStart: jest.fn(),
    handleTouchMove: jest.fn(),
    handleTouchEnd: jest.fn(),
    cleanup: jest.fn()
  }))
}))

// Mock timers
jest.useFakeTimers()

describe('GameKeyboard React Hooks Order', () => {
  const mockAddChar = jest.fn()
  const mockRemoveChar = jest.fn()
  const mockSubmitAttempt = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()

    // Default game state with all required properties
    const mockGameState = {
      mode: 'classic' as const,
      status: 'playing' as const,
      attempts: [],
      target: '1+2=3',
      startTime: new Date(),
      endTime: null
    }

    mockUseGameStore.mockReturnValue({
      gameState: mockGameState,
      currentAttempt: '',
      addCharToAttempt: mockAddChar,
      removeCharFromAttempt: mockRemoveChar,
      submitAttempt: mockSubmitAttempt,
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        bestStreak: 0,
        averageAttempts: 0,
        modeStats: {
          classic: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
          mini: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
          expert: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 }
        }
      },
      settings: {
        theme: 'light' as const,
        soundEnabled: true,
        animationsEnabled: true,
        colorBlindMode: false
      },
      startNewGame: jest.fn(),
      updateSettings: jest.fn(),
      resetStats: jest.fn()
    })
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('Hook Order Consistency', () => {
    it('should maintain consistent hook order when gameState changes from null to defined', () => {
      // Test 1: Render with null gameState
      mockUseGameStore.mockReturnValue({
        gameState: null,
        currentAttempt: '',
        addCharToAttempt: mockAddChar,
        removeCharFromAttempt: mockRemoveChar,
        submitAttempt: mockSubmitAttempt,
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          bestStreak: 0,
          averageAttempts: 0,
          modeStats: {
            classic: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
            mini: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
            expert: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 }
          }
        },
        settings: {
          theme: 'light' as const,
          soundEnabled: true,
          animationsEnabled: true,
          colorBlindMode: false
        },
        startNewGame: jest.fn(),
        updateSettings: jest.fn(),
        resetStats: jest.fn()
      })

      const { unmount, rerender } = render(<GameKeyboard />)

      // Component should render null without errors
      expect(screen.queryByText('1')).not.toBeInTheDocument()

      // Test 2: Update with valid gameState
      const mockGameState = {
        mode: 'classic' as const,
        status: 'playing' as const,
        attempts: [],
        target: '1+2=3',
        startTime: new Date(),
        endTime: null
      }

      mockUseGameStore.mockReturnValue({
        gameState: mockGameState,
        currentAttempt: '',
        addCharToAttempt: mockAddChar,
        removeCharFromAttempt: mockRemoveChar,
        submitAttempt: mockSubmitAttempt,
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          bestStreak: 0,
          averageAttempts: 0,
          modeStats: {
            classic: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
            mini: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
            expert: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 }
          }
        },
        settings: {
          theme: 'light' as const,
          soundEnabled: true,
          animationsEnabled: true,
          colorBlindMode: false
        },
        startNewGame: jest.fn(),
        updateSettings: jest.fn(),
        resetStats: jest.fn()
      })

      // Rerender with new props - this should not cause hook order issues
      act(() => {
        rerender(<GameKeyboard />)
      })

      // Component should now render properly
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()

      unmount()
    })

    it('should maintain consistent hook order during multiple state changes', () => {
      const { rerender } = render(<GameKeyboard />)

      // Initial render should work
      expect(screen.getByText('1')).toBeInTheDocument()

      // Change 1: Update currentAttempt
      mockUseGameStore.mockReturnValue({
        gameState: {
          mode: 'classic' as const,
          status: 'playing' as const,
          attempts: [],
          target: '1+2=3',
          startTime: new Date(),
          endTime: null
        },
        currentAttempt: '1+2',
        addCharToAttempt: mockAddChar,
        removeCharFromAttempt: mockRemoveChar,
        submitAttempt: mockSubmitAttempt,
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          bestStreak: 0,
          averageAttempts: 0,
          modeStats: {
            classic: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
            mini: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
            expert: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 }
          }
        },
        settings: {
          theme: 'light' as const,
          soundEnabled: true,
          animationsEnabled: true,
          colorBlindMode: false
        },
        startNewGame: jest.fn(),
        updateSettings: jest.fn(),
        resetStats: jest.fn()
      })

      act(() => {
        rerender(<GameKeyboard />)
      })

      // Should still work without hook order issues
      expect(screen.getByText('1')).toBeInTheDocument()

      // Change 2: Update game status
      mockUseGameStore.mockReturnValue({
        gameState: {
          mode: 'classic' as const,
          status: 'won' as const,
          attempts: [],
          target: '1+2=3',
          startTime: new Date(),
          endTime: new Date()
        },
        currentAttempt: '1+2=3',
        addCharToAttempt: mockAddChar,
        removeCharFromAttempt: mockRemoveChar,
        submitAttempt: mockSubmitAttempt,
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          bestStreak: 0,
          averageAttempts: 0,
          modeStats: {
            classic: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
            mini: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
            expert: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 }
          }
        },
        settings: {
          theme: 'light' as const,
          soundEnabled: true,
          animationsEnabled: true,
          colorBlindMode: false
        },
        startNewGame: jest.fn(),
        updateSettings: jest.fn(),
        resetStats: jest.fn()
      })

      act(() => {
        rerender(<GameKeyboard />)
      })

      // Should still work without hook order issues
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('should handle rapid consecutive renders without hook order issues', () => {
      const { rerender } = render(<GameKeyboard />)

      // Rapid state changes that might trigger hook order issues
      const states = [
        { currentAttempt: '1' },
        { currentAttempt: '12' },
        { currentAttempt: '1+2' },
        { currentAttempt: '1+2=' },
        { currentAttempt: '1+2=3' }
      ]

      states.forEach((state, index) => {
        mockUseGameStore.mockReturnValue({
          gameState: {
            mode: 'classic' as const,
            status: 'playing' as const,
            attempts: [],
            target: '1+2=3',
            startTime: new Date(),
            endTime: null
          },
          currentAttempt: state.currentAttempt,
          addCharToAttempt: mockAddChar,
          removeCharFromAttempt: mockRemoveChar,
          submitAttempt: mockSubmitAttempt,
          stats: {
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            bestStreak: 0,
            averageAttempts: 0,
            modeStats: {
              classic: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
              mini: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
              expert: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 }
            }
          },
          settings: {
            theme: 'light' as const,
            soundEnabled: true,
            animationsEnabled: true,
            colorBlindMode: false
          },
          startNewGame: jest.fn(),
          updateSettings: jest.fn(),
          resetStats: jest.fn()
        })

        act(() => {
          rerender(<GameKeyboard />)
        })

        // Should always be able to find keyboard elements
        expect(screen.getByText('1')).toBeInTheDocument()
      })
    })
  })

  describe('Hooks are called before conditional returns', () => {
    it('should call all hooks even when gameState is null', () => {
      // Mock console.error to capture React warnings
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      mockUseGameStore.mockReturnValue({
        gameState: null,
        currentAttempt: '',
        addCharToAttempt: mockAddChar,
        removeCharFromAttempt: mockRemoveChar,
        submitAttempt: mockSubmitAttempt,
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          bestStreak: 0,
          averageAttempts: 0,
          modeStats: {
            classic: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
            mini: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 },
            expert: { gamesPlayed: 0, gamesWon: 0, averageAttempts: 0 }
          }
        },
        settings: {
          theme: 'light' as const,
          soundEnabled: true,
          animationsEnabled: true,
          colorBlindMode: false
        },
        startNewGame: jest.fn(),
        updateSettings: jest.fn(),
        resetStats: jest.fn()
      })

      render(<GameKeyboard />)

      // Check if React logged any hook order warnings
      const hookOrderWarnings = consoleSpy.mock.calls.filter(call =>
        call[0] && typeof call[0] === 'string' && call[0].includes('change in the order of Hooks')
      )

      expect(hookOrderWarnings).toHaveLength(0)

      consoleSpy.mockRestore()
    })
  })
})
