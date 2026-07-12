'use client'

import { useCallback, useEffect, useState } from 'react'
import { ADVANCED_PROGRESS_KEY, parseAdvancedProgress, recordAdvancedProgress, type AdvancedPuzzleId } from '@/lib/advanced-puzzles/core'

export function useAdvancedProgress(id: AdvancedPuzzleId) {
  const [best, setBest] = useState(0)
  useEffect(() => { try { setBest(parseAdvancedProgress(localStorage.getItem(ADVANCED_PROGRESS_KEY)).bestScores[id] ?? 0) } catch {} }, [id])
  const record = useCallback((completed: number, score: number) => {
    setBest((value) => Math.max(value, score))
    try { const progress = parseAdvancedProgress(localStorage.getItem(ADVANCED_PROGRESS_KEY)); localStorage.setItem(ADVANCED_PROGRESS_KEY, JSON.stringify(recordAdvancedProgress(progress, id, completed, score))) } catch {}
  }, [id])
  return { best, record }
}
