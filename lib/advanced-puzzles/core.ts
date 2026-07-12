export type AdvancedPuzzleId = 'proof-habitat' | 'foldspace-atelier' | 'room-nineteen'

export interface AdvancedProgress {
  version: 1
  completed: Partial<Record<AdvancedPuzzleId, number>>
  bestScores: Partial<Record<AdvancedPuzzleId, number>>
}

export const ADVANCED_PROGRESS_KEY = 'gamelet:advanced-puzzles:v1'
export const EMPTY_ADVANCED_PROGRESS: AdvancedProgress = { version: 1, completed: {}, bestScores: {} }

export function parseAdvancedProgress(raw: string | null): AdvancedProgress {
  if (!raw) return EMPTY_ADVANCED_PROGRESS
  try {
    const parsed = JSON.parse(raw) as Partial<AdvancedProgress>
    if (parsed.version !== 1 || !parsed.completed || typeof parsed.completed !== 'object' || !parsed.bestScores || typeof parsed.bestScores !== 'object') return EMPTY_ADVANCED_PROGRESS
    return { version: 1, completed: parsed.completed, bestScores: parsed.bestScores }
  } catch {
    return EMPTY_ADVANCED_PROGRESS
  }
}

export function recordAdvancedProgress(progress: AdvancedProgress, id: AdvancedPuzzleId, completed: number, score: number): AdvancedProgress {
  return {
    version: 1,
    completed: { ...progress.completed, [id]: Math.max(progress.completed[id] ?? 0, completed) },
    bestScores: { ...progress.bestScores, [id]: Math.max(progress.bestScores[id] ?? 0, score) }
  }
}
