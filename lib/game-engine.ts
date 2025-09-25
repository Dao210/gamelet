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
  // For now, use curated examples that fit the target length exactly
  const examples: Record<GameMode, string[]> = {
    classic: [
      '12+34=46',
      '23+45=68',
      '56-12=44',
      '78-12=66',
      '15+25=40',
      '63-21=42',
      '27+15=42',
      '50-12=38'
    ],
    mini: [
      '10-2=8',
      '5+7=12',
      '6*2=12',
      '16/2=8',
      '14-6=8',
      '9+3=12'
    ],
    expert: [
      '123+45=168',
      '234+56=290',
      '345+67=412',
      '23*45=1035',
      '672/24=28',
      '789-45=744'
    ]
  }
  const list = examples[mode]
  return list[Math.floor(Math.random() * list.length)]
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
    // Disallow leading zeros on the right side unless the number is exactly "0"
    if (rightSide.length > 1 && rightSide.trim().startsWith('0')) return false
    
    // Check if left side is a valid mathematical expression
    if (!/^[\d+\-*/]+$/.test(leftSide.trim())) return false
    // Tokenize and validate structure (no consecutive operators, no leading/trailing operator)
    const tokens = tokenize(leftSide.trim())
    if (!validateTokens(tokens)) return false
    
    // Evaluate the left side and compare with right side
    const result = evaluateExpression(leftSide.trim())
    const expected = parseInt(rightSide.trim())
    
    return result === expected
  } catch {
    return false
  }
}

// Tokenize expression into numbers and operators
function tokenize(expr: string): string[] {
  const cleaned = expr.replace(/\s/g, '')
  const tokens = cleaned.match(/\d+|[+\-*/]/g)
  if (!tokens) return []
  return tokens
}

function validateTokens(tokens: string[]): boolean {
  if (tokens.length === 0) return false
  // Must start and end with number
  if (!/^\d+$/.test(tokens[0])) return false
  if (!/^\d+$/.test(tokens[tokens.length - 1])) return false
  
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (/^\d+$/.test(t)) {
      // no leading zeros unless number is exactly '0'
      if (t.length > 1 && t.startsWith('0')) return false
    } else {
      // operator cannot be adjacent to another operator
      if (i === 0 || i === tokens.length - 1) return false
      if (!/^\d+$/.test(tokens[i - 1]) || !/^\d+$/.test(tokens[i + 1])) return false
    }
  }
  return true
}

// Expression evaluator with operator precedence and integer-only division
function evaluateExpression(expr: string): number {
  const tokens = tokenize(expr)
  if (!validateTokens(tokens)) throw new Error('Invalid tokens')
  
  // First pass: handle * and /
  const stack: string[] = []
  let i = 0
  while (i < tokens.length) {
    const token = tokens[i]
    if (token === '*' || token === '/') {
      // compute with previous number
      const prev = parseInt(stack.pop() as string)
      const next = parseInt(tokens[i + 1])
      if (Number.isNaN(prev) || Number.isNaN(next)) throw new Error('Invalid operands')
      let value: number
      if (token === '*') {
        value = prev * next
      } else {
        // require exact integer division
        if (next === 0) throw new Error('Division by zero')
        if (prev % next !== 0) throw new Error('Non-integer division')
        value = Math.trunc(prev / next)
      }
      stack.push(String(value))
      i += 2
    } else {
      stack.push(token)
      i += 1
    }
  }
  
  // Second pass: handle + and - left-to-right
  let result = parseInt(stack[0])
  for (let j = 1; j < stack.length; j += 2) {
    const op = stack[j]
    const num = parseInt(stack[j + 1])
    if (op === '+') result += num
    else if (op === '-') result -= num
  }
  return result
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
