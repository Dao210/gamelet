'use client'

import { useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import InstrumentShell, { InstrumentButton, InstrumentResult } from './InstrumentShell'
import { useInstrumentProgress } from './useInstrumentProgress'
import { ALIBI_FIXED_LEVELS, generateAlibiLevel, getAlibiHint, isAlibiSolved, moveAlibiEvent, violatedAlibis } from '@/lib/impossible-instruments/clockwork-alibi'
import { dailySeed } from '@/lib/impossible-instruments/core'

export default function ClockworkAlibiGame() {
  const zh = useLocale() === 'zh'
  const [levelIndex, setLevelIndex] = useState(0)
  const [infiniteRound, setInfiniteRound] = useState(0)
  const level = useMemo(() => levelIndex < 6 ? ALIBI_FIXED_LEVELS[levelIndex] : generateAlibiLevel(`${dailySeed('clockwork-alibi')}:${infiniteRound}`, infiniteRound > 2 ? 'hard' : 'standard'), [levelIndex, infiniteRound])
  const [order, setOrder] = useState(level.initial)
  const [moves, setMoves] = useState(0)
  const [hints, setHints] = useState(0)
  const [score, setScore] = useState(0)
  const [solved, setSolved] = useState(false)
  const [hintIds, setHintIds] = useState<string[]>([])
  const { best, record } = useInstrumentProgress('clockwork-alibi')
  const events = new Map(level.events.map((event) => [event.id, event]))
  const violations = violatedAlibis(order, level)

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= order.length || solved) return
    const nextOrder = moveAlibiEvent(order, index, target)
    const nextMoves = moves + 1
    setOrder(nextOrder); setMoves(nextMoves); setHintIds([])
    if (isAlibiSolved(nextOrder, level)) {
      const earned = Math.max(150, 700 - nextMoves * 25 - hints * 80)
      setScore((current) => current + earned); setSolved(true); record(Math.min(levelIndex + 1, 6), score + earned)
    }
  }
  const hint = () => { const value = getAlibiHint(order, level); if (value) { setHintIds([value.eventId, value.beforeId]); setHints((current) => current + 1) } }
  const next = () => {
    const nextIndex = levelIndex < 5 ? levelIndex + 1 : 6
    const nextInfinite = levelIndex < 5 ? infiniteRound : infiniteRound + 1
    const nextLevel = nextIndex < 6 ? ALIBI_FIXED_LEVELS[nextIndex] : generateAlibiLevel(`${dailySeed('clockwork-alibi')}:${nextInfinite}`, nextInfinite > 2 ? 'hard' : 'standard')
    setLevelIndex(nextIndex); setInfiniteRound(nextInfinite); setOrder(nextLevel.initial); setMoves(0); setHints(0); setSolved(false); setHintIds([])
  }

  const aside = <><div className="border border-white/15 bg-black/20 p-4"><p className="font-mono text-[9px] tracking-widest text-[var(--instrument-accent)]">{zh ? '证词状态' : 'WITNESS STATUS'}</p><p className="mt-2 text-3xl font-mono font-black">{level.constraints.length - violations.length}/{level.constraints.length}</p><p className="mt-2 text-xs text-white/40">{zh ? '当前成立的证词' : 'statements currently true'}</p></div><div className="space-y-2">{level.constraints.map((constraint, index) => { const broken = violations.includes(constraint); return <div key={index} className={`border p-3 text-xs leading-5 ${broken ? 'border-[#d96969]/40 text-[#df8585]' : 'border-[#75c99b]/30 text-[#88cba8]'}`}>{broken ? '×' : '✓'} {constraint.label}</div> })}</div><InstrumentButton onClick={hint} disabled={solved}>{zh ? '标记矛盾事件' : 'Mark contradiction'}</InstrumentButton><div className="border border-white/10 p-3 font-mono text-xs text-white/45">MOVES {moves} · BEST {best}</div>{solved && <InstrumentResult title={zh ? '时间线稳定' : 'Timeline stabilized'} detail={`${moves} moves`} onNext={next} nextLabel={levelIndex < 5 ? (zh ? '下一记录' : 'Next record') : (zh ? '持续观测' : 'Infinite observation')} />}</>

  return <InstrumentShell id="clockwork-alibi" level={Math.min(levelIndex + 1, 6)} levelCount={6} score={score} hints={hints} aside={aside}><div><p className="font-mono text-[10px] tracking-[.2em] text-white/40">{zh ? '事件时间线 · 使用箭头移动' : 'EVENT TIMELINE · MOVE WITH ARROWS'}</p><ol className="relative mt-6 space-y-3 before:absolute before:bottom-5 before:left-7 before:top-5 before:w-px before:bg-[var(--instrument-accent)]/40">{order.map((id, index) => <li key={id} className={`relative grid min-h-16 grid-cols-[44px_1fr_88px] items-center border bg-[#17130f] transition ${hintIds.includes(id) ? 'animate-pulse border-[var(--instrument-accent)]' : 'border-white/15'}`}><span className="z-10 ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--instrument-accent)] font-mono text-xs font-black text-[#17120d]">{index + 1}</span><span className="px-2 text-sm font-bold">{events.get(id)?.label}</span><span className="grid h-full grid-cols-2"><button type="button" aria-label="Move earlier" onClick={() => move(index, -1)} disabled={index === 0 || solved} className="min-h-11 border-l border-white/10 text-lg hover:bg-white/5 disabled:opacity-15">↑</button><button type="button" aria-label="Move later" onClick={() => move(index, 1)} disabled={index === order.length - 1 || solved} className="min-h-11 border-l border-white/10 text-lg hover:bg-white/5 disabled:opacity-15">↓</button></span></li>)}</ol></div></InstrumentShell>
}
