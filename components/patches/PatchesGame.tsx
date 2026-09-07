'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MutableRefObject } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { trackGameEvent } from '@/lib/analytics'
import { area, changeRects, EMPTY_PLAY, isComplete, nextHint, placementError, rectangle, redo, sameRect, undo, utcDay } from '@/lib/patches/engine'
import { dailyStreak, mergeProgress, newProgress, parseProgress, recordCompletion, restoreGame, STORAGE_KEY, validId, type Progress, type SavedGame } from '@/lib/patches/progress'
import { dailyPuzzleId, loadPuzzle } from '@/lib/patches/level-loader'
import { CURATED_COUNT, difficulties, PRACTICE_COUNT, puzzleId, TUTORIAL_COUNT } from '@/lib/patches/levels/catalog'
import type { Difficulty, Mode, PlayState, Puzzle, Rect } from '@/lib/patches/types'
import PatchesBoard from './PatchesBoard'
import styles from './patches.module.css'

interface Session { puzzle: Puzzle; play: PlayState; mode: Mode; day: string | null; hints: number; started: boolean }
interface ClockValue { seconds: number; since: number | null }
const elapsed = (clock: ClockValue) => Math.min(604800, clock.seconds + (clock.since === null ? 0 : (performance.now() - clock.since) / 1000))
const stopClock = (clock: ClockValue) => { clock.seconds = elapsed(clock); clock.since = null }
const formatTime = (n: number) => `${Math.floor(n / 60).toString().padStart(2, '0')}:${Math.floor(n % 60).toString().padStart(2, '0')}`
const LEARNING_IDS = [...Array.from({ length: TUTORIAL_COUNT }, (_, i) => `patches-tutorial-${String(i + 1).padStart(4, '0')}`), ...difficulties.flatMap(d => Array.from({ length: CURATED_COUNT }, (_, i) => puzzleId(d, i + 1)))]
const events = (name: string, s: Session) => trackGameEvent(name, 'patches', { puzzle_id: s.puzzle.id, difficulty: s.puzzle.difficulty, mode: s.mode, assisted: s.hints > 0 })

function PuzzleClock({ clock, running, id }: { clock: MutableRefObject<ClockValue>; running: boolean; id: string }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const value = clock.current
    if (running && value.since === null) value.since = performance.now()
    setDisplay(elapsed(value))
    const interval = running ? window.setInterval(() => setDisplay(elapsed(value)), 1000) : null
    return () => { if (interval !== null) clearInterval(interval); stopClock(value) }
  }, [clock, running, id])
  return <span className={styles.clock} data-testid="patches-clock">{formatTime(display)}</span>
}

