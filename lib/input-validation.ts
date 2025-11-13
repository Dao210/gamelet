/**
 * Enhanced input validation for the Nerdle game
 * Provides detailed feedback and validation rules for mathematical equations
 */

import { TileState } from './game-engine'

export interface ValidationResult {
  isValid: boolean
  error?: string
  suggestions?: string[]
  category?: 'syntax' | 'math' | 'structure' | 'length'
}

export interface EquationValidationResult extends ValidationResult {
  isComplete?: boolean
  canBeValid?: boolean
  missingElements?: string[]
}

/**
 * Check if a character is valid for the game
 */
export function isValidChar(char: string): boolean {
  return '0123456789+-*/='.includes(char)
}

/**
 * Get character category for validation feedback
 */
export function getCharCategory(char: string): 'number' | 'operator' | 'equals' | 'invalid' {
  if ('0123456789'.includes(char)) return 'number'
  if ('+-*/'.includes(char)) return 'operator'
  if (char === '=') return 'equals'
  return 'invalid'
}

/**
 * Validate individual character input
 */
export function validateCharInput(
  char: string,
  currentEquation: string,
  maxLength: number
): ValidationResult {
  // Check if character is valid
  if (!isValidChar(char)) {
    return {
      isValid: false,
      error: 'Invalid character. Use numbers 0-9 and operators +, -, *, /, =',
      category: 'syntax'
    }
  }

  // Check length constraint
  if (currentEquation.length >= maxLength) {
    return {
      isValid: false,
      error: `Maximum equation length is ${maxLength} characters`,
      category: 'length'
    }
  }

  const charCategory = getCharCategory(char)

  // Check equals sign constraints
  if (char === '=') {
    if (currentEquation.includes('=')) {
      return {
        isValid: false,
        error: 'Equation can only contain one equals sign',
        category: 'structure'
      }
    }
    if (currentEquation.length === 0) {
      return {
        isValid: false,
        error: 'Equation must start with a number',
        category: 'syntax'
      }
    }
    if (!currentEquation.match(/\d/)) {
      return {
        isValid: false,
        error: 'Left side of equation must contain at least one number',
        category: 'structure'
      }
    }
  }

  // Check operator constraints
  if (charCategory === 'operator') {
    const lastChar = currentEquation.slice(-1)
    if (currentEquation.length === 0) {
      return {
        isValid: false,
        error: 'Equation must start with a number',
        category: 'syntax'
      }
    }
    if (lastChar && '+-*/='.includes(lastChar)) {
      return {
        isValid: false,
        error: 'Cannot place operator after another operator or equals',
        category: 'syntax'
      }
    }
  }

  // Check number constraints
  if (charCategory === 'number') {
    // Numbers are generally valid in most positions
    if (currentEquation === '') {
      return { isValid: true }
    }

    const lastChar = currentEquation.slice(-1)
    if (lastChar === '=') {
      // Numbers after equals are generally fine for the result
      return { isValid: true }
    }
  }

  return { isValid: true }
}

/**
 * Check if an equation is mathematically valid
 */
export function validateEquationMath(equation: string): ValidationResult {
  try {
    // Check if it's a complete equation with equals
    if (!equation.includes('=')) {
      return {
        isValid: false,
        error: 'Equation must contain an equals sign',
        category: 'structure'
      }
    }

    const [leftSide, rightSide] = equation.split('=')

    // Both sides must be non-empty
    if (!leftSide.trim() || !rightSide.trim()) {
      return {
        isValid: false,
        error: 'Both sides of the equation must contain expressions',
        category: 'structure'
      }
    }

    // Check if both sides are valid mathematical expressions
    if (!isValidMathExpression(leftSide) || !isValidMathExpression(rightSide)) {
      return {
        isValid: false,
        error: 'Invalid mathematical expression',
        category: 'math'
      }
    }

    // Evaluate both sides
    const leftResult = evaluateMathExpression(leftSide)
    const rightResult = evaluateMathExpression(rightSide)

    // Check if results are equal
    if (leftResult !== rightResult) {
      return {
        isValid: false,
        error: 'Equation is not mathematically correct',
        category: 'math',
        suggestions: [
          `Left side equals ${leftResult}, right side equals ${rightResult}`,
          'Check your calculations and try again'
        ]
      }
    }

    // Check if result is positive integer
    if (leftResult <= 0 || !Number.isInteger(leftResult)) {
      return {
        isValid: false,
        error: 'Result must be a positive integer',
        category: 'math'
      }
    }

    return { isValid: true }
  } catch (error) {
    return {
      isValid: false,
      error: 'Unable to evaluate equation',
      category: 'math'
    }
  }
}

/**
 * Validate if an equation can potentially become valid
 */
