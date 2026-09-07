import type { Difficulty, Mode, Puzzle, Rect } from './types'
import { placementError, isComplete } from './engine'
import { TOTAL_PER_DIFFICULTY, TUTORIAL_COUNT } from './levels/catalog'

export const STORAGE_KEY = 'gamelet:patches:progress:v1'
export interface SavedGame {
  id: string; version: 1; rects: Rect[]; seconds: number; hints: number; mode: Mode; day: string | null
}
export interface RecordScore { seconds: number; hints: number }
export interface Progress {
  version: 1; updatedAt: number; current: SavedGame | null
  completed: Record<string, RecordScore>; daily: string[]
}
export const newProgress = (): Progress => ({ version: 1, updatedAt: 0, current: null, completed: {}, daily: [] })
export const isDifficulty = (value: string): value is Difficulty => ['easy', 'medium', 'hard'].includes(value)
export function validId(id: unknown): id is string {
  const match = typeof id === 'string' ? /^patches-(easy|medium|hard|tutorial)-(\d{4})$/.exec(id) : null
  return !!match && Number(match[2]) >= 1 && Number(match[2]) <= (match[1] === 'tutorial' ? TUTORIAL_COUNT : TOTAL_PER_DIFFICULTY)
}
const bounded = (v: unknown, max: number): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= max
const object = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

export function parseProgress(raw: string | null): Progress {
  const empty = newProgress()
  if (!raw || raw.length > 500000) return empty
  try {
    const p: unknown = JSON.parse(raw)
    if (!object(p) || p.version !== 1) return empty
    if (bounded(p.updatedAt, 9e15)) empty.updatedAt = p.updatedAt
    if (object(p.completed)) {
      for (const [id, score] of Object.entries(p.completed).slice(0, 5000)) {
        if (validId(id) && object(score) && bounded(score.seconds, 604800) && bounded(score.hints, 10000)) empty.completed[id] = { seconds: score.seconds, hints: score.hints }
      }
    }
    if (Array.isArray(p.daily)) empty.daily = [...new Set(p.daily.filter((d): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)))].sort().slice(-366)
    const c = p.current
    if (object(c) && validId(c.id) && c.version === 1 && Array.isArray(c.rects) && c.rects.length <= 64 && c.rects.every(r => Array.isArray(r) && r.length === 4 && r.every(n => Number.isInteger(n) && n >= 0 && n < 8)) && bounded(c.seconds, 604800) && bounded(c.hints, 10000) && ['practice', 'daily', 'learn'].includes(String(c.mode)) && (c.day === null || (typeof c.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(c.day)))) {
      empty.current = c as unknown as SavedGame
    }
    return empty
  } catch { return empty }
}
export function restoreGame(puzzle: Puzzle, saved: SavedGame): SavedGame | null {
  if (saved.id !== puzzle.id || saved.version !== puzzle.version || saved.rects.some((r, i) => placementError(puzzle, r, saved.rects.slice(0, i)))) return null
  return saved
}
const betterScore = (score: RecordScore, previous?: RecordScore) => !previous || (previous.hints > 0 && score.hints === 0) || ((previous.hints === 0) === (score.hints === 0) && score.seconds < previous.seconds)

export function mergeProgress(local: Progress, incoming: Progress): Progress {
  const completed = { ...local.completed }
  for (const [id, score] of Object.entries(incoming.completed)) if (betterScore(score, completed[id])) completed[id] = score
  return { ...local, updatedAt: Math.max(local.updatedAt, incoming.updatedAt), completed, daily: [...new Set([...local.daily, ...incoming.daily])].sort().slice(-366) }
}

export function recordCompletion(progress: Progress, puzzle: Puzzle, current: SavedGame): Progress {
  if (!isComplete(puzzle, current.rects)) return progress
  const previous = progress.completed[puzzle.id]
  const better = betterScore(current, previous)
  return {
    ...progress,
    completed: better ? { ...progress.completed, [puzzle.id]: { seconds: current.seconds, hints: current.hints } } : progress.completed,
    daily: current.mode === 'daily' && current.day ? [...new Set([...progress.daily, current.day])].sort().slice(-366) : progress.daily
  }
}
export function dailyStreak(days: readonly string[], today: string) {
  let date = new Date(`${today}T00:00:00Z`)
  if (!days.includes(today)) date = new Date(date.getTime() - 86400000)
  let count = 0
  while (days.includes(date.toISOString().slice(0, 10))) { count++; date = new Date(date.getTime() - 86400000) }
  return count
}
