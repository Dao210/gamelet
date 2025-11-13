import {
  handleKeyDown,
  isValidKey,
  shouldPreventDefault,
  getKeyCategory,
  normalizeKey
} from '../../lib/keyboard-handler'

describe('keyboard-handler', () => {
  describe('isValidKey', () => {
    it('should return true for valid number keys', () => {
      for (let i = 0; i <= 9; i++) {
        expect(isValidKey(i.toString())).toBe(true)
      }
    })

    it('should return true for valid operator keys', () => {
      expect(isValidKey('+')).toBe(true)
      expect(isValidKey('-')).toBe(true)
      expect(isValidKey('*')).toBe(true)
      expect(isValidKey('/')).toBe(true)
      expect(isValidKey('=')).toBe(true)
    })

    it('should return false for invalid keys', () => {
      expect(isValidKey('a')).toBe(false)
      expect(isValidKey('?')).toBe(false)
      expect(isValidKey('!')).toBe(false)
      expect(isValidKey(' ')).toBe(false)
      expect(isValidKey(',')).toBe(false)
    })

    it('should handle uppercase letters', () => {
      expect(isValidKey('A')).toBe(false)
      expect(isValidKey('B')).toBe(false)
    })
  })

  describe('shouldPreventDefault', () => {
    it('should return true for backspace', () => {
      expect(shouldPreventDefault('Backspace')).toBe(true)
    })

    it('should return true for enter when it should be handled', () => {
      expect(shouldPreventDefault('Enter', true)).toBe(true)
    })

    it('should return false for enter when it should not be handled', () => {
      expect(shouldPreventDefault('Enter', false)).toBe(false)
    })

    it('should return false for valid character keys', () => {
      expect(shouldPreventDefault('5')).toBe(false)
      expect(shouldPreventDefault('+')).toBe(false)
    })

    it('should return false for invalid keys', () => {
      expect(shouldPreventDefault('a')).toBe(false)
      expect(shouldPreventDefault('?')).toBe(false)
    })
  })

  describe('getKeyCategory', () => {
    it('should categorize number keys correctly', () => {
      for (let i = 0; i <= 9; i++) {
        expect(getKeyCategory(i.toString())).toBe('number')
      }
    })

    it('should categorize operator keys correctly', () => {
      expect(getKeyCategory('+')).toBe('operator')
      expect(getKeyCategory('-')).toBe('operator')
      expect(getKeyCategory('*')).toBe('operator')
      expect(getKeyCategory('/')).toBe('operator')
      expect(getKeyCategory('=')).toBe('operator')
    })

    it('should categorize special keys correctly', () => {
      expect(getKeyCategory('Backspace')).toBe('backspace')
      expect(getKeyCategory('Enter')).toBe('enter')
    })

    it('should return unknown for unrecognized keys', () => {
      expect(getKeyCategory('a')).toBe('unknown')
      expect(getKeyCategory('?')).toBe('unknown')
    })
  })

  describe('normalizeKey', () => {
    it('should normalize numpad keys', () => {
      expect(normalizeKey('0')).toBe('0')
      expect(normalizeKey('1')).toBe('1')
    })

    it('should handle special key cases', () => {
      expect(normalizeKey('Enter')).toBe('Enter')
      expect(normalizeKey('Backspace')).toBe('Backspace')
    })

    it('should return original key for normal cases', () => {
      expect(normalizeKey('5')).toBe('5')
      expect(normalizeKey('+')).toBe('+')
    })
  })

  describe('handleKeyDown', () => {
    const mockOnKeyPress = jest.fn()
    const mockOnBackspace = jest.fn()
    const mockOnSubmit = jest.fn()

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should call onKeyPress for valid number keys', () => {
      const event = new KeyboardEvent('keydown', { key: '5' })
      const preventDefault = jest.fn()
      Object.defineProperty(event, 'preventDefault', { value: preventDefault })

      handleKeyDown(event, {
        onKeyPress: mockOnKeyPress,
        onBackspace: mockOnBackspace,
        onSubmit: mockOnSubmit,
        canSubmit: false,
        maxLength: 8,
        currentLength: 0,
        isGamePlaying: true
      })

      expect(mockOnKeyPress).toHaveBeenCalledWith('5')
      expect(preventDefault).not.toHaveBeenCalled()
    })

    it('should call onKeyPress for valid operator keys', () => {
      const event = new KeyboardEvent('keydown', { key: '+' })
      const preventDefault = jest.fn()
      Object.defineProperty(event, 'preventDefault', { value: preventDefault })

      handleKeyDown(event, {
        onKeyPress: mockOnKeyPress,
        onBackspace: mockOnBackspace,
        onSubmit: mockOnSubmit,
        canSubmit: false,
        maxLength: 8,
        currentLength: 1, // Changed from 0 to 1 - operators can only be entered after a number
        isGamePlaying: true
      })

      expect(mockOnKeyPress).toHaveBeenCalledWith('+')
      expect(preventDefault).not.toHaveBeenCalled()
    })

    it('should call onBackspace and prevent default for backspace', () => {
      const event = new KeyboardEvent('keydown', { key: 'Backspace' })
      const preventDefault = jest.fn()
      Object.defineProperty(event, 'preventDefault', { value: preventDefault })

      handleKeyDown(event, {
        onKeyPress: mockOnKeyPress,
        onBackspace: mockOnBackspace,
        onSubmit: mockOnSubmit,
        canSubmit: false,
        maxLength: 8,
        currentLength: 2,
        isGamePlaying: true
      })

      expect(mockOnBackspace).toHaveBeenCalled()
      expect(preventDefault).toHaveBeenCalled()
    })

    it('should call onSubmit when enter is pressed and can submit', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      const preventDefault = jest.fn()
      Object.defineProperty(event, 'preventDefault', { value: preventDefault })

      handleKeyDown(event, {
        onKeyPress: mockOnKeyPress,
        onBackspace: mockOnBackspace,
        onSubmit: mockOnSubmit,
        canSubmit: true,
        maxLength: 8,
        currentLength: 8,
        isGamePlaying: true
      })

      expect(mockOnSubmit).toHaveBeenCalled()
      expect(preventDefault).toHaveBeenCalled()
    })

    it('should not call onSubmit when enter is pressed but cannot submit', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      const preventDefault = jest.fn()
      Object.defineProperty(event, 'preventDefault', { value: preventDefault })

      handleKeyDown(event, {
        onKeyPress: mockOnKeyPress,
        onBackspace: mockOnBackspace,
        onSubmit: mockOnSubmit,
        canSubmit: false,
        maxLength: 8,
        currentLength: 6,
        isGamePlaying: true
      })

      expect(mockOnSubmit).not.toHaveBeenCalled()
      expect(preventDefault).not.toHaveBeenCalled()
    })

    it('should not handle input when game is not playing', () => {
      const event = new KeyboardEvent('keydown', { key: '5' })
      const preventDefault = jest.fn()
      Object.defineProperty(event, 'preventDefault', { value: preventDefault })

      handleKeyDown(event, {
        onKeyPress: mockOnKeyPress,
        onBackspace: mockOnBackspace,
        onSubmit: mockOnSubmit,
        canSubmit: false,
        maxLength: 8,
        currentLength: 0,
        isGamePlaying: false
      })

      expect(mockOnKeyPress).not.toHaveBeenCalled()
    })

    it('should not handle input when current length is at max', () => {
      const event = new KeyboardEvent('keydown', { key: '5' })
      const preventDefault = jest.fn()
      Object.defineProperty(event, 'preventDefault', { value: preventDefault })

      handleKeyDown(event, {
        onKeyPress: mockOnKeyPress,
        onBackspace: mockOnBackspace,
        onSubmit: mockOnSubmit,
        canSubmit: false,
        maxLength: 8,
        currentLength: 8,
        isGamePlaying: true
      })

      expect(mockOnKeyPress).not.toHaveBeenCalled()
    })

    it('should ignore invalid keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' })
      const preventDefault = jest.fn()
      Object.defineProperty(event, 'preventDefault', { value: preventDefault })

      handleKeyDown(event, {
        onKeyPress: mockOnKeyPress,
        onBackspace: mockOnBackspace,
        onSubmit: mockOnSubmit,
        canSubmit: false,
        maxLength: 8,
        currentLength: 0,
        isGamePlaying: true
      })

      expect(mockOnKeyPress).not.toHaveBeenCalled()
      expect(mockOnBackspace).not.toHaveBeenCalled()
      expect(mockOnSubmit).not.toHaveBeenCalled()
      expect(preventDefault).not.toHaveBeenCalled()
    })

    it('should allow backspace even when current length is 0', () => {
      const event = new KeyboardEvent('keydown', { key: 'Backspace' })
      const preventDefault = jest.fn()
      Object.defineProperty(event, 'preventDefault', { value: preventDefault })

      handleKeyDown(event, {
        onKeyPress: mockOnKeyPress,
        onBackspace: mockOnBackspace,
        onSubmit: mockOnSubmit,
        canSubmit: false,
        maxLength: 8,
        currentLength: 0,
        isGamePlaying: true
      })

      expect(mockOnBackspace).toHaveBeenCalled()
      expect(preventDefault).toHaveBeenCalled()
    })

    it('should handle complex key combinations gracefully', () => {
      const event = new KeyboardEvent('keydown', {
        key: '5',
        ctrlKey: true,
        shiftKey: true
      })
      const preventDefault = jest.fn()
      Object.defineProperty(event, 'preventDefault', { value: preventDefault })

      handleKeyDown(event, {
        onKeyPress: mockOnKeyPress,
        onBackspace: mockOnBackspace,
        onSubmit: mockOnSubmit,
        canSubmit: false,
        maxLength: 8,
        currentLength: 0,
        isGamePlaying: true
      })

      // Should still handle the key normally even with modifiers
      expect(mockOnKeyPress).toHaveBeenCalledWith('5')
    })
  })
})