export function validatePartialEquation(equation: string, maxLength: number): EquationValidationResult {
  if (equation.length === 0) {
    return {
      isValid: true,
      isComplete: false,
      canBeValid: true,
      missingElements: ['numbers', 'operators', '=']
    }
  }

  // Check character validity
  for (let i = 0; i < equation.length; i++) {
    const char = equation[i]
    if (!isValidChar(char)) {
      return {
        isValid: false,
        error: `Invalid character "${char}" at position ${i + 1}`,
        category: 'syntax'
      }
    }
  }

  // Check for multiple equals signs
  const equalsCount = (equation.match(/=/g) || []).length
  if (equalsCount > 1) {
    return {
      isValid: false,
      error: 'Equation can only contain one equals sign',
      category: 'structure'
    }
  }

  // Check if it starts with an operator
  if ('+-*/'.includes(equation[0])) {
    return {
      isValid: false,
      error: 'Equation must start with a number',
      category: 'syntax'
    }
  }

  // Check for consecutive operators
  if (/[+\-*/]{2,}/.test(equation)) {
    return {
      isValid: false,
      error: 'Cannot have consecutive operators',
      category: 'syntax'
    }
  }

  // Check if it ends with an operator
  if ('+-*/'.includes(equation.slice(-1))) {
    return {
      isValid: false,
      error: 'Equation cannot end with an operator',
      category: 'syntax'
    }
  }

  // Check if it's complete (has equals and both sides have numbers)
  const hasEquals = equation.includes('=')
  if (hasEquals) {
    const [leftSide, rightSide] = equation.split('=')
    const hasLeftNumbers = /\d/.test(leftSide)
    const hasRightNumbers = /\d/.test(rightSide)

    if (!hasLeftNumbers || !hasRightNumbers) {
      return {
        isValid: true,
        isComplete: false,
        canBeValid: true,
        missingElements: !hasLeftNumbers ? ['numbers on left side'] : ['numbers on right side']
      }
    }

    // Validate the complete equation
    const mathValidation = validateEquationMath(equation)
    return {
      ...mathValidation,
      isComplete: mathValidation.isValid,
      canBeValid: mathValidation.isValid
    }
  } else {
    // Partial equation without equals
    const hasNumbers = /\d/.test(equation)
    if (!hasNumbers) {
      return {
        isValid: true,
        isComplete: false,
        canBeValid: true,
        missingElements: ['numbers']
      }
    }

    return {
      isValid: true,
      isComplete: false,
      canBeValid: true,
      missingElements: ['=', 'result']
    }
  }
}

/**
 * Check if a string is a valid mathematical expression
 */
function isValidMathExpression(expr: string): boolean {
  // Check if it's a valid format (numbers and operators only, no consecutive operators)
  if (!/^[0-9+\-*/]+$/.test(expr)) return false
  if (/[+\-*/]{2,}/.test(expr)) return false
  if (/[+\-*/]$/.test(expr)) return false
  if (/^[+\-*/]/.test(expr)) return false

  return true
}

/**
 * Safely evaluate a mathematical expression
 */
function evaluateMathExpression(expr: string): number {
  // Simple evaluation - in production, you might want a more robust solution
  try {
    // Use Function constructor for safer evaluation than eval
    return Function('"use strict"; return (' + expr + ')')();
  } catch (error) {
    throw new Error('Invalid mathematical expression')
  }
}

/**
 * Get helpful suggestions for improving an equation
 */
export function getEquationSuggestions(equation: string): string[] {
  const suggestions: string[] = []

  if (equation.length === 0) {
    suggestions.push('Start with a number, e.g., "1"')
    suggestions.push('Try a simple equation like "1+1=2"')
    return suggestions
  }

  const validation = validatePartialEquation(equation, 8)

  if (!validation.isValid) {
    if (validation.error) {
      suggestions.push(validation.error)
    }
  } else {
    if (!equation.includes('=')) {
      suggestions.push('Add an equals sign (=) to complete the equation')

      if (/\d/.test(equation)) {
        suggestions.push('Try adding "=<result>" to complete your equation')
      }
    } else {
      const [leftSide, rightSide] = equation.split('=')
      if (!rightSide || !/\d/.test(rightSide)) {
        suggestions.push('Add a result number after the equals sign')
      }
    }
  }

  // Add general tips
  if (equation.length < 3) {
    suggestions.push('Try simple equations: "1+1=2", "2*3=6", "8-4=4"')
  }

  return suggestions
}

/**
 * Get validation feedback for the user
 */
export function getValidationFeedback(
  equation: string,
  maxLength: number
): {
  isValid: boolean
  message: string
  type: 'error' | 'warning' | 'success' | 'info'
  suggestions?: string[]
} {
  const validation = validatePartialEquation(equation, maxLength)

  if (!validation.isValid) {
    return {
      isValid: false,
      message: validation.error || 'Invalid equation',
      type: 'error',
      suggestions: validation.suggestions
    }
  }

  if (validation.isComplete && validation.isValid) {
    return {
      isValid: true,
      message: 'Valid equation! Ready to submit.',
      type: 'success'
    }
  }

  if (equation.length >= maxLength - 2) {
    return {
      isValid: true,
      message: `Almost there! Add ${maxLength - equation.length} more character(s) to complete.`,
      type: 'warning'
    }
  }

  if (equation.includes('=')) {
    const [leftSide, rightSide] = equation.split('=')
    if (!rightSide) {
      return {
        isValid: true,
        message: 'Add a result after the equals sign',
        type: 'info',
        suggestions: ['Try calculating the result of the left side']
      }
    }
  }

  return {
    isValid: true,
    message: 'Building your equation...',
    type: 'info',
    suggestions: getEquationSuggestions(equation)
  }
}