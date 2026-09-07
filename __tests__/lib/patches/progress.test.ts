import { dailyStreak, mergeProgress, newProgress, parseProgress, recordCompletion, restoreGame, type SavedGame } from '@/lib/patches/progress'
import { starter as p } from '@/lib/patches/levels/starter-easy'
const saved = (overrides: Partial<SavedGame> = {}): SavedGame => ({ id: p.id, version: 1, rects: [...p.solution], seconds: 80, hints: 0, mode: 'practice', day: null, ...overrides })

describe('Patches local progress', () => {
  test.each([null, '{', '{}', '{"version":2}', ' '.repeat(500001)])('ignores malformed or incompatible data', raw => expect(parseProgress(raw)).toEqual(newProgress()))
  it('roundtrips valid saves and rejects invalid coordinates, scores and foreign ids', () => {
    const data = { ...newProgress(), current: saved(), completed: { [p.id]: { seconds: 80, hints: 0 }, malicious: { seconds: 0, hints: 0 } } }
    expect(parseProgress(JSON.stringify(data)).current).toEqual(saved())
    expect(Object.keys(parseProgress(JSON.stringify(data)).completed)).toEqual([p.id])
    expect(parseProgress(JSON.stringify({ ...data, current: saved({ rects: [[0, 0, 8, 0]] }) })).current).toBeNull()
    expect(parseProgress(JSON.stringify({ ...data, current: saved({ seconds: -1 }) })).current).toBeNull()
  })
  it('rechecks placements against the requested puzzle and version', () => {
    expect(restoreGame(p, saved())).toEqual(saved())
    expect(restoreGame(p, saved({ id: 'patches-easy-0002' }))).toBeNull()
    expect(restoreGame(p, saved({ rects: [p.solution[0], p.solution[0]] }))).toBeNull()
    expect(restoreGame(p, saved({ rects: [[0, 0, 0, 0]] }))).toBeNull()
  })
  it('counts completed puzzles once and prefers an independent solve over a faster assisted one', () => {
    const assisted = recordCompletion(newProgress(), p, saved({ seconds: 10, hints: 1 }))
    const independent = recordCompletion(assisted, p, saved())
    const slower = recordCompletion(independent, p, saved({ seconds: 100 }))
    const fasterAssisted = recordCompletion(slower, p, saved({ seconds: 2, hints: 1 }))
    expect(fasterAssisted.completed[p.id]).toEqual({ seconds: 80, hints: 0 })
    expect(Object.keys(fasterAssisted.completed)).toHaveLength(1)
    expect(recordCompletion(newProgress(), p, saved({ rects: [] })).completed).toEqual({})
  })
  it('records each daily date once and preserves a streak before today is played', () => {
    const a = recordCompletion(newProgress(), p, saved({ mode: 'daily', day: '2026-09-07' }))
    expect(recordCompletion(a, p, saved({ mode: 'daily', day: '2026-09-07' })).daily).toEqual(['2026-09-07'])
    expect(dailyStreak(['2026-09-06', '2026-09-07'], '2026-09-08')).toBe(2)
    expect(dailyStreak(['2026-09-06', '2026-09-07'], '2026-09-09')).toBe(0)
  })
  it('keeps the selected board while merging the best scores from other tabs', () => {
    const local = { ...newProgress(), current: saved({ rects: [] }), completed: { [p.id]: { seconds: 100, hints: 0 } }, daily: ['2026-09-07'] }
    const incoming = { ...newProgress(), updatedAt: 100, completed: { [p.id]: { seconds: 80, hints: 0 } }, daily: ['2026-09-08'] }
    const merged = mergeProgress(local, incoming)
    expect(merged.current).toBe(local.current)
    expect(merged.completed[p.id].seconds).toBe(80)
    expect(merged.daily).toEqual(['2026-09-07', '2026-09-08'])
    expect(merged.updatedAt).toBe(100)
  })

})
