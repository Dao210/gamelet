'use client'

import { useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import InstrumentShell, { InstrumentButton, InstrumentResult } from './InstrumentShell'
import { useInstrumentProgress } from './useInstrumentProgress'
import { ECHO_FIXED_LEVELS, generateEchoLevel, getEchoHint, isEchoSolved } from '@/lib/impossible-instruments/echo-orchard'
import { dailySeed } from '@/lib/impossible-instruments/core'

const COLORS = ['#ffca5f', '#ef6f91', '#63d7c6', '#9d8cff']

export default function EchoOrchardGame() {
  const zh = useLocale() === 'zh'
  const [levelIndex, setLevelIndex] = useState(0)
  const [infiniteRound, setInfiniteRound] = useState(0)
  const level = useMemo(() => levelIndex < ECHO_FIXED_LEVELS.length ? ECHO_FIXED_LEVELS[levelIndex] : generateEchoLevel(`${dailySeed('echo-orchard')}:${infiniteRound}`, infiniteRound > 2 ? 'hard' : 'standard'), [levelIndex, infiniteRound])
  const [input, setInput] = useState<number[]>([])
  const [hints, setHints] = useState(0)
  const [score, setScore] = useState(0)
  const [solved, setSolved] = useState(false)
  const [error, setError] = useState(false)
  const { best, record } = useInstrumentProgress('echo-orchard')

  const complete = (candidate: number[], hintCount = hints) => {
    if (!isEchoSolved(candidate, level)) { setError(true); return false }
    const earned = Math.max(100, 500 - hintCount * 80)
    setScore((current) => current + earned); setSolved(true); setError(false); record(Math.min(levelIndex + 1, 6), score + earned)
    return true
  }

  const addFruit = (value: number) => {
    if (solved || input.length >= level.answer.length) return
    const next = [...input, value]
    setInput(next); setError(false)
    if (next.length === level.answer.length) {
      complete(next)
    }
  }
  const resetInput = () => { setInput([]); setError(false) }
  const hint = () => { const next = getEchoHint(input, level); if (next) { const candidate = [...input.slice(0, next.index), next.value]; const nextHints = hints + 1; setInput(candidate); setHints(nextHints); setError(false); if (candidate.length === level.answer.length) complete(candidate, nextHints) } }
  const next = () => { if (levelIndex < 5) setLevelIndex((value) => value + 1); else { setLevelIndex(6); setInfiniteRound((value) => value + 1) }; setInput([]); setHints(0); setSolved(false); setError(false) }

  const aside = <><div className="border border-white/15 bg-black/20 p-4"><p className="font-mono text-[9px] tracking-widest text-[var(--instrument-accent)]">{zh ? '变换线索' : 'TRANSFORMATION NOTE'}</p><p className="mt-3 text-sm leading-6 text-white/55">{level.label}</p></div><div className="border border-white/15 p-4"><p className="text-xs leading-6 text-white/45">{zh ? '观察种子序列如何改变自身，然后输入变换后的完整回声。颜色同时带有编号，避免只依赖色彩。' : 'Observe how the seed changes itself, then enter the complete transformed echo. Every color also carries a number.'}</p></div><div className="grid grid-cols-3 gap-2"><InstrumentButton onClick={resetInput}>{zh ? '清空' : 'Clear'}</InstrumentButton><InstrumentButton onClick={() => complete(input)} disabled={solved || input.length !== level.answer.length}>{zh ? '核验' : 'Check'}</InstrumentButton><InstrumentButton onClick={hint} disabled={solved}>{zh ? '干预' : 'Hint'}</InstrumentButton></div><div className="border border-white/10 p-3 font-mono text-xs text-white/45">BEST {best}</div>{solved && <InstrumentResult title={zh ? '果园回声稳定' : 'Orchard stabilized'} detail={`+${Math.max(100, 500 - hints * 80)}`} onNext={next} nextLabel={levelIndex < 5 ? (zh ? '下一记录' : 'Next record') : (zh ? '持续观测' : 'Infinite observation')} />}</>

  return <InstrumentShell id="echo-orchard" level={Math.min(levelIndex + 1, 6)} levelCount={6} score={score} hints={hints} aside={aside}><div className="text-center"><p className="font-mono text-[10px] tracking-[.2em] text-white/40">{zh ? '种子记忆' : 'SEED MEMORY'}</p><div className="mt-5 flex min-h-20 flex-wrap items-center justify-center gap-3">{level.source.map((value, index) => <span key={index} className="flex h-14 w-14 items-center justify-center rounded-full border-2 font-mono font-black text-[#17120d] shadow-[0_0_18px_currentColor]" style={{ backgroundColor: COLORS[value], borderColor: COLORS[value] }}>{value + 1}</span>)}</div><div className="my-7 font-serif text-3xl text-[var(--instrument-accent)]">↓ ? ↓</div><div className={`flex min-h-20 flex-wrap items-center justify-center gap-3 border p-3 ${error ? 'border-[#ef6f6f]' : 'border-white/10'}`}>{Array.from({ length: level.answer.length }, (_, index) => { const value = input[index]; return <span key={index} className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-white/20 font-mono font-black" style={value === undefined ? undefined : { backgroundColor: COLORS[value], color: '#17120d', borderColor: COLORS[value] }}>{value === undefined ? '·' : value + 1}</span> })}</div>{error && <p className="mt-3 text-sm text-[#ef8a8a]" aria-live="polite">{zh ? '回声发生失真，调整输入后重试。' : 'The echo distorted. Adjust the sequence and retry.'}</p>}<div className="mx-auto mt-7 grid max-w-sm grid-cols-4 gap-3">{COLORS.map((color, value) => <button key={color} type="button" onClick={() => addFruit(value)} disabled={solved} className="aspect-square min-h-12 rounded-full border-2 font-mono text-xl font-black text-[#17120d] transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-30" style={{ backgroundColor: color, borderColor: color }}>{value + 1}</button>)}</div></div></InstrumentShell>
}
