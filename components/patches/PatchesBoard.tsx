'use client'

import { memo, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { useTranslations } from 'next-intl'
import { contains, rectangle } from '@/lib/patches/engine'
import type { Puzzle, Rect } from '@/lib/patches/types'
import styles from './patches.module.css'

const COLORS = ['#edba84', '#a9c7b7', '#b9c5df', '#e0adc0', '#dad398', '#abcdd4', '#cbb6d7', '#c5d3a8', '#d5b6a5', '#c1bba3', '#a9c1d2', '#dab6a7']
export const SHAPES = { square: '□', wide: '▭', tall: '▯', any: '◇' }
interface Props { puzzle: Puzzle; rects: readonly Rect[]; disabled: boolean; highlight: Rect | null; onDraw: (rect: Rect) => void; onDelete: (index: number) => void; onUndo: () => void; onRedo: () => void }

export default memo(function PatchesBoard({ puzzle: p, rects, disabled, highlight, onDraw, onDelete, onUndo, onRedo }: Props) {
  const t = useTranslations('patches')
  const board = useRef<HTMLDivElement>(null)
  const [anchor, setAnchor] = useState<number | null>(null)
  const [focus, setFocus] = useState(0)
  const [draft, setDraft] = useState<Rect | null>(null)
  const drag = useRef<{ start: number; pointer: number; x: number; y: number; moved: boolean } | null>(null)
  const frame = useRef(0)
  const pending = useRef<Rect | null>(null)
  const cancel = () => { drag.current = null; setAnchor(null); setDraft(null); cancelAnimationFrame(frame.current); frame.current = 0 }
  useEffect(() => { cancel(); setFocus(0) }, [p.id, disabled])
  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  const cellAt = (x: number, y: number) => {
    const box = board.current?.getBoundingClientRect()
    if (!box || x < box.left || y < box.top || x >= box.right || y >= box.bottom) return null
    return Math.floor((y - box.top) / box.height * p.rows) * p.cols + Math.floor((x - box.left) / box.width * p.cols)
  }
  const select = (cell: number) => {
    if (disabled) return
    setFocus(cell)
    if (anchor !== null) { onDraw(rectangle(anchor, cell, p.cols)); setAnchor(null); setDraft(null); return }
    const placed = rects.findIndex(r => contains(r, Math.floor(cell / p.cols), cell % p.cols))
    if (placed >= 0) { onDelete(placed); return }
    setAnchor(cell); setDraft(rectangle(cell, cell, p.cols))
  }
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || event.altKey) return
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault(); cancel(); if (event.shiftKey) onRedo(); else onUndo(); return
    }
    if (event.ctrlKey || event.metaKey) return
    if (event.key === 'Escape') { event.preventDefault(); cancel(); return }
    let next = focus
    if (event.key === 'ArrowLeft') next = Math.max(Math.floor(focus / p.cols) * p.cols, focus - 1)
    else if (event.key === 'ArrowRight') next = Math.min(Math.floor(focus / p.cols) * p.cols + p.cols - 1, focus + 1)
    else if (event.key === 'ArrowUp') next = Math.max(0, focus - p.cols)
    else if (event.key === 'ArrowDown') next = Math.min(p.rows * p.cols - 1, focus + p.cols)
    else return
    event.preventDefault(); setFocus(next)
    board.current?.querySelector<HTMLButtonElement>(`[data-cell="${next}"]`)?.focus()
    if (anchor !== null) setDraft(rectangle(anchor, next, p.cols))
  }
  const rectStyle = (r: Rect): CSSProperties => ({ left: `${r[1] / p.cols * 100}%`, top: `${r[0] / p.rows * 100}%`, width: `${(r[3] - r[1] + 1) / p.cols * 100}%`, height: `${(r[2] - r[0] + 1) / p.rows * 100}%` })

  return <div className={styles.boardWrap}>
    <div ref={board} role="grid" aria-label={t('boardLabel')} aria-rowcount={p.rows} aria-colcount={p.cols} data-testid="patches-board" className={styles.board} style={{ '--cols': p.cols } as CSSProperties} onKeyDown={keyDown}
      onPointerDown={event => {
        if (disabled || event.button !== 0 || drag.current) return
        const cell = cellAt(event.clientX, event.clientY)
        if (cell === null) return
        drag.current = { start: cell, pointer: event.pointerId, x: event.clientX, y: event.clientY, moved: false }
        event.currentTarget.setPointerCapture?.(event.pointerId)
      }}
      onPointerMove={event => {
        const d = drag.current
        if (!d || d.pointer !== event.pointerId) return
        if (Math.hypot(d.x - event.clientX, d.y - event.clientY) > 5) d.moved = true
        if (!d.moved) return
        const cell = cellAt(event.clientX, event.clientY)
        pending.current = cell === null ? null : rectangle(d.start, cell, p.cols)
        if (!frame.current) frame.current = requestAnimationFrame(() => { setDraft(pending.current); frame.current = 0 })
      }}
      onPointerUp={event => {
        const d = drag.current
        if (!d || d.pointer !== event.pointerId) return
        drag.current = null; cancelAnimationFrame(frame.current); frame.current = 0
        const cell = cellAt(event.clientX, event.clientY)
        if (cell === null) { cancel(); return }
        if (d.moved) { onDraw(rectangle(d.start, cell, p.cols)); setAnchor(null); setDraft(null) }
        else select(cell)
        setFocus(cell)
        board.current?.querySelector<HTMLButtonElement>(`[data-cell="${cell}"]`)?.focus({ preventScroll: true })
      }}
      onPointerCancel={cancel}
      onLostPointerCapture={() => { if (drag.current) cancel() }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) cancel() }}>
      {Array.from({ length: p.rows }, (_, row) => <div role="row" key={row} className={styles.boardRow}>
        {Array.from({ length: p.cols }, (_, col) => {
          const cell = row * p.cols + col, clueIndex = p.clues.findIndex(c => c.cell === cell), clue = p.clues[clueIndex]
          const region = rects.find(r => contains(r, row, col))
          const owner = region ? p.clues.findIndex(c => contains(region, Math.floor(c.cell / p.cols), c.cell % p.cols)) : -1
          return <button type="button" role="gridcell" key={cell} data-cell={cell} data-testid={`patch-cell-${cell}`} tabIndex={cell === focus ? 0 : -1} disabled={disabled}
            aria-selected={anchor === cell} aria-label={t('cellLabel', { row: row + 1, col: col + 1, clue: clue ? `${clue.area ?? '?'} ${t(`shapes.${clue.shape}`)}` : t('empty') })}
            className={`${styles.cell} ${anchor === cell ? styles.anchored : ''}`}
            style={owner < 0 ? undefined : { backgroundColor: COLORS[owner % COLORS.length] }}
            onFocus={() => setFocus(cell)} onClick={event => { if (event.detail === 0) select(cell) }}>
            {clue && <span className={styles.clue}><strong>{clue.area ?? '·'}</strong><span aria-hidden="true">{SHAPES[clue.shape]}</span></span>}
          </button>
        })}
      </div>)}
      <div aria-hidden="true" className={styles.regionLayer}>
        {rects.map((r, i) => <span key={i} className={styles.region} style={rectStyle(r)} />)}
        {draft && <span className={styles.draft} style={rectStyle(draft)}><b>{(draft[2] - draft[0] + 1) * (draft[3] - draft[1] + 1)}</b></span>}
        {highlight && <span className={styles.highlight} style={rectStyle(highlight)} />}
      </div>
    </div>
    <p className={styles.boardHelp}>{anchor === null ? t('drawHelp') : t('chooseCorner')}</p>
  </div>
})
