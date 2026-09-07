import { area, changeRects, EMPTY_PLAY, isComplete, nextHint, placementError, rectangle, redo, undo, utcDay } from '@/lib/patches/engine'
import { starter as p } from '@/lib/patches/levels/starter-easy'
import type { Puzzle, Rect } from '@/lib/patches/types'

const one = (shape: Puzzle['clues'][number]['shape'], clueArea: number | null = null): Puzzle => ({ ...p, rows: 3, cols: 3, clues: [{ cell: 0, area: clueArea, shape }] })
describe('Patches rules and history', () => {
  test.each([
    [[-1, 0, 1, 2], 'bounds'], [[0, 0, 5, 0], 'bounds'], [[2, 0, 1, 0], 'bounds'], [[0, 0.5, 1, 2], 'bounds'],
    [[0, 0, 0, 0], 'clue'], [[0, 0, 4, 4], 'clue'], [[1, 1, 1, 1], 'area']
  ] as [Rect, string][])('rejects %j as %s', (rect, error) => expect(placementError(p, rect)).toBe(error))
  it('accepts every rectangle in the answer, but not an overlap or incomplete board', () => {
    p.solution.forEach(r => expect(placementError(p, r)).toBeNull())
    expect(placementError(p, p.solution[0], [p.solution[0]])).toBe('overlap')
    expect(isComplete(p, p.solution.slice(1))).toBe(false)
    expect(isComplete(p, [...p.solution, p.solution[0]])).toBe(false)
    expect(isComplete(p, [...p.solution].reverse())).toBe(true)
  })
  it('enforces orientation strictly, with independently optional area', () => {
    expect(placementError(one('square'), [0, 0, 1, 1])).toBeNull()
    expect(placementError(one('wide'), [0, 0, 1, 1])).toBe('shape')
    expect(placementError(one('wide'), [0, 0, 0, 2])).toBeNull()
    expect(placementError(one('tall'), [0, 0, 2, 0])).toBeNull()
    expect(placementError(one('square', 6), [0, 0, 1, 2])).toBe('shape')
    expect(placementError(one('any', 2), [0, 0, 0, 2])).toBe('area')
  })
  it('normalizes corners in every drag direction', () => {
    for (const [a, b] of [[0, 7], [7, 0], [2, 5], [5, 2]]) expect(rectangle(a, b, 5)).toEqual([0, 0, 1, 2])
    expect(area(rectangle(5, 5, 5))).toBe(1)
  })
  it('supports undo/redo of removal and clear, invalidates redo on branching, and caps history', () => {
    const first = changeRects(EMPTY_PLAY, [p.solution[0]])
    const clear = changeRects(first, [])
    expect(undo(clear).rects).toEqual(first.rects)
    expect(redo(undo(clear)).rects).toEqual([])
    expect(changeRects(undo(clear), [p.solution[1]]).future).toEqual([])
    expect(undo(EMPTY_PLAY)).toBe(EMPTY_PLAY)
    let state = first
    for (let n = 0; n < 150; n++) state = changeRects(state, [])
    expect(state.past).toHaveLength(100)
  })
  it('follows a logical proof even when correct rectangles are played out of order', () => {
    const h = nextHint(p, [p.solution[0]])
    expect(h?.kind).toBe('deduction')
    expect(h?.rect).toEqual(p.solution[3])
    expect(nextHint(p, p.solution)).toBeNull()
    expect(nextHint(p, [[0, 1, 2, 2]])?.kind).toBe('conflict')
  })
  it('uses UTC across local midnight offsets', () => {
    expect(utcDay(new Date('2026-09-07T00:30:00+08:00'))).toBe('2026-09-06')
  })
})
