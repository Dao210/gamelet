import type { Difficulty, Puzzle } from './types'
import { validId } from './progress'
import { PACK_SIZE, TOTAL_PER_DIFFICULTY, TUTORIAL_COUNT } from './levels/catalog'

const loaders: Record<string, () => Promise<readonly Puzzle[]>> = {
  'easy-01': () => import('./levels/easy-01').then(m => m.puzzles),
  'easy-02': () => import('./levels/easy-02').then(m => m.puzzles),
  'easy-03': () => import('./levels/easy-03').then(m => m.puzzles),
  'easy-04': () => import('./levels/easy-04').then(m => m.puzzles),
  'easy-05': () => import('./levels/easy-05').then(m => m.puzzles),
  'easy-06': () => import('./levels/easy-06').then(m => m.puzzles),
  'easy-07': () => import('./levels/easy-07').then(m => m.puzzles),
  'easy-08': () => import('./levels/easy-08').then(m => m.puzzles),
  'medium-01': () => import('./levels/medium-01').then(m => m.puzzles),
  'medium-02': () => import('./levels/medium-02').then(m => m.puzzles),
  'medium-03': () => import('./levels/medium-03').then(m => m.puzzles),
  'medium-04': () => import('./levels/medium-04').then(m => m.puzzles),
  'medium-05': () => import('./levels/medium-05').then(m => m.puzzles),
  'medium-06': () => import('./levels/medium-06').then(m => m.puzzles),
  'medium-07': () => import('./levels/medium-07').then(m => m.puzzles),
  'medium-08': () => import('./levels/medium-08').then(m => m.puzzles),
  'hard-01': () => import('./levels/hard-01').then(m => m.puzzles),
  'hard-02': () => import('./levels/hard-02').then(m => m.puzzles),
  'hard-03': () => import('./levels/hard-03').then(m => m.puzzles),
  'hard-04': () => import('./levels/hard-04').then(m => m.puzzles),
  'hard-05': () => import('./levels/hard-05').then(m => m.puzzles),
  'hard-06': () => import('./levels/hard-06').then(m => m.puzzles),
  'hard-07': () => import('./levels/hard-07').then(m => m.puzzles),
  'hard-08': () => import('./levels/hard-08').then(m => m.puzzles),
  tutorial: () => import('./levels/tutorial').then(m => m.puzzles)
}
const cache = new Map<string, Promise<readonly Puzzle[]>>()
export function loadPuzzle(id: string): Promise<Puzzle> {
  if (!validId(id)) return Promise.reject(new Error('Unknown puzzle'))
  const [, difficulty, rawNumber] = id.split('-')
  const number = Number(rawNumber)
  if (number < 1 || number > (difficulty === 'tutorial' ? TUTORIAL_COUNT : TOTAL_PER_DIFFICULTY)) return Promise.reject(new Error('Unknown puzzle'))
  const key = difficulty === 'tutorial' ? 'tutorial' : `${difficulty}-${String(Math.ceil(number / PACK_SIZE)).padStart(2, '0')}`
  let pack = cache.get(key)
  if (!pack) {
    pack = loaders[key]().catch(error => { cache.delete(key); throw error })
    cache.set(key, pack)
  }
  return pack.then(puzzles => {
    const puzzle = puzzles.find(p => p.id === id)
    if (!puzzle) throw new Error('Unknown puzzle')
    return puzzle
  })
}
const schedules: Record<string, () => Promise<Record<string, Record<Difficulty, string>>>> = {
  '2026-09': () => import('./levels/daily-2026-09').then(m => m.schedule),
  '2026-10': () => import('./levels/daily-2026-10').then(m => m.schedule),
  '2026-11': () => import('./levels/daily-2026-11').then(m => m.schedule),
  '2026-12': () => import('./levels/daily-2026-12').then(m => m.schedule)
}
export async function dailyPuzzleId(day: string, difficulty: Difficulty): Promise<string | null> {
  const loader = schedules[day.slice(0, 7)]
  return loader ? (await loader())[day]?.[difficulty] ?? null : null
}
