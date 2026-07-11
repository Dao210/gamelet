import {
  createGlyphPuzzle,
  createInitialGlyphState,
  createSeededRandom,
  getGridSize,
  scoreGuess
} from '@/lib/glyph-garden-engine'

describe('glyph garden engine', () => {
  it('creates a deterministic grid with exactly one odd glyph', () => {
    const puzzle = createGlyphPuzzle(1, createSeededRandom(42))
    expect(puzzle.size).toBe(4)
    expect(puzzle.glyphs.filter((glyph) => glyph === puzzle.oddGlyph)).toHaveLength(1)
    expect(puzzle.glyphs[puzzle.oddIndex]).toBe(puzzle.oddGlyph)
  })

  it('increases grid size as the garden grows', () => {
    expect(getGridSize(1)).toBe(4)
    expect(getGridSize(5)).toBe(5)
    expect(getGridSize(9)).toBe(6)
  })

  it('rewards streaks and grows a bloom on a correct guess', () => {
    const puzzle = createGlyphPuzzle(1, createSeededRandom(7))
    const first = scoreGuess(createInitialGlyphState(), puzzle.oddIndex, puzzle)
    const second = scoreGuess(first.state, puzzle.oddIndex, puzzle)
    expect(first.correct).toBe(true)
    expect(second.points).toBeGreaterThan(first.points)
    expect(second.state.blooms).toBe(2)
    expect(second.state.dew).toBe(3)
  })

  it('breaks the streak and consumes dew on a wrong guess', () => {
    const puzzle = createGlyphPuzzle(1, createSeededRandom(9))
    const result = scoreGuess({ ...createInitialGlyphState(), streak: 3 }, (puzzle.oddIndex + 1) % 16, puzzle)
    expect(result.correct).toBe(false)
    expect(result.state.streak).toBe(0)
    expect(result.state.dew).toBe(2)
  })
})
