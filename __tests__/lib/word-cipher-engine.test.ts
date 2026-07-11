import {
  CIPHER_LEVELS,
  assignCipherLetter,
  calculateCipherScore,
  createCipherPuzzle,
  decodeCipher,
  isCipherComplete,
  isCipherSolved,
  revealCipherHint
} from '@/lib/word-cipher-engine'

describe('word cipher engine', () => {
  const puzzle = createCipherPuzzle(CIPHER_LEVELS[0])

  it('encodes repeated letters with the same symbol', () => {
    expect(puzzle.encoded[2]).toBe(puzzle.encoded[3])
    expect(puzzle.uniqueSymbols).toHaveLength(4)
  })

  it('enforces one-to-one substitution mappings', () => {
    const first = assignCipherLetter({}, puzzle.uniqueSymbols[0], 'B')
    expect(first.ok).toBe(true)
    const conflict = assignCipherLetter(first.assignments, puzzle.uniqueSymbols[1], 'B')
    expect(conflict.ok).toBe(false)
  })

  it('decodes and validates a completed solution', () => {
    const assignments = Object.fromEntries(Object.entries(puzzle.symbolToLetter))
    expect(decodeCipher(puzzle, assignments)).toBe('BLOOM')
    expect(isCipherComplete(puzzle, assignments)).toBe(true)
    expect(isCipherSolved(puzzle, assignments)).toBe(true)
  })

  it('reveals only an unresolved mapping and scores penalties safely', () => {
    const hint = revealCipherHint(puzzle, {})
    expect(hint.revealedSymbol).not.toBeNull()
    expect(Object.keys(hint.assignments)).toHaveLength(1)
    expect(calculateCipherScore(2, 1)).toBe(250)
    expect(calculateCipherScore(99, 99)).toBe(100)
  })
})
