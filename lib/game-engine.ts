export type GameMode = 'classic' | 'mini' | 'expert'
export type GameStatus = 'playing' | 'won' | 'lost'
export type TileState = 'correct' | 'present' | 'absent' | 'empty'

export interface GameState {
  mode: GameMode
  target: string
  attempts: string[]
  currentAttempt: string
  status: GameStatus
  maxAttempts: number
  startTime: Date
  endTime?: Date
}

export interface TileFeedback {
  letter: string
  state: TileState
}

export interface AttemptFeedback {
  attempt: string
  tiles: TileFeedback[]
  isValid: boolean
  isCorrect: boolean
}

// Game configuration
export const GAME_CONFIG = {
  classic: {
    length: 8,
    maxAttempts: 6,
    description: 'Classic Nerdle - 8 characters, 6 attempts'
  },
  mini: {
    length: 6,
    maxAttempts: 6,
    description: 'Mini Nerdle - 6 characters, 6 attempts'
  },
  expert: {
    length: 10,
    maxAttempts: 6,
    description: 'Expert Nerdle - 10 characters, 6 attempts'
  }
} as const

// Valid characters for the game
export const VALID_CHARS = '0123456789+-*/='

// Generate a random valid equation
export function generateEquation(mode: GameMode): string {
  const length = GAME_CONFIG[mode].length
  
  // For now, return some example equations
  // In a real implementation, you'd have a more sophisticated generator
  const examples = {
    classic: [
      '12+34=46',
      '56-23=33',
      '7*8=56',
      '84/4=21',
      '15+25=40',
      '90-45=45',
      '6*7=42',
      '72/8=9'
    ],
    mini: [
      '5+3=8',
      '9-4=5',
      '2*3=6',
      '8/2=4',
      '7+1=8',
      '6-2=4',
      '3*2=6',
      '9/3=3'
    ],
    expert: [
      '123+45=168',
      '789-123=666',
      '12*34=408',
      '456/12=38',
      '234+56=290',
      '567-89=478',
      '23*45=1035',
      '678/23=29'
    ]
  }
  
  const modeExamples = examples[mode]
  return modeExamples[Math.floor(Math.random() * modeExamples.length)]
}

// Validate if an equation is mathematically correct
export function isValidEquation(equation: string): boolean {
  try {
    // Check if equation contains exactly one equals sign
    const equalCount = (equation.match(/=/g) || []).length
    if (equalCount !== 1) return false
    
    const [leftSide, rightSide] = equation.split('=')
    
    // Check if right side is a number
    if (!/^\d+$/.test(rightSide.trim())) return false
    
    // Check if left side is a valid mathematical expression
    if (!/^[\d+\-*/]+$/.test(leftSide.trim())) return false
    
    // Evaluate the left side and compare with right side
    const result = evaluateExpression(leftSide.trim())
    const expected = parseInt(rightSide.trim())
    
    return result === expected
  } catch {
    return false
  }
}

// Simple expression evaluator (handles basic arithmetic)
function evaluateExpression(expr: string): number {
  // Remove spaces
  expr = expr.replace(/\s/g, '')
  
  // Handle multiplication and division first
  expr = expr.replace(/(\d+)\*(\d+)/g, (match, a, b) => String(parseInt(a) * parseInt(b)))
  expr = expr.replace(/(\d+)\/(\d+)/g, (match, a, b) => String(Math.floor(parseInt(a) / parseInt(b))))
  
  // Handle addition and subtraction
  expr = expr.replace(/(\d+)\+(\d+)/g, (match, a, b) => String(parseInt(a) + parseInt(b)))
  expr = expr.replace(/(\d+)-(\d+)/g, (match, a, b) => String(parseInt(a) - parseInt(b)))
  
  return parseInt(expr)
}

// Check if a character is valid for the game
export function isValidChar(char: string): boolean {
  return VALID_CHARS.includes(char)
}

// Generate feedback for an attempt
export function generateFeedback(attempt: string, target: string): AttemptFeedback {
  const tiles: TileFeedback[] = []
  const targetChars = target.split('')
  const attemptChars = attempt.split('')
  
  // First pass: mark correct positions
  const targetCounts: { [key: string]: number } = {}
  const attemptCounts: { [key: string]: number } = {}
  
  for (let i = 0; i < attemptChars.length; i++) {
    const char = attemptChars[i]
    const targetChar = targetChars[i]
    
    if (char === targetChar) {
      tiles[i] = { letter: char, state: 'correct' }
    } else {
      tiles[i] = { letter: char, state: 'empty' }
      targetCounts[targetChar] = (targetCounts[targetChar] || 0) + 1
      attemptCounts[char] = (attemptCounts[char] || 0) + 1
    }
  }
  
  // Second pass: mark present and absent
  for (let i = 0; i < attemptChars.length; i++) {
    if (tiles[i].state === 'empty') {
      const char = attemptChars[i]
      if (targetCounts[char] && targetCounts[char] > 0) {
        tiles[i] = { letter: char, state: 'present' }
        targetCounts[char]--
      } else {
        tiles[i] = { letter: char, state: 'absent' }
      }
    }
  }
  
  return {
    attempt,
    tiles,
    isValid: isValidEquation(attempt),
    isCorrect: attempt === target
  }
}

// Initialize a new game
export function initializeGame(mode: GameMode): GameState {
  return {
    mode,
    target: generateEquation(mode),
    attempts: [],
    currentAttempt: '',
    status: 'playing',
    maxAttempts: GAME_CONFIG[mode].maxAttempts,
    startTime: new Date()
  }
}

// Make an attempt in the game
export function makeAttempt(gameState: GameState, attempt: string): GameState {
  if (gameState.status !== 'playing') return gameState
  if (attempt.length !== GAME_CONFIG[gameState.mode].length) return gameState
  if (!isValidEquation(attempt)) return gameState
  
  const newAttempts = [...gameState.attempts, attempt]
  const isCorrect = attempt === gameState.target
  const isLastAttempt = newAttempts.length >= gameState.maxAttempts
  
  let newStatus: GameStatus = 'playing'
  if (isCorrect) {
    newStatus = 'won'
  } else if (isLastAttempt) {
    newStatus = 'lost'
  }
  
  return {
    ...gameState,
    attempts: newAttempts,
    currentAttempt: '',
    status: newStatus,
    endTime: newStatus !== 'playing' ? new Date() : undefined
  }
}

// Get game statistics
export function getGameStats(gameState: GameState) {
  const duration = gameState.endTime 
    ? gameState.endTime.getTime() - gameState.startTime.getTime()
    : Date.now() - gameState.startTime.getTime()
  
  return {
    attempts: gameState.attempts.length,
    maxAttempts: gameState.maxAttempts,
    status: gameState.status,
    duration: Math.floor(duration / 1000), // in seconds
    mode: gameState.mode
  }
}
