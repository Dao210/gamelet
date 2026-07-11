export const CIPHER_SYMBOLS = ['◆', '●', '▲', '■', '✦', '⬟', '◇', '○', '△', '□', '✧', '⬡', '◈', '◉', '▴', '▣', '✶', '⬢', '◐', '◒', '◑', '◓', '✚', '✜', '⌁', '⌘'] as const

export interface CipherLevelDefinition {
  id: number
  answer: string
  clue: string
  category: string
}

export interface CipherPuzzle extends CipherLevelDefinition {
  encoded: Array<string | null>
  symbolToLetter: Record<string, string>
  uniqueSymbols: string[]
}

export type CipherAssignments = Record<string, string>
export type AssignmentResult =
  | { ok: true; assignments: CipherAssignments }
  | { ok: false; reason: 'letter-used'; assignments: CipherAssignments }

export const CIPHER_LEVELS: CipherLevelDefinition[] = [
  { id: 1, answer: 'BLOOM', clue: 'What a garden does in spring', category: 'NATURE' },
  { id: 2, answer: 'COMPASS', clue: 'It points, but has no finger', category: 'OBJECT' },
  { id: 3, answer: 'FIREFLY', clue: 'A tiny lantern with wings', category: 'CREATURE' },
  { id: 4, answer: 'PAPER TRAIL', clue: 'Evidence left by documents', category: 'PHRASE' },
  { id: 5, answer: 'OPEN SECRET', clue: 'Known by everyone, admitted by no one', category: 'PHRASE' },
  { id: 6, answer: 'NIGHT GARDEN', clue: 'A place where moonflowers wake', category: 'FINAL FILE' }
]

export function createCipherPuzzle(level: CipherLevelDefinition): CipherPuzzle {
  const letters = Array.from(new Set(level.answer.replace(/[^A-Z]/g, '')))
  const symbolToLetter = Object.fromEntries(letters.map((letter, index) => [CIPHER_SYMBOLS[index], letter]))
  const letterToSymbol = Object.fromEntries(Object.entries(symbolToLetter).map(([symbol, letter]) => [letter, symbol]))
  const encoded = [...level.answer].map((character) => character === ' ' ? null : letterToSymbol[character])

  return { ...level, encoded, symbolToLetter, uniqueSymbols: Object.keys(symbolToLetter) }
}

export function assignCipherLetter(assignments: CipherAssignments, symbol: string, letter: string): AssignmentResult {
  const normalized = letter.toUpperCase()
  if (!/^[A-Z]$/.test(normalized)) return { ok: true, assignments }

  const conflictingSymbol = Object.keys(assignments).find((key) => key !== symbol && assignments[key] === normalized)
  if (conflictingSymbol) return { ok: false, reason: 'letter-used', assignments }

  return { ok: true, assignments: { ...assignments, [symbol]: normalized } }
}

export function clearCipherLetter(assignments: CipherAssignments, symbol: string): CipherAssignments {
  const next = { ...assignments }
  delete next[symbol]
  return next
}

export function decodeCipher(puzzle: CipherPuzzle, assignments: CipherAssignments) {
  return puzzle.encoded.map((symbol) => symbol === null ? ' ' : assignments[symbol] ?? '_').join('')
}

export function isCipherComplete(puzzle: CipherPuzzle, assignments: CipherAssignments) {
  return puzzle.uniqueSymbols.every((symbol) => Boolean(assignments[symbol]))
}

export function isCipherSolved(puzzle: CipherPuzzle, assignments: CipherAssignments) {
  return decodeCipher(puzzle, assignments) === puzzle.answer
}

export function revealCipherHint(puzzle: CipherPuzzle, assignments: CipherAssignments) {
  const symbol = puzzle.uniqueSymbols.find((candidate) => assignments[candidate] !== puzzle.symbolToLetter[candidate])
  if (!symbol) return { assignments, revealedSymbol: null }

  const correctLetter = puzzle.symbolToLetter[symbol]
  const withoutConflict = Object.fromEntries(Object.entries(assignments).filter(([key, letter]) => key === symbol || letter !== correctLetter))
  return { assignments: { ...withoutConflict, [symbol]: correctLetter }, revealedSymbol: symbol }
}

export function calculateCipherScore(mistakes: number, hints: number) {
  return Math.max(100, 500 - mistakes * 75 - hints * 100)
}
