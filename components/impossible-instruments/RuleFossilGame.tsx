'use client'

import { useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import InstrumentShell, { InstrumentButton, InstrumentResult } from './InstrumentShell'
import { useInstrumentProgress } from './useInstrumentProgress'
import { FOSSIL_RULES, RULE_FOSSIL_FIXED_LEVELS, evaluateFossil, generateRuleFossilLevel, type FossilColor, type FossilShape, type FossilSpecimen, type FossilRuleId } from '@/lib/impossible-instruments/rule-fossil'
import { dailySeed } from '@/lib/impossible-instruments/core'

const COLOR_HEX: Record<FossilColor, string> = { amber: '#e9b44c', blue: '#69a7d8', red: '#d86155' }
const SHAPE_GLYPH: Record<FossilShape, string> = { circle: '●', triangle: '▲', square: '■' }

export default function RuleFossilGame() {
  const zh = useLocale() === 'zh'
  const [levelIndex, setLevelIndex] = useState(0)
  const [infiniteRound, setInfiniteRound] = useState(0)
  const level = useMemo(() => levelIndex < 6 ? RULE_FOSSIL_FIXED_LEVELS[levelIndex] : generateRuleFossilLevel(`${dailySeed('rule-fossil')}:${infiniteRound}`, infiniteRound > 2 ? 'hard' : 'standard'), [levelIndex, infiniteRound])
  const [experiments, setExperiments] = useState(level.examples)
  const [sample, setSample] = useState<FossilSpecimen>({ color: 'amber', shape: 'circle', count: 1 })
  const [queries, setQueries] = useState(0)
  const [hints, setHints] = useState(0)
  const [score, setScore] = useState(0)
  const [solved, setSolved] = useState(false)
  const [wrongRule, setWrongRule] = useState<FossilRuleId | null>(null)
  const { best, record } = useInstrumentProgress('rule-fossil')

  const testSample = () => {
    if (solved || queries >= 6) return
    const accepted = evaluateFossil(level.ruleId, sample)
    setExperiments((current) => [...current, { ...sample, accepted }]); setQueries((current) => current + 1)
  }
  const submitRule = (id: FossilRuleId) => {
    if (solved) return
    if (id === level.ruleId) {
      const earned = Math.max(120, 600 - queries * 35 - hints * 90)
      setScore((current) => current + earned); setSolved(true); setWrongRule(null); record(Math.min(levelIndex + 1, 6), score + earned)
    } else setWrongRule(id)
  }
  const hint = () => {
    const discriminating = level.candidates.find((id) => id !== level.ruleId && !wrongRule)
    if (discriminating) setWrongRule(discriminating)
    setHints((value) => value + 1)
  }
  const next = () => {
    const nextIndex = levelIndex < 5 ? levelIndex + 1 : 6
    const nextInfinite = levelIndex < 5 ? infiniteRound : infiniteRound + 1
    const nextLevel = nextIndex < 6 ? RULE_FOSSIL_FIXED_LEVELS[nextIndex] : generateRuleFossilLevel(`${dailySeed('rule-fossil')}:${nextInfinite}`, nextInfinite > 2 ? 'hard' : 'standard')
    setLevelIndex(nextIndex); setInfiniteRound(nextInfinite); setExperiments(nextLevel.examples); setQueries(0); setHints(0); setSolved(false); setWrongRule(null)
  }

  const aside = <><div className="border border-white/15 bg-black/20 p-4"><p className="font-mono text-[9px] tracking-widest text-[var(--instrument-accent)]">{zh ? '主动实验' : 'ACTIVE EXPERIMENT'}</p><p className="mt-3 text-xs leading-6 text-white/45">{zh ? '组合一个标本并询问仪器。用最少查询排除错误假设。' : 'Build a specimen and ask the instrument. Eliminate false hypotheses with as few queries as possible.'}</p><div className="mt-4 space-y-3"><select aria-label="Color" value={sample.color} onChange={(event) => setSample({ ...sample, color: event.target.value as FossilColor })} className="min-h-11 w-full border border-white/20 bg-[#17130e] px-3 text-sm"><option value="amber">Amber</option><option value="blue">Blue</option><option value="red">Red</option></select><select aria-label="Shape" value={sample.shape} onChange={(event) => setSample({ ...sample, shape: event.target.value as FossilShape })} className="min-h-11 w-full border border-white/20 bg-[#17130e] px-3 text-sm"><option value="circle">Circle</option><option value="triangle">Triangle</option><option value="square">Square</option></select><input aria-label="Count" type="range" min="1" max="4" value={sample.count} onChange={(event) => setSample({ ...sample, count: Number(event.target.value) })} className="w-full accent-[var(--instrument-accent)]" /><div className="text-center text-3xl" style={{ color: COLOR_HEX[sample.color] }}>{SHAPE_GLYPH[sample.shape].repeat(sample.count)}</div><InstrumentButton onClick={testSample} disabled={queries >= 6 || solved}>{zh ? `询问仪器 ${queries}/6` : `Query instrument ${queries}/6`}</InstrumentButton></div></div><InstrumentButton onClick={hint} disabled={solved}>{zh ? '排除一个假设' : 'Eliminate hypothesis'}</InstrumentButton><div className="border border-white/10 p-3 font-mono text-xs text-white/45">BEST {best}</div>{solved && <InstrumentResult title={zh ? '隐藏规则已发掘' : 'Hidden law excavated'} detail={FOSSIL_RULES[level.ruleId].label} onNext={next} nextLabel={levelIndex < 5 ? (zh ? '下一记录' : 'Next record') : (zh ? '持续观测' : 'Infinite observation')} />}</>

  return <InstrumentShell id="rule-fossil" level={Math.min(levelIndex + 1, 6)} levelCount={6} score={score} hints={hints} aside={aside}><div><div className="flex items-center justify-between"><p className="font-mono text-[10px] tracking-[.2em] text-white/40">{zh ? '标本记录' : 'SPECIMEN RECORD'}</p><span className="text-xs text-white/35">{experiments.length} samples</span></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{experiments.map((item, index) => <div key={`${item.color}-${item.shape}-${item.count}-${index}`} className={`min-h-28 border p-3 text-center ${item.accepted ? 'border-[#78c99b]/60 bg-[#153023]' : 'border-[#d96969]/50 bg-[#321919]'}`}><div className="text-2xl" style={{ color: COLOR_HEX[item.color] }}>{SHAPE_GLYPH[item.shape].repeat(item.count)}</div><p className={`mt-3 font-mono text-[9px] font-black tracking-wider ${item.accepted ? 'text-[#78c99b]' : 'text-[#e07979]'}`}>{item.accepted ? 'ACCEPTED' : 'REJECTED'}</p></div>)}</div><div className="mt-7 border-t border-white/10 pt-6"><p className="mb-3 font-serif text-xl font-black">{zh ? '哪条规则埋藏在标本中？' : 'Which law is buried in the specimens?'}</p><div className="grid gap-2">{level.candidates.map((id) => <button key={id} type="button" onClick={() => submitRule(id)} disabled={solved || wrongRule === id} className={`min-h-12 border px-4 text-left text-sm transition ${wrongRule === id ? 'border-[#d96969]/40 text-white/20 line-through' : 'border-white/15 hover:border-[var(--instrument-accent)] hover:text-[var(--instrument-accent)]'}`}>{FOSSIL_RULES[id].label}</button>)}</div></div></div></InstrumentShell>
}
