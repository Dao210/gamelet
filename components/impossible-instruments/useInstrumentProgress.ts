'use client'

import { useCallback, useEffect, useState } from 'react'
import { EMPTY_INSTRUMENT_PROGRESS, INSTRUMENT_PROGRESS_KEY, parseInstrumentProgress, updateInstrumentProgress, type InstrumentId } from '@/lib/impossible-instruments/core'

export function useInstrumentProgress(id: InstrumentId) {
  const [best, setBest] = useState(0)
  useEffect(() => {
    try { setBest(parseInstrumentProgress(localStorage.getItem(INSTRUMENT_PROGRESS_KEY)).bestScores[id] ?? 0) } catch {}
  }, [id])

  const record = useCallback((completed: number, score: number) => {
    setBest((current) => Math.max(current, score))
    try {
      const current = parseInstrumentProgress(localStorage.getItem(INSTRUMENT_PROGRESS_KEY))
      localStorage.setItem(INSTRUMENT_PROGRESS_KEY, JSON.stringify(updateInstrumentProgress(current, id, completed, score)))
    } catch {
      // Storage is an enhancement; gameplay remains available when blocked.
    }
  }, [id])

  return { best, record, fallback: EMPTY_INSTRUMENT_PROGRESS }
}
