import type { Puzzle, Rect, PlayState, PlacementError } from './types'

export const EMPTY_PLAY: PlayState = { rects: [], past: [], future: [] }
export const sameRect = (a: Rect, b: Rect) => a.every((n, i) => n === b[i])
export const contains = (rect: Rect, row: number, col: number) => row >= rect[0] && row <= rect[2] && col >= rect[1] && col <= rect[3]
export const area = (r: Rect) => (r[2] - r[0] + 1) * (r[3] - r[1] + 1)
export const overlaps = (a: Rect, b: Rect) => a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1]
export function rectangle(a: number, b: number, cols: number): Rect {
  const ar = Math.floor(a / cols), br = Math.floor(b / cols)
  return [Math.min(ar, br), Math.min(a % cols, b % cols), Math.max(ar, br), Math.max(a % cols, b % cols)]
}
export function placementError(p: Puzzle, r: Rect, rects: readonly Rect[] = []): PlacementError | null {
  if (r.length !== 4 || !r.every(Number.isInteger) || r[0] < 0 || r[1] < 0 || r[2] >= p.rows || r[3] >= p.cols || r[0] > r[2] || r[1] > r[3]) return 'bounds'
  if (rects.some(other => overlaps(r, other))) return 'overlap'
  const clues = p.clues.filter(c => contains(r, Math.floor(c.cell / p.cols), c.cell % p.cols))
  if (clues.length !== 1) return 'clue'
  const clue = clues[0], h = r[2] - r[0] + 1, w = r[3] - r[1] + 1
  if (clue.area !== null && clue.area !== w * h) return 'area'
  if ((clue.shape === 'square' && w !== h) || (clue.shape === 'wide' && w <= h) || (clue.shape === 'tall' && h <= w)) return 'shape'
  return null
}
export function isComplete(p: Puzzle, rects: readonly Rect[]) {
  return rects.length === p.clues.length && rects.every((r, i) => !placementError(p, r, rects.slice(0, i))) && rects.reduce((sum, r) => sum + area(r), 0) === p.rows * p.cols
}
export function changeRects(state: PlayState, rects: readonly Rect[]): PlayState {
  return { rects, past: [...state.past.slice(-99), state.rects], future: [] }
}
export function undo(state: PlayState): PlayState {
  if (!state.past.length) return state
  return { rects: state.past[state.past.length - 1], past: state.past.slice(0, -1), future: [state.rects, ...state.future].slice(0, 100) }
}
export function redo(state: PlayState): PlayState {
  if (!state.future.length) return state
  return { rects: state.future[0], past: [...state.past, state.rects].slice(-100), future: state.future.slice(1) }
}
export function nextHint(p: Puzzle, rects: readonly Rect[]) {
  const wrong = rects.find(r => !p.solution.some(s => sameRect(r, s)))
  if (wrong) return { kind: 'conflict' as const, rect: wrong }
  // Each stored proof step follows all previous steps. Future correct placements
  // can only remove candidates, so the first unplaced proof remains valid.
  const step = p.hints.find(h => !rects.some(r => sameRect(r, p.solution[h.clue])))
  return step ? { kind: 'deduction' as const, step, rect: p.solution[step.clue] } : null
}
export function utcDay(date = new Date()) { return date.toISOString().slice(0, 10) }
