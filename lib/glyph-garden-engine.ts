export const GLYPH_PAIRS = [
  ['△', '▲'],
  ['◇', '◆'],
  ['○', '◉'],
  ['✦', '✧'],
  ['❋', '✺'],
  ['⌘', '⌖'],
  ['☾', '◔'],
  ['♧', '♣']
] as const

export const MAX_ROUNDS = 12
export const STARTING_DEWDROPS = 3

export interface GlyphPuzzle {
  id: number
  size: number
  glyphs: string[]
  oddIndex: number
  commonGlyph: string
  oddGlyph: string
}

export interface GlyphGameState {
  round: number
  score: number
  streak: number
  bestStreak: number
  dew: number
  blooms: number
}

export interface GuessResult {
  correct: boolean
  points: number
  state: GlyphGameState
  finished: boolean
}

export function createSeededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

export function getGridSize(round: number) {
  if (round >= 9) return 6
  if (round >= 5) return 5
  return 4
}

export function createGlyphPuzzle(round: number, random: () => number = Math.random): GlyphPuzzle {
  const size = getGridSize(round)
  const pairIndex = Math.min(GLYPH_PAIRS.length - 1, Math.floor(random() * GLYPH_PAIRS.length))
  const pair = GLYPH_PAIRS[pairIndex]
  const reversed = random() > 0.5
  const commonGlyph = pair[reversed ? 1 : 0]
  const oddGlyph = pair[reversed ? 0 : 1]
  const oddIndex = Math.floor(random() * size * size)
  const glyphs = Array.from({ length: size * size }, (_, index) => index === oddIndex ? oddGlyph : commonGlyph)

  return { id: round, size, glyphs, oddIndex, commonGlyph, oddGlyph }
}

export function createInitialGlyphState(): GlyphGameState {
  return { round: 1, score: 0, streak: 0, bestStreak: 0, dew: STARTING_DEWDROPS, blooms: 0 }
}

export function scoreGuess(state: GlyphGameState, selectedIndex: number, puzzle: GlyphPuzzle): GuessResult {
  const correct = selectedIndex === puzzle.oddIndex
  const nextStreak = correct ? state.streak + 1 : 0
  const points = correct ? 100 + Math.min(state.streak, 5) * 25 + puzzle.size * 5 : 0
  const nextState: GlyphGameState = {
    round: state.round + 1,
    score: state.score + points,
    streak: nextStreak,
    bestStreak: Math.max(state.bestStreak, nextStreak),
    dew: Math.max(0, state.dew - (correct ? 0 : 1)),
    blooms: state.blooms + (correct ? 1 : 0)
  }

  return {
    correct,
    points,
    state: nextState,
    finished: nextState.round > MAX_ROUNDS || nextState.dew === 0
  }
}
