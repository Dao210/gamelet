import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
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

// Mock the game store
jest.mock('../../lib/store')
const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>

// Mock dependencies
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

// Mock timers
jest.useFakeTimers()

describe('Keyboard Functionality Tests', () => {
  const mockAddChar = jest.fn()
  const mockRemoveChar = jest.fn()
  const mockSubmitAttempt = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()

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

  describe('Number Keys (0-9)', () => {
    test.each(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])('should respond to number key %s', (numberKey) => {
      render(<GameKeyboard />)

      const button = screen.getByText(numberKey)
      fireEvent.click(button)

      expect(mockAddChar).toHaveBeenCalledWith(numberKey)
    })

    test.each(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])('should show visual feedback for number key %s', (numberKey) => {
      render(<GameKeyboard />)

      const button = screen.getByText(numberKey)
      fireEvent.click(button)

      // Check if visual feedback state is set
      expect(button).toHaveClass('text-white', 'scale-95')
    })
  })

  describe('Operator Keys (+, -, *, /, =)', () => {
    test.each(['+', '-', '*', '/', '='])('should respond to operator key %s', (operatorKey) => {
      render(<GameKeyboard />)

      const button = screen.getByText(operatorKey)
      fireEvent.click(button)

      expect(mockAddChar).toHaveBeenCalledWith(operatorKey)
    })

    test.each(['+', '-', '*', '/', '='])('should show visual feedback for operator key %s', (operatorKey) => {
      render(<GameKeyboard />)

      const button = screen.getByText(operatorKey)
      fireEvent.click(button)

      expect(button).toHaveClass('text-white', 'scale-95')
    })
  })

  describe('Backspace Key', () => {
    beforeEach(() => {
      mockUseGameStore.mockReturnValue({
        gameState: {
          mode: 'classic' as const,
          status: 'playing' as const,
          attempts: [],
          target: '1+2=3',
          startTime: new Date(),
          endTime: null
        },
        currentAttempt: '123',
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

    it('should respond to backspace key when there is content', () => {
      render(<GameKeyboard />)

      const backButton = screen.getByText('⌫')
      fireEvent.click(backButton)

      expect(mockRemoveChar).toHaveBeenCalled()
    })

    it('should show visual feedback for backspace key', () => {
      render(<GameKeyboard />)

      const backButton = screen.getByText('⌫')
      fireEvent.click(backButton)

      expect(backButton).toHaveClass('text-white', 'scale-95')
    })

    it('should be disabled when current attempt is empty', () => {
      mockUseGameStore.mockReturnValue({
        gameState: {
          mode: 'classic' as const,
          status: 'playing' as const,
          attempts: [],
          target: '1+2=3',
          startTime: new Date(),
          endTime: null
        },
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

      const backButton = screen.getByText('⌫')
      expect(backButton).toBeDisabled()
    })
  })

  describe('Enter Key', () => {
    it('should respond to enter key when equation is complete', () => {
      mockUseGameStore.mockReturnValue({
        gameState: {
          mode: 'classic' as const,
          status: 'playing' as const,
          attempts: [],
          target: '1+2=3',
          startTime: new Date(),
          endTime: null
        },
        currentAttempt: '12+34=46', // Classic mode: 8 characters
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

      const enterButton = screen.getByText('Enter')
      fireEvent.click(enterButton)

      expect(mockSubmitAttempt).toHaveBeenCalled()
    })

    it('should show visual feedback for enter key', () => {
      mockUseGameStore.mockReturnValue({
        gameState: {
          mode: 'classic' as const,
          status: 'playing' as const,
          attempts: [],
          target: '1+2=3',
          startTime: new Date(),
          endTime: null
        },
        currentAttempt: '12+34=46', // Classic mode: 8 characters
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

      const enterButton = screen.getByText('Enter')
      fireEvent.click(enterButton)

      expect(enterButton).toHaveClass('text-white', 'scale-95')
    })

    it('should be disabled when equation is incomplete', () => {
      render(<GameKeyboard />)

      const enterButton = screen.getByText('Enter')
      expect(enterButton).toBeDisabled()
    })
  })

  describe('Visual Feedback Timing', () => {
    it('should clear visual feedback after 50ms', () => {
      render(<GameKeyboard />)

      const button = screen.getByText('5')
      fireEvent.click(button)

      // Initially shows pressed state
      expect(button).toHaveClass('text-white', 'scale-95')

      // Fast-forward time to clear feedback
      // Need to run both requestAnimationFrame and setTimeout
      act(() => {
        jest.runAllTimers() // This will run both RAF and setTimeout
      })

      // Feedback should be cleared
      expect(button).not.toHaveClass('scale-95')
    })
  })

  describe('Game State Constraints', () => {
    it('should not accept input when game is not playing', () => {
      mockUseGameStore.mockReturnValue({
        gameState: {
          mode: 'classic' as const,
          status: 'won' as const,
          attempts: [],
          target: '1+2=3',
          startTime: new Date(),
          endTime: new Date()
        },
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

      const button = screen.getByText('5')
      fireEvent.click(button)

      expect(mockAddChar).not.toHaveBeenCalled()
    })
  })

  describe('Rapid Input Testing', () => {
    it('should handle rapid successive key presses', () => {
      render(<GameKeyboard />)

      const keys = ['1', '+', '2', '='] // 4 keys for classic mode

      keys.forEach(key => {
        const button = screen.getByText(key)
        fireEvent.click(button)
      })

      expect(mockAddChar).toHaveBeenCalledTimes(4)
      expect(mockAddChar).toHaveBeenLastCalledWith('=')
    })

    it('should handle rapid backspace presses', () => {
      mockUseGameStore.mockReturnValue({
        gameState: {
          mode: 'classic' as const,
          status: 'playing' as const,
          attempts: [],
          target: '1+2=3',
          startTime: new Date(),
          endTime: null
        },
        currentAttempt: '12345',
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

      const backButton = screen.getByText('⌫')

      // Press backspace multiple times rapidly
      for (let i = 0; i < 3; i++) {
        fireEvent.click(backButton)
      }

      expect(mockRemoveChar).toHaveBeenCalledTimes(3)
    })
  })
})