export default function PatchesGame({ initialPuzzle, preferredDifficulty }: { initialPuzzle: Puzzle; preferredDifficulty?: Difficulty }) {
  const t = useTranslations('patches')
  const [session, setSession] = useState<Session>({ puzzle: initialPuzzle, play: EMPTY_PLAY, mode: 'practice', day: null, hints: 0, started: false })
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [progress, setProgress] = useState<Progress>(newProgress)
  const [external, setExternal] = useState<Progress | null>(null)
  const [notice, setNotice] = useState('')
  const [message, setMessage] = useState('')
  const [hintLevel, setHintLevel] = useState(0)
  const [hint, setHint] = useState<ReturnType<typeof nextHint>>(null)
  const [confirmReveal, setConfirmReveal] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [today, setToday] = useState('')
  const [resultSeconds, setResultSeconds] = useState(0)
  const [clockRevision, setClockRevision] = useState(0)
  const clock = useRef<ClockValue>({ seconds: 0, since: null })
  const progressRef = useRef(progress)
  const sessionRef = useRef(session)
  const canSave = useRef(false)
  const request = useRef(0)
  const logged = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intent = useRef<{ id: string; mode: Mode; day: string | null } | null>(null)
  const consoleRef = useRef<HTMLElement>(null)
  useLayoutEffect(() => { sessionRef.current = session }, [session])
  const invalidateRequest = useCallback(() => { request.current++ }, [])
  const { puzzle, play, mode } = session
  const finished = isComplete(puzzle, play.rects)
  const learnedIndex = LEARNING_IDS.indexOf(puzzle.id)
  const covered = play.rects.reduce((sum, r) => sum + area(r), 0)
  const best = progress.completed[puzzle.id]
  const clearHint = () => { setHint(null); setHintLevel(0); setConfirmReveal(false) }

  const persist = useCallback(() => {
    if (!canSave.current) return
    const s = sessionRef.current
    const current: SavedGame = { id: s.puzzle.id, version: 1, rects: [...s.play.rects], seconds: elapsed(clock.current), hints: s.hints, mode: s.mode, day: s.day }
    const updated = { ...recordCompletion(progressRef.current, s.puzzle, current), current, updatedAt: Math.max(Date.now(), progressRef.current.updatedAt + 1) }
    progressRef.current = updated
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) }
    catch { canSave.current = false; setNotice(t('storageUnavailable')) }
    setProgress(updated)
  }, [t])

  const openPuzzle = useCallback(async (id: string, nextMode: Mode, day: string | null = null, saved?: SavedGame) => {
    const ticket = ++request.current
    intent.current = { id, mode: nextMode, day }
    setLoading(true); setLoadFailed(false)
    try {
      const p = id === initialPuzzle.id ? initialPuzzle : await loadPuzzle(id)
      if (ticket !== request.current) return
      const restored = saved ? restoreGame(p, saved) : null
      stopClock(clock.current)
      clock.current = { seconds: restored?.seconds ?? 0, since: null }
      setClockRevision(value => value + 1)
      logged.current = false
      setSession({ puzzle: p, play: { ...EMPTY_PLAY, rects: restored?.rects ?? [] }, mode: nextMode, day, hints: restored?.hints ?? 0, started: Boolean(restored?.rects.length || restored?.seconds) })
      setPaused(Boolean(restored && !isComplete(p, restored.rects) && (restored.rects.length || restored.seconds))); clearHint()
      setMessage(saved && !restored ? t('invalidSave') : restored ? t('restored') : t('ready'))
    } catch {
      if (ticket === request.current) { setLoadFailed(true); setMessage(t('loadError')) }
    } finally { if (ticket === request.current) setLoading(false) }
  }, [initialPuzzle, t])

  useEffect(() => {
    let active = true
    setToday(utcDay())
    const boot = async () => {
      let stored = newProgress()
      try { stored = parseProgress(localStorage.getItem(STORAGE_KEY)); canSave.current = true }
      catch { setNotice(t('storageUnavailable')) }
      progressRef.current = stored; setProgress(stored)
      const shared = new URLSearchParams(window.location.hash.slice(1)).get('p')
      if (shared) {
        if (validId(shared)) {
          const saved = stored.current?.id === shared ? stored.current : undefined
          await openPuzzle(shared, saved?.mode ?? 'practice', saved?.day ?? null, saved)
        }
        else setMessage(t('unknownPuzzle'))
      } else if (stored.current && (!preferredDifficulty || stored.current.id.startsWith(`patches-${preferredDifficulty}-`))) {
        await openPuzzle(stored.current.id, stored.current.mode, stored.current.day, stored.current)
      }
      if (active) setReady(true)
    }
    void boot()
    return () => { active = false; invalidateRequest() }
  }, [openPuzzle, preferredDifficulty, t, invalidateRequest])

  useEffect(() => {
    if (!ready) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(persist, 150)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [ready, session, persist])
  useEffect(() => {
    const visibility = () => { setHidden(document.hidden); if (document.hidden) { stopClock(clock.current); persist() } else setToday(utcDay()) }
    const leave = () => { stopClock(clock.current); persist() }
    const storage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return
      const incoming = parseProgress(event.newValue)
      if (incoming.updatedAt <= progressRef.current.updatedAt) return
      canSave.current = false; stopClock(clock.current); setPaused(true); setExternal(incoming)
    }
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('pagehide', leave)
    window.addEventListener('storage', storage)
    const dates = window.setInterval(() => { if (!document.hidden) setToday(utcDay()) }, 30000)
    return () => { document.removeEventListener('visibilitychange', visibility); window.removeEventListener('pagehide', leave); window.removeEventListener('storage', storage); clearInterval(dates); leave() }
  }, [persist])

  const nextId = useCallback((difficulty: Difficulty = puzzle.difficulty, start = Number(puzzle.id.split('-').at(-1))) => {
    for (let i = 1; i <= PRACTICE_COUNT; i++) {
      const id = puzzleId(difficulty, (start + i - 1) % PRACTICE_COUNT + 1)
      if (!progressRef.current.completed[id] && id !== puzzle.id) return id
    }
    return null
  }, [puzzle.difficulty, puzzle.id])
  useEffect(() => {
    if (!ready || loading) return
    const id = mode === 'learn' ? LEARNING_IDS[learnedIndex + 1] : mode === 'practice' ? nextId() : null
    const timer = setTimeout(() => { if (id && !document.hidden) void loadPuzzle(id).catch(() => {}) }, 800)
    return () => clearTimeout(timer)
  }, [ready, loading, mode, learnedIndex, nextId])
  useEffect(() => {
    if (!ready || !finished || logged.current) return
    logged.current = true; stopClock(clock.current); setResultSeconds(clock.current.seconds); persist(); events('puzzle_complete', session)
  }, [ready, finished, session, persist])

  const start = (s: Session) => { if (!s.started) events('puzzle_start', s); return { ...s, started: true } }
  const draw = useCallback((r: Rect) => {
    const s = sessionRef.current
    const error = placementError(s.puzzle, r, s.play.rects)
    clearHint()
    if (error) { setMessage(t(`errors.${error}`)); return }
    setSession({ ...start(s), play: changeRects(s.play, [...s.play.rects, r]) }); setMessage(t('placed'))
  }, [t])
  const remove = useCallback((index: number) => {
    const s = sessionRef.current
    setSession({ ...s, play: changeRects(s.play, s.play.rects.filter((_, i) => i !== index)) }); clearHint(); setMessage(t('removed'))
  }, [t])
  const goUndo = useCallback(() => { setSession(s => ({ ...s, play: undo(s.play) })); clearHint(); setMessage('') }, [])
  const goRedo = useCallback(() => { setSession(s => ({ ...s, play: redo(s.play) })); clearHint(); setMessage('') }, [])
  const switchMode = async (nextMode: Mode, difficulty = puzzle.difficulty) => {
    persist()
    if (nextMode === 'daily') {
      const day = utcDay(), ticket = ++request.current
      setLoading(true)
      try {
        const id = await dailyPuzzleId(day, difficulty)
        if (ticket !== request.current) return
        if (id) await openPuzzle(id, 'daily', day)
        else setMessage(t('dailyUnavailable'))
      } catch { if (ticket === request.current) setMessage(t('loadError')) }
      finally { if (ticket === request.current) setLoading(false) }
    } else if (nextMode === 'learn') await openPuzzle(LEARNING_IDS[0], 'learn')
    else await openPuzzle(nextId(difficulty, 0) ?? puzzleId(difficulty, 1), 'practice')
  }
  const next = () => {
    persist()
    if (mode === 'learn') {
      const id = LEARNING_IDS[learnedIndex + 1]
      if (id) void openPuzzle(id, 'learn'); else setMessage(t('courseComplete'))
    } else if (mode === 'daily') void switchMode('practice')
    else {
      const id = nextId()
      if (id) void openPuzzle(id, 'practice')
      else { setNotice(t('packComplete')); void openPuzzle(puzzleId(puzzle.difficulty, Number(puzzle.id.split('-').at(-1)) % PRACTICE_COUNT + 1), 'practice') }
    }
    events('puzzle_next', session)
  }
  const showHint = () => {
    const result = nextHint(puzzle, play.rects)
    setHint(result); setHintLevel(1)
    setSession(s => ({ ...start(s), hints: Math.min(10000, s.hints + 1) })); events('puzzle_hint', session)
  }
  const applyHint = () => {
    if (!hint) return
    if (hint.kind === 'conflict') remove(play.rects.findIndex(r => sameRect(r, hint.rect)))
    else draw(hint.rect)
  }
  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#p=${puzzle.id}`
    const text = `Gamelet Patches · ${puzzle.id}\n${formatTime(elapsed(clock.current))} · ${session.hints ? t('assisted') : t('independent')}\n${url}`
    try { await navigator.clipboard.writeText(text); setMessage(t('copied')); events('puzzle_share', session) }
    catch { setMessage(t('copyFailed')); setNotice(url) }
  }
  const reset = () => { setSession(s => ({ ...s, play: changeRects(s.play, []) })); clearHint(); setMessage(t('cleared')) }
  const labelNumber = Number(puzzle.id.split('-').at(-1))
  const playing = ready && session.started && !paused && !hidden && !finished && !loading

  return <section ref={consoleRef} className={styles.console} aria-label={t('gameLabel')}>
    {notice && <div className={styles.notice}>{notice}</div>}
    {external && <div className={styles.notice} role="alert">{t('tabConflict')}
      <button onClick={() => window.location.reload()}>{t('useOther')}</button>
      <button onClick={() => {
        progressRef.current = mergeProgress(progressRef.current, external)
        canSave.current = true; setExternal(null); persist()
      }}>{t('keepThis')}</button>
    </div>}
    <div className={styles.tabs}>
      {(['practice', 'daily', 'learn'] as const).map(m => <button key={m} aria-pressed={mode === m} disabled={!ready || loading || !!external} onClick={() => void switchMode(m)}>{t(`modes.${m}`)}</button>)}
    </div>
    <div className={styles.playArea}>
      <div className={styles.boardPanel}>
        <div className={styles.boardMeta}><div><strong>{t(`difficulties.${puzzle.difficulty}`)} · {puzzle.rows} × {puzzle.cols}</strong><span>{mode === 'daily' ? session.day : `${t('puzzle')} ${String(labelNumber).padStart(3, '0')}`}</span></div><PuzzleClock clock={clock} running={playing} id={`${puzzle.id}:${clockRevision}`} /></div>
        <div className={styles.pauseCover}>
          <PatchesBoard puzzle={puzzle} rects={play.rects} disabled={!ready || loading || paused || finished || !!external} highlight={hint?.kind === 'deduction' && hintLevel === 1 ? rectangle(puzzle.clues[hint.step.clue].cell, puzzle.clues[hint.step.clue].cell, puzzle.cols) : hint?.rect ?? null} onDraw={draw} onDelete={remove} onUndo={goUndo} onRedo={goRedo} />
          {paused && <div className={styles.overlay}><strong>{t('paused')}</strong><button className={styles.primary} disabled={!!external} onClick={() => setPaused(false)}>{t('resume')}</button></div>}
        </div>
        {mode === 'learn' && <div className={styles.hint}><strong>{t('lesson', { number: learnedIndex + 1 })}</strong><p>{t(`lessonTips.${learnedIndex < 4 ? 'area' : learnedIndex < 8 ? 'shape' : learnedIndex < 12 ? 'space' : 'training'}`)}</p></div>}
      </div>
      <aside className={styles.sidebar}>
        <div><span className={styles.label}>{t('difficulty')}</span><div className={styles.difficulties}>
          {difficulties.map(d => <button key={d} aria-pressed={puzzle.difficulty === d} disabled={!ready || loading || mode === 'learn' || !!external} onClick={() => void switchMode(mode, d)}>{t(`difficulties.${d}`)}</button>)}
        </div></div>
        {mode === 'learn' && <label><span className={styles.label}>{t('learningPath')}</span><select className={styles.lessonSelect} value={puzzle.id} disabled={loading || !!external} onChange={e => { persist(); void openPuzzle(e.target.value, 'learn') }}>
          {LEARNING_IDS.map((id, i) => <option key={`${id}-${i}`} value={id}>{i < 12 ? t('lesson', { number: i + 1 }) : `${t('training')} ${i - 11}`} {progress.completed[id] ? '✓' : ''}</option>)}
        </select></label>}
        <div className={styles.stats}><div><span>{t('filled')}</span><strong>{covered}<small> / {puzzle.rows * puzzle.cols}</small></strong></div><div><span>{mode === 'daily' ? t('streak') : t('completed')}</span><strong>{mode === 'daily' && today ? dailyStreak(progress.daily, today) : Object.keys(progress.completed).length}</strong></div></div>
        {finished ? <div className={styles.result} role="status"><h2>{t('won')}</h2><p>{session.hints ? t('assisted') : t('independent')} · {formatTime(resultSeconds)}</p>{best && <p>{t('best')}: {formatTime(best.seconds)}</p>}<button className={styles.primary} onClick={next} disabled={loading || !!external}>{t(mode === 'daily' ? 'continuePractice' : 'next')}</button><button className={styles.secondary} disabled={loading || !!external} onClick={() => { persist(); void openPuzzle(puzzle.id, mode, session.day) }}>{t('replay')}</button></div> : <>
          <div className={styles.actions}><button onClick={goUndo} disabled={!play.past.length || paused || loading}>{t('undo')}</button><button onClick={goRedo} disabled={!play.future.length || paused || loading}>{t('redo')}</button><button onClick={reset} disabled={!play.rects.length || paused || loading}>{t('reset')}</button><button onClick={() => setPaused(p => !p)} disabled={!ready || loading || !!external}>{t(paused ? 'resume' : 'pause')}</button></div>
          <button className={styles.primary} onClick={showHint} disabled={!ready || loading || paused || !!external}>{t('hint')} <span aria-hidden="true">↗</span></button>
          <button className={styles.secondary} onClick={next} disabled={!ready || loading || !!external}>{t(mode === 'daily' ? 'continuePractice' : 'next')}</button>
        </>}
        {hint && <div className={styles.hint} role="status"><strong>{t(hint.kind === 'conflict' ? 'hintConflictTitle' : 'hintTitle')}</strong>
          <p>{hint.kind === 'conflict' ? t('hintConflict') : t('hintFocus', { row: Math.floor(puzzle.clues[hint.step.clue].cell / puzzle.cols) + 1, col: puzzle.clues[hint.step.clue].cell % puzzle.cols + 1 })}</p>
          {hint.kind === 'deduction' && hintLevel > 1 && <p>{hint.step.rule === 'cover' ? t('hintCover', { row: Math.floor((hint.step.cell ?? 0) / puzzle.cols) + 1, col: (hint.step.cell ?? 0) % puzzle.cols + 1 }) : t('hintSingle')}</p>}
          {hintLevel === 1 && hint.kind === 'deduction' ? <button onClick={() => setHintLevel(2)}>{t('explain')}</button> : <button disabled={!!external || paused || loading} onClick={applyHint}>{t(hint.kind === 'conflict' ? 'removePatch' : 'placeHint')}</button>}
          <button onClick={clearHint}>{t('close')}</button>
        </div>}
        <button className={styles.secondary} onClick={() => void share()} disabled={!ready || loading || !!external}>{t('share')}</button>
        {!finished && <button onClick={() => setConfirmReveal(v => !v)} disabled={!ready || loading || paused || !!external}>{t('reveal')}</button>}
        {confirmReveal && <div className={styles.hint}><p>{t('revealConfirm')}</p><button disabled={!!external || paused || loading} onClick={() => { setSession(s => ({ ...start(s), play: changeRects(s.play, s.puzzle.solution), hints: Math.min(10000, s.hints + 1) })); clearHint() }}>{t('reveal')}</button><button onClick={clearHint}>{t('cancel')}</button></div>}
        <div className={styles.notes}><span className={styles.label}>{t('fieldNotes')}</span><ol><li>{t('ruleArea')}</li><li>{t('ruleShape')}</li><li>{t('ruleCover')}</li></ol><Link href="/patches/how-to-play">{t('learnRules')} ↗</Link></div>
      </aside>
    </div>
    <div className={styles.status} role="status" aria-live="polite">{loading ? t('loading') : message || t('ready')}{mode === 'daily' && today && session.day !== today && <> · {t('newDay')}</>}{loadFailed && <button onClick={() => { if (intent.current) void openPuzzle(intent.current.id, intent.current.mode, intent.current.day) }}>{t('retry')}</button>}</div>
  </section>
}